#!/usr/bin/env node

/**
 * Configure Supabase Redirect URLs for Vercel Deployment
 * This script helps configure Supabase to work with your Vercel deployment
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

console.log('🔧 Configuring Supabase Redirect URLs for Vercel...\n')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function configureRedirects() {
  try {
    console.log('📋 Supabase Configuration Instructions:')
    console.log('=' .repeat(60))
    console.log('\n🔧 MANUAL CONFIGURATION REQUIRED:')
    console.log('Since we cannot programmatically update Supabase settings with the anon key,')
    console.log('you need to manually configure the redirect URLs in your Supabase dashboard.\n')
    
    console.log('📝 Step-by-Step Instructions:')
    console.log('1. Go to https://supabase.com/dashboard')
    console.log('2. Select your project: avwqjnsxxuhfohtukevb')
    console.log('3. Go to Authentication → URL Configuration')
    console.log('4. Update the following settings:\n')
    
    console.log('🌐 Site URL:')
    console.log('   https://creo-wine.vercel.app\n')
    
    console.log('🔄 Redirect URLs (add these):')
    console.log('   https://creo-wine.vercel.app/auth/callback')
    console.log('   https://creo-wine.vercel.app/auth/signin')
    console.log('   https://creo-wine.vercel.app/auth/signup')
    console.log('   https://creo-wine.vercel.app/dashboard')
    console.log('   https://creo-wine.vercel.app/\n')
    
    console.log('📧 Email Templates:')
    console.log('   Go to Authentication → Email Templates')
    console.log('   Update "Confirm your signup" template:')
    console.log('   - Change confirmation URL to: https://creo-wine.vercel.app/auth/callback')
    console.log('   - Or use: {{ .SiteURL }}/auth/callback\n')
    
    console.log('🔐 Additional Settings:')
    console.log('   - Enable email confirmations: ON')
    console.log('   - Enable email change confirmations: ON')
    console.log('   - Enable phone confirmations: OFF (unless needed)\n')
    
    console.log('✅ After making these changes:')
    console.log('1. Test the signup flow at: https://creo-wine.vercel.app/auth/signup')
    console.log('2. Check that confirmation emails point to Vercel URLs')
    console.log('3. Verify login works at: https://creo-wine.vercel.app/auth/signin\n')
    
    console.log('🚨 IMPORTANT:')
    console.log('Make sure your Vercel environment variables are also set:')
    console.log('- NEXT_PUBLIC_SUPABASE_URL')
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
    console.log('- NEXT_PUBLIC_NEHTW_API_KEY')
    console.log('- NEXT_PUBLIC_NEHTW_BASE_URL\n')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

configureRedirects()
