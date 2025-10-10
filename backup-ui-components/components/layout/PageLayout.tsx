'use client'
import { ReactNode } from 'react'
import { useUser } from '@/contexts/UserContext'

interface PageLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  requiresAuth?: boolean
  showHeader?: boolean
  className?: string
}

export function PageLayout({ 
  children, 
  title, 
  subtitle, 
  requiresAuth = false, 
  showHeader = true,
  className = '' 
}: PageLayoutProps) {
  const { user, isLoading } = useUser()

  if (requiresAuth && !user && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please sign in to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${className}`}>
      {showHeader && (title || subtitle) && (
        <div className="bg-white/60 backdrop-blur-md border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {title && (
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      
      <div>
        {children}
      </div>
    </div>
  )
}
