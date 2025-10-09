/**
 * React Query Hooks for Stock Media Integration
 * 
 * Production-ready hooks for stock media operations including:
 * - Stock information retrieval
 * - Order creation and tracking
 * - Download link generation
 * - Status polling and error handling
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nehtwClient } from '../lib/nehtw-client';
import {
  StockInfo,
  OrderRequest,
  OrderResponse,
  OrderStatus,
  DownloadLink,
  AIGenerationRequest,
  AIGenerationResponse,
  AIGenerationJob,
  AccountBalance,
  UserProfile,
  StockSitesResponse,
} from '../types/nehtw';

// ============================================================================
// Query Keys
// ============================================================================

export const stockMediaKeys = {
  all: ['stockMedia'] as const,
  stockInfo: (site: string, id: string) => [...stockMediaKeys.all, 'stockInfo', site, id] as const,
  orderStatus: (taskId: string) => [...stockMediaKeys.all, 'orderStatus', taskId] as const,
  downloadLink: (taskId: string, responseType?: string) => [...stockMediaKeys.all, 'downloadLink', taskId, responseType] as const,
  aiJobStatus: (jobId: string) => [...stockMediaKeys.all, 'aiJobStatus', jobId] as const,
  accountBalance: () => [...stockMediaKeys.all, 'accountBalance'] as const,
  userProfile: () => [...stockMediaKeys.all, 'userProfile'] as const,
  stockSites: () => [...stockMediaKeys.all, 'stockSites'] as const,
};

// ============================================================================
// Stock Information Hook
// ============================================================================

export interface UseStockInfoOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: boolean | number;
  retryDelay?: number;
}

export interface UseStockInfoResult {
  data: StockInfo | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
}

/**
 * Hook to fetch stock media information
 * @param site - Stock site identifier (e.g., 'shutterstock', 'adobe')
 * @param id - Stock media ID
 * @param url - Optional URL for direct access
 * @param options - Query options
 */
export function useStockInfo(
  site: string,
  id: string,
  url?: string,
  options: UseStockInfoOptions = {}
): UseStockInfoResult {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = false,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: stockMediaKeys.stockInfo(site, id),
    queryFn: async (): Promise<StockInfo> => {
      if (url) {
        // If URL is provided, we might need to parse it or use it directly
        // This would depend on the actual API implementation
        throw new Error('Direct URL access not implemented yet');
      }
      
      // Use getStockInfo to get the specific item details
      return await nehtwClient.getStockInfo(site, id, url);
    },
    enabled: enabled && Boolean(site && id),
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    retry,
    retryDelay,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
  };
}

// ============================================================================
// Order Creation Hook
// ============================================================================

export interface UseCreateOrderOptions {
  onSuccess?: (data: OrderResponse) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: OrderResponse | undefined, error: Error | null) => void;
  retry?: boolean | number;
  retryDelay?: number;
}

export interface UseCreateOrderResult {
  mutate: (orderData: OrderRequest) => void;
  mutateAsync: (orderData: OrderRequest) => Promise<OrderResponse>;
  data: OrderResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
  reset: () => void;
}

/**
 * Hook to create stock media orders
 * @param options - Mutation options
 */
export function useCreateOrder(
  options: UseCreateOrderOptions = {}
): UseCreateOrderResult {
  const queryClient = useQueryClient();
  const {
    onSuccess,
    onError,
    onSettled,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const mutation = useMutation({
    mutationFn: async (orderData: OrderRequest): Promise<OrderResponse> => {
      const taskId = await nehtwClient.createOrder(orderData.site_id, orderData.stock_id);
      return {
        order_id: taskId,
        status: 'pending' as const,
        site_id: orderData.site_id,
        stock_id: orderData.stock_id,
        user_id: orderData.user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        pricing: {
          credits_used: 10, // Default credits
          currency: 'USD',
          price: 1.0,
        },
      };
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: stockMediaKeys.accountBalance() });
      queryClient.invalidateQueries({ queryKey: stockMediaKeys.userProfile() });
      
      // Set the order status query data for immediate access
      queryClient.setQueryData(
        stockMediaKeys.orderStatus(data.order_id),
        { order_id: data.order_id, status: data.status } as OrderStatus
      );
      
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error('Order creation failed:', error);
      onError?.(error);
    },
    onSettled: (data, error) => {
      onSettled?.(data, error as Error | null);
    },
    retry,
    retryDelay,
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}

// ============================================================================
// Order Status Hook
// ============================================================================

export interface UseOrderStatusOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
  staleTime?: number;
  gcTime?: number;
  retry?: boolean | number;
  retryDelay?: number;
}

export interface UseOrderStatusResult {
  data: OrderStatus | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
  isPolling: boolean;
}

/**
 * Hook to track order status with automatic polling
 * @param taskId - Order task ID
 * @param options - Query options
 */
export function useOrderStatus(
  taskId: string,
  options: UseOrderStatusOptions = {}
): UseOrderStatusResult {
  const {
    enabled = true,
    refetchInterval = 2000, // 2 seconds
    staleTime = 0, // Always fresh for status
    gcTime = 5 * 60 * 1000, // 5 minutes
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: stockMediaKeys.orderStatus(taskId),
    queryFn: async (): Promise<OrderStatus> => {
      return await nehtwClient.getOrderStatus(taskId);
    },
    enabled: enabled && Boolean(taskId),
    refetchInterval: (query) => {
      // Stop polling when order is completed or failed
      if (query.state.data?.status === 'completed' || query.state.data?.status === 'failed' || query.state.data?.status === 'cancelled') {
        return false;
      }
      return refetchInterval;
    },
    staleTime,
    gcTime,
    retry,
    retryDelay,
  });

  const isPolling = query.isFetching && query.data?.status !== 'completed' && query.data?.status !== 'failed' && query.data?.status !== 'cancelled';

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    isPolling,
  };
}

// ============================================================================
// Download Link Hook
// ============================================================================

export interface UseDownloadLinkOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  retry?: boolean | number;
  retryDelay?: number;
}

export interface UseDownloadLinkResult {
  data: DownloadLink | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
}

/**
 * Hook to get download links for completed orders
 * @param taskId - Order task ID
 * @param responseType - Download response type ('any' | 'gdrive' | 'asia')
 * @param options - Query options
 */
export function useDownloadLink(
  taskId: string,
  responseType: 'any' | 'gdrive' | 'asia' = 'any',
  options: UseDownloadLinkOptions = {}
): UseDownloadLinkResult {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: stockMediaKeys.downloadLink(taskId, responseType),
    queryFn: async (): Promise<DownloadLink> => {
      return await nehtwClient.getDownloadLink(taskId);
    },
    enabled: enabled && Boolean(taskId),
    staleTime,
    gcTime,
    retry,
    retryDelay,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
  };
}

// ============================================================================
// AI Generation Hooks
// ============================================================================

export interface UseAIGenerationOptions {
  onSuccess?: (data: AIGenerationResponse) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: AIGenerationResponse | undefined, error: Error | null) => void;
  retry?: boolean | number;
  retryDelay?: number;
}

export interface UseAIGenerationResult {
  mutate: (request: AIGenerationRequest) => void;
  mutateAsync: (request: AIGenerationRequest) => Promise<AIGenerationResponse>;
  data: AIGenerationResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
  reset: () => void;
}

/**
 * Hook to create AI generation jobs
 * @param options - Mutation options
 */
export function useAIGeneration(
  options: UseAIGenerationOptions = {}
): UseAIGenerationResult {
  const queryClient = useQueryClient();
  const {
    onSuccess,
    onError,
    onSettled,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const mutation = useMutation({
    mutationFn: async (request: AIGenerationRequest): Promise<AIGenerationResponse> => {
      const jobId = await nehtwClient.createAIJob(request.prompt);
      return {
        job_id: jobId,
        status: 'pending' as const,
        created_at: new Date().toISOString(),
      };
    },
    onSuccess: (data) => {
      // Invalidate account balance
      queryClient.invalidateQueries({ queryKey: stockMediaKeys.accountBalance() });
      
      // Set the AI job status query data for immediate access
      queryClient.setQueryData(
        stockMediaKeys.aiJobStatus(data.job_id),
        { job_id: data.job_id, status: data.status } as AIGenerationJob
      );
      
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error('AI generation failed:', error);
      onError?.(error);
    },
    onSettled: (data, error) => {
      onSettled?.(data, error as Error | null);
    },
    retry,
    retryDelay,
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}

// ============================================================================
// AI Job Status Hook
// ============================================================================

export interface UseAIJobStatusOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
  staleTime?: number;
  gcTime?: number;
  retry?: boolean | number;
  retryDelay?: number;
}

export interface UseAIJobStatusResult {
  data: AIGenerationJob | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
  isPolling: boolean;
}

/**
 * Hook to track AI generation job status with automatic polling
 * @param jobId - AI generation job ID
 * @param options - Query options
 */
export function useAIJobStatus(
  jobId: string,
  options: UseAIJobStatusOptions = {}
): UseAIJobStatusResult {
  const {
    enabled = true,
    refetchInterval = 5000, // 5 seconds (AI jobs take longer)
    staleTime = 0, // Always fresh for status
    gcTime = 10 * 60 * 1000, // 10 minutes
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: stockMediaKeys.aiJobStatus(jobId),
    queryFn: async (): Promise<AIGenerationJob> => {
      return await nehtwClient.getAIResult(jobId);
    },
    enabled: enabled && Boolean(jobId),
    refetchInterval: (query) => {
      // Stop polling when job is completed or failed
      if (query.state.data?.status === 'completed' || query.state.data?.status === 'failed' || query.state.data?.status === 'cancelled') {
        return false;
      }
      return refetchInterval;
    },
    staleTime,
    gcTime,
    retry,
    retryDelay,
  });

  const isPolling = query.isFetching && query.data?.status !== 'completed' && query.data?.status !== 'failed' && query.data?.status !== 'cancelled';

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    isPolling,
  };
}

// ============================================================================
// Account and User Hooks
// ============================================================================

export interface UseAccountBalanceOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: boolean | number;
  retryDelay?: number;
}

export interface UseAccountBalanceResult {
  data: AccountBalance | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
}

/**
 * Hook to fetch account balance and credits
 * @param options - Query options
 */
export function useAccountBalance(
  options: UseAccountBalanceOptions = {}
): UseAccountBalanceResult {
  const {
    enabled = true,
    staleTime = 2 * 60 * 1000, // 2 minutes
    gcTime = 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus = true,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: stockMediaKeys.accountBalance(),
    queryFn: async (): Promise<AccountBalance> => {
      return await nehtwClient.getBalance();
    },
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    retry,
    retryDelay,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
  };
}

export interface UseUserProfileOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: boolean | number;
  retryDelay?: number;
}

export interface UseUserProfileResult {
  data: UserProfile | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
}

/**
 * Hook to fetch user profile information
 * @param options - Query options
 */
export function useUserProfile(
  options: UseUserProfileOptions = {}
): UseUserProfileResult {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = false,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: stockMediaKeys.userProfile(),
    queryFn: async (): Promise<UserProfile> => {
      // Mock user profile for now
      return {
        user_id: 'user_123',
        email: 'demo@example.com',
        name: 'Demo User',
        avatar: '',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        preferences: {
          language: 'en',
          timezone: 'UTC',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
        },
        subscription: {
          plan: 'free',
          status: 'active',
          expires_at: undefined,
          features: ['basic_search', 'limited_downloads'],
        },
        statistics: {
          total_downloads: 0,
          total_orders: 0,
          total_spent: 0,
          member_since: new Date().toISOString(),
        },
      };
    },
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    retry,
    retryDelay,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
  };
}

export interface UseStockSitesOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: boolean | number;
  retryDelay?: number;
}

export interface UseStockSitesResult {
  data: StockSitesResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
}

/**
 * Hook to fetch available stock sites
 * @param options - Query options
 */
export function useStockSites(
  options: UseStockSitesOptions = {}
): UseStockSitesResult {
  const {
    enabled = true,
    staleTime = 10 * 60 * 1000, // 10 minutes
    gcTime = 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus = false,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: stockMediaKeys.stockSites(),
    queryFn: async (): Promise<StockSitesResponse> => {
      // Mock stock sites for now
      return {
        sites: [
          { 
            id: 'shutterstock', 
            name: 'Shutterstock', 
            url: 'https://shutterstock.com',
            supported_types: ['image', 'video', 'audio'],
            pricing_model: 'credit',
            license_types: ['royalty_free', 'rights_managed'],
            quality_levels: ['standard', 'high', 'premium'],
            features: {
              ai_generation: false,
              background_removal: true,
              bulk_download: true,
              api_access: true,
              commercial_use: true,
              editorial_use: true,
            },
            pricing: {
              credit_cost: 10,
              currency: 'USD',
            },
            limits: {
              max_file_size: 100 * 1024 * 1024, // 100MB
              max_resolution: '8K',
              download_limit_per_day: 1000,
            },
            status: 'active',
            last_updated: new Date().toISOString(),
          },
          { 
            id: 'getty', 
            name: 'Getty Images', 
            url: 'https://gettyimages.com',
            supported_types: ['image', 'video'],
            pricing_model: 'credit',
            license_types: ['royalty_free', 'rights_managed', 'editorial'],
            quality_levels: ['standard', 'high', 'premium'],
            features: {
              ai_generation: false,
              background_removal: true,
              bulk_download: true,
              api_access: true,
              commercial_use: true,
              editorial_use: true,
            },
            pricing: {
              credit_cost: 15,
              currency: 'USD',
            },
            limits: {
              max_file_size: 200 * 1024 * 1024, // 200MB
              max_resolution: '8K',
              download_limit_per_day: 500,
            },
            status: 'active',
            last_updated: new Date().toISOString(),
          },
          { 
            id: 'unsplash', 
            name: 'Unsplash', 
            url: 'https://unsplash.com',
            supported_types: ['image'],
            pricing_model: 'subscription',
            license_types: ['creative_commons'],
            quality_levels: ['high'],
            features: {
              ai_generation: false,
              background_removal: true,
              bulk_download: true,
              api_access: true,
              commercial_use: true,
              editorial_use: true,
            },
            pricing: {
              credit_cost: 0,
              currency: 'USD',
            },
            limits: {
              max_file_size: 50 * 1024 * 1024, // 50MB
              max_resolution: '4K',
              download_limit_per_day: 10000,
            },
            status: 'active',
            last_updated: new Date().toISOString(),
          },
          { 
            id: 'pexels', 
            name: 'Pexels', 
            url: 'https://pexels.com',
            supported_types: ['image', 'video'],
            pricing_model: 'subscription',
            license_types: ['creative_commons'],
            quality_levels: ['high'],
            features: {
              ai_generation: false,
              background_removal: true,
              bulk_download: true,
              api_access: true,
              commercial_use: true,
              editorial_use: true,
            },
            pricing: {
              credit_cost: 0,
              currency: 'USD',
            },
            limits: {
              max_file_size: 50 * 1024 * 1024, // 50MB
              max_resolution: '4K',
              download_limit_per_day: 10000,
            },
            status: 'active',
            last_updated: new Date().toISOString(),
          },
        ],
        total: 4,
        categories: [],
        features: [],
      };
    },
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    retry,
    retryDelay,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
  };
}

// ============================================================================
// All hooks and types are already exported individually above
// ============================================================================
