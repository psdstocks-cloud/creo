/**
 * Optimized React Query Configuration
 * 
 * Performance-optimized React Query setup with proper caching,
 * background refetching, and request deduplication.
 */

import { QueryClient, isServer } from '@tanstack/react-query';
import { 
  DEFAULT_CACHE_CONFIG, 
  CRITICAL_CACHE_CONFIG
  // BACKGROUND_CACHE_CONFIG 
} from '../utils/performance-simple';

// ============================================================================
// Query Client Configuration
// ============================================================================

function makeQueryClient() {
  return new QueryClient({
  defaultOptions: {
    queries: {
      // Optimized for NEHTW API with 2s rate limiting
      staleTime: 5 * 60 * 1000, // 5 minutes for stock data
      gcTime: 10 * 60 * 1000, // 10 minutes cache time
      
      // Network mode for better UX
      networkMode: 'online',
      
      // Enhanced retry configuration for NEHTW API
      retry: (failureCount, error) => {
        // Don't retry on rate limits or auth errors
        if (error && typeof error === 'object' && 'message' in error) {
          const message = (error as { message: string }).message;
          if (message.includes('429') || message.includes('401') || message.includes('Rate limit')) {
            return false;
          }
        }
        
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      
      // Retry delay with exponential backoff (respects 2s rate limit)
      retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 30000),
      
      // Background refetch configuration
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      
      // Structural sharing for better performance
      structuralSharing: true,
      
      // Notify on change
      notifyOnChangeProps: ['data', 'error', 'isLoading', 'isFetching']
    },
    
    mutations: {
      // Enhanced mutation configuration for NEHTW API
      retry: 1,
      retryDelay: 2000, // Respect rate limiting (2s minimum)
      
      // Network mode
      networkMode: 'online'
    }
  }
  });
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

// Legacy export for backward compatibility
export const queryClient = makeQueryClient();

// ============================================================================
// Query Key Factories
// ============================================================================

export const queryKeys = {
  // Hierarchical query keys for efficient invalidation
  all: ['nehtw'] as const,
  
  // Stock Media Keys
  stockSites: () => [...queryKeys.all, 'stock-sites'] as const,
  stockInfo: (site: string, id: string, url?: string) => 
    [...queryKeys.all, 'stock-info', { site, id, url }] as const,
  
  // Orders Keys
  orders: () => [...queryKeys.all, 'orders'] as const,
  order: (taskId: string) => [...queryKeys.all, 'orders', taskId] as const,
  orderStatus: (taskId: string) => [...queryKeys.all, 'orders', taskId, 'status'] as const,
  downloadLink: (taskId: string) => [...queryKeys.all, 'orders', taskId, 'download'] as const,
  
  // AI Generation Keys
  aiJobs: () => [...queryKeys.all, 'ai-jobs'] as const,
  aiJob: (jobId: string) => [...queryKeys.all, 'ai-jobs', jobId] as const,
  aiResult: (jobId: string) => [...queryKeys.all, 'ai-jobs', jobId, 'result'] as const,
  
  // User Account Keys
  user: () => [...queryKeys.all, 'user'] as const,
  userBalance: () => [...queryKeys.all, 'user', 'balance'] as const,
  
  // Legacy keys for backward compatibility
  stockMedia: {
    all: ['stockMedia'] as const,
    search: (params: Record<string, unknown>) => ['stockMedia', 'search', params] as const,
    info: (site: string, id: string) => ['stockMedia', 'info', site, id] as const,
    order: (taskId: string) => ['stockMedia', 'order', taskId] as const,
    download: (taskId: string, type?: string) => ['stockMedia', 'download', taskId, type] as const
  },
  
  aiGeneration: {
    all: ['aiGeneration'] as const,
    job: (jobId: string) => ['aiGeneration', 'job', jobId] as const,
    history: (userId?: string) => ['aiGeneration', 'history', userId] as const,
    balance: () => ['aiGeneration', 'balance'] as const
  },
  
  
  
  analytics: {
    all: ['analytics'] as const,
    usage: (userId?: string, period?: string) => ['analytics', 'usage', userId, period] as const,
    performance: (component?: string) => ['analytics', 'performance', component] as const
  }
};

// ============================================================================
// Cache Invalidation Utilities
// ============================================================================

export const invalidateStockMedia = () => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.stockMedia.all });
};

export const invalidateAIGeneration = () => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.aiGeneration.all });
};

export const invalidateOrders = () => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.orders() });
};

export const invalidateUser = () => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.user() });
};

// ============================================================================
// Prefetch Utilities
// ============================================================================

export const prefetchStockMediaSearch = async (params: Record<string, unknown>) => {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.stockMedia.search(params),
    queryFn: async () => {
      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 100));
      return { items: [], total: 0 };
    },
    ...DEFAULT_CACHE_CONFIG
  });
};

export const prefetchUserProfile = async (userId?: string) => {
  return queryClient.prefetchQuery({
    queryKey: [...queryKeys.user(), 'profile', userId],
    queryFn: async () => {
      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 100));
      return { id: userId, name: 'User', email: 'user@example.com' };
    },
    ...DEFAULT_CACHE_CONFIG
  });
};

export const prefetchUserCredits = async (userId?: string) => {
  return queryClient.prefetchQuery({
    queryKey: [...queryKeys.user(), 'credits', userId],
    queryFn: async () => {
      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 100));
      return { credits: 100, currency: 'USD' };
    },
    ...CRITICAL_CACHE_CONFIG
  });
};

// ============================================================================
// Background Refetch Utilities
// ============================================================================

export const enableBackgroundRefetch = (queryKey: unknown[]) => {
  return queryClient.refetchQueries({ queryKey });
};

export const disableBackgroundRefetch = (queryKey: unknown[]) => {
  return queryClient.cancelQueries({ queryKey });
};

// ============================================================================
// Cache Management
// ============================================================================

export const clearCache = () => {
  return queryClient.clear();
};

export const removeQueries = (queryKey: unknown[]) => {
  return queryClient.removeQueries({ queryKey });
};

export const getCacheSize = () => {
  return queryClient.getQueryCache().getAll().length;
};

export const getCacheData = (queryKey: unknown[]) => {
  return queryClient.getQueryData(queryKey);
};

export const setCacheData = (queryKey: unknown[], data: unknown) => {
  return queryClient.setQueryData(queryKey, data);
};

// ============================================================================
// Performance Monitoring
// ============================================================================

export const getQueryStats = () => {
  const cache = queryClient.getQueryCache();
  const queries = cache.getAll();
  
  return {
    totalQueries: queries.length,
    activeQueries: queries.filter(q => q.state.status === 'pending').length,
    staleQueries: queries.filter(q => q.isStale()).length,
    errorQueries: queries.filter(q => q.state.status === 'error').length,
    cacheSize: queries.length
  };
};

export const logQueryStats = () => {
  const stats = getQueryStats();
  
  if (process.env.NODE_ENV === 'development') {
    console.group('📊 React Query Stats');
    console.log('Total Queries:', stats.totalQueries);
    console.log('Active Queries:', stats.activeQueries);
    console.log('Stale Queries:', stats.staleQueries);
    console.log('Error Queries:', stats.errorQueries);
    console.log('Cache Size:', stats.cacheSize);
    console.groupEnd();
  }
};

// ============================================================================
// Optimized Query Hooks
// ============================================================================

// Note: These are utility functions, not React hooks
// The actual useQuery and useMutation should be called in React components
export const createOptimizedQueryConfig = <T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
    refetchInterval?: number | false;
    refetchOnWindowFocus?: boolean;
    retry?: boolean | number;
  }
) => {
  return {
    queryKey,
    queryFn,
    ...DEFAULT_CACHE_CONFIG,
    ...options
  };
};

export const createOptimizedMutationConfig = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
    onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables) => void;
  }
) => {
  return {
    mutationFn,
    ...options
  };
};

// ============================================================================
// Cache Persistence (Optional)
// ============================================================================

export const persistCache = () => {
  if (typeof window !== 'undefined') {
    const cacheData = queryClient.getQueryCache().getAll();
    localStorage.setItem('react-query-cache', JSON.stringify(cacheData));
  }
};

export const restoreCache = () => {
  if (typeof window !== 'undefined') {
    const cachedData = localStorage.getItem('react-query-cache');
    if (cachedData) {
      try {
        const queries = JSON.parse(cachedData);
        queries.forEach((query: { queryKey: readonly unknown[]; state: { data: unknown } }) => {
          queryClient.setQueryData(query.queryKey, query.state.data);
        });
      } catch (error) {
        console.error('Failed to restore cache:', error);
      }
    }
  }
};

// ============================================================================
// Development Tools
// ============================================================================

if (process.env.NODE_ENV === 'development') {
  // Log query stats every 30 seconds
  setInterval(logQueryStats, 30000);
  
  // Expose query client to window for debugging
  if (typeof window !== 'undefined') {
    (window as { queryClient?: typeof queryClient }).queryClient = queryClient;
  }
}

export default queryClient;
