import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api-client';
import { CreditBalance, ApiError } from '../types/api';

/**
 * Hook to fetch user credit balance
 * @param userId - User ID to fetch credits for
 * @param options - Additional query options
 */
export const useCredits = (userId: string, options?: {
  enabled?: boolean;
  refetchInterval?: number;
}) => {
  return useQuery<CreditBalance, ApiError>({
    queryKey: ['credits', userId],
    queryFn: () => apiClient.get<CreditBalance>(`/users/${userId}/credits`),
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval ?? 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook to refresh credit balance
 * @param userId - User ID to refresh credits for
 */
export const useRefreshCredits = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation<CreditBalance, ApiError, void>({
    mutationFn: () => apiClient.get<CreditBalance>(`/users/${userId}/credits`),
    onSuccess: (data) => {
      // Update the cache with fresh data
      queryClient.setQueryData(['credits', userId], data);
    },
    onError: (error) => {
      console.error('Failed to refresh credits:', error);
    },
  });
};

/**
 * Hook to purchase credits
 * @param userId - User ID to purchase credits for
 */
export const usePurchaseCredits = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation<CreditBalance, ApiError, {
    amount: number;
    paymentMethod: string;
  }>({
    mutationFn: ({ amount, paymentMethod }) => 
      apiClient.post<CreditBalance>(`/users/${userId}/credits/purchase`, {
        amount,
        paymentMethod,
      }),
    onSuccess: (data) => {
      // Update the cache with new credit balance
      queryClient.setQueryData(['credits', userId], data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['credits', userId] });
    },
    onError: (error) => {
      console.error('Failed to purchase credits:', error);
    },
  });
};

/**
 * Hook to get credit transaction history
 * @param userId - User ID to fetch history for
 * @param options - Pagination and filter options
 */
export const useCreditHistory = (
  userId: string,
  options?: {
    page?: number;
    limit?: number;
    type?: 'purchase' | 'usage' | 'refund' | 'all';
    enabled?: boolean;
  }
) => {
  const params = new URLSearchParams();
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.type) params.append('type', options.type);

  return useQuery({
    queryKey: ['credits', 'history', userId, options],
    queryFn: () => apiClient.get(`/users/${userId}/credits/history?${params.toString()}`),
    enabled: options?.enabled ?? true,
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 2,
  });
};
