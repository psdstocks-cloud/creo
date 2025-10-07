import { useMutation, useQueryClient, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

// Type definitions for order creation
export interface CreateOrderRequest {
  siteId: string;
  stockId: string;
  quantity?: number;
  paymentMethod?: 'credit_card' | 'paypal' | 'stripe' | 'bank_transfer' | 'crypto';
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone?: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone?: string;
  };
  notes?: string;
  metadata?: Record<string, unknown>;
  discountCode?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  expectedDeliveryDate?: string;
  customFields?: Record<string, string>;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  taskId: string;
  status: 'pending' | 'processing' | 'ready' | 'error' | 'cancelled';
  totalAmount: number;
  currency: string;
  paymentUrl?: string;
  requiresPayment: boolean;
  estimatedProcessingTime?: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    stockId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    currency: string;
  }>;
  billing: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
  };
  tracking?: {
    trackingNumber: string;
    carrier: string;
    estimatedDelivery: string;
  };
}

export interface CreateOrderError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  field?: string;
  statusCode?: number;
  retryable?: boolean;
}

export interface CreateOrderOptions {
  onSuccess?: (data: CreateOrderResponse) => void;
  onError?: (error: CreateOrderError) => void;
  onSettled?: (data: CreateOrderResponse | undefined, error: CreateOrderError | null) => void;
  retry?: boolean | number;
  retryDelay?: number | ((attemptIndex: number) => number);
  timeout?: number;
  validateBeforeSubmit?: boolean;
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

// Validation function
const validateCreateOrderRequest = (request: CreateOrderRequest): string[] => {
  const errors: string[] = [];

  if (!request.siteId || request.siteId.trim().length === 0) {
    errors.push('Site ID is required');
  }

  if (!request.stockId || request.stockId.trim().length === 0) {
    errors.push('Stock ID is required');
  }

  if (request.quantity !== undefined && (request.quantity < 1 || request.quantity > 1000)) {
    errors.push('Quantity must be between 1 and 1000');
  }

  if (request.billingAddress) {
    const { street, city, state, country, postalCode } = request.billingAddress;
    if (!street || !city || !state || !country || !postalCode) {
      errors.push('Complete billing address is required when provided');
    }
  }

  if (request.paymentMethod && !['credit_card', 'paypal', 'stripe', 'bank_transfer', 'crypto'].includes(request.paymentMethod)) {
    errors.push('Invalid payment method');
  }

  if (request.priority && !['low', 'normal', 'high', 'urgent'].includes(request.priority)) {
    errors.push('Invalid priority level');
  }

  if (request.expectedDeliveryDate) {
    const deliveryDate = new Date(request.expectedDeliveryDate);
    const now = new Date();
    if (deliveryDate <= now) {
      errors.push('Expected delivery date must be in the future');
    }
  }

  return errors;
};

// API function to create order
export const createOrderAPI = async (request: CreateOrderRequest): Promise<CreateOrderResponse> => {
  try {
    // Validate request before sending
    const validationErrors = validateCreateOrderRequest(request);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Prepare the request payload
    const payload = {
      site_id: request.siteId,
      stock_id: request.stockId,
      quantity: request.quantity || 1,
      payment_method: request.paymentMethod || 'credit_card',
      billing_address: request.billingAddress,
      shipping_address: request.shippingAddress,
      notes: request.notes,
      metadata: request.metadata,
      discount_code: request.discountCode,
      priority: request.priority || 'normal',
      expected_delivery_date: request.expectedDeliveryDate,
      custom_fields: request.customFields,
    };

    // Remove undefined values
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    const response = await apiClient.post<CreateOrderResponse>('/orders', cleanPayload);

    if (!response.data) {
      throw new Error('No data received from API');
    }

    if (!response.data.success) {
      throw new Error(response.data.message || 'Order creation failed');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<CreateOrderError>;
      const errorData = axiosError.response?.data;
      
      if (errorData) {
        const createOrderError: CreateOrderError = {
          code: errorData.code || 'ORDER_CREATION_FAILED',
          message: errorData.message || 'Failed to create order',
          details: errorData.details,
          field: errorData.field,
          statusCode: axiosError.response?.status,
          retryable: axiosError.response?.status ? axiosError.response.status >= 500 : false,
        };
        throw createOrderError;
      }
      
      // Handle network errors
      if (!axiosError.response) {
        const networkError: CreateOrderError = {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your internet connection.',
          statusCode: 0,
          retryable: true,
        };
        throw networkError;
      }
      
      // Handle HTTP status errors
      const statusError: CreateOrderError = {
        code: `HTTP_${axiosError.response.status}`,
        message: axiosError.message || 'Request failed',
        statusCode: axiosError.response.status,
        retryable: axiosError.response.status >= 500,
      };
      throw statusError;
    }
    
    // Handle validation errors
    if (error instanceof Error && error.message.includes('Validation failed')) {
      const validationError: CreateOrderError = {
        code: 'VALIDATION_ERROR',
        message: error.message,
        retryable: false,
      };
      throw validationError;
    }
    
    // Handle unknown errors
    const unknownError: CreateOrderError = {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      retryable: false,
    };
    throw unknownError;
  }
};

// Main React Query mutation hook
export function useCreateOrder(
  options?: CreateOrderOptions
): UseMutationResult<CreateOrderResponse, CreateOrderError, CreateOrderRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrderAPI,
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderHistory'] });
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
      
      // Prefetch order status
      queryClient.prefetchQuery({
        queryKey: ['orderStatus', data.taskId],
        queryFn: () => fetchOrderStatus(data.taskId),
        staleTime: 1000 * 30, // 30 seconds
      });
      
      // Prefetch order details
      queryClient.prefetchQuery({
        queryKey: ['orderDetails', data.orderId],
        queryFn: () => fetchOrderDetails(data.orderId),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
      
      // Call success callback
      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      console.error('Order creation failed:', error);
      
      // Call error callback
      options?.onError?.(error);
    },
    onSettled: (data, error, variables, context) => {
      // Call settled callback
      options?.onSettled?.(data, error);
    },
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx) or validation errors
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      
      // Don't retry on non-retryable errors
      if (error.retryable === false) {
        return false;
      }
      
      // Retry up to 3 times for server errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff with jitter
      const baseDelay = options?.retryDelay || 1000;
      const delay = baseDelay * Math.pow(2, attemptIndex);
      const jitter = Math.random() * 1000;
      return Math.min(delay + jitter, 30000); // Max 30 seconds
    },
    mutationKey: ['createOrder'],
  });
}

// Hook for creating multiple orders in batch
export function useCreateBatchOrder(
  options?: CreateOrderOptions
): UseMutationResult<CreateOrderResponse[], CreateOrderError, CreateOrderRequest[]> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orders: CreateOrderRequest[]) => {
      // Validate all orders first
      const validationErrors: string[] = [];
      orders.forEach((order, index) => {
        const errors = validateCreateOrderRequest(order);
        if (errors.length > 0) {
          validationErrors.push(`Order ${index + 1}: ${errors.join(', ')}`);
        }
      });
      
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join('; ')}`);
      }

      const response = await apiClient.post<{ orders: CreateOrderResponse[] }>('/orders/batch', {
        orders: orders.map(order => ({
          site_id: order.siteId,
          stock_id: order.stockId,
          quantity: order.quantity || 1,
          payment_method: order.paymentMethod || 'credit_card',
          billing_address: order.billingAddress,
          shipping_address: order.shippingAddress,
          notes: order.notes,
          metadata: order.metadata,
          discount_code: order.discountCode,
          priority: order.priority || 'normal',
          expected_delivery_date: order.expectedDeliveryDate,
          custom_fields: order.customFields,
        }))
      });

      if (!response.data || !response.data.orders) {
        throw new Error('No data received from batch order API');
      }

      return response.data.orders;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderHistory'] });
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
      
      // Prefetch status for all created orders
      data.forEach(order => {
        queryClient.prefetchQuery({
          queryKey: ['orderStatus', order.taskId],
          queryFn: () => fetchOrderStatus(order.taskId),
          staleTime: 1000 * 30, // 30 seconds
        });
      });
      
      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      console.error('Batch order creation failed:', error);
      options?.onError?.(error);
    },
    onSettled: (data, error, variables, context) => {
      options?.onSettled?.(data, error);
    },
    retry: (failureCount, error) => {
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      if (error.retryable === false) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      const baseDelay = options?.retryDelay || 1000;
      const delay = baseDelay * Math.pow(2, attemptIndex);
      const jitter = Math.random() * 1000;
      return Math.min(delay + jitter, 30000);
    },
    mutationKey: ['createBatchOrder'],
  });
}

// Hook for order creation with optimistic updates
export function useCreateOrderOptimistic(
  options?: CreateOrderOptions
): UseMutationResult<CreateOrderResponse, CreateOrderError, CreateOrderRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrderAPI,
    onMutate: async (newOrder) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      
      // Snapshot the previous value
      const previousOrders = queryClient.getQueryData(['orders']);
      
      // Optimistically update the cache
      const optimisticOrder: CreateOrderResponse = {
        success: true,
        orderId: `temp-${Date.now()}`,
        taskId: `temp-task-${Date.now()}`,
        status: 'pending',
        totalAmount: 0, // Will be updated when real data comes in
        currency: 'USD',
        requiresPayment: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: [{
          stockId: newOrder.stockId,
          quantity: newOrder.quantity || 1,
          unitPrice: 0,
          totalPrice: 0,
          currency: 'USD',
        }],
        billing: {
          subtotal: 0,
          tax: 0,
          discount: 0,
          total: 0,
          currency: 'USD',
        },
      };
      
      queryClient.setQueryData(['orders'], (old: unknown) => {
        if (!old) return [optimisticOrder];
        return [optimisticOrder, ...old];
      });
      
      return { previousOrders };
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders);
      }
      
      console.error('Order creation failed:', error);
      options?.onError?.(error);
    },
    onSuccess: (data, variables, context) => {
      // Update the cache with real data
      queryClient.setQueryData(['orders'], (old: unknown) => {
        if (!old) return [data];
        return old.map((order: unknown) => 
          order.orderId.startsWith('temp-') ? data : order
        );
      });
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderHistory'] });
      
      options?.onSuccess?.(data);
    },
    onSettled: (data, error, variables, context) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      options?.onSettled?.(data, error);
    },
    retry: (failureCount, error) => {
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      if (error.retryable === false) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      const baseDelay = options?.retryDelay || 1000;
      const delay = baseDelay * Math.pow(2, attemptIndex);
      const jitter = Math.random() * 1000;
      return Math.min(delay + jitter, 30000);
    },
    mutationKey: ['createOrderOptimistic'],
  });
}

// Helper functions for prefetching
async function fetchOrderStatus(taskId: string) {
  const response = await apiClient.get(`/orders/${taskId}/status`);
  return response.data;
}

async function fetchOrderDetails(orderId: string) {
  const response = await apiClient.get(`/orders/${orderId}`);
  return response.data;
}

// Export types for external use
export type {
  CreateOrderRequest,
  CreateOrderResponse,
  CreateOrderError,
  CreateOrderOptions,
};
