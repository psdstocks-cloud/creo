import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api-client';

export interface CreateOrderParams {
  siteId: string;
  stockId: string;
  quantity: number;
  paymentMethod?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  notes?: string;
}

export interface OrderResponse {
  success: boolean;
  taskId: string;
  orderId: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  totalAmount: number;
  currency: string;
  paymentUrl?: string;
  requiresPayment: boolean;
  createdAt: string;
}

export interface CreateOrderError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

const createOrderAPI = async (params: CreateOrderParams): Promise<OrderResponse> => {
  const { data } = await apiClient.post<OrderResponse>('/orders', {
    site_id: params.siteId,
    stock_id: params.stockId,
    quantity: params.quantity,
    payment_method: params.paymentMethod || 'credit_card',
    billing_address: params.billingAddress,
    notes: params.notes,
  });
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to create order');
  }
  
  return data;
};

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createOrderAPI,
    onSuccess: (data) => {
      // Invalidate and refetch order-related queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderStatus', data.taskId] });
      
      // Optionally prefetch the order status
      queryClient.prefetchQuery({
        queryKey: ['orderStatus', data.taskId],
        queryFn: () => fetchOrderStatus(data.taskId),
        staleTime: 1000 * 30, // 30 seconds
      });
    },
    onError: (error: CreateOrderError) => {
      console.error('Order creation failed:', error);
    },
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

// Helper function to fetch order status (used in prefetch)
async function fetchOrderStatus(taskId: string) {
  const { data } = await apiClient.get(`/order/${taskId}/status`);
  return data;
}

// Hook for creating multiple orders in batch
export function useCreateBatchOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orders: CreateOrderParams[]) => {
      const { data } = await apiClient.post<{ orders: OrderResponse[] }>('/orders/batch', {
        orders: orders.map(order => ({
          site_id: order.siteId,
          stock_id: order.stockId,
          quantity: order.quantity,
          payment_method: order.paymentMethod || 'credit_card',
          billing_address: order.billingAddress,
          notes: order.notes,
        }))
      });
      
      if (!data) {
        throw new Error('Failed to create batch orders');
      }
      
      return data.orders;
    },
    onSuccess: (orders) => {
      // Invalidate and refetch order-related queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Prefetch status for all created orders
      orders.forEach(order => {
        queryClient.prefetchQuery({
          queryKey: ['orderStatus', order.taskId],
          queryFn: () => fetchOrderStatus(order.taskId),
          staleTime: 1000 * 30, // 30 seconds
        });
      });
    },
    onError: (error: CreateOrderError) => {
      console.error('Batch order creation failed:', error);
    },
  });
}
