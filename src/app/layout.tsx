import './globals.css'
import { Inter, Poppins, DM_Sans, Plus_Jakarta_Sans } from 'next/font/google'
import { Metadata, Viewport } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap'
})

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap'
})

const dmSans = DM_Sans({ 
  subsets: ['latin'], 
  variable: '--font-dm-sans',
  display: 'swap'
})

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-plus-jakarta',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'SAFE - Mental Health Support Platform',
  description: 'A secure, professional platform for mental health support, resources, and community',
  keywords: ['mental health', 'wellness', 'support', 'mindfulness', 'therapy', 'safe'],
  authors: [{ name: 'SAFE Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${dmSans.variable} ${plusJakarta.variable}`}>
      <body className="bg-gradient-to-br from-beige-50 via-cream-50 to-sage-50 min-h-screen antialiased text-lg">
        <AuthProvider>
          <div className="relative min-h-screen">
            {/* Background Elements */}
            <div className="fixed inset-0 -z-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-sage-200/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-beige-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cream-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
            </div>
            
            {/* Main Content */}
            <main className="relative z-10">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
