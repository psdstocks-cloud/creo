import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useFocusTrap } from '@/hooks/useKeyboardNavigation'

interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  initialFocus?: React.RefObject<HTMLElement>
  className?: string
}

export const AccessibleModal = forwardRef<HTMLDivElement, AccessibleModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      size = 'md',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      initialFocus,
      className,
    },
    ref
  ) => {
    const [mounted, setMounted] = useState(false)
    const modalRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const focusTrapRef = useFocusTrap(isOpen)

    // Handle mounting
    useEffect(() => {
      setMounted(true)
    }, [])

    // Handle escape key
    useEffect(() => {
      if (!isOpen || !closeOnEscape) return

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, closeOnEscape, onClose])

    // Handle focus management
    useEffect(() => {
      if (!isOpen) return

      // Store the previously focused element
      const previouslyFocusedElement = document.activeElement as HTMLElement

      // Focus the modal
      const focusElement = initialFocus?.current || titleRef.current || modalRef.current
      if (focusElement) {
        focusElement.focus()
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      return () => {
        // Restore body scroll
        document.body.style.overflow = ''
        
        // Restore focus to previously focused element
        if (previouslyFocusedElement) {
          previouslyFocusedElement.focus()
        }
      }
    }, [isOpen, initialFocus])

    // Handle overlay click
    const handleOverlayClick = (event: React.MouseEvent) => {
      if (closeOnOverlayClick && event.target === overlayRef.current) {
        onClose()
      }
    }

    // Size classes
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
    }

    if (!mounted || !isOpen) return null

    return createPortal(
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div
          ref={focusTrapRef}
          className={cn(
            'bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-y-auto',
            sizeClasses[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2
              ref={titleRef}
              id="modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md p-1"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div id="modal-description" className="sr-only">
              {title} dialog
            </div>
            {children}
          </div>
        </div>
      </div>,
      document.body
    )
  }
)

AccessibleModal.displayName = 'AccessibleModal'

// Modal content component
interface ModalContentProps {
  children: React.ReactNode
  className?: string
}

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-4', className)}>
        {children}
      </div>
    )
  }
)

ModalContent.displayName = 'ModalContent'

// Modal footer component
interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end space-x-3 pt-4 border-t border-gray-200',
          className
        )}
      >
        {children}
      </div>
    )
  }
)

ModalFooter.displayName = 'ModalFooter'

// Hook for managing modal state
export function useModal() {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}
