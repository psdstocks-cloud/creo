#!/usr/bin/env node

/**
 * Verify Vercel Environment Variables
 * This script helps verify that all required environment variables are set in Vercel
 */

console.log('🔍 Verifying Vercel Environment Variables...\n')

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_NEHTW_API_KEY',
  'NEXT_PUBLIC_NEHTW_BASE_URL',
  'NEXT_PUBLIC_APP_URL'
]

console.log('📋 Required Environment Variables for Vercel:')
console.log('=' .repeat(50))

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar]
  const status = value ? '✅ Set' : '❌ Missing'
  console.log(`${envVar}: ${status}`)
  
  if (value && envVar.includes('URL')) {
    console.log(`   Value: ${value}`)
  } else if (value && envVar.includes('KEY')) {
    console.log(`   Value: ${value.substring(0, 10)}...`)
  }
})

console.log('\n🔧 How to Set Vercel Environment Variables:')
console.log('=' .repeat(50))
console.log('1. Go to https://vercel.com/dashboard')
console.log('2. Select your project: creo-wine')
console.log('3. Go to Settings → Environment Variables')
console.log('4. Add each variable with its value:')
console.log('')

requiredEnvVars.forEach(envVar => {
  console.log(`   ${envVar}:`)
  if (envVar === 'NEXT_PUBLIC_SUPABASE_URL') {
    console.log('     https://avwqjnsxxuhfohtukevb.supabase.co')
  } else if (envVar === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
    console.log('     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2d3FqbnN4eHVoZm9odHVrZXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3OTE3MTksImV4cCI6MjA3NTM2NzcxOX0.yMa2sqXKBaVPO9CabD-_nNAlUXgZ597C12VzmVzXxzg')
  } else if (envVar === 'NEXT_PUBLIC_NEHTW_API_KEY') {
    console.log('     A8K9bV5s2OX12E8cmS4I96mtmSNzv7')
  } else if (envVar === 'NEXT_PUBLIC_NEHTW_BASE_URL') {
    console.log('     https://nehtw.com/api')
  } else if (envVar === 'NEXT_PUBLIC_APP_URL') {
    console.log('     https://creo-wine.vercel.app')
  }
  console.log('')
})

console.log('🚀 After setting environment variables:')
console.log('1. Redeploy your Vercel app (or wait for auto-deploy)')
console.log('2. Test the signup flow at: https://creo-wine.vercel.app/auth/signup')
console.log('3. Check that confirmation emails work properly')
console.log('4. Test login at: https://creo-wine.vercel.app/auth/signin')

console.log('\n📧 Test Admin Credentials:')
console.log('Email: psdstockss@gmail.com')
console.log('Password: CreoAdmin2024!')
