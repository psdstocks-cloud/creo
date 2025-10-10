'use client'
import React, { useState, useEffect } from 'react'
import { ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { ClientOnly } from './ClientOnly'

interface FormFieldProps {
  label: string
  type?: 'text' | 'email' | 'password' | 'tel'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  autoFocus?: boolean
  minLength?: number
  maxLength?: number
  className?: string
  name?: string
  id?: string
}

export function FormField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  autoComplete,
  autoFocus = false,
  minLength,
  maxLength,
  className,
  name,
  id
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  // Handle hydration mismatch with browser extensions
  useEffect(() => {
    setIsMounted(true)
    
    // Clean up browser extension elements that might cause hydration issues
    const cleanupExtensions = () => {
      const extensionSelectors = [
        '[data-lastpass-icon-root]',
        '[data-1password-icon-root]',
        '[data-bitwarden-icon-root]',
        '[data-dashlane-icon-root]',
        'div[style*="position:relative"][style*="height:0px"][style*="width:0px"]',
        'div[style*="position: absolute"][style*="height: 0px"][style*="width: 0px"]'
      ]
      
      extensionSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el)
          }
        })
      })
    }
    
    // Run cleanup after a short delay to allow extensions to inject
    const timeoutId = setTimeout(cleanupExtensions, 100)
    
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className={cn('space-y-1', className)}>
      <label 
        htmlFor={id || name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      
      <div className="relative form-field-container">
        <div className="relative">
          <input
            id={id || name}
            name={name}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete={autoComplete}
            autoFocus={isMounted ? autoFocus : false}
            minLength={minLength}
            maxLength={maxLength}
            disabled={disabled}
            className={cn(
              'w-full py-3 px-4 rounded-lg border outline-none transition-all duration-200',
              'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
              'focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
              isPassword && 'pr-12'
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
            suppressHydrationWarning={true}
            style={{
              position: 'relative',
              zIndex: 1
            }}
          />
          
          {/* Hidden div to capture browser extension injections */}
          <div 
            className="absolute inset-0 pointer-events-none"
            suppressHydrationWarning={true}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0
            }}
          />
        </div>
        
        {isPassword && (
          <ClientOnly
            fallback={
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <EyeIcon className="h-5 w-5" />
              </div>
            }
          >
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </ClientOnly>
        )}
      </div>
      
      {error && (
        <p 
          id={`${name}-error`}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={`${name}-helper`} className="text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}

interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const getStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return score
  }

  const strength = getStrength(password)
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

  if (!password) return null

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full transition-all duration-300',
              strengthColors[Math.min(strength - 1, 4)] || 'bg-gray-300'
            )}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600">
          {strengthLabels[Math.min(strength - 1, 4)] || 'Very Weak'}
        </span>
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-center gap-2">
          <div className={cn('w-1.5 h-1.5 rounded-full', password.length >= 8 ? 'bg-green-500' : 'bg-gray-300')} />
          <span>At least 8 characters</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn('w-1.5 h-1.5 rounded-full', /[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300')} />
          <span>Lowercase letter</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn('w-1.5 h-1.5 rounded-full', /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300')} />
          <span>Uppercase letter</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn('w-1.5 h-1.5 rounded-full', /[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300')} />
          <span>Number</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn('w-1.5 h-1.5 rounded-full', /[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300')} />
          <span>Special character</span>
        </div>
      </div>
    </div>
  )
}
