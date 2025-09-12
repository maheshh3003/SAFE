'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  HeartIcon,
  SparklesIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { supabase } from '../../lib/supabase'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'signup' | 'university-login' | 'university-signup'
  onToggleMode: () => void
}

// University email domains (expandable list)
const UNIVERSITY_DOMAINS = [
  'edu', 'ac.uk', 'edu.au', 'edu.ca', 'edu.in', 'ac.in', 'university.edu',
  // Add more university domains as needed
]

const isUniversityEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false
  
  return UNIVERSITY_DOMAINS.some(uniDomain => 
    domain.endsWith(uniDomain) || domain.includes('.edu') || domain.includes('.ac.')
  )
}

export default function AuthModal({ isOpen, onClose, mode, onToggleMode }: AuthModalProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
    universityName: '',
    universityAddress: '',
    contactPhone: '',
    adminTitle: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (mode === 'signup' || mode === 'university-signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match')
        }

        // Check if it's a university signup
        const isUniSignup = mode === 'university-signup' || isUniversityEmail(formData.email)
        
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              user_type: isUniSignup ? 'university_admin' : 'student',
              university_name: isUniSignup ? formData.universityName : null,
              university_address: isUniSignup ? formData.universityAddress : null,
              contact_phone: isUniSignup ? formData.contactPhone : null,
              admin_title: isUniSignup ? formData.adminTitle : null,
            }
          }
        })

        if (error) throw error

        setSuccess(isUniSignup 
          ? 'University account created successfully! Please check your email to verify your account.'
          : 'Account created successfully! Please check your email to verify your account.'
        )
        
        // Reset form
        setFormData({
          email: '',
          password: '',
          fullName: '',
          confirmPassword: '',
          universityName: '',
          universityAddress: '',
          contactPhone: '',
          adminTitle: ''
        })
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) throw error

        setSuccess('Logged in successfully!')
        
        // Determine redirect based on email domain and user type
        const isUniEmail = isUniversityEmail(formData.email)
        const redirectPath = isUniEmail ? '/university-admin' : '/dashboard'
        
        setTimeout(() => {
          onClose()
          router.push(redirectPath)
        }, 1000)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md"
        >
          <div className="glass-card rounded-3xl p-8 border-2 border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-sage-400 to-sage-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {mode === 'login' ? (
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                ) : mode === 'university-login' ? (
                  <AcademicCapIcon className="w-8 h-8 text-white" />
                ) : mode === 'university-signup' ? (
                  <BuildingOfficeIcon className="w-8 h-8 text-white" />
                ) : (
                  <SparklesIcon className="w-8 h-8 text-white" />
                )}
              </div>
              
              <h2 className="text-2xl font-plus-jakarta font-bold text-sage-800 mb-2">
                {mode === 'login' ? 'Welcome Back' : 
                 mode === 'university-login' ? 'University Login' :
                 mode === 'university-signup' ? 'Register Your University' :
                 'Join Our Community'}
              </h2>
              
              <p className="text-sage-600">
                {mode === 'login' 
                  ? 'Sign in to continue your wellness journey' 
                  : mode === 'university-login'
                  ? 'Access your university admin panel'
                  : mode === 'university-signup'
                  ? 'Register your institution to support student mental health'
                  : 'Start your mental health journey with us'
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {(mode === 'signup' || mode === 'university-signup') && (
                <div>
                  <label className="block text-sage-700 font-medium mb-2">
                    Full Name {mode === 'university-signup' ? '(Administrator)' : ''}
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/30 rounded-xl text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300"
                      placeholder={mode === 'university-signup' ? "Administrator's full name" : "Enter your full name"}
                    />
                  </div>
                </div>
              )}

              {mode === 'university-signup' && (
                <>
                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      University/Institution Name
                    </label>
                    <div className="relative">
                      <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                      <input
                        type="text"
                        name="universityName"
                        value={formData.universityName}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/30 rounded-xl text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300"
                        placeholder="Enter university name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      University Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="universityAddress"
                        value={formData.universityAddress}
                        onChange={handleChange}
                        required
                        className="w-full pl-4 pr-4 py-3 bg-white/60 border border-white/30 rounded-xl text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300"
                        placeholder="Enter university address"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sage-700 font-medium mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        required
                        className="w-full pl-4 pr-4 py-3 bg-white/60 border border-white/30 rounded-xl text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300"
                        placeholder="Contact number"
                      />
                    </div>
                    <div>
                      <label className="block text-sage-700 font-medium mb-2">
                        Your Title
                      </label>
                      <input
                        type="text"
                        name="adminTitle"
                        value={formData.adminTitle}
                        onChange={handleChange}
                        required
                        className="w-full pl-4 pr-4 py-3 bg-white/60 border border-white/30 rounded-xl text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300"
                        placeholder="e.g., Dean, Director"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sage-700 font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/30 rounded-xl text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300"
                    placeholder={mode === 'university-signup' || mode === 'university-login' 
                      ? "University email address" 
                      : "Enter your email"
                    }
                  />
                </div>
                {mode === 'university-signup' && (
                  <p className="text-xs text-sage-500 mt-1">
                    Please use your official university email address (.edu, .ac.uk, etc.)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sage-700 font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-12 py-3 bg-white/60 border border-white/30 rounded-xl text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-400 hover:text-sage-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {(mode === 'signup' || mode === 'university-signup') && (
                <div>
                  <label className="block text-sage-700 font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-3 bg-white/60 border border-white/30 rounded-xl text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-100 border border-red-200 rounded-xl text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-green-100 border border-green-200 rounded-xl text-green-700 text-sm"
                >
                  {success}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white font-semibold rounded-xl hover:from-sage-600 hover:to-sage-700 focus:outline-none focus:ring-2 focus:ring-sage-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    {mode === 'login' ? 'Signing In...' : 
                     mode === 'university-login' ? 'Signing In...' :
                     mode === 'university-signup' ? 'Registering University...' :
                     'Creating Account...'}
                  </div>
                ) : (
                  mode === 'login' ? 'Sign In' : 
                  mode === 'university-login' ? 'Sign In to Admin Panel' :
                  mode === 'university-signup' ? 'Register University' :
                  'Create Account'
                )}
              </motion.button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center space-y-3">
              {(mode === 'login' || mode === 'signup') && (
                <p className="text-sage-600">
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                  {' '}
                  <button
                    onClick={onToggleMode}
                    className="text-sage-700 font-semibold hover:text-sage-800 transition-colors"
                  >
                    {mode === 'login' ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              )}

              {(mode === 'university-login' || mode === 'university-signup') && (
                <p className="text-sage-600">
                  {mode === 'university-login' ? "Need to register your university?" : "University already registered?"}
                  {' '}
                  {mode === 'university-login' ? (
                    <a
                      href="/university-registration"
                      className="text-sage-700 font-semibold hover:text-sage-800 transition-colors"
                    >
                      Register University
                    </a>
                  ) : (
                    <button
                      onClick={onToggleMode}
                      className="text-sage-700 font-semibold hover:text-sage-800 transition-colors"
                    >
                      Sign In
                    </button>
                  )}
                </p>
              )}

              {/* Switch between individual and university */}
              <div className="pt-3 border-t border-sage-200/30">
                <p className="text-sage-600 text-sm">
                  {(mode === 'login' || mode === 'signup') ? 'Representing a university?' : 'Individual user?'}
                  {' '}
                  <button
                    onClick={() => {
                      if (mode === 'login' || mode === 'signup') {
                        onToggleMode() // This will need to be updated to handle university modes
                      } else {
                        onToggleMode() // This will need to be updated to handle individual modes
                      }
                    }}
                    className="text-sage-700 font-semibold hover:text-sage-800 transition-colors"
                  >
                    {(mode === 'login' || mode === 'signup') ? 'University Login' : 'Individual Login'}
                  </button>
                </p>
              </div>
            </div>

            {/* Privacy Note */}
            {(mode === 'signup' || mode === 'university-signup') && (
              <div className="mt-4 text-center">
                <p className="text-xs text-sage-500">
                  {mode === 'university-signup' 
                    ? 'By registering your university, you agree to our Terms of Service, Privacy Policy, and University Partnership Agreement. All student data will be encrypted and handled in compliance with FERPA and other applicable regulations.'
                    : 'By creating an account, you agree to our Terms of Service and Privacy Policy. Your mental health data is encrypted and secure with SAFE.'
                  }
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}