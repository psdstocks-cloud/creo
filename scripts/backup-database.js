#!/usr/bin/env node

/**
 * Database Backup Script
 * 
 * This script creates backups of critical database data and exports it to JSON files.
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createBackup() {
  console.log('💾 Starting database backup...')
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = path.join(__dirname, '..', 'backups', timestamp)
  
  // Create backup directory
  if (!fs.existsSync(path.dirname(backupDir))) {
    fs.mkdirSync(path.dirname(backupDir), { recursive: true })
  }
  fs.mkdirSync(backupDir, { recursive: true })
  
  console.log(`📁 Backup directory: ${backupDir}`)
  
  try {
    // Backup user profiles
    console.log('👥 Backing up user profiles...')
    const { data: userProfiles, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
    
    if (userError) throw userError
    
    fs.writeFileSync(
      path.join(backupDir, 'user_profiles.json'),
      JSON.stringify(userProfiles, null, 2)
    )
    console.log(`   ✅ ${userProfiles?.length || 0} user profiles backed up`)
    
    // Backup orders
    console.log('📦 Backing up orders...')
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
    
    if (ordersError) throw ordersError
    
    fs.writeFileSync(
      path.join(backupDir, 'orders.json'),
      JSON.stringify(orders, null, 2)
    )
    console.log(`   ✅ ${orders?.length || 0} orders backed up`)
    
    // Backup payments
    console.log('💳 Backing up payments...')
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
    
    if (paymentsError) throw paymentsError
    
    fs.writeFileSync(
      path.join(backupDir, 'payments.json'),
      JSON.stringify(payments, null, 2)
    )
    console.log(`   ✅ ${payments?.length || 0} payments backed up`)
    
    // Backup downloads
    console.log('📥 Backing up downloads...')
    const { data: downloads, error: downloadsError } = await supabase
      .from('downloads')
      .select('*')
    
    if (downloadsError) throw downloadsError
    
    fs.writeFileSync(
      path.join(backupDir, 'downloads.json'),
      JSON.stringify(downloads, null, 2)
    )
    console.log(`   ✅ ${downloads?.length || 0} downloads backed up`)
    
    // Backup system settings
    console.log('⚙️  Backing up system settings...')
    const { data: settings, error: settingsError } = await supabase
      .from('system_settings')
      .select('*')
    
    if (settingsError) throw settingsError
    
    fs.writeFileSync(
      path.join(backupDir, 'system_settings.json'),
      JSON.stringify(settings, null, 2)
    )
    console.log(`   ✅ ${settings?.length || 0} system settings backed up`)
    
    // Create backup metadata
    const backupMetadata = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      tables: {
        user_profiles: userProfiles?.length || 0,
        orders: orders?.length || 0,
        payments: payments?.length || 0,
        downloads: downloads?.length || 0,
        system_settings: settings?.length || 0
      },
      total_records: (userProfiles?.length || 0) + 
                    (orders?.length || 0) + 
                    (payments?.length || 0) + 
                    (downloads?.length || 0) + 
                    (settings?.length || 0)
    }
    
    fs.writeFileSync(
      path.join(backupDir, 'metadata.json'),
      JSON.stringify(backupMetadata, null, 2)
    )
    
    console.log('\n🎉 Backup completed successfully!')
    console.log(`📊 Total records backed up: ${backupMetadata.total_records}`)
    console.log(`📁 Backup location: ${backupDir}`)
    
    return backupDir
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message)
    throw error
  }
}

async function restoreBackup(backupPath) {
  console.log(`🔄 Restoring backup from: ${backupPath}`)
  
  if (!fs.existsSync(backupPath)) {
    console.error('❌ Backup directory not found:', backupPath)
    process.exit(1)
  }
  
  try {
    // Read backup metadata
    const metadataPath = path.join(backupPath, 'metadata.json')
    if (!fs.existsSync(metadataPath)) {
      console.error('❌ Backup metadata not found')
      process.exit(1)
    }
    
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
    console.log(`📊 Backup contains ${metadata.total_records} records from ${metadata.timestamp}`)
    
    // Restore user profiles
    console.log('👥 Restoring user profiles...')
    const userProfilesPath = path.join(backupPath, 'user_profiles.json')
    if (fs.existsSync(userProfilesPath)) {
      const userProfiles = JSON.parse(fs.readFileSync(userProfilesPath, 'utf8'))
      
      for (const profile of userProfiles) {
        const { error } = await supabase
          .from('user_profiles')
          .upsert(profile)
        
        if (error) {
          console.error(`❌ Error restoring user profile ${profile.id}:`, error.message)
        }
      }
      console.log(`   ✅ ${userProfiles.length} user profiles restored`)
    }
    
    // Restore orders
    console.log('📦 Restoring orders...')
    const ordersPath = path.join(backupPath, 'orders.json')
    if (fs.existsSync(ordersPath)) {
      const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'))
      
      for (const order of orders) {
        const { error } = await supabase
          .from('orders')
          .upsert(order)
        
        if (error) {
          console.error(`❌ Error restoring order ${order.id}:`, error.message)
        }
      }
      console.log(`   ✅ ${orders.length} orders restored`)
    }
    
    // Restore payments
    console.log('💳 Restoring payments...')
    const paymentsPath = path.join(backupPath, 'payments.json')
    if (fs.existsSync(paymentsPath)) {
      const payments = JSON.parse(fs.readFileSync(paymentsPath, 'utf8'))
      
      for (const payment of payments) {
        const { error } = await supabase
          .from('payments')
          .upsert(payment)
        
        if (error) {
          console.error(`❌ Error restoring payment ${payment.id}:`, error.message)
        }
      }
      console.log(`   ✅ ${payments.length} payments restored`)
    }
    
    // Restore downloads
    console.log('📥 Restoring downloads...')
    const downloadsPath = path.join(backupPath, 'downloads.json')
    if (fs.existsSync(downloadsPath)) {
      const downloads = JSON.parse(fs.readFileSync(downloadsPath, 'utf8'))
      
      for (const download of downloads) {
        const { error } = await supabase
          .from('downloads')
          .upsert(download)
        
        if (error) {
          console.error(`❌ Error restoring download ${download.id}:`, error.message)
        }
      }
      console.log(`   ✅ ${downloads.length} downloads restored`)
    }
    
    // Restore system settings
    console.log('⚙️  Restoring system settings...')
    const settingsPath = path.join(backupPath, 'system_settings.json')
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'))
      
      for (const setting of settings) {
        const { error } = await supabase
          .from('system_settings')
          .upsert(setting)
        
        if (error) {
          console.error(`❌ Error restoring setting ${setting.key}:`, error.message)
        }
      }
      console.log(`   ✅ ${settings.length} system settings restored`)
    }
    
    console.log('\n🎉 Backup restored successfully!')
    
  } catch (error) {
    console.error('❌ Restore failed:', error.message)
    throw error
  }
}

async function listBackups() {
  console.log('📋 Available backups:')
  
  const backupsDir = path.join(__dirname, '..', 'backups')
  
  if (!fs.existsSync(backupsDir)) {
    console.log('   No backups found')
    return
  }
  
  const backupDirs = fs.readdirSync(backupsDir)
    .filter(item => {
      const itemPath = path.join(backupsDir, item)
      return fs.statSync(itemPath).isDirectory()
    })
    .sort()
    .reverse() // Most recent first
  
  if (backupDirs.length === 0) {
    console.log('   No backups found')
    return
  }
  
  for (const backupDir of backupDirs) {
    const backupPath = path.join(backupsDir, backupDir)
    const metadataPath = path.join(backupPath, 'metadata.json')
    
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
      console.log(`   📁 ${backupDir}`)
      console.log(`      📅 ${metadata.timestamp}`)
      console.log(`      📊 ${metadata.total_records} records`)
    } else {
      console.log(`   📁 ${backupDir} (incomplete)`)
    }
  }
}

async function cleanupOldBackups(keepDays = 30) {
  console.log(`🧹 Cleaning up backups older than ${keepDays} days...`)
  
  const backupsDir = path.join(__dirname, '..', 'backups')
  
  if (!fs.existsSync(backupsDir)) {
    console.log('   No backups directory found')
    return
  }
  
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - keepDays)
  
  const backupDirs = fs.readdirSync(backupsDir)
    .filter(item => {
      const itemPath = path.join(backupsDir, item)
      return fs.statSync(itemPath).isDirectory()
    })
  
  let deletedCount = 0
  
  for (const backupDir of backupDirs) {
    const backupPath = path.join(backupsDir, backupDir)
    const metadataPath = path.join(backupPath, 'metadata.json')
    
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
      const backupDate = new Date(metadata.timestamp)
      
      if (backupDate < cutoffDate) {
        console.log(`   🗑️  Deleting old backup: ${backupDir}`)
        fs.rmSync(backupPath, { recursive: true, force: true })
        deletedCount++
      }
    }
  }
  
  console.log(`✅ Cleaned up ${deletedCount} old backups`)
}

// Main execution
async function main() {
  const command = process.argv[2]
  const arg = process.argv[3]
  
  switch (command) {
    case 'create':
      await createBackup()
      break
    case 'restore':
      if (!arg) {
        console.error('❌ Please specify backup path to restore')
        process.exit(1)
      }
      await restoreBackup(arg)
      break
    case 'list':
      await listBackups()
      break
    case 'cleanup':
      const keepDays = parseInt(arg) || 30
      await cleanupOldBackups(keepDays)
      break
    default:
      console.log('💾 Database Backup Tool')
      console.log('')
      console.log('Usage:')
      console.log('  node scripts/backup-database.js create           - Create a new backup')
      console.log('  node scripts/backup-database.js restore <path>   - Restore from backup')
      console.log('  node scripts/backup-database.js list           - List available backups')
      console.log('  node scripts/backup-database.js cleanup [days] - Clean up old backups')
      console.log('')
      break
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error.message)
  process.exit(1)
})
