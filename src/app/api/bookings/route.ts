import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      therapist_id, 
      session_type_id, 
      time_slot_id, 
      session_date, 
      session_time, 
      session_type, 
      total_amount,
      notes 
    } = body

    // Validate required fields
    if (!user_id || !therapist_id || !session_type_id || !time_slot_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if time slot is still available
    const { data: timeSlot, error: timeSlotError } = await supabase
      .from('time_slots')
      .select('is_available')
      .eq('id', time_slot_id)
      .single()

    if (timeSlotError || !timeSlot?.is_available) {
      return NextResponse.json(
        { error: 'Time slot is no longer available' },
        { status: 400 }
      )
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id,
        therapist_id,
        session_type_id,
        time_slot_id,
        session_date,
        session_time,
        session_type,
        total_amount,
        notes,
        status: 'confirmed',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking creation error:', bookingError)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    // The time slot availability will be updated automatically via database trigger

    return NextResponse.json({ 
      booking,
      message: 'Booking created successfully' 
    })

  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's bookings with therapist and session type details
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        therapists (
          full_name,
          specialization,
          profile_image_url
        ),
        session_types (
          name,
          duration_minutes
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get bookings error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ bookings })

  } catch (error) {
    console.error('Get bookings API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}