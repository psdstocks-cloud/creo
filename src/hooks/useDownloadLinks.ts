import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useCallback, useMemo } from 'react';

// Type definitions for download links
export interface DownloadLink {
  id: string;
  orderId: string;
  taskId: string;
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  expiresAt: string;
  maxDownloads: number;
  currentDownloads: number;
  remainingDownloads: number;
  checksum?: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  metadata?: {
    originalFileName?: string;
    uploadedAt?: string;
    lastModified?: string;
    dimensions?: {
      width: number;
      height: number;
    };
    tags?: string[];
    category?: string;
    license?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DownloadLinkRequest {
  orderId: string;
  taskId: string;
  responseType?: 'original' | 'compressed' | 'thumbnail' | 'preview' | 'watermarked';
  format?: string;
  quality?: 'low' | 'medium' | 'high' | 'original';
  watermark?: boolean;
  watermarkText?: string;
  watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  customFields?: Record<string, string>;
}

export interface DownloadLinkResponse {
  success: boolean;
  data: DownloadLink;
  message?: string;
}

export interface DownloadLinksResponse {
  success: boolean;
  data: DownloadLink[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  message?: string;
}

export interface DownloadLinkError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
  retryable?: boolean;
}

export interface DownloadLinkOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: boolean | number;
  retryDelay?: number | ((attemptIndex: number) => number);
  refetchInterval?: number | false;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  onSuccess?: (data: DownloadLink) => void;
  onError?: (error: DownloadLinkError) => void;
  onSettled?: (data: DownloadLink | undefined, error: DownloadLinkError | null) => void;
}

export interface DownloadLinkMutationOptions {
  onSuccess?: (data: DownloadLink) => void;
  onError?: (error: DownloadLinkError) => void;
  onSettled?: (data: DownloadLink | undefined, error: DownloadLinkError | null) => void;
  retry?: boolean | number;
  retryDelay?: number | ((attemptIndex: number) => number);
  timeout?: number;
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

// API function to fetch download link
export const fetchDownloadLink = async (orderId: string, taskId: string): Promise<DownloadLink> => {
  try {
    if (!orderId || !taskId) {
      throw new Error('Order ID and Task ID are required');
    }

    const response = await apiClient.get<DownloadLinkResponse>(`/orders/${orderId}/downloads/${taskId}`);
    
    if (!response.data) {
      throw new Error('No data received from API');
    }
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch download link');
    }
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<DownloadLinkError>;
      const errorData = axiosError.response?.data;
      
      if (errorData) {
        const downloadLinkError: DownloadLinkError = {
          code: errorData.code || 'DOWNLOAD_LINK_FETCH_FAILED',
          message: errorData.message || 'Failed to fetch download link',
          details: errorData.details,
          statusCode: axiosError.response?.status,
          retryable: axiosError.response?.status ? axiosError.response.status >= 500 : false,
        };
        throw downloadLinkError;
      }
      
      // Handle network errors
      if (!axiosError.response) {
        const networkError: DownloadLinkError = {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your internet connection.',
          statusCode: 0,
          retryable: true,
        };
        throw networkError;
      }
      
      // Handle HTTP status errors
      const statusError: DownloadLinkError = {
        code: `HTTP_${axiosError.response.status}`,
        message: axiosError.message || 'Request failed',
        statusCode: axiosError.response.status,
        retryable: axiosError.response.status >= 500,
      };
      throw statusError;
    }
    
    // Handle unknown errors
    const unknownError: DownloadLinkError = {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      retryable: false,
    };
    throw unknownError;
  }
};

// API function to generate download link
export const generateDownloadLink = async (request: DownloadLinkRequest): Promise<DownloadLink> => {
  try {
    // Validate required fields
    if (!request.orderId || !request.taskId) {
      throw new Error('Order ID and Task ID are required');
    }

    const payload = {
      order_id: request.orderId,
      task_id: request.taskId,
      response_type: request.responseType || 'original',
      format: request.format,
      quality: request.quality || 'original',
      watermark: request.watermark || false,
      watermark_text: request.watermarkText,
      watermark_position: request.watermarkPosition || 'bottom-right',
      custom_fields: request.customFields,
    };

    // Remove undefined values
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    const response = await apiClient.post<DownloadLinkResponse>('/downloads/generate', cleanPayload);
    
    if (!response.data) {
      throw new Error('No data received from API');
    }
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to generate download link');
    }
    
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<DownloadLinkError>;
      const errorData = axiosError.response?.data;
      
      if (errorData) {
        const downloadLinkError: DownloadLinkError = {
          code: errorData.code || 'DOWNLOAD_LINK_GENERATION_FAILED',
          message: errorData.message || 'Failed to generate download link',
          details: errorData.details,
          statusCode: axiosError.response?.status,
          retryable: axiosError.response?.status ? axiosError.response.status >= 500 : false,
        };
        throw downloadLinkError;
      }
      
      // Handle network errors
      if (!axiosError.response) {
        const networkError: DownloadLinkError = {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your internet connection.',
          statusCode: 0,
          retryable: true,
        };
        throw networkError;
      }
      
      // Handle HTTP status errors
      const statusError: DownloadLinkError = {
        code: `HTTP_${axiosError.response.status}`,
        message: axiosError.message || 'Request failed',
        statusCode: axiosError.response.status,
        retryable: axiosError.response.status >= 500,
      };
      throw statusError;
    }
    
    // Handle validation errors
    if (error instanceof Error && error.message.includes('required')) {
      const validationError: DownloadLinkError = {
        code: 'VALIDATION_ERROR',
        message: error.message,
        retryable: false,
      };
      throw validationError;
    }
    
    // Handle unknown errors
    const unknownError: DownloadLinkError = {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      retryable: false,
    };
    throw unknownError;
  }
};

// API function to fetch multiple download links
export const fetchDownloadLinks = async (params: {
  orderId?: string;
  taskId?: string;
  page?: number;
  pageSize?: number;
  status?: 'active' | 'expired' | 'all';
  sortBy?: 'created' | 'expires' | 'downloads' | 'name';
  sortOrder?: 'asc' | 'desc';
}): Promise<DownloadLinksResponse> => {
  try {
    const queryParams = {
      order_id: params.orderId,
      task_id: params.taskId,
      page: params.page || 1,
      page_size: params.pageSize || 20,
      status: params.status || 'all',
      sort_by: params.sortBy || 'created',
      sort_order: params.sortOrder || 'desc',
    };

    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== undefined)
    );

    const response = await apiClient.get<DownloadLinksResponse>('/downloads', {
      params: cleanParams,
    });
    
    if (!response.data) {
      throw new Error('No data received from API');
    }
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch download links');
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<DownloadLinkError>;
      const errorData = axiosError.response?.data;
      
      if (errorData) {
        const downloadLinkError: DownloadLinkError = {
          code: errorData.code || 'DOWNLOAD_LINKS_FETCH_FAILED',
          message: errorData.message || 'Failed to fetch download links',
          details: errorData.details,
          statusCode: axiosError.response?.status,
          retryable: axiosError.response?.status ? axiosError.response.status >= 500 : false,
        };
        throw downloadLinkError;
      }
      
      // Handle network errors
      if (!axiosError.response) {
        const networkError: DownloadLinkError = {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your internet connection.',
          statusCode: 0,
          retryable: true,
        };
        throw networkError;
      }
      
      // Handle HTTP status errors
      const statusError: DownloadLinkError = {
        code: `HTTP_${axiosError.response.status}`,
        message: axiosError.message || 'Request failed',
        statusCode: axiosError.response.status,
        retryable: axiosError.response.status >= 500,
      };
      throw statusError;
    }
    
    // Handle unknown errors
    const unknownError: DownloadLinkError = {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      retryable: false,
    };
    throw unknownError;
  }
};

// Main React Query hook for fetching download link
export function useDownloadLink(
  orderId: string,
  taskId: string,
  options?: DownloadLinkOptions
): UseQueryResult<DownloadLink, DownloadLinkError> {
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
    queryKey: ['downloadLink', orderId, taskId],
    queryFn: () => fetchDownloadLink(orderId, taskId),
    enabled: enabled && !!orderId && !!taskId,
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

// Hook for generating download link
export function useGenerateDownloadLink(
  options?: DownloadLinkMutationOptions
): UseMutationResult<DownloadLink, DownloadLinkError, DownloadLinkRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateDownloadLink,
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['downloadLink'] });
      queryClient.invalidateQueries({ queryKey: ['downloadLinks'] });
      queryClient.invalidateQueries({ queryKey: ['orderStatus', variables.taskId] });
      
      // Prefetch the generated download link
      queryClient.prefetchQuery({
        queryKey: ['downloadLink', data.orderId, data.taskId],
        queryFn: () => fetchDownloadLink(data.orderId, data.taskId),
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
      
      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      console.error('Download link generation failed:', error);
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
    mutationKey: ['generateDownloadLink'],
  });
}

// Hook for fetching multiple download links
export function useDownloadLinks(
  params: {
    orderId?: string;
    taskId?: string;
    page?: number;
    pageSize?: number;
    status?: 'active' | 'expired' | 'all';
    sortBy?: 'created' | 'expires' | 'downloads' | 'name';
    sortOrder?: 'asc' | 'desc';
  },
  options?: DownloadLinkOptions
): UseQueryResult<DownloadLinksResponse, DownloadLinkError> {
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
    queryKey: ['downloadLinks', params],
    queryFn: () => fetchDownloadLinks(params),
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

// Hook for download link with automatic refresh
export function useDownloadLinkWithRefresh(
  orderId: string,
  taskId: string,
  options?: DownloadLinkOptions & {
    refreshInterval?: number;
    refreshThreshold?: number; // Refresh when expires in X minutes
  }
): UseQueryResult<DownloadLink, DownloadLinkError> & {
  isExpiringSoon: boolean;
  timeUntilExpiry: number | null;
  refreshDownloadLink: () => void;
} {
  const {
    refreshInterval = 60000, // 1 minute
    refreshThreshold = 5, // 5 minutes
    ...queryOptions
  } = options || {};

  const queryResult = useDownloadLink(orderId, taskId, {
    ...queryOptions,
    refetchInterval: refreshInterval,
  });

  const isExpiringSoon = useMemo(() => {
    if (!queryResult.data?.expiresAt) return false;
    const expiryTime = new Date(queryResult.data.expiresAt).getTime();
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;
    return timeUntilExpiry <= refreshThreshold * 60 * 1000; // Convert to milliseconds
  }, [queryResult.data?.expiresAt, refreshThreshold]);

  const timeUntilExpiry = useMemo(() => {
    if (!queryResult.data?.expiresAt) return null;
    const expiryTime = new Date(queryResult.data.expiresAt).getTime();
    const now = Date.now();
    return Math.max(0, expiryTime - now);
  }, [queryResult.data?.expiresAt]);

  const refreshDownloadLink = useCallback(() => {
    queryResult.refetch();
  }, [queryResult]);

  return {
    ...queryResult,
    isExpiringSoon,
    timeUntilExpiry,
    refreshDownloadLink,
  };
}

// Hook for download link statistics
export function useDownloadLinkStats(
  downloadLinkId: string,
  options?: DownloadLinkOptions
): UseQueryResult<{
  totalDownloads: number;
  remainingDownloads: number;
  downloadCount: number;
  lastDownloadedAt?: string;
  expiresAt: string;
  isExpired: boolean;
  isExpiringSoon: boolean;
  timeUntilExpiry: number;
}, DownloadLinkError> {
  const queryResult = useQuery({
    queryKey: ['downloadLinkStats', downloadLinkId],
    queryFn: async () => {
      const response = await apiClient.get(`/downloads/${downloadLinkId}/stats`);
      return response.data;
    },
    enabled: options?.enabled !== false && !!downloadLinkId,
    staleTime: options?.staleTime || 1000 * 30, // 30 seconds
    cacheTime: options?.cacheTime || 1000 * 60 * 5, // 5 minutes
    retry: options?.retry || true,
    retryDelay: options?.retryDelay || ((attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)),
    refetchInterval: options?.refetchInterval || 30000, // 30 seconds
    refetchOnWindowFocus: options?.refetchOnWindowFocus !== false,
    refetchOnMount: options?.refetchOnMount !== false,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    onSettled: options?.onSettled,
  });

  const processedData = useMemo(() => {
    if (!queryResult.data) return null;
    
    const data = queryResult.data;
    const now = Date.now();
    const expiryTime = new Date(data.expiresAt).getTime();
    const timeUntilExpiry = Math.max(0, expiryTime - now);
    const isExpired = timeUntilExpiry <= 0;
    const isExpiringSoon = timeUntilExpiry <= 5 * 60 * 1000; // 5 minutes
    
    return {
      totalDownloads: data.totalDownloads,
      remainingDownloads: data.remainingDownloads,
      downloadCount: data.downloadCount,
      lastDownloadedAt: data.lastDownloadedAt,
      expiresAt: data.expiresAt,
      isExpired,
      isExpiringSoon,
      timeUntilExpiry,
    };
  }, [queryResult.data]);

  return {
    ...queryResult,
    data: processedData,
  };
}

// Hook for downloading file directly
export function useDownloadFile(
  options?: DownloadLinkMutationOptions
): UseMutationResult<{
  blob: Blob;
  url: string;
  size: number;
  type: string;
}, DownloadLinkError, string> {
  return useMutation({
    mutationFn: async (downloadUrl: string) => {
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      return {
        blob,
        url,
        size: blob.size,
        type: blob.type,
      };
    },
    onSuccess: (data) => {
      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = data.url;
      link.download = 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      setTimeout(() => {
        window.URL.revokeObjectURL(data.url);
      }, 1000);
      
      options?.onSuccess?.(data as any);
    },
    onError: (error) => {
      console.error('File download failed:', error);
      options?.onError?.(error);
    },
    onSettled: (data, error) => {
      options?.onSettled?.(data, error);
    },
    retry: options?.retry || false,
    retryDelay: options?.retryDelay || ((attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)),
    mutationKey: ['downloadFile'],
  });
}

// Export types for external use
export type {
  DownloadLink,
  DownloadLinkRequest,
  DownloadLinkResponse,
  DownloadLinksResponse,
  DownloadLinkError,
  DownloadLinkOptions,
  DownloadLinkMutationOptions,
};
