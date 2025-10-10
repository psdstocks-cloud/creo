'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BrandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: boolean
  loading?: boolean
}

export function BrandButton({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md',
  glow = false,
  loading = false,
  disabled,
  ...props
}: BrandButtonProps) {
  const baseClasses = "font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variantClasses = {
    primary: "bg-gradient-brand text-white hover:shadow-glow-orange-strong focus:ring-orange-500",
    secondary: "bg-gradient-brand-reverse text-white hover:shadow-glow-purple-strong focus:ring-purple-500",
    glass: "bg-gray-800/90 backdrop-blur-glass border border-gray-700/50 text-white hover:bg-gray-700/90 hover:shadow-lg focus:ring-gray-500",
    ghost: "text-orange-500 hover:bg-orange-50 focus:ring-orange-500",
    outline: "border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white focus:ring-orange-500"
  }
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  }
  
  const glowClasses = glow ? "animate-glow-pulse" : ""

  return (
    <button 
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glowClasses,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  )
}
