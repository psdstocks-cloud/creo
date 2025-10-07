/**
 * Nehtw API TypeScript Interfaces
 * 
 * Comprehensive type definitions for all nehtw API responses
 * Based on nehtw API documentation and real-world usage patterns
 */

// ============================================================================
// Base Response Interfaces
// ============================================================================

export interface NehtwBaseResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface NehtwErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
  timestamp: string;
}

// ============================================================================
// Stock Information Interfaces
// ============================================================================

export interface StockInfo {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  preview_url?: string;
  type: 'image' | 'video' | 'audio' | 'vector' | 'document';
  category: string;
  subcategory?: string;
  tags: string[];
  keywords: string[];
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // for video/audio files
  format: string;
  resolution?: string;
  quality: 'standard' | 'high' | 'premium' | 'ultra';
  license_type: 'royalty_free' | 'rights_managed' | 'editorial' | 'creative_commons';
  usage_rights: {
    commercial: boolean;
    editorial: boolean;
    print: boolean;
    web: boolean;
    social_media: boolean;
    unlimited: boolean;
  };
  attribution_required: boolean;
  created_at: string;
  updated_at: string;
  site: {
    id: string;
    name: string;
    url: string;
    logo?: string;
  };
  contributor: {
    id: string;
    name: string;
    profile_url?: string;
    avatar?: string;
  };
  pricing: {
    credits: number;
    currency: string;
    price: number;
    discount?: number;
    bulk_discount?: {
      min_quantity: number;
      discount_percentage: number;
    };
  };
  statistics: {
    downloads: number;
    views: number;
    likes: number;
    rating: number;
  };
  metadata: {
    color_palette?: string[];
    dominant_colors?: string[];
    orientation?: 'landscape' | 'portrait' | 'square';
    aspect_ratio?: string;
    file_size_mb: number;
    dpi?: number;
    bitrate?: number; // for video/audio
    fps?: number; // for video
  };
}

export interface StockSearchParams {
  query: string;
  page?: number;
  limit?: number;
  type?: 'image' | 'video' | 'audio' | 'vector' | 'document' | 'all';
  category?: string;
  subcategory?: string;
  sort?: 'relevance' | 'newest' | 'oldest' | 'popular' | 'price_low' | 'price_high';
  price_range?: {
    min: number;
    max: number;
  };
  license_type?: 'royalty_free' | 'rights_managed' | 'editorial' | 'creative_commons';
  usage_rights?: {
    commercial?: boolean;
    editorial?: boolean;
    print?: boolean;
    web?: boolean;
    social_media?: boolean;
  };
  dimensions?: {
    min_width?: number;
    min_height?: number;
    max_width?: number;
    max_height?: number;
  };
  duration?: {
    min?: number;
    max?: number;
  };
  quality?: 'standard' | 'high' | 'premium' | 'ultra';
  color?: string;
  orientation?: 'landscape' | 'portrait' | 'square';
  tags?: string[];
  contributor_id?: string;
  site_id?: string;
}

export interface StockSearchResponse {
  results: StockInfo[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
  facets?: {
    categories: Array<{ name: string; count: number }>;
    types: Array<{ name: string; count: number }>;
    license_types: Array<{ name: string; count: number }>;
    price_ranges: Array<{ range: string; count: number }>;
    sites: Array<{ name: string; count: number }>;
  };
  search_metadata: {
    query: string;
    filters_applied: string[];
    search_time_ms: number;
    suggestions?: string[];
  };
}

// ============================================================================
// Order Management Interfaces
// ============================================================================

export interface OrderRequest {
  site_id: string;
  stock_id: string;
  user_id?: string;
  metadata?: {
    project_name?: string;
    client_name?: string;
    usage_type?: string;
    notes?: string;
    [key: string]: unknown;
  };
  download_options?: {
    format?: string;
    size?: string;
    quality?: string;
    watermark?: boolean;
  };
}

export interface OrderResponse {
  order_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  site_id: string;
  stock_id: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  failed_at?: string;
  error_message?: string;
  download_url?: string;
  expires_at?: string;
  metadata?: Record<string, unknown>;
  pricing: {
    credits_used: number;
    currency: string;
    price: number;
    discount_applied?: number;
  };
  stock_info?: StockInfo;
}

export interface OrderStatus {
  order_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress?: number; // 0-100
  estimated_completion?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  failed_at?: string;
}

// ============================================================================
// Download Interfaces
// ============================================================================

export interface DownloadLink {
  url: string;
  filename: string;
  size: number;
  format: string;
  expires_at: string;
  status: 'active' | 'expired' | 'used' | 'revoked';
  download_count: number;
  max_downloads?: number;
  metadata: {
    original_filename: string;
    mime_type: string;
    checksum?: string;
    compression?: string;
  };
  security: {
    requires_auth: boolean;
    ip_restricted: boolean;
    time_limited: boolean;
  };
}

export interface DownloadRequest {
  order_id: string;
  format?: string;
  size?: string;
  quality?: string;
}

// ============================================================================
// AI Generation Interfaces
// ============================================================================

export interface AIGenerationRequest {
  prompt: string;
  style?: 'photorealistic' | 'artistic' | 'cartoon' | 'sketch' | 'painting' | 'digital_art';
  size?: '512x512' | '1024x1024' | '2048x2048' | '4096x4096';
  count?: number; // 1-10
  quality?: 'standard' | 'high' | 'premium';
  aspect_ratio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  negative_prompt?: string;
  seed?: number;
  steps?: number;
  guidance_scale?: number;
  model?: string;
  metadata?: {
    project_name?: string;
    client_name?: string;
    usage_type?: string;
    [key: string]: unknown;
  };
}

export interface AIGenerationJob {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  prompt: string;
  style?: string;
  size?: string;
  count?: number;
  progress?: number; // 0-100
  estimated_time?: number; // seconds
  created_at: string;
  updated_at: string;
  completed_at?: string;
  failed_at?: string;
  error_message?: string;
  result?: AIGenerationResult;
  metadata?: Record<string, unknown>;
}

export interface AIGenerationResult {
  images: AIGeneratedImage[];
  generation_time: number;
  model_used: string;
  parameters: {
    style: string;
    size: string;
    steps: number;
    guidance_scale: number;
    seed: number;
  };
}

export interface AIGeneratedImage {
  id: string;
  url: string;
  thumbnail_url: string;
  filename: string;
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
  format: string;
  quality: string;
  metadata: {
    prompt: string;
    negative_prompt?: string;
    seed: number;
    model: string;
    generation_time: number;
  };
}

export interface AIGenerationResponse {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimated_time?: number;
  queue_position?: number;
  created_at: string;
}

// ============================================================================
// Account and Balance Interfaces
// ============================================================================

export interface AccountBalance {
  user_id: string;
  balance: number;
  currency: string;
  credits: number;
  credit_value: number; // value per credit
  last_updated: string;
  transactions: {
    total_spent: number;
    total_earned: number;
    last_transaction?: {
      id: string;
      type: 'purchase' | 'refund' | 'bonus' | 'adjustment';
      amount: number;
      description: string;
      date: string;
    };
  };
  limits: {
    daily_download_limit?: number;
    monthly_download_limit?: number;
    max_file_size?: number;
  };
  usage: {
    downloads_this_month: number;
    downloads_today: number;
    storage_used: number;
    bandwidth_used: number;
  };
}

export interface UserProfile {
  user_id: string;
  email: string;
  name?: string;
  avatar?: string;
  created_at: string;
  last_login?: string;
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'inactive' | 'suspended' | 'cancelled';
    expires_at?: string;
    features: string[];
  };
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  statistics: {
    total_downloads: number;
    total_orders: number;
    total_spent: number;
    member_since: string;
  };
}

// ============================================================================
// Stock Sites Interfaces
// ============================================================================

export interface StockSite {
  id: string;
  name: string;
  url: string;
  logo?: string;
  description?: string;
  supported_types: ('image' | 'video' | 'audio' | 'vector' | 'document')[];
  pricing_model: 'credit' | 'subscription' | 'pay_per_download';
  license_types: ('royalty_free' | 'rights_managed' | 'editorial' | 'creative_commons')[];
  quality_levels: ('standard' | 'high' | 'premium' | 'ultra')[];
  features: {
    ai_generation: boolean;
    background_removal: boolean;
    bulk_download: boolean;
    api_access: boolean;
    commercial_use: boolean;
    editorial_use: boolean;
  };
  pricing: {
    credit_cost: number;
    currency: string;
    bulk_discounts?: Array<{
      min_credits: number;
      discount_percentage: number;
    }>;
  };
  limits: {
    max_file_size: number;
    max_resolution: string;
    download_limit_per_day?: number;
  };
  status: 'active' | 'inactive' | 'maintenance';
  last_updated: string;
}

export interface StockSitesResponse {
  sites: StockSite[];
  total: number;
  categories: Array<{
    name: string;
    count: number;
    sites: string[];
  }>;
  features: Array<{
    name: string;
    description: string;
    sites_count: number;
  }>;
}

// ============================================================================
// API Error Interfaces
// ============================================================================

export interface NehtwAPIError {
  code: string;
  message: string;
  details?: unknown;
  status_code: number;
  timestamp: string;
  request_id?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface RateLimitError {
  limit: number;
  remaining: number;
  reset_time: string;
  retry_after?: number;
}

// ============================================================================
// Utility Types
// ============================================================================

export type OrderStatusType = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type AIGenerationStatusType = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type DownloadStatusType = 'active' | 'expired' | 'used' | 'revoked';
export type StockType = 'image' | 'video' | 'audio' | 'vector' | 'document';
export type LicenseType = 'royalty_free' | 'rights_managed' | 'editorial' | 'creative_commons';
export type QualityType = 'standard' | 'high' | 'premium' | 'ultra';
export type SortType = 'relevance' | 'newest' | 'oldest' | 'popular' | 'price_low' | 'price_high';

// ============================================================================
// Request/Response Wrapper Types
// ============================================================================

export type NehtwStockInfoResponse = NehtwBaseResponse<StockInfo>;
export type NehtwStockSearchResponse = NehtwBaseResponse<StockSearchResponse>;
export type NehtwOrderResponse = NehtwBaseResponse<OrderResponse>;
export type NehtwOrderStatusResponse = NehtwBaseResponse<OrderStatus>;
export type NehtwDownloadLinkResponse = NehtwBaseResponse<DownloadLink>;
export type NehtwAIGenerationResponse = NehtwBaseResponse<AIGenerationResponse>;
export type NehtwAIGenerationJobResponse = NehtwBaseResponse<AIGenerationJob>;
export type NehtwAccountBalanceResponse = NehtwBaseResponse<AccountBalance>;
export type NehtwUserProfileResponse = NehtwBaseResponse<UserProfile>;
export type NehtwStockSitesResponse = NehtwBaseResponse<StockSitesResponse>;

// ============================================================================
// Export all interfaces for easy importing
// ============================================================================

export {
  // Base types
  type NehtwBaseResponse,
  type NehtwErrorResponse,
  
  // Stock interfaces
  type StockInfo,
  type StockSearchParams,
  type StockSearchResponse,
  
  // Order interfaces
  type OrderRequest,
  type OrderResponse,
  type OrderStatus,
  
  // Download interfaces
  type DownloadLink,
  type DownloadRequest,
  
  // AI Generation interfaces
  type AIGenerationRequest,
  type AIGenerationJob,
  type AIGenerationResult,
  type AIGeneratedImage,
  type AIGenerationResponse,
  
  // Account interfaces
  type AccountBalance,
  type UserProfile,
  
  // Stock Sites interfaces
  type StockSite,
  type StockSitesResponse,
  
  // Error interfaces
  type NehtwAPIError,
  type ValidationError,
  type RateLimitError,
  
  // Utility types
  type OrderStatusType,
  type AIGenerationStatusType,
  type DownloadStatusType,
  type StockType,
  type LicenseType,
  type QualityType,
  type SortType,
  
  // Response wrapper types
  type NehtwStockInfoResponse,
  type NehtwStockSearchResponse,
  type NehtwOrderResponse,
  type NehtwOrderStatusResponse,
  type NehtwDownloadLinkResponse,
  type NehtwAIGenerationResponse,
  type NehtwAIGenerationJobResponse,
  type NehtwAccountBalanceResponse,
  type NehtwUserProfileResponse,
  type NehtwStockSitesResponse,
};
