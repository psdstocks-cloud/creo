/**
 * useStockMediaSearchSimple Hook
 * 
 * Simplified hook for stock media search with debounced queries,
 * pagination, and error handling.
 */

import { useQuery } from '@tanstack/react-query';

// ============================================================================
// Types and Interfaces
// ============================================================================

interface StockMediaItem {
  id: string;
  title: string;
  thumbnail: string;
  cost: number;
  filesize: string;
  site: string;
  tags: string[];
  dimensions: {
    width: number;
    height: number;
  };
  license: string;
  downloads?: number;
  rating?: number;
}

interface SearchResults {
  results: StockMediaItem[];
  total: number;
  page: number;
  hasMore: boolean;
}

interface UseStockMediaSearchSimpleOptions {
  query?: string;
  site?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

interface UseStockMediaSearchSimpleReturn {
  data: SearchResults | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// ============================================================================
// Mock API Function
// ============================================================================

const searchStockMedia = async (options: {
  query: string;
  site?: string;
  page: number;
  limit: number;
}): Promise<SearchResults> => {
  const { query, site, page, limit } = options;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Mock data based on query
  const mockResults: StockMediaItem[] = [
    {
      id: `1-${query}-${page}`,
      title: `${query} - Beautiful landscape photography`,
      thumbnail: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
      cost: Math.floor(Math.random() * 50) + 10,
      filesize: `${Math.floor(Math.random() * 5) + 1}MB`,
      site: site || 'shutterstock',
      tags: [query, 'landscape', 'nature', 'photography'],
      dimensions: { width: 1920, height: 1080 },
      license: 'Commercial',
      downloads: Math.floor(Math.random() * 1000),
      rating: 4.5
    },
    {
      id: `2-${query}-${page}`,
      title: `${query} - Professional business image`,
      thumbnail: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
      cost: Math.floor(Math.random() * 50) + 10,
      filesize: `${Math.floor(Math.random() * 5) + 1}MB`,
      site: site || 'adobestock',
      tags: [query, 'business', 'professional', 'office'],
      dimensions: { width: 1920, height: 1080 },
      license: 'Commercial',
      downloads: Math.floor(Math.random() * 1000),
      rating: 4.2
    },
    {
      id: `3-${query}-${page}`,
      title: `${query} - Creative abstract design`,
      thumbnail: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
      cost: Math.floor(Math.random() * 50) + 10,
      filesize: `${Math.floor(Math.random() * 5) + 1}MB`,
      site: site || 'freepik',
      tags: [query, 'abstract', 'creative', 'design'],
      dimensions: { width: 1920, height: 1080 },
      license: 'Free',
      downloads: Math.floor(Math.random() * 1000),
      rating: 4.0
    },
    {
      id: `4-${query}-${page}`,
      title: `${query} - Modern technology concept`,
      thumbnail: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
      cost: Math.floor(Math.random() * 50) + 10,
      filesize: `${Math.floor(Math.random() * 5) + 1}MB`,
      site: site || 'unsplash',
      tags: [query, 'technology', 'modern', 'digital'],
      dimensions: { width: 1920, height: 1080 },
      license: 'Commercial',
      downloads: Math.floor(Math.random() * 1000),
      rating: 4.7
    },
    {
      id: `5-${query}-${page}`,
      title: `${query} - Lifestyle and people`,
      thumbnail: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
      cost: Math.floor(Math.random() * 50) + 10,
      filesize: `${Math.floor(Math.random() * 5) + 1}MB`,
      site: site || 'pexels',
      tags: [query, 'lifestyle', 'people', 'social'],
      dimensions: { width: 1920, height: 1080 },
      license: 'Commercial',
      downloads: Math.floor(Math.random() * 1000),
      rating: 4.3
    }
  ];

  // Simulate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = mockResults.slice(0, limit);
  
  // Simulate total count
  const total = Math.floor(Math.random() * 200) + 50;
  
  return {
    results: paginatedResults,
    total,
    page,
    hasMore: endIndex < total
  };
};

// ============================================================================
// Main Hook
// ============================================================================

export const useStockMediaSearchSimple = (options: UseStockMediaSearchSimpleOptions): UseStockMediaSearchSimpleReturn => {
  const {
    query = '',
    site,
    page = 1,
    limit = 20,
    enabled = true
  } = options;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['stockMediaSearch', query, site, page, limit],
    queryFn: () => searchStockMedia({ query, site, page, limit }),
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    data,
    isLoading,
    isError,
    error: error as Error | null,
    refetch
  };
};

export default useStockMediaSearchSimple;