'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse'
  text?: string
  className?: string
}

const Loading = ({ 
  size = 'md', 
  variant = 'spinner', 
  text,
  className 
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const renderSpinner = () => (
    <div className={cn('loading-spinner border-2', sizeClasses[size], className)} />
  )

  const renderDots = () => (
    <div className={cn('flex space-x-1', className)}>
      <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )

  const renderPulse = () => (
    <div className={cn('bg-orange-500 rounded-full animate-pulse', sizeClasses[size], className)} />
  )

  const renderContent = () => {
    switch (variant) {
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderContent()}
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

const LoadingSkeleton = ({ className, lines = 3 }: LoadingSkeletonProps) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'loading-shimmer h-4 rounded',
          i === lines - 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
)

interface LoadingCardProps {
  className?: string
}

const LoadingCard = ({ className }: LoadingCardProps) => (
  <div className={cn('card p-6 space-y-4', className)}>
    <div className="flex items-center space-x-3">
      <div className="loading-shimmer h-10 w-10 rounded-full" />
      <div className="space-y-2 flex-1">
        <div className="loading-shimmer h-4 w-1/2 rounded" />
        <div className="loading-shimmer h-3 w-1/3 rounded" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="loading-shimmer h-4 w-full rounded" />
      <div className="loading-shimmer h-4 w-4/5 rounded" />
      <div className="loading-shimmer h-4 w-3/5 rounded" />
    </div>
  </div>
)

export { Loading, LoadingSkeleton, LoadingCard }
export type { LoadingProps, LoadingSkeletonProps, LoadingCardProps }

