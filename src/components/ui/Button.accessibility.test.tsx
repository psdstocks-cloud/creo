import React from 'react'
import { render, screen, fireEvent } from '@/test-utils/accessibility'
import { Button } from './Button'
import { AccessibleButton } from './AccessibleButton'

describe('Button Accessibility', () => {
  describe('Basic Button', () => {
    it('should be accessible', async () => {
      const { container } = render(<Button>Click me</Button>)
      await testA11y(container)
    })

    it('should support keyboard navigation', () => {
      const { container } = render(<Button>Click me</Button>)
      testKeyboardNavigation(container)
    })

    it('should have proper focus management', () => {
      const { container } = render(<Button>Click me</Button>)
      testFocusManagement(container)
    })

    it('should announce button state changes to screen readers', () => {
      const { container } = render(<Button>Click me</Button>)
      testScreenReader(container)
    })

    it('should have proper color contrast', () => {
      const { container } = render(<Button>Click me</Button>)
      testColorContrast(container)
    })

    it('should be focusable with keyboard', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      button.focus()
      expect(button).toHaveFocus()
    })

    it('should be activatable with keyboard', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      
      button.focus()
      fireEvent.keyDown(button, { key: 'Enter' })
      expect(handleClick).toHaveBeenCalled()
    })

    it('should be activatable with space key', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      
      button.focus()
      fireEvent.keyDown(button, { key: ' ' })
      expect(handleClick).toHaveBeenCalled()
    })

    it('should not be activatable when disabled', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick} disabled>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      
      expect(button).toBeDisabled()
      fireEvent.keyDown(button, { key: 'Enter' })
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should have proper ARIA attributes when disabled', () => {
      render(<Button disabled>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      
      expect(button).toHaveAttribute('aria-disabled', 'true')
      expect(button).toBeDisabled()
    })
  })

  describe('AccessibleButton', () => {
    it('should be accessible', async () => {
      const { container } = render(<AccessibleButton>Click me</AccessibleButton>)
      await testA11y(container)
    })

    it('should support keyboard navigation', () => {
      const { container } = render(<AccessibleButton>Click me</AccessibleButton>)
      testKeyboardNavigation(container)
    })

    it('should have proper focus management', () => {
      const { container } = render(<AccessibleButton>Click me</AccessibleButton>)
      testFocusManagement(container)
    })

    it('should announce loading state to screen readers', () => {
      render(<AccessibleButton loading loadingText="Loading...">Click me</AccessibleButton>)
      
      const button = screen.getByRole('button', { name: /loading/i })
      expect(button).toBeInTheDocument()
      
      // Check for loading spinner
      const spinner = button.querySelector('svg.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('should have proper ARIA attributes for expanded state', () => {
      render(
        <AccessibleButton 
          ariaExpanded={true} 
          ariaControls="menu"
        >
          Menu
        </AccessibleButton>
      )
      
      const button = screen.getByRole('button', { name: /menu/i })
      expect(button).toHaveAttribute('aria-expanded', 'true')
      expect(button).toHaveAttribute('aria-controls', 'menu')
    })

    it('should have proper ARIA attributes for pressed state', () => {
      render(
        <AccessibleButton 
          ariaPressed={true}
        >
          Toggle
        </AccessibleButton>
      )
      
      const button = screen.getByRole('button', { name: /toggle/i })
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })

    it('should have proper ARIA attributes for current state', () => {
      render(
        <AccessibleButton 
          ariaCurrent="page"
        >
          Current Page
        </AccessibleButton>
      )
      
      const button = screen.getByRole('button', { name: /current page/i })
      expect(button).toHaveAttribute('aria-current', 'page')
    })

    it('should have screen reader text', () => {
      render(
        <AccessibleButton 
          screenReaderText="Additional context for screen readers"
        >
          Button
        </AccessibleButton>
      )
      
      const button = screen.getByRole('button', { name: /button/i })
      const screenReaderText = screen.getByText('Additional context for screen readers')
      
      expect(screenReaderText).toHaveClass('sr-only')
    })

    it('should have proper focus indicators', () => {
      const { container } = render(<AccessibleButton>Click me</AccessibleButton>)
      const button = screen.getByRole('button', { name: /click me/i })
      
      button.focus()
      expect(button).toHaveFocus()
      
      // Check for focus ring
      const computedStyle = window.getComputedStyle(button)
      expect(computedStyle.outline).not.toBe('none')
    })

    it('should have proper touch target size', () => {
      const { container } = render(<AccessibleButton>Click me</AccessibleButton>)
      const button = screen.getByRole('button', { name: /click me/i })
      
      const computedStyle = window.getComputedStyle(button)
      const height = parseInt(computedStyle.height)
      const width = parseInt(computedStyle.width)
      
      // WCAG 2.1 AA requires minimum 44x44px touch targets
      expect(height).toBeGreaterThanOrEqual(44)
      expect(width).toBeGreaterThanOrEqual(44)
    })

    it('should support icon positioning', () => {
      const icon = <span data-testid="icon">🔍</span>
      
      render(
        <AccessibleButton 
          icon={icon} 
          iconPosition="left"
        >
          Search
        </AccessibleButton>
      )
      
      const button = screen.getByRole('button', { name: /search/i })
      const iconElement = screen.getByTestId('icon')
      
      expect(iconElement).toBeInTheDocument()
      expect(iconElement).toHaveAttribute('aria-hidden', 'true')
    })

    it('should support right icon positioning', () => {
      const icon = <span data-testid="icon">→</span>
      
      render(
        <AccessibleButton 
          icon={icon} 
          iconPosition="right"
        >
          Next
        </AccessibleButton>
      )
      
      const button = screen.getByRole('button', { name: /next/i })
      const iconElement = screen.getByTestId('icon')
      
      expect(iconElement).toBeInTheDocument()
      expect(iconElement).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Button Variants', () => {
    it('should have proper contrast for primary variant', () => {
      const { container } = render(<Button variant="primary">Primary</Button>)
      testColorContrast(container)
    })

    it('should have proper contrast for secondary variant', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>)
      testColorContrast(container)
    })

    it('should have proper contrast for outline variant', () => {
      const { container } = render(<Button variant="outline">Outline</Button>)
      testColorContrast(container)
    })

    it('should have proper contrast for ghost variant', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>)
      testColorContrast(container)
    })

    it('should have proper contrast for destructive variant', () => {
      const { container } = render(<Button variant="destructive">Destructive</Button>)
      testColorContrast(container)
    })
  })

  describe('Button Sizes', () => {
    it('should have proper touch target for small size', () => {
      const { container } = render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button', { name: /small/i })
      
      const computedStyle = window.getComputedStyle(button)
      const height = parseInt(computedStyle.height)
      
      // Should still meet minimum touch target requirements
      expect(height).toBeGreaterThanOrEqual(36)
    })

    it('should have proper touch target for medium size', () => {
      const { container } = render(<Button size="md">Medium</Button>)
      const button = screen.getByRole('button', { name: /medium/i })
      
      const computedStyle = window.getComputedStyle(button)
      const height = parseInt(computedStyle.height)
      
      expect(height).toBeGreaterThanOrEqual(44)
    })

    it('should have proper touch target for large size', () => {
      const { container } = render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button', { name: /large/i })
      
      const computedStyle = window.getComputedStyle(button)
      const height = parseInt(computedStyle.height)
      
      expect(height).toBeGreaterThanOrEqual(52)
    })
  })

  describe('Button States', () => {
    it('should handle loading state accessibility', () => {
      render(<AccessibleButton loading loadingText="Loading...">Click me</AccessibleButton>)
      
      const button = screen.getByRole('button', { name: /loading/i })
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    it('should handle disabled state accessibility', () => {
      render(<Button disabled>Click me</Button>)
      
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    it('should handle full width state accessibility', () => {
      render(<Button fullWidth>Click me</Button>)
      
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toHaveClass('w-full')
    })
  })
})
