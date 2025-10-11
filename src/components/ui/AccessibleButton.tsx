import React, { forwardRef, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  // Accessibility props
  ariaDescribedBy?: string
  ariaExpanded?: boolean
  ariaControls?: string
  ariaPressed?: boolean
  ariaCurrent?: boolean | 'page' | 'step' | 'location' | 'date' | 'time'
  // Screen reader support
  screenReaderText?: string
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText = 'Loading...',
      icon,
      iconPosition = 'left',
      fullWidth = false,
      children,
      disabled,
      ariaDescribedBy,
      ariaExpanded,
      ariaControls,
      ariaPressed,
      ariaCurrent,
      screenReaderText,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const loadingRef = useRef<HTMLSpanElement>(null)

    // Combine refs
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(buttonRef.current)
      } else if (ref) {
        ref.current = buttonRef.current
      }
    }, [ref])

    // Announce loading state to screen readers
    useEffect(() => {
      if (loading && loadingRef.current) {
        const announcement = document.createElement('div')
        announcement.setAttribute('aria-live', 'polite')
        announcement.setAttribute('aria-atomic', 'true')
        announcement.className = 'sr-only'
        announcement.textContent = loadingText
        document.body.appendChild(announcement)
        
        setTimeout(() => {
          document.body.removeChild(announcement)
        }, 1000)
      }
    }, [loading, loadingText])

    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-md',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'min-h-[44px]', // WCAG minimum touch target size
    ]

    const variantClasses = {
      primary: [
        'bg-orange-600 text-white',
        'hover:bg-orange-700',
        'focus:ring-orange-500',
        'active:bg-orange-800',
      ],
      secondary: [
        'bg-gray-100 text-gray-900',
        'hover:bg-gray-200',
        'focus:ring-gray-500',
        'active:bg-gray-300',
      ],
      outline: [
        'border border-gray-300 bg-white text-gray-700',
        'hover:bg-gray-50',
        'focus:ring-gray-500',
        'active:bg-gray-100',
      ],
      ghost: [
        'text-gray-700',
        'hover:bg-gray-100',
        'focus:ring-gray-500',
        'active:bg-gray-200',
      ],
      destructive: [
        'bg-red-600 text-white',
        'hover:bg-red-700',
        'focus:ring-red-500',
        'active:bg-red-800',
      ],
    }

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-2 text-base min-h-[44px]',
      lg: 'px-6 py-3 text-lg min-h-[52px]',
    }

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    )

    const isDisabled = disabled || loading

    return (
      <button
        ref={buttonRef}
        className={classes}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-describedby={ariaDescribedBy}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-pressed={ariaPressed}
        aria-current={ariaCurrent}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Icon */}
        {icon && !loading && iconPosition === 'left' && (
          <span className="mr-2" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Button text */}
        <span>
          {loading ? loadingText : children}
        </span>

        {/* Screen reader text */}
        {screenReaderText && (
          <span className="sr-only">{screenReaderText}</span>
        )}

        {/* Icon */}
        {icon && !loading && iconPosition === 'right' && (
          <span className="ml-2" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Loading state for screen readers */}
        {loading && (
          <span ref={loadingRef} className="sr-only" aria-live="polite">
            {loadingText}
          </span>
        )}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

export { AccessibleButton }
export type { AccessibleButtonProps }
