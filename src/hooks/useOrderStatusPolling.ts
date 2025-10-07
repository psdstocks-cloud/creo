import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useEffect, useRef, useCallback, useState, useMemo } from 'react';

// Type definitions for order status polling
export interface OrderStatus {
  orderId: string;
  taskId: string;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'error' | 'cancelled' | 'failed';
  progress: number; // 0-100
  message?: string;
  estimatedCompletionTime?: string;
  actualCompletionTime?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  metadata?: {
    processingStage?: string;
    currentStep?: string;
    totalSteps?: number;
    completedSteps?: number;
    queuePosition?: number;
    estimatedWaitTime?: number;
  };
  result?: {
    downloadUrl?: string;
    downloadExpiresAt?: string;
    fileSize?: number;
    fileName?: string;
    checksum?: string;
    previewUrl?: string;
    thumbnailUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface OrderStatusResponse {
  success: boolean;
  data: OrderStatus;
  message?: string;
}

export interface OrderStatusError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
  retryable?: boolean;
}

export interface OrderStatusPollingOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
  refetchIntervalInBackground?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: boolean | number;
  retryDelay?: number | ((attemptIndex: number) => number);
  onStatusChange?: (status: OrderStatus) => void;
  onCompletion?: (status: OrderStatus) => void;
  onError?: (error: OrderStatusError) => void;
  maxPollingTime?: number; // Maximum time to poll in milliseconds
  stopOnError?: boolean; // Stop polling on error
  stopOnCompletion?: boolean; // Stop polling when completed
}

// API client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.stockmedia.com/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
  },
});

// API function to fetch order status
export const fetchOrderStatus = async (taskId: string): Promise<OrderStatus> => {
  try {
    if (!taskId || taskId.trim().length === 0) {
      throw new Error('Task ID is required');
    }

    const response = await apiClient.get<OrderStatusResponse>(`/orders/${taskId}/status`);
    
    if (!response.data) {
      throw new Error('No data received from API');
    }
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch order status');
    }
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<OrderStatusError>;
      const errorData = axiosError.response?.data;
      
      if (errorData) {
        const orderStatusError: OrderStatusError = {
          code: errorData.code || 'ORDER_STATUS_FETCH_FAILED',
          message: errorData.message || 'Failed to fetch order status',
          details: errorData.details,
          statusCode: axiosError.response?.status,
          retryable: axiosError.response?.status ? axiosError.response.status >= 500 : false,
        };
        throw orderStatusError;
      }
      
      // Handle network errors
      if (!axiosError.response) {
        const networkError: OrderStatusError = {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your internet connection.',
          statusCode: 0,
          retryable: true,
        };
        throw networkError;
      }
      
      // Handle HTTP status errors
      const statusError: OrderStatusError = {
        code: `HTTP_${axiosError.response.status}`,
        message: axiosError.message || 'Request failed',
        statusCode: axiosError.response.status,
        retryable: axiosError.response.status >= 500,
      };
      throw statusError;
    }
    
    // Handle unknown errors
    const unknownError: OrderStatusError = {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      retryable: false,
    };
    throw unknownError;
  }
};

// Main React Query hook for order status polling
export function useOrderStatusPolling(
  taskId: string,
  options?: OrderStatusPollingOptions
): UseQueryResult<OrderStatus, OrderStatusError> & {
  isPolling: boolean;
  pollingTime: number;
  stopPolling: () => void;
  startPolling: () => void;
} {
  const {
    enabled = true,
    refetchInterval = 2000, // Poll every 2 seconds
    refetchIntervalInBackground = true,
    refetchOnWindowFocus = true,
    staleTime = 1000 * 30, // 30 seconds
    cacheTime = 1000 * 60 * 5, // 5 minutes
    retry = true,
    retryDelay = (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onStatusChange,
    onCompletion,
    onError,
    maxPollingTime = 1000 * 60 * 30, // 30 minutes max
    stopOnError = true,
    stopOnCompletion = true,
  } = options || {};

  const pollingStartTime = useRef<number>(Date.now());
  const pollingTime = useRef<number>(0);
  const isPollingRef = useRef<boolean>(false);
  const previousStatus = useRef<OrderStatus | null>(null);

  // Update polling time
  useEffect(() => {
    if (isPollingRef.current) {
      const interval = setInterval(() => {
        pollingTime.current = Date.now() - pollingStartTime.current;
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPollingRef.current]);

  // Handle status changes
  const handleStatusChange = useCallback((status: OrderStatus) => {
    if (previousStatus.current?.status !== status.status) {
      onStatusChange?.(status);
      previousStatus.current = status;
    }
  }, [onStatusChange]);

  // Handle completion
  const handleCompletion = useCallback((status: OrderStatus) => {
    if (status.status === 'completed' || status.status === 'ready') {
      onCompletion?.(status);
    }
  }, [onCompletion]);

  // Handle errors
  const handleError = useCallback((error: OrderStatusError) => {
    onError?.(error);
  }, [onError]);

  // Determine if polling should continue
  const shouldContinuePolling = useCallback((data: OrderStatus | undefined, error: OrderStatusError | null) => {
    // Stop if max polling time reached
    if (pollingTime.current >= maxPollingTime) {
      return false;
    }

    // Stop on error if configured
    if (error && stopOnError) {
      return false;
    }

    // Stop on completion if configured
    if (data && stopOnCompletion && (data.status === 'completed' || data.status === 'ready')) {
      return false;
    }

    // Stop on terminal states
    if (data && (data.status === 'error' || data.status === 'cancelled' || data.status === 'failed')) {
      return false;
    }

    return true;
  }, [maxPollingTime, stopOnError, stopOnCompletion]);

  // Main query
  const queryResult = useQuery({
    queryKey: ['orderStatus', taskId],
    queryFn: () => fetchOrderStatus(taskId),
    enabled: enabled && !!taskId && taskId.trim().length > 0,
    refetchInterval: (data, error) => {
      if (!shouldContinuePolling(data, error)) {
        isPollingRef.current = false;
        return false;
      }
      isPollingRef.current = true;
      return refetchInterval;
    },
    refetchIntervalInBackground,
    refetchOnWindowFocus,
    staleTime,
    cacheTime,
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      
      // Don't retry on non-retryable errors
      if (error.retryable === false) {
        return false;
      }
      
      // Retry up to 3 times for server errors
      return retry ? (typeof retry === 'number' ? failureCount < retry : failureCount < 3) : false;
    },
    retryDelay,
    onSuccess: (data) => {
      handleStatusChange(data);
      handleCompletion(data);
    },
    onError: (error) => {
      handleError(error);
    },
  });

  // Update polling state
  useEffect(() => {
    if (queryResult.isFetching && !queryResult.isError) {
      isPollingRef.current = true;
      pollingStartTime.current = Date.now();
    } else if (queryResult.isError || queryResult.isSuccess) {
      isPollingRef.current = false;
    }
  }, [queryResult.isFetching, queryResult.isError, queryResult.isSuccess]);

  // Manual control functions
  const stopPolling = useCallback(() => {
    isPollingRef.current = false;
  }, []);

  const startPolling = useCallback(() => {
    if (enabled && taskId) {
      isPollingRef.current = true;
      pollingStartTime.current = Date.now();
      queryResult.refetch();
    }
  }, [enabled, taskId, queryResult]);

  return {
    ...queryResult,
    isPolling: isPollingRef.current,
    pollingTime: pollingTime.current,
    stopPolling,
    startPolling,
  };
}

// Hook for multiple order status polling
export function useMultipleOrderStatusPolling(
  taskIds: string[],
  options?: OrderStatusPollingOptions
): Record<string, UseQueryResult<OrderStatus, OrderStatusError> & {
  isPolling: boolean;
  pollingTime: number;
  stopPolling: () => void;
  startPolling: () => void;
}> {
  const results: Record<string, any> = {};
  
  taskIds.forEach(taskId => {
    results[taskId] = useOrderStatusPolling(taskId, options);
  });
  
  return results;
}

// Hook for order status with custom polling intervals
export function useOrderStatusPollingWithIntervals(
  taskId: string,
  intervals: {
    initial?: number;
    processing?: number;
    ready?: number;
    error?: number;
  },
  options?: OrderStatusPollingOptions
): UseQueryResult<OrderStatus, OrderStatusError> & {
  isPolling: boolean;
  pollingTime: number;
  stopPolling: () => void;
  startPolling: () => void;
} {
  const {
    initial = 1000,
    processing = 2000,
    ready = 5000,
    error = 10000,
  } = intervals;

  const [currentInterval, setCurrentInterval] = useState(initial);

  const queryResult = useOrderStatusPolling(taskId, {
    ...options,
    refetchInterval: currentInterval,
    onStatusChange: (status) => {
      // Adjust polling interval based on status
      switch (status.status) {
        case 'pending':
          setCurrentInterval(initial);
          break;
        case 'processing':
          setCurrentInterval(processing);
          break;
        case 'ready':
          setCurrentInterval(ready);
          break;
        case 'error':
        case 'failed':
          setCurrentInterval(error);
          break;
        default:
          setCurrentInterval(processing);
      }
      
      options?.onStatusChange?.(status);
    },
  });

  return queryResult;
}

// Hook for order status with progress tracking
export function useOrderStatusWithProgress(
  taskId: string,
  options?: OrderStatusPollingOptions
): UseQueryResult<OrderStatus, OrderStatusError> & {
  isPolling: boolean;
  pollingTime: number;
  stopPolling: () => void;
  startPolling: () => void;
  progress: number;
  estimatedTimeRemaining: number | null;
  isComplete: boolean;
  isError: boolean;
} {
  const queryResult = useOrderStatusPolling(taskId, options);
  
  const progress = queryResult.data?.progress || 0;
  const isComplete = queryResult.data?.status === 'completed' || queryResult.data?.status === 'ready';
  const isError = queryResult.data?.status === 'error' || queryResult.data?.status === 'failed';
  
  const estimatedTimeRemaining = useMemo(() => {
    if (!queryResult.data?.estimatedCompletionTime || isComplete) {
      return null;
    }
    
    const estimatedTime = new Date(queryResult.data.estimatedCompletionTime).getTime();
    const now = Date.now();
    return Math.max(0, estimatedTime - now);
  }, [queryResult.data?.estimatedCompletionTime, isComplete]);

  return {
    ...queryResult,
    progress,
    estimatedTimeRemaining,
    isComplete,
    isError,
  };
}

// Export types for external use
export type {
  OrderStatus,
  OrderStatusResponse,
  OrderStatusError,
  OrderStatusPollingOptions,
};
