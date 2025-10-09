#!/usr/bin/env node

/**
 * Resend Confirmation Email for Admin User
 * This script resends the confirmation email for the admin user
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

console.log('📧 Resending Confirmation Email...\n')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function resendConfirmation() {
  try {
    const adminEmail = 'psdstockss@gmail.com'
    
    console.log(`📧 Resending confirmation email to: ${adminEmail}`)
    
    // Resend confirmation email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: adminEmail
    })
    
    if (error) {
      console.error('❌ Error resending confirmation email:', error.message)
      
      if (error.message.includes('already confirmed')) {
        console.log('\n✅ Email is already confirmed! You can login now.')
        console.log('🔐 Login at: https://creo-wine.vercel.app/auth/signin')
        console.log('📧 Email: psdstockss@gmail.com')
        console.log('🔑 Password: CreoAdmin2024!')
      } else if (error.message.includes('rate limit')) {
        console.log('\n⚠️  Rate limit exceeded. Please wait a few minutes and try again.')
      } else {
        console.log('\n❌ Could not resend confirmation email.')
        console.log('Please check your Supabase project settings for email configuration.')
      }
    } else {
      console.log('✅ Confirmation email sent successfully!')
      console.log('\n📧 Check your email inbox for the confirmation link')
      console.log('📧 Also check your spam folder')
      console.log('\n🔐 Once confirmed, login at: https://creo-wine.vercel.app/auth/signin')
      console.log('📧 Email: psdstockss@gmail.com')
      console.log('🔑 Password: CreoAdmin2024!')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

resendConfirmation()
