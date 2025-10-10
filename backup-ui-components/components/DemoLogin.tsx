'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'

interface DemoUser {
  id: string
  email: string
  role: string
  permissions: string[]
}

// Demo users for testing
const DEMO_USERS: Record<string, DemoUser> = {
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

export function DemoLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, signOut } = useAuth()

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const demoUser = DEMO_USERS[demoEmail]
      if (!demoUser) {
        throw new Error('Demo account not found')
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

      // Reload the page to trigger auth state update
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('demo_user')
    localStorage.removeItem('demo_session')
    signOut()
    window.location.reload()
  }

  if (user) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-green-800">Demo Admin Active</h3>
            <p className="text-sm text-green-600">
              Logged in as: {user.email} ({user.user_metadata?.role || 'user'})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-medium text-blue-800 mb-3">Demo Admin Login</h3>
      <p className="text-sm text-blue-600 mb-4">
        Use these demo accounts to test admin functionality:
      </p>
      
      <div className="space-y-2">
        {Object.entries(DEMO_USERS).map(([email, user]) => (
          <div key={email} className="flex items-center justify-between bg-white p-2 rounded border">
            <div className="flex-1">
              <div className="text-sm font-medium">{user.role.replace('_', ' ').toUpperCase()}</div>
              <div className="text-xs text-gray-600">{email}</div>
            </div>
            <button
              onClick={() => handleDemoLogin(email, 'demo123')}
              disabled={loading}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}
