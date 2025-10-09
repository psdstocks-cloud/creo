'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/components/auth/AuthProvider'
import { useToastHelpers } from '@/components/ui/Toast'

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, loading, user } = useAuth()
  const { success, error: showError } = useToastHelpers()
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<{
    email: string, password: string, confirm: string
  }>()

  // For live password confirmation
  const password = watch('password')

  // Redirect if already logged in
  if (user) {
    router.push('/dashboard')
    return null
  }

  const onSubmit = async (data: { email: string, password: string, confirm: string }) => {
    setSubmitting(true)
    
    // Client-side validation
    if (data.password !== data.confirm) {
      showError('Error', 'Passwords do not match.')
      setSubmitting(false)
      return
    }
    
    if (data.password.length < 8) {
      showError('Error', 'Password must be at least 8 characters.')
      setSubmitting(false)
      return
    }

    try {
      const { error } = await signUp({ email: data.email, password: data.password })
      
      if (!error) {
        success('Account created!', 'Check your email to verify and log in.')
        // Auto-redirect to sign-in after a delay
        setTimeout(() => router.push('/auth/signin'), 2000)
      } else {
        showError('Signup Error', error.message)
      }
    } catch {
      showError('Error', 'An unexpected error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-orange-100 via-white to-purple-100 px-4 py-12">
      <div className="max-w-md w-full mx-auto">
        <div className="glass-card rounded-xl shadow-lg p-8 sm:p-10 border border-white/20 bg-white/60 backdrop-blur-md relative">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Create your Creo Account
            </h1>
            <p className="mt-2 text-gray-600 text-sm">
              Join Creo to access stock media & AI generation
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                autoFocus
                autoComplete="email"
                placeholder="you@email.com"
                {...register('email', { 
                  required: 'Email required', 
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                className={`w-full py-2 px-4 rounded-lg border outline-none bg-white/60 border-gray-200 focus:ring-2 focus:ring-orange-400 transition-colors ${
                  errors.email ? 'border-red-300 focus:ring-red-400' : ''
                }`}
                disabled={submitting || loading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  {errors.email.message}
                </p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                autoComplete="new-password"
                {...register('password', { 
                  required: 'Password required', 
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                className={`w-full py-2 px-4 rounded-lg border outline-none bg-white/60 border-gray-200 focus:ring-2 focus:ring-orange-400 transition-colors ${
                  errors.password ? 'border-red-300 focus:ring-red-400' : ''
                }`}
                disabled={submitting || loading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  {errors.password.message}
                </p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Repeat your password"
                {...register('confirm', { 
                  required: 'Please confirm your password', 
                  validate: (value) => value === password || "Passwords do not match"
                })}
                className={`w-full py-2 px-4 rounded-lg border outline-none bg-white/60 border-gray-200 focus:ring-2 focus:ring-orange-400 transition-colors ${
                  errors.confirm ? 'border-red-300 focus:ring-red-400' : ''
                }`}
                disabled={submitting || loading}
              />
              {errors.confirm && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  {errors.confirm.message}
                </p>
              )}
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-150 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting || loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="font-semibold text-orange-600 hover:text-purple-600 underline transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
        
        {/* Terms and Privacy */}
        <div className="text-xs text-center text-gray-400 mt-10">
          By signing up, you agree to the{' '}
          <Link href="/terms" className="underline hover:text-gray-600 transition-colors">
            Terms of Service
          </Link>{' '}
          &{' '}
          <Link href="/privacy" className="underline hover:text-gray-600 transition-colors">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
      
      <style jsx>{`
        .glass-card {
          box-shadow: 0 4px 32px 8px rgba(80,38,171,0.03), 0 1.5px 1.5px rgba(255,129,27,0.012);
        }
      `}</style>
    </div>
  )
}
