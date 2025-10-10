'use client'

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  containerClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label,
    error,
    success,
    helperText,
    leftIcon,
    rightIcon,
    className,
    containerClassName,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    const inputClasses = cn(
      'input',
      error && 'input-error',
      success && 'input-success',
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      className
    )

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{leftIcon}</span>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{rightIcon}</span>
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }

