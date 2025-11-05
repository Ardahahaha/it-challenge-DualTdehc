import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/supabase/rooms - Get all public rooms
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_public', true)
      .order('slug', { ascending: true })

    if (error) {
      console.error('Rooms fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Rooms API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
