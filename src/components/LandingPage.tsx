'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon, 
  CalendarDaysIcon, 
  BookOpenIcon, 
  UserGroupIcon,
  ShieldCheckIcon,
  HeartIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { useState, useEffect } from 'react'

const features = [
  {
    icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />,
    title: 'AI-Powered Chat Support',
    description: 'Get instant, personalized mental health guidance through our intelligent chat system available 24/7.'
  },
  {
    icon: <CalendarDaysIcon className="w-8 h-8 text-white" />,
    title: 'Professional Counseling',
    description: 'Book sessions with licensed therapists and counselors who specialize in student mental health.'
  },
  {
    icon: <BookOpenIcon className="w-8 h-8 text-white" />,
    title: 'Wellness Resources',
    description: 'Access curated articles, videos, and exercises designed to improve your mental wellbeing.'
  },
  {
    icon: <UserGroupIcon className="w-8 h-8 text-white" />,
    title: 'Supportive Community',
    description: 'Connect with peers in a safe, moderated environment where you can share and find support.'
  },
  {
    icon: <ShieldCheckIcon className="w-8 h-8 text-white" />,
    title: 'Privacy Protected',
    description: 'Your privacy is our priority. All conversations and data are fully encrypted and confidential.'
  },
  {
    icon: <HeartIcon className="w-8 h-8 text-white" />,
    title: 'Holistic Approach',
    description: 'Address mind, body, and spirit with comprehensive tools for complete mental wellness.'
  }
]

const stats = [
  { value: '50K+', label: 'Students Supported' },
  { value: '200+', label: 'Partner Universities' },
  { value: '500+', label: 'Licensed Professionals' },
  { value: '99%', label: 'User Satisfaction' }
]

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

const testimonials = [
  {
    id: 1,
    name: 'Emma Thompson',
    role: 'Psychology Student',
    university: 'Stanford University',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    rating: 5,
    testimonial: 'This platform changed my life. The AI chat support helped me through my darkest moments, and connecting with Dr. Johnson made all the difference in my recovery journey.',
    date: 'March 2024'
  },
  {
    id: 2,
    name: 'Alex Rodriguez',
    role: 'Engineering Student',
    university: 'MIT',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    rating: 5,
    testimonial: 'The 24/7 availability was crucial during my finals week. The community support and professional guidance helped me manage my anxiety better than I ever thought possible.',
    date: 'February 2024'
  },
  {
    id: 3,
    name: 'Sophia Kim',
    role: 'Medical Student',
    university: 'Harvard Medical School',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    rating: 5,
    testimonial: 'As a med student, stress management is crucial. The wellness resources and Dr. Rodriguez\'s sessions have been invaluable in maintaining my mental health.',
    date: 'January 2024'
  },
  {
    id: 4,
    name: 'Jordan Williams',
    role: 'Business Student',
    university: 'Wharton School',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    rating: 5,
    testimonial: 'The privacy protection gave me confidence to open up. The holistic approach addressed not just my symptoms but helped me build lasting resilience.',
    date: 'December 2023'
  },
  {
    id: 5,
    name: 'Maya Patel',
    role: 'Graduate Student',
    university: 'UC Berkeley',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    rating: 5,
    testimonial: 'The community aspect was unexpected but so valuable. Connecting with other students who understood my struggles made me feel less alone.',
    date: 'November 2023'
  }
]

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [selectedTherapist, setSelectedTherapist] = useState(therapists[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000) // Auto-slide every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto"
            >
              <div className="flex justify-center mb-6 sm:mb-8">
                <motion.div
                  className="inline-flex items-center px-4 py-2 sm:px-8 sm:py-4 rounded-full bg-gradient-soft border border-sage-200/30 text-sage-700"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <SparklesIcon className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span className="text-sm sm:text-base font-medium">Your mental health matters</span>
                </motion.div>
              </div>
              
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-plus-jakarta font-bold text-sage-800 mb-8 sm:mb-12 leading-tight text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Find Peace in Your
                <span className="text-gradient block">Mental Wellness Journey</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl md:text-2xl text-sage-600 mb-12 sm:mb-16 leading-relaxed max-w-3xl sm:max-w-4xl mx-auto font-dm-sans text-center px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Professional mental health support, resources, and community in a safe, 
                calming digital space designed for your wellbeing.
              </motion.p>
              
              <motion.div 
                className="flex flex-col gap-4 sm:flex-row sm:gap-6 lg:gap-8 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Link href="/chat" className="w-full sm:w-auto">
                  <motion.button
                    className="btn-primary text-lg sm:text-xl px-8 py-4 sm:px-12 sm:py-6 w-full sm:w-auto flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Your Journey
                    <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3" />
                  </motion.button>
                </Link>
                
                <Link href="#what-we-do" className="w-full sm:w-auto">
                  <motion.button
                    className="btn-secondary text-lg sm:text-xl px-8 py-4 sm:px-12 sm:py-6 w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do Section with Circular Gallery */}
      <section id="what-we-do" className="relative z-10 py-16 sm:py-20 lg:py-24 bg-gradient-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-plus-jakarta font-bold text-sage-800 mb-6 sm:mb-8">
              What We Do
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-sage-600 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto font-dm-sans leading-relaxed px-4">
              Meet our team of experienced therapists and counselors who are here to support your mental wellness journey
            </p>
          </motion.div>

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Circular Gallery */}
            <div className="relative order-2 lg:order-1">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto">
                {therapists.map((therapist, index) => {
                  const angle = (index * 60) - 90 // 360/6 = 60 degrees per item, start at top
                  // Responsive radius using CSS classes instead of window object
                  const radius = 110 // Base radius, will be adjusted with CSS
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
              <Link href="/booking" className="w-full sm:w-auto">
                <motion.button
                  className="btn-primary text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Session
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section
      <section id="features" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-plus-jakarta font-bold text-sage-800 mb-8">
              Everything You Need for
              <span className="text-gradient block">Mental Wellness</span>
            </h2>
            <p className="text-2xl text-sage-600 max-w-4xl mx-auto font-dm-sans leading-relaxed">
              Comprehensive tools and support designed to help you thrive mentally and emotionally.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="glass-card p-10 h-full rounded-3xl border border-sage-200/20 hover:border-sage-300/40 transition-all duration-300 hover:shadow-2xl hover:shadow-sage-500/10 hover:-translate-y-2">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-sage-400 to-sage-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-plus-jakarta font-bold text-sage-800 mb-6">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-sage-600 leading-relaxed font-dm-sans">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-plus-jakarta font-bold text-sage-800 mb-6 sm:mb-8">
              What Students Are Saying
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-sage-600 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto font-dm-sans leading-relaxed px-4">
              Real stories from students who found support and growth through our platform
            </p>
          </motion.div>

          <div className="relative max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto">
            {/* Testimonial Cards */}
            <div className="relative h-auto min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="glass-card p-6 sm:p-8 lg:p-12 rounded-3xl h-full flex flex-col justify-between">
                    <div>
                      {/* Stars */}
                      <div className="flex justify-center mb-6 sm:mb-8">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <StarIconSolid key={i} className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                        ))}
                      </div>
                      
                      {/* Testimonial Text */}
                      <blockquote className="text-lg sm:text-xl lg:text-2xl text-sage-700 leading-relaxed font-dm-sans text-center mb-8 sm:mb-10 px-2">
                        "{testimonials[currentTestimonial].testimonial}"
                      </blockquote>
                    </div>
                    
                    {/* Author Info */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                      <img
                        src={testimonials[currentTestimonial].image}
                        alt={testimonials[currentTestimonial].name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-sage-300"
                      />
                      <div className="text-center sm:text-left">
                        <h4 className="text-xl sm:text-2xl font-plus-jakarta font-bold text-sage-800">
                          {testimonials[currentTestimonial].name}
                        </h4>
                        <p className="text-base sm:text-lg text-sage-600">
                          {testimonials[currentTestimonial].role}
                        </p>
                        <p className="text-base sm:text-lg text-sage-500">
                          {testimonials[currentTestimonial].university}
                        </p>
                        <p className="text-sm text-sage-400 mt-1 sm:mt-2">
                          {testimonials[currentTestimonial].date}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 sm:mt-12">
              <button
                onClick={prevTestimonial}
                className="p-2 sm:p-4 bg-white/80 backdrop-blur-sm rounded-full border border-sage-200 hover:bg-white transition-all duration-300 hover:shadow-lg"
              >
                <ChevronLeftIcon className="w-6 h-6 sm:w-8 sm:h-8 text-sage-600" />
              </button>

              {/* Dots Indicator */}
              <div className="flex space-x-2 sm:space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-sage-600 scale-125'
                        : 'bg-sage-300 hover:bg-sage-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 sm:p-4 bg-white/80 backdrop-blur-sm rounded-full border border-sage-200 hover:bg-white transition-all duration-300 hover:shadow-lg"
              >
                <ChevronRightIcon className="w-6 h-6 sm:w-8 sm:h-8 text-sage-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24 bg-gradient-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-plus-jakarta font-bold text-sage-800 mb-4 sm:mb-6">
              Trusted by Students Everywhere
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-4 sm:p-6 lg:p-10 glass-card rounded-2xl"
              >
                <motion.h3 
                  className="text-3xl sm:text-4xl lg:text-5xl font-plus-jakarta font-bold text-sage-700 mb-2 sm:mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-sm sm:text-lg lg:text-xl text-sage-600 font-dm-sans">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative z-10 py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-sage-50 via-beige-50 to-sage-100">
        <div className="max-w-4xl sm:max-w-5xl lg:max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-sage-300/30 rounded-full"
                  style={{
                    left: `${20 + i * 12}%`,
                    top: `${30 + (i % 2) * 40}%`,
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-plus-jakarta font-bold text-sage-800 mb-8 sm:mb-10">
              Ready to Transform Your
              <span className="text-gradient block">Mental Wellness?</span>
            </h2>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-sage-600 mb-12 sm:mb-16 font-dm-sans max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed px-4">
              Join thousands of students who have discovered peace, growth, and resilience 
              through our comprehensive mental health support platform. Your journey to better 
              mental wellness starts with a single step.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 lg:gap-8 justify-center items-center mb-12 sm:mb-16">
              <Link href="/chat" className="w-full sm:w-auto">
                <motion.button
                  className="btn-primary text-lg sm:text-xl lg:text-2xl px-8 py-4 sm:px-12 sm:py-6 lg:px-16 lg:py-8 inline-flex items-center shadow-2xl shadow-sage-500/30 w-full sm:w-auto justify-center"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Start Your Journey Now
                  <ArrowRightIcon className="w-6 h-6 sm:w-8 sm:h-8 ml-3 sm:ml-4" />
                </motion.button>
              </Link>
              
              <Link href="/booking" className="w-full sm:w-auto">
                <motion.button
                  className="btn-secondary text-lg sm:text-xl lg:text-2xl px-8 py-4 sm:px-12 sm:py-6 lg:px-16 lg:py-8 shadow-xl w-full sm:w-auto"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Book a Session
                </motion.button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto"
            >
              <div className="flex flex-col items-center p-6 sm:p-8 glass-card rounded-2xl">
                <ShieldCheckIcon className="w-10 h-10 sm:w-12 sm:h-12 text-sage-600 mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-plus-jakarta font-bold text-sage-800 mb-2">
                  100% Confidential
                </h3>
                <p className="text-base sm:text-lg text-sage-600 font-dm-sans text-center">
                  Your privacy is our top priority
                </p>
              </div>
              
              <div className="flex flex-col items-center p-6 sm:p-8 glass-card rounded-2xl">
                <HeartIcon className="w-10 h-10 sm:w-12 sm:h-12 text-sage-600 mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-plus-jakarta font-bold text-sage-800 mb-2">
                  Licensed Professionals
                </h3>
                <p className="text-base sm:text-lg text-sage-600 font-dm-sans text-center">
                  Certified therapists and counselors
                </p>
              </div>
              
              <div className="flex flex-col items-center p-6 sm:p-8 glass-card rounded-2xl sm:col-span-1 col-span-1">
                <SparklesIcon className="w-10 h-10 sm:w-12 sm:h-12 text-sage-600 mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-plus-jakarta font-bold text-sage-800 mb-2">
                  24/7 Support
                </h3>
                <p className="text-base sm:text-lg text-sage-600 font-dm-sans text-center">
                  Help when you need it most
                </p>
              </div>
            </motion.div>

            {/* Final Message */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-lg sm:text-xl text-sage-500 font-dm-sans mt-12 sm:mt-16 italic px-4"
            >
              "Your mental health is not a destination, but a process. It's about how you drive, not where you're going." 
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
