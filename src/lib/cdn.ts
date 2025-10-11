import { NextRequest, NextResponse } from 'next/server'

// CDN configuration
export const CDN_CONFIG = {
  // Vercel Edge Network configuration
  VERCEL: {
    // Cache static assets for 1 year
    STATIC_ASSETS_TTL: 31536000, // 1 year in seconds
    
    // Cache API responses for 1 hour
    API_RESPONSES_TTL: 3600, // 1 hour in seconds
    
    // Cache images for 30 days
    IMAGES_TTL: 2592000, // 30 days in seconds
    
    // Cache HTML for 1 hour
    HTML_TTL: 3600, // 1 hour in seconds
  },
  
  // Cache headers for different content types
  HEADERS: {
    // Static assets (JS, CSS, images)
    STATIC: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'CDN-Cache-Control': 'max-age=31536000',
      'Vercel-CDN-Cache-Control': 'max-age=31536000',
    },
    
    // API responses
    API: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'CDN-Cache-Control': 'max-age=3600',
      'Vercel-CDN-Cache-Control': 'max-age=3600',
    },
    
    // Images
    IMAGES: {
      'Cache-Control': 'public, max-age=2592000',
      'CDN-Cache-Control': 'max-age=2592000',
      'Vercel-CDN-Cache-Control': 'max-age=2592000',
    },
    
    // HTML pages
    HTML: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'CDN-Cache-Control': 'max-age=3600',
      'Vercel-CDN-Cache-Control': 'max-age=3600',
    },
    
    // No cache for sensitive data
    NO_CACHE: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  },
} as const

// CDN utility functions
export class CDNManager {
  /**
   * Set cache headers for static assets
   */
  static setStaticHeaders(response: NextResponse): NextResponse {
    Object.entries(CDN_CONFIG.HEADERS.STATIC).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  /**
   * Set cache headers for API responses
   */
  static setAPIHeaders(response: NextResponse, ttl: number = 3600): NextResponse {
    const headers = {
      ...CDN_CONFIG.HEADERS.API,
      'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}`,
      'CDN-Cache-Control': `max-age=${ttl}`,
      'Vercel-CDN-Cache-Control': `max-age=${ttl}`,
    }
    
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  /**
   * Set cache headers for images
   */
  static setImageHeaders(response: NextResponse, ttl: number = 2592000): NextResponse {
    const headers = {
      ...CDN_CONFIG.HEADERS.IMAGES,
      'Cache-Control': `public, max-age=${ttl}`,
      'CDN-Cache-Control': `max-age=${ttl}`,
      'Vercel-CDN-Cache-Control': `max-age=${ttl}`,
    }
    
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  /**
   * Set cache headers for HTML pages
   */
  static setHTMLHeaders(response: NextResponse, ttl: number = 3600): NextResponse {
    const headers = {
      ...CDN_CONFIG.HEADERS.HTML,
      'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}`,
      'CDN-Cache-Control': `max-age=${ttl}`,
      'Vercel-CDN-Cache-Control': `max-age=${ttl}`,
    }
    
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  /**
   * Set no-cache headers for sensitive data
   */
  static setNoCacheHeaders(response: NextResponse): NextResponse {
    Object.entries(CDN_CONFIG.HEADERS.NO_CACHE).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  /**
   * Get appropriate cache headers based on content type
   */
  static getCacheHeaders(contentType: string, ttl?: number): Record<string, string> {
    if (contentType.includes('image/')) {
      return {
        ...CDN_CONFIG.HEADERS.IMAGES,
        'Cache-Control': `public, max-age=${ttl || CDN_CONFIG.VERCEL.IMAGES_TTL}`,
      }
    }
    
    if (contentType.includes('text/css') || contentType.includes('application/javascript')) {
      return CDN_CONFIG.HEADERS.STATIC
    }
    
    if (contentType.includes('application/json')) {
      return {
        ...CDN_CONFIG.HEADERS.API,
        'Cache-Control': `public, max-age=${ttl || CDN_CONFIG.VERCEL.API_RESPONSES_TTL}`,
      }
    }
    
    if (contentType.includes('text/html')) {
      return {
        ...CDN_CONFIG.HEADERS.HTML,
        'Cache-Control': `public, max-age=${ttl || CDN_CONFIG.VERCEL.HTML_TTL}`,
      }
    }
    
    // Default to API headers
    return {
      ...CDN_CONFIG.HEADERS.API,
      'Cache-Control': `public, max-age=${ttl || CDN_CONFIG.VERCEL.API_RESPONSES_TTL}`,
    }
  }

  /**
   * Check if request should be cached
   */
  static shouldCache(request: NextRequest): boolean {
    const url = new URL(request.url)
    const pathname = url.pathname
    
    // Don't cache sensitive routes
    const noCacheRoutes = [
      '/api/auth',
      '/api/user',
      '/api/admin',
      '/api/payments',
      '/api/orders',
    ]
    
    if (noCacheRoutes.some(route => pathname.startsWith(route))) {
      return false
    }
    
    // Don't cache POST, PUT, DELETE requests
    if (request.method !== 'GET') {
      return false
    }
    
    // Don't cache requests with authentication headers
    if (request.headers.get('authorization')) {
      return false
    }
    
    return true
  }

  /**
   * Get cache key for request
   */
  static getCacheKey(request: NextRequest): string {
    const url = new URL(request.url)
    const pathname = url.pathname
    const searchParams = url.searchParams.toString()
    
    // Create cache key based on path and query parameters
    const key = searchParams ? `${pathname}?${searchParams}` : pathname
    
    // Add user-specific cache key if needed
    const userId = request.headers.get('x-user-id')
    if (userId) {
      return `user:${userId}:${key}`
    }
    
    return key
  }

  /**
   * Purge cache for specific path
   */
  static async purgeCache(path: string): Promise<boolean> {
    try {
      // This would typically call Vercel's cache purge API
      // For now, we'll just log the purge request
      console.log(`Purging cache for path: ${path}`)
      
      // In a real implementation, you would call:
      // await fetch(`https://api.vercel.com/v1/edge-config/${configId}/purge`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ path }),
      // })
      
      return true
    } catch (error) {
      console.error('Cache purge error:', error)
      return false
    }
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    hitRate: number
    missRate: number
    totalRequests: number
    cachedRequests: number
  }> {
    try {
      // This would typically fetch from Vercel Analytics or similar
      // For now, return mock data
      return {
        hitRate: 0.85, // 85% hit rate
        missRate: 0.15, // 15% miss rate
        totalRequests: 10000,
        cachedRequests: 8500,
      }
    } catch (error) {
      console.error('Cache stats error:', error)
      return {
        hitRate: 0,
        missRate: 0,
        totalRequests: 0,
        cachedRequests: 0,
      }
    }
  }
}

// Middleware for setting cache headers
export function withCacheHeaders(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    ttl?: number
    contentType?: string
    noCache?: boolean
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const response = await handler(request)
    
    if (options.noCache) {
      return CDNManager.setNoCacheHeaders(response)
    }
    
    if (options.contentType) {
      const headers = CDNManager.getCacheHeaders(options.contentType, options.ttl)
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
    } else if (options.ttl) {
      return CDNManager.setAPIHeaders(response, options.ttl)
    }
    
    return response
  }
}

// Cache warming for CDN
export class CDNWarmer {
  /**
   * Warm up popular pages
   */
  static async warmPopularPages(): Promise<void> {
    const popularPages = [
      '/',
      '/stock-search',
      '/ai-generation',
      '/dashboard',
      '/pricing',
      '/about',
    ]
    
    for (const page of popularPages) {
      try {
        // This would typically make a request to warm the cache
        console.log(`Warming cache for page: ${page}`)
        
        // In a real implementation, you would:
        // await fetch(`${process.env.NEXT_PUBLIC_APP_URL}${page}`)
      } catch (error) {
        console.error(`Error warming cache for ${page}:`, error)
      }
    }
  }

  /**
   * Warm up API endpoints
   */
  static async warmAPIEndpoints(): Promise<void> {
    const apiEndpoints = [
      '/api/stock/providers',
      '/api/stock/categories',
      '/api/ai/styles',
      '/api/ai/presets',
    ]
    
    for (const endpoint of apiEndpoints) {
      try {
        console.log(`Warming cache for API: ${endpoint}`)
        
        // In a real implementation, you would:
        // await fetch(`${process.env.NEXT_PUBLIC_APP_URL}${endpoint}`)
      } catch (error) {
        console.error(`Error warming cache for ${endpoint}:`, error)
      }
    }
  }
}

// Export CDN manager
export { CDNManager }
