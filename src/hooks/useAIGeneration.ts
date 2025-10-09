import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nehtwClient } from '@/lib/nehtw-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/components/auth/AuthProvider'
import { useToastHelpers } from '@/components/ui/Toast'
import { AIGenerationRequest, AIGenerationJob } from '@/types/nehtw'

// Create AI generation job
export const useCreateAIJob = () => {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToastHelpers()
  
  return useMutation<string, Error, string>({
    mutationFn: (prompt) => nehtwClient.createAIJob(prompt),
    onSuccess: (jobId) => {
      // Invalidate AI jobs list
      queryClient.invalidateQueries({ queryKey: queryKeys.aiJobs() })
      
      // Pre-populate the result cache with initial state
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
      
      success('AI Job Created', `Your AI generation job ${jobId} has started.`)
    },
    onError: (error) => {
      showError('AI Job Failed', error.message || 'Failed to create AI job')
    },
  })
}

// Poll AI job results with real-time updates
export const useAIResult = (jobId: string, enabled = true) => {
  return useQuery<AIGenerationJob, Error>({
    queryKey: queryKeys.aiResult(jobId),
    queryFn: () => nehtwClient.getAIResult(jobId),
    enabled: enabled && !!jobId,
    refetchInterval: (data) => {
      // Poll every 3 seconds if processing (respects rate limit)
      return data?.status === 'processing' ? 3000 : false
    },
    staleTime: 0, // Always refetch for live status
    gcTime: 10 * 60 * 1000, // Keep completed jobs for 10 minutes
    retry: (failureCount, error) => {
      // Stop retrying if job failed permanently
      if (error?.message?.includes('failed')) return false
      return failureCount < 3
    },
  })
}

// Perform AI actions (vary/upscale)
export const useAIAction = () => {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToastHelpers()
  
  return useMutation<string, Error, { jobId: string; action: 'vary' | 'upscale'; index: number; varyType?: 'subtle' | 'strong' }>({
    mutationFn: ({ jobId, action, index, varyType }) => 
      nehtwClient.performAIAction(jobId, action, index, varyType),
    onSuccess: (newJobId, variables) => {
      // Invalidate jobs list
      queryClient.invalidateQueries({ queryKey: queryKeys.aiJobs() })
      
      success('AI Action Started', `${variables.action} job ${newJobId} has been created.`)
    },
    onError: (error) => {
      showError('AI Action Failed', error.message || 'Failed to perform AI action')
    },
  })
}