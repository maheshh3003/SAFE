import { NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/supabase'

// GET /api/university/dashboard - Get university dashboard statistics
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const universityId = searchParams.get('universityId')

    if (!universityId) {
      return NextResponse.json(
        { error: 'University ID is required' },
        { status: 400 }
      )
    }

    // Get basic university info
    const { data: university, error: uniError } = await supabase
      .from('universities')
      .select('*')
      .eq('id', universityId)
      .single()

    if (uniError) {
      console.error('Get university error:', uniError)
      return NextResponse.json(
        { error: 'Failed to fetch university data' },
        { status: 500 }
      )
    }

    // Get student statistics
    const { data: students, error: studentsError } = await supabase
      .from('profiles')
      .select('id, wellness_score, risk_level, last_wellness_check, created_at')
      .eq('university_id', universityId)
      .eq('user_type', 'student')

    if (studentsError) {
      console.error('Get students error:', studentsError)
      return NextResponse.json(
        { error: 'Failed to fetch student data' },
        { status: 500 }
      )
    }

    // Get booking statistics for university students
    const studentIds = students.map(s => s.id)
    let completedSessions = 0
    let activeUsers = 0

    if (studentIds.length > 0) {
      // Get completed sessions count
      const { count: sessionsCount, error: sessionsError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .in('user_id', studentIds)
        .eq('status', 'completed')

      if (!sessionsError) {
        completedSessions = sessionsCount || 0
      }

      // Count active users (users who logged in in last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      activeUsers = students.filter(student => {
        return student.last_wellness_check && 
               new Date(student.last_wellness_check) > thirtyDaysAgo
      }).length
    }

    // Calculate statistics
    const totalStudents = students.length
    const averageWellnessScore = totalStudents > 0 
      ? students.reduce((sum, s) => sum + (s.wellness_score || 0), 0) / totalStudents
      : 0

    // Count risk levels
    const riskCounts = {
      low: students.filter(s => s.risk_level === 'low').length,
      medium: students.filter(s => s.risk_level === 'medium').length,
      high: students.filter(s => s.risk_level === 'high').length,
      critical: students.filter(s => s.risk_level === 'critical').length
    }

    const criticalAlerts = riskCounts.critical + riskCounts.high

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentRegistrations = students.filter(student => 
      new Date(student.created_at) > sevenDaysAgo
    ).length

    const dashboardData = {
      university,
      statistics: {
        totalStudents,
        activeUsers,
        completedSessions,
        averageWellnessScore: Math.round(averageWellnessScore * 10) / 10,
        criticalAlerts,
        recentRegistrations,
        riskDistribution: riskCounts,
        utilizationRate: totalStudents > 0 ? Math.round((activeUsers / totalStudents) * 100) : 0
      },
      recentActivity: {
        newStudentsThisWeek: recentRegistrations,
        studentsNeedingAttention: students.filter(s => 
          s.risk_level === 'high' || s.risk_level === 'critical'
        ).length
      }
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('University dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
