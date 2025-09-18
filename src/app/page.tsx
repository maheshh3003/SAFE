'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import WelcomePage from '@/components/WelcomePage'
import LandingPage from '@/components/LandingPage'

export default function HomePage() {
  const { user, loading, isUniversityAdmin } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)
  const [showFallback, setShowFallback] = useState(false)

  // Redirect university admins to admin panel, show landing page for regular users
  useEffect(() => {
    // Auto-redirect university admins (they can always navigate back if needed)
    if (!loading && user && !redirecting && isUniversityAdmin) {
      setRedirecting(true)
      console.log('Redirecting university admin to admin panel')
      console.log('User metadata:', user.user_metadata)
      router.push('/university-admin')
    }
  }, [user, loading, router, redirecting, isUniversityAdmin])

  // Fallback mechanism if loading takes too long
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (loading) {
        console.warn('Loading taking too long, showing fallback')
        setShowFallback(true)
      }
    }, 3000)

    return () => clearTimeout(fallbackTimer)
  }, [loading])

  // Show loading screen with timeout fallback
  if ((loading || redirecting) && !showFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-beige-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sage-300 border-t-sage-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sage-600 text-sm">
            {redirecting ? 'Redirecting to dashboard...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  // Show welcome page for unauthenticated users OR if fallback is needed
  if (!user || showFallback) {
    return <WelcomePage />
  }

  // Show landing page for authenticated individual users (students)
  return <LandingPage />
}
