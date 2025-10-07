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
  cacheTime?: number;
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
    cacheTime = 10 * 60 * 1000, // 10 minutes
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
      
      // For now, we'll use the search functionality to find the specific item
      // In a real implementation, you'd have a dedicated endpoint
      const searchResults = await nehtwClient.search({
        query: id,
        type: 'all',
        limit: 1,
      });
      
      if (searchResults.results.length === 0) {
        throw new Error(`Stock item not found: ${id}`);
      }
      
      return searchResults.results[0];
    },
    enabled: enabled && Boolean(site && id),
    staleTime,
    cacheTime,
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
      return await nehtwClient.createOrder(orderData);
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
  cacheTime?: number;
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
    cacheTime = 5 * 60 * 1000, // 5 minutes
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: stockMediaKeys.orderStatus(taskId),
    queryFn: async (): Promise<OrderStatus> => {
      return await nehtwClient.getOrderStatus(taskId);
    },
    enabled: enabled && Boolean(taskId),
    refetchInterval: (data) => {
      // Stop polling when order is completed or failed
      if (data?.status === 'completed' || data?.status === 'failed' || data?.status === 'cancelled') {
        return false;
      }
      return refetchInterval;
    },
    staleTime,
    cacheTime,
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
  cacheTime?: number;
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
    cacheTime = 10 * 60 * 1000, // 10 minutes
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
    cacheTime,
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
      return await nehtwClient.generateAI(request);
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
  cacheTime?: number;
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
    cacheTime = 10 * 60 * 1000, // 10 minutes
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: stockMediaKeys.aiJobStatus(jobId),
    queryFn: async (): Promise<AIGenerationJob> => {
      return await nehtwClient.getAIJobStatus(jobId);
    },
    enabled: enabled && Boolean(jobId),
    refetchInterval: (data) => {
      // Stop polling when job is completed or failed
      if (data?.status === 'completed' || data?.status === 'failed' || data?.status === 'cancelled') {
        return false;
      }
      return refetchInterval;
    },
    staleTime,
    cacheTime,
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
  cacheTime?: number;
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
    cacheTime = 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus = true,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: stockMediaKeys.accountBalance(),
    queryFn: async (): Promise<AccountBalance> => {
      return await nehtwClient.getCredits();
    },
    enabled,
    staleTime,
    cacheTime,
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
  cacheTime?: number;
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
    cacheTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = false,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: stockMediaKeys.userProfile(),
    queryFn: async (): Promise<UserProfile> => {
      return await nehtwClient.getUserProfile();
    },
    enabled,
    staleTime,
    cacheTime,
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
  cacheTime?: number;
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
    cacheTime = 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus = false,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: stockMediaKeys.stockSites(),
    queryFn: async (): Promise<StockSitesResponse> => {
      return await nehtwClient.getStockSites();
    },
    enabled,
    staleTime,
    cacheTime,
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
// Export all hooks and types
// ============================================================================

export {
  // Query keys
  stockMediaKeys,
  
  // Stock media hooks
  useStockInfo,
  useCreateOrder,
  useOrderStatus,
  useDownloadLink,
  
  // AI generation hooks
  useAIGeneration,
  useAIJobStatus,
  
  // Account hooks
  useAccountBalance,
  useUserProfile,
  useStockSites,
  
  // Types
  type UseStockInfoOptions,
  type UseStockInfoResult,
  type UseCreateOrderOptions,
  type UseCreateOrderResult,
  type UseOrderStatusOptions,
  type UseOrderStatusResult,
  type UseDownloadLinkOptions,
  type UseDownloadLinkResult,
  type UseAIGenerationOptions,
  type UseAIGenerationResult,
  type UseAIJobStatusOptions,
  type UseAIJobStatusResult,
  type UseAccountBalanceOptions,
  type UseAccountBalanceResult,
  type UseUserProfileOptions,
  type UseUserProfileResult,
  type UseStockSitesOptions,
  type UseStockSitesResult,
};
