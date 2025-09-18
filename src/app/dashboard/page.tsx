'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon, 
  CalendarDaysIcon, 
  BookOpenIcon, 
  UserGroupIcon,
  HeartIcon,
  ArrowRightIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-beige-50">
        <div className="w-8 h-8 border-3 border-sage-300 border-t-sage-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const quickActions = [
    {
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8" />,
      title: 'Start Chat',
      description: 'Get immediate support',
      href: '/chat',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <CalendarDaysIcon className="w-8 h-8" />,
      title: 'Book Session',
      description: 'Schedule with therapist',
      href: '/booking',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <BookOpenIcon className="w-8 h-8" />,
      title: 'Resources',
      description: 'Explore wellness content',
      href: '/resources',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: 'Community',
      description: 'Connect with others',
      href: '/community',
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-beige-50 to-sage-100">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-sage-400 to-sage-600 rounded-2xl flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
            </div> */}
            
            <h1 className="text-4xl font-plus-jakarta font-bold text-sage-800 mb-4">
              Welcome to your wellness space, {user.user_metadata?.full_name?.split(' ')[0] || 'there'}!
            </h1>
            
            <p className="text-xl text-sage-600 max-w-2xl mx-auto">
              Your personalized mental health hub. Everything you need for your wellness journey is here.
            </p>
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link href={action.href}>
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:border-white/50 transition-all duration-300 group-hover:shadow-xl">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {action.icon}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-sage-800 mb-2">
                      {action.title}
                    </h3>
                    
                    <p className="text-sage-600 text-sm mb-3">
                      {action.description}
                    </p>
                    
                    <div className="flex items-center text-sage-500 group-hover:text-sage-700 transition-colors">
                      <span className="text-sm font-medium">Get started</span>
                      <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Welcome Message Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/30"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-sage-400 to-sage-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              
              <h2 className="text-2xl font-plus-jakarta font-bold text-sage-800 mb-4">
                Your Mental Health Journey Starts Here
              </h2>
              
              <p className="text-sage-600 max-w-2xl mx-auto leading-relaxed mb-6">
                This is your personal space for mental wellness. Whether you need immediate support through our AI chat, 
                want to connect with a professional therapist, or explore our wellness resources, everything is designed 
                around your needs.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  Need help now?
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-sage-500 to-sage-600 text-white font-medium rounded-lg hover:from-sage-600 hover:to-sage-700 transition-all duration-300"
                >
                  Book a session
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <h3 className="text-lg font-semibold text-sage-700 mb-6">
              You're part of a supportive community
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="text-2xl font-bold text-sage-800">50K+</div>
                <div className="text-sm text-sage-600">Students Supported</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="text-2xl font-bold text-sage-800">24/7</div>
                <div className="text-sm text-sage-600">Support Available</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="text-2xl font-bold text-sage-800">500+</div>
                <div className="text-sm text-sage-600">Licensed Professionals</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="text-2xl font-bold text-sage-800">99%</div>
                <div className="text-sm text-sage-600">User Satisfaction</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}