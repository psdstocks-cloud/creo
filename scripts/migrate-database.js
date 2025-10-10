#!/usr/bin/env node

/**
 * Database Migration Script
 * 
 * This script applies database migrations to the Supabase database.
 * It runs all migration files in the supabase/migrations directory in order.
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

async function runMigrations() {
  console.log('🚀 Starting database migrations...')
  
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')
  
  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Migrations directory not found:', migrationsDir)
    process.exit(1)
  }
  
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()
  
  if (migrationFiles.length === 0) {
    console.log('ℹ️  No migration files found')
    return
  }
  
  console.log(`📁 Found ${migrationFiles.length} migration files:`)
  migrationFiles.forEach(file => console.log(`   - ${file}`))
  
  // Create migrations tracking table if it doesn't exist
  await createMigrationsTable()
  
  for (const file of migrationFiles) {
    const migrationName = file.replace('.sql', '')
    const filePath = path.join(migrationsDir, file)
    
    console.log(`\n🔄 Running migration: ${migrationName}`)
    
    try {
      // Check if migration has already been run
      const { data: existingMigration } = await supabase
        .from('_migrations')
        .select('id')
        .eq('name', migrationName)
        .single()
      
      if (existingMigration) {
        console.log(`⏭️  Migration ${migrationName} already applied, skipping...`)
        continue
      }
      
      // Read and execute migration file
      const migrationSQL = fs.readFileSync(filePath, 'utf8')
      
      const { error } = await supabase.rpc('exec_sql', {
        sql: migrationSQL
      })
      
      if (error) {
        console.error(`❌ Error running migration ${migrationName}:`, error.message)
        throw error
      }
      
      // Record successful migration
      await supabase
        .from('_migrations')
        .insert({
          name: migrationName,
          executed_at: new Date().toISOString()
        })
      
      console.log(`✅ Migration ${migrationName} completed successfully`)
      
    } catch (error) {
      console.error(`❌ Failed to run migration ${migrationName}:`, error.message)
      process.exit(1)
    }
  }
  
  console.log('\n🎉 All migrations completed successfully!')
}

async function createMigrationsTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    );
  `
  
  const { error } = await supabase.rpc('exec_sql', {
    sql: createTableSQL
  })
  
  if (error) {
    console.error('❌ Error creating migrations table:', error.message)
    throw error
  }
}

async function rollbackMigration(migrationName) {
  console.log(`🔄 Rolling back migration: ${migrationName}`)
  
  try {
    // Remove migration record
    const { error } = await supabase
      .from('_migrations')
      .delete()
      .eq('name', migrationName)
    
    if (error) {
      console.error(`❌ Error rolling back migration ${migrationName}:`, error.message)
      throw error
    }
    
    console.log(`✅ Migration ${migrationName} rolled back successfully`)
    
  } catch (error) {
    console.error(`❌ Failed to rollback migration ${migrationName}:`, error.message)
    process.exit(1)
  }
}

async function listMigrations() {
  console.log('📋 Migration Status:')
  
  const { data: migrations, error } = await supabase
    .from('_migrations')
    .select('*')
    .order('executed_at')
  
  if (error) {
    console.error('❌ Error fetching migrations:', error.message)
    return
  }
  
  if (migrations.length === 0) {
    console.log('   No migrations have been applied')
    return
  }
  
  migrations.forEach(migration => {
    console.log(`   ✅ ${migration.name} - ${migration.executed_at}`)
  })
}

async function checkDatabaseHealth() {
  console.log('🏥 Checking database health...')
  
  try {
    const { data, error } = await supabase
      .rpc('get_system_health')
    
    if (error) {
      console.error('❌ Error checking database health:', error.message)
      return
    }
    
    console.log('✅ Database health check passed')
    console.log(`   Status: ${data[0]?.status}`)
    console.log(`   Message: ${data[0]?.message}`)
    
  } catch (error) {
    console.error('❌ Database health check failed:', error.message)
  }
}

// Main execution
async function main() {
  const command = process.argv[2]
  
  switch (command) {
    case 'migrate':
      await runMigrations()
      break
    case 'rollback':
      const migrationName = process.argv[3]
      if (!migrationName) {
        console.error('❌ Please specify migration name to rollback')
        process.exit(1)
      }
      await rollbackMigration(migrationName)
      break
    case 'list':
      await listMigrations()
      break
    case 'health':
      await checkDatabaseHealth()
      break
    default:
      console.log('📖 Database Migration Tool')
      console.log('')
      console.log('Usage:')
      console.log('  node scripts/migrate-database.js migrate    - Run all pending migrations')
      console.log('  node scripts/migrate-database.js rollback <name> - Rollback a specific migration')
      console.log('  node scripts/migrate-database.js list      - List applied migrations')
      console.log('  node scripts/migrate-database.js health    - Check database health')
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
