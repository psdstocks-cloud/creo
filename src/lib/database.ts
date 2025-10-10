import { createClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

export type Tables = Database['public']['Tables']
export type Enums = Database['public']['Enums']

// Database utility functions
export class DatabaseService {
  private supabase = createClient()

  // User Profile Operations
  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }

  async updateUserProfile(userId: string, updates: Partial<Tables['user_profiles']['Update']>) {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUserCredits(userId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data?.credits || 0
  }

  async addCredits(userId: string, amount: number) {
    const { data, error } = await this.supabase
      .rpc('add_credits', {
        user_uuid: userId,
        amount
      })

    if (error) throw error
    return data
  }

  async deductCredits(userId: string, amount: number): Promise<boolean> {
    const { data, error } = await this.supabase
      .rpc('deduct_credits', {
        user_uuid: userId,
        amount
      })

    if (error) throw error
    return data || false
  }

  // Order Operations
  async createOrder(orderData: Tables['orders']['Insert']) {
    const { data, error } = await this.supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getOrders(userId: string, filters?: {
    status?: string
    orderType?: string
    limit?: number
    offset?: number
  }) {
    let query = this.supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.orderType) {
      query = query.eq('order_type', filters.orderType)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  async updateOrderStatus(orderId: string, status: string, errorMessage?: string) {
    const updates: Tables['orders']['Update'] = {
      status: status as any,
      updated_at: new Date().toISOString()
    }

    if (status === 'completed') {
      updates.completed_at = new Date().toISOString()
    }

    if (errorMessage) {
      updates.error_message = errorMessage
    }

    const { data, error } = await this.supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Download Operations
  async createDownload(downloadData: Tables['downloads']['Insert']) {
    const { data, error } = await this.supabase
      .from('downloads')
      .insert(downloadData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getDownloads(userId: string, filters?: {
    isActive?: boolean
    limit?: number
    offset?: number
  }) {
    let query = this.supabase
      .from('downloads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  async updateDownloadCount(downloadId: string) {
    const { data, error } = await this.supabase
      .from('downloads')
      .update({
        download_count: this.supabase.raw('download_count + 1'),
        last_downloaded_at: new Date().toISOString()
      })
      .eq('id', downloadId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Payment Operations
  async createPayment(paymentData: Tables['payments']['Insert']) {
    const { data, error } = await this.supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updatePaymentStatus(paymentId: string, status: string, refundAmount?: number) {
    const updates: Tables['payments']['Update'] = {
      status: status as any,
      updated_at: new Date().toISOString()
    }

    if (status === 'succeeded') {
      updates.succeeded_at = new Date().toISOString()
    }

    if (status === 'refunded' && refundAmount) {
      updates.refund_amount = refundAmount
      updates.refunded_at = new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('payments')
      .update(updates)
      .eq('id', paymentId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getPayments(userId: string, filters?: {
    status?: string
    limit?: number
    offset?: number
  }) {
    let query = this.supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  // API Key Operations
  async createApiKey(apiKeyData: Tables['api_keys']['Insert']) {
    const { data, error } = await this.supabase
      .from('api_keys')
      .insert(apiKeyData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getApiKeys(userId: string) {
    const { data, error } = await this.supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async deactivateApiKey(apiKeyId: string) {
    const { data, error } = await this.supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', apiKeyId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async validateApiKey(apiKey: string) {
    const { data, error } = await this.supabase
      .rpc('validate_api_key', { api_key: apiKey })

    if (error) throw error
    return data?.[0] || null
  }

  // User Preferences Operations
  async getUserPreferences(userId: string) {
    const { data, error } = await this.supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  }

  async updateUserPreferences(userId: string, updates: Tables['user_preferences']['Update']) {
    const { data, error } = await this.supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Saved Searches Operations
  async createSavedSearch(searchData: Tables['saved_searches']['Insert']) {
    const { data, error } = await this.supabase
      .from('saved_searches')
      .insert(searchData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getSavedSearches(userId: string, includePublic = false) {
    let query = this.supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (includePublic) {
      query = query.or(`user_id.eq.${userId},is_public.eq.true`)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  async deleteSavedSearch(searchId: string) {
    const { error } = await this.supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId)

    if (error) throw error
    return true
  }

  // System Settings Operations
  async getSystemSettings(publicOnly = false) {
    let query = this.supabase
      .from('system_settings')
      .select('*')
      .order('key')

    if (publicOnly) {
      query = query.eq('is_public', true)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  async updateSystemSetting(key: string, value: any) {
    const { data, error } = await this.supabase
      .from('system_settings')
      .update({ value })
      .eq('key', key)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Statistics and Analytics
  async getUserStats(userId: string) {
    const { data, error } = await this.supabase
      .rpc('get_user_stats', { user_uuid: userId })

    if (error) throw error
    return data?.[0] || null
  }

  async getSystemStats() {
    const { data, error } = await this.supabase
      .rpc('get_system_stats')

    if (error) throw error
    return data?.[0] || null
  }

  async getUserActivitySummary(userId: string, daysBack = 30) {
    const { data, error } = await this.supabase
      .rpc('get_user_activity_summary', {
        user_uuid: userId,
        days_back: daysBack
      })

    if (error) throw error
    return data?.[0] || null
  }

  // Admin Operations
  async logAdminAction(action: string, targetType: string, targetId?: string, details?: any) {
    const { data, error } = await this.supabase
      .rpc('log_admin_action', {
        action_name: action,
        target_type: targetType,
        target_id: targetId,
        details: details || {}
      })

    if (error) throw error
    return data
  }

  async getAdminLogs(filters?: {
    limit?: number
    offset?: number
    targetType?: string
  }) {
    let query = this.supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.targetType) {
      query = query.eq('target_type', filters.targetType)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  // Database Maintenance
  async cleanupExpiredDownloads() {
    const { data, error } = await this.supabase
      .rpc('cleanup_expired_downloads')

    if (error) throw error
    return data
  }

  async validateSystemIntegrity() {
    const { data, error } = await this.supabase
      .rpc('validate_system_integrity')

    if (error) throw error
    return data
  }

  async getDatabaseStats() {
    const { data, error } = await this.supabase
      .rpc('get_database_stats')

    if (error) throw error
    return data?.[0] || null
  }

  // Rate Limiting
  async checkRateLimit(userId: string, actionType: string, limitCount = 100, timeWindow = '1 hour') {
    const { data, error } = await this.supabase
      .rpc('check_rate_limit', {
        user_uuid: userId,
        action_type: actionType,
        limit_count: limitCount,
        time_window: timeWindow
      })

    if (error) throw error
    return data || false
  }
}

// Export singleton instance
export const db = new DatabaseService()
