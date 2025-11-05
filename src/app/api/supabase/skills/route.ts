import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/supabase/skills - Get all skills
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const domain = searchParams.get('domain')

    const supabase = await createClient()

    let query = supabase
      .from('skills')
      .select('*')
      .order('domain', { ascending: true })
      .order('label', { ascending: true })

    if (domain) {
      query = query.eq('domain', domain)
    }

    const { data, error } = await query

    if (error) {
      console.error('Skills fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Skills API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
