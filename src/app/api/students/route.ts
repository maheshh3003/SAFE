import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

// GET /api/students - Get students for a university
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const universityId = searchParams.get('universityId')
    const search = searchParams.get('search')
    const riskLevel = searchParams.get('riskLevel')

    if (!universityId) {
      return NextResponse.json(
        { error: 'University ID is required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('profiles')
      .select('*')
      .eq('university_id', universityId)
      .eq('user_type', 'student')

    // Add search filter
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,student_id.ilike.%${search}%`)
    }

    // Add risk level filter
    if (riskLevel) {
      query = query.eq('risk_level', riskLevel)
    }

    query = query.order('created_at', { ascending: false })

    const { data: students, error } = await query

    if (error) {
      console.error('Get students error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch students' },
        { status: 500 }
      )
    }

    return NextResponse.json({ students })

  } catch (error) {
    console.error('Get students API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/students - Create new student account
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      fullName,
      email,
      password,
      studentId,
      program,
      academicYear,
      universityId
    } = body

    // Validate required fields
    if (!fullName || !email || !password || !studentId || !universityId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if student with this email or student ID already exists
    const { data: existingStudent } = await supabase
      .from('profiles')
      .select('id')
      .or(`email.eq.${email},student_id.eq.${studentId}`)
      .single()

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student with this email or student ID already exists' },
        { status: 400 }
      )
    }

    // Create auth user first
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
        user_type: 'student',
        university_id: universityId,
        student_id: studentId,
        program,
        academic_year: academicYear,
        created_by_admin: true
      }
    })

    if (authError) {
      console.error('Create auth user error:', authError)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email,
        full_name: fullName,
        user_type: 'student',
        university_id: universityId,
        student_id: studentId,
        program,
        academic_year: academicYear,
        wellness_score: 0.0,
        risk_level: 'low'
      })
      .select()
      .single()

    if (profileError) {
      console.error('Create profile error:', profileError)
      // If profile creation fails, we should delete the auth user
      await supabase.auth.admin.deleteUser(authUser.user.id)
      return NextResponse.json(
        { error: 'Failed to create student profile' },
        { status: 500 }
      )
    }

    // Update university student count
    const { error: updateError } = await supabase.rpc('increment_student_count', {
      university_id: universityId
    })

    if (updateError) {
      console.warn('Failed to update university student count:', updateError)
    }

    return NextResponse.json({ 
      student: profile,
      message: 'Student account created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create student API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/students - Update student information
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }

    const { data: student, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .eq('user_type', 'student')
      .select()
      .single()

    if (error) {
      console.error('Update student error:', error)
      return NextResponse.json(
        { error: 'Failed to update student' },
        { status: 500 }
      )
    }

    return NextResponse.json({ student })

  } catch (error) {
    console.error('Update student API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/students - Delete student account
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('id')
    const universityId = searchParams.get('universityId')

    if (!studentId || !universityId) {
      return NextResponse.json(
        { error: 'Student ID and University ID are required' },
        { status: 400 }
      )
    }

    // Delete auth user (this will cascade delete the profile due to foreign key constraint)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(studentId)

    if (deleteError) {
      console.error('Delete student error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete student account' },
        { status: 500 }
      )
    }

    // Update university student count
    const { error: updateError } = await supabase.rpc('decrement_student_count', {
      university_id: universityId
    })

    if (updateError) {
      console.warn('Failed to update university student count:', updateError)
    }

    return NextResponse.json({ 
      message: 'Student account deleted successfully' 
    })

  } catch (error) {
    console.error('Delete student API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}