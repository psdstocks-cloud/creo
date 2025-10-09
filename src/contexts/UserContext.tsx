'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { useAuth } from '@/components/auth/AuthProvider'
import { useUserBalance } from '@/hooks/useStockMedia'

interface UserContextType {
  user: User | null
  userProfile: UserProfile | null
  balance: number
  isLoading: boolean
  refreshBalance: () => void
  updateUserProfile: (profile: Partial<UserProfile>) => void
  userRole: 'admin' | 'user' | 'demo' | null
  isDemoUser: boolean
  isAdmin: boolean
  preferences: UserPreferences
  updatePreferences: (prefs: Partial<UserPreferences>) => void
}

interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
  subscription_status?: 'active' | 'inactive' | 'trial'
  subscription_plan?: 'basic' | 'pro' | 'premium'
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'ar'
  notifications: {
    email: boolean
    push: boolean
    orderUpdates: boolean
    aiCompletion: boolean
  }
  aiDefaults: {
    style: string
    quality: 'standard' | 'high'
    size: string
  }
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { data: balanceData, refetch: refetchBalance } = useUserBalance()
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      orderUpdates: true,
      aiCompletion: true,
    },
    aiDefaults: {
      style: 'realistic',
      quality: 'standard',
      size: '1024x1024'
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  // Determine user role
  const userRole = user?.email === 'admin@creo.com' || user?.email === 'psdstockss@gmail.com' ? 'admin' : 
                   user?.email?.includes('demo') ? 'demo' : 
                   user ? 'user' : null
  
  const isDemoUser = userRole === 'demo'
  const isAdmin = userRole === 'admin'

  const loadUserProfile = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      // In a real app, this would fetch from Supabase
      // For now, create profile from user data
      const profile: UserProfile = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subscription_status: isDemoUser ? 'trial' : 'active',
        subscription_plan: isAdmin ? 'premium' : 'basic'
      }
      setUserProfile(profile)
    } catch (error) {
      console.error('Failed to load user profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserPreferences = () => {
    if (!user) return
    
    try {
      const stored = localStorage.getItem(`user_preferences_${user.id}`)
      if (stored) {
        const storedPrefs = JSON.parse(stored)
        setPreferences(prev => ({ ...prev, ...storedPrefs }))
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error)
    }
  }

  // Load user profile when user changes
  useEffect(() => {
    if (user) {
      loadUserProfile()
      loadUserPreferences()
    } else {
      setUserProfile(null)
    }
  }, [user])

  const updateUserProfile = async (profileUpdate: Partial<UserProfile>) => {
    if (!userProfile) return

    try {
      const updatedProfile = { ...userProfile, ...profileUpdate, updated_at: new Date().toISOString() }
      setUserProfile(updatedProfile)
      
      // In a real app, this would update Supabase
      // For now, just update local state
    } catch (error) {
      console.error('Failed to update user profile:', error)
    }
  }

  const updatePreferences = (prefsUpdate: Partial<UserPreferences>) => {
    if (!user) return

    const updatedPrefs = { ...preferences, ...prefsUpdate }
    setPreferences(updatedPrefs)
    
    // Save to localStorage
    localStorage.setItem(`user_preferences_${user.id}`, JSON.stringify(updatedPrefs))
  }

  const refreshBalance = () => {
    refetchBalance()
  }

  const value: UserContextType = {
    user,
    userProfile,
    balance: balanceData?.balance || 0,
    isLoading,
    refreshBalance,
    updateUserProfile,
    userRole,
    isDemoUser,
    isAdmin,
    preferences,
    updatePreferences,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
