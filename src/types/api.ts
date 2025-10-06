// API Response Types for nehtw API integration

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// User Credit Balance
export interface CreditBalance {
  userId: string;
  availableCredits: number;
  usedCredits: number;
  totalCredits: number;
  lastUpdated: string;
  creditExpiry?: string;
}

// Media Search
export interface MediaItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  previewUrl: string;
  source: string;
  type: 'image' | 'video' | 'audio' | 'vector';
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize: number;
  tags: string[];
  category: string;
  license: string;
  price: number;
  currency: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaSearchParams {
  query: string;
  page?: number;
  limit?: number;
  type?: 'image' | 'video' | 'audio' | 'vector' | 'all';
  category?: string;
  source?: string;
  minPrice?: number;
  maxPrice?: number;
  isPremium?: boolean;
  sortBy?: 'relevance' | 'newest' | 'oldest' | 'price_asc' | 'price_desc';
  tags?: string[];
}

export interface MediaSearchResponse {
  results: PaginatedResponse<MediaItem>;
  filters: {
    categories: string[];
    sources: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  searchTime: number;
}

// Order Creation
export interface OrderItem {
  mediaId: string;
  quantity: number;
  price: number;
  currency: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  paymentMethod: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  downloadLinks?: DownloadLink[];
}

export interface CreateOrderResponse {
  order: Order;
  paymentUrl?: string;
  requiresPayment: boolean;
}

// Download Links
export interface DownloadLink {
  id: string;
  mediaId: string;
  orderId: string;
  downloadUrl: string;
  expiresAt: string;
  maxDownloads: number;
  currentDownloads: number;
  fileSize: number;
  fileName: string;
  fileType: string;
  isActive: boolean;
  createdAt: string;
}

export interface DownloadLinksResponse {
  links: DownloadLink[];
  totalSize: number;
  expiresAt: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

// Authentication
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription?: {
    type: 'free' | 'professional' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled';
    expiresAt: string;
  };
  preferences: {
    language: string;
    currency: string;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
}

// API Configuration
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

// Hook Return Types
export interface UseQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => void;
  isRefetching: boolean;
}

export interface UseMutationResult<T, V> {
  mutate: (variables: V) => void;
  mutateAsync: (variables: V) => Promise<T>;
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  isSuccess: boolean;
  reset: () => void;
}
