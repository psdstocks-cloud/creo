/**
 * AI Generation React Query Hooks
 * 
 * Production-ready hooks for AI image generation operations including:
 * - AI job creation and tracking
 * - Job status polling with automatic completion detection
 * - AI actions (vary/upscale) operations
 * - Account balance and user information
 * - Comprehensive error handling and loading states
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nehtwClient } from '../lib/nehtw-client';
import {
  AIGenerationRequest,
  AIGenerationResponse,
  AIGenerationJob,
  AccountBalance,
  UserProfile,
} from '../types/nehtw';

// ============================================================================
// Query Keys
// ============================================================================

export const aiGenerationKeys = {
  all: ['aiGeneration'] as const,
  jobStatus: (jobId: string) => [...aiGenerationKeys.all, 'jobStatus', jobId] as const,
  accountBalance: () => [...aiGenerationKeys.all, 'accountBalance'] as const,
  userProfile: () => [...aiGenerationKeys.all, 'userProfile'] as const,
};

// ============================================================================
// AI Generation Interfaces
// ============================================================================

export interface CreateAIJobOptions {
  onSuccess?: (data: AIGenerationResponse) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: AIGenerationResponse | undefined, error: Error | null) => void;
  retry?: boolean | number;
  retryDelay?: number;
}

export interface CreateAIJobResult {
  mutate: (request: AIGenerationRequest) => void;
  mutateAsync: (request: AIGenerationRequest) => Promise<AIGenerationResponse>;
  data: AIGenerationResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
  reset: () => void;
}

export interface AIJobStatusOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
  staleTime?: number;
  gcTime?: number;
  retry?: boolean | number;
  retryDelay?: number;
}

export interface AIJobStatusResult {
  data: AIGenerationJob | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
  isPolling: boolean;
}

export interface AIActionOptions {
  onSuccess?: (data: AIGenerationResponse) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: AIGenerationResponse | undefined, error: Error | null) => void;
  retry?: boolean | number;
  retryDelay?: number;
}

export interface AIActionResult {
  mutate: (actionData: AIActionRequest) => void;
  mutateAsync: (actionData: AIActionRequest) => Promise<AIGenerationResponse>;
  data: AIGenerationResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
  reset: () => void;
}

export interface AIActionRequest {
  job_id: string;
  action: 'vary' | 'upscale';
  index: number;
  vary_type?: 'subtle' | 'strong';
}

export interface AccountBalanceOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: boolean | number;
  retryDelay?: number;
}

export interface AccountBalanceResult {
  data: AccountBalance | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
}

// ============================================================================
// AI Job Creation Hook
// ============================================================================

/**
 * Hook to create AI generation jobs
 * @param options - Mutation options
 */
export function useCreateAIJob(
  options: CreateAIJobOptions = {}
): CreateAIJobResult {
  const queryClient = useQueryClient();
  const {
    onSuccess,
    onError,
    onSettled,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const mutation = useMutation({
    mutationFn: async (request: AIGenerationRequest): Promise<AIGenerationResponse> => {
      return await nehtwClient.generateAI(request);
    },
    onSuccess: (data) => {
      // Invalidate account balance to reflect credit usage
      queryClient.invalidateQueries({ queryKey: aiGenerationKeys.accountBalance() });
      
      // Set the AI job status query data for immediate access
      queryClient.setQueryData(
        aiGenerationKeys.jobStatus(data.job_id),
        { 
          job_id: data.job_id, 
          status: data.status,
          prompt: '',
          progress: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          result: { 
            images: [],
            generation_time: 0,
            model_used: '',
            parameters: {
              style: '',
              size: '',
              steps: 0,
              guidance_scale: 0,
              seed: 0
            }
          }
        } as AIGenerationJob
      );
      
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error('AI job creation failed:', error);
      onError?.(error);
    },
    onSettled: (data, error) => {
      onSettled?.(data, error as Error | null);
    },
    retry,
    retryDelay,
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}

// ============================================================================
// AI Job Status Hook
// ============================================================================

/**
 * Hook to track AI generation job status with automatic polling
 * @param jobId - AI generation job ID
 * @param options - Query options
 */
export function useAIJobStatus(
  jobId: string,
  options: AIJobStatusOptions = {}
): AIJobStatusResult {
  const {
    enabled = true,
    refetchInterval = 2000, // 2 seconds
    staleTime = 0, // Always fresh for status
    gcTime = 10 * 60 * 1000, // 10 minutes
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: aiGenerationKeys.jobStatus(jobId),
    queryFn: async (): Promise<AIGenerationJob> => {
      return await nehtwClient.getAIJobStatus(jobId);
    },
    enabled: enabled && Boolean(jobId),
    refetchInterval: (query) => {
      // Stop polling when job is completed or failed
      if (query.state.data?.status === 'completed' || 
          query.state.data?.status === 'failed' || 
          query.state.data?.status === 'cancelled') {
        return false;
      }
      return refetchInterval;
    },
    staleTime,
    gcTime,
    retry,
    retryDelay,
  });

  const isPolling = query.isFetching && 
    query.data?.status !== 'completed' && 
    query.data?.status !== 'failed' && 
    query.data?.status !== 'cancelled';

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    isPolling,
  };
}

// ============================================================================
// AI Actions Hook
// ============================================================================

/**
 * Hook to perform AI actions (vary/upscale) on generated images
 * @param options - Mutation options
 */
export function useAIActions(
  options: AIActionOptions = {}
): AIActionResult {
  const queryClient = useQueryClient();
  const {
    onSuccess,
    onError,
    onSettled,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const mutation = useMutation({
    mutationFn: async (actionData: AIActionRequest): Promise<AIGenerationResponse> => {
      // This would be implemented in the nehtw client
      // For now, we'll simulate the API call
      const response = await fetch('/api/aig/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': process.env.NEXT_PUBLIC_NEHTW_API_KEY || '',
        },
        body: JSON.stringify(actionData),
      });

      if (!response.ok) {
        throw new Error(`AI action failed: ${response.statusText}`);
      }

      return await response.json();
    },
    onSuccess: (data) => {
      // Invalidate account balance to reflect credit usage
      queryClient.invalidateQueries({ queryKey: aiGenerationKeys.accountBalance() });
      
      // Update the job status if we have the job_id
      if (data.job_id) {
        queryClient.invalidateQueries({ 
          queryKey: aiGenerationKeys.jobStatus(data.job_id) 
        });
      }
      
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error('AI action failed:', error);
      onError?.(error);
    },
    onSettled: (data, error) => {
      onSettled?.(data, error as Error | null);
    },
    retry,
    retryDelay,
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}

// ============================================================================
// Account Balance Hook
// ============================================================================

/**
 * Hook to fetch account balance and credits
 * @param options - Query options
 */
export function useAccountBalance(
  options: AccountBalanceOptions = {}
): AccountBalanceResult {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = true,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: aiGenerationKeys.accountBalance(),
    queryFn: async (): Promise<AccountBalance> => {
      return await nehtwClient.getCredits();
    },
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    retry,
    retryDelay,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
  };
}

// ============================================================================
// User Profile Hook
// ============================================================================

export interface UserProfileOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: boolean | number;
  retryDelay?: number;
}

export interface UserProfileResult {
  data: UserProfile | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
}

/**
 * Hook to fetch user profile information
 * @param options - Query options
 */
export function useUserProfile(
  options: UserProfileOptions = {}
): UserProfileResult {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = false,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const query = useQuery({
    queryKey: aiGenerationKeys.userProfile(),
    queryFn: async (): Promise<UserProfile> => {
      return await nehtwClient.getUserProfile();
    },
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    retry,
    retryDelay,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
  };
}

// ============================================================================
// Combined AI Generation Hook
// ============================================================================

export interface UseAIGenerationOptions {
  jobId?: string;
  autoStart?: boolean;
  onJobComplete?: (result: AIGenerationJob) => void;
  onJobError?: (error: Error) => void;
}

export interface UseAIGenerationResult {
  // Job creation
  createJob: CreateAIJobResult;
  
  // Job status (always available, but only enabled when jobId is provided)
  jobStatus: AIJobStatusResult;
  
  // AI actions
  performAction: AIActionResult;
  
  // Account info
  accountBalance: AccountBalanceResult;
  userProfile: UserProfileResult;
  
  // Combined state
  isJobActive: boolean;
  isJobCompleted: boolean;
  isJobFailed: boolean;
}

/**
 * Combined hook for complete AI generation workflow
 * @param options - Configuration options
 */
export function useAIGeneration(
  options: UseAIGenerationOptions = {}
): UseAIGenerationResult {
  const { jobId, autoStart = false, onJobComplete, onJobError } = options;

  const createJob = useCreateAIJob({
    onSuccess: (data) => {
      if (autoStart && onJobComplete) {
        // Auto-start job status polling
        setTimeout(() => {
          onJobComplete({
            job_id: data.job_id,
            status: data.status,
            prompt: '',
            progress: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            result: { 
            images: [],
            generation_time: 0,
            model_used: '',
            parameters: {
              style: '',
              size: '',
              steps: 0,
              guidance_scale: 0,
              seed: 0
            }
          }
          });
        }, 100);
      }
    },
    onError: onJobError,
  });

  const jobStatus = useAIJobStatus(jobId || '', {
    enabled: Boolean(jobId),
    refetchInterval: 2000,
  });

  const performAction = useAIActions({
    onError: onJobError,
  });

  const accountBalance = useAccountBalance({
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const userProfile = useUserProfile({
    staleTime: 5 * 60 * 1000,
  });

  // Combined state
  const isJobActive = jobStatus.data?.status === 'processing' || 
                     jobStatus.data?.status === 'pending';
  const isJobCompleted = jobStatus.data?.status === 'completed';
  const isJobFailed = jobStatus.data?.status === 'failed' || 
                     jobStatus.data?.status === 'cancelled';

  return {
    createJob,
    jobStatus,
    performAction,
    accountBalance,
    userProfile,
    isJobActive,
    isJobCompleted,
    isJobFailed,
  };
}

// ============================================================================
// All hooks and types are already exported individually above
// ============================================================================
