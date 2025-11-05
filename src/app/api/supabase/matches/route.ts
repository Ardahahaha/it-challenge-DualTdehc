import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authClient } from '@/lib/auth-client'
import { createServiceClient } from '@/lib/supabase/server'
import { MatchCreateSchema, formatZodError } from '@/lib/validation/schemas'
import { withRateLimit, RateLimitPresets, getUserIdFromRequest } from '@/lib/rate-limit'
import { logger, recordLatency } from '@/lib/observability/logger'

// GET /api/supabase/matches - Get user's matches
export async function GET(request: NextRequest) {
  const endTimer = logger.startTimer()
  
  try {
    const session = await authClient.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const supabase = createServiceClient()
    
    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    let query = supabase
      .from('matches')
      .select(`
        *,
        creator:created_by (
          id,
          username,
          avatar_url,
          level
        ),
        invited:invited_id (
          id,
          username,
          avatar_url,
          level
        ),
        winner:winner_id (
          id,
          username
        )
      `)
      .or(`created_by.eq.${profile.id},invited_id.eq.${profile.id}`)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    const latency = endTimer()
    recordLatency('/api/supabase/matches', latency)
    
    logger.info(
      { route: '/api/supabase/matches', action: 'fetch', method: 'GET', user_id: session.user.id },
      { ok: true, latency_ms: latency, rows_affected: data?.length || 0 }
    )

    return NextResponse.json(data)
  } catch (error: any) {
    const latency = endTimer()
    logger.error(
      { route: '/api/supabase/matches', action: 'fetch', method: 'GET' },
      { ok: false, latency_ms: latency, error: error.message }
    )
    
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/supabase/matches - Create a match
export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    {
      ...RateLimitPresets.MATCH_CREATE,
      keyGenerator: async (req) => {
        const userId = await getUserIdFromRequest(req)
        return `match-create-${userId}`
      },
    },
    async () => {
      const endTimer = logger.startTimer()
      
      try {
        const session = await authClient.getSession()
        if (!session?.user) {
          throw new Error('Unauthorized')
        }

        const body = await request.json()
        
        // Validate input
        const validated = MatchCreateSchema.parse(body)

        const supabase = createServiceClient()
        
        // Get creator's profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .single()

        if (!profile) {
          throw new Error('Profile not found')
        }

        // Create match
        const { data: match, error } = await supabase
          .from('matches')
          .insert({
            created_by: profile.id,
            invited_id: validated.invited_id,
            mode: validated.mode,
            status: 'pending'
          })
          .select(`
            *,
            creator:created_by (
              id,
              username,
              avatar_url,
              level
            ),
            invited:invited_id (
              id,
              username,
              avatar_url,
              level
            )
          `)
          .single()

        if (error) {
          throw error
        }

        // Create history entry
        await supabase.rpc('fn_write_history', {
          p_user_id: profile.id,
          p_kind: 'match',
          p_ref_id: match.id
        })

        const latency = endTimer()
        recordLatency('/api/supabase/matches', latency)
        
        logger.info(
          { 
            route: '/api/supabase/matches', 
            action: 'create', 
            method: 'POST', 
            user_id: session.user.id 
          },
          { ok: true, latency_ms: latency, rows_affected: 1 }
        )

        return NextResponse.json(match, { status: 201 })
      } catch (error: any) {
        const latency = endTimer()
        
        if (error.name === 'ZodError') {
          logger.warn(
            { route: '/api/supabase/matches', action: 'validate', method: 'POST' },
            { ok: false, latency_ms: latency, error: 'Validation failed' }
          )
          
          return NextResponse.json(formatZodError(error), { status: 400 })
        }
        
        logger.error(
          { route: '/api/supabase/matches', action: 'create', method: 'POST' },
          { ok: false, latency_ms: latency, error: error.message }
        )
        
        return NextResponse.json(
          { error: error.message }, 
          { status: error.message === 'Unauthorized' ? 401 : 500 }
        )
      }
    }
  )
}