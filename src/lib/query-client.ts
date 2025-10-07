/**
 * Optimized React Query Configuration
 * 
 * Performance-optimized React Query setup with proper caching,
 * background refetching, and request deduplication.
 */

import { QueryClient } from '@tanstack/react-query';
import { 
  DEFAULT_CACHE_CONFIG, 
  CRITICAL_CACHE_CONFIG, 
  BACKGROUND_CACHE_CONFIG 
} from '../utils/performance';

// ============================================================================
// Query Client Configuration
// ============================================================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default cache configuration
      ...DEFAULT_CACHE_CONFIG,
      
      // Network mode for better UX
      networkMode: 'online',
      
      // Retry configuration
      retry: (failureCount, error) => {
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
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Background refetch configuration
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      
      // Stale time configuration
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Cache time configuration
      gcTime: 10 * 60 * 1000, // 10 minutes
      
      // Structural sharing for better performance
      structuralSharing: true,
      
      // Notify on change
      notifyOnChangeProps: ['data', 'error', 'isLoading', 'isFetching']
    },
    
    mutations: {
      // Default mutation configuration
      retry: 1,
      retryDelay: 1000,
      
      // Network mode
      networkMode: 'online'
    }
  }
});

// ============================================================================
// Query Key Factories
// ============================================================================

export const queryKeys = {
  // Stock Media
  stockMedia: {
    all: ['stockMedia'] as const,
    search: (params: Record<string, unknown>) => ['stockMedia', 'search', params] as const,
    info: (site: string, id: string) => ['stockMedia', 'info', site, id] as const,
    order: (taskId: string) => ['stockMedia', 'order', taskId] as const,
    download: (taskId: string, type?: string) => ['stockMedia', 'download', taskId, type] as const
  },
  
  // AI Generation
  aiGeneration: {
    all: ['aiGeneration'] as const,
    job: (jobId: string) => ['aiGeneration', 'job', jobId] as const,
    history: (userId?: string) => ['aiGeneration', 'history', userId] as const,
    balance: () => ['aiGeneration', 'balance'] as const
  },
  
  // Orders
  orders: {
    all: ['orders'] as const,
    list: (filters: Record<string, unknown>) => ['orders', 'list', filters] as const,
    detail: (orderId: string) => ['orders', 'detail', orderId] as const,
    status: (orderId: string) => ['orders', 'status', orderId] as const
  },
  
  // User
  user: {
    all: ['user'] as const,
    profile: (userId?: string) => ['user', 'profile', userId] as const,
    preferences: (userId?: string) => ['user', 'preferences', userId] as const,
    credits: (userId?: string) => ['user', 'credits', userId] as const
  },
  
  // Analytics
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
  return queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
};

export const invalidateUser = () => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
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
    queryKey: queryKeys.user.profile(userId),
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
    queryKey: queryKeys.user.credits(userId),
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
