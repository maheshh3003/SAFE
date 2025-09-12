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
    text: "Hello! I'm here to provide you with immediate support. You're not alone, and whatever you're going through, we can work through it together. How are you feeling right now?",
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate response
    setTimeout(() => {
      const responses = [
        "I understand how you're feeling. Can you tell me more about what's been on your mind lately?",
        "Thank you for sharing that with me. It takes courage to reach out. What specific situation is causing you the most distress right now?",
        "I hear you, and your feelings are completely valid. Let's work through this together. What would be most helpful for you right now?",
        "That sounds really challenging. You've taken an important step by reaching out. What kind of support are you looking for today?"
      ]
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputText)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 overflow-hidden">
      <Chat3DBackground />
      <Navigation />
      
      <div className="relative z-10 pt-20 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-soft border border-sage-200/30 text-sage-700 mb-4">
              <AnimatedIcon icon={<HeartIcon className="w-5 h-5" />} className="mr-2" />
              <span className="text-sm font-medium">Safe & Confidential</span>
            </div>
            
            <motion.h1 
              className="text-3xl md:text-4xl font-plus-jakarta font-bold text-sage-800 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Crisis Support Chat
            </motion.h1>
            
            <motion.p 
              className="text-lg text-sage-600 max-w-2xl mx-auto font-dm-sans leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Connect with trained professionals for immediate support. All conversations are confidential and secure.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Support Resources Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <PremiumCard className="p-6" glow={true}>
                  <h3 className="font-plus-jakarta font-semibold text-sage-800 mb-4 flex items-center text-base">
                    <AnimatedIcon 
                      icon={<InformationCircleIcon className="w-5 h-5" />} 
                      className="mr-2"
                    />
                    Emergency Resources
                  </h3>
                  
                  <div className="space-y-3">
                    {supportResources.map((resource, index) => (
                      <motion.div
                        key={resource.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <GlowButton 
                          variant="ghost" 
                          size="sm"
                          className="w-full justify-start p-3"
                          onClick={() => console.log(`Accessing ${resource.title}`)}
                        >
                          <div className="flex items-center w-full">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center mr-3">
                              <AnimatedIcon 
                                icon={<resource.icon className="w-5 h-5 text-white" />} 
                              />
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-sage-800 text-base font-dm-sans">
                                {resource.title}
                              </div>
                              <div className="text-sage-600 text-sm font-dm-sans">
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="font-plus-jakarta font-semibold text-sage-800 mb-4 flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  Your Privacy
                </h3>
                
                <div className="text-sm text-sage-600 space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-sage-400 rounded-full mr-2"></div>
                    End-to-end encrypted
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-sage-400 rounded-full mr-2"></div>
                    No data stored
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-sage-400 rounded-full mr-2"></div>
                    Anonymous chat
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl overflow-hidden h-[600px] flex flex-col"
              >
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-sage-400 to-sage-600 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-plus-jakarta font-semibold text-base">Support Specialist</h3>
                      <p className="text-sage-100 text-sm font-dm-sans">Online • Responds quickly</p>
                    </div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/30">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                            message.isUser
                              ? 'bg-gradient-to-r from-sage-500 to-sage-600 text-white'
                              : 'bg-white/80 backdrop-blur-sm border border-white/30 text-sage-800'
                          }`}
                        >
                          <p className="text-base leading-relaxed font-dm-sans">{message.text}</p>
                          <p className={`text-sm mt-2 ${
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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/80 backdrop-blur-sm border border-white/30 px-4 py-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Responses */}
                <div className="px-6 py-3 border-t border-white/30">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {quickResponses.map((response) => (
                      <motion.button
                        key={response}
                        onClick={() => sendMessage(response)}
                        className="px-3 py-1.5 bg-white/60 hover:bg-white/80 border border-white/30 rounded-full text-xs text-sage-700 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {response}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-6 border-t border-white/30">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your message here..."
                        className="input-glass pr-12"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-white/30 transition-colors duration-300"
                      >
                        <FaceSmileIcon className="w-5 h-5 text-sage-500" />
                      </button>
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="p-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}