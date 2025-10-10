'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { demoLogin, user } = useAuth()
  const router = useRouter()

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  const handleDemoLogin = async (email: string) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await demoLogin(email, 'demo123')
      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Demo Mode Active</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Logged in as: {user.email}</p>
              <p>Role: {user.user_metadata?.role || 'user'}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">Demo Login (Development Only)</h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>Select a demo account to test the application:</p>
            
            {error && (
              <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            <div className="mt-3 space-y-2">
              {Object.entries(DEMO_USERS).map(([email, user]) => (
                <button
                  key={email}
                  onClick={() => handleDemoLogin(email)}
                  disabled={loading}
                  className="w-full text-left p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <div className="font-medium text-gray-900">{user.role.replace('_', ' ').toUpperCase()}</div>
                  <div className="text-sm text-gray-600">{email}</div>
                  <div className="text-xs text-gray-500">
                    Permissions: {user.permissions.join(', ')}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs text-gray-600">
              <p><strong>Note:</strong> Demo mode is only available in development environment.</p>
              <p>All demo accounts use password: <code>demo123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
