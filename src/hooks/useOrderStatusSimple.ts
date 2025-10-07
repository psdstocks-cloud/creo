import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/api-client';

export function useOrderStatus(taskId: string) {
  return useQuery({
    queryKey: ['orderStatus', taskId],
    queryFn: () =>
      apiClient.get(`/order/${taskId}/status`).then((res) => (res as { data: unknown }).data),
    enabled: !!taskId,
    refetchInterval: 2000
  });
}
