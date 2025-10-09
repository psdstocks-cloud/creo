'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { 
  HomeIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

export function MobileTabBar() {
  const { user } = useUser()
  const pathname = usePathname()
  
  if (!user) return null

  const tabs = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Search', href: '/stock-search', icon: MagnifyingGlassIcon },
    { name: 'AI Gen', href: '/ai-generation', icon: SparklesIcon },
    { name: 'Orders', href: '/orders', icon: ClipboardDocumentListIcon },
    { name: 'Profile', href: '/settings', icon: UserCircleIcon },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 z-40">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className="flex-1 relative"
            >
              <div className={`flex flex-col items-center py-2 px-1 ${
                isActive ? 'text-purple-600' : 'text-gray-500'
              }`}>
                <div className="relative">
                  <tab.icon className="h-6 w-6" />
                  {isActive && (
                    <div className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-purple-100 rounded-lg -z-10"></div>
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">{tab.name}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// Add bottom padding to pages when mobile tab bar is visible
export function useMobileTabBarPadding() {
  const { user } = useUser()
  return user ? 'pb-20 md:pb-0' : ''
}
