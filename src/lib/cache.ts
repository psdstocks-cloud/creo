import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Redis client configuration
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Rate limiting configuration
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
  prefix: 'creo-ratelimit',
})

// Cache configuration
export const CACHE_KEYS = {
  // Stock search cache
  STOCK_SEARCH: 'stock:search',
  STOCK_PROVIDERS: 'stock:providers',
  STOCK_CATEGORIES: 'stock:categories',
  
  // AI generation cache
  AI_GENERATION: 'ai:generation',
  AI_STYLES: 'ai:styles',
  AI_PRESETS: 'ai:presets',
  
  // User data cache
  USER_PROFILE: 'user:profile',
  USER_CREDITS: 'user:credits',
  USER_ORDERS: 'user:orders',
  
  // System cache
  SYSTEM_STATS: 'system:stats',
  API_USAGE: 'api:usage',
  ERROR_LOGS: 'error:logs',
} as const

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  // Short-term cache (5 minutes)
  SHORT: 300,
  
  // Medium-term cache (1 hour)
  MEDIUM: 3600,
  
  // Long-term cache (24 hours)
  LONG: 86400,
  
  // Very long-term cache (7 days)
  VERY_LONG: 604800,
  
  // Specific TTLs
  STOCK_SEARCH: 1800, // 30 minutes
  STOCK_PROVIDERS: 86400, // 24 hours
  AI_GENERATION: 3600, // 1 hour
  USER_PROFILE: 1800, // 30 minutes
  USER_CREDITS: 300, // 5 minutes
  SYSTEM_STATS: 300, // 5 minutes
} as const

// Cache utility functions
export class CacheManager {
  private redis: Redis

  constructor() {
    this.redis = redis
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key)
      return value as T | null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set(key: string, value: any, ttl: number = CACHE_TTL.MEDIUM): Promise<boolean> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Cache set error:', error)
      return false
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      await this.redis.del(key)
      return true
    } catch (error) {
      console.error('Cache delete error:', error)
      return false
    }
  }

  /**
   * Delete multiple keys with pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
      return keys.length
    } catch (error) {
      console.error('Cache delete pattern error:', error)
      return 0
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key)
      return result === 1
    } catch (error) {
      console.error('Cache exists error:', error)
      return false
    }
  }

  /**
   * Get or set value with fallback function
   */
  async getOrSet<T>(
    key: string,
    fallback: () => Promise<T>,
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key)
      if (cached !== null) {
        return cached
      }

      // If not in cache, execute fallback function
      const value = await fallback()
      
      // Store in cache
      await this.set(key, value, ttl)
      
      return value
    } catch (error) {
      console.error('Cache getOrSet error:', error)
      // If cache fails, still try to execute fallback
      return await fallback()
    }
  }

  /**
   * Increment a counter
   */
  async increment(key: string, by: number = 1): Promise<number> {
    try {
      return await this.redis.incrby(key, by)
    } catch (error) {
      console.error('Cache increment error:', error)
      return 0
    }
  }

  /**
   * Set expiration for a key
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const result = await this.redis.expire(key, ttl)
      return result === 1
    } catch (error) {
      console.error('Cache expire error:', error)
      return false
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    totalKeys: number
    memoryUsage: string
    hitRate: number
  }> {
    try {
      const info = await this.redis.info('memory')
      const keys = await this.redis.keys('*')
      
      return {
        totalKeys: keys.length,
        memoryUsage: info.match(/used_memory_human:(\S+)/)?.[1] || '0B',
        hitRate: 0, // Would need to track this separately
      }
    } catch (error) {
      console.error('Cache stats error:', error)
      return {
        totalKeys: 0,
        memoryUsage: '0B',
        hitRate: 0,
      }
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<boolean> {
    try {
      await this.redis.flushdb()
      return true
    } catch (error) {
      console.error('Cache clear error:', error)
      return false
    }
  }

  /**
   * Get cache health status
   */
  async health(): Promise<{
    status: 'healthy' | 'unhealthy'
    latency: number
    error?: string
  }> {
    try {
      const start = Date.now()
      await this.redis.ping()
      const latency = Date.now() - start

      return {
        status: 'healthy',
        latency,
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

// Create cache manager instance
export const cache = new CacheManager()

// Cache decorator for functions
export function cached(ttl: number = CACHE_TTL.MEDIUM, keyPrefix?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyPrefix 
        ? `${keyPrefix}:${JSON.stringify(args)}`
        : `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`

      return await cache.getOrSet(cacheKey, () => method.apply(this, args), ttl)
    }
  }
}

// Cache warming functions
export class CacheWarmer {
  private cache: CacheManager

  constructor() {
    this.cache = cache
  }

  /**
   * Warm up stock search cache
   */
  async warmStockSearch(): Promise<void> {
    try {
      // Warm up popular search terms
      const popularSearches = [
        'nature',
        'business',
        'people',
        'technology',
        'abstract',
        'landscape',
        'portrait',
        'office',
        'city',
        'food'
      ]

      for (const term of popularSearches) {
        const key = `${CACHE_KEYS.STOCK_SEARCH}:${term}`
        if (!(await this.cache.exists(key))) {
          // This would typically call the actual search API
          // For now, we'll just set a placeholder
          await this.cache.set(key, { term, results: [] }, CACHE_TTL.STOCK_SEARCH)
        }
      }
    } catch (error) {
      console.error('Cache warming error:', error)
    }
  }

  /**
   * Warm up system stats cache
   */
  async warmSystemStats(): Promise<void> {
    try {
      const key = CACHE_KEYS.SYSTEM_STATS
      if (!(await this.cache.exists(key))) {
        // This would typically fetch real system stats
        await this.cache.set(key, {
          totalUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          activeUsers: 0,
        }, CACHE_TTL.SYSTEM_STATS)
      }
    } catch (error) {
      console.error('Cache warming error:', error)
    }
  }

  /**
   * Warm up all caches
   */
  async warmAll(): Promise<void> {
    await Promise.all([
      this.warmStockSearch(),
      this.warmSystemStats(),
    ])
  }
}

// Create cache warmer instance
export const cacheWarmer = new CacheWarmer()

// Cache invalidation functions
export class CacheInvalidator {
  private cache: CacheManager

  constructor() {
    this.cache = cache
  }

  /**
   * Invalidate user-related cache
   */
  async invalidateUser(userId: string): Promise<void> {
    const patterns = [
      `${CACHE_KEYS.USER_PROFILE}:${userId}`,
      `${CACHE_KEYS.USER_CREDITS}:${userId}`,
      `${CACHE_KEYS.USER_ORDERS}:${userId}`,
    ]

    for (const pattern of patterns) {
      await this.cache.deletePattern(pattern)
    }
  }

  /**
   * Invalidate stock search cache
   */
  async invalidateStockSearch(): Promise<void> {
    await this.cache.deletePattern(`${CACHE_KEYS.STOCK_SEARCH}:*`)
  }

  /**
   * Invalidate AI generation cache
   */
  async invalidateAIGeneration(): Promise<void> {
    await this.cache.deletePattern(`${CACHE_KEYS.AI_GENERATION}:*`)
  }

  /**
   * Invalidate system stats cache
   */
  async invalidateSystemStats(): Promise<void> {
    await this.cache.delete(CACHE_KEYS.SYSTEM_STATS)
  }

  /**
   * Invalidate all cache
   */
  async invalidateAll(): Promise<void> {
    await this.cache.clear()
  }
}

// Create cache invalidator instance
export const cacheInvalidator = new CacheInvalidator()

// Export Redis instance for direct use
export { redis }
