'use client'

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'btn'
    const sizeClasses = {
      sm: 'btn-sm',
      md: 'btn-md', 
      lg: 'btn-lg',
      xl: 'btn-xl'
    }
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      outline: 'btn-outline',
      glass: 'btn-glass'
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="loading-spinner h-4 w-4 mr-2" />
            Loading...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </div>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
