import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nehtwClient } from '@/lib/nehtw-api-client'
import { queryKeys } from '@/lib/query-client'

export const useCreateAIJob = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (prompt: string) => nehtwClient.createAIJob(prompt),
    onSuccess: (data) => {
      const jobId = data.job_id
      // Invalidate jobs list
      queryClient.invalidateQueries({ queryKey: queryKeys.aiJobs() })
      
      // Pre-populate the AI result cache with initial state
      queryClient.setQueryData(queryKeys.aiResult(jobId), {
        __id: jobId,
        prompt: '',
        type: 'imagine',
        cost: 0,
        error_message: null,
        parent_nh_job_id: null,
        status: 'processing',
        percentage_complete: 0,
        strong: null,
        index: null,
        created_at: Date.now(),
        updated_at: Date.now(),
        updated_at_human: 'just now',
        files: undefined,
      })
    },
    onError: (error) => {
      console.error('Failed to create AI job:', error)
    },
  })
}

export const useAIResult = (jobId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.aiResult(jobId),
    queryFn: () => nehtwClient.getAIResult(jobId),
    enabled: enabled && !!jobId,
    refetchInterval: (query) => {
      // Poll every 3 seconds if processing (respecting 2s rate limit + buffer)
      const data = query.state.data;
      return data?.status === 'processing' ? 3000 : false
    },
    staleTime: 0, // Always refetch while processing
    gcTime: 10 * 60 * 1000, // Keep completed jobs in cache for 10 minutes
    retry: (failureCount, error) => {
      // Stop retrying if job failed permanently
      if (error.message?.includes('failed')) return false
      return failureCount < 3
    },
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
    }) => nehtwClient.performAIAction({ jobId, action, index, varyType }),
    onSuccess: (data, variables) => {
      const newJobId = data.job_id
      // Invalidate jobs list
      queryClient.invalidateQueries({ queryKey: queryKeys.aiJobs() })
      
      // Pre-populate the new job result cache
      queryClient.setQueryData(queryKeys.aiResult(newJobId), {
        __id: newJobId,
        prompt: `${variables.action} of job ${variables.jobId}`,
        type: variables.action,
        cost: 0,
        error_message: null,
        parent_nh_job_id: variables.jobId,
        status: 'processing',
        percentage_complete: 0,
        strong: variables.varyType === 'strong',
        index: variables.index,
        created_at: Date.now(),
        updated_at: Date.now(),
        updated_at_human: 'just now',
        files: undefined,
      })
    },
    onError: (error) => {
      console.error('Failed to perform AI action:', error)
    },
  })
}

// AI Jobs History Hook
export const useAIJobsHistory = () => {
  return useQuery({
    queryKey: queryKeys.aiJobs(),
    queryFn: async () => {
      // This would need to be implemented on your backend
      // For now, return empty array or use localStorage to track jobs
      const storedJobs = localStorage.getItem('ai_jobs_history')
      return storedJobs ? JSON.parse(storedJobs) : []
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}