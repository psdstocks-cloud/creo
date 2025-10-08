/**
 * Performance Optimization Utilities
 * 
 * Comprehensive performance optimization utilities for the Creo application
 * including query optimization, component optimization, and bundle optimization.
 */

import React from 'react';
import { QueryClient, QueryKey } from '@tanstack/react-query';

// ============================================================================
// Query Optimization
// ============================================================================

export interface CacheConfig {
  staleTime: number;
  gcTime: number;
  refetchOnWindowFocus: boolean;
  refetchOnMount: boolean;
  refetchOnReconnect: boolean;
  retry: boolean | number;
  retryDelay: number;
}

// Default cache configuration for most queries
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: true,
  refetchOnReconnect: true,
  retry: 3,
  retryDelay: 1000,
};

// Critical cache configuration for important data
export const CRITICAL_CACHE_CONFIG: CacheConfig = {
  staleTime: 0, // Always fresh
  gcTime: 30 * 60 * 1000, // 30 minutes
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
  retry: 5,
  retryDelay: 500,
};

// Background cache configuration for non-critical data
export const BACKGROUND_CACHE_CONFIG: CacheConfig = {
  staleTime: 15 * 60 * 1000, // 15 minutes
  gcTime: 60 * 60 * 1000, // 1 hour
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: true,
  retry: 1,
  retryDelay: 2000,
};

// ============================================================================
// Query Key Factories
// ============================================================================

export const createQueryKey = (baseKey: string, params?: Record<string, unknown>): QueryKey => {
  if (!params) return [baseKey];
  return [baseKey, params];
};

export const createNestedQueryKey = (
  baseKey: string,
  nestedKey: string,
  params?: Record<string, unknown>
): QueryKey => {
  if (!params) return [baseKey, nestedKey];
  return [baseKey, nestedKey, params];
};

// ============================================================================
// Cache Management Utilities
// ============================================================================

export const createCacheInvalidator = (queryClient: QueryClient) => {
  return {
    invalidateAll: () => queryClient.invalidateQueries(),
    invalidateByKey: (queryKey: QueryKey) => queryClient.invalidateQueries({ queryKey }),
    removeByKey: (queryKey: QueryKey) => queryClient.removeQueries({ queryKey }),
    clearCache: () => queryClient.clear(),
  };
};

export const createCachePrefetcher = (queryClient: QueryClient) => {
  return {
    prefetchQuery: <T>(
      queryKey: QueryKey,
      queryFn: () => Promise<T>,
      config?: Partial<CacheConfig>
    ) => {
      return queryClient.prefetchQuery({
        queryKey,
        queryFn,
        ...DEFAULT_CACHE_CONFIG,
        ...config,
      });
    },
  };
};

// ============================================================================
// Performance Monitoring
// ============================================================================

export const getQueryStats = (queryClient: QueryClient) => {
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

export const logQueryStats = (queryClient: QueryClient) => {
  const stats = getQueryStats(queryClient);
  
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
// Bundle Optimization
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return React.lazy(importFn) as unknown as T;
};

// ============================================================================
// Memory Management
// ============================================================================

export const createMemoryManager = () => {
  let memoryThreshold = 50 * 1024 * 1024; // 50MB threshold
  
  const checkMemoryUsage = () => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        isOverThreshold: memory.usedJSHeapSize > memoryThreshold,
      };
    }
    return null;
  };
  
  return {
    setThreshold: (threshold: number) => {
      memoryThreshold = threshold;
    },
    checkMemoryUsage,
    clearCacheIfNeeded: (queryClient: QueryClient) => {
      const memoryInfo = checkMemoryUsage();
      if (memoryInfo?.isOverThreshold) {
        queryClient.clear();
        console.log('Cache cleared due to memory threshold');
      }
    },
  };
};

// ============================================================================
// Network Optimization
// ============================================================================

export const createNetworkManager = () => {
  const getConnectionInfo = () => {
    if ('connection' in navigator) {
      const connection = (navigator as { connection: { effectiveType: string; downlink: number; rtt: number } }).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      };
    }
    return null;
  };
  
  return {
    isOnline: () => navigator.onLine,
    getConnectionInfo,
    shouldUseLowQuality: () => {
      const connectionInfo = getConnectionInfo();
      return connectionInfo?.effectiveType === 'slow-2g' || connectionInfo?.effectiveType === '2g';
    },
  };
};

// ============================================================================
// Image Optimization
// ============================================================================

export const createImageOptimizer = () => {
  return {
    getOptimalImageSize: (containerWidth: number, containerHeight: number, devicePixelRatio: number = 1) => {
      const optimalWidth = Math.min(containerWidth * devicePixelRatio, 1920);
      const optimalHeight = Math.min(containerHeight * devicePixelRatio, 1080);
      return { width: optimalWidth, height: optimalHeight };
    },
    shouldUseWebP: () => {
      return typeof window !== 'undefined' && 
             window.HTMLCanvasElement && 
             window.HTMLCanvasElement.prototype.toBlob;
    },
    createResponsiveSrcSet: (baseUrl: string, sizes: number[]) => {
      return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
    },
  };
};

// ============================================================================
// Export all utilities
// ============================================================================

export const performanceUtils = {
  cache: {
    DEFAULT_CACHE_CONFIG,
    CRITICAL_CACHE_CONFIG,
    BACKGROUND_CACHE_CONFIG,
    createCacheInvalidator,
    createCachePrefetcher,
  },
  monitoring: {
    getQueryStats,
    logQueryStats,
  },
  memory: createMemoryManager(),
  network: createNetworkManager(),
  images: createImageOptimizer(),
};
