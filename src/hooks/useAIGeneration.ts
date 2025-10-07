import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useCallback, useMemo, useEffect, useRef } from 'react';

// Type definitions for AI generation
export interface AIGenerationJob {
  id: string;
  userId: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  message?: string;
  estimatedCompletionTime?: string;
  actualCompletionTime?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  metadata?: {
    model?: string;
    style?: string;
    quality?: 'low' | 'medium' | 'high' | 'ultra';
    dimensions?: {
      width: number;
      height: number;
    };
    aspectRatio?: string;
    seed?: number;
    steps?: number;
    guidance?: number;
    negativePrompt?: string;
    samplingMethod?: string;
    scheduler?: string;
  };
  result?: {
    imageUrl?: string;
    thumbnailUrl?: string;
    previewUrl?: string;
    downloadUrl?: string;
    fileSize?: number;
    dimensions?: {
      width: number;
      height: number;
    };
    format?: string;
    checksum?: string;
    metadata?: {
      prompt?: string;
      negativePrompt?: string;
      model?: string;
      seed?: number;
      steps?: number;
      guidance?: number;
      samplingMethod?: string;
      scheduler?: string;
      generatedAt?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface AIGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  model?: string;
  style?: string;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  dimensions?: {
    width: number;
    height: number;
  };
  aspectRatio?: string;
  seed?: number;
  steps?: number;
  guidance?: number;
  samplingMethod?: string;
  scheduler?: string;
  batchSize?: number;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  customFields?: Record<string, string>;
}

export interface AIGenerationResponse {
  success: boolean;
  data: AIGenerationJob;
  message?: string;
}

export interface AIGenerationJobsResponse {
  success: boolean;
  data: AIGenerationJob[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  message?: string;
}

export interface AIGenerationError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
  retryable?: boolean;
}

export interface AIGenerationOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: boolean | number;
  retryDelay?: number | ((attemptIndex: number) => number);
  refetchInterval?: number | false;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  onSuccess?: (data: AIGenerationJob) => void;
  onError?: (error: AIGenerationError) => void;
  onSettled?: (data: AIGenerationJob | undefined, error: AIGenerationError | null) => void;
}

export interface AIGenerationMutationOptions {
  onSuccess?: (data: AIGenerationJob) => void;
  onError?: (error: AIGenerationError) => void;
  onSettled?: (data: AIGenerationJob | undefined, error: AIGenerationError | null) => void;
  retry?: boolean | number;
  retryDelay?: number | ((attemptIndex: number) => number);
  timeout?: number;
}

export interface AIGenerationPollingOptions extends AIGenerationOptions {
  maxPollingTime?: number; // Maximum time to poll in milliseconds
  stopOnError?: boolean; // Stop polling on error
  stopOnCompletion?: boolean; // Stop polling when completed
  onStatusChange?: (job: AIGenerationJob) => void;
  onCompletion?: (job: AIGenerationJob) => void;
  onProgress?: (progress: number) => void;
}

// API client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.stockmedia.com/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
  },
});

// API function to create AI generation job
export const createAIGenerationJob = async (request: AIGenerationRequest): Promise<AIGenerationJob> => {
  try {
    // Validate required fields
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    const payload = {
      prompt: request.prompt.trim(),
      negative_prompt: request.negativePrompt,
      model: request.model || 'stable-diffusion-xl',
      style: request.style,
      quality: request.quality || 'high',
      dimensions: request.dimensions,
      aspect_ratio: request.aspectRatio,
      seed: request.seed,
      steps: request.steps || 20,
      guidance: request.guidance || 7.5,
      sampling_method: request.samplingMethod || 'DPM++ 2M Karras',
      scheduler: request.scheduler || 'Karras',
      batch_size: request.batchSize || 1,
      priority: request.priority || 'normal',
      custom_fields: request.customFields,
    };

    // Remove undefined values
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    const response = await apiClient.post<AIGenerationResponse>('/ai/generate', cleanPayload);
    
    if (!response.data) {
      throw new Error('No data received from API');
    }
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create AI generation job');
    }
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<AIGenerationError>;
      const errorData = axiosError.response?.data;
      
      if (errorData) {
        const aiGenerationError: AIGenerationError = {
          code: errorData.code || 'AI_GENERATION_CREATION_FAILED',
          message: errorData.message || 'Failed to create AI generation job',
          details: errorData.details,
          statusCode: axiosError.response?.status,
          retryable: axiosError.response?.status ? axiosError.response.status >= 500 : false,
        };
        throw aiGenerationError;
      }
      
      // Handle network errors
      if (!axiosError.response) {
        const networkError: AIGenerationError = {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your internet connection.',
          statusCode: 0,
          retryable: true,
        };
        throw networkError;
      }
      
      // Handle HTTP status errors
      const statusError: AIGenerationError = {
        code: `HTTP_${axiosError.response.status}`,
        message: axiosError.message || 'Request failed',
        statusCode: axiosError.response.status,
        retryable: axiosError.response.status >= 500,
      };
      throw statusError;
    }
    
    // Handle validation errors
    if (error instanceof Error && error.message.includes('required')) {
      const validationError: AIGenerationError = {
        code: 'VALIDATION_ERROR',
        message: error.message,
        retryable: false,
      };
      throw validationError;
    }
    
    // Handle unknown errors
    const unknownError: AIGenerationError = {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      retryable: false,
    };
    throw unknownError;
  }
};

// API function to fetch AI generation job status
export const fetchAIGenerationJob = async (jobId: string): Promise<AIGenerationJob> => {
  try {
    if (!jobId || jobId.trim().length === 0) {
      throw new Error('Job ID is required');
    }

    const response = await apiClient.get<AIGenerationResponse>(`/ai/generate/${jobId}`);
    
    if (!response.data) {
      throw new Error('No data received from API');
    }
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch AI generation job');
    }
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<AIGenerationError>;
      const errorData = axiosError.response?.data;
      
      if (errorData) {
        const aiGenerationError: AIGenerationError = {
          code: errorData.code || 'AI_GENERATION_FETCH_FAILED',
          message: errorData.message || 'Failed to fetch AI generation job',
          details: errorData.details,
          statusCode: axiosError.response?.status,
          retryable: axiosError.response?.status ? axiosError.response.status >= 500 : false,
        };
        throw aiGenerationError;
      }
      
      // Handle network errors
      if (!axiosError.response) {
        const networkError: AIGenerationError = {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your internet connection.',
          statusCode: 0,
          retryable: true,
        };
        throw networkError;
      }
      
      // Handle HTTP status errors
      const statusError: AIGenerationError = {
        code: `HTTP_${axiosError.response.status}`,
        message: axiosError.message || 'Request failed',
        statusCode: axiosError.response.status,
        retryable: axiosError.response.status >= 500,
      };
      throw statusError;
    }
    
    // Handle unknown errors
    const unknownError: AIGenerationError = {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      retryable: false,
    };
    throw unknownError;
  }
};

// API function to fetch multiple AI generation jobs
export const fetchAIGenerationJobs = async (params: {
  userId?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'all';
  page?: number;
  pageSize?: number;
  sortBy?: 'created' | 'updated' | 'completed' | 'status';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}): Promise<AIGenerationJobsResponse> => {
  try {
    const queryParams = {
      user_id: params.userId,
      status: params.status || 'all',
      page: params.page || 1,
      page_size: params.pageSize || 20,
      sort_by: params.sortBy || 'created',
      sort_order: params.sortOrder || 'desc',
      search: params.search,
    };

    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== undefined)
    );

    const response = await apiClient.get<AIGenerationJobsResponse>('/ai/generate', {
      params: cleanParams,
    });
    
    if (!response.data) {
      throw new Error('No data received from API');
    }
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch AI generation jobs');
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<AIGenerationError>;
      const errorData = axiosError.response?.data;
      
      if (errorData) {
        const aiGenerationError: AIGenerationError = {
          code: errorData.code || 'AI_GENERATION_JOBS_FETCH_FAILED',
          message: errorData.message || 'Failed to fetch AI generation jobs',
          details: errorData.details,
          statusCode: axiosError.response?.status,
          retryable: axiosError.response?.status ? axiosError.response.status >= 500 : false,
        };
        throw aiGenerationError;
      }
      
      // Handle network errors
      if (!axiosError.response) {
        const networkError: AIGenerationError = {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your internet connection.',
          statusCode: 0,
          retryable: true,
        };
        throw networkError;
      }
      
      // Handle HTTP status errors
      const statusError: AIGenerationError = {
        code: `HTTP_${axiosError.response.status}`,
        message: axiosError.message || 'Request failed',
        statusCode: axiosError.response.status,
        retryable: axiosError.response.status >= 500,
      };
      throw statusError;
    }
    
    // Handle unknown errors
    const unknownError: AIGenerationError = {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      retryable: false,
    };
    throw unknownError;
  }
};

// API function to cancel AI generation job
export const cancelAIGenerationJob = async (jobId: string): Promise<AIGenerationJob> => {
  try {
    if (!jobId || jobId.trim().length === 0) {
      throw new Error('Job ID is required');
    }

    const response = await apiClient.post<AIGenerationResponse>(`/ai/generate/${jobId}/cancel`);
    
    if (!response.data) {
      throw new Error('No data received from API');
    }
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to cancel AI generation job');
    }
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<AIGenerationError>;
      const errorData = axiosError.response?.data;
      
      if (errorData) {
        const aiGenerationError: AIGenerationError = {
          code: errorData.code || 'AI_GENERATION_CANCEL_FAILED',
          message: errorData.message || 'Failed to cancel AI generation job',
          details: errorData.details,
          statusCode: axiosError.response?.status,
          retryable: axiosError.response?.status ? axiosError.response.status >= 500 : false,
        };
        throw aiGenerationError;
      }
      
      // Handle network errors
      if (!axiosError.response) {
        const networkError: AIGenerationError = {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your internet connection.',
          statusCode: 0,
          retryable: true,
        };
        throw networkError;
      }
      
      // Handle HTTP status errors
      const statusError: AIGenerationError = {
        code: `HTTP_${axiosError.response.status}`,
        message: axiosError.message || 'Request failed',
        statusCode: axiosError.response.status,
        retryable: axiosError.response.status >= 500,
      };
      throw statusError;
    }
    
    // Handle unknown errors
    const unknownError: AIGenerationError = {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      retryable: false,
    };
    throw unknownError;
  }
};

// Main React Query hook for creating AI generation job
export function useCreateAIGenerationJob(
  options?: AIGenerationMutationOptions
): UseMutationResult<AIGenerationJob, AIGenerationError, AIGenerationRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAIGenerationJob,
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['aiGenerationJobs'] });
      queryClient.invalidateQueries({ queryKey: ['aiGenerationJob', data.id] });
      
      // Prefetch the created job
      queryClient.prefetchQuery({
        queryKey: ['aiGenerationJob', data.id],
        queryFn: () => fetchAIGenerationJob(data.id),
        staleTime: 1000 * 30, // 30 seconds
      });
      
      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      console.error('AI generation job creation failed:', error);
      options?.onError?.(error);
    },
    onSettled: (data, error, variables, context) => {
      options?.onSettled?.(data, error);
    },
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      
      // Don't retry on non-retryable errors
      if (error.retryable === false) {
        return false;
      }
      
      // Retry up to 3 times for server errors
      return options?.retry ? (typeof options.retry === 'number' ? failureCount < options.retry : failureCount < 3) : false;
    },
    retryDelay: options?.retryDelay || ((attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)),
    mutationKey: ['createAIGenerationJob'],
  });
}

// Hook for fetching AI generation job status
export function useAIGenerationJob(
  jobId: string,
  options?: AIGenerationOptions
): UseQueryResult<AIGenerationJob, AIGenerationError> {
  const {
    enabled = true,
    staleTime = 1000 * 30, // 30 seconds
    cacheTime = 1000 * 60 * 5, // 5 minutes
    retry = true,
    retryDelay = (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchInterval = false,
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    onSuccess,
    onError,
    onSettled,
  } = options || {};

  return useQuery({
    queryKey: ['aiGenerationJob', jobId],
    queryFn: () => fetchAIGenerationJob(jobId),
    enabled: enabled && !!jobId && jobId.trim().length > 0,
    staleTime,
    cacheTime,
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      
      // Don't retry on non-retryable errors
      if (error.retryable === false) {
        return false;
      }
      
      // Retry up to 3 times for server errors
      return retry ? (typeof retry === 'number' ? failureCount < retry : failureCount < 3) : false;
    },
    retryDelay,
    refetchInterval,
    refetchOnWindowFocus,
    refetchOnMount,
    onSuccess,
    onError,
    onSettled,
  });
}

// Hook for AI generation job with polling until completion
export function useAIGenerationJobPolling(
  jobId: string,
  options?: AIGenerationPollingOptions
): UseQueryResult<AIGenerationJob, AIGenerationError> & {
  isPolling: boolean;
  pollingTime: number;
  stopPolling: () => void;
  startPolling: () => void;
  isComplete: boolean;
  isError: boolean;
  progress: number;
  estimatedTimeRemaining: number | null;
} {
  const {
    enabled = true,
    staleTime = 1000 * 30, // 30 seconds
    cacheTime = 1000 * 60 * 5, // 5 minutes
    retry = true,
    retryDelay = (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchInterval = 2000, // Poll every 2 seconds
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    maxPollingTime = 1000 * 60 * 30, // 30 minutes max
    stopOnError = true,
    stopOnCompletion = true,
    onSuccess,
    onError,
    onSettled,
    onStatusChange,
    onCompletion,
    onProgress,
  } = options || {};

  const pollingStartTime = useRef<number>(Date.now());
  const pollingTime = useRef<number>(0);
  const isPollingRef = useRef<boolean>(false);
  const previousStatus = useRef<string | null>(null);
  const previousProgress = useRef<number>(0);

  // Update polling time
  useEffect(() => {
    if (isPollingRef.current) {
      const interval = setInterval(() => {
        pollingTime.current = Date.now() - pollingStartTime.current;
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPollingRef.current]);

  // Handle status changes
  const handleStatusChange = useCallback((job: AIGenerationJob) => {
    if (previousStatus.current !== job.status) {
      onStatusChange?.(job);
      previousStatus.current = job.status;
    }
  }, [onStatusChange]);

  // Handle progress changes
  const handleProgressChange = useCallback((progress: number) => {
    if (previousProgress.current !== progress) {
      onProgress?.(progress);
      previousProgress.current = progress;
    }
  }, [onProgress]);

  // Handle completion
  const handleCompletion = useCallback((job: AIGenerationJob) => {
    if (job.status === 'completed') {
      onCompletion?.(job);
    }
  }, [onCompletion]);

  // Handle errors
  const handleError = useCallback((error: AIGenerationError) => {
    onError?.(error);
  }, [onError]);

  // Determine if polling should continue
  const shouldContinuePolling = useCallback((data: AIGenerationJob | undefined, error: AIGenerationError | null) => {
    // Stop if max polling time reached
    if (pollingTime.current >= maxPollingTime) {
      return false;
    }

    // Stop on error if configured
    if (error && stopOnError) {
      return false;
    }

    // Stop on completion if configured
    if (data && stopOnCompletion && (data.status === 'completed' || data.status === 'failed' || data.status === 'cancelled')) {
      return false;
    }

    return true;
  }, [maxPollingTime, stopOnError, stopOnCompletion]);

  // Main query
  const queryResult = useQuery({
    queryKey: ['aiGenerationJob', jobId],
    queryFn: () => fetchAIGenerationJob(jobId),
    enabled: enabled && !!jobId && jobId.trim().length > 0,
    staleTime,
    cacheTime,
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      
      // Don't retry on non-retryable errors
      if (error.retryable === false) {
        return false;
      }
      
      // Retry up to 3 times for server errors
      return retry ? (typeof retry === 'number' ? failureCount < retry : failureCount < 3) : false;
    },
    retryDelay,
    refetchInterval: (data, error) => {
      if (!shouldContinuePolling(data, error)) {
        isPollingRef.current = false;
        return false;
      }
      isPollingRef.current = true;
      return refetchInterval;
    },
    refetchOnWindowFocus,
    refetchOnMount,
    onSuccess: (data) => {
      handleStatusChange(data);
      handleProgressChange(data.progress);
      handleCompletion(data);
      onSuccess?.(data);
    },
    onError: (error) => {
      handleError(error);
      onError?.(error);
    },
    onSettled: (data, error) => {
      onSettled?.(data, error);
    },
  });

  // Update polling state
  useEffect(() => {
    if (queryResult.isFetching && !queryResult.isError) {
      isPollingRef.current = true;
      pollingStartTime.current = Date.now();
    } else if (queryResult.isError || queryResult.isSuccess) {
      isPollingRef.current = false;
    }
  }, [queryResult.isFetching, queryResult.isError, queryResult.isSuccess]);

  // Manual control functions
  const stopPolling = useCallback(() => {
    isPollingRef.current = false;
  }, []);

  const startPolling = useCallback(() => {
    if (enabled && jobId) {
      isPollingRef.current = true;
      pollingStartTime.current = Date.now();
      queryResult.refetch();
    }
  }, [enabled, jobId, queryResult]);

  // Computed values
  const isComplete = useMemo(() => {
    return queryResult.data?.status === 'completed';
  }, [queryResult.data?.status]);

  const isError = useMemo(() => {
    return queryResult.data?.status === 'failed' || queryResult.data?.status === 'cancelled';
  }, [queryResult.data?.status]);

  const progress = useMemo(() => {
    return queryResult.data?.progress || 0;
  }, [queryResult.data?.progress]);

  const estimatedTimeRemaining = useMemo(() => {
    if (!queryResult.data?.estimatedCompletionTime || isComplete) {
      return null;
    }
    
    const estimatedTime = new Date(queryResult.data.estimatedCompletionTime).getTime();
    const now = Date.now();
    return Math.max(0, estimatedTime - now);
  }, [queryResult.data?.estimatedCompletionTime, isComplete]);

  return {
    ...queryResult,
    isPolling: isPollingRef.current,
    pollingTime: pollingTime.current,
    stopPolling,
    startPolling,
    isComplete,
    isError,
    progress,
    estimatedTimeRemaining,
  };
}

// Hook for fetching multiple AI generation jobs
export function useAIGenerationJobs(
  params: {
    userId?: string;
    status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'all';
    page?: number;
    pageSize?: number;
    sortBy?: 'created' | 'updated' | 'completed' | 'status';
    sortOrder?: 'asc' | 'desc';
    search?: string;
  },
  options?: AIGenerationOptions
): UseQueryResult<AIGenerationJobsResponse, AIGenerationError> {
  const {
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minutes
    cacheTime = 1000 * 60 * 30, // 30 minutes
    retry = true,
    retryDelay = (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchInterval = false,
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    onSuccess,
    onError,
    onSettled,
  } = options || {};

  return useQuery({
    queryKey: ['aiGenerationJobs', params],
    queryFn: () => fetchAIGenerationJobs(params),
    enabled,
    staleTime,
    cacheTime,
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      
      // Don't retry on non-retryable errors
      if (error.retryable === false) {
        return false;
      }
      
      // Retry up to 3 times for server errors
      return retry ? (typeof retry === 'number' ? failureCount < retry : failureCount < 3) : false;
    },
    retryDelay,
    refetchInterval,
    refetchOnWindowFocus,
    refetchOnMount,
    onSuccess,
    onError,
    onSettled,
  });
}

// Hook for cancelling AI generation job
export function useCancelAIGenerationJob(
  options?: AIGenerationMutationOptions
): UseMutationResult<AIGenerationJob, AIGenerationError, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelAIGenerationJob,
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['aiGenerationJobs'] });
      queryClient.invalidateQueries({ queryKey: ['aiGenerationJob', variables] });
      
      // Update the job in cache
      queryClient.setQueryData(['aiGenerationJob', variables], data);
      
      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      console.error('AI generation job cancellation failed:', error);
      options?.onError?.(error);
    },
    onSettled: (data, error, variables, context) => {
      options?.onSettled?.(data, error);
    },
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      
      // Don't retry on non-retryable errors
      if (error.retryable === false) {
        return false;
      }
      
      // Retry up to 3 times for server errors
      return options?.retry ? (typeof options.retry === 'number' ? failureCount < options.retry : failureCount < 3) : false;
    },
    retryDelay: options?.retryDelay || ((attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)),
    mutationKey: ['cancelAIGenerationJob'],
  });
}

// Hook for AI generation job with progress tracking
export function useAIGenerationJobWithProgress(
  jobId: string,
  options?: AIGenerationPollingOptions
): UseQueryResult<AIGenerationJob, AIGenerationError> & {
  isPolling: boolean;
  pollingTime: number;
  stopPolling: () => void;
  startPolling: () => void;
  progress: number;
  estimatedTimeRemaining: number | null;
  isComplete: boolean;
  isError: boolean;
  isProcessing: boolean;
  isPending: boolean;
  isFailed: boolean;
  isCancelled: boolean;
} {
  const queryResult = useAIGenerationJobPolling(jobId, options);
  
  const isProcessing = useMemo(() => {
    return queryResult.data?.status === 'processing';
  }, [queryResult.data?.status]);

  const isPending = useMemo(() => {
    return queryResult.data?.status === 'pending';
  }, [queryResult.data?.status]);

  const isFailed = useMemo(() => {
    return queryResult.data?.status === 'failed';
  }, [queryResult.data?.status]);

  const isCancelled = useMemo(() => {
    return queryResult.data?.status === 'cancelled';
  }, [queryResult.data?.status]);

  return {
    ...queryResult,
    isProcessing,
    isPending,
    isFailed,
    isCancelled,
  };
}

// Export types for external use
export type {
  AIGenerationJob,
  AIGenerationRequest,
  AIGenerationResponse,
  AIGenerationJobsResponse,
  AIGenerationError,
  AIGenerationOptions,
  AIGenerationMutationOptions,
  AIGenerationPollingOptions,
};