#!/usr/bin/env node

/**
 * Get Confirmation Link for Admin User
 * This script helps you get the confirmation link for the admin user
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

console.log('🔗 Getting Confirmation Link for Admin User...\n')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function getConfirmationLink() {
  try {
    const adminEmail = 'psdstockss@gmail.com'
    
    console.log(`📧 Looking for confirmation link for: ${adminEmail}`)
    
    // Get the user from Supabase Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Error listing users:', listError.message)
      return
    }
    
    const adminUser = users.find(user => user.email === adminEmail)
    
    if (!adminUser) {
      console.error('❌ Admin user not found!')
      return
    }
    
    console.log('✅ Admin user found!')
    console.log(`User ID: ${adminUser.id}`)
    console.log(`Email: ${adminUser.email}`)
    console.log(`Email Confirmed: ${adminUser.email_confirmed_at ? 'Yes' : 'No'}`)
    console.log(`Created: ${adminUser.created_at}`)
    
    if (adminUser.email_confirmed_at) {
      console.log('\n🎉 Email is already confirmed! You can login now.')
      console.log('🔐 Login at: https://creo-wine.vercel.app/auth/signin')
    } else {
      console.log('\n⚠️  Email confirmation required')
      console.log('📧 Check your email inbox for the confirmation link')
      console.log('📧 Also check your spam folder')
      
      // Try to resend confirmation email
      console.log('\n🔄 Attempting to resend confirmation email...')
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: adminEmail
      })
      
      if (resendError) {
        console.log('❌ Could not resend confirmation email:', resendError.message)
      } else {
        console.log('✅ Confirmation email resent! Check your inbox.')
      }
    }
    
    console.log('\n📋 Manual Steps:')
    console.log('1. Check your email inbox for a message from Supabase')
    console.log('2. Look for subject: "Confirm your signup" or similar')
    console.log('3. Click the confirmation link in the email')
    console.log('4. Once confirmed, login at: https://creo-wine.vercel.app/auth/signin')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

getConfirmationLink()

