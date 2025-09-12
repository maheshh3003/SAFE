'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import WelcomeNavigation from '@/components/WelcomeNavigation'
import { 
  HeartIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import AuthModal from './AuthModal'

const therapists = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Anxiety & Depression',
    experience: '12 years',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    bio: 'Specializes in cognitive behavioral therapy and mindfulness-based interventions for young adults.'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Trauma & PTSD',
    experience: '8 years',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    bio: 'Expert in trauma-informed care and EMDR therapy with extensive experience in student counseling.'
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Stress Management',
    experience: '10 years',
    image: 'https://media.istockphoto.com/id/846002896/photo/female-healthcare-worker-standing-in-hospital-corridor.webp?a=1&b=1&s=612x612&w=0&k=20&c=xLP9NOPLFcYSz2I3IZC65qeJ0qiE0U5XBhq_NAh541E=',
    bio: 'Focuses on stress reduction techniques and work-life balance strategies for students.'
  },
  {
    id: 4,
    name: 'Dr. James Thompson',
    specialty: 'Addiction Counseling',
    experience: '15 years',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
    bio: 'Certified addiction counselor with expertise in dual diagnosis and recovery support.'
  },
  {
    id: 5,
    name: 'Dr. Lisa Park',
    specialty: 'Relationship Therapy',
    experience: '9 years',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face',
    bio: 'Specializes in couples therapy and interpersonal relationship dynamics.'
  },
  {
    id: 6,
    name: 'Dr. David Wilson',
    specialty: 'ADHD & Learning',
    experience: '11 years',
    image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face',
    bio: 'Expert in ADHD management and learning disability support for college students.'
  }
]

export default function WelcomePage() {
  const searchParams = useSearchParams()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'university-login' | 'university-signup'>('login')
  const [selectedTherapist, setSelectedTherapist] = useState(therapists[0])

  // Check URL parameters for auth mode
  useEffect(() => {
    const mode = searchParams?.get('mode')
    if (mode && ['login', 'signup', 'university-login', 'university-signup'].includes(mode)) {
      setAuthMode(mode as 'login' | 'signup' | 'university-login' | 'university-signup')
      setShowAuthModal(true)
    }
  }, [searchParams])

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      content: 'This platform helped me manage my anxiety and find balance in my life. The therapists are amazing!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      content: 'The convenience of online therapy combined with professional care made all the difference for me.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Teacher',
      content: 'I love having access to resources anytime I need them. The meditation library is particularly helpful.',
      rating: 5
    }
  ]

  const openAuthModal = (mode: 'login' | 'signup' | 'university-login' | 'university-signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const toggleAuthMode = () => {
    if (authMode === 'login') setAuthMode('signup')
    else if (authMode === 'signup') setAuthMode('login')
    else if (authMode === 'university-login') setAuthMode('university-signup')
    else if (authMode === 'university-signup') setAuthMode('university-login')
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50">
        <WelcomeNavigation onOpenAuthModal={openAuthModal} />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-20">
          {/* Hero Content */}
          <div className="pt-12 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-soft border border-sage-200/30 text-sage-700 mb-8">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Your Mental Wellness Journey Starts Here</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl font-plus-jakarta font-bold text-sage-800 mb-8 leading-tight">
                    Find Peace of Mind with
                    <span className="block bg-gradient-to-r from-sage-600 to-sage-700 bg-clip-text text-transparent">
                      Expert Care
                    </span>
                  </h1>
                  
                  <p className="text-xl text-sage-600 max-w-3xl mx-auto mb-12 font-dm-sans leading-relaxed">
                    Connect with licensed therapists, access premium resources, and take control of your mental health journey. 
                    Professional support is just a click away.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <motion.button
                      onClick={() => openAuthModal('signup')}
                      className="px-8 py-4 bg-gradient-to-r from-sage-500 to-sage-600 text-white font-semibold rounded-xl hover:from-sage-600 hover:to-sage-700 transition-all duration-300 text-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Your Journey
                    </motion.button>
                    
                    <button
                      onClick={() => openAuthModal('login')}
                      className="px-8 py-4 glass-card rounded-xl text-sage-700 font-semibold hover:bg-white/80 transition-all duration-300 text-lg"
                    >
                      Sign In
                    </button>
                  </div>
                </motion.div>
                
                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center space-x-8 text-sage-500"
                >
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserGroupIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Licensed Professionals</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StarIcon className="w-5 h-5 fill-current text-yellow-400" />
                    <span className="text-sm font-medium">4.9/5 Rating</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Therapists Section with Circular Gallery */}
        <div className="py-20 bg-white/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-plus-jakarta font-bold text-sage-800 mb-6">
                Meet Our Expert Therapists
              </h2>
              <p className="text-xl text-sage-600 max-w-2xl mx-auto">
                Connect with licensed mental health professionals who specialize in student wellness and care
              </p>
            </motion.div>

            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              {/* Circular Gallery */}
              <div className="relative order-2 lg:order-1">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto">
                  {therapists.map((therapist, index) => {
                    const angle = (index * 60) - 90 // 360/6 = 60 degrees per item, start at top
                    const radius = 110 // Base radius
                    const x = Math.cos((angle * Math.PI) / 180) * radius
                    const y = Math.sin((angle * Math.PI) / 180) * radius
                    
                    return (
                      <motion.div
                        key={therapist.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                        style={{
                          left: `50%`,
                          top: `50%`,
                          x: x,
                          y: y,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setSelectedTherapist(therapist)}
                      >
                        <div className={`w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full overflow-hidden border-4 transition-all duration-300 ${
                          selectedTherapist.id === therapist.id 
                            ? 'border-sage-500 shadow-lg shadow-sage-500/50' 
                            : 'border-sage-300 hover:border-sage-400'
                        }`}>
                          <img
                            src={therapist.image}
                            alt={therapist.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                  
                  {/* Center profile */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-sage-600 shadow-2xl">
                      <img
                        src={selectedTherapist.image}
                        alt={selectedTherapist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Therapist Details */}
              <motion.div
                key={selectedTherapist.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-6 sm:p-8 lg:p-10 rounded-3xl order-1 lg:order-2"
              >
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-plus-jakarta font-bold text-sage-800 mb-3 sm:mb-4">
                  {selectedTherapist.name}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <span className="text-lg sm:text-xl text-sage-600 font-semibold">
                    {selectedTherapist.specialty}
                  </span>
                  <span className="px-3 py-1 sm:px-4 sm:py-2 bg-sage-100 text-sage-700 rounded-full text-base sm:text-lg w-fit">
                    {selectedTherapist.experience}
                  </span>
                </div>
                <p className="text-lg sm:text-xl text-sage-600 leading-relaxed font-dm-sans mb-6 sm:mb-8">
                  {selectedTherapist.bio}
                </p>
                <motion.button
                  onClick={() => openAuthModal('signup')}
                  className="btn-primary text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started with {selectedTherapist.name.split(' ')[1]}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-plus-jakarta font-bold text-sage-800 mb-6">
                What Our Users Say
              </h2>
              <p className="text-xl text-sage-600 max-w-2xl mx-auto">
                Join thousands of people who have transformed their mental health with SAFE.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-2xl p-6"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sage-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-sage-800">{testimonial.name}</p>
                    <p className="text-sage-500 text-sm">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-sage-500 to-sage-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-plus-jakarta font-bold text-white mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-sage-100 mb-8 max-w-2xl mx-auto">
                Take the first step towards better mental health. Join our community and get the support you deserve.
              </p>
              <motion.button
                onClick={() => openAuthModal('signup')}
                className="px-8 py-4 bg-white text-sage-700 font-semibold rounded-xl hover:bg-sage-50 transition-all duration-300 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Today
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onToggleMode={toggleAuthMode}
      />
    </>
  )
}