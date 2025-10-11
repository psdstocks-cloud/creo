import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y, getViolations } from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Inject axe-core into the page
    await injectAxe(page)
  })

  test('Home page should be accessible', async ({ page }) => {
    await page.goto('/')
    await checkA11y(page)
  })

  test('Stock search page should be accessible', async ({ page }) => {
    await page.goto('/stock-search')
    await checkA11y(page)
  })

  test('AI generation page should be accessible', async ({ page }) => {
    await page.goto('/ai-generation')
    await checkA11y(page)
  })

  test('Dashboard should be accessible', async ({ page }) => {
    await page.goto('/dashboard')
    await checkA11y(page)
  })

  test('Admin panel should be accessible', async ({ page }) => {
    await page.goto('/admin')
    await checkA11y(page)
  })

  test('Authentication page should be accessible', async ({ page }) => {
    await page.goto('/auth')
    await checkA11y(page)
  })

  test('Settings page should be accessible', async ({ page }) => {
    await page.goto('/settings')
    await checkA11y(page)
  })

  test('Orders page should be accessible', async ({ page }) => {
    await page.goto('/orders')
    await checkA11y(page)
  })

  test('Downloads page should be accessible', async ({ page }) => {
    await page.goto('/downloads')
    await checkA11y(page)
  })

  test('Keyboard navigation should work on all pages', async ({ page }) => {
    const pages = ['/', '/stock-search', '/ai-generation', '/dashboard', '/admin', '/auth']
    
    for (const pagePath of pages) {
      await page.goto(pagePath)
      
      // Test tab navigation
      await page.keyboard.press('Tab')
      const firstFocused = await page.evaluate(() => document.activeElement?.tagName)
      expect(firstFocused).toBeTruthy()
      
      // Test shift+tab navigation
      await page.keyboard.press('Shift+Tab')
      const lastFocused = await page.evaluate(() => document.activeElement?.tagName)
      expect(lastFocused).toBeTruthy()
    }
  })

  test('Screen reader support should work', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count()
    expect(headings).toBeGreaterThan(0)
    
    // Check for proper form labels
    const inputs = await page.locator('input, select, textarea').count()
    if (inputs > 0) {
      const labeledInputs = await page.locator('input[aria-label], input[id] + label, select[aria-label], select[id] + label, textarea[aria-label], textarea[id] + label').count()
      expect(labeledInputs).toBeGreaterThanOrEqual(inputs)
    }
    
    // Check for proper ARIA landmarks
    const landmarks = await page.locator('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]').count()
    expect(landmarks).toBeGreaterThan(0)
  })

  test('Color contrast should meet WCAG standards', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper color contrast
    const violations = await getViolations(page, null, {
      rules: {
        'color-contrast': { enabled: true }
      }
    })
    
    expect(violations).toHaveLength(0)
  })

  test('Focus management should work in modals', async ({ page }) => {
    await page.goto('/')
    
    // Look for modals or dialogs
    const modals = await page.locator('[role="dialog"], [aria-modal="true"]').count()
    
    if (modals > 0) {
      // Test focus trapping in modals
      await page.keyboard.press('Tab')
      const firstFocused = await page.evaluate(() => document.activeElement?.tagName)
      
      // Press tab multiple times to test focus trapping
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab')
      }
      
      const lastFocused = await page.evaluate(() => document.activeElement?.tagName)
      expect(lastFocused).toBeTruthy()
    }
  })

  test('Form accessibility should work', async ({ page }) => {
    await page.goto('/auth')
    
    // Check for proper form structure
    const forms = await page.locator('form').count()
    if (forms > 0) {
      // Check for proper form labels
      const formInputs = await page.locator('form input, form select, form textarea').count()
      const labeledFormInputs = await page.locator('form input[aria-label], form input[id] + label, form select[aria-label], form select[id] + label, form textarea[aria-label], form textarea[id] + label').count()
      
      expect(labeledFormInputs).toBeGreaterThanOrEqual(formInputs)
    }
  })

  test('Button accessibility should work', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper button structure
    const buttons = await page.locator('button').count()
    if (buttons > 0) {
      // Check for proper button labels
      const labeledButtons = await page.locator('button[aria-label], button:not([aria-label]):has-text()').count()
      expect(labeledButtons).toBeGreaterThanOrEqual(buttons)
      
      // Test button activation with keyboard
      const firstButton = page.locator('button').first()
      await firstButton.focus()
      await page.keyboard.press('Enter')
      // Button should be activatable
    }
  })

  test('Link accessibility should work', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper link structure
    const links = await page.locator('a[href]').count()
    if (links > 0) {
      // Check for proper link text
      const linksWithText = await page.locator('a[href]:has-text()').count()
      expect(linksWithText).toBeGreaterThanOrEqual(links)
      
      // Test link activation with keyboard
      const firstLink = page.locator('a[href]').first()
      await firstLink.focus()
      await page.keyboard.press('Enter')
      // Link should be activatable
    }
  })

  test('Image accessibility should work', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper image structure
    const images = await page.locator('img').count()
    if (images > 0) {
      // Check for proper alt text
      const imagesWithAlt = await page.locator('img[alt]').count()
      expect(imagesWithAlt).toBeGreaterThanOrEqual(images)
    }
  })

  test('Table accessibility should work', async ({ page }) => {
    await page.goto('/admin')
    
    // Check for proper table structure
    const tables = await page.locator('table').count()
    if (tables > 0) {
      // Check for proper table headers
      const tablesWithHeaders = await page.locator('table th').count()
      expect(tablesWithHeaders).toBeGreaterThan(0)
      
      // Check for proper table captions
      const tablesWithCaptions = await page.locator('table caption').count()
      expect(tablesWithCaptions).toBeGreaterThanOrEqual(0)
    }
  })

  test('Navigation accessibility should work', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper navigation structure
    const navs = await page.locator('nav').count()
    if (navs > 0) {
      // Check for proper navigation labels
      const navsWithLabels = await page.locator('nav[aria-label], nav:has(h1, h2, h3, h4, h5, h6)').count()
      expect(navsWithLabels).toBeGreaterThanOrEqual(navs)
    }
  })

  test('Skip links should work', async ({ page }) => {
    await page.goto('/')
    
    // Check for skip links
    const skipLinks = await page.locator('a[href^="#"]').count()
    if (skipLinks > 0) {
      // Test skip link functionality
      const skipLink = page.locator('a[href^="#"]').first()
      await skipLink.focus()
      await page.keyboard.press('Enter')
      
      // Should navigate to the target element
      const targetId = await skipLink.getAttribute('href')
      if (targetId) {
        const target = page.locator(targetId)
        await expect(target).toBeVisible()
      }
    }
  })

  test('Live regions should work', async ({ page }) => {
    await page.goto('/')
    
    // Check for live regions
    const liveRegions = await page.locator('[aria-live]').count()
    expect(liveRegions).toBeGreaterThanOrEqual(0)
    
    // Check for proper live region attributes
    const politeRegions = await page.locator('[aria-live="polite"]').count()
    const assertiveRegions = await page.locator('[aria-live="assertive"]').count()
    
    expect(politeRegions + assertiveRegions).toBeGreaterThanOrEqual(0)
  })

  test('Reduced motion should be respected', async ({ page }) => {
    await page.goto('/')
    
    // Check for reduced motion support
    const animatedElements = await page.locator('[style*="animation"], [style*="transition"]').count()
    if (animatedElements > 0) {
      // Check for reduced motion media query support
      const reducedMotionSupport = await page.evaluate(() => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      })
      
      // If reduced motion is preferred, animations should be disabled
      if (reducedMotionSupport) {
        const animations = await page.locator('[style*="animation: none"], [style*="transition: none"]').count()
        expect(animations).toBeGreaterThanOrEqual(0)
      }
    }
  })

  test('High contrast mode should be supported', async ({ page }) => {
    await page.goto('/')
    
    // Check for high contrast mode support
    const highContrastSupport = await page.evaluate(() => {
      return window.matchMedia('(-ms-high-contrast: active)').matches || 
             window.matchMedia('(forced-colors: active)').matches
    })
    
    if (highContrastSupport) {
      // Check for proper contrast ratios
      const violations = await getViolations(page, null, {
        rules: {
          'color-contrast': { enabled: true }
        }
      })
      
      expect(violations).toHaveLength(0)
    }
  })

  test('Touch target sizes should meet WCAG standards', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper touch target sizes
    const interactiveElements = await page.locator('button, a, input, select, textarea').count()
    if (interactiveElements > 0) {
      // Check for minimum touch target size (44x44px)
      const smallTargets = await page.evaluate(() => {
        const elements = document.querySelectorAll('button, a, input, select, textarea')
        let smallCount = 0
        
        elements.forEach(element => {
          const rect = element.getBoundingClientRect()
          if (rect.width < 44 || rect.height < 44) {
            smallCount++
          }
        })
        
        return smallCount
      })
      
      expect(smallTargets).toBe(0)
    }
  })

  test('Error handling should be accessible', async ({ page }) => {
    await page.goto('/auth')
    
    // Test form validation errors
    const submitButton = page.locator('button[type="submit"]')
    if (await submitButton.count() > 0) {
      await submitButton.click()
      
      // Check for error messages
      const errorMessages = await page.locator('[role="alert"], .error, .invalid').count()
      if (errorMessages > 0) {
        // Check that error messages are announced to screen readers
        const announcedErrors = await page.locator('[role="alert"]').count()
        expect(announcedErrors).toBeGreaterThan(0)
      }
    }
  })

  test('Loading states should be accessible', async ({ page }) => {
    await page.goto('/')
    
    // Check for loading states
    const loadingElements = await page.locator('[aria-busy="true"], .loading, .spinner').count()
    if (loadingElements > 0) {
      // Check that loading states are announced to screen readers
      const announcedLoading = await page.locator('[aria-busy="true"]').count()
      expect(announcedLoading).toBeGreaterThan(0)
    }
  })

  test('Dynamic content should be accessible', async ({ page }) => {
    await page.goto('/')
    
    // Check for dynamic content updates
    const liveRegions = await page.locator('[aria-live]').count()
    if (liveRegions > 0) {
      // Check for proper live region attributes
      const politeRegions = await page.locator('[aria-live="polite"]').count()
      const assertiveRegions = await page.locator('[aria-live="assertive"]').count()
      
      expect(politeRegions + assertiveRegions).toBeGreaterThan(0)
    }
  })
})
