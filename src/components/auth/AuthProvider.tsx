'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/browser'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  isAdmin: boolean
  userRole: string | null
  hasPermission: (permission: string) => boolean
  isDemoUser: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo admin accounts for testing
const DEMO_ADMIN_ACCOUNTS = {
  'admin@creo.demo': {
    role: 'super_admin',
    permissions: ['all_access', 'user_management', 'system_settings', 'analytics', 'content_management']
  },
  'content@creo.demo': {
    role: 'content_manager',
    permissions: ['content_management', 'order_processing', 'analytics']
  },
  'support@creo.demo': {
    role: 'support_admin',
    permissions: ['user_support', 'order_management', 'basic_analytics']
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (error) {
      console.warn('Supabase client not available:', error)
      return null
    }
  }, [])

  useEffect(() => {
    // Check for demo user first
    const checkDemoUser = () => {
      if (typeof window !== 'undefined') {
        const demoUser = localStorage.getItem('demo_user')
        const demoSession = localStorage.getItem('demo_session')
        
        if (demoUser && demoSession) {
          try {
            const user = JSON.parse(demoUser)
            const session = JSON.parse(demoSession)
            setUser(user)
            setSession(session)
            setLoading(false)
            
            // Set cookie for server-side detection
            document.cookie = 'demo_user=true; path=/; max-age=86400' // 24 hours
            return true
          } catch (error) {
            console.warn('Invalid demo user data:', error)
            localStorage.removeItem('demo_user')
            localStorage.removeItem('demo_session')
            // Clear demo cookie
            document.cookie = 'demo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          }
        }
      }
      return false
    }

    // If demo user found, use it
    if (checkDemoUser()) {
      return
    }

    // Otherwise, use Supabase
    if (!supabase) {
      setLoading(false)
      return
    }

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    // Clear demo user data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_user')
      localStorage.removeItem('demo_session')
      // Clear demo cookie
      document.cookie = 'demo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
    
    // Also sign out from Supabase if available
    if (supabase) {
      await supabase.auth.signOut()
    }
    
    // Clear local state
    setUser(null)
    setSession(null)
  }

  // Admin role and permission logic
  const userRole = useMemo(() => {
    if (!user?.email) return null
    const demoAccount = DEMO_ADMIN_ACCOUNTS[user.email as keyof typeof DEMO_ADMIN_ACCOUNTS]
    return demoAccount?.role || 'user'
  }, [user])

  const isAdmin = useMemo(() => {
    return userRole === 'super_admin' || userRole === 'content_manager' || userRole === 'support_admin'
  }, [userRole])

  const isDemoUser = useMemo(() => {
    return user?.email?.endsWith('@creo.demo') || false
  }, [user])

  const hasPermission = (permission: string): boolean => {
    if (!user?.email) return false
    const demoAccount = DEMO_ADMIN_ACCOUNTS[user.email as keyof typeof DEMO_ADMIN_ACCOUNTS]
    if (!demoAccount) return false
    
    // Super admin has all permissions
    if (demoAccount.role === 'super_admin') return true
    
    return demoAccount.permissions.includes(permission)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signOut, 
      isAdmin, 
      userRole, 
      hasPermission,
      isDemoUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
