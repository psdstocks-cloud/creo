import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/api-client';

export interface StockMediaItem {
  id: string;
  title: string;
  thumbnail: string;
  cost: number;
  source: string;
  ext: string;
  description?: string;
  tags?: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize?: number;
  license?: string;
  isPremium?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchParams {
  query: string;
  page?: number;
  pageSize?: number;
  type?: 'image' | 'video' | 'audio' | 'vector' | 'all';
  category?: string;
  source?: string;
  minPrice?: number;
  maxPrice?: number;
  isPremium?: boolean;
  sortBy?: 'relevance' | 'newest' | 'oldest' | 'price_asc' | 'price_desc';
  tags?: string[];
}

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
  };
}

export const fetchStockMedia = async (params: SearchParams): Promise<StockMediaSearchResponse> => {
  const { data } = await apiClient.get<StockMediaSearchResponse>('/stocksearch', { 
    params: {
      q: params.query,
      page: params.page || 1,
      limit: params.pageSize || 20,
      type: params.type || 'all',
      category: params.category,
      source: params.source,
      min_price: params.minPrice,
      max_price: params.maxPrice,
      premium: params.isPremium,
      sort: params.sortBy || 'relevance',
      tags: params.tags?.join(',')
    }
  });
  
  if (!data) {
    throw new Error('Failed to fetch stock media');
  }
  
  return data;
};

export function useStockMediaSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['stockMediaSearch', params],
    queryFn: () => fetchStockMedia(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    enabled: !!params.query && params.query.length > 0,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useStockMediaSearchInfinite(params: Omit<SearchParams, 'page'>) {
  return useQuery({
    queryKey: ['stockMediaSearchInfinite', params],
    queryFn: ({ pageParam = 1 }) => fetchStockMedia({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.page + 1 : undefined;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    enabled: !!params.query && params.query.length > 0,
  });
}
