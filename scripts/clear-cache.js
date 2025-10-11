#!/usr/bin/env node

const { cache } = require('../src/lib/cache')

async function clearCache() {
  console.log('🧹 Clearing cache...')
  
  try {
    const success = await cache.clear()
    if (success) {
      console.log('✅ Cache cleared successfully')
    } else {
      console.error('❌ Failed to clear cache')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Cache clearing failed:', error)
    process.exit(1)
  }
}

clearCache()
