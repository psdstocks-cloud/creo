import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nehtwClient } from '@/lib/nehtw-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/components/auth/AuthProvider'
import { useToastHelpers } from '@/components/ui/Toast'
import { AIGenerationRequest, AIGenerationJob } from '@/types/nehtw'
import { useState } from 'react'

// Enhanced AI Job Creation with settings support
export const useCreateAIJob = () => {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToastHelpers()
  
  return useMutation<string, Error, { prompt: string; settings?: { style?: string; quality?: string; size?: string } }>({
    mutationFn: ({ prompt }) => nehtwClient.createAIJob(prompt),
    onSuccess: (jobId, variables) => {
      // Invalidate AI jobs list
      queryClient.invalidateQueries({ queryKey: queryKeys.aiJobs() })
      
      // Pre-populate the result cache with initial state
      queryClient.setQueryData(queryKeys.aiResult(jobId), {
        __id: jobId,
        prompt: variables.prompt,
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
      
      success('AI Generation Started! 🎨', `Job ${jobId} is being processed. You'll be notified when ready.`)
    },
    onError: (error) => {
      showError('Generation Failed', error.message || 'Failed to start AI generation')
    },
  })
}

// Enhanced AI Job Result with comprehensive polling
export const useAIResult = (jobId: string, enabled = true) => {
  const [pollCount, setPollCount] = useState(0)
  const { success } = useToastHelpers()
  
  return useQuery<AIGenerationJob, Error>({
    queryKey: queryKeys.aiResult(jobId),
    queryFn: async () => {
      setPollCount(prev => prev + 1)
      return nehtwClient.getAIResult(jobId)
    },
    enabled: enabled && !!jobId,
    refetchInterval: (query) => {
      // Intelligent polling strategy
      if (query.state.data?.status === 'processing') {
        // Start with 3s, increase gradually to prevent excessive polling
        const interval = Math.min(3000 + (pollCount * 500), 10000)
        return interval
      }
      return false // Stop polling when complete
    },
    staleTime: 0, // Always refetch for live status
    gcTime: 30 * 60 * 1000, // Keep completed jobs for 30 minutes
    retry: (failureCount, error) => {
      // Stop retrying if job failed permanently
      if (error?.message?.includes('failed') || error?.message?.includes('error')) {
        return false
      }
      return failureCount < 3
    },
    onSuccess: (data) => {
      // Notify when job completes
      if (data?.status === 'completed' && data.files?.length > 0) {
        success('AI Generation Complete! ✨', `Your images are ready for download.`)
      }
    }
  })
}

// Enhanced AI Actions with better UX
export const useAIAction = () => {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToastHelpers()
  
  return useMutation<string, Error, { jobId: string; action: 'vary' | 'upscale'; index: number; varyType?: 'subtle' | 'strong' }>({
    mutationFn: ({ jobId, action, index, varyType }) => 
      nehtwClient.performAIAction(jobId, action, index, varyType),
    onSuccess: (newJobId, variables) => {
      // Invalidate jobs list
      queryClient.invalidateQueries({ queryKey: queryKeys.aiJobs() })
      
      // Pre-populate new job data
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
      
      success(`${variables.action.charAt(0).toUpperCase() + variables.action.slice(1)} Started`, `New job ${newJobId} created from image ${variables.index + 1}`)
    },
    onError: (error) => {
      showError('AI Action Failed', error.message || 'Failed to perform AI action')
    },
  })
}

// AI Job History with local storage persistence
export const useAIJobHistory = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: queryKeys.aiJobs(),
    queryFn: async () => {
      if (!user) return []
      
      // Get from localStorage for persistence across sessions
      const storedJobs = localStorage.getItem(`ai_jobs_${user.id}`)
      return storedJobs ? JSON.parse(storedJobs) : []
    },
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Cost estimation hook
export const useAICostEstimate = () => {
  return useMutation({
    mutationFn: async ({ prompt, settings }: {
      prompt: string
      settings?: { style?: string; quality?: string; size?: string }
    }) => {
      // This would call NEHTW API to estimate cost
      // For now, return a mock estimate
      const baseCost = 0.1 // Base cost per generation
      const qualityMultiplier = settings?.quality === 'high' ? 1.5 : 1
      const promptComplexity = Math.min(prompt.length / 50, 2) // Complexity based on prompt length
      
      return {
        estimatedCost: baseCost * qualityMultiplier * promptComplexity,
        estimatedTime: '30-60 seconds',
        credits: Math.ceil(baseCost * qualityMultiplier * promptComplexity * 10)
      }
    }
  })
}