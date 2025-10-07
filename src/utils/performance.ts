/**
 * Performance Optimization Utilities
 * 
 * Comprehensive performance optimization utilities for the Creo application
 * including query optimization, component optimization, and bundle optimization.
 */

import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
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

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: true,
  refetchOnReconnect: true,
  retry: 3,
  retryDelay: 1000
};

export const CRITICAL_CACHE_CONFIG: CacheConfig = {
  staleTime: 30 * 1000, // 30 seconds
  gcTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
  retry: 5,
  retryDelay: 500
};

export const BACKGROUND_CACHE_CONFIG: CacheConfig = {
  staleTime: 2 * 60 * 1000, // 2 minutes
  gcTime: 15 * 60 * 1000, // 15 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: true,
  retry: 2,
  retryDelay: 2000
};

// Cache key generators
export const createCacheKey = (prefix: string, ...parts: (string | number | boolean)[]): QueryKey => {
  return [prefix, ...parts];
};

export const createInfiniteCacheKey = (prefix: string, ...parts: (string | number | boolean)[]): QueryKey => {
  return [prefix, 'infinite', ...parts];
};

// Cache invalidation helpers
export const invalidateQueries = (queryClient: QueryClient, queryKey: QueryKey) => {
  return queryClient.invalidateQueries({ queryKey });
};

export const invalidateAllQueries = (queryClient: QueryClient, prefix: string) => {
  return queryClient.invalidateQueries({ queryKey: [prefix] });
};

export const prefetchQuery = async <T>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  config?: Partial<CacheConfig>
) => {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    ...DEFAULT_CACHE_CONFIG,
    ...config
  });
};

// Request deduplication
const pendingRequests = new Map<string, Promise<unknown>>();

export const deduplicateRequest = <T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>;
  }

  const request = requestFn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, request);
  return request;
};

// ============================================================================
// Component Optimization
// ============================================================================

// Memoization helpers - these are utility functions, not React hooks
export const createMemoizedCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T
): T => {
  // This is a utility function that returns a callback
  // The actual useCallback should be called in React components
  return callback as T;
};

export const createMemoizedValue = <T>(
  factory: () => T
): T => {
  // This is a utility function that returns a value
  // The actual useMemo should be called in React components
  return factory();
};

// Virtual scrolling utilities
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const useVirtualScroll = <T>(
  items: T[],
  config: VirtualScrollConfig
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const { itemHeight, containerHeight, overscan = 5 } = config;

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
};

// Image lazy loading
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(false);
  };

  return {
    imageSrc,
    isLoaded,
    isError,
    imgRef,
    handleLoad,
    handleError
  };
};

// Debounced search
export const useDebouncedSearch = (
  searchTerm: string,
  delay: number = 300
): string => {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return debouncedTerm;
};

// Throttled scroll
export const useThrottledScroll = (
  callback: (scrollTop: number) => void,
  delay: number = 16
) => {
  const lastCall = useRef(0);

  return useCallback((scrollTop: number) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(scrollTop);
    }
  }, [callback, delay]);
};

// ============================================================================
// Bundle Optimization
// ============================================================================

// Dynamic imports with loading states
export function createLazyComponent<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFn);
  
  const LazyWrapper = (props: React.ComponentProps<T>) => {
    const FallbackComponent = fallback || (() => React.createElement('div', null, 'Loading...'));
    return React.createElement(
      React.Suspense,
      { fallback: React.createElement(FallbackComponent) },
      React.createElement(LazyComponent as React.ComponentType<React.ComponentProps<T>>, props)
    );
  };
  LazyWrapper.displayName = 'LazyWrapper';
  return LazyWrapper;
}

// Preload critical resources
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = async (srcs: string[]): Promise<void> => {
  await Promise.all(srcs.map(preloadImage));
};

// Resource hints
export const addResourceHint = (href: string, as: string, type?: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
};

// ============================================================================
// Performance Monitoring
// ============================================================================

export const usePerformanceMonitor = (componentName: string) => {
  const renderStart = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStart.current = performance.now();
    renderCount.current += 1;

    return () => {
      const renderTime = performance.now() - renderStart.current;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  return {
    renderCount: renderCount.current
  };
};

// Memory usage monitoring
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// ============================================================================
// Optimization Hooks
// ============================================================================

// Optimized polling
export const useOptimizedPolling = (
  enabled: boolean,
  baseInterval: number = 2000,
  userActivityMultiplier: number = 0.5
) => {
  const [isUserActive, setIsUserActive] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      setIsUserActive(true);
      setLastActivity(Date.now());
    };

    const handleInactivity = () => {
      setIsUserActive(false);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    const inactivityTimer = setInterval(() => {
      if (Date.now() - lastActivity > 30000) { // 30 seconds
        handleInactivity();
      }
    }, 5000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(inactivityTimer);
    };
  }, [lastActivity]);

  const pollingInterval = useMemo(() => {
    return isUserActive ? baseInterval : baseInterval * userActivityMultiplier;
  }, [isUserActive, baseInterval, userActivityMultiplier]);

  return {
    pollingInterval,
    isUserActive
  };
};

// Optimized re-renders
export const useOptimizedRenders = <T>(
  value: T,
  equalityFn?: (a: T, b: T) => boolean
) => {
  const prevValue = useRef<T>(value);
  const shouldUpdate = useRef<boolean>(true);

  if (equalityFn ? !equalityFn(prevValue.current, value) : prevValue.current !== value) {
    prevValue.current = value;
    shouldUpdate.current = true;
  } else {
    shouldUpdate.current = false;
  }

  return shouldUpdate.current;
};

// ============================================================================
// Utility Functions
// ============================================================================

export const createOptimizedComponent = <P extends object>(
  Component: React.ComponentType<P>,
  displayName?: string
) => {
  const OptimizedComponent = React.memo(Component);
  OptimizedComponent.displayName = displayName || Component.displayName || Component.name;
  return OptimizedComponent;
};

export const createOptimizedCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T
): T => {
  // This is a utility function that returns a callback
  // The actual useCallback should be called in React components
  return callback as T;
};

export const createOptimizedMemo = <T>(
  factory: () => T
): T => {
  // This is a utility function that returns a value
  // The actual useMemo should be called in React components
  return factory();
};

// Bundle size optimization
export function createCodeSplitComponent<P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFn);
  
  const CodeSplitWrapper = React.forwardRef<unknown, P>((props, ref) => {
    const FallbackComponent = fallback || (() => React.createElement('div', null, 'Loading...'));
    return React.createElement(
      React.Suspense,
      { fallback: React.createElement(FallbackComponent) },
      React.createElement(LazyComponent, { ...props, ref })
    );
  });
  CodeSplitWrapper.displayName = 'CodeSplitWrapper';
  return CodeSplitWrapper;
}

export default {
  // Query optimization
  DEFAULT_CACHE_CONFIG,
  CRITICAL_CACHE_CONFIG,
  BACKGROUND_CACHE_CONFIG,
  createCacheKey,
  createInfiniteCacheKey,
  invalidateQueries,
  invalidateAllQueries,
  prefetchQuery,
  deduplicateRequest,
  
  // Component optimization
  createMemoizedCallback,
  createMemoizedValue,
  useVirtualScroll,
  useLazyImage,
  useDebouncedSearch,
  useThrottledScroll,
  
  // Bundle optimization
  createLazyComponent,
  preloadImage,
  preloadImages,
  addResourceHint,
  
  // Performance monitoring
  usePerformanceMonitor,
  useMemoryMonitor,
  
  // Optimization hooks
  useOptimizedPolling,
  useOptimizedRenders,
  
  // Utility functions
  createOptimizedComponent,
  createOptimizedCallback,
  createOptimizedMemo,
  createCodeSplitComponent
};
