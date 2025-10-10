'use client'
import React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'frosted'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  children: React.ReactNode
}

export function GlassCard({
  children,
  variant = 'glass',
  padding = 'md',
  hover = false,
  className,
  ...props
}: GlassCardProps) {
  const variants = {
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg',
    solid: 'bg-white border border-gray-200 shadow-sm',
    frosted: 'bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl'
  }
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }
  
  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-300',
        variants[variant],
        paddings[padding],
        hover && 'hover:shadow-xl hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}