import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nehtwClient } from '@/lib/nehtw-client-new'

export const useCreateAIJob = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (prompt: string) => nehtwClient.createAIJob(prompt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiJobs'] })
    },
  })
}

export const useAIResult = (jobId: string, enabled = true) => {
  return useQuery({
    queryKey: ['aiResult', jobId],
    queryFn: () => nehtwClient.getAIResult(jobId),
    enabled: enabled && !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === 'processing' ? 2000 : false; // Poll every 2s if processing
    },
    staleTime: 0, // Always refetch
  })
}

export const useAIAction = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      jobId, 
      action, 
      index, 
      varyType 
    }: { 
      jobId: string; 
      action: 'vary' | 'upscale'; 
      index: number; 
      varyType?: 'subtle' | 'strong' 
    }) => nehtwClient.performAIAction(jobId, action, index, varyType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiJobs'] })
    },
  })
}