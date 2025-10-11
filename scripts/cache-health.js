#!/usr/bin/env node

const { cache } = require('../src/lib/cache')

async function checkCacheHealth() {
  console.log('🏥 Checking cache health...')
  
  try {
    const health = await cache.health()
    console.log('\n💚 Cache Health:')
    console.log(`Status: ${health.status}`)
    console.log(`Latency: ${health.latency}ms`)
    if (health.error) {
      console.log(`Error: ${health.error}`)
    }
  } catch (error) {
    console.error('❌ Failed to check cache health:', error)
    process.exit(1)
  }
}

checkCacheHealth()
