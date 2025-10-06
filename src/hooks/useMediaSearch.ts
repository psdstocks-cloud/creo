import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../lib/api-client';
import { MediaSearchResponse, MediaSearchParams, MediaItem, ApiError } from '../types/api';

/**
 * Hook to search for media with pagination
 * @param params - Search parameters
 * @param options - Additional query options
 */
export const useMediaSearch = (
  params: MediaSearchParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) => {
  return useQuery<MediaSearchResponse, ApiError>({
    queryKey: ['media', 'search', params],
    queryFn: () => {
      const searchParams = new URLSearchParams();
      
      // Add all search parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => searchParams.append(key, item));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });

      return apiClient.get<MediaSearchResponse>(`/media/search?${searchParams.toString()}`);
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 300000, // 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};

/**
 * Hook for infinite media search (infinite scroll)
 * @param baseParams - Base search parameters
 * @param options - Additional query options
 */
export const useInfiniteMediaSearch = (
  baseParams: Omit<MediaSearchParams, 'page'>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  return useInfiniteQuery<MediaSearchResponse, ApiError>({
    queryKey: ['media', 'search', 'infinite', baseParams],
    queryFn: ({ pageParam = 1 }) => {
      const params = { ...baseParams, page: pageParam as number };
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => searchParams.append(key, item));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });

      return apiClient.get<MediaSearchResponse>(`/media/search?${searchParams.toString()}`);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.results.hasNext ? lastPage.results.page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.results.hasPrev ? firstPage.results.page - 1 : undefined;
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 300000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to get media item details
 * @param mediaId - Media item ID
 * @param options - Additional query options
 */
export const useMediaItem = (
  mediaId: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<MediaItem, ApiError>({
    queryKey: ['media', 'item', mediaId],
    queryFn: () => apiClient.get<MediaItem>(`/media/${mediaId}`),
    enabled: options?.enabled ?? !!mediaId,
    staleTime: 600000, // 10 minutes
    retry: 2,
  });
};

/**
 * Hook to get related media items
 * @param mediaId - Media item ID to find related items for
 * @param options - Additional query options
 */
export const useRelatedMedia = (
  mediaId: string,
  options?: {
    limit?: number;
    enabled?: boolean;
  }
) => {
  return useQuery<MediaItem[], ApiError>({
    queryKey: ['media', 'related', mediaId, options?.limit],
    queryFn: () => {
      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      
      return apiClient.get<MediaItem[]>(`/media/${mediaId}/related?${params.toString()}`);
    },
    enabled: options?.enabled ?? !!mediaId,
    staleTime: 600000, // 10 minutes
    retry: 2,
  });
};

/**
 * Hook to get trending media
 * @param options - Query options
 */
export const useTrendingMedia = (options?: {
  type?: 'image' | 'video' | 'audio' | 'vector' | 'all';
  limit?: number;
  period?: 'day' | 'week' | 'month';
  enabled?: boolean;
}) => {
  const params = new URLSearchParams();
  if (options?.type) params.append('type', options.type);
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.period) params.append('period', options.period);

  return useQuery<MediaItem[], ApiError>({
    queryKey: ['media', 'trending', options],
    queryFn: () => apiClient.get<MediaItem[]>(`/media/trending?${params.toString()}`),
    enabled: options?.enabled ?? true,
    staleTime: 300000, // 5 minutes
    refetchInterval: 600000, // Refetch every 10 minutes
    retry: 2,
  });
};

/**
 * Hook to get media categories
 */
export const useMediaCategories = () => {
  return useQuery<string[], ApiError>({
    queryKey: ['media', 'categories'],
    queryFn: () => apiClient.get<string[]>('/media/categories'),
    staleTime: 1800000, // 30 minutes
    retry: 2,
  });
};

/**
 * Hook to get media sources
 */
export const useMediaSources = () => {
  return useQuery<string[], ApiError>({
    queryKey: ['media', 'sources'],
    queryFn: () => apiClient.get<string[]>('/media/sources'),
    staleTime: 1800000, // 30 minutes
    retry: 2,
  });
};
