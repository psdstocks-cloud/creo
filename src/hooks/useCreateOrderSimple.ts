import { useMutation } from '@tanstack/react-query';
import apiClient from '../lib/api-client';

export interface CreateOrderParams {
  siteId: string;
  stockId: string;
  quantity: number;
}

export function useCreateOrderMutation() {
  return useMutation({
    mutationFn: (params: CreateOrderParams) =>
      apiClient.post('/orders', params).then((res) => (res as { data: unknown }).data)
  });
}
