# Database Implementation Guide

This document outlines the comprehensive database implementation for the Creo platform, including Row Level Security (RLS) policies, migrations, and optimization strategies.

## Overview

The database implementation includes:
- **Complete Schema**: All necessary tables with proper relationships
- **Row Level Security**: Comprehensive RLS policies for data protection
- **Database Optimization**: Indexes, functions, and performance monitoring
- **Migration System**: Automated database migrations
- **Backup System**: Automated backup and restore functionality
- **Type Safety**: Full TypeScript integration

## Database Schema

### Core Tables

#### 1. User Profiles (`user_profiles`)
- **Purpose**: Extends Supabase auth.users with application-specific data
- **Key Fields**: credits, subscription_plan, subscription_status, metadata
- **Relationships**: One-to-many with orders, downloads, payments, api_keys

#### 2. Orders (`orders`)
- **Purpose**: Tracks all user orders (stock downloads, AI generation)
- **Key Fields**: order_type, status, total_cost, credits_used, items (JSONB)
- **Status Flow**: pending → processing → completed/failed/cancelled

#### 3. Downloads (`downloads`)
- **Purpose**: Manages user download history and file access
- **Key Fields**: file_name, file_url, file_size, file_type, expires_at
- **Features**: Download tracking, expiration handling, file organization

#### 4. Payments (`payments`)
- **Purpose**: Handles all payment transactions and Stripe integration
- **Key Fields**: stripe_payment_intent_id, amount, status, refund_amount
- **Features**: Payment tracking, refund management, revenue analytics

#### 5. API Keys (`api_keys`)
- **Purpose**: Manages user API keys for programmatic access
- **Key Fields**: key_hash, scopes, usage_count, expires_at
- **Security**: Hashed storage, scope-based permissions, usage tracking

#### 6. User Preferences (`user_preferences`)
- **Purpose**: Stores user-specific settings and preferences
- **Key Fields**: language, timezone, theme, notification preferences
- **Features**: Personalization, accessibility settings

#### 7. Saved Searches (`saved_searches`)
- **Purpose**: Allows users to save and share search queries
- **Key Fields**: search_query, filters (JSONB), is_public
- **Features**: Personal and public search collections

#### 8. Admin Logs (`admin_logs`)
- **Purpose**: Audit trail for administrative actions
- **Key Fields**: action, target_type, target_id, details (JSONB)
- **Features**: Complete audit trail, IP tracking, action logging

#### 9. System Settings (`system_settings`)
- **Purpose**: Application configuration and feature flags
- **Key Fields**: key, value (JSONB), is_public
- **Features**: Dynamic configuration, feature toggles

## Row Level Security (RLS)

### Security Principles

1. **User Isolation**: Users can only access their own data
2. **Admin Access**: Admins can access all data with proper logging
3. **Public Data**: Some data (public saved searches) is accessible to all
4. **API Security**: API keys provide controlled access to user data

### RLS Policies

#### User Profiles
- Users can view/update their own profile
- Admins can view/update all profiles
- Automatic profile creation on user signup

#### Orders
- Users can view/create/update their own orders
- Admins can view/update all orders
- Status transition validation

#### Downloads
- Users can view/create/update their own downloads
- Admins can view/update all downloads
- Automatic expiration handling

#### Payments
- Users can view their own payments
- Admins can view/update all payments
- Secure payment data handling

#### API Keys
- Users can manage their own API keys
- Admins can manage all API keys
- Secure key storage and validation

## Database Functions

### User Management
- `get_user_credits(user_uuid)`: Get user's current credit balance
- `deduct_credits(user_uuid, amount)`: Safely deduct credits
- `add_credits(user_uuid, amount)`: Add credits to user account
- `get_user_stats(user_uuid)`: Get comprehensive user statistics

### System Functions
- `get_system_stats()`: Get platform-wide statistics
- `get_user_activity_summary(user_uuid, days_back)`: Get user activity data
- `check_rate_limit(user_uuid, action_type, limit_count, time_window)`: Rate limiting
- `validate_api_key(api_key)`: API key validation

### Maintenance Functions
- `cleanup_expired_downloads()`: Remove expired download links
- `archive_old_admin_logs()`: Archive old audit logs
- `validate_system_integrity()`: Check database integrity
- `get_database_stats()`: Get database performance metrics

## Database Optimization

### Indexes

#### Primary Indexes
- User profiles: email, subscription_plan, created_at
- Orders: user_id, status, created_at, order_type
- Downloads: user_id, created_at, expires_at, is_active
- Payments: user_id, status, created_at, stripe_payment_intent_id

#### Composite Indexes
- Orders: (user_id, status, created_at)
- Downloads: (user_id, created_at)
- Payments: (user_id, status, created_at)

#### Partial Indexes
- Active orders: WHERE status IN ('pending', 'processing')
- Active downloads: WHERE is_active = true
- Successful payments: WHERE status = 'succeeded'

#### JSONB Indexes
- Orders metadata: GIN index for metadata queries
- Payments metadata: GIN index for payment data
- User profiles metadata: GIN index for user data
- Saved searches filters: GIN index for filter queries

#### Text Search Indexes
- User full names: trigram index for fuzzy search
- Saved search names: trigram index for search

### Performance Monitoring

#### Database Views
- `user_dashboard`: Aggregated user data for dashboard
- `admin_dashboard`: System-wide statistics for admin panel

#### Health Checks
- System health monitoring
- Database integrity validation
- Performance metrics collection

## Migration System

### Migration Files

1. **001_create_tables.sql**: Creates all database tables
2. **002_rls_policies.sql**: Implements Row Level Security
3. **003_database_optimization.sql**: Adds indexes and optimization
4. **004_seed_data.sql**: Inserts initial system data

### Migration Commands

```bash
# Run all pending migrations
npm run db:migrate

# List applied migrations
npm run db:list

# Check database health
npm run db:health

# Rollback a specific migration
npm run db:rollback <migration_name>
```

### Migration Features

- **Automatic Tracking**: Tracks applied migrations
- **Error Handling**: Rollback on failure
- **Health Checks**: Validates migration success
- **Backup Integration**: Automatic backups before migrations

## Backup System

### Backup Features

- **Complete Data Export**: All critical tables backed up
- **Metadata Tracking**: Backup timestamps and record counts
- **Incremental Backups**: Only changed data
- **Compression**: Efficient storage of backup data

### Backup Commands

```bash
# Create a new backup
npm run db:backup

# List available backups
npm run db:backup-list

# Restore from backup
npm run db:restore <backup_path>

# Clean up old backups
npm run db:backup-cleanup [days]
```

### Backup Structure

```
backups/
├── 2024-01-15T10-30-00-000Z/
│   ├── metadata.json
│   ├── user_profiles.json
│   ├── orders.json
│   ├── payments.json
│   ├── downloads.json
│   └── system_settings.json
```

## TypeScript Integration

### Database Types

The `src/types/database.ts` file provides complete TypeScript types for:
- All table structures (Row, Insert, Update)
- Database functions and their parameters
- Enums and composite types
- View definitions

### Database Service

The `src/lib/database.ts` file provides a comprehensive database service with:
- Type-safe database operations
- Error handling and validation
- Performance optimizations
- Security best practices

## Security Features

### Data Protection

1. **Row Level Security**: Comprehensive RLS policies
2. **API Key Security**: Hashed storage and validation
3. **Audit Logging**: Complete action tracking
4. **Rate Limiting**: Built-in rate limiting functions
5. **Data Validation**: Input validation and sanitization

### Access Control

1. **User Isolation**: Users can only access their own data
2. **Admin Permissions**: Role-based admin access
3. **Public Data**: Controlled public data access
4. **API Security**: Secure API key management

## Performance Features

### Optimization

1. **Strategic Indexing**: Optimized for common queries
2. **Query Optimization**: Efficient database functions
3. **Caching Strategy**: Built-in caching mechanisms
4. **Monitoring**: Performance metrics and health checks

### Scalability

1. **Horizontal Scaling**: Designed for Supabase scaling
2. **Connection Pooling**: Efficient connection management
3. **Query Optimization**: Optimized for large datasets
4. **Monitoring**: Performance tracking and optimization

## Usage Examples

### Basic Operations

```typescript
import { db } from '@/lib/database'

// Get user profile
const profile = await db.getUserProfile(userId)

// Create order
const order = await db.createOrder({
  user_id: userId,
  order_type: 'stock_download',
  total_cost: 500,
  credits_used: 5,
  items: [{ id: '123', type: 'image' }]
})

// Get user statistics
const stats = await db.getUserStats(userId)
```

### Advanced Operations

```typescript
// Check rate limits
const canProceed = await db.checkRateLimit(userId, 'api_calls', 100, '1 hour')

// Validate API key
const apiKeyData = await db.validateApiKey(apiKey)

// Get system statistics
const systemStats = await db.getSystemStats()

// Log admin action
await db.logAdminAction('user_updated', 'user', userId, { changes: updates })
```

## Monitoring and Maintenance

### Health Checks

- Database connectivity
- Table integrity
- Index performance
- Query optimization

### Maintenance Tasks

- Cleanup expired downloads
- Archive old admin logs
- Optimize database performance
- Monitor system health

## Best Practices

### Development

1. **Always use migrations** for schema changes
2. **Test migrations** in development environment
3. **Backup before migrations** in production
4. **Use TypeScript types** for type safety
5. **Follow RLS policies** for security

### Production

1. **Monitor database performance** regularly
2. **Backup data** frequently
3. **Optimize queries** based on usage patterns
4. **Review security policies** periodically
5. **Update indexes** as needed

## Troubleshooting

### Common Issues

1. **Migration Failures**: Check logs and rollback if needed
2. **RLS Policy Issues**: Verify user permissions
3. **Performance Issues**: Check indexes and query optimization
4. **Backup Failures**: Verify disk space and permissions

### Debugging

1. **Check database logs** for errors
2. **Validate RLS policies** with test queries
3. **Monitor performance metrics** for bottlenecks
4. **Test migrations** in development first

The database implementation provides a robust, secure, and scalable foundation for the Creo platform with comprehensive security, optimization, and maintenance features.
