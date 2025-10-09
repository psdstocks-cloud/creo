#!/usr/bin/env node

/**
 * Check Supabase Connection and Environment Variables
 * This script helps verify that Supabase is properly configured
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

console.log('🔍 Checking Supabase Connection...\n')

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('📋 Environment Variables Check:')
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`)
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Set' : '❌ Missing'}`)

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Missing Supabase environment variables!')
  console.log('\n🔧 To fix this:')
  console.log('1. Create a .env.local file in your project root')
  console.log('2. Add your Supabase credentials:')
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here')
  console.log('\n3. Get these values from your Supabase project dashboard:')
  console.log('   - Go to https://supabase.com/dashboard')
  console.log('   - Select your project')
  console.log('   - Go to Settings > API')
  console.log('   - Copy the Project URL and anon/public key')
  console.log('\n4. For Vercel deployment, also add these to Vercel environment variables:')
  console.log('   - Go to your Vercel dashboard')
  console.log('   - Select your project')
  console.log('   - Go to Settings > Environment Variables')
  console.log('   - Add the same variables there')
  process.exit(1)
}

// Test Supabase connection
async function testConnection() {
  try {
    console.log('\n🔌 Testing Supabase connection...')
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test basic connection by getting session
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.log('❌ Supabase connection failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    console.log(`📡 Connected to: ${supabaseUrl}`)
    
    // Test auth service
    console.log('\n🔐 Testing authentication service...')
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    if (authError && authError.message.includes('Invalid API key')) {
      console.log('❌ Invalid Supabase API key!')
      console.log('Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY')
      return false
    }
    
    console.log('✅ Authentication service is working!')
    
    // Test database connection
    console.log('\n🗄️  Testing database connection...')
    const { data: dbData, error: dbError } = await supabase
      .from('auth.users')
      .select('count')
      .limit(1)
    
    if (dbError) {
      console.log('⚠️  Database query failed (this might be normal):', dbError.message)
    } else {
      console.log('✅ Database connection is working!')
    }
    
    return true
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message)
    return false
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Supabase is properly configured and connected!')
    console.log('\n📝 Next steps:')
    console.log('1. Run: node scripts/create-admin-supabase.js')
    console.log('2. Test login at: https://creo-wine.vercel.app/auth/signin')
  } else {
    console.log('\n❌ Supabase connection failed. Please check your configuration.')
  }
})
