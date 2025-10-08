'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { useUserBalance } from '@/hooks/useStockMedia'
import { AuthModal } from '@/components/auth/AuthModal'
import { 
  Bars3Icon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

export function Navbar() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Handle missing auth context gracefully
  let user = null
  let signOut = () => {}
  let isAdmin = false
  let userRole = null
  let isDemoUser = false
  
  try {
    const auth = useAuth()
    user = auth.user
    signOut = auth.signOut
    isAdmin = auth.isAdmin
    userRole = auth.userRole
    isDemoUser = auth.isDemoUser
  } catch (error) {
    // Auth context not available, continue without auth
    console.warn('Auth context not available:', error)
  }

  // Get user balance
  const { data: balance } = useUserBalance()

  const navigation = [
    { 
      name: 'Stock Search', 
      href: '/stock-search', 
      icon: MagnifyingGlassIcon,
      requiresAuth: true 
    },
    { 
      name: 'AI Generation', 
      href: '/ai-generation', 
      icon: SparklesIcon,
      requiresAuth: true 
    },
    { 
      name: 'Orders', 
      href: '/orders', 
      icon: ClipboardDocumentListIcon,
      requiresAuth: true 
    },
    { 
      name: 'Billing', 
      href: '/billing', 
      icon: CreditCardIcon,
      requiresAuth: true 
    },
  ]

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', requiresAdmin: true },
  ]

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                  Creo
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const canAccess = !item.requiresAuth || user
                
                if (!canAccess) return null

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}

              {/* Admin Navigation */}
              {isAdmin && adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Credit Balance */}
                  {balance && (
                    <div className="hidden sm:block">
                      <span className="text-sm font-medium text-gray-700">
                        ${balance.balance.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* User Info */}
                  <div className="relative group">
                    <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-400 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-2 hidden md:block">
                        <div className="text-sm font-medium text-gray-700">
                          {isDemoUser ? 'Demo User' : user.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {userRole}
                        </div>
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-1">
                        <Link
                          href="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Cog6ToothIcon className="h-4 w-4 mr-2" />
                          Settings
                        </Link>
                        <button
                          onClick={signOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                >
                  Sign In
                </button>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden -mr-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-sm border-t border-gray-200/50">
                {navigation.map((item) => {
                  const canAccess = !item.requiresAuth || user
                  if (!canAccess) return null

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}

                {user && (
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="flex items-center px-3">
                      <div className="text-base font-medium text-gray-800">
                        {isDemoUser ? 'Demo User' : user.email}
                      </div>
                      <div className="ml-auto text-sm text-gray-500">
                        ${balance?.balance.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      <Link
                        href="/settings"
                        className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}
