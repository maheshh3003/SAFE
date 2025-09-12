import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

// Types for better TypeScript support
interface TimeSlot {
  id: string
  date: string
  start_time: string
  end_time: string
  is_available: boolean
}

interface Therapist {
  id: string
  full_name: string
  email: string
  phone: string
  specialization: string[]
  experience_years: number
  education: string
  license_number: string
  bio: string
  profile_image_url: string
  gender: string
  languages: string[]
  rating: number
  total_reviews: number
  consultation_fee: number
  available_days: string[]
  available_time_start: string
  available_time_end: string
  is_active: boolean
  created_at: string
  updated_at: string
  available_slots?: TimeSlot[]
}

interface TherapistWithTimeSlots extends Therapist {
  time_slots: TimeSlot
}

export async function GET(request: Request) {
  try {
    // Get all active therapists
    const { data: therapists, error: therapistsError } = await supabase
      .from('therapists')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false })

    if (therapistsError) {
      console.error('Get therapists error:', therapistsError)
      return NextResponse.json(
        { error: 'Failed to fetch therapists' },
        { status: 500 }
      )
    }

    if (!therapists || therapists.length === 0) {
      return NextResponse.json({ therapists: [] })
    }

    // Get available time slots for all therapists
    const therapistIds = therapists.map(t => t.id)
    const today = new Date().toISOString().split('T')[0]

    const { data: timeSlots, error: timeSlotsError } = await supabase
      .from('time_slots')
      .select('*')
      .in('therapist_id', therapistIds)
      .eq('is_available', true)
      .gte('date', today)
      .order('date')
      .order('start_time')

    if (timeSlotsError) {
      console.error('Get time slots error:', timeSlotsError)
      return NextResponse.json(
        { error: 'Failed to fetch time slots' },
        { status: 500 }
      )
    }

    // Group time slots by therapist
    const therapistSlotsMap = new Map<string, TimeSlot[]>()
    if (timeSlots) {
      timeSlots.forEach(slot => {
        const therapistId = slot.therapist_id
        if (!therapistSlotsMap.has(therapistId)) {
          therapistSlotsMap.set(therapistId, [])
        }
        therapistSlotsMap.get(therapistId)!.push({
          id: slot.id,
          date: slot.date,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_available: slot.is_available
        })
      })
    }

    // Add available slots to each therapist
    const formattedTherapists: Therapist[] = therapists.map(therapist => ({
      ...therapist,
      available_slots: therapistSlotsMap.get(therapist.id) || []
    }))

    return NextResponse.json({ therapists: formattedTherapists })

  } catch (error) {
    console.error('Get therapists API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}