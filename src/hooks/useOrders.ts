import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api-client';
import { Order, CreateOrderRequest, CreateOrderResponse, ApiError } from '../types/api';

/**
 * Hook to create a new order
 * @param userId - User ID creating the order
 */
export const useCreateOrder = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation<CreateOrderResponse, ApiError, CreateOrderRequest>({
    mutationFn: (orderData) => 
      apiClient.post<CreateOrderResponse>(`/users/${userId}/orders`, orderData),
    onSuccess: (data) => {
      // Invalidate orders list to refetch
      queryClient.invalidateQueries({ queryKey: ['orders', userId] });
      
      // Invalidate credits to update balance
      queryClient.invalidateQueries({ queryKey: ['credits', userId] });
      
      // Add the new order to cache
      queryClient.setQueryData(['orders', 'item', data.order.id], data.order);
    },
    onError: (error) => {
      console.error('Failed to create order:', error);
    },
  });
};

/**
 * Hook to get user orders with pagination
 * @param userId - User ID to fetch orders for
 * @param options - Pagination and filter options
 */
export const useOrders = (
  userId: string,
  options?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'all';
    enabled?: boolean;
  }
) => {
  const params = new URLSearchParams();
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.status && options.status !== 'all') {
    params.append('status', options.status);
  }

  return useQuery({
    queryKey: ['orders', userId, options],
    queryFn: () => apiClient.get(`/users/${userId}/orders?${params.toString()}`),
    enabled: options?.enabled ?? true,
    staleTime: 60000, // 1 minute
    retry: 2,
  });
};

/**
 * Hook to get a specific order
 * @param orderId - Order ID to fetch
 * @param options - Additional query options
 */
export const useOrder = (
  orderId: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<Order, ApiError>({
    queryKey: ['orders', 'item', orderId],
    queryFn: () => apiClient.get<Order>(`/orders/${orderId}`),
    enabled: options?.enabled ?? !!orderId,
    staleTime: 300000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to cancel an order
 * @param userId - User ID cancelling the order
 */
export const useCancelOrder = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Order, ApiError, string>({
    mutationFn: (orderId) => 
      apiClient.post<Order>(`/orders/${orderId}/cancel`),
    onSuccess: (data) => {
      // Update the order in cache
      queryClient.setQueryData(['orders', 'item', data.id], data);
      
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: ['orders', userId] });
      
      // Invalidate credits to update balance
      queryClient.invalidateQueries({ queryKey: ['credits', userId] });
    },
    onError: (error) => {
      console.error('Failed to cancel order:', error);
    },
  });
};

/**
 * Hook to retry a failed order
 * @param userId - User ID retrying the order
 */
export const useRetryOrder = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Order, ApiError, string>({
    mutationFn: (orderId) => 
      apiClient.post<Order>(`/orders/${orderId}/retry`),
    onSuccess: (data) => {
      // Update the order in cache
      queryClient.setQueryData(['orders', 'item', data.id], data);
      
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: ['orders', userId] });
    },
    onError: (error) => {
      console.error('Failed to retry order:', error);
    },
  });
};

/**
 * Hook to get order statistics
 * @param userId - User ID to get statistics for
 * @param options - Time period options
 */
export const useOrderStats = (
  userId: string,
  options?: {
    period?: 'day' | 'week' | 'month' | 'year';
    enabled?: boolean;
  }
) => {
  const params = new URLSearchParams();
  if (options?.period) params.append('period', options.period);

  return useQuery({
    queryKey: ['orders', 'stats', userId, options?.period],
    queryFn: () => apiClient.get(`/users/${userId}/orders/stats?${params.toString()}`),
    enabled: options?.enabled ?? true,
    staleTime: 300000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to get recent orders (last 5)
 * @param userId - User ID to fetch recent orders for
 */
export const useRecentOrders = (userId: string) => {
  return useQuery<Order[], ApiError>({
    queryKey: ['orders', 'recent', userId],
    queryFn: () => apiClient.get<Order[]>(`/users/${userId}/orders/recent`),
    staleTime: 60000, // 1 minute
    retry: 2,
  });
};
