'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton, SkeletonCard, SkeletonText } from './Skeleton'

interface LoadingStateProps {
  children: ReactNode
  isLoading: boolean
  skeleton?: ReactNode
  className?: string
  variant?: 'default' | 'card' | 'text' | 'image'
}

export function LoadingState({ 
  children, 
  isLoading, 
  skeleton,
  className,
  variant = 'default'
}: LoadingStateProps) {
  if (!isLoading) {
    return <>{children}</>
  }

  if (skeleton) {
    return <>{skeleton}</>
  }

  const defaultSkeletons = {
    default: <Skeleton className="h-32 w-full" />,
    card: <SkeletonCard />,
    text: <SkeletonText lines={3} />,
    image: <Skeleton className="aspect-square w-full rounded-lg" />
  }

  return (
    <div className={cn('animate-pulse', className)}>
      {defaultSkeletons[variant]}
    </div>
  )
}

// Specialized loading components
export function LoadingCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-20 w-full mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </div>
  )
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
}

export function LoadingTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Loading overlay for full-screen loading
export function LoadingOverlay({ 
  message = 'Loading...', 
  className 
}: { 
  message?: string
  className?: string 
}) {
  return (
    <div className={cn(
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
      className
    )}>
      <div className="bg-white rounded-lg p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
