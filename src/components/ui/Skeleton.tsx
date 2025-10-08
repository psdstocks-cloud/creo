'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'card' | 'text' | 'circle'
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({ 
  className, 
  variant = 'default',
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = "bg-gray-200 dark:bg-gray-700"
  
  const variantClasses = {
    default: "rounded",
    card: "rounded-lg",
    text: "rounded-sm",
    circle: "rounded-full"
  }
  
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[wave_2s_ease-in-out_infinite]",
    none: ""
  }

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
    />
  )
}

// Predefined skeleton components for common use cases
export function SkeletonCard() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} 
        />
      ))}
    </div>
  )
}

export function SkeletonImage() {
  return (
    <Skeleton className="aspect-square w-full rounded-lg" />
  )
}

export function SkeletonButton() {
  return (
    <Skeleton className="h-10 w-24 rounded-lg" />
  )
}
