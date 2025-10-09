#!/usr/bin/env node

/**
 * Environment Setup Script
 * Creates .env.local file with demo configuration
 */

const fs = require('fs')
const path = require('path')

console.log('🔧 Setting up environment for Creo...\n')

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Backing up to .env.local.backup')
  fs.copyFileSync(envPath, path.join(process.cwd(), '.env.local.backup'))
}

// Create .env.local with demo configuration
const envContent = `# Creo Development Environment
# This file is for development/testing purposes

# =============================================================================
# SUPABASE CONFIGURATION (DEMO MODE)
# =============================================================================
# For demo mode, these can be dummy values
# In production, replace with real Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo_anon_key_for_development

# =============================================================================
# NEHTW API CONFIGURATION
# =============================================================================
# Replace with your actual NEHTW API credentials
NEXT_PUBLIC_NEHTW_API_KEY=your_nehtw_api_key_here
NEXT_PUBLIC_NEHTW_BASE_URL=https://nehtw.com/api

# =============================================================================
# DEVELOPMENT CONFIGURATION
# =============================================================================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# =============================================================================
# VIRTUAL PAYMENT SYSTEM (DEVELOPMENT)
# =============================================================================
NEXT_PUBLIC_VIRTUAL_PAYMENTS=true
NEXT_PUBLIC_PAYMENT_SUCCESS_RATE=0.9
`

fs.writeFileSync(envPath, envContent)

console.log('✅ Environment file created: .env.local')
console.log('\n📋 Demo Login Credentials:')
console.log('┌─────────────────┬─────────────────────┬──────────┬─────────────────────────────────────┐')
console.log('│ Role            │ Email               │ Password │ Permissions                          │')
console.log('├─────────────────┼─────────────────────┼──────────┼─────────────────────────────────────┤')
console.log('│ Super Admin     │ admin@creo.demo     │ demo123  │ All Access, User Management        │')
console.log('│ Content Manager │ content@creo.demo   │ demo123  │ Content Management, Order Processing │')
console.log('│ Support Admin   │ support@creo.demo   │ demo123  │ User Support, Order Management     │')
console.log('└─────────────────┴─────────────────────┴──────────┴─────────────────────────────────────┘')

console.log('\n🚀 Next Steps:')
console.log('1. Start the development server: npm run dev')
console.log('2. Navigate to: http://localhost:3000/auth/test')
console.log('3. Use the demo login buttons to test different user roles')
console.log('4. Test protected routes: /dashboard, /orders, /ai-generation')
console.log('\n📖 For production setup, see SETUP_GUIDE.md')
console.log('\n🎉 Ready to test the authentication system!')
