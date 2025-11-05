import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authClient } from '@/lib/auth-client'
import { createServiceClient } from '@/lib/supabase/server'

// GET /api/supabase/matches/[id] - Get match by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await authClient.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    const { data, error } = await supabase
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
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    // Verify user is participant
    if (data.created_by !== profile.id && data.invited_id !== profile.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/supabase/matches/[id] - Update match (accept, finish, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await authClient.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, winner_id } = body

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

    // Get match
    const { data: match } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single()

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    // Verify user is participant
    if (match.created_by !== profile.id && match.invited_id !== profile.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updates: any = {}
    
    if (status) {
      updates.status = status
      if (status === 'active' && !match.started_at) {
        updates.started_at = new Date().toISOString()
      }
      if (status === 'finished' && !match.finished_at) {
        updates.finished_at = new Date().toISOString()
      }
    }

    if (winner_id) {
      updates.winner_id = winner_id
      updates.status = 'finished'
      updates.finished_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', id)
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
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
