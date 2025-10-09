#!/usr/bin/env node

/**
 * Create Admin User in Supabase
 * Run this script after setting up your Supabase project
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

console.log('🔧 Creating Admin User in Supabase...\n')

// You need to set these environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.log('\nPlease set these environment variables:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here')
  console.log('\nThen run: node scripts/create-admin-supabase.js')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdminUser() {
  try {
    console.log('📧 Creating admin user...')
    
    const adminEmail = 'psdstockss@gmail.com'
    const adminPassword = 'CreoAdmin2024!'
    
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          role: 'super_admin',
          permissions: [
            'all_access',
            'user_management',
            'system_settings',
            'analytics',
            'content_management',
            'order_management',
            'billing_management'
          ]
        }
      }
    })

    if (error) {
      console.error('❌ Error creating user:', error.message)
      
      if (error.message.includes('already registered')) {
        console.log('\n✅ User already exists! You can login with:')
        console.log(`Email: ${adminEmail}`)
        console.log(`Password: ${adminPassword}`)
        return
      }
      
      return
    }

    if (data.user) {
      console.log('✅ Admin user created successfully!')
      console.log('\n🔐 LOGIN CREDENTIALS:')
      console.log(`Email: ${adminEmail}`)
      console.log(`Password: ${adminPassword}`)
      console.log(`User ID: ${data.user.id}`)
      
      if (data.user.email_confirmed_at) {
        console.log('✅ Email is confirmed - ready to login!')
      } else {
        console.log('⚠️  Email confirmation required')
        console.log('Check your email for confirmation link')
      }
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

createAdminUser()
