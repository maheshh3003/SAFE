import NextAuth from 'next-auth'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

declare module 'next-auth' {
  interface User {
    user_metadata?: any
  }
  
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      user_metadata?: any
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user_metadata?: any
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          if (error || !user) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email,
            user_metadata: user.user_metadata
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_metadata = user.user_metadata
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.user_metadata) {
        session.user.user_metadata = token.user_metadata
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }