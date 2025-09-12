'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Bars3Icon, 
  XMarkIcon, 
  HeartIcon, 
  UserIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import logo from '../assets/logo.png'

interface WelcomeNavigationProps {
  onOpenAuthModal: (mode: 'login' | 'signup' | 'university-login' | 'university-signup') => void
}

const navigation = [
  { name: 'Support Chat', href: '/chat' },
  { name: 'Booking', href: '/booking' },
  { name: 'Resources', href: '/resources' },
  { name: 'Community', href: '/community' },
]

export default function WelcomeNavigation({ onOpenAuthModal }: WelcomeNavigationProps) {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-soft border-b border-white/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.a
            href="/dashboard"
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 relative">
              <Image 
                src={logo} 
                alt="SAFE Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-plus-jakarta font-bold text-gradient">
              SAFE
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navigation.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-sage-700 hover:text-sage-800 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300 relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-sage-400 to-sage-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </motion.a>
              ))}
              
              {user && (
                <div className="flex items-center space-x-4">
                  <motion.a
                    href="/dashboard"
                    className="text-sage-700 hover:text-sage-800 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300 relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Home
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-sage-400 to-sage-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </motion.a>
                  
                  <div className="flex items-center space-x-2 text-sage-700">
                    <UserIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  
                  <motion.button
                    onClick={handleSignOut}
                    className="p-2 text-sage-600 hover:text-sage-800 hover:bg-sage-50 rounded-lg transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Sign Out"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  </motion.button>
                </div>
              )}

              {!user && (
                <div className="flex items-center space-x-4">
                  <div className="hidden lg:flex items-center space-x-2">
                    <button
                      onClick={() => onOpenAuthModal('university-login')}
                      className="px-4 py-2 text-sage-600 hover:text-sage-700 font-medium text-sm transition-colors border border-sage-300 rounded-lg hover:bg-sage-50"
                    >
                      University Login
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onOpenAuthModal('login')}
                    className="px-6 py-2 text-sage-700 hover:text-sage-800 font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onOpenAuthModal('signup')}
                    className="px-6 py-2 bg-gradient-to-r from-sage-500 to-sage-600 text-white font-semibold rounded-xl hover:from-sage-600 hover:to-sage-700 transition-all duration-300"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-white/60 backdrop-blur-sm border border-white/30"
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6 text-sage-700" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-sage-700" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 glass-card rounded-2xl mt-2 mb-4">
                {navigation.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="block px-6 py-4 text-sage-700 hover:text-sage-800 hover:bg-sage-50/50 rounded-xl mx-2 transition-colors duration-300 text-base font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
                
                {user && (
                  <>
                    <motion.a
                      href="/dashboard"
                      className="block px-6 py-4 text-sage-700 hover:text-sage-800 hover:bg-sage-50/50 rounded-xl mx-2 transition-colors duration-300 text-base font-medium"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navigation.length * 0.1 }}
                      onClick={() => setIsOpen(false)}
                    >
                      Home
                    </motion.a>
                    
                    <motion.div
                      className="px-6 py-4 text-sage-700 border-t border-sage-200/30 mx-2 mt-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navigation.length + 1) * 0.1 }}
                    >
                      <div className="flex items-center space-x-2">
                        <UserIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          {user.user_metadata?.full_name || user.email}
                        </span>
                      </div>
                    </motion.div>
                    
                    <motion.button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-6 py-4 text-sage-700 hover:text-sage-800 hover:bg-sage-50/50 rounded-xl mx-2 transition-colors duration-300 text-base font-medium w-full"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navigation.length + 2) * 0.1 }}
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>Sign Out</span>
                    </motion.button>
                  </>
                )}

                {!user && (
                  <>
                    <motion.button
                      onClick={() => {
                        onOpenAuthModal('university-login')
                        setIsOpen(false)
                      }}
                      className="block px-6 py-4 text-sage-700 hover:text-sage-800 hover:bg-sage-50/50 rounded-xl mx-2 transition-colors duration-300 text-base font-medium w-full text-left"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navigation.length * 0.1 }}
                    >
                      University Login
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        onOpenAuthModal('login')
                        setIsOpen(false)
                      }}
                      className="block px-6 py-4 text-sage-700 hover:text-sage-800 hover:bg-sage-50/50 rounded-xl mx-2 transition-colors duration-300 text-base font-medium w-full text-left"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navigation.length + 1) * 0.1 }}
                    >
                      Sign In
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        onOpenAuthModal('signup')
                        setIsOpen(false)
                      }}
                      className="block px-6 py-4 bg-gradient-to-r from-sage-500 to-sage-600 text-white hover:from-sage-600 hover:to-sage-700 rounded-xl mx-2 transition-colors duration-300 text-base font-medium w-full text-left"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navigation.length + 2) * 0.1 }}
                    >
                      Get Started
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}