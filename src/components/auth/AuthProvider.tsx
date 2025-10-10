'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (credentials: { email: string; password: string }) => Promise<{ error?: { message: string } }>
  signUp: (credentials: { email: string; password: string; name?: string }) => Promise<{ error?: { message: string } }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      try {
        // In a real app, you'd check for a valid session here
        setLoading(false)
      } catch (error) {
        console.error('Auth check failed:', error)
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (credentials: { email: string; password: string }) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      setUser({
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0]
      })
      
      return { error: undefined }
    } catch (error) {
      console.error('Sign in failed:', error)
      return { error: { message: 'Sign in failed' } }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (credentials: { email: string; password: string; name?: string }) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      setUser({
        id: '1',
        email: credentials.email,
        name: credentials.name || credentials.email.split('@')[0]
      })
      
      return { error: undefined }
    } catch (error) {
      console.error('Sign up failed:', error)
      return { error: { message: 'Sign up failed' } }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setUser(null)
    } catch (error) {
      console.error('Sign out failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}