import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...')
  
  // Start browser for setup tasks
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // Check if the application is running
    console.log('📡 Checking application health...')
    const response = await page.goto(config.projects[0].use.baseURL || 'http://localhost:3000')
    
    if (!response || !response.ok()) {
      throw new Error(`Application not accessible: ${response?.status()}`)
    }
    
    console.log('✅ Application is running and accessible')
    
    // Wait for the application to be fully loaded
    await page.waitForLoadState('networkidle')
    
    // Check for any critical errors on the homepage
    const errors = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('[data-testid="error"]')
      return Array.from(errorElements).map(el => el.textContent)
    })
    
    if (errors.length > 0) {
      console.warn('⚠️  Found errors on homepage:', errors)
    }
    
    console.log('✅ Global setup completed successfully')
    
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

export default globalSetup
