'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface BrandInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  variant?: 'default' | 'glass' | 'outline'
}

export const BrandInput = forwardRef<HTMLInputElement, BrandInputProps>(
  ({ className, label, error, variant = 'default', ...props }, ref) => {
    const baseClasses = "w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
    
    const variantClasses = {
      default: "bg-white border border-gray-300 focus:ring-orange-500 focus:border-orange-500",
      glass: "bg-glass-white backdrop-blur-glass border border-white/20 text-white placeholder-white/70 focus:ring-orange-500 focus:border-orange-500",
      outline: "bg-transparent border-2 border-orange-500 focus:ring-orange-500 focus:border-orange-600"
    }

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          className={cn(
            baseClasses,
            variantClasses[variant],
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

BrandInput.displayName = "BrandInput"
