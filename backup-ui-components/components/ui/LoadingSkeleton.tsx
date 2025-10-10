import React from 'react'

interface LoadingSkeletonProps {
  className?: string
  lines?: number
  height?: string
  width?: string
}

export function LoadingSkeleton({ 
  className = '', 
  lines = 1, 
  height = 'h-4', 
  width = 'w-full' 
}: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded ${height} ${width} ${
            index < lines - 1 ? 'mb-2' : ''
          }`}
        />
      ))}
    </div>
  )
}

export function AuthLoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <LoadingSkeleton height="h-8" width="w-48" className="mx-auto mb-4" />
        </div>
        <div className="space-y-6">
          <div>
            <LoadingSkeleton height="h-4" width="w-24" className="mb-2" />
            <LoadingSkeleton height="h-10" width="w-full" />
          </div>
          <div>
            <LoadingSkeleton height="h-4" width="w-20" className="mb-2" />
            <LoadingSkeleton height="h-10" width="w-full" />
          </div>
          <LoadingSkeleton height="h-10" width="w-full" />
        </div>
      </div>
    </div>
  )
}

export function DashboardLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingSkeleton height="h-8" width="w-48" className="mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <LoadingSkeleton height="h-6" width="w-32" className="mb-2" />
            <LoadingSkeleton height="h-4" width="w-full" lines={2} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function NavbarLoadingSkeleton() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <LoadingSkeleton height="h-8" width="w-20" />
          </div>
          <div className="flex items-center space-x-4">
            <LoadingSkeleton height="h-8" width="w-24" />
            <LoadingSkeleton height="h-8" width="w-16" />
          </div>
        </div>
      </div>
    </nav>
  )
}
