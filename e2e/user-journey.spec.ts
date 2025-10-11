import { test, expect } from '@playwright/test'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { StockSearchPage } from './pages/StockSearchPage'
import { AIGenerationPage } from './pages/AIGenerationPage'

test.describe('Complete User Journey', () => {
  let authPage: AuthPage
  let dashboardPage: DashboardPage
  let stockSearchPage: StockSearchPage
  let aiGenerationPage: AIGenerationPage

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page)
    dashboardPage = new DashboardPage(page)
    stockSearchPage = new StockSearchPage(page)
    aiGenerationPage = new AIGenerationPage(page)
  })

  test('Complete user journey from signup to AI generation', async () => {
    // Step 1: User Registration
    await authPage.goToSignUp()
    
    const timestamp = Date.now()
    const email = `testuser${timestamp}@example.com`
    const password = 'TestPassword123!'
    const fullName = 'Test User'
    
    await authPage.signUp(email, password, fullName)
    
    // Should redirect to dashboard
    await expect(authPage.page).toHaveURL(/.*\/dashboard/)
    await expect(dashboardPage.page.locator('[data-testid="welcome-message"]')).toBeVisible()
    
    // Step 2: Explore Dashboard
    await dashboardPage.waitForDashboardLoad()
    
    // Check dashboard elements
    await expect(dashboardPage.page.locator('[data-testid="user-menu"]')).toBeVisible()
    await expect(dashboardPage.page.locator('[data-testid="credits-display"]')).toBeVisible()
    await expect(dashboardPage.page.locator('[data-testid="quick-actions"]')).toBeVisible()
    
    // Step 3: Stock Search
    await dashboardPage.clickSearchButton()
    await expect(stockSearchPage.page).toHaveURL(/.*\/stock-search/)
    
    // Perform stock search
    await stockSearchPage.search('nature landscape')
    await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    
    // Apply filters
    await stockSearchPage.applyFilters({
      category: 'nature',
      orientation: 'landscape',
      color: 'green'
    })
    
    // Check results
    const resultsCount = await stockSearchPage.getResultsCount()
    expect(resultsCount).toBeGreaterThan(0)
    
    // Step 4: AI Generation
    await dashboardPage.clickGenerateButton()
    await expect(aiGenerationPage.page).toHaveURL(/.*\/ai-generation/)
    
    // Generate an image
    await aiGenerationPage.generateImage('A beautiful mountain landscape with a lake', {
      style: 'realistic',
      size: '1024x1024',
      quality: 'high'
    })
    
    // Wait for generation to complete
    await aiGenerationPage.waitForGenerationComplete()
    
    // Check generated image
    await expect(aiGenerationPage.page.locator('[data-testid="generated-image"]')).toBeVisible()
    
    // Step 5: Save and Download
    if (await aiGenerationPage.hasGeneratedImage()) {
      await aiGenerationPage.saveImage(0)
      await expect(aiGenerationPage.page.locator('[data-testid="success-message"]')).toBeVisible()
      
      await aiGenerationPage.downloadImage(0)
      // Download should be triggered
    }
    
    // Step 6: Check Dashboard Updates
    await dashboardPage.navigateTo('/dashboard')
    await dashboardPage.waitForDashboardLoad()
    
    // Check if recent activity is updated
    if (await dashboardPage.hasRecentActivity()) {
      const recentOrdersCount = await dashboardPage.getRecentOrdersCount()
      const recentDownloadsCount = await dashboardPage.getRecentDownloadsCount()
      
      expect(recentOrdersCount + recentDownloadsCount).toBeGreaterThan(0)
    }
    
    // Step 7: Check Credits and Usage
    const credits = await dashboardPage.getCredits()
    expect(credits).toBeTruthy()
    
    // Step 8: Sign Out
    await authPage.signOut()
    await expect(authPage.page).toHaveURL(/.*\/auth\/signin/)
  })

  test('User journey with advanced features', async () => {
    // Sign in as existing user
    await authPage.goToSignIn()
    await authPage.signIn('test@example.com', 'testpassword')
    
    // Step 1: Advanced Stock Search
    await stockSearchPage.goToStockSearch()
    
    // Use search suggestions
    await stockSearchPage.fill('[data-testid="search-input"]', 'nat')
    if (await stockSearchPage.hasSearchSuggestions()) {
      await stockSearchPage.clickSuggestion(0)
    }
    
    // Apply advanced filters
    await stockSearchPage.openFilters()
    await stockSearchPage.applyFilters({
      category: 'business',
      orientation: 'portrait',
      color: 'blue',
      date: 'last-month'
    })
    
    // Sort results
    await stockSearchPage.sortResults('popularity')
    
    // Save search
    await stockSearchPage.saveSearch('Business Portraits')
    
    // Step 2: Advanced AI Generation
    await aiGenerationPage.goToAIGeneration()
    
    // Use presets
    await aiGenerationPage.openPresets()
    if (await aiGenerationPage.hasPresetsModal()) {
      await aiGenerationPage.selectPreset(0)
    }
    
    // Open advanced settings
    await aiGenerationPage.openAdvancedSettings()
    await aiGenerationPage.setNegativePrompt('blurry, low quality, distorted')
    await aiGenerationPage.setSeed('12345')
    await aiGenerationPage.setSteps(30)
    await aiGenerationPage.setGuidance(8.5)
    
    // Generate with advanced settings
    await aiGenerationPage.generateImage('A professional business portrait', {
      style: 'photorealistic',
      size: '1024x1024',
      quality: 'ultra'
    })
    
    await aiGenerationPage.waitForGenerationComplete()
    
    // Step 3: Check Generation History
    await aiGenerationPage.openHistory()
    if (await aiGenerationPage.hasGenerationHistory()) {
      const historyCount = await aiGenerationPage.getHistoryCount()
      expect(historyCount).toBeGreaterThan(0)
    }
    
    // Step 4: Share Generated Content
    if (await aiGenerationPage.hasGeneratedImage()) {
      await aiGenerationPage.shareImage(0)
      await expect(aiGenerationPage.page.locator('[data-testid="share-modal"]')).toBeVisible()
    }
  })

  test('User journey with error handling', async () => {
    // Sign in
    await authPage.goToSignIn()
    await authPage.signIn('test@example.com', 'testpassword')
    
    // Step 1: Test network error handling
    await stockSearchPage.goToStockSearch()
    
    // Simulate network error
    await stockSearchPage.page.context().setOffline(true)
    await stockSearchPage.search('nature')
    
    // Should show error message
    await expect(stockSearchPage.page.locator('[data-testid="error-message"]')).toBeVisible()
    
    // Go back online and retry
    await stockSearchPage.page.context().setOffline(false)
    await stockSearchPage.page.click('[data-testid="retry-button"]')
    
    // Should show results
    await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    
    // Step 2: Test AI generation error handling
    await aiGenerationPage.goToAIGeneration()
    
    // Simulate API error
    await aiGenerationPage.page.route('**/api/ai/generate', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Generation failed' })
      })
    })
    
    await aiGenerationPage.generateImage('A test image')
    
    // Should show error message
    await expect(aiGenerationPage.page.locator('[data-testid="generation-error"]')).toBeVisible()
    
    // Remove the route to allow normal generation
    await aiGenerationPage.page.unroute('**/api/ai/generate')
    
    // Retry generation
    await aiGenerationPage.page.click('[data-testid="retry-button"]')
    await aiGenerationPage.waitForGenerationComplete()
    
    // Should show generated image
    await expect(aiGenerationPage.page.locator('[data-testid="generated-image"]')).toBeVisible()
  })

  test('User journey with accessibility features', async () => {
    // Sign in
    await authPage.goToSignIn()
    await authPage.signIn('test@example.com', 'testpassword')
    
    // Step 1: Test keyboard navigation
    await dashboardPage.goToDashboard()
    
    // Navigate with keyboard
    await dashboardPage.pressKey('Tab')
    await dashboardPage.pressKey('Tab')
    await dashboardPage.pressKey('Tab')
    await dashboardPage.pressKey('Enter')
    
    // Should navigate to search
    await expect(stockSearchPage.page).toHaveURL(/.*\/stock-search/)
    
    // Step 2: Test screen reader support
    await stockSearchPage.search('nature')
    
    // Check for ARIA labels
    await expect(stockSearchPage.page.locator('[data-testid="search-input"]')).toHaveAttribute('aria-label')
    await expect(stockSearchPage.page.locator('[data-testid="search-button"]')).toHaveAttribute('aria-label')
    
    // Check for live regions
    await expect(stockSearchPage.page.locator('[aria-live="polite"]')).toBeVisible()
    
    // Step 3: Test AI generation accessibility
    await aiGenerationPage.goToAIGeneration()
    
    // Check for proper form labels
    await expect(aiGenerationPage.page.locator('[data-testid="prompt-input"]')).toHaveAttribute('aria-label')
    await expect(aiGenerationPage.page.locator('[data-testid="generate-button"]')).toHaveAttribute('aria-label')
    
    // Generate with keyboard
    await aiGenerationPage.fill('[data-testid="prompt-input"]', 'A beautiful landscape')
    await aiGenerationPage.pressKey('Enter')
    
    // Should show generation progress
    await expect(aiGenerationPage.page.locator('[data-testid="generation-progress"]')).toBeVisible()
  })

  test('User journey with performance monitoring', async () => {
    // Sign in
    await authPage.goToSignIn()
    await authPage.signIn('test@example.com', 'testpassword')
    
    // Step 1: Monitor page load times
    const startTime = Date.now()
    await dashboardPage.goToDashboard()
    await dashboardPage.waitForDashboardLoad()
    const loadTime = Date.now() - startTime
    
    // Should load within reasonable time
    expect(loadTime).toBeLessThan(5000)
    
    // Step 2: Monitor search performance
    const searchStartTime = Date.now()
    await stockSearchPage.goToStockSearch()
    await stockSearchPage.search('nature')
    await stockSearchPage.waitForSearchComplete()
    const searchTime = Date.now() - searchStartTime
    
    // Should complete search within reasonable time
    expect(searchTime).toBeLessThan(10000)
    
    // Step 3: Monitor AI generation performance
    const generationStartTime = Date.now()
    await aiGenerationPage.goToAIGeneration()
    await aiGenerationPage.generateImage('A test image')
    await aiGenerationPage.waitForGenerationComplete()
    const generationTime = Date.now() - generationStartTime
    
    // Should complete generation within reasonable time
    expect(generationTime).toBeLessThan(30000)
    
    // Step 4: Check for performance metrics
    const performanceMetrics = await aiGenerationPage.page.evaluate(() => {
      return {
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart
      }
    })
    
    expect(performanceMetrics.loadTime).toBeLessThan(5000)
  })

  test('User journey with mobile responsiveness', async () => {
    // Set mobile viewport
    await authPage.page.setViewportSize({ width: 375, height: 667 })
    
    // Sign in
    await authPage.goToSignIn()
    await authPage.signIn('test@example.com', 'testpassword')
    
    // Step 1: Test mobile dashboard
    await dashboardPage.goToDashboard()
    await dashboardPage.waitForDashboardLoad()
    
    // Should be responsive
    await expect(dashboardPage.page.locator('[data-testid="welcome-message"]')).toBeVisible()
    
    // Step 2: Test mobile search
    await stockSearchPage.goToStockSearch()
    await stockSearchPage.search('nature')
    
    // Should show results in mobile layout
    await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    
    // Step 3: Test mobile AI generation
    await aiGenerationPage.goToAIGeneration()
    await aiGenerationPage.generateImage('A mobile test image')
    await aiGenerationPage.waitForGenerationComplete()
    
    // Should show generated image in mobile layout
    await expect(aiGenerationPage.page.locator('[data-testid="generated-image"]')).toBeVisible()
    
    // Step 4: Test mobile navigation
    await aiGenerationPage.page.tap('[data-testid="mobile-menu-button"]')
    await expect(aiGenerationPage.page.locator('[data-testid="mobile-menu"]')).toBeVisible()
  })
})
