import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

// GET /api/universities - Get all universities or university by domain
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    const adminId = searchParams.get('adminId')

    let query = supabase.from('universities').select('*')

    if (domain) {
      query = query.eq('domain', domain)
    }
    
    if (adminId) {
      query = query.eq('admin_user_id', adminId)
    }

    const { data: universities, error } = await query

    if (error) {
      console.error('Get universities error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch universities' },
        { status: 500 }
      )
    }

    return NextResponse.json({ universities })

  } catch (error) {
    console.error('Get universities API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/universities - Create new university
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      domain,
      address,
      contactEmail,
      contactPhone,
      adminUserId,
      adminName,
      adminTitle,
      studentLimit = 1000
    } = body

    // Validate required fields
    if (!name || !domain || !address || !contactEmail || !adminUserId || !adminName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if domain already exists
    const { data: existingUniversity } = await supabase
      .from('universities')
      .select('id')
      .eq('domain', domain)
      .single()

    if (existingUniversity) {
      return NextResponse.json(
        { error: 'University with this domain already exists' },
        { status: 400 }
      )
    }

    // Create university
    const { data: university, error } = await supabase
      .from('universities')
      .insert({
        name,
        domain,
        address,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        admin_user_id: adminUserId,
        admin_name: adminName,
        admin_title: adminTitle,
        student_limit: studentLimit,
        current_student_count: 0,
        is_verified: false,
        subscription_status: 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('Create university error:', error)
      return NextResponse.json(
        { error: 'Failed to create university' },
        { status: 500 }
      )
    }

    return NextResponse.json({ university }, { status: 201 })

  } catch (error) {
    console.error('Create university API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/universities - Update university
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'University ID is required' },
        { status: 400 }
      )
    }

    const { data: university, error } = await supabase
      .from('universities')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update university error:', error)
      return NextResponse.json(
        { error: 'Failed to update university' },
        { status: 500 }
      )
    }

    return NextResponse.json({ university })

  } catch (error) {
    console.error('Update university API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}