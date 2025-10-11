#!/usr/bin/env node

const { cache } = require('../src/lib/cache')

async function getCacheStats() {
  console.log('📊 Fetching cache statistics...')
  
  try {
    const stats = await cache.getStats()
    console.log('\n📈 Cache Statistics:')
    console.log(`Total Keys: ${stats.totalKeys.toLocaleString()}`)
    console.log(`Memory Usage: ${stats.memoryUsage}`)
    console.log(`Hit Rate: ${(stats.hitRate * 100).toFixed(1)}%`)
  } catch (error) {
    console.error('❌ Failed to fetch cache stats:', error)
    process.exit(1)
  }
}

getCacheStats()
