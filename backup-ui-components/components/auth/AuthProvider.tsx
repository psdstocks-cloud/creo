'use client'
import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/browser'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (args: {email:string, password:string}) => Promise<{error?:Error}>
  signUp: (args: {email:string, password:string}) => Promise<{error?:Error}>
  signOut: () => Promise<void>
  demoLogin: (email: string, password: string) => Promise<{error?:Error}>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Only create Supabase client if environment variables are available
  const supabase = useMemo(() => {
    if (typeof window === 'undefined') return null
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }
    return createClient()
  }, [])

  useEffect(() => {
    if (!supabase) {
      // Check for demo user in localStorage
      const demoUser = localStorage.getItem('demo_user')
      if (demoUser) {
        try {
          const user = JSON.parse(demoUser)
          setUser(user)
          setSession({
            user,
            access_token: 'demo-token',
            refresh_token: 'demo-refresh',
            expires_in: 3600,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            token_type: 'bearer'
          })
        } catch (error) {
          console.error('Error parsing demo user:', error)
        }
      }
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async ({ email, password }: { email: string, password: string }) => {
    if (!supabase) {
      return { error: new Error('Authentication service is not available') }
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    return { error: error || undefined }
  }
  const signUp = async ({ email, password }: { email: string, password: string }) => {
    if (!supabase) {
      return { error: new Error('Authentication service is not available') }
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    return { error: error || undefined }
  }
  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    // Clear demo user data
    localStorage.removeItem('demo_user')
    localStorage.removeItem('demo_session')
    setUser(null)
    setSession(null)
  }

  const demoLogin = async (email: string, password: string) => {
    // Only allow demo mode in development
    if (process.env.NODE_ENV === 'production') {
      return { error: new Error('Demo mode is only available in development') }
    }

    // Demo users for testing
    const DEMO_USERS: Record<string, { id: string; email: string; role: string; permissions: string[] }> = {
      'admin@creo.demo': {
        id: 'demo-admin-1',
        email: 'admin@creo.demo',
        role: 'super_admin',
        permissions: ['all_access', 'user_management', 'system_settings', 'analytics', 'content_management']
      },
      'content@creo.demo': {
        id: 'demo-content-1',
        email: 'content@creo.demo',
        role: 'content_manager',
        permissions: ['content_management', 'order_processing', 'analytics']
      },
      'support@creo.demo': {
        id: 'demo-support-1',
        email: 'support@creo.demo',
        role: 'support_admin',
        permissions: ['user_support', 'order_management', 'basic_analytics']
      }
    }

    const demoUser = DEMO_USERS[email]
    if (!demoUser || password !== 'demo123') {
      return { error: new Error('Invalid demo credentials') }
    }

    // Create a mock user object that matches Supabase User interface
    const mockUser = {
      id: demoUser.id,
      email: demoUser.email,
      user_metadata: {
        role: demoUser.role,
        permissions: demoUser.permissions
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      role: 'authenticated'
    }

    // Store demo user in localStorage for persistence
    localStorage.setItem('demo_user', JSON.stringify(mockUser))
    localStorage.setItem('demo_session', JSON.stringify({
      access_token: 'demo-token',
      refresh_token: 'demo-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser
    }))

    // Set user and session
    setUser(mockUser)
    setSession({
      user: mockUser,
      access_token: 'demo-token',
      refresh_token: 'demo-refresh',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer'
    })

    return { error: undefined }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, demoLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}