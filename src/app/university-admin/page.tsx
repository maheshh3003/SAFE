'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

interface Student {
  id: string
  full_name: string
  email: string
  student_id: string
  program: string
  academic_year: string
  wellness_score: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  last_wellness_check: string | null
  created_at: string
}

interface UniversityStats {
  totalStudents: number
  activeUsers: number
  completedSessions: number
  averageWellnessScore: number
  criticalAlerts: number
  recentRegistrations: number
  utilizationRate: number
  riskDistribution: {
    low: number
    medium: number
    high: number
    critical: number
  }
}

export default function UniversityAdminPanel() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Real data states
  const [universityStats, setUniversityStats] = useState<UniversityStats | null>(null)
  const [studentData, setStudentData] = useState<Student[]>([])
  const [universityId, setUniversityId] = useState<string | null>(null)

  // API functions
  const fetchDashboardData = useCallback(async () => {
    if (!universityId) {
      console.warn('No university ID available, skipping data fetch')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      console.log('Fetching dashboard data for university:', universityId)
      
      // Fetch dashboard statistics
      const statsResponse = await fetch(`/api/university/dashboard?universityId=${universityId}`)
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setUniversityStats(statsData.statistics)
      } else {
        console.error('Failed to fetch stats:', statsResponse.status)
      }

      // Fetch students list
      const studentsResponse = await fetch(`/api/students?universityId=${universityId}&search=${searchTerm}`)
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json()
        setStudentData(studentsData.students || [])
      } else {
        console.error('Failed to fetch students:', studentsResponse.status)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [universityId, searchTerm])

  const createStudent = async (studentData: any) => {
    if (!universityId) return

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...studentData,
          universityId
        }),
      })

      if (response.ok) {
        // Refresh dashboard data to show updated counts and student list
        await fetchDashboardData()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to create student:', error)
      return false
    }
  }

  const deleteStudent = async (studentId: string) => {
    if (!universityId) return false

    try {
      const response = await fetch(`/api/students?id=${studentId}&universityId=${universityId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Refresh dashboard data to show updated counts and student list
        await fetchDashboardData()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to delete student:', error)
      return false
    }
  }

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (confirm(`Are you sure you want to delete ${studentName}'s account? This action cannot be undone.`)) {
      const success = await deleteStudent(studentId)
      if (!success) {
        alert('Failed to delete student account. Please try again.')
      }
    }
  }

  const handleViewStudent = (student: Student) => {
    alert(`Student Details:
    Name: ${student.full_name}
    Email: ${student.email}
    Student ID: ${student.student_id}
    Program: ${student.program}
    Year: ${student.academic_year}
    Wellness Score: ${student.wellness_score}/10
    Risk Level: ${student.risk_level}
    Last Check: ${student.last_wellness_check ? new Date(student.last_wellness_check).toLocaleDateString() : 'Never'}`)
  }

  const handleEditStudent = (student: Student) => {
    alert(`Edit functionality for ${student.full_name} will be implemented in a future update.`)
  }

  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to home')
      router.push('/')
      return
    }
    
    // Extract university ID from user metadata
    if (user) {
      console.log('User data:', user)
      console.log('User metadata:', user.user_metadata)
      
      if (user.user_metadata?.university_id) {
        console.log('Setting university ID:', user.user_metadata.university_id)
        setUniversityId(user.user_metadata.university_id)
      } else {
        console.warn('No university_id in user metadata. Setting up demo mode.')
        // Automatically set up demo mode for university admins without proper config
        setUniversityId('demo-university-123')
        // Set some demo stats immediately
        setUniversityStats({
          totalStudents: 1247,
          activeUsers: 892,
          completedSessions: 3456,
          averageWellnessScore: 7.2,
          criticalAlerts: 3,
          recentRegistrations: 24,
          utilizationRate: 71.6,
          riskDistribution: {
            low: 650,
            medium: 420,
            high: 150,
            critical: 27
          }
        })
        // Add some demo student data
        setStudentData([
          {
            id: '1',
            full_name: 'Emma Johnson',
            email: 'emma.johnson@university.edu',
            student_id: 'STU001234',
            program: 'Computer Science',
            academic_year: 'Junior',
            wellness_score: 8,
            risk_level: 'low' as const,
            last_wellness_check: '2024-09-15',
            created_at: '2024-08-20'
          },
          {
            id: '2',
            full_name: 'Michael Chen',
            email: 'michael.chen@university.edu',
            student_id: 'STU001235',
            program: 'Psychology',
            academic_year: 'Senior',
            wellness_score: 5,
            risk_level: 'medium' as const,
            last_wellness_check: '2024-09-10',
            created_at: '2024-08-18'
          },
          {
            id: '3',
            full_name: 'Sarah Williams',
            email: 'sarah.williams@university.edu',
            student_id: 'STU001236',
            program: 'Business Administration',
            academic_year: 'Sophomore',
            wellness_score: 3,
            risk_level: 'high' as const,
            last_wellness_check: '2024-09-12',
            created_at: '2024-08-22'
          }
        ])
        setIsLoading(false)
      }
    }
  }, [user, loading, router])

  // Fetch data when universityId changes
  useEffect(() => {
    if (universityId) {
      fetchDashboardData()
    }
  }, [universityId, fetchDashboardData])

  // Debounced search
  useEffect(() => {
    if (universityId) {
      const timeoutId = setTimeout(() => {
        fetchDashboardData()
      }, 500)
      
      return () => clearTimeout(timeoutId)
    }
  }, [searchTerm, fetchDashboardData, universityId])

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-beige-50">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-sage-300 border-t-sage-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sage-600">Loading university dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Show setup message if no university ID is properly configured
  if (!universityId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-beige-50 to-sage-100">
        <Navigation />
        
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 border border-white/30"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AcademicCapIcon className="w-8 h-8 text-yellow-600" />
              </div>
              
              <h1 className="text-3xl font-plus-jakarta font-bold text-sage-800 mb-4">
                Setting up University Dashboard...
              </h1>
              
              <div className="w-8 h-8 border-3 border-sage-300 border-t-sage-600 rounded-full animate-spin mx-auto"></div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'students', label: 'Students', icon: UserGroupIcon },
    { id: 'reports', label: 'Reports', icon: DocumentTextIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon }
  ]

  const CreateStudentModal = () => {
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      studentId: '',
      program: '',
      year: '',
      password: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      const success = await createStudent({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId,
        program: formData.program,
        academicYear: formData.year
      })

      if (success) {
        setShowCreateStudentModal(false)
        setFormData({
          fullName: '',
          email: '',
          studentId: '',
          program: '',
          year: '',
          password: ''
        })
      } else {
        alert('Failed to create student account. Please try again.')
      }
    }

    return (
      <AnimatePresence>
        {showCreateStudentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateStudentModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-sage-800">Create Student Account</h3>
                <button
                  onClick={() => setShowCreateStudentModal(false)}
                  className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-sage-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sage-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sage-700 font-medium mb-2">University Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="student@university.edu"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sage-700 font-medium mb-2">Student ID</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      value={formData.studentId}
                      onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sage-700 font-medium mb-2">Year</label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    >
                      <option value="">Select</option>
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sage-700 font-medium mb-2">Program/Major</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    value={formData.program}
                    onChange={(e) => setFormData(prev => ({ ...prev, program: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sage-700 font-medium mb-2">Initial Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  />
                  <p className="text-xs text-sage-500 mt-1">Student will be asked to change this on first login</p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateStudentModal(false)}
                    className="flex-1 px-4 py-3 border border-sage-300 text-sage-700 font-medium rounded-xl hover:bg-sage-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white font-medium rounded-xl hover:from-sage-600 hover:to-sage-700 transition-colors"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-beige-50 to-sage-100">
      <Navigation />
      <CreateStudentModal />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-plus-jakarta font-bold text-sage-800">
                  University Admin Panel
                </h1>
                <p className="text-sage-600 mt-2">
                  {user.user_metadata?.university_name || 'University Name'} Mental Health Dashboard
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-3 bg-white/70 hover:bg-white/90 border border-white/30 rounded-xl transition-colors">
                  <BellIcon className="w-5 h-5 text-sage-600" />
                </button>
                
                <button
                  onClick={() => setShowCreateStudentModal(true)}
                  className="flex items-center px-4 py-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white font-medium rounded-xl hover:from-sage-600 hover:to-sage-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Student
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sage-600 text-sm font-medium">Total Students</p>
                  <p className="text-2xl font-bold text-sage-800">
                    {universityStats?.totalStudents?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sage-600 text-sm font-medium">Active Users</p>
                  <p className="text-2xl font-bold text-sage-800">
                    {universityStats?.activeUsers?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sage-600 text-sm font-medium">Sessions Completed</p>
                  <p className="text-2xl font-bold text-sage-800">
                    {universityStats?.completedSessions?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sage-600 text-sm font-medium">Critical Alerts</p>
                  <p className="text-2xl font-bold text-red-600">
                    {universityStats?.criticalAlerts || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 border border-white/30 inline-flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-sage-500 to-sage-600 text-white shadow-soft'
                      : 'text-sage-600 hover:text-sage-800 hover:bg-sage-50/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content based on active tab */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {activeTab === 'students' && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden">
                {/* Students Header */}
                <div className="p-6 border-b border-sage-200/30">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-sage-800">Student Management</h2>
                    
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                        <input
                          type="text"
                          placeholder="Search students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 bg-sage-50/50 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                        />
                      </div>
                      
                      <button className="flex items-center px-4 py-2 text-sage-600 border border-sage-300 rounded-lg hover:bg-sage-50 transition-colors">
                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>

                {/* Students Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-sage-50/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-sage-600">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-sage-600">Student</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-sage-600">Program</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-sage-600">Wellness Score</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-sage-600">Risk Level</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-sage-600">Sessions</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-sage-600">Last Active</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-sage-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sage-200/30">
                      {studentData.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center">
                            <div className="text-sage-500">
                              <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-sage-300" />
                              <p className="text-lg font-medium mb-2">No students found</p>
                              <p className="text-sm">
                                {searchTerm 
                                  ? `No students match "${searchTerm}". Try adjusting your search.`
                                  : 'Start by adding your first student account.'
                                }
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        studentData.map((student) => (
                          <tr key={student.id} className="hover:bg-sage-50/30 transition-colors">
                            <td className="px-6 py-4">
                              <input type="checkbox" className="rounded" />
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-sage-800">{student.full_name}</div>
                                <div className="text-sm text-sage-500">{student.email}</div>
                                <div className="text-xs text-sage-400">ID: {student.student_id}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sage-800">{student.program}</div>
                              <div className="text-sm text-sage-500">{student.academic_year}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="text-lg font-semibold text-sage-800">{student.wellness_score}</div>
                                <div className="ml-2 text-sm text-sage-500">/10</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(student.risk_level)}`}>
                                {student.risk_level.charAt(0).toUpperCase() + student.risk_level.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sage-800">0</td>
                            <td className="px-6 py-4 text-sm text-sage-500">
                              {student.last_wellness_check 
                                ? new Date(student.last_wellness_check).toLocaleDateString()
                                : 'Never'
                              }
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleViewStudent(student)}
                                  className="p-2 text-sage-600 hover:bg-sage-100 rounded-lg transition-colors"
                                  title="View Student Details"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleEditStudent(student)}
                                  className="p-2 text-sage-600 hover:bg-sage-100 rounded-lg transition-colors"
                                  title="Edit Student"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteStudent(student.id, student.full_name)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  title="Delete Student"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Other tab content will be added here */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                  <h2 className="text-xl font-semibold text-sage-800 mb-4">University Overview</h2>
                  <p className="text-sage-600">
                    Welcome to your university's mental health dashboard. Here you can monitor student wellness, 
                    manage accounts, and access comprehensive reports on your institution's mental health initiatives.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}