import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authClient } from '@/lib/auth-client'
import { createServiceClient } from '@/lib/supabase/server'

// GET /api/supabase/profiles - Get all public profiles or search
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const domain = searchParams.get('domain')

    let query = supabase
      .from('profiles')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (search) {
      query = query.ilike('username', `%${search}%`)
    }

    if (domain) {
      query = query.contains('domains', [domain])
    }

    const { data, error } = await query

    if (error) {
      console.error('Profiles fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Profiles API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/supabase/profiles - Create or update profile
export async function POST(request: NextRequest) {
  try {
    const session = await authClient.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { username, avatar_url, bio, domains, is_public } = body

    const supabase = createServiceClient()

    // Check if profile exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (existing) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: username || existing.username,
          avatar_url: avatar_url !== undefined ? avatar_url : existing.avatar_url,
          bio: bio !== undefined ? bio : existing.bio,
          domains: domains || existing.domains,
          is_public: is_public !== undefined ? is_public : existing.is_public,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: session.user.id,
          username: username || `user_${Date.now()}`,
          avatar_url,
          bio,
          domains: domains || [],
          is_public: is_public !== undefined ? is_public : true,
          level: 1
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data, { status: 201 })
    }
  } catch (error: any) {
    console.error('Profile create/update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
