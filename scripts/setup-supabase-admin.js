#!/usr/bin/env node

/**
 * Supabase Admin Setup Script
 * Creates admin user in Supabase and sets up the database
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

console.log('🔧 Setting up Supabase Admin User...\n')

// Check for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.log('You can get these from your Supabase project dashboard')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

async function setupAdminUser() {
  try {
    console.log('📧 Creating admin user in Supabase...')
    
    // Admin credentials
    const adminEmail = 'admin@creo.com'
    const adminPassword = 'CreoAdmin2024!'
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
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

    if (authError) {
      console.error('❌ Error creating user:', authError.message)
      return
    }

    console.log('✅ Admin user created in Supabase Auth')
    console.log('📧 Email verification may be required')

    // Create user profile in database
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: adminEmail,
          role: 'super_admin',
          permissions: [
            'all_access',
            'user_management',
            'system_settings',
            'analytics',
            'content_management',
            'order_management',
            'billing_management'
          ],
          is_verified: true,
          is_active: true,
          created_at: new Date().toISOString()
        })

      if (profileError) {
        console.log('⚠️  Profile creation failed (table may not exist yet):', profileError.message)
        console.log('This is normal for first-time setup')
      } else {
        console.log('✅ User profile created in database')
      }
    }

    // Save credentials to file
    const credentials = {
      email: adminEmail,
      password: adminPassword,
      supabase_url: supabaseUrl,
      created_at: new Date().toISOString(),
      status: 'created_in_supabase'
    }

    const credentialsPath = path.join(process.cwd(), 'admin-credentials.json')
    fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2))

    console.log('\n🎉 ADMIN USER CREATED SUCCESSFULLY!')
    console.log('\n🔐 LOGIN CREDENTIALS:')
    console.log('┌─────────────────┬─────────────────────┬─────────────────────────────────────┐')
    console.log('│ Field           │ Value               │ Description                         │')
    console.log('├─────────────────┼─────────────────────┼─────────────────────────────────────┤')
    console.log(`│ Email           │ ${adminEmail.padEnd(19)} │ Admin email address                │`)
    console.log(`│ Password        │ ${adminPassword.padEnd(19)} │ Admin password                     │`)
    console.log(`│ Supabase URL    │ ${supabaseUrl.substring(0, 19).padEnd(19)} │ Your Supabase project URL         │`)
    console.log(`│ Status          │ Created in Supabase │ Ready for production use            │`)
    console.log('└─────────────────┴─────────────────────┴─────────────────────────────────────┘')

    console.log('\n📋 ADMIN PERMISSIONS:')
    const permissions = [
      'ALL ACCESS',
      'USER MANAGEMENT', 
      'SYSTEM SETTINGS',
      'ANALYTICS',
      'CONTENT MANAGEMENT',
      'ORDER MANAGEMENT',
      'BILLING MANAGEMENT'
    ]
    permissions.forEach((permission, index) => {
      console.log(`${index + 1}. ${permission}`)
    })

    console.log('\n🚀 DEPLOYMENT READY:')
    console.log('1. Commit and push to git: git add . && git commit -m "Add admin user" && git push')
    console.log('2. Deploy to Vercel with environment variables')
    console.log('3. Login at: https://your-app.vercel.app/auth/signin')
    console.log('4. Use the credentials above to access admin features')

    console.log('\n🔒 SECURITY NOTES:')
    console.log('• Credentials saved to: admin-credentials.json')
    console.log('• User created in Supabase Auth')
    console.log('• Ready for production deployment')
    console.log('• Keep credentials secure')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

// Run the setup
setupAdminUser()

