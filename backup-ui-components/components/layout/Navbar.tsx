'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { useState } from 'react'
import { AuthModal } from '@/components/auth/AuthModal'

export function Navbar() {
  const { user, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <span className="text-2xl font-bold text-primaryOrange">Creo</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/stock-search"
                className="text-gray-700 hover:text-primaryOrange transition-colors"
              >
                Stock Search
              </Link>
              
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-primaryOrange transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/ai-generation"
                    className="text-gray-700 hover:text-primaryOrange transition-colors"
                  >
                    AI Generation
                  </Link>
                  <Link
                    href="/orders"
                    className="text-gray-700 hover:text-primaryOrange transition-colors"
                  >
                    Orders
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    {user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-primaryOrange text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
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