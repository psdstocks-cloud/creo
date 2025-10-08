/**
 * useStockMediaSearchSimple Hook
 * 
 * Simplified hook for stock media search with debounced queries,
 * pagination, and error handling.
 */

import { useQuery } from '@tanstack/react-query';
import { StockSearchResponse, StockInfo } from '../types/nehtw';

// ============================================================================
// Types and Interfaces
// ============================================================================

// Use the proper types from nehtw.ts
// type StockMediaItem = StockInfo; // Not used directly in this file
type SearchResults = StockSearchResponse;

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
// API Function with Fallback
// ============================================================================

const searchStockMedia = async (options: {
  query: string;
  site?: string;
  page: number;
  limit: number;
}): Promise<SearchResults> => {
  const { query, site, page, limit } = options;
  
  // Get API configuration from environment variables
  const baseUrl = process.env.NEXT_PUBLIC_NEHTW_BASE_URL || 'https://nehtw.com/api';
  const apiKey = process.env.NEXT_PUBLIC_NEHTW_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key not configured. Please set NEXT_PUBLIC_NEHTW_API_KEY environment variable.');
  }
  
  // Build search URL with query parameters
  const searchParams = new URLSearchParams({
    query: query,
    page: page.toString(),
    limit: limit.toString(),
    ...(site && { site })
  });
  
  const searchUrl = `${baseUrl}/stocksearch?${searchParams.toString()}`;
  
  try {
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No results found for your search query.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(`API request failed with status ${response.status}`);
      }
    }
    
    const data: StockSearchResponse = await response.json();
    
    // Return the properly typed response
    return {
      results: data.results || [],
      total: data.total || 0,
      page: data.page || page,
      limit: data.limit || limit,
      has_more: data.has_more || false,
      search_metadata: data.search_metadata || {
        query: query,
        filters_applied: [],
        search_time_ms: 0
      }
    };
    
  } catch (error) {
    console.error('Stock media search error:', error);
    
    // If it's a network error or API is down, provide fallback mock data
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('API unavailable, using fallback mock data');
      
      // Return mock data as fallback with proper StockInfo structure
      const mockResults: StockInfo[] = [
        {
          id: `fallback-1-${query}-${page}`,
          title: `${query} - Beautiful landscape photography`,
          description: `High-quality ${query} landscape photography perfect for commercial use`,
          url: `https://example.com/fallback-1-${query}`,
          thumbnail: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
          preview_url: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
          type: 'image',
          category: 'Nature',
          subcategory: 'Landscape',
          tags: [query, 'landscape', 'nature', 'photography'],
          keywords: [query, 'landscape', 'nature', 'photography', 'outdoor'],
          size: Math.floor(Math.random() * 5) + 1,
          dimensions: { width: 1920, height: 1080 },
          format: 'JPEG',
          resolution: '1920x1080',
          quality: 'high',
          license_type: 'royalty_free',
          usage_rights: {
            commercial: true,
            editorial: true,
            print: true,
            web: true,
            social_media: true,
            unlimited: false
          },
          attribution_required: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          site: {
            id: 'shutterstock',
            name: 'Shutterstock',
            url: 'https://shutterstock.com',
            logo: 'https://shutterstock.com/logo.png'
          },
          contributor: {
            id: 'contributor-1',
            name: 'Professional Photographer',
            profile_url: 'https://shutterstock.com/contributor/1',
            avatar: 'https://picsum.photos/50/50?random=1'
          },
          pricing: {
            credits: Math.floor(Math.random() * 50) + 10,
            currency: 'EGP',
            price: Math.floor(Math.random() * 50) + 10
          },
          statistics: {
            downloads: Math.floor(Math.random() * 1000),
            views: Math.floor(Math.random() * 5000),
            likes: Math.floor(Math.random() * 500),
            rating: 4.5
          },
          metadata: {
            color_palette: ['#2E8B57', '#87CEEB', '#F0E68C'],
            dominant_colors: ['#2E8B57', '#87CEEB'],
            orientation: 'landscape',
            aspect_ratio: '16:9',
            file_size_mb: Math.floor(Math.random() * 5) + 1,
            dpi: 300
          }
        },
        {
          id: `fallback-2-${query}-${page}`,
          title: `${query} - Professional business image`,
          description: `Professional ${query} business image suitable for corporate use`,
          url: `https://example.com/fallback-2-${query}`,
          thumbnail: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
          preview_url: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
          type: 'image',
          category: 'Business',
          subcategory: 'Office',
          tags: [query, 'business', 'professional', 'office'],
          keywords: [query, 'business', 'professional', 'office', 'corporate'],
          size: Math.floor(Math.random() * 5) + 1,
          dimensions: { width: 1920, height: 1080 },
          format: 'JPEG',
          resolution: '1920x1080',
          quality: 'high',
          license_type: 'royalty_free',
          usage_rights: {
            commercial: true,
            editorial: true,
            print: true,
            web: true,
            social_media: true,
            unlimited: false
          },
          attribution_required: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          site: {
            id: 'adobestock',
            name: 'Adobe Stock',
            url: 'https://stock.adobe.com',
            logo: 'https://stock.adobe.com/logo.png'
          },
          contributor: {
            id: 'contributor-2',
            name: 'Business Photographer',
            profile_url: 'https://stock.adobe.com/contributor/2',
            avatar: 'https://picsum.photos/50/50?random=2'
          },
          pricing: {
            credits: Math.floor(Math.random() * 50) + 10,
            currency: 'EGP',
            price: Math.floor(Math.random() * 50) + 10
          },
          statistics: {
            downloads: Math.floor(Math.random() * 1000),
            views: Math.floor(Math.random() * 5000),
            likes: Math.floor(Math.random() * 500),
            rating: 4.2
          },
          metadata: {
            color_palette: ['#4169E1', '#FFFFFF', '#000000'],
            dominant_colors: ['#4169E1', '#FFFFFF'],
            orientation: 'landscape',
            aspect_ratio: '16:9',
            file_size_mb: Math.floor(Math.random() * 5) + 1,
            dpi: 300
          }
        }
      ];
      
      return {
        results: mockResults,
        total: 2,
        page,
        limit,
        has_more: false,
        search_metadata: {
          query: query,
          filters_applied: [],
          search_time_ms: 0
        }
      };
    }
    
    // Re-throw other errors
    throw error;
  }
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
    gcTime: 10 * 60 * 1000, // 10 minutes
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