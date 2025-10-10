'use client'
import { useAuth } from '@/components/auth/AuthProvider'
import { useToastHelpers } from '@/components/ui/Toast'
import { useState } from 'react'

export function DemoLogin() {
  const { signIn } = useAuth()
  const { success, error: showError } = useToastHelpers()
  const [loading, setLoading] = useState(false)

  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      const result = await signIn({
        email: 'demo@creo.com',
        password: 'demo123456'
      })
      
      if (result.error) {
        showError('Demo Login Failed', 'Unable to sign in with demo account')
      } else {
        success('Welcome!', 'Signed in with demo account')
      }
    } catch {
      showError('Demo Login Failed', 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6">
      <button
        onClick={handleDemoLogin}
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-150 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Try Demo Account'}
      </button>
      <p className="mt-2 text-xs text-center text-gray-500">
        Use demo credentials to explore Creo features
      </p>
    </div>
  )
}