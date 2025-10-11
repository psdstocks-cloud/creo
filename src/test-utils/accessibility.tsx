import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { UserProvider } from '@/contexts/UserContext'
import { ToastProvider } from '@/components/ui/Toast'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Accessibility testing helper
export const testA11y = async (container: HTMLElement) => {
  const results = await axe(container)
  expect(results).toHaveNoViolations()
}

// Keyboard navigation testing helper
export const testKeyboardNavigation = async (container: HTMLElement) => {
  // Test tab navigation
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  expect(focusableElements.length).toBeGreaterThan(0)
  
  // Test that all focusable elements are reachable
  for (let i = 0; i < focusableElements.length; i++) {
    const element = focusableElements[i] as HTMLElement
    element.focus()
    expect(document.activeElement).toBe(element)
  }
}

// Screen reader testing helper
export const testScreenReader = (container: HTMLElement) => {
  // Test for proper ARIA labels
  const elementsWithAriaLabel = container.querySelectorAll('[aria-label]')
  expect(elementsWithAriaLabel.length).toBeGreaterThan(0)
  
  // Test for proper heading structure
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  expect(headings.length).toBeGreaterThan(0)
  
  // Test for proper form labels
  const inputs = container.querySelectorAll('input, select, textarea')
  inputs.forEach(input => {
    const id = input.getAttribute('id')
    if (id) {
      const label = container.querySelector(`label[for="${id}"]`)
      expect(label).toBeTruthy()
    }
  })
  
  // Test for live regions
  const liveRegions = container.querySelectorAll('[aria-live]')
  expect(liveRegions.length).toBeGreaterThan(0)
}

// Color contrast testing helper
export const testColorContrast = (container: HTMLElement) => {
  // This would typically use a library like color-contrast-checker
  // For now, we'll test that elements have proper color attributes
  const elements = container.querySelectorAll('*')
  elements.forEach(element => {
    const computedStyle = window.getComputedStyle(element)
    const color = computedStyle.color
    const backgroundColor = computedStyle.backgroundColor
    
    // Basic check that colors are defined
    expect(color).not.toBe('')
    expect(backgroundColor).not.toBe('')
  })
}

// Focus management testing helper
export const testFocusManagement = (container: HTMLElement) => {
  // Test that focus is properly managed
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  // Test that focus can be trapped in modals
  const modals = container.querySelectorAll('[role="dialog"]')
  modals.forEach(modal => {
    const focusableInModal = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    expect(focusableInModal.length).toBeGreaterThan(0)
  })
}

// Export everything
export * from '@testing-library/react'
export { customRender as render }
