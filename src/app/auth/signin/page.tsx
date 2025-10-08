'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth } from '@/components/auth/AuthProvider'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  useEffect(() => {
    if (user) {
      router.push(redirectTo)
    }
  }, [user, router, redirectTo])

  if (user) {
    return <div>Redirecting...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <AuthModal
          isOpen={true}
          onClose={() => router.push('/')}
          initialMode="signin"
        />
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
