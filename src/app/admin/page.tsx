'use client'

import { motion } from 'framer-motion'
import { 
  ChartBarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

const stats = [
  {
    name: 'Total Users',
    value: '2,847',
    change: '+12%',
    trend: 'up',
    icon: UserGroupIcon
  },
  {
    name: 'Active Sessions',
    value: '156',
    change: '+8%',
    trend: 'up',
    icon: ChatBubbleLeftRightIcon
  },
  {
    name: 'Scheduled Appointments',
    value: '89',
    change: '+15%',
    trend: 'up',
    icon: CalendarDaysIcon
  },
  {
    name: 'User Satisfaction',
    value: '98.5%',
    change: '+2%',
    trend: 'up',
    icon: HeartIcon
  }
]

const recentActivity = [
  {
    id: '1',
    type: 'booking',
    description: 'New therapy session booked with Dr. Sarah Chen',
    timestamp: '5 minutes ago',
    status: 'success'
  },
  {
    id: '2', 
    type: 'chat',
    description: 'Crisis support chat session completed',
    timestamp: '12 minutes ago',
    status: 'success'
  },
  {
    id: '3',
    type: 'user',
    description: 'New user registration - Anonymous User',
    timestamp: '18 minutes ago',
    status: 'info'
  },
  {
    id: '4',
    type: 'alert',
    description: 'Flagged community post requires review',
    timestamp: '25 minutes ago',
    status: 'warning'
  }
]

const therapistStats = [
  {
    name: 'Dr. Sarah Chen',
    specialty: 'Anxiety & Depression',
    sessions: 45,
    rating: 4.9,
    availability: 'Available'
  },
  {
    name: 'Dr. Michael Rodriguez',
    specialty: 'Trauma & PTSD',
    sessions: 38,
    rating: 4.8,
    availability: 'In Session'
  },
  {
    name: 'Dr. Emily Johnson',
    specialty: 'Relationships',
    sessions: 52,
    rating: 4.9,
    availability: 'Available'
  }
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-plus-jakarta font-bold text-sage-800">
                  Admin Dashboard
                </h1>
                <p className="text-sage-600 mt-3 text-lg font-dm-sans leading-relaxed">
                  Monitor platform health, user activity, and system performance
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  className="p-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl text-sage-600 hover:bg-white/80 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BellIcon className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Generate Report
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sage-600 text-base font-medium font-dm-sans">{stat.name}</p>
                    <p className="text-2xl font-bold text-sage-800 mt-3 font-plus-jakarta">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-sage-300 to-sage-500 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="mt-4 flex items-center">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                  <span className="text-sage-500 text-sm ml-2">vs last month</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-xl font-plus-jakarta font-semibold text-sage-800 mb-8">
                  Recent Activity
                </h2>
                
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center p-4 bg-white/40 rounded-xl">
                      <div className={`w-3 h-3 rounded-full mr-4 ${
                        activity.status === 'success' ? 'bg-green-400' :
                        activity.status === 'warning' ? 'bg-yellow-400' :
                        'bg-blue-400'
                      }`} />
                      
                      <div className="flex-1">
                        <p className="text-sage-800 text-base font-dm-sans leading-relaxed">{activity.description}</p>
                        <p className="text-sage-500 text-sm mt-2 font-dm-sans">{activity.timestamp}</p>
                      </div>
                      
                      {activity.status === 'warning' && (
                        <button className="btn-secondary text-xs px-3 py-1">
                          Review
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Usage Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card rounded-2xl p-6 mt-6"
              >
                <h2 className="text-xl font-poppins font-semibold text-sage-800 mb-6">
                  Platform Usage
                </h2>
                
                <div className="h-64 bg-gradient-to-br from-sage-100 to-beige-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <ChartBarIcon className="w-16 h-16 text-sage-400 mx-auto mb-4" />
                    <p className="text-sage-600">Usage analytics chart</p>
                    <p className="text-sage-500 text-sm">Interactive chart would be displayed here</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Therapist Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="text-lg font-poppins font-semibold text-sage-800 mb-4">
                  Therapist Status
                </h3>
                
                <div className="space-y-4">
                  {therapistStats.map((therapist) => (
                    <div key={therapist.name} className="bg-white/40 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sage-800 text-sm">{therapist.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          therapist.availability === 'Available' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {therapist.availability}
                        </span>
                      </div>
                      
                      <p className="text-sage-600 text-xs mb-2">{therapist.specialty}</p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-sage-500">{therapist.sessions} sessions</span>
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">⭐</span>
                          <span className="text-sage-600">{therapist.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="text-lg font-poppins font-semibold text-sage-800 mb-4 flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  System Status
                </h3>
                
                <div className="space-y-3">
                  {[
                    { name: 'Chat Service', status: 'operational' },
                    { name: 'Booking System', status: 'operational' },
                    { name: 'Video Calls', status: 'operational' },
                    { name: 'Database', status: 'operational' },
                  ].map((service) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <span className="text-sage-700 text-sm">{service.name}</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                        <span className="text-green-600 text-xs font-medium capitalize">
                          {service.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="text-lg font-poppins font-semibold text-sage-800 mb-4">
                  Quick Actions
                </h3>
                
                <div className="space-y-3">
                  <button className="w-full btn-secondary text-sm justify-start">
                    Review Flagged Content
                  </button>
                  <button className="w-full btn-secondary text-sm justify-start">
                    Send Platform Announcement
                  </button>
                  <button className="w-full btn-secondary text-sm justify-start">
                    Export User Data
                  </button>
                  <button className="w-full btn-secondary text-sm justify-start">
                    System Maintenance
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
