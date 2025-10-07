import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

// Type definitions for stock media items
export interface StockMediaItem {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  previewUrl?: string;
  downloadUrl?: string;
  cost: number;
  currency: string;
  source: string;
  type: 'image' | 'video' | 'audio' | 'vector' | 'document';
  ext: string;
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize?: number;
  tags?: string[];
  category?: string;
  license?: string;
  isPremium?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Search parameters interface
export interface StockMediaSearchParams {
  query: string;
  page?: number;
  pageSize?: number;
  type?: 'image' | 'video' | 'audio' | 'vector' | 'document' | 'all';
  category?: string;
  source?: string;
  minPrice?: number;
  maxPrice?: number;
  isPremium?: boolean;
  sortBy?: 'relevance' | 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular';
  tags?: string[];
  color?: string;
  orientation?: 'landscape' | 'portrait' | 'square';
  dateRange?: {
    start: string;
    end: string;
  };
}

// API response interface
export interface StockMediaSearchResponse {
  results: StockMediaItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  searchTime: number;
  filters: {
    categories: string[];
    sources: string[];
    priceRange: {
      min: number;
      max: number;
    };
    types: string[];
  };
  suggestions?: string[];
  relatedQueries?: string[];
}

// Error interface
export interface StockMediaSearchError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

// API client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.stockmedia.com/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Axios instance for API calls
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
  },
});

// API function to fetch stock media search results
export const fetchStockMediaSearch = async (
  params: StockMediaSearchParams
): Promise<StockMediaSearchResponse> => {
  try {
    // Validate required parameters
    if (!params.query || params.query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    // Build query parameters
    const queryParams = {
      q: params.query.trim(),
      page: params.page || 1,
      limit: params.pageSize || 20,
      type: params.type || 'all',
      category: params.category,
      source: params.source,
      min_price: params.minPrice,
      max_price: params.maxPrice,
      premium: params.isPremium,
      sort: params.sortBy || 'relevance',
      tags: params.tags?.join(','),
      color: params.color,
      orientation: params.orientation,
      start_date: params.dateRange?.start,
      end_date: params.dateRange?.end,
    };

    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== undefined)
    );

    const response = await apiClient.get<StockMediaSearchResponse>('/search', {
      params: cleanParams,
    });

    if (!response.data) {
      throw new Error('No data received from API');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<StockMediaSearchError>;
      const errorMessage = axiosError.response?.data?.message || 
                            axiosError.message || 
                            'Failed to fetch stock media search results';
      
      throw new Error(errorMessage);
    }
    
    throw error;
  }
};

// Main React Query hook for stock media search
export function useStockMediaSearch(
  params: StockMediaSearchParams,
  options?: Omit<UseQueryOptions<StockMediaSearchResponse, Error>, 'queryKey' | 'queryFn'>
): UseQueryResult<StockMediaSearchResponse, Error> {
  return useQuery({
    queryKey: ['stockMediaSearch', params],
    queryFn: () => fetchStockMediaSearch(params),
    enabled: !!params.query && params.query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    keepPreviousData: true,
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error.message.includes('400') || error.message.includes('401') || 
          error.message.includes('403') || error.message.includes('404')) {
        return false;
      }
      // Retry up to 3 times for server errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}

// Hook for infinite scroll/pagination
export function useStockMediaSearchInfinite(
  params: Omit<StockMediaSearchParams, 'page'>,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  }
) {
  const { enabled = true, staleTime = 1000 * 60 * 5, cacheTime = 1000 * 60 * 30 } = options || {};

  return useQuery({
    queryKey: ['stockMediaSearchInfinite', params],
    queryFn: ({ pageParam = 1 }) => fetchStockMediaSearch({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.page + 1 : undefined;
    },
    enabled: enabled && !!params.query && params.query.trim().length > 0,
    staleTime,
    cacheTime,
    keepPreviousData: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for trending/popular media
export function useTrendingStockMedia(
  options?: {
    limit?: number;
    category?: string;
    type?: StockMediaSearchParams['type'];
    enabled?: boolean;
  }
) {
  const { limit = 20, category, type = 'all', enabled = true } = options || {};

  return useQuery({
    queryKey: ['trendingStockMedia', { limit, category, type }],
    queryFn: () => fetchStockMediaSearch({
      query: 'trending',
      page: 1,
      pageSize: limit,
      type,
      category,
      sortBy: 'popular',
    }),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes for trending content
    cacheTime: 1000 * 60 * 60, // 1 hour
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for related media suggestions
export function useRelatedStockMedia(
  mediaId: string,
  options?: {
    limit?: number;
    enabled?: boolean;
  }
) {
  const { limit = 10, enabled = true } = options || {};

  return useQuery({
    queryKey: ['relatedStockMedia', mediaId, limit],
    queryFn: async () => {
      const response = await apiClient.get<StockMediaSearchResponse>(`/media/${mediaId}/related`, {
        params: { limit },
      });
      return response.data;
    },
    enabled: enabled && !!mediaId,
    staleTime: 1000 * 60 * 15, // 15 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for search suggestions/autocomplete
export function useSearchSuggestions(
  query: string,
  options?: {
    limit?: number;
    enabled?: boolean;
  }
) {
  const { limit = 10, enabled = true } = options || {};

  return useQuery({
    queryKey: ['searchSuggestions', query, limit],
    queryFn: async () => {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const response = await apiClient.get<{ suggestions: string[] }>('/search/suggestions', {
        params: { q: query.trim(), limit },
      });
      return response.data.suggestions;
    },
    enabled: enabled && !!query && query.trim().length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 15, // 15 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 5000),
  });
}

// Hook for search filters and metadata
export function useSearchFilters(
  options?: {
    enabled?: boolean;
  }
) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: ['searchFilters'],
    queryFn: async () => {
      const response = await apiClient.get<{
        categories: string[];
        sources: string[];
        types: string[];
        priceRange: { min: number; max: number };
        colors: string[];
        orientations: string[];
      }>('/search/filters');
      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 60, // 1 hour (filters don't change often)
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Utility hook for search analytics
export function useSearchAnalytics(
  searchParams: StockMediaSearchParams,
  options?: {
    enabled?: boolean;
  }
) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: ['searchAnalytics', searchParams],
    queryFn: async () => {
      const response = await apiClient.get<{
        totalSearches: number;
        averageResults: number;
        popularQueries: string[];
        trendingCategories: string[];
        searchTrends: Array<{
          date: string;
          count: number;
        }>;
      }>('/search/analytics', {
        params: searchParams,
      });
      return response.data;
    },
    enabled: enabled && !!searchParams.query,
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}

// Export types for external use
export type {
  StockMediaItem,
  StockMediaSearchParams,
  StockMediaSearchResponse,
  StockMediaSearchError,
};
