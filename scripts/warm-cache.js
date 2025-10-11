#!/usr/bin/env node

const { cacheWarmer } = require('../src/lib/cache-aware-client')

async function warmCache() {
  console.log('🔥 Starting cache warming...')
  
  try {
    await cacheWarmer.warmAll()
    console.log('✅ Cache warming completed successfully')
  } catch (error) {
    console.error('❌ Cache warming failed:', error)
    process.exit(1)
  }
}

warmCache()
