# Accessibility Implementation - WCAG 2.1 AA Compliance

## Overview

This document outlines the comprehensive accessibility implementation for the Creo platform, ensuring WCAG 2.1 AA compliance with keyboard navigation and screen reader support.

## Table of Contents

- [Implementation Strategy](#implementation-strategy)
- [Keyboard Navigation](#keyboard-navigation)
- [Screen Reader Support](#screen-reader-support)
- [Visual Accessibility](#visual-accessibility)
- [Testing Framework](#testing-framework)
- [Components](#components)
- [Best Practices](#best-practices)
- [Compliance Checklist](#compliance-checklist)

## Implementation Strategy

### 1. Multi-Layer Approach

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface                           │
│  • Semantic HTML                                           │
│  • ARIA attributes                                         │
│  • Keyboard navigation                                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                Component Layer                              │
│  • Accessible components                                   │
│  • Focus management                                        │
│  • Screen reader support                                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                Testing Layer                                │
│  • Automated testing                                       │
│  • Manual testing                                          │
│  • User testing                                            │
└─────────────────────────────────────────────────────────────┘
```

### 2. WCAG 2.1 AA Principles

- **Perceivable**: Information must be presentable in ways users can perceive
- **Operable**: Interface components must be operable
- **Understandable**: Information and UI operation must be understandable
- **Robust**: Content must be robust enough for various assistive technologies

## Keyboard Navigation

### 1. Navigation Patterns

```typescript
// Tab navigation
Tab - Move forward through focusable elements
Shift + Tab - Move backward through focusable elements

// Arrow navigation
Arrow Keys - Navigate within components (menus, lists, grids)
Home - Go to first element
End - Go to last element

// Activation
Enter - Activate buttons and links
Space - Activate buttons
Escape - Close modals, menus, dropdowns
```

### 2. Focus Management

```typescript
// Focus trap for modals
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLElement>(null)
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return
    
    const focusableElements = containerRef.current.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    
    // Trap focus within the container
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive])
  
  return containerRef
}
```

### 3. Skip Links

```typescript
// Skip to main content
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

// Skip to navigation
<a href="#navigation" className="sr-only focus:not-sr-only">
  Skip to navigation
</a>

// Skip to search
<a href="#search" className="sr-only focus:not-sr-only">
  Skip to search
</a>
```

### 4. Keyboard Shortcuts

```typescript
// Global keyboard shortcuts
Ctrl + / - Show keyboard shortcuts
Alt + M - Focus main content
Alt + N - Focus navigation
Alt + S - Focus search
Escape - Close modals/menus
```

## Screen Reader Support

### 1. ARIA Attributes

```typescript
// Button with proper ARIA attributes
<button
  aria-label="Close modal"
  aria-expanded={isOpen}
  aria-controls="modal-content"
  aria-pressed={isPressed}
  aria-current={isCurrent ? 'page' : undefined}
>
  Close
</button>

// Form with proper labeling
<label htmlFor="email-input">Email Address</label>
<input
  id="email-input"
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={errorId}
/>
```

### 2. Live Regions

```typescript
// Announce dynamic content changes
<div aria-live="polite" aria-atomic="true">
  {announcement}
</div>

// Announce urgent updates
<div aria-live="assertive" aria-atomic="true">
  {urgentMessage}
</div>
```

### 3. Semantic HTML

```typescript
// Proper heading structure
<h1>Main Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>

// Proper form structure
<form role="form">
  <fieldset>
    <legend>Personal Information</legend>
    <label htmlFor="name">Name</label>
    <input id="name" type="text" />
  </fieldset>
</form>

// Proper navigation structure
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

## Visual Accessibility

### 1. Color Contrast

```css
/* WCAG 2.1 AA requires 4.5:1 contrast ratio for normal text */
.text-primary {
  color: #1f2937; /* Dark gray on white background */
  background-color: #ffffff;
}

.text-secondary {
  color: #6b7280; /* Medium gray on white background */
  background-color: #ffffff;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .text-primary {
    color: #000000;
    background-color: #ffffff;
  }
}
```

### 2. Focus Indicators

```css
/* Visible focus indicators */
.focus\:ring-2:focus {
  outline: 2px solid #f97316;
  outline-offset: 2px;
}

/* High contrast focus indicators */
@media (prefers-contrast: high) {
  .focus\:ring-2:focus {
    outline: 3px solid #000000;
    outline-offset: 3px;
  }
}
```

### 3. Reduced Motion

```css
/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing Framework

### 1. Automated Testing

```typescript
// Jest + axe-core testing
import { testA11y } from '@/test-utils/accessibility'

test('Button should be accessible', async () => {
  const { container } = render(<Button>Click me</Button>)
  await testA11y(container)
})
```

### 2. Playwright E2E Testing

```typescript
// Playwright accessibility testing
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from '@axe-core/playwright'

test('Home page should be accessible', async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
  await checkA11y(page)
})
```

### 3. ESLint Rules

```javascript
// ESLint accessibility rules
module.exports = {
  extends: ['plugin:jsx-a11y/recommended'],
  rules: {
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    // ... more rules
  }
}
```

## Components

### 1. AccessibleButton

```typescript
interface AccessibleButtonProps {
  // Standard button props
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  
  // Accessibility props
  ariaLabel?: string
  ariaExpanded?: boolean
  ariaControls?: string
  ariaPressed?: boolean
  ariaCurrent?: boolean | 'page' | 'step' | 'location' | 'date' | 'time'
  
  // Screen reader support
  screenReaderText?: string
}

export function AccessibleButton({
  children,
  ariaLabel,
  ariaExpanded,
  ariaControls,
  ariaPressed,
  ariaCurrent,
  screenReaderText,
  ...props
}: AccessibleButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-pressed={ariaPressed}
      aria-current={ariaCurrent}
      {...props}
    >
      {children}
      {screenReaderText && (
        <span className="sr-only">{screenReaderText}</span>
      )}
    </button>
  )
}
```

### 2. AccessibleForm

```typescript
interface AccessibleFormProps {
  children: React.ReactNode
  onSubmit?: (data: FormData) => void
}

export function AccessibleForm({ children, onSubmit }: AccessibleFormProps) {
  return (
    <form
      role="form"
      onSubmit={onSubmit}
      aria-label="Form"
    >
      {children}
    </form>
  )
}
```

### 3. AccessibleModal

```typescript
interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children
}: AccessibleModalProps) {
  const focusTrapRef = useFocusTrap(isOpen)
  
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <h2 id="modal-title">{title}</h2>
      <div id="modal-description" className="sr-only">
        {title} dialog
      </div>
      {children}
    </div>
  )
}
```

## Best Practices

### 1. Semantic HTML

```typescript
// Use semantic HTML elements
<main id="main-content">
  <section>
    <h1>Page Title</h1>
    <p>Page content</p>
  </section>
</main>

// Use proper heading hierarchy
<h1>Main Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>
```

### 2. ARIA Labels

```typescript
// Provide descriptive labels
<button aria-label="Close modal">
  <svg aria-hidden="true">...</svg>
</button>

// Use aria-describedby for additional context
<input
  type="email"
  aria-describedby="email-help"
/>
<div id="email-help">Enter your email address</div>
```

### 3. Focus Management

```typescript
// Manage focus properly
useEffect(() => {
  if (isOpen) {
    const firstFocusable = modalRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()
  }
}, [isOpen])
```

### 4. Error Handling

```typescript
// Announce errors to screen readers
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>

// Associate errors with form fields
<input
  aria-invalid={hasError}
  aria-describedby={errorId}
/>
<div id={errorId} role="alert">
  {errorMessage}
</div>
```

## Compliance Checklist

### ✅ Perceivable

- [ ] All images have alt text
- [ ] Videos have captions
- [ ] Audio has transcripts
- [ ] Color is not the only means of conveying information
- [ ] Text has sufficient color contrast (4.5:1 for normal text)
- [ ] Text can be resized up to 200% without loss of functionality
- [ ] Content is structured with proper headings

### ✅ Operable

- [ ] All functionality is available via keyboard
- [ ] No keyboard traps
- [ ] Focus indicators are visible
- [ ] Touch targets are at least 44x44px
- [ ] No content flashes more than 3 times per second
- [ ] Users can pause, stop, or hide moving content
- [ ] Skip links are provided

### ✅ Understandable

- [ ] Language is identified in HTML
- [ ] Navigation is consistent
- [ ] Form labels are clear and descriptive
- [ ] Error messages are helpful
- [ ] Instructions are provided when needed
- [ ] Content is written in plain language

### ✅ Robust

- [ ] HTML is valid
- [ ] ARIA attributes are used correctly
- [ ] Components work with assistive technologies
- [ ] Code is maintainable and testable
- [ ] Accessibility is tested regularly

## Testing Commands

```bash
# Run accessibility tests
npm run test:accessibility

# Run ESLint accessibility rules
npm run lint:accessibility

# Run Playwright accessibility tests
npm run e2e:accessibility

# Run axe-core tests
npm run test:a11y
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)

## Conclusion

The accessibility implementation ensures that the Creo platform is usable by everyone, including users with disabilities. By following WCAG 2.1 AA guidelines and implementing comprehensive testing, we create an inclusive experience that benefits all users.

The implementation includes:

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA attributes and semantic HTML
- **Visual Accessibility**: High contrast, focus indicators, and reduced motion support
- **Testing Framework**: Automated and manual testing for accessibility
- **Component Library**: Accessible components with built-in accessibility features
- **Best Practices**: Guidelines for maintaining accessibility standards

This comprehensive approach ensures that the Creo platform meets the highest accessibility standards and provides an excellent experience for all users.
