import { NextRequest, NextResponse } from 'next/server'
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache'
import { CDNManager } from '@/lib/cdn'

// Cache middleware configuration
export const CACHE_MIDDLEWARE_CONFIG = {
  // Routes that should be cached
  CACHEABLE_ROUTES: [
    '/api/stock/providers',
    '/api/stock/categories',
    '/api/ai/styles',
    '/api/ai/presets',
    '/api/system/stats',
  ],
  
  // Routes that should never be cached
  NO_CACHE_ROUTES: [
    '/api/auth',
    '/api/user/profile',
    '/api/user/credits',
    '/api/orders',
    '/api/payments',
    '/api/admin',
  ],
  
  // User-specific routes that need user context
  USER_SPECIFIC_ROUTES: [
    '/api/user/orders',
    '/api/user/downloads',
    '/api/user/preferences',
  ],
} as const

// Cache middleware class
export class CacheMiddleware {
  /**
   * Check if route should be cached
   */
  static shouldCache(request: NextRequest): boolean {
    const url = new URL(request.url)
    const pathname = url.pathname
    
    // Don't cache non-GET requests
    if (request.method !== 'GET') {
      return false
    }
    
    // Don't cache no-cache routes
    if (CACHE_MIDDLEWARE_CONFIG.NO_CACHE_ROUTES.some(route => pathname.startsWith(route))) {
      return false
    }
    
    // Don't cache if user is authenticated (for now)
    if (request.headers.get('authorization')) {
      return false
    }
    
    // Cache cacheable routes
    return CACHE_MIDDLEWARE_CONFIG.CACHEABLE_ROUTES.some(route => pathname.startsWith(route))
  }

  /**
   * Get cache key for request
   */
  static getCacheKey(request: NextRequest): string {
    const url = new URL(request.url)
    const pathname = url.pathname
    const searchParams = url.searchParams.toString()
    
    // Create cache key
    let key = pathname
    if (searchParams) {
      key += `?${searchParams}`
    }
    
    // Add user context if needed
    const userId = request.headers.get('x-user-id')
    if (userId && CACHE_MIDDLEWARE_CONFIG.USER_SPECIFIC_ROUTES.some(route => pathname.startsWith(route))) {
      key = `user:${userId}:${key}`
    }
    
    return key
  }

  /**
   * Get TTL for route
   */
  static getTTL(pathname: string): number {
    if (pathname.startsWith('/api/stock/providers') || pathname.startsWith('/api/stock/categories')) {
      return CACHE_TTL.STOCK_PROVIDERS
    }
    
    if (pathname.startsWith('/api/ai/styles') || pathname.startsWith('/api/ai/presets')) {
      return CACHE_TTL.AI_GENERATION
    }
    
    if (pathname.startsWith('/api/system/stats')) {
      return CACHE_TTL.SYSTEM_STATS
    }
    
    // Default TTL
    return CACHE_TTL.MEDIUM
  }

  /**
   * Handle cache hit
   */
  static async handleCacheHit(cachedResponse: any): Promise<NextResponse> {
    const response = new NextResponse(JSON.stringify(cachedResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'HIT',
        'X-Cache-Timestamp': new Date().toISOString(),
      },
    })
    
    // Set CDN headers
    return CDNManager.setAPIHeaders(response, 3600)
  }

  /**
   * Handle cache miss
   */
  static async handleCacheMiss(
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    // Execute the actual handler
    const response = await handler(request)
    
    // Only cache successful responses
    if (response.status === 200) {
      const cacheKey = this.getCacheKey(request)
      const ttl = this.getTTL(new URL(request.url).pathname)
      
      // Clone response to get body
      const clonedResponse = response.clone()
      const body = await clonedResponse.text()
      
      // Store in cache
      try {
        await cache.set(cacheKey, JSON.parse(body), ttl)
      } catch (error) {
        console.error('Cache set error:', error)
      }
    }
    
    // Add cache headers
    response.headers.set('X-Cache', 'MISS')
    response.headers.set('X-Cache-Timestamp', new Date().toISOString())
    
    return CDNManager.setAPIHeaders(response, 3600)
  }

  /**
   * Main cache middleware
   */
  static async middleware(
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    // Check if route should be cached
    if (!this.shouldCache(request)) {
      return await handler(request)
    }
    
    const cacheKey = this.getCacheKey(request)
    
    try {
      // Try to get from cache
      const cachedResponse = await cache.get(cacheKey)
      
      if (cachedResponse !== null) {
        return await this.handleCacheHit(cachedResponse)
      }
      
      // Cache miss - execute handler and cache result
      return await this.handleCacheMiss(request, handler)
    } catch (error) {
      console.error('Cache middleware error:', error)
      // If cache fails, just execute the handler
      return await handler(request)
    }
  }
}

// Cache invalidation middleware
export class CacheInvalidationMiddleware {
  /**
   * Invalidate cache after mutations
   */
  static async invalidateAfterMutation(
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const response = await handler(request)
    
    // Only invalidate on successful mutations
    if (response.status >= 200 && response.status < 300) {
      const pathname = new URL(request.url).pathname
      
      // Invalidate related caches
      if (pathname.startsWith('/api/user/')) {
        // Invalidate user-related caches
        const userId = request.headers.get('x-user-id')
        if (userId) {
          await cache.deletePattern(`user:${userId}:*`)
        }
      }
      
      if (pathname.startsWith('/api/stock/')) {
        // Invalidate stock-related caches
        await cache.deletePattern(`${CACHE_KEYS.STOCK_SEARCH}:*`)
        await cache.deletePattern(`${CACHE_KEYS.STOCK_PROVIDERS}:*`)
      }
      
      if (pathname.startsWith('/api/ai/')) {
        // Invalidate AI-related caches
        await cache.deletePattern(`${CACHE_KEYS.AI_GENERATION}:*`)
      }
      
      if (pathname.startsWith('/api/system/')) {
        // Invalidate system caches
        await cache.delete(CACHE_KEYS.SYSTEM_STATS)
      }
    }
    
    return response
  }
}

// Cache warming middleware
export class CacheWarmingMiddleware {
  /**
   * Warm up cache for popular routes
   */
  static async warmPopularRoutes(): Promise<void> {
    const popularRoutes = [
      '/api/stock/providers',
      '/api/stock/categories',
      '/api/ai/styles',
      '/api/ai/presets',
      '/api/system/stats',
    ]
    
    for (const route of popularRoutes) {
      try {
        const request = new NextRequest(`https://example.com${route}`)
        const cacheKey = CacheMiddleware.getCacheKey(request)
        
        // Check if already cached
        if (await cache.exists(cacheKey)) {
          continue
        }
        
        // This would typically make a request to warm the cache
        console.log(`Warming cache for route: ${route}`)
        
        // In a real implementation, you would:
        // await fetch(`${process.env.NEXT_PUBLIC_APP_URL}${route}`)
      } catch (error) {
        console.error(`Error warming cache for ${route}:`, error)
      }
    }
  }
}

// Cache monitoring middleware
export class CacheMonitoringMiddleware {
  /**
   * Monitor cache performance
   */
  static async monitorCachePerformance(
    request: NextRequest,
    handler: (request: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const start = Date.now()
    const cacheKey = CacheMiddleware.getCacheKey(request)
    
    try {
      const response = await handler(request)
      const duration = Date.now() - start
      
      // Log cache performance
      console.log(`Cache performance for ${cacheKey}:`, {
        duration,
        status: response.status,
        cacheStatus: response.headers.get('X-Cache'),
      })
      
      // Update cache hit rate
      const cacheStatus = response.headers.get('X-Cache')
      if (cacheStatus === 'HIT') {
        await cache.increment('cache:hits')
      } else if (cacheStatus === 'MISS') {
        await cache.increment('cache:misses')
      }
      
      return response
    } catch (error) {
      console.error('Cache monitoring error:', error)
      return await handler(request)
    }
  }

  /**
   * Get cache performance metrics
   */
  static async getCacheMetrics(): Promise<{
    hitRate: number
    totalRequests: number
    averageResponseTime: number
  }> {
    try {
      const hits = await cache.get<number>('cache:hits') || 0
      const misses = await cache.get<number>('cache:misses') || 0
      const totalRequests = hits + misses
      
      return {
        hitRate: totalRequests > 0 ? hits / totalRequests : 0,
        totalRequests,
        averageResponseTime: 0, // Would need to track this separately
      }
    } catch (error) {
      console.error('Cache metrics error:', error)
      return {
        hitRate: 0,
        totalRequests: 0,
        averageResponseTime: 0,
      }
    }
  }
}

// Export middleware functions
export const withCache = CacheMiddleware.middleware
export const withCacheInvalidation = CacheInvalidationMiddleware.invalidateAfterMutation
export const withCacheMonitoring = CacheMonitoringMiddleware.monitorCachePerformance
