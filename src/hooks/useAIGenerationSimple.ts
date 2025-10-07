import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../lib/api-client';

export function useAIGenerate() {
  return useMutation({
    mutationFn: (prompt: string) =>
      apiClient.post('/aigenerate', { prompt }).then((res) => (res as { data: unknown }).data)
  });
}

export function useAIGenerationStatus(jobId: string) {
  return useQuery({
    queryKey: ['aiGenerationStatus', jobId],
    queryFn: () =>
      apiClient.get(`/aigeneration/${jobId}`).then((res) => (res as { data: unknown }).data),
    enabled: !!jobId,
    refetchInterval: 2000
  });
}
