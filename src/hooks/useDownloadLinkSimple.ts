import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/api-client';

export function useDownloadLink(orderId: string, taskId: string, options?: { enabled: boolean }) {
  return useQuery({
    queryKey: ['downloadLink', orderId, taskId],
    queryFn: () => apiClient.get(`/order/${taskId}/download`).then((res) => (res as { data: unknown }).data),
    ...options
  });
}
