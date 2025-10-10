#!/usr/bin/env node

/**
 * Test API Integration Script
 * 
 * Tests the integration between our app and external APIs
 */

require('dotenv').config({ path: '.env.local' })

const axios = require('axios')

// Test configuration
const NEHTW_BASE_URL = process.env.NEXT_PUBLIC_NEHTW_BASE_URL || 'https://nehtw.com/api'
const NEHTW_API_KEY = process.env.NEXT_PUBLIC_NEHTW_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🧪 Testing API Integration...\n')

// Test 1: NEHTW API Connection
async function testNEHTWAPI() {
  console.log('1️⃣ Testing NEHTW API Connection...')
  
  if (!NEHTW_API_KEY) {
    console.log('❌ NEHTW_API_KEY not found in environment variables')
    return false
  }

  try {
    const response = await axios.get(`${NEHTW_BASE_URL}/health`, {
      headers: {
        'X-Api-Key': NEHTW_API_KEY,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })
    
    console.log('✅ NEHTW API Connection: SUCCESS')
    console.log(`   Status: ${response.status}`)
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`)
    return true
  } catch (error) {
    console.log('❌ NEHTW API Connection: FAILED')
    console.log(`   Error: ${error.message}`)
    if (error.response) {
      console.log(`   Status: ${error.response.status}`)
      console.log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`)
    }
    return false
  }
}

// Test 2: Supabase Connection
async function testSupabaseAPI() {
  console.log('\n2️⃣ Testing Supabase API Connection...')
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.log('❌ Supabase environment variables not found')
    return false
  }

  try {
    const response = await axios.get(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })
    
    console.log('✅ Supabase API Connection: SUCCESS')
    console.log(`   Status: ${response.status}`)
    return true
  } catch (error) {
    console.log('❌ Supabase API Connection: FAILED')
    console.log(`   Error: ${error.message}`)
    if (error.response) {
      console.log(`   Status: ${error.response.status}`)
    }
    return false
  }
}

// Test 3: Environment Variables
function testEnvironmentVariables() {
  console.log('\n3️⃣ Testing Environment Variables...')
  
  const requiredVars = [
    'NEXT_PUBLIC_NEHTW_API_KEY',
    'NEXT_PUBLIC_NEHTW_BASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_APP_URL'
  ]
  
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length === 0) {
    console.log('✅ All required environment variables are set')
    return true
  } else {
    console.log('❌ Missing environment variables:')
    missing.forEach(varName => console.log(`   - ${varName}`))
    return false
  }
}

// Run all tests
async function runTests() {
  const envTest = testEnvironmentVariables()
  const nehtwTest = await testNEHTWAPI()
  const supabaseTest = await testSupabaseAPI()
  
  console.log('\n📊 Test Results Summary:')
  console.log(`   Environment Variables: ${envTest ? '✅' : '❌'}`)
  console.log(`   NEHTW API: ${nehtwTest ? '✅' : '❌'}`)
  console.log(`   Supabase API: ${supabaseTest ? '✅' : '❌'}`)
  
  const allPassed = envTest && nehtwTest && supabaseTest
  console.log(`\n🎯 Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)
  
  if (allPassed) {
    console.log('\n🚀 Your API integration is ready for production!')
  } else {
    console.log('\n⚠️  Please fix the failed tests before deploying.')
  }
}

// Run the tests
runTests().catch(console.error)

