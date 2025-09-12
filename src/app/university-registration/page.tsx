'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  BuildingOfficeIcon,
  AcademicCapIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { supabase } from '../../../lib/supabase'

export default function UniversityRegistration() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  
  const [formData, setFormData] = useState({
    // University Information
    universityName: '',
    universityAddress: '',
    universityDomain: '',
    universityWebsite: '',
    universityType: '',
    studentPopulation: '',
    
    // Admin Information
    adminFullName: '',
    adminEmail: '',
    adminPassword: '',
    adminConfirmPassword: '',
    adminTitle: '',
    adminPhone: '',
    
    // Additional Information
    mentalHealthServices: false,
    previousPlatformExperience: '',
    expectedUsage: '',
    specialRequirements: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.universityName && formData.universityAddress && 
               formData.universityDomain && formData.universityType
      case 2:
        return formData.adminFullName && formData.adminEmail && 
               formData.adminPassword && formData.adminTitle &&
               formData.adminPassword === formData.adminConfirmPassword
      case 3:
        return true // Optional step
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
      setError(null)
    } else {
      setError('Please fill in all required fields')
    }
  }

  const prevStep = () => {
    setStep(step - 1)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(2)) {
      setError('Please complete all required information')
      return
    }

    if (formData.adminPassword !== formData.adminConfirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create admin user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.adminEmail,
        password: formData.adminPassword,
        options: {
          data: {
            full_name: formData.adminFullName,
            user_type: 'university_admin',
            university_name: formData.universityName,
            admin_title: formData.adminTitle,
            phone: formData.adminPhone
          }
        }
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      // Create university record
      const universityData = {
        name: formData.universityName,
        domain: formData.universityDomain,
        address: formData.universityAddress,
        contactEmail: formData.adminEmail,
        contactPhone: formData.adminPhone,
        adminUserId: authData.user.id,
        adminName: formData.adminFullName,
        adminTitle: formData.adminTitle,
        studentLimit: parseInt(formData.studentPopulation) || 1000
      }

      const response = await fetch('/api/universities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(universityData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to register university')
      }

      setSuccess('University registration submitted successfully! Please check your email to verify your account.')
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push('/?mode=university-login')
      }, 3000)

    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Failed to register university')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'University Information', icon: BuildingOfficeIcon },
    { number: 2, title: 'Administrator Account', icon: UserIcon },
    { number: 3, title: 'Additional Details', icon: AcademicCapIcon }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-beige-50 to-sage-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-sage-400 to-sage-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AcademicCapIcon className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl font-plus-jakarta font-bold text-sage-800 mb-4">
            Register Your University
          </h1>
          
          <p className="text-xl text-sage-600 max-w-2xl mx-auto">
            Join our mental health platform and provide comprehensive support for your students' wellbeing.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center space-x-8">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                  step >= stepItem.number
                    ? 'bg-sage-500 border-sage-500 text-white'
                    : 'border-sage-300 text-sage-400'
                }`}>
                  <stepItem.icon className="w-6 h-6" />
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    step >= stepItem.number ? 'text-sage-800' : 'text-sage-400'
                  }`}>
                    Step {stepItem.number}
                  </div>
                  <div className={`text-sm ${
                    step >= stepItem.number ? 'text-sage-600' : 'text-sage-400'
                  }`}>
                    {stepItem.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ml-6 ${
                    step > stepItem.number ? 'bg-sage-500' : 'bg-sage-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/30"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: University Information */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold text-sage-800 mb-6">University Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      University Name *
                    </label>
                    <input
                      type="text"
                      name="universityName"
                      value={formData.universityName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="Enter university name"
                    />
                  </div>

                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      Email Domain *
                    </label>
                    <input
                      type="text"
                      name="universityDomain"
                      value={formData.universityDomain}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="university.edu"
                    />
                    <p className="text-xs text-sage-500 mt-1">
                      The email domain used by your institution
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sage-700 font-medium mb-2">
                    University Address *
                  </label>
                  <input
                    type="text"
                    name="universityAddress"
                    value={formData.universityAddress}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="Complete university address"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      University Type *
                    </label>
                    <select
                      name="universityType"
                      value={formData.universityType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    >
                      <option value="">Select type</option>
                      <option value="public">Public University</option>
                      <option value="private">Private University</option>
                      <option value="community">Community College</option>
                      <option value="technical">Technical College</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      Student Population (Approximate)
                    </label>
                    <input
                      type="number"
                      name="studentPopulation"
                      value={formData.studentPopulation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="e.g. 5000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sage-700 font-medium mb-2">
                    University Website
                  </label>
                  <input
                    type="url"
                    name="universityWebsite"
                    value={formData.universityWebsite}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="https://university.edu"
                  />
                </div>
              </>
            )}

            {/* Step 2: Administrator Account */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold text-sage-800 mb-6">Administrator Account</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="adminFullName"
                      value={formData.adminFullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="Administrator full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      Title/Position *
                    </label>
                    <input
                      type="text"
                      name="adminTitle"
                      value={formData.adminTitle}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="e.g. Dean of Students, Director"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="admin@university.edu"
                    />
                    <p className="text-xs text-sage-500 mt-1">
                      Must use your university email domain
                    </p>
                  </div>

                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="adminPhone"
                      value={formData.adminPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="Contact phone number"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="adminPassword"
                      value={formData.adminPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="Create a secure password"
                    />
                  </div>

                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="adminConfirmPassword"
                      value={formData.adminConfirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Additional Details */}
            {step === 3 && (
              <>
                <h2 className="text-2xl font-bold text-sage-800 mb-6">Additional Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="mentalHealthServices"
                      checked={formData.mentalHealthServices}
                      onChange={handleChange}
                      className="w-5 h-5 text-sage-600 border-sage-300 rounded focus:ring-sage-500"
                    />
                    <label className="ml-3 text-sage-700">
                      Our university currently has mental health services available
                    </label>
                  </div>

                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      Previous Platform Experience
                    </label>
                    <textarea
                      name="previousPlatformExperience"
                      value={formData.previousPlatformExperience}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="Have you used similar mental health platforms before?"
                    />
                  </div>

                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      Expected Usage
                    </label>
                    <textarea
                      name="expectedUsage"
                      value={formData.expectedUsage}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="How do you plan to integrate this platform into your student services?"
                    />
                  </div>

                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      Special Requirements
                    </label>
                    <textarea
                      name="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-sage-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="Any specific requirements or integrations needed?"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-100 border border-red-200 rounded-xl text-red-700 flex items-center"
              >
                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-100 border border-green-200 rounded-xl text-green-700 flex items-center"
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                {success}
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className={`px-6 py-3 border border-sage-300 rounded-xl font-medium transition-colors ${
                  step === 1
                    ? 'text-sage-400 cursor-not-allowed'
                    : 'text-sage-700 hover:bg-sage-50'
                }`}
              >
                Previous
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white font-medium rounded-xl hover:from-sage-600 hover:to-sage-700 transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white font-medium rounded-xl hover:from-sage-600 hover:to-sage-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Registering...
                    </div>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/30"
        >
          <h3 className="text-xl font-semibold text-sage-800 mb-6 text-center">
            Why Partner with SAFE?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-sage-800 mb-2">FERPA Compliant</h4>
              <p className="text-sage-600 text-sm">
                Complete compliance with student privacy regulations and institutional requirements.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-sage-800 mb-2">Student-Focused</h4>
              <p className="text-sage-600 text-sm">
                Designed specifically for higher education with university-specific features.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-sage-800 mb-2">Comprehensive Support</h4>
              <p className="text-sage-600 text-sm">
                24/7 student access with professional therapists and AI-powered support.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}