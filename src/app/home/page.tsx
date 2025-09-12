'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoggedInHomePage() {
  const router = useRouter()
  
  // Redirect to dashboard (this is just an alias)
  useEffect(() => {
    router.replace('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-beige-50">
      <div className="w-8 h-8 border-3 border-sage-300 border-t-sage-600 rounded-full animate-spin"></div>
    </div>
  )
}