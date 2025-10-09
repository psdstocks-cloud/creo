'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { 
  Bars3Icon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  BellIcon,
  WalletIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

export function EnhancedNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { 
    user, 
    userProfile, 
    balance, 
    userRole, 
    isDemoUser, 
    isAdmin,
    refreshBalance 
  } = useUser()
  
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Navigation items
  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: ClipboardDocumentListIcon,
      requiresAuth: true 
    },
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

  // Admin navigation
  const adminNavigation = [
    { name: 'Admin Panel', href: '/admin', icon: ShieldCheckIcon },
  ]

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-refresh balance every 30 seconds
  useEffect(() => {
    if (user) {
      const interval = setInterval(refreshBalance, 30000)
      return () => clearInterval(interval)
    }
  }, [user, refreshBalance])

  const handleSignOut = async () => {
    try {
      // Implement sign out logic
      router.push('/auth/signin')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                  Creo
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user && navigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const canAccess = !item.requiresAuth || user

                if (!canAccess) return null

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-md'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/60'
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
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Side - User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Credit Balance */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <button
                      onClick={() => router.push('/billing')}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 rounded-lg transition-all duration-200"
                    >
                      <WalletIcon className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">
                        ${balance.toFixed(2)}
                      </span>
                    </button>
                  </div>

                  {/* Notifications */}
                  <div className="relative" ref={notificationRef}>
                    <button
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className="relative p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100/60 transition-colors"
                    >
                      <BellIcon className="h-5 w-5" />
                      {/* Notification Badge */}
                      <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full transform translate-x-1 -translate-y-1"></span>
                    </button>

                    {/* Notifications Dropdown */}
                    {notificationsOpen && (
                      <NotificationsDropdown onClose={() => setNotificationsOpen(false)} />
                    )}
                  </div>

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-100/60 transition-colors"
                    >
                      {/* Avatar */}
                      <div className="relative">
                        {userProfile?.avatar_url ? (
                          <Image
                            src={userProfile.avatar_url}
                            alt={userProfile.full_name || 'User'}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-400 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {userProfile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        {/* Status Indicator */}
                        {isDemoUser && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-blue-500 rounded-full border-2 border-white"></div>
                        )}
                        {isAdmin && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-purple-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                          {userProfile?.full_name || (isDemoUser ? 'Demo User' : 'User')}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {userRole}
                        </div>
                      </div>
                    </button>

                    {/* User Dropdown Menu */}
                    {userMenuOpen && (
                      <UserDropdownMenu onClose={() => setUserMenuOpen(false)} onSignOut={handleSignOut} />
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 shadow-md transition-all duration-200"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100/60 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu 
          navigation={navigation}
          adminNavigation={adminNavigation}
          isAdmin={isAdmin}
          user={user}
          userProfile={userProfile}
          balance={balance}
          isDemoUser={isDemoUser}
          userRole={userRole}
          onClose={() => setMobileMenuOpen(false)}
          onSignOut={handleSignOut}
        />
      )}
    </>
  )
}

// User Dropdown Menu Component
function UserDropdownMenu({ onClose, onSignOut }: {
  onClose: () => void
  onSignOut: () => void
}) {
  const { userProfile, balance, userRole } = useUser()

  return (
    <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-white/95 backdrop-blur-md border border-gray-200/50 py-2 z-50">
      {/* User Info Header */}
      <div className="px-4 py-3 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-purple-600 flex items-center justify-center">
            <span className="text-white font-medium">
              {userProfile?.full_name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {userProfile?.full_name || 'User'}
            </div>
            <div className="text-xs text-gray-500">
              {userProfile?.email}
            </div>
            <div className="text-xs text-gray-400 capitalize">
              {userRole} • ${balance.toFixed(2)} balance
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <Link
          href="/settings"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/60 transition-colors"
          onClick={onClose}
        >
          <Cog6ToothIcon className="h-4 w-4 mr-3" />
          Settings & Preferences
        </Link>
        
        <Link
          href="/billing"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/60 transition-colors"
          onClick={onClose}
        >
          <CreditCardIcon className="h-4 w-4 mr-3" />
          Billing & Credits
        </Link>
        
        <div className="border-t border-gray-200/50 my-2"></div>
        
        <button
          onClick={() => {
            onSignOut()
            onClose()
          }}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

// Notifications Dropdown Component
function NotificationsDropdown({ onClose }: { onClose: () => void }) {
  // Mock notifications - in real app, fetch from API
  const notifications = [
    {
      id: 1,
      type: 'ai_complete',
      title: 'AI Generation Complete',
      message: 'Your "sunset landscape" image is ready for download',
      time: '2 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'order_ready',
      title: 'Stock Order Ready',
      message: 'Your Shutterstock image order is available',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'credits_low',
      title: 'Credits Running Low',
      message: 'You have $2.50 remaining in your account',
      time: '3 hours ago',
      unread: false
    }
  ]

  return (
    <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-lg bg-white/95 backdrop-blur-md border border-gray-200/50 py-2 z-50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200/50">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          <button className="text-xs text-purple-600 hover:text-purple-700">
            Mark all read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
              notification.unread ? 'bg-blue-50/50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`h-2 w-2 rounded-full mt-2 ${
                notification.unread ? 'bg-blue-500' : 'bg-gray-300'
              }`}></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  {notification.title}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {notification.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200/50">
        <button
          onClick={onClose}
          className="text-xs text-gray-500 hover:text-gray-700 w-full text-center"
        >
          View all notifications
        </button>
      </div>
    </div>
  )
}

// Mobile Menu Component
function MobileMenu({ 
  navigation, 
  adminNavigation, 
  isAdmin, 
  user, 
  userProfile, 
  balance, 
  isDemoUser, 
  userRole,
  onClose,
  onSignOut 
}: {
  navigation: Array<{ name: string; href: string; icon: React.ComponentType<{ className?: string }>; requiresAuth: boolean }>
  adminNavigation: Array<{ name: string; href: string; icon: React.ComponentType<{ className?: string }> }>
  isAdmin: boolean
  user: { id: string; email?: string } | null
  userProfile: { full_name?: string; email?: string } | null
  balance: number
  isDemoUser: boolean
  userRole: string | null
  onClose: () => void
  onSignOut: () => void
}) {
  return (
    <div className="md:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              Creo
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100/60"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {user && (
          <>
            {/* User Info */}
            <div className="p-4 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-400 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {userProfile?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {userProfile?.full_name || (isDemoUser ? 'Demo User' : 'User')}
                  </div>
                  <div className="text-sm text-gray-500">{userProfile?.email}</div>
                  <div className="text-sm text-gray-400 capitalize">
                    {userRole} • ${balance.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="py-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 transition-colors"
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5 mr-4" />
                  {item.name}
                </Link>
              ))}

              {isAdmin && (
                <div className="border-t border-gray-200/50 mt-2 pt-2">
                  {adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-4 py-3 text-base font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                      onClick={onClose}
                    >
                      <item.icon className="h-5 w-5 mr-4" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Settings & Sign Out */}
              <div className="border-t border-gray-200/50 mt-2 pt-2">
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 transition-colors"
                  onClick={onClose}
                >
                  <Cog6ToothIcon className="h-5 w-5 mr-4" />
                  Settings
                </Link>
                
                <button
                  onClick={() => {
                    onSignOut()
                    onClose()
                  }}
                  className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
