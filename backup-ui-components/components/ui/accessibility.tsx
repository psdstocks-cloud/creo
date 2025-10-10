'use client'
import { forwardRef, useId, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

// Accessible Form Field Context
interface FormFieldContextValue {
  id: string
  name: string
  formItemId: string
  formDescriptionId: string
  formMessageId: string
}

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue)

export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }
  
  const { id } = itemContext
  
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldContext,
  }
}

const FormItemContext = createContext<{ id: string }>({} as { id: string })

// Accessible Form Components
export const FormField = ({ children, name }: { children: React.ReactNode; name: string }) => {
  const id = useId()
  
  return (
    <FormFieldContext.Provider
      value={{
        id,
        name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
      }}
    >
      <FormItemContext.Provider value={{ id }}>
        {children}
      </FormItemContext.Provider>
    </FormFieldContext.Provider>
  )
}

export const FormItem = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { id } = useContext(FormItemContext)
    
    return (
      <div 
        ref={ref} 
        id={id} 
        className={cn("space-y-2", className)} 
        {...props} 
      />
    )
  }
)
FormItem.displayName = "FormItem"

export const FormLabel = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    const { formItemId } = useFormField()
    
    return (
      <label
        ref={ref}
        className={cn(
          "block text-sm font-medium text-gray-700 mb-1",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        htmlFor={formItemId}
        {...props}
      />
    )
  }
)
FormLabel.displayName = "FormLabel"

export const FormControl = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => {
    const { formItemId, formDescriptionId, formMessageId } = useFormField()
    
    return (
      <div
        ref={ref}
        id={formItemId}
        aria-describedby={`${formDescriptionId} ${formMessageId}`}
        aria-invalid="false"
        {...props}
      />
    )
  }
)
FormControl.displayName = "FormControl"

export const FormDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField()
    
    return (
      <p
        ref={ref}
        id={formDescriptionId}
        className={cn("text-sm text-gray-600", className)}
        {...props}
      />
    )
  }
)
FormDescription.displayName = "FormDescription"

export const FormMessage = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { formMessageId } = useFormField()
    
    if (!children) return null
    
    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn("text-sm font-medium text-red-600 flex items-center gap-1", className)}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {children}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage"

// Accessible Status Badge
export const StatusBadge = forwardRef<
  HTMLSpanElement,
  {
    status: 'success' | 'error' | 'warning' | 'info' | 'processing'
    children: React.ReactNode
    className?: string
    showIcon?: boolean
  }
>(({ status, children, className, showIcon = true, ...props }, ref) => {
  const statusConfig = {
    success: {
      className: 'status-success',
      ariaLabel: 'Success status',
      icon: '✓'
    },
    error: {
      className: 'status-error', 
      ariaLabel: 'Error status',
      icon: '✗'
    },
    warning: {
      className: 'status-warning',
      ariaLabel: 'Warning status', 
      icon: '⚠'
    },
    info: {
      className: 'status-info',
      ariaLabel: 'Information status',
      icon: 'ℹ'
    },
    processing: {
      className: 'status-processing',
      ariaLabel: 'Processing status',
      icon: '⏳'
    }
  }
  
  const config = statusConfig[status]
  
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
      role="status"
      aria-label={config.ariaLabel}
      {...props}
    >
      {showIcon && (
        <span className="mr-1" aria-hidden="true">
          {config.icon}
        </span>
      )}
      {children}
    </span>
  )
})
StatusBadge.displayName = "StatusBadge"

// Accessible Loading States
export const LoadingSpinner = forwardRef<
  HTMLDivElement,
  {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    'aria-label'?: string
  }
>(({ size = 'md', className, 'aria-label': ariaLabel = 'Loading', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-orange-500',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={ariaLabel}
      {...props}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  )
})
LoadingSpinner.displayName = "LoadingSpinner"

// Skip Link for Keyboard Navigation
export const SkipLink = ({ href = '#main-content', children = 'Skip to main content' }: {
  href?: string
  children?: React.ReactNode
}) => {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
        'z-50 px-4 py-2 bg-orange-600 text-white rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
      )}
    >
      {children}
    </a>
  )
}

// Accessible Modal/Dialog
export const Dialog = forwardRef<
  HTMLDivElement,
  {
    open: boolean
    onClose: () => void
    children: React.ReactNode
    className?: string
    'aria-labelledby'?: string
    'aria-describedby'?: string
  }
>(({ open, onClose, children, className, 'aria-labelledby': ariaLabelledby, 'aria-describedby': ariaDescribedby }, ref) => {
  if (!open) return null
  
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      onClick={onClose}
    >
      <div
        ref={ref}
        className={cn(
          'glass-card max-w-md w-full p-6 max-h-[90vh] overflow-auto',
          'focus:outline-none',
          className
        )}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  )
})
Dialog.displayName = "Dialog"

// Accessible Button Components
export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    loadingText?: string
  }
>(({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  loadingText = 'Loading...', 
  className, 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium rounded-lg',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-all duration-200'
  )
  
  const variants = {
    primary: 'button-primary',
    secondary: 'button-secondary', 
    success: 'button-success',
    danger: 'button-danger',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size], 
        className
      )}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size="sm" 
          className="mr-2" 
          aria-label={loadingText}
        />
      )}
      {loading ? loadingText : children}
    </button>
  )
})
Button.displayName = "Button"
