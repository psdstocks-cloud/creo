'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import { Navbar } from './Navbar'
import { NavbarLoadingSkeleton } from '@/components/ui/LoadingSkeleton'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth()

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
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
