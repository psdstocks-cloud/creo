export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          credits: number
          subscription_plan: 'free' | 'pro' | 'enterprise'
          subscription_status: 'active' | 'cancelled' | 'past_due'
          subscription_end_date: string | null
          created_at: string
          updated_at: string
          last_login_at: string | null
          is_active: boolean
          metadata: Json
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          credits?: number
          subscription_plan?: 'free' | 'pro' | 'enterprise'
          subscription_status?: 'active' | 'cancelled' | 'past_due'
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          metadata?: Json
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          credits?: number
          subscription_plan?: 'free' | 'pro' | 'enterprise'
          subscription_status?: 'active' | 'cancelled' | 'past_due'
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          metadata?: Json
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_type: 'stock_download' | 'ai_generation'
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          total_cost: number
          credits_used: number
          items: Json
          metadata: Json
          error_message: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          order_type: 'stock_download' | 'ai_generation'
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          total_cost?: number
          credits_used?: number
          items?: Json
          metadata?: Json
          error_message?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          order_type?: 'stock_download' | 'ai_generation'
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          total_cost?: number
          credits_used?: number
          items?: Json
          metadata?: Json
          error_message?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      downloads: {
        Row: {
          id: string
          user_id: string
          order_id: string | null
          file_name: string
          file_url: string
          file_size: number | null
          file_type: 'image' | 'video' | 'audio' | 'document'
          mime_type: string | null
          download_count: number
          expires_at: string | null
          is_active: boolean
          created_at: string
          last_downloaded_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          order_id?: string | null
          file_name: string
          file_url: string
          file_size?: number | null
          file_type: 'image' | 'video' | 'audio' | 'document'
          mime_type?: string | null
          download_count?: number
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
          last_downloaded_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          order_id?: string | null
          file_name?: string
          file_url?: string
          file_size?: number | null
          file_type?: 'image' | 'video' | 'audio' | 'document'
          mime_type?: string | null
          download_count?: number
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
          last_downloaded_at?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          order_id: string | null
          stripe_payment_intent_id: string | null
          stripe_customer_id: string | null
          amount: number
          currency: string
          status: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'
          payment_method: string | null
          refund_amount: number
          refund_reason: string | null
          metadata: Json
          created_at: string
          updated_at: string
          succeeded_at: string | null
          refunded_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          order_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_customer_id?: string | null
          amount: number
          currency?: string
          status?: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'
          payment_method?: string | null
          refund_amount?: number
          refund_reason?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          succeeded_at?: string | null
          refunded_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          order_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_customer_id?: string | null
          amount?: number
          currency?: string
          status?: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'
          payment_method?: string | null
          refund_amount?: number
          refund_reason?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          succeeded_at?: string | null
          refunded_at?: string | null
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          name: string
          key_hash: string
          key_prefix: string
          scopes: string[]
          last_used_at: string | null
          usage_count: number
          is_active: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          key_hash: string
          key_prefix: string
          scopes?: string[]
          last_used_at?: string | null
          usage_count?: number
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          key_hash?: string
          key_prefix?: string
          scopes?: string[]
          last_used_at?: string | null
          usage_count?: number
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          language: string
          timezone: string
          theme: 'light' | 'dark' | 'auto'
          email_notifications: boolean
          push_notifications: boolean
          marketing_emails: boolean
          notification_frequency: 'immediate' | 'daily' | 'weekly' | 'never'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language?: string
          timezone?: string
          theme?: 'light' | 'dark' | 'auto'
          email_notifications?: boolean
          push_notifications?: boolean
          marketing_emails?: boolean
          notification_frequency?: 'immediate' | 'daily' | 'weekly' | 'never'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: string
          timezone?: string
          theme?: 'light' | 'dark' | 'auto'
          email_notifications?: boolean
          push_notifications?: boolean
          marketing_emails?: boolean
          notification_frequency?: 'immediate' | 'daily' | 'weekly' | 'never'
          created_at?: string
          updated_at?: string
        }
      }
      saved_searches: {
        Row: {
          id: string
          user_id: string
          name: string
          search_query: string
          filters: Json
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          search_query: string
          filters?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          search_query?: string
          filters?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      admin_logs: {
        Row: {
          id: string
          admin_user_id: string | null
          action: string
          target_type: string
          target_id: string | null
          details: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id?: string | null
          action: string
          target_type: string
          target_id?: string | null
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string | null
          action?: string
          target_type?: string
          target_id?: string | null
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      system_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      user_dashboard: {
        Row: {
          id: string
          email: string
          full_name: string | null
          credits: number
          subscription_plan: 'free' | 'pro' | 'enterprise'
          created_at: string
          last_login_at: string | null
          total_orders: number
          pending_orders: number
          total_downloads: number
          total_spent: number
        }
      }
      admin_dashboard: {
        Row: {
          total_users: number
          active_users: number
          total_orders: number
          pending_orders: number
          total_downloads: number
          total_revenue: number
        }
      }
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      owns_resource: {
        Args: {
          user_id: string
          resource_user_id: string
        }
        Returns: boolean
      }
      get_user_credits: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
      deduct_credits: {
        Args: {
          user_uuid: string
          amount: number
        }
        Returns: boolean
      }
      add_credits: {
        Args: {
          user_uuid: string
          amount: number
        }
        Returns: void
      }
      get_user_stats: {
        Args: {
          user_uuid: string
        }
        Returns: {
          total_orders: number
          total_downloads: number
          total_payments: number
          total_spent: number
          credits_remaining: number
          last_order_date: string | null
          last_download_date: string | null
        }[]
      }
      get_system_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_users: number
          active_users: number
          total_orders: number
          pending_orders: number
          total_revenue: number
          total_downloads: number
        }[]
      }
      validate_api_key: {
        Args: {
          api_key: string
        }
        Returns: {
          user_id: string
          scopes: string[]
          is_valid: boolean
        }[]
      }
      cleanup_expired_downloads: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      archive_old_admin_logs: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      log_admin_action: {
        Args: {
          action_name: string
          target_type: string
          target_id?: string
          details?: Json
        }
        Returns: string
      }
      get_user_activity_summary: {
        Args: {
          user_uuid: string
          days_back?: number
        }
        Returns: {
          orders_count: number
          downloads_count: number
          payments_count: number
          total_spent: number
          credits_used: number
        }[]
      }
      get_popular_searches: {
        Args: {
          limit_count?: number
        }
        Returns: {
          search_query: string
          usage_count: number
          is_public: boolean
        }[]
      }
      check_rate_limit: {
        Args: {
          user_uuid: string
          action_type: string
          limit_count?: number
          time_window?: string
        }
        Returns: boolean
      }
      get_database_size: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          row_count: number
          size_bytes: number
          size_mb: number
        }[]
      }
      get_database_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_tables: number
          total_indexes: number
          database_size_mb: number
          last_vacuum: string | null
          active_connections: number
        }[]
      }
      get_system_health: {
        Args: Record<PropertyKey, never>
        Returns: {
          status: string
          message: string
          timestamp: string
        }[]
      }
      validate_system_integrity: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_name: string
          status: string
          message: string
        }[]
      }
    }
    Enums: {
      subscription_plan: 'free' | 'pro' | 'enterprise'
      subscription_status: 'active' | 'cancelled' | 'past_due'
      order_type: 'stock_download' | 'ai_generation'
      order_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
      payment_status: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'
      file_type: 'image' | 'video' | 'audio' | 'document'
      theme: 'light' | 'dark' | 'auto'
      notification_frequency: 'immediate' | 'daily' | 'weekly' | 'never'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
