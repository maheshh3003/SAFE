'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  VideoCameraIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'

interface Therapist {
  id: string
  name: string
  specialization: string
  rating: number
  experience: string
  pricePerHour: number
  nextAvailable: string
  image: string
  bio: string
  sessionTypes: ('video' | 'phone' | 'chat' | 'offline')[]
  isIntern?: boolean
}

const therapists: Therapist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    specialization: 'Anxiety & Depression',
    rating: 4.9,
    experience: '13 years',
    pricePerHour: 2499,
    nextAvailable: 'Today at 2:00 PM',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face',
    bio: 'Senior therapist specializing in cognitive behavioral therapy and mindfulness-based approaches. Expert in treating anxiety disorders and depression.',
    sessionTypes: ['video', 'phone', 'chat', 'offline']
  },
  {
    id: '2',
    name: 'Dr. Michael Rodriguez',
    specialization: 'Trauma & PTSD',
    rating: 4.8,
    experience: '4 years',
    pricePerHour: 1499,
    nextAvailable: 'Tomorrow at 10:00 AM',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&crop=face',
    bio: 'Mid-level therapist with expertise in trauma-informed care and EMDR therapy techniques. Passionate about helping clients heal from traumatic experiences.',
    sessionTypes: ['video', 'phone', 'offline']
  },
  {
    id: '3',
    name: 'Alex Kumar',
    specialization: 'General Counseling',
    rating: 4.6,
    experience: '1 year',
    pricePerHour: 499,
    nextAvailable: 'Today at 4:30 PM',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    bio: 'Supervised intern offering affordable counseling sessions. Specializes in general counseling and emotional support under expert supervision.',
    sessionTypes: ['video', 'phone', 'chat'],
    isIntern: true
  }
]

const sessionTypes = [
  {
    type: 'video' as const,
    name: 'Video Session',
    description: 'Face-to-face therapy via secure video',
    icon: VideoCameraIcon,
    duration: '50 minutes'
  },
  {
    type: 'phone' as const,
    name: 'Phone Session', 
    description: 'Voice-only therapy session',
    icon: PhoneIcon,
    duration: '50 minutes'
  },
  {
    type: 'chat' as const,
    name: 'Text Session',
    description: 'Written therapy via secure messaging',
    icon: ChatBubbleLeftRightIcon,
    duration: '45 minutes'
  },
  {
    type: 'offline' as const,
    name: 'In-Person Session',
    description: 'Face-to-face therapy at our clinic',
    icon: MapPinIcon,
    duration: '50 minutes'
  }
]

// Calendar component
const Calendar = ({ selectedDate, onDateSelect, availableTimes, selectedTime, onTimeSelect }: {
  selectedDate: string
  onDateSelect: (date: string) => void
  availableTimes: string[]
  selectedTime: string
  onTimeSelect: (time: string) => void
}) => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
  
  const getDays = () => {
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const isToday = day === today.getDate()
      const isSelected = selectedDate === date
      const isPast = day < today.getDate()
      
      days.push(
        <motion.button
          key={day}
          onClick={() => !isPast && onDateSelect(date)}
          disabled={isPast}
          className={`p-2 text-sm rounded-lg transition-all duration-200 ${
            isPast 
              ? 'text-sage-300 cursor-not-allowed'
              : isSelected
              ? 'bg-sage-500 text-white'
              : isToday
              ? 'bg-sage-100 text-sage-700 font-semibold'
              : 'hover:bg-sage-50 text-sage-700'
          }`}
          whileHover={!isPast ? { scale: 1.05 } : {}}
          whileTap={!isPast ? { scale: 0.95 } : {}}
        >
          {day}
        </motion.button>
      )
    }
    
    return days
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-plus-jakarta font-semibold text-sage-800 mb-4">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-xs font-medium text-sage-500 text-center">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {getDays()}
        </div>
      </div>
      
      {selectedDate && (
        <div>
          <h4 className="text-base font-plus-jakarta font-semibold text-sage-800 mb-3">
            Available Times
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {availableTimes.map(time => (
              <motion.button
                key={time}
                onClick={() => onTimeSelect(time)}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedTime === time
                    ? 'bg-sage-500 text-white'
                    : 'bg-white/60 text-sage-700 hover:bg-white/80'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {time}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function BookingPage() {
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [selectedSessionType, setSelectedSessionType] = useState<'video' | 'phone' | 'chat' | 'offline' | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  
  const availableTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

  const openBookingModal = (therapist: Therapist) => {
    setSelectedTherapist(therapist)
    setSelectedSessionType(null)
    setSelectedDate('')
    setSelectedTime('')
    setIsBookingModalOpen(true)
  }

  const closeBookingModal = () => {
    setIsBookingModalOpen(false)
    setSelectedTherapist(null)
    setSelectedSessionType(null)
    setSelectedDate('')
    setSelectedTime('')
  }
  
  const calculatePrice = (basePrice: number, sessionType: string) => {
    switch (sessionType) {
      case 'video':
      case 'offline':
        return basePrice
      case 'phone':
        return Math.round(basePrice * 0.8) // 20% discount for phone
      case 'chat':
        return Math.round(basePrice * 0.6) // 40% discount for chat
      default:
        return basePrice
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-plus-jakarta font-bold text-sage-800 mb-4">
              Book Your Session
            </h1>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto">
              Choose your therapist, select your preferred session type, and schedule your appointment
            </p>
          </motion.div> */}

          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-plus-jakarta font-bold text-sage-800 mb-4">
                Book Your Session
              </h1>
              <p className="text-lg text-sage-600 max-w-2xl mx-auto">
                Choose your therapist and we'll help you schedule the perfect session
              </p>
            </motion.div>

            {/* Therapist Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {therapists.map((therapist) => (
                <motion.div
                  key={therapist.id}
                  className="glass-card p-6 rounded-3xl cursor-pointer transition-all duration-300 hover:bg-white/80 hover:shadow-lg hover:scale-[1.02]"
                  onClick={() => openBookingModal(therapist)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="relative mx-auto mb-4">
                      <img 
                        src={therapist.image} 
                        alt={therapist.name}
                        className="w-24 h-24 rounded-2xl object-cover shadow-lg mx-auto"
                      />
                      {/* {therapist.isIntern && (
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          Intern
                        </div>
                      )} */}
                    </div>
                    
                    <h3 className="text-xl font-plus-jakarta font-bold text-sage-800 mb-2">
                      {therapist.name}
                    </h3>
                    <p className="text-sage-600 font-dm-sans mb-3">{therapist.specialization}</p>
                    
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sage-600 text-sm ml-1">{therapist.rating}</span>
                      </div>
                      <div className="text-sage-600 text-sm">
                        {therapist.experience} exp.
                      </div>
                    </div>
                    
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-sage-700">
                        ₹{therapist.pricePerHour}
                      </div>
                      <div className="text-sm text-sage-500">per hour</div>
                    </div>
                    
                    <p className="text-sage-700 text-sm mb-4 font-dm-sans leading-relaxed">
                      {therapist.bio}
                    </p>
                    
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      {therapist.sessionTypes.map((type) => {
                        const sessionType = sessionTypes.find(s => s.type === type)
                        if (!sessionType) return null
                        const IconComponent = sessionType.icon
                        return (
                          <div 
                            key={type} 
                            className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center"
                            title={sessionType.name}
                          >
                            <IconComponent className="w-4 h-4 text-sage-600" />
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="text-sm text-sage-600 mb-4">
                      <ClockIcon className="w-4 h-4 inline mr-1" />
                      {therapist.nextAvailable}
                    </div>
                    
                    <button className="w-full btn-primary text-sm py-2">
                      Book Session
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Booking Modal */}
          <AnimatePresence>
            {isBookingModalOpen && selectedTherapist && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={closeBookingModal}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={selectedTherapist.image} 
                        alt={selectedTherapist.name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                      />
                      <div>
                        <h2 className="text-2xl font-plus-jakarta font-bold text-sage-800">
                          Book with {selectedTherapist.name}
                        </h2>
                        <p className="text-sage-600">{selectedTherapist.specialization}</p>
                      </div>
                    </div>
                    <button
                      onClick={closeBookingModal}
                      className="w-10 h-10 rounded-full bg-sage-100 hover:bg-sage-200 flex items-center justify-center transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Session Types */}
                    <div>
                      <h3 className="text-lg font-plus-jakarta font-semibold text-sage-800 mb-4">
                        Choose Session Type
                      </h3>
                      <div className="space-y-3">
                        {sessionTypes
                          .filter(session => selectedTherapist.sessionTypes.includes(session.type))
                          .map((session) => {
                          const IconComponent = session.icon
                          const price = calculatePrice(selectedTherapist.pricePerHour, session.type)
                          
                          return (
                            <motion.div
                              key={session.type}
                              className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                                selectedSessionType === session.type 
                                  ? 'bg-sage-500 text-white' 
                                  : 'bg-white/60 hover:bg-white/80 text-sage-700'
                              }`}
                              onClick={() => setSelectedSessionType(session.type)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  selectedSessionType === session.type 
                                    ? 'bg-white/20' 
                                    : 'bg-sage-100'
                                }`}>
                                  <IconComponent className={`w-5 h-5 ${
                                    selectedSessionType === session.type 
                                      ? 'text-white' 
                                      : 'text-sage-600'
                                  }`} />
                                </div>
                                
                                <div className="flex-1">
                                  <h4 className="font-plus-jakarta font-semibold text-sm">
                                    {session.name}
                                  </h4>
                                  <p className="text-xs opacity-80">{session.duration}</p>
                                </div>
                                
                                <div className="text-right">
                                  <div className="font-bold">₹{price}</div>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Calendar */}
                    <div className="lg:col-span-2">
                      <h3 className="text-lg font-plus-jakarta font-semibold text-sage-800 mb-4">
                        Select Date & Time
                      </h3>
                      
                      {selectedSessionType ? (
                        <Calendar
                          selectedDate={selectedDate}
                          onDateSelect={setSelectedDate}
                          availableTimes={availableTimes}
                          selectedTime={selectedTime}
                          onTimeSelect={setSelectedTime}
                        />
                      ) : (
                        <div className="text-center py-8 bg-white/60 rounded-2xl">
                          <CalendarDaysIcon className="w-12 h-12 text-sage-300 mx-auto mb-3" />
                          <p className="text-sage-500">
                            Please select a session type first
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Summary & Action */}
                  {selectedTherapist && selectedSessionType && selectedDate && selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 p-6 bg-white/80 rounded-2xl border-t border-sage-200"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="font-plus-jakarta font-semibold text-sage-800 mb-3">
                            Booking Summary
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-sage-600">Session:</span>
                              <span className="font-medium text-sage-800">
                                {sessionTypes.find(s => s.type === selectedSessionType)?.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sage-600">Date:</span>
                              <span className="font-medium text-sage-800">{selectedDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sage-600">Time:</span>
                              <span className="font-medium text-sage-800">{selectedTime}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-3xl font-bold text-sage-700 mb-1">
                            ₹{calculatePrice(selectedTherapist.pricePerHour, selectedSessionType)}
                          </div>
                          <div className="text-sm text-sage-500">
                            {sessionTypes.find(s => s.type === selectedSessionType)?.duration}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4">
                        <motion.button
                          onClick={closeBookingModal}
                          className="flex-1 py-3 px-6 bg-sage-100 text-sage-700 rounded-2xl font-semibold hover:bg-sage-200 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          className="flex-1 btn-primary py-3"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Confirm Booking
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
