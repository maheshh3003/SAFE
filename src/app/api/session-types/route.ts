import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    // Get all session types
    const { data: sessionTypes, error } = await supabase
      .from('session_types')
      .select('*')
      .order('name')

    if (error) {
      console.error('Get session types error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch session types' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sessionTypes })

  } catch (error) {
    console.error('Get session types API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}