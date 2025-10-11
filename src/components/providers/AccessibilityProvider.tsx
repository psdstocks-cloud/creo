'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useKeyboardNavigation, useScreenReaderAnnouncement, useHighContrastMode, useReducedMotion } from '@/hooks/useKeyboardNavigation'

interface AccessibilityContextType {
  // Keyboard navigation
  isKeyboardNavigation: boolean
  setKeyboardNavigation: (enabled: boolean) => void
  
  // Screen reader support
  announce: (message: string, priority?: 'polite' | 'assertive') => void
  
  // High contrast mode
  isHighContrast: boolean
  
  // Reduced motion
  prefersReducedMotion: boolean
  
  // Focus management
  focusMainContent: () => void
  focusSkipLink: () => void
  
  // Keyboard shortcuts
  showKeyboardShortcuts: boolean
  setShowKeyboardShortcuts: (show: boolean) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  
  const { announce } = useScreenReaderAnnouncement()
  const isHighContrast = useHighContrastMode()
  const prefersReducedMotion = useReducedMotion()

  // Detect keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsKeyboardNavigation(true)
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardNavigation(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  // Focus management functions
  const focusMainContent = () => {
    const mainContent = document.querySelector('#main-content')
    if (mainContent) {
      (mainContent as HTMLElement).focus()
      announce('Navigated to main content')
    }
  }

  const focusSkipLink = () => {
    const skipLink = document.querySelector('[href="#main-content"]')
    if (skipLink) {
      (skipLink as HTMLElement).focus()
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show keyboard shortcuts (Ctrl + / or Cmd + /)
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault()
        setShowKeyboardShortcuts(true)
      }

      // Focus main content (Alt + M)
      if (event.altKey && event.key === 'm') {
        event.preventDefault()
        focusMainContent()
      }

      // Skip to navigation (Alt + N)
      if (event.altKey && event.key === 'n') {
        event.preventDefault()
        const navigation = document.querySelector('nav')
        if (navigation) {
          (navigation as HTMLElement).focus()
          announce('Navigated to main navigation')
        }
      }

      // Skip to search (Alt + S)
      if (event.altKey && event.key === 's') {
        event.preventDefault()
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]')
        if (searchInput) {
          (searchInput as HTMLElement).focus()
          announce('Navigated to search')
        }
      }

      // Close modals (Escape)
      if (event.key === 'Escape') {
        const modal = document.querySelector('[role="dialog"][aria-modal="true"]')
        if (modal) {
          const closeButton = modal.querySelector('[aria-label*="close" i], [aria-label*="Close"]')
          if (closeButton) {
            (closeButton as HTMLElement).click()
            announce('Modal closed')
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [announce])

  const value: AccessibilityContextType = {
    isKeyboardNavigation,
    setKeyboardNavigation: setIsKeyboardNavigation,
    announce,
    isHighContrast,
    prefersReducedMotion,
    focusMainContent,
    focusSkipLink,
    showKeyboardShortcuts,
    setShowKeyboardShortcuts,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      
      {/* Screen reader announcements */}
      <div
        ref={announce}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      />
      
      {/* Keyboard shortcuts modal */}
      {showKeyboardShortcuts && (
        <KeyboardShortcutsModal
          onClose={() => setShowKeyboardShortcuts(false)}
        />
      )}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

// Keyboard shortcuts modal component
function KeyboardShortcutsModal({ onClose }: { onClose: () => void }) {
  const { announce } = useAccessibility()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    announce('Keyboard shortcuts dialog opened')
    return () => announce('Keyboard shortcuts dialog closed')
  }, [announce])

  const shortcuts = [
    { key: 'Ctrl + /', description: 'Show keyboard shortcuts' },
    { key: 'Alt + M', description: 'Focus main content' },
    { key: 'Alt + N', description: 'Focus navigation' },
    { key: 'Alt + S', description: 'Focus search' },
    { key: 'Tab', description: 'Navigate forward' },
    { key: 'Shift + Tab', description: 'Navigate backward' },
    { key: 'Escape', description: 'Close modal or menu' },
    { key: 'Enter', description: 'Activate button or link' },
    { key: 'Space', description: 'Activate button' },
    { key: 'Arrow Keys', description: 'Navigate within components' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
    >
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 id="keyboard-shortcuts-title" className="text-xl font-semibold">
              Keyboard Shortcuts
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Close keyboard shortcuts"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <span className="font-medium text-gray-900">{shortcut.description}</span>
                <kbd className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-sm text-gray-600">
            <p>
              These shortcuts help you navigate the application more efficiently. 
              Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Escape</kbd> to close this dialog.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
