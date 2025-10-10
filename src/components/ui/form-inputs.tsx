'use client'
import { forwardRef, useState } from 'react'
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

// Accessible Input Component
export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string
    helperText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
  }
>(({ className, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
  const hasError = !!error
  
  return (
    <div className="w-full">
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400 h-5 w-5">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          className={cn(
            'form-input w-full',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            hasError && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${props.id}-error` : 
            helperText ? `${props.id}-helper` : undefined
          }
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="text-gray-400 h-5 w-5">
              {rightIcon}
            </div>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      
      {helperText && !error && (
        <p 
          id={`${props.id}-helper`}
          className="mt-1 text-sm text-gray-600"
        >
          {helperText}
        </p>
      )}
      
      {error && (
        <p 
          id={`${props.id}-error`}
          className="mt-1 text-sm text-red-600 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
})
Input.displayName = "Input"

// Accessible Password Input
export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    error?: string
    helperText?: string
  }
>(({ error, helperText, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  
  return (
    <Input
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      error={error}
      helperText={helperText}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={0}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <EyeIcon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      }
      {...props}
    />
  )
})
PasswordInput.displayName = "PasswordInput"

// Accessible Textarea
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    error?: string
    helperText?: string
    showCharCount?: boolean
    maxLength?: number
  }
>(({ className, error, helperText, showCharCount, maxLength, value, ...props }, ref) => {
  const hasError = !!error
  const currentLength = typeof value === 'string' ? value.length : 0
  
  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          ref={ref}
          className={cn(
            'form-textarea w-full min-h-[100px]',
            hasError && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            showCharCount && maxLength && 'pb-6',
            className
          )}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${props.id}-error` : 
            helperText ? `${props.id}-helper` : 
            showCharCount ? `${props.id}-count` : undefined
          }
          value={value}
          {...props}
        />
        
        {showCharCount && maxLength && (
          <div 
            id={`${props.id}-count`}
            className="absolute bottom-2 right-2 text-xs text-gray-500"
            aria-live="polite"
          >
            <span className={currentLength > maxLength * 0.9 ? 'text-orange-600' : ''}>
              {currentLength}
            </span>
            /{maxLength}
          </div>
        )}
      </div>
      
      {helperText && !error && (
        <p 
          id={`${props.id}-helper`}
          className="mt-1 text-sm text-gray-600"
        >
          {helperText}
        </p>
      )}
      
      {error && (
        <p 
          id={`${props.id}-error`}
          className="mt-1 text-sm text-red-600 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
})
Textarea.displayName = "Textarea"

// Accessible Select
export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    error?: string
    helperText?: string
    placeholder?: string
  }
>(({ className, error, helperText, placeholder, children, ...props }, ref) => {
  const hasError = !!error
  
  return (
    <div className="w-full">
      <select
        ref={ref}
        className={cn(
          'form-select w-full',
          hasError && 'border-red-300 focus:ring-red-500 focus:border-red-500',
          className
        )}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${props.id}-error` : 
          helperText ? `${props.id}-helper` : undefined
        }
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      
      {helperText && !error && (
        <p 
          id={`${props.id}-helper`}
          className="mt-1 text-sm text-gray-600"
        >
          {helperText}
        </p>
      )}
      
      {error && (
        <p 
          id={`${props.id}-error`}
          className="mt-1 text-sm text-red-600 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
})
Select.displayName = "Select"

// Accessible Checkbox
export const Checkbox = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    error?: string
    helperText?: string
  }
>(({ className, label, error, helperText, id, ...props }, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
  const hasError = !!error
  
  return (
    <div className="w-full">
      <div className="flex items-start space-x-3">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              'form-checkbox',
              hasError && 'border-red-300 focus:ring-red-500',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${checkboxId}-error` : 
              helperText ? `${checkboxId}-helper` : undefined
            }
            {...props}
          />
        </div>
        
        {label && (
          <div className="flex-1">
            <label
              htmlFor={checkboxId}
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              {label}
            </label>
            
            {helperText && !error && (
              <p 
                id={`${checkboxId}-helper`}
                className="text-sm text-gray-600 mt-1"
              >
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p 
          id={`${checkboxId}-error`}
          className="mt-1 text-sm text-red-600 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
})
Checkbox.displayName = "Checkbox"

// Accessible Radio Group
export const RadioGroup = ({ 
  name, 
  value, 
  onChange, 
  error, 
  helperText, 
  children,
  className 
}: {
  name: string
  value: string
  onChange: (value: string) => void
  error?: string
  helperText?: string
  children: React.ReactNode
  className?: string
}) => {
  const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className={cn("w-full", className)}>
      <fieldset
        role="radiogroup"
        aria-labelledby={`${groupId}-legend`}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${groupId}-error` : 
          helperText ? `${groupId}-helper` : undefined
        }
      >
        <div className="space-y-2">
          {children}
        </div>
      </fieldset>
      
      {helperText && !error && (
        <p 
          id={`${groupId}-helper`}
          className="mt-1 text-sm text-gray-600"
        >
          {helperText}
        </p>
      )}
      
      {error && (
        <p 
          id={`${groupId}-error`}
          className="mt-1 text-sm text-red-600 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

export const RadioOption = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string
    description?: string
  }
>(({ label, description, className, id, ...props }, ref) => {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className="flex items-start space-x-3">
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={cn(
            'form-radio w-4 h-4 text-orange-600 border-gray-300',
            'focus:ring-orange-500 focus:ring-2 focus:ring-offset-2',
            className
          )}
          {...props}
        />
      </div>
      
      <div className="flex-1">
        <label
          htmlFor={radioId}
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          {label}
        </label>
        
        {description && (
          <p className="text-sm text-gray-600 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  )
})
RadioOption.displayName = "RadioOption"
