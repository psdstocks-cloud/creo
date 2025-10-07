import { useMutation } from '@tanstack/react-query';
import apiClient from '../lib/api-client';

// Order creation parameters
interface CreateOrderParams {
  siteId: string;
  stockId: string;
  quantity: number;
}

interface CreateOrderResponse {
  success: boolean;
  taskId: string;
}

// Function performing the API call
async function createOrder(params: CreateOrderParams): Promise<CreateOrderResponse> {
  const { data } = await apiClient.post('/orders', params);
  if (!data.success) throw new Error(data.message || 'Order creation failed');
  return data;
}

// React Query mutation hook without initial arg
export function useCreateOrderMutation() {
  return useMutation((params: CreateOrderParams) => createOrder(params));
}