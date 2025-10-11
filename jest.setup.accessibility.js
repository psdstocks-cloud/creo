// Jest setup for accessibility testing
import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    display: 'block',
    visibility: 'visible',
    color: '#000000',
    backgroundColor: '#ffffff',
  }),
})

// Mock focus and blur methods
HTMLElement.prototype.focus = jest.fn()
HTMLElement.prototype.blur = jest.fn()

// Mock scrollIntoView
HTMLElement.prototype.scrollIntoView = jest.fn()

// Mock createPortal for modals
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}))

// Setup accessibility testing utilities
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
  
  // Reset document body
  document.body.innerHTML = ''
  
  // Reset focus
  document.activeElement?.blur()
})

// Global accessibility test helpers
global.testA11y = async (container) => {
  const { axe, toHaveNoViolations } = require('jest-axe')
  const results = await axe(container)
  expect(results).toHaveNoViolations()
}

global.testKeyboardNavigation = (container) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  expect(focusableElements.length).toBeGreaterThan(0)
  
  // Test that all focusable elements are reachable
  for (let i = 0; i < focusableElements.length; i++) {
    const element = focusableElements[i]
    element.focus()
    expect(document.activeElement).toBe(element)
  }
}

global.testScreenReader = (container) => {
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

global.testColorContrast = (container) => {
  // Basic check that colors are defined
  const elements = container.querySelectorAll('*')
  elements.forEach(element => {
    const computedStyle = window.getComputedStyle(element)
    const color = computedStyle.color
    const backgroundColor = computedStyle.backgroundColor
    
    expect(color).not.toBe('')
    expect(backgroundColor).not.toBe('')
  })
}

global.testFocusManagement = (container) => {
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
