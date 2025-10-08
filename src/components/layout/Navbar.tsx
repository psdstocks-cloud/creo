'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { useState } from 'react'
import { AuthModal } from '@/components/auth/AuthModal'

export function Navbar() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  // Handle missing auth context gracefully
  let user = null
  let signOut = () => {}
  
  try {
    const auth = useAuth()
    user = auth.user
    signOut = auth.signOut
  } catch (error) {
    // Auth context not available, continue without auth
    console.warn('Auth context not available:', error)
  }

  return (
    <>
      <nav className="bg-glass-white backdrop-blur-glass border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <span className="text-2xl font-bold bg-gradient-brand bg-clip-text text-transparent font-display">
                  Creo
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/stock-search"
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                Stock Search
              </Link>
              
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-white/80 hover:text-white transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/ai-generation"
                    className="text-white/80 hover:text-white transition-colors font-medium"
                  >
                    AI Generation
                  </Link>
                  <Link
                    href="/orders"
                    className="text-white/80 hover:text-white transition-colors font-medium"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/billing"
                    className="text-white/80 hover:text-white transition-colors font-medium"
                  >
                    Billing
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-white/80">
                    {user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="bg-glass-white backdrop-blur-glass border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-glass-white-strong transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-brand text-white px-4 py-2 rounded-lg hover:shadow-glow-orange-strong transition-all duration-300 font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}
