import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...')
  
  try {
    // Clean up any test data if needed
    console.log('📊 Cleaning up test data...')
    
    // Add any cleanup logic here
    // For example, cleaning up test users, orders, etc.
    
    console.log('✅ Global teardown completed successfully')
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error)
    // Don't throw error in teardown to avoid masking test failures
  }
}

export default globalTeardown
