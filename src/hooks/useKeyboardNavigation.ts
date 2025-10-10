import { useEffect, useCallback, useRef } from 'react'

export function useKeyboardNavigation({
  onEscape,
  onEnter,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onTab,
  enabled = true,
}: {
  onEscape?: () => void
  onEnter?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onTab?: (shiftKey: boolean) => void
  enabled?: boolean
} = {}) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return
      
      switch (event.key) {
        case 'Escape':
          onEscape?.()
          break
        case 'Enter':
          onEnter?.()
          break
        case 'ArrowUp':
          event.preventDefault()
          onArrowUp?.()
          break
        case 'ArrowDown':
          event.preventDefault()
          onArrowDown?.()
          break
        case 'ArrowLeft':
          onArrowLeft?.()
          break
        case 'ArrowRight':
          onArrowRight?.()
          break
        case 'Tab':
          onTab?.(event.shiftKey)
          break
        default:
          break
      }
    },
    [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab]
  )

  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown, enabled])

  return { handleKeyDown }
}

// Focus management hook
export function useFocusManagement() {
  const lastFocusedElement = useRef<HTMLElement | null>(null)

  const saveFocus = useCallback(() => {
    lastFocusedElement.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = useCallback(() => {
    if (lastFocusedElement.current) {
      lastFocusedElement.current.focus()
      lastFocusedElement.current = null
    }
  }, [])

  const trapFocus = useCallback((containerElement: HTMLElement) => {
    const focusableElements = containerElement.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    )

    const firstFocusableElement = focusableElements[0] as HTMLElement
    const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus()
          e.preventDefault()
        }
      }
    }

    containerElement.addEventListener('keydown', handleTabKey)

    // Focus the first element initially
    firstFocusableElement?.focus()

    return () => {
      containerElement.removeEventListener('keydown', handleTabKey)
    }
  }, [])

  return {
    saveFocus,
    restoreFocus,
    trapFocus
  }
}

// Roving tabindex hook for managing focus within a group
export function useRovingTabIndex<T extends HTMLElement>({
  items,
  orientation = 'vertical',
  loop = true,
  onSelectionChange,
}: {
  items: T[]
  orientation?: 'vertical' | 'horizontal'
  loop?: boolean
  onSelectionChange?: (index: number) => void
}) {
  const currentIndex = useRef<number>(0)

  const moveFocus = useCallback(
    (direction: 'next' | 'previous') => {
      if (items.length === 0) return

      const increment = direction === 'next' ? 1 : -1
      let newIndex = currentIndex.current + increment

      if (loop) {
        if (newIndex < 0) newIndex = items.length - 1
        if (newIndex >= items.length) newIndex = 0
      } else {
        newIndex = Math.max(0, Math.min(items.length - 1, newIndex))
      }

      currentIndex.current = newIndex
      items[newIndex]?.focus()
      onSelectionChange?.(newIndex)
    },
    [items, loop, onSelectionChange]
  )

  const { handleKeyDown } = useKeyboardNavigation({
    onArrowUp: orientation === 'vertical' ? () => moveFocus('previous') : undefined,
    onArrowDown: orientation === 'vertical' ? () => moveFocus('next') : undefined,
    onArrowLeft: orientation === 'horizontal' ? () => moveFocus('previous') : undefined,
    onArrowRight: orientation === 'horizontal' ? () => moveFocus('next') : undefined,
  })

  // Set up tabindex attributes
  useEffect(() => {
    items.forEach((item, index) => {
      if (index === currentIndex.current) {
        item.setAttribute('tabindex', '0')
      } else {
        item.setAttribute('tabindex', '-1')
      }
    })
  }, [items])

  return {
    currentIndex: currentIndex.current,
    setCurrentIndex: (index: number) => {
      currentIndex.current = index
      items[index]?.focus()
      onSelectionChange?.(index)
    },
    handleKeyDown
  }
}
