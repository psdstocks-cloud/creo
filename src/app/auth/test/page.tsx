'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import { DemoLogin } from '@/components/auth/DemoLogin'
import { useEffect, useState } from 'react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AuthTestPage() {
  const { user, session, loading } = useAuth()
  const [hydrationComplete, setHydrationComplete] = useState(false)
  const [ssrData, setSsrData] = useState<{
    timestamp: string
    userAgent: string
    url: string
    cookies: string
    localStorage: {
      demo_user: string | null
      demo_session: string | null
    }
  } | null>(null)

  useEffect(() => {
    setHydrationComplete(true)
    
    // Test client-side data
    const clientData = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      cookies: document.cookie,
      localStorage: {
        demo_user: localStorage.getItem('demo_user'),
        demo_session: localStorage.getItem('demo_session')
      }
    }
    
    setSsrData(clientData)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Flow Test</h1>
          
          {/* Demo Login Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Demo Login (Development Only)</h2>
            <DemoLogin />
          </div>

          {/* Authentication Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Status</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">User Status</h3>
                  <p className="text-sm text-gray-600">
                    {user ? `Logged in as: ${user.email}` : 'Not logged in'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Role: {user?.user_metadata?.role || 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Session Status</h3>
                  <p className="text-sm text-gray-600">
                    {session ? 'Active session' : 'No session'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Loading: {loading ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SSR/CSR Test Results */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">SSR/CSR Flow Test</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">Server-Side Rendering</h3>
                  <p className="text-sm text-gray-600">
                    Hydration Complete: {hydrationComplete ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Environment: {process.env.NODE_ENV}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Client-Side Hydration</h3>
                  <p className="text-sm text-gray-600">
                    Timestamp: {ssrData?.timestamp || 'Loading...'}
                  </p>
                  <p className="text-sm text-gray-600">
                    URL: {ssrData?.url || 'Loading...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middleware Test */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Middleware Protection Test</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-4">
                Test protected routes by navigating to:
              </p>
              <div className="space-y-2">
                <a 
                  href="/dashboard" 
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  /dashboard (Protected - requires auth)
                </a>
                <a 
                  href="/orders" 
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  /orders (Protected - requires auth)
                </a>
                <a 
                  href="/ai-generation" 
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  /ai-generation (Protected - requires auth)
                </a>
                <a 
                  href="/stock-search" 
                  className="block text-green-600 hover:text-green-800 underline"
                >
                  /stock-search (Public - no auth required)
                </a>
              </div>
            </div>
          </div>

          {/* Test Instructions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Instructions</h2>
            <div className="bg-blue-50 rounded-lg p-4">
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Use the demo login above to test authentication</li>
                <li>Check that protected routes redirect to signin when not authenticated</li>
                <li>Verify that authenticated users can access protected routes</li>
                <li>Test the logout functionality</li>
                <li>Verify that demo mode only works in development</li>
                <li>Check browser console for any SSR/CSR hydration issues</li>
              </ol>
            </div>
          </div>

          {/* Debug Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Debug Information</h2>
            <div className="bg-gray-100 rounded-lg p-4">
              <pre className="text-xs text-gray-700 overflow-auto">
                {JSON.stringify({
                  user: user ? {
                    id: user.id,
                    email: user.email,
                    role: user.user_metadata?.role,
                    permissions: user.user_metadata?.permissions
                  } : null,
                  session: session ? {
                    access_token: session.access_token ? 'Present' : 'Missing',
                    expires_at: session.expires_at,
                    token_type: session.token_type
                  } : null,
                  environment: process.env.NODE_ENV,
                  hydrationComplete,
                  timestamp: new Date().toISOString()
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
