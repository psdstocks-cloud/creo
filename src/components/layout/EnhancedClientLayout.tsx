'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import { EnhancedNavbar } from './EnhancedNavbar'
import { MobileTabBar, useMobileTabBarPadding } from './MobileTabBar'
import { Breadcrumbs } from './Breadcrumbs'
import { NavbarLoadingSkeleton } from '@/components/ui/LoadingSkeleton'

export function EnhancedClientLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth()
  const paddingClass = useMobileTabBarPadding()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarLoadingSkeleton />
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedNavbar />
      <Breadcrumbs />
      <main className={`min-h-screen ${paddingClass}`}>
        {children}
      </main>
      <MobileTabBar />
    </div>
  )
}
