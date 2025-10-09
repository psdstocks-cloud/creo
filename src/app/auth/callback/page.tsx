'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
// import { useAuth } from '@/components/auth/AuthProvider'
import { useToastHelpers } from '@/components/ui/Toast'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { success, error: showError } = useToastHelpers()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient()
        
        // Get the URL hash and search params
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const searchParams = new URLSearchParams(window.location.search)
        
        // Check for auth tokens in URL
        const accessToken = hashParams.get('access_token') || searchParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token')
        const error = hashParams.get('error') || searchParams.get('error')
        const errorDescription = hashParams.get('error_description') || searchParams.get('error_description')
        
        if (error) {
          setStatus('error')
          setMessage(`Authentication error: ${errorDescription || error}`)
          showError('Authentication Error', errorDescription || error)
          
          // Redirect to signin after 3 seconds
          setTimeout(() => {
            router.push('/auth/signin')
          }, 3000)
          return
        }
        
        if (accessToken && refreshToken) {
          // Set the session with the tokens
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (sessionError) {
            throw sessionError
          }
          
          if (data.user) {
            setStatus('success')
            setMessage('Email confirmed successfully! Redirecting to dashboard...')
            success('Success!', 'Your email has been confirmed. Welcome to Creo!')
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
            return
          }
        }
        
        // If no tokens, try to get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw sessionError
        }
        
        if (session?.user) {
          setStatus('success')
          setMessage('Already authenticated! Redirecting to dashboard...')
          
          setTimeout(() => {
            router.push('/dashboard')
          }, 1000)
        } else {
          setStatus('error')
          setMessage('No authentication data found. Redirecting to sign in...')
          
          setTimeout(() => {
            router.push('/auth/signin')
          }, 2000)
        }
        
      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('error')
        setMessage('Authentication failed. Please try again.')
        showError('Authentication Failed', 'Please try signing in again.')
        
        setTimeout(() => {
          router.push('/auth/signin')
        }, 3000)
      }
    }
    
    handleAuthCallback()
  }, [router, success, showError])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-purple-100">
      <div className="max-w-md w-full mx-auto">
        <div className="glass-card rounded-xl shadow-lg p-8 sm:p-10 border border-white/20 bg-white/60 backdrop-blur-md text-center">
          <div className="mb-6">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
            )}
            {status === 'success' && (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {status === 'loading' && 'Processing...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Error'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          {status === 'loading' && (
            <div className="text-sm text-gray-500">
              Please wait while we verify your email...
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <button
                onClick={() => router.push('/auth/signin')}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Go to Sign In
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Try Sign Up Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
