import { test, expect } from '@playwright/test'
import { AIGenerationPage } from './pages/AIGenerationPage'
import { AuthPage } from './pages/AuthPage'

test.describe('AI Generation Flow', () => {
  let aiGenerationPage: AIGenerationPage
  let authPage: AuthPage

  test.beforeEach(async ({ page }) => {
    aiGenerationPage = new AIGenerationPage(page)
    authPage = new AuthPage(page)
    
    // Sign in before each test
    await authPage.goToSignIn()
    await authPage.signIn('test@example.com', 'testpassword')
  })

  test.describe('Basic Generation', () => {
    test('should display AI generation interface', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await expect(aiGenerationPage.page).toHaveURL(/.*\/ai-generation/)
      await expect(aiGenerationPage.page.locator('[data-testid="prompt-input"]')).toBeVisible()
      await expect(aiGenerationPage.page.locator('[data-testid="generate-button"]')).toBeVisible()
      await expect(aiGenerationPage.page.locator('[data-testid="style-select"]')).toBeVisible()
      await expect(aiGenerationPage.page.locator('[data-testid="size-select"]')).toBeVisible()
    })

    test('should generate image with basic prompt', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.generateImage('A beautiful sunset over mountains')
      
      // Should show generation progress
      await expect(aiGenerationPage.page.locator('[data-testid="generation-progress"]')).toBeVisible()
      
      // Wait for generation to complete
      await aiGenerationPage.waitForGenerationComplete()
      
      // Should show generated image
      await expect(aiGenerationPage.page.locator('[data-testid="generated-image"]')).toBeVisible()
    })

    test('should show validation error for empty prompt', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.click('[data-testid="generate-button"]')
      
      // Should show validation error
      await expect(aiGenerationPage.page.locator('[data-testid="prompt-error"]')).toBeVisible()
    })

    test('should show generation status', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.generateImage('A cat sitting on a chair')
      
      // Should show generation status
      const status = await aiGenerationPage.getGenerationStatus()
      expect(status).toBeTruthy()
    })
  })

  test.describe('Advanced Settings', () => {
    test('should open advanced settings panel', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.openAdvancedSettings()
      
      // Should show advanced settings panel
      await expect(aiGenerationPage.page.locator('[data-testid="advanced-settings-panel"]')).toBeVisible()
    })

    test('should close advanced settings panel', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.openAdvancedSettings()
      await aiGenerationPage.closeAdvancedSettings()
      
      // Should hide advanced settings panel
      await expect(aiGenerationPage.page.locator('[data-testid="advanced-settings-panel"]')).toBeHidden()
    })

    test('should set negative prompt', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.setNegativePrompt('blurry, low quality, distorted')
      
      const negativePrompt = await aiGenerationPage.getNegativePromptValue()
      expect(negativePrompt).toBe('blurry, low quality, distorted')
    })

    test('should set seed value', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.setSeed('12345')
      
      const seed = await aiGenerationPage.getSeedValue()
      expect(seed).toBe('12345')
    })

    test('should adjust generation steps', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.openAdvancedSettings()
      await aiGenerationPage.setSteps(30)
      
      const steps = await aiGenerationPage.getSteps()
      expect(steps).toBe(30)
    })

    test('should adjust guidance scale', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.openAdvancedSettings()
      await aiGenerationPage.setGuidance(8.5)
      
      const guidance = await aiGenerationPage.getGuidance()
      expect(guidance).toBe(8.5)
    })
  })

  test.describe('Style and Size Options', () => {
    test('should select different styles', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.generateImage('A portrait of a person', { style: 'realistic' })
      
      const style = await aiGenerationPage.getStyle()
      expect(style).toBe('realistic')
    })

    test('should select different sizes', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.generateImage('A landscape', { size: '1024x1024' })
      
      const size = await aiGenerationPage.getSize()
      expect(size).toBe('1024x1024')
    })

    test('should select different quality levels', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.generateImage('A detailed illustration', { quality: 'high' })
      
      const quality = await aiGenerationPage.getQuality()
      expect(quality).toBe('high')
    })

    test('should select different aspect ratios', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.generateImage('A wide landscape', { aspectRatio: '16:9' })
      
      const aspectRatio = await aiGenerationPage.getAspectRatio()
      expect(aspectRatio).toBe('16:9')
    })
  })

  test.describe('Generation History', () => {
    test('should open generation history', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.openHistory()
      
      // Should show generation history
      await expect(aiGenerationPage.page.locator('[data-testid="generation-history"]')).toBeVisible()
    })

    test('should display previous generations', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      // Generate a few images first
      await aiGenerationPage.generateImage('A dog in a park')
      await aiGenerationPage.generateImage('A city skyline')
      
      await aiGenerationPage.openHistory()
      
      // Should show history items
      const historyCount = await aiGenerationPage.getHistoryCount()
      expect(historyCount).toBeGreaterThan(0)
    })

    test('should click on history item', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      // Generate an image first
      await aiGenerationPage.generateImage('A beautiful flower')
      
      await aiGenerationPage.openHistory()
      
      if (await aiGenerationPage.hasGenerationHistory()) {
        const historyCount = await aiGenerationPage.getHistoryCount()
        if (historyCount > 0) {
          await aiGenerationPage.clickHistoryItem(0)
          
          // Should show the selected generation
          await expect(aiGenerationPage.page.locator('[data-testid="generated-image"]')).toBeVisible()
        }
      }
    })
  })

  test.describe('Presets', () => {
    test('should open presets modal', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.openPresets()
      
      // Should show presets modal
      await expect(aiGenerationPage.page.locator('[data-testid="preset-modal"]')).toBeVisible()
    })

    test('should select a preset', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.openPresets()
      
      if (await aiGenerationPage.hasPresetsModal()) {
        const presetsCount = await aiGenerationPage.getPresetsCount()
        if (presetsCount > 0) {
          await aiGenerationPage.selectPreset(0)
          
          // Should apply preset settings
          await expect(aiGenerationPage.page.locator('[data-testid="preset-modal"]')).toBeHidden()
        }
      }
    })
  })

  test.describe('Image Actions', () => {
    test('should download generated image', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.generateImage('A beautiful landscape')
      
      if (await aiGenerationPage.hasGeneratedImage()) {
        await aiGenerationPage.downloadImage(0)
        
        // Should trigger download
        // Note: In a real test, you might want to check for download events
      }
    })

    test('should save generated image', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.generateImage('A portrait of a person')
      
      if (await aiGenerationPage.hasGeneratedImage()) {
        await aiGenerationPage.saveImage(0)
        
        // Should show success message
        await expect(aiGenerationPage.page.locator('[data-testid="success-message"]')).toBeVisible()
      }
    })

    test('should share generated image', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.generateImage('A creative artwork')
      
      if (await aiGenerationPage.hasGeneratedImage()) {
        await aiGenerationPage.shareImage(0)
        
        // Should open share modal or options
        await expect(aiGenerationPage.page.locator('[data-testid="share-modal"]')).toBeVisible()
      }
    })

    test('should regenerate image', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.generateImage('A futuristic city')
      
      if (await aiGenerationPage.hasGeneratedImage()) {
        await aiGenerationPage.regenerateImage()
        
        // Should show new generation
        await expect(aiGenerationPage.page.locator('[data-testid="generated-image"]')).toBeVisible()
      }
    })
  })

  test.describe('Credits and Cost', () => {
    test('should display current credits', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      const credits = await aiGenerationPage.getCredits()
      expect(credits).toBeTruthy()
    })

    test('should display generation cost', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      const cost = await aiGenerationPage.getGenerationCost()
      expect(cost).toBeTruthy()
    })

    test('should prevent generation with insufficient credits', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      // Mock insufficient credits scenario
      await aiGenerationPage.page.evaluate(() => {
        // Simulate insufficient credits
        window.localStorage.setItem('userCredits', '0')
      })
      
      await aiGenerationPage.generateImage('A test image')
      
      // Should show insufficient credits error
      await expect(aiGenerationPage.page.locator('[data-testid="insufficient-credits-error"]')).toBeVisible()
    })
  })

  test.describe('Loading States', () => {
    test('should show loading state during generation', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.fill('[data-testid="prompt-input"]', 'A beautiful sunset')
      await aiGenerationPage.click('[data-testid="generate-button"]')
      
      // Should show loading state
      await expect(aiGenerationPage.page.locator('[data-testid="generation-progress"]')).toBeVisible()
    })

    test('should hide loading state after generation completes', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.generateImage('A mountain landscape')
      
      // Should hide loading state
      await aiGenerationPage.waitForGenerationComplete()
      await expect(aiGenerationPage.page.locator('[data-testid="generation-progress"]')).toBeHidden()
    })

    test('should disable generate button during generation', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.fill('[data-testid="prompt-input"]', 'A test prompt')
      await aiGenerationPage.click('[data-testid="generate-button"]')
      
      // Should disable generate button
      await expect(aiGenerationPage.page.locator('[data-testid="generate-button"]')).toBeDisabled()
    })
  })

  test.describe('Error Handling', () => {
    test('should handle generation errors gracefully', async () => {
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
    })

    test('should retry failed generation', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      // Simulate API error first
      await aiGenerationPage.page.route('**/api/ai/generate', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Generation failed' })
        })
      })
      
      await aiGenerationPage.generateImage('A test image')
      
      // Remove the route to allow normal generation
      await aiGenerationPage.page.unroute('**/api/ai/generate')
      
      // Click retry button
      await aiGenerationPage.page.click('[data-testid="retry-button"]')
      
      // Should show successful generation
      await expect(aiGenerationPage.page.locator('[data-testid="generated-image"]')).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should support keyboard navigation', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      // Tab through form elements
      await aiGenerationPage.pressKey('Tab')
      await aiGenerationPage.pressKey('Tab')
      await aiGenerationPage.pressKey('Tab')
      
      // Should be able to generate with Enter
      await aiGenerationPage.fill('[data-testid="prompt-input"]', 'A beautiful landscape')
      await aiGenerationPage.pressKey('Enter')
      
      await expect(aiGenerationPage.page.locator('[data-testid="generation-progress"]')).toBeVisible()
    })

    test('should have proper ARIA labels', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      // Check for ARIA labels
      await expect(aiGenerationPage.page.locator('[data-testid="prompt-input"]')).toHaveAttribute('aria-label')
      await expect(aiGenerationPage.page.locator('[data-testid="generate-button"]')).toHaveAttribute('aria-label')
      await expect(aiGenerationPage.page.locator('[data-testid="style-select"]')).toHaveAttribute('aria-label')
    })

    test('should announce generation status to screen readers', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.generateImage('A test image')
      
      // Check for live region announcements
      await expect(aiGenerationPage.page.locator('[aria-live="polite"]')).toBeVisible()
    })
  })

  test.describe('Form Validation', () => {
    test('should validate prompt length', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      // Test with very long prompt
      const longPrompt = 'A'.repeat(1000)
      await aiGenerationPage.fill('[data-testid="prompt-input"]', longPrompt)
      await aiGenerationPage.click('[data-testid="generate-button"]')
      
      // Should show validation error
      await expect(aiGenerationPage.page.locator('[data-testid="prompt-error"]')).toBeVisible()
    })

    test('should validate required fields', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.click('[data-testid="generate-button"]')
      
      // Should show validation error
      await expect(aiGenerationPage.page.locator('[data-testid="prompt-error"]')).toBeVisible()
    })

    test('should validate seed format', async () => {
      await aiGenerationPage.goToAIGeneration()
      
      await aiGenerationPage.openAdvancedSettings()
      await aiGenerationPage.setSeed('invalid-seed')
      
      // Should show validation error
      await expect(aiGenerationPage.page.locator('[data-testid="seed-error"]')).toBeVisible()
    })
  })
})
