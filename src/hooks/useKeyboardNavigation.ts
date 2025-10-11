import { useEffect, useCallback, useRef, useState } from 'react'

// Keyboard navigation hook for WCAG 2.1 AA compliance
export function useKeyboardNavigation() {
  const containerRef = useRef<HTMLElement>(null)
  const focusableElementsRef = useRef<HTMLElement[]>([])
  const currentIndexRef = useRef(0)

  // Get all focusable elements
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return []

    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ')

    const elements = Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[]

    // Filter out hidden elements
    return elements.filter(element => {
      const style = window.getComputedStyle(element)
      return style.display !== 'none' && style.visibility !== 'hidden'
    })
  }, [])

  // Update focusable elements
  const updateFocusableElements = useCallback(() => {
    focusableElementsRef.current = getFocusableElements()
  }, [getFocusableElements])

  // Focus next element
  const focusNext = useCallback(() => {
    updateFocusableElements()
    const elements = focusableElementsRef.current
    
    if (elements.length === 0) return

    currentIndexRef.current = (currentIndexRef.current + 1) % elements.length
    elements[currentIndexRef.current]?.focus()
  }, [updateFocusableElements])

  // Focus previous element
  const focusPrevious = useCallback(() => {
    updateFocusableElements()
    const elements = focusableElementsRef.current
    
    if (elements.length === 0) return

    currentIndexRef.current = currentIndexRef.current === 0 
      ? elements.length - 1 
      : currentIndexRef.current - 1
    elements[currentIndexRef.current]?.focus()
  }, [updateFocusableElements])

  // Focus first element
  const focusFirst = useCallback(() => {
    updateFocusableElements()
    const elements = focusableElementsRef.current
    
    if (elements.length === 0) return

    currentIndexRef.current = 0
    elements[0]?.focus()
  }, [updateFocusableElements])

  // Focus last element
  const focusLast = useCallback(() => {
    updateFocusableElements()
    const elements = focusableElementsRef.current
    
    if (elements.length === 0) return

    currentIndexRef.current = elements.length - 1
    elements[elements.length - 1]?.focus()
  }, [updateFocusableElements])

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Tab':
        if (event.shiftKey) {
          event.preventDefault()
          focusPrevious()
        } else {
          event.preventDefault()
          focusNext()
        }
        break
      case 'Home':
        event.preventDefault()
        focusFirst()
        break
      case 'End':
        event.preventDefault()
        focusLast()
        break
      case 'Escape':
        // Close modals, dropdowns, etc.
        const activeElement = document.activeElement as HTMLElement
        if (activeElement) {
          const closeButton = activeElement.closest('[role="dialog"]')?.querySelector('[aria-label*="close"], [aria-label*="Close"]')
          if (closeButton) {
            (closeButton as HTMLElement).click()
          }
        }
        break
    }
  }, [focusNext, focusPrevious, focusFirst, focusLast])

  // Set up keyboard event listeners
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  // Update focusable elements when container changes
  useEffect(() => {
    updateFocusableElements()
  }, [updateFocusableElements])

  return {
    containerRef,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    updateFocusableElements,
  }
}

// Focus trap hook for modals and dropdowns
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Store the previously focused element
    previousActiveElementRef.current = document.activeElement as HTMLElement

    // Focus the first focusable element in the trap
    const focusableElements = containerRef.current.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus()
    }

    // Handle tab navigation within the trap
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusableElements = Array.from(
        containerRef.current!.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[]

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      
      // Restore focus to the previously focused element
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [isActive])

  return containerRef
}

// Skip link hook for main content navigation
export function useSkipLink() {
  const skipLinkRef = useRef<HTMLAnchorElement>(null)

  const handleSkipLink = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const target = document.querySelector('#main-content')
      if (target) {
        (target as HTMLElement).focus()
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  return {
    skipLinkRef,
    handleSkipLink,
  }
}

// Keyboard shortcuts hook
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const ctrlKey = event.ctrlKey || event.metaKey
      const altKey = event.altKey
      const shiftKey = event.shiftKey

      // Create shortcut key
      let shortcutKey = key
      if (ctrlKey) shortcutKey = `ctrl+${shortcutKey}`
      if (altKey) shortcutKey = `alt+${shortcutKey}`
      if (shiftKey) shortcutKey = `shift+${shortcutKey}`

      // Check if shortcut exists
      if (shortcuts[shortcutKey]) {
        event.preventDefault()
        shortcuts[shortcutKey]()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

// Screen reader announcements hook
export function useScreenReaderAnnouncement() {
  const announceRef = useRef<HTMLDivElement>(null)

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority)
      announceRef.current.textContent = message
      
      // Clear the message after a short delay
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = ''
        }
      }, 1000)
    }
  }, [])

  return {
    announceRef,
    announce,
  }
}

// High contrast mode detection hook
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    const checkHighContrast = () => {
      // Check for Windows High Contrast Mode
      if (window.matchMedia('(-ms-high-contrast: active)').matches) {
        setIsHighContrast(true)
        return
      }

      // Check for forced colors
      if (window.matchMedia('(forced-colors: active)').matches) {
        setIsHighContrast(true)
        return
      }

      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setIsHighContrast(true)
        return
      }

      setIsHighContrast(false)
    }

    checkHighContrast()

    // Listen for changes
    const mediaQuery = window.matchMedia('(-ms-high-contrast: active)')
    mediaQuery.addEventListener('change', checkHighContrast)

    return () => {
      mediaQuery.removeEventListener('change', checkHighContrast)
    }
  }, [])

  return isHighContrast
}

// Reduced motion detection hook
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}