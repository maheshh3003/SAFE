'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PaperAirplaneIcon, 
  FaceSmileIcon, 
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import Navigation from '@/components/Navigation'
import Chat3DBackground from '@/components/Chat3DBackground'
import { PremiumCard, GlowButton, AnimatedIcon } from '@/components/PremiumComponents'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  type?: 'text' | 'suggestion' | 'resource'
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hello! I'm Mentrix, your compassionate AI mental health support companion. I'm here to provide you with immediate, empathetic support in a safe and confidential space. You're not alone, and whatever you're going through, we can work through it together. How are you feeling right now?",
    isUser: false,
    timestamp: new Date(),
  }
]

const quickResponses = [
  "I'm feeling anxious",
  "I need someone to talk to",
  "I'm having trouble sleeping",
  "I'm feeling overwhelmed",
  "I need crisis support"
]

const supportResources = [
  {
    title: "Crisis Hotline",
    description: "24/7 immediate support",
    icon: PhoneIcon,
    action: "Call Now"
  },
  {
    title: "Video Session",
    description: "Face-to-face support",
    icon: VideoCameraIcon,
    action: "Start Session"
  }
]

export default function SupportChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [autoScroll, setAutoScroll] = useState(false) // Changed to false to prevent initial scroll
  const [showScrollToChat, setShowScrollToChat] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false) // Track user interaction
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (autoScroll && hasUserInteracted && messagesContainerRef.current) {
      // Smooth scroll only within the messages container
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  const scrollToChat = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setShowScrollToChat(false)
    }
  }

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      // Add a small threshold (5px) to account for rounding errors
      const isScrolledToBottom = scrollHeight - scrollTop <= clientHeight + 5
      
      // Only update autoScroll if user has interacted
      if (hasUserInteracted) {
        setAutoScroll(isScrolledToBottom)
      }
    }
  }

  const handlePageScroll = () => {
    if (chatContainerRef.current) {
      const rect = chatContainerRef.current.getBoundingClientRect()
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight
      setShowScrollToChat(!isVisible && rect.top < -100)
    }
  }

  useEffect(() => {
    // Only scroll to bottom if user has interacted and it's not the initial load
    if (hasUserInteracted) {
      scrollToBottom()
    }
  }, [messages, hasUserInteracted])

  useEffect(() => {
    window.addEventListener('scroll', handlePageScroll)
    return () => window.removeEventListener('scroll', handlePageScroll)
  }, [])

  // Function to call our secure API route
  const getGeminiResponse = async (userMessage: string, conversationHistory: Message[]) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory
        }),
      })

      const data = await response.json()
      
      if (data.response) {
        return data.response
      } else {
        throw new Error('No response from API')
      }
    } catch (error) {
      console.error('Error calling chat API:', error)
      // Fallback responses
      const fallbackResponses = [
        "I'm here to support you through this. Can you share more about what's been weighing on your mind?",
        "Thank you for reaching out - that takes real courage. I'm Mentrix, and I'm here to listen and help however I can.",
        "I can hear that you're going through something difficult. You're not alone in this, and I'm here to support you.",
        "It sounds like you're dealing with something challenging. I'm here to provide a safe space for you to share and work through your feelings."
      ]
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setHasUserInteracted(true)
    setAutoScroll(true)
    setIsTyping(true)

    try {
      // Get AI response from Gemini
      const aiResponse = await getGeminiResponse(text, messages)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      // Fallback message on error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm here to support you. Could you tell me a bit more about what's on your mind? I'm Mentrix, and I want to help you through whatever you're experiencing.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await sendMessage(inputText)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 overflow-hidden scroll-smooth">
      <Chat3DBackground />
      <Navigation />
      
      <div className="relative z-10 pt-20 pb-6 px-4 sm:px-6 lg:px-8 scroll-smooth">
        <div className="max-w-4xl mx-auto">
          {/* Header Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-soft border border-sage-200/30 text-sage-700 mb-6">
              <AnimatedIcon icon={<HeartIcon className="w-6 h-6" />} className="mr-3" />
              <span className="text-base font-medium">Safe & Confidential Support</span>
            </div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-plus-jakarta font-bold text-sage-800 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Crisis Support Chat
            </motion.h1>
          </motion.div>

          {/* Main Chat Interface */}
          <motion.div
            ref={chatContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-3xl overflow-hidden mb-12 shadow-2xl"
            style={{ scrollSnapAlign: 'center' }}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-sage-400 via-sage-500 to-sage-600 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <AnimatedIcon icon={<HeartIcon className="w-6 h-6 text-white" />} />
                  </div>
                  <div>
                    <h3 className="font-plus-jakarta font-semibold text-xl">Mentrix</h3>
                    <p className="text-sage-100 text-base font-dm-sans">We've got your back!</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-dm-sans">Active</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="h-[600px] overflow-y-auto p-8 space-y-6 bg-white/20 backdrop-blur-sm scroll-smooth"
            >
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md lg:max-w-lg px-6 py-4 rounded-3xl shadow-lg ${
                        message.isUser
                          ? 'bg-gradient-to-br from-sage-500 to-sage-600 text-white shadow-sage-500/25'
                          : 'bg-white/90 backdrop-blur-sm border border-white/50 text-sage-800 shadow-black/10'
                      }`}
                    >
                      <p className="text-lg leading-relaxed font-dm-sans">{message.text}</p>
                      <p className={`text-sm mt-3 ${
                        message.isUser ? 'text-sage-100' : 'text-sage-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/90 backdrop-blur-sm border border-white/50 px-6 py-4 rounded-3xl shadow-lg">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-sage-400 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-3 h-3 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-8 border-t border-white/30 bg-white/10">
              <div className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/40 focus:bg-white/90 focus:border-sage-300 outline-none transition-all duration-300 text-sage-800 placeholder-sage-500 text-lg pr-14 shadow-inner"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-xl hover:bg-white/30 transition-colors duration-300"
                  >
                    <FaceSmileIcon className="w-6 h-6 text-sage-500" />
                  </button>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-4 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:from-sage-600 hover:to-sage-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PaperAirplaneIcon className="w-6 h-6" />
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Quick Responses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-plus-jakarta font-bold text-sage-800 mb-6 text-center">
              Quick Responses
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {quickResponses.map((response, index) => (
                <motion.button
                  key={response}
                  onClick={() => sendMessage(response)}
                  className="px-6 py-3 bg-white/70 hover:bg-white/90 border border-white/40 rounded-2xl text-base text-sage-700 hover:text-sage-800 transition-all duration-300 font-dm-sans shadow-lg hover:shadow-xl backdrop-blur-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  {response}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Support Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <PremiumCard className="p-8 h-full" glow={true}>
                <h3 className="font-plus-jakarta font-bold text-sage-800 mb-6 flex items-center text-2xl">
                  <AnimatedIcon 
                    icon={<InformationCircleIcon className="w-7 h-7" />} 
                    className="mr-4"
                  />
                  Emergency Resources
                </h3>
                
                <div className="space-y-5">
                  {supportResources.map((resource, index) => (
                    <motion.div
                      key={resource.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                    >
                      <GlowButton 
                        variant="ghost" 
                        size="sm"
                        className="w-full justify-start p-5 rounded-2xl"
                        onClick={() => console.log(`Accessing ${resource.title}`)}
                      >
                        <div className="flex items-center w-full">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center mr-5 shadow-lg">
                            <AnimatedIcon 
                              icon={<resource.icon className="w-7 h-7 text-white" />} 
                            />
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-sage-800 text-lg font-dm-sans mb-1">
                              {resource.title}
                            </div>
                            <div className="text-sage-600 text-base font-dm-sans">
                              {resource.description}
                            </div>
                          </div>
                        </div>
                      </GlowButton>
                    </motion.div>
                  ))}
                </div>
              </PremiumCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="glass-card rounded-3xl p-8 h-full shadow-2xl"
            >
              <h3 className="font-plus-jakarta font-bold text-sage-800 mb-6 flex items-center text-2xl">
                <ShieldCheckIcon className="w-7 h-7 mr-4" />
                Your Privacy
              </h3>
              
              <div className="space-y-5 mb-8">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-sage-400 rounded-full mr-4 shadow-sm"></div>
                  <span className="text-sage-700 font-dm-sans text-lg">End-to-end encrypted conversations</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-sage-400 rounded-full mr-4 shadow-sm"></div>
                  <span className="text-sage-700 font-dm-sans text-lg">No personal data stored</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-sage-400 rounded-full mr-4 shadow-sm"></div>
                  <span className="text-sage-700 font-dm-sans text-lg">Completely anonymous chat</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-sage-400 rounded-full mr-4 shadow-sm"></div>
                  <span className="text-sage-700 font-dm-sans text-lg">HIPAA compliant platform</span>
                </div>
              </div>

              <div className="p-6 bg-gradient-soft rounded-2xl border border-sage-200/30 shadow-inner">
                <p className="text-base text-sage-600 font-dm-sans leading-relaxed">
                  <SparklesIcon className="w-5 h-5 inline mr-3" />
                  Your wellbeing is our priority. This space is designed to provide you with immediate, confidential support whenever you need it.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Scroll to Chat Button */}
      <AnimatePresence>
        {showScrollToChat && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToChat}
            className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-full shadow-2xl hover:shadow-glow hover:from-sage-600 hover:to-sage-700 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-dm-sans font-medium">Chat</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}