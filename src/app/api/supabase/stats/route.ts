import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authClient } from '@/lib/auth-client'
import { createServiceClient } from '@/lib/supabase/server'

// GET /api/supabase/stats - Get user's dashboard stats
export async function GET(request: NextRequest) {
  try {
    const session = await authClient.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceClient()
    
    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, level')
      .eq('user_id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get match stats
    const { data: matches } = await supabase
      .from('matches')
      .select('status, winner_id')
      .or(`created_by.eq.${profile.id},invited_id.eq.${profile.id}`)

    const totalMatches = matches?.length || 0
    const wins = matches?.filter(m => m.winner_id === profile.id).length || 0
    const losses = matches?.filter(m => m.status === 'finished' && m.winner_id && m.winner_id !== profile.id).length || 0
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0

    // Get total XP
    const { data: xpLogs } = await supabase
      .from('xp_logs')
      .select('delta')
      .eq('user_id', profile.id)

    const totalXP = xpLogs?.reduce((sum, log) => sum + log.delta, 0) || 0

    // Get XP by domain
    const { data: xpByDomain } = await supabase
      .from('xp_logs')
      .select('domain, delta')
      .eq('user_id', profile.id)

    const xpBreakdown: Record<string, number> = {}
    xpByDomain?.forEach(log => {
      xpBreakdown[log.domain] = (xpBreakdown[log.domain] || 0) + log.delta
    })

    // Get active matches
    const { data: activeMatches } = await supabase
      .from('matches')
      .select('id')
      .eq('status', 'active')
      .or(`created_by.eq.${profile.id},invited_id.eq.${profile.id}`)

    return NextResponse.json({
      profile: {
        id: profile.id,
        level: profile.level
      },
      matches: {
        total: totalMatches,
        wins,
        losses,
        draws: totalMatches - wins - losses,
        winRate,
        active: activeMatches?.length || 0
      },
      xp: {
        total: totalXP,
        byDomain: xpBreakdown
      }
    })
  } catch (error: any) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
