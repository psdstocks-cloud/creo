#!/usr/bin/env node

/**
 * Create Admin User Script
 * Creates a real admin user with email and password
 */

const crypto = require('crypto')

console.log('👤 Creating Admin User Account...\n')

// Generate secure admin credentials
const adminEmail = 'admin@creo.com'
const adminPassword = crypto.randomBytes(12).toString('hex') // 24 character secure password
const adminId = crypto.randomUUID()

// Create admin user data
const adminUser = {
  id: adminId,
  email: adminEmail,
  password: adminPassword, // In production, this would be hashed
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
  created_at: new Date().toISOString(),
  is_verified: true,
  is_active: true
}

// Save admin user to a secure file
const fs = require('fs')
const path = require('path')

const adminDataPath = path.join(process.cwd(), 'admin-credentials.json')
fs.writeFileSync(adminDataPath, JSON.stringify(adminUser, null, 2))

console.log('✅ Admin User Created Successfully!')
console.log('\n🔐 ADMIN LOGIN CREDENTIALS:')
console.log('┌─────────────────┬─────────────────────┬─────────────────────────────────────┐')
console.log('│ Field           │ Value               │ Description                         │')
console.log('├─────────────────┼─────────────────────┼─────────────────────────────────────┤')
console.log(`│ Email           │ ${adminEmail.padEnd(19)} │ Admin email address                │`)
console.log(`│ Password        │ ${adminPassword.padEnd(19)} │ Secure generated password         │`)
console.log(`│ User ID         │ ${adminId.padEnd(19)} │ Unique user identifier            │`)
console.log(`│ Role            │ super_admin         │ Full administrative access          │`)
console.log(`│ Status          │ Active & Verified   │ Ready to use                        │`)
console.log('└─────────────────┴─────────────────────┴─────────────────────────────────────┘')

console.log('\n📋 ADMIN PERMISSIONS:')
adminUser.permissions.forEach((permission, index) => {
  console.log(`${index + 1}. ${permission.replace('_', ' ').toUpperCase()}`)
})

console.log('\n🔒 SECURITY NOTES:')
console.log('• Credentials saved to: admin-credentials.json')
console.log('• Password is securely generated (24 characters)')
console.log('• Account has full administrative privileges')
console.log('• Keep these credentials secure and private')

console.log('\n🚀 NEXT STEPS:')
console.log('1. Start the development server: npm run dev')
console.log('2. Navigate to: http://localhost:3000/auth/signin')
console.log('3. Use the credentials above to login')
console.log('4. Access admin features at: /admin')

console.log('\n⚠️  IMPORTANT:')
console.log('• These credentials are for development/testing only')
console.log('• For production, use proper user management system')
console.log('• Store credentials securely')
console.log('• Consider changing password after first login')

console.log('\n🎉 Admin account ready for use!')
