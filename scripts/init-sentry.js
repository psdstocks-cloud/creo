#!/usr/bin/env node

/**
 * Sentry Initialization Script
 * 
 * This script helps initialize Sentry for the Creo platform.
 * It sets up the necessary configuration and provides guidance.
 */

const fs = require('fs')
const path = require('path')
require('dotenv').config()

console.log('🚀 Initializing Sentry for Creo Platform...\n')

// Check if Sentry is already configured
const sentryConfigFiles = [
  'sentry.client.config.ts',
  'sentry.server.config.ts',
  'sentry.edge.config.ts'
]

const existingConfigs = sentryConfigFiles.filter(file => 
  fs.existsSync(path.join(__dirname, '..', file))
)

if (existingConfigs.length > 0) {
  console.log('✅ Sentry configuration files found:')
  existingConfigs.forEach(file => console.log(`   - ${file}`))
  console.log('')
}

// Check environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SENTRY_DSN',
  'SENTRY_ORG',
  'SENTRY_PROJECT',
  'SENTRY_AUTH_TOKEN'
]

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.log('⚠️  Missing required environment variables:')
  missingEnvVars.forEach(envVar => console.log(`   - ${envVar}`))
  console.log('')
  console.log('Please add these to your .env.local file:')
  console.log('')
  missingEnvVars.forEach(envVar => {
    console.log(`${envVar}=your_value_here`)
  })
  console.log('')
}

// Check if Sentry is installed
const packageJsonPath = path.join(__dirname, '..', 'package.json')
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const sentryPackages = Object.keys(packageJson.dependencies || {})
    .concat(Object.keys(packageJson.devDependencies || {}))
    .filter(pkg => pkg.includes('sentry'))
  
  if (sentryPackages.length > 0) {
    console.log('✅ Sentry packages installed:')
    sentryPackages.forEach(pkg => console.log(`   - ${pkg}`))
    console.log('')
  } else {
    console.log('❌ Sentry packages not found. Please install them:')
    console.log('   npm install @sentry/nextjs @sentry/profiling-node')
    console.log('')
  }
}

// Provide setup instructions
console.log('📋 Sentry Setup Instructions:')
console.log('')
console.log('1. Create a Sentry project at https://sentry.io')
console.log('2. Get your DSN from the project settings')
console.log('3. Add environment variables to .env.local:')
console.log('   NEXT_PUBLIC_SENTRY_DSN=your_dsn_here')
console.log('   SENTRY_ORG=your_org_slug')
console.log('   SENTRY_PROJECT=your_project_slug')
console.log('   SENTRY_AUTH_TOKEN=your_auth_token')
console.log('')
console.log('4. Update next.config.ts to use Sentry config:')
console.log('   const { withSentryConfig } = require("@sentry/nextjs")')
console.log('   module.exports = withSentryConfig(nextConfig)')
console.log('')
console.log('5. Test Sentry integration:')
console.log('   npm run dev')
console.log('   # Visit your app and trigger an error')
console.log('   # Check your Sentry dashboard for the error')
console.log('')

// Check if Next.js config needs updating
const nextConfigPath = path.join(__dirname, '..', 'next.config.ts')
const nextConfigSentryPath = path.join(__dirname, '..', 'next.config.sentry.js')

if (fs.existsSync(nextConfigPath) && !fs.existsSync(nextConfigSentryPath)) {
  console.log('💡 Tip: Consider using the Sentry-specific Next.js config:')
  console.log('   Rename next.config.ts to next.config.base.ts')
  console.log('   Use next.config.sentry.js as your main config')
  console.log('')
}

// Provide testing commands
console.log('🧪 Testing Commands:')
console.log('')
console.log('# Test error tracking:')
console.log('curl -X POST http://localhost:3000/api/test-error')
console.log('')
console.log('# Test performance monitoring:')
console.log('curl -X GET http://localhost:3000/api/monitoring/sentry')
console.log('')

// Check if all required files exist
const requiredFiles = [
  'src/lib/sentry.ts',
  'src/components/error/SentryErrorBoundary.tsx',
  'src/hooks/useSentryPerformance.ts',
  'src/middleware/sentry.ts',
  'src/app/api/monitoring/sentry/route.ts'
]

const missingFiles = requiredFiles.filter(file => 
  !fs.existsSync(path.join(__dirname, '..', file))
)

if (missingFiles.length === 0) {
  console.log('✅ All Sentry implementation files are present!')
  console.log('')
  console.log('🎉 Sentry is ready to use!')
  console.log('')
  console.log('Next steps:')
  console.log('1. Set up your environment variables')
  console.log('2. Test the integration')
  console.log('3. Monitor your application in the Sentry dashboard')
} else {
  console.log('❌ Missing implementation files:')
  missingFiles.forEach(file => console.log(`   - ${file}`))
  console.log('')
  console.log('Please ensure all Sentry implementation files are created.')
}

console.log('')
console.log('📚 Documentation:')
console.log('   - Sentry Next.js Integration: https://docs.sentry.io/platforms/javascript/guides/nextjs/')
console.log('   - Sentry Performance Monitoring: https://docs.sentry.io/product/performance/')
console.log('   - Sentry Error Tracking: https://docs.sentry.io/product/issues/')
console.log('')
