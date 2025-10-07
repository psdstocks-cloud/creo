import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/api-client';

export interface OrderStatus {
  taskId: string;
  orderId: string;
  status: 'pending' | 'processing' | 'ready' | 'error' | 'completed' | 'cancelled';
  progress?: number; // 0-100
  downloadLink?: string;
  fileName?: string;
  fileSize?: number;
  downloadExpiresAt?: string;
  maxDownloads?: number;
  currentDownloads?: number;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  estimatedCompletionTime?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface OrderStatusResponse {
  success: boolean;
  data: OrderStatus;
  message?: string;
}

const fetchOrderStatus = async (taskId: string): Promise<OrderStatus> => {
  const { data } = await apiClient.get<OrderStatusResponse>(`/order/${taskId}/status`);
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to check order status');
  }
  
  return data.data;
};

export function useOrderStatus(taskId: string, options?: {
  enabled?: boolean;
  refetchInterval?: number | false;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
}) {
  const {
    enabled = true,
    refetchInterval = 2000, // Poll every 2 seconds by default
    refetchOnWindowFocus = true,
    staleTime = 1000 * 30, // 30 seconds
  } = options || {};

  return useQuery({
    queryKey: ['orderStatus', taskId],
    queryFn: () => fetchOrderStatus(taskId),
    enabled: enabled && !!taskId,
    refetchInterval: (data) => {
      // Stop polling when order is completed, error, or cancelled
      if (data?.status === 'ready' || data?.status === 'error' || data?.status === 'completed' || data?.status === 'cancelled') {
        return false;
      }
      return refetchInterval;
    },
    refetchOnWindowFocus,
    staleTime,
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      // Retry up to 3 times for server errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for checking multiple order statuses
export function useMultipleOrderStatus(taskIds: string[], options?: {
  enabled?: boolean;
  refetchInterval?: number | false;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
}) {
  const {
    enabled = true,
    refetchInterval = 5000, // Poll every 5 seconds for multiple orders
    refetchOnWindowFocus = true,
    staleTime = 1000 * 30, // 30 seconds
  } = options || {};

  return useQuery({
    queryKey: ['multipleOrderStatus', taskIds],
    queryFn: async () => {
      const promises = taskIds.map(taskId => fetchOrderStatus(taskId));
      const results = await Promise.allSettled(promises);
      
      return results.map((result, index) => ({
        taskId: taskIds[index],
        status: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null,
      }));
    },
    enabled: enabled && taskIds.length > 0,
    refetchInterval,
    refetchOnWindowFocus,
    staleTime,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for getting order history
export function useOrderHistory(options?: {
  page?: number;
  limit?: number;
  status?: OrderStatus['status'];
  startDate?: string;
  endDate?: string;
}) {
  const {
    page = 1,
    limit = 20,
    status,
    startDate,
    endDate,
  } = options || {};

  return useQuery({
    queryKey: ['orderHistory', { page, limit, status, startDate, endDate }],
    queryFn: async () => {
      const { data } = await apiClient.get<{
        orders: OrderStatus[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>('/orders/history', {
        params: {
          page,
          limit,
          status,
          start_date: startDate,
          end_date: endDate,
        }
      });
      
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
