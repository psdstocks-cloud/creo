import { cache, CACHE_KEYS, CACHE_TTL } from './cache'
import { CDNManager } from './cdn'

// Cache-aware API client configuration
export interface CacheAwareClientConfig {
  baseURL: string
  defaultTTL?: number
  enableCache?: boolean
  enableCDN?: boolean
}

// Cache-aware API client class
export class CacheAwareClient {
  private baseURL: string
  private defaultTTL: number
  private enableCache: boolean
  private enableCDN: boolean

  constructor(config: CacheAwareClientConfig) {
    this.baseURL = config.baseURL
    this.defaultTTL = config.defaultTTL || CACHE_TTL.MEDIUM
    this.enableCache = config.enableCache ?? true
    this.enableCDN = config.enableCDN ?? true
  }

  /**
   * Make a GET request with caching
   */
  async get<T>(
    endpoint: string,
    options: {
      ttl?: number
      cacheKey?: string
      headers?: Record<string, string>
      params?: Record<string, any>
    } = {}
  ): Promise<T> {
    const {
      ttl = this.defaultTTL,
      cacheKey,
      headers = {},
      params = {},
    } = options

    // Build URL with query parameters
    const url = new URL(endpoint, this.baseURL)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })

    // Generate cache key
    const key = cacheKey || `api:${endpoint}:${JSON.stringify(params)}`

    // Try to get from cache first
    if (this.enableCache) {
      try {
        const cached = await cache.get<T>(key)
        if (cached !== null) {
          return cached
        }
      } catch (error) {
        console.error('Cache get error:', error)
      }
    }

    // Make API request
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Store in cache
      if (this.enableCache) {
        try {
          await cache.set(key, data, ttl)
        } catch (error) {
          console.error('Cache set error:', error)
        }
      }

      return data
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  /**
   * Make a POST request (no caching)
   */
  async post<T>(
    endpoint: string,
    data: any,
    options: {
      headers?: Record<string, string>
      invalidateCache?: string[]
    } = {}
  ): Promise<T> {
    const { headers = {}, invalidateCache = [] } = options

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      // Invalidate related caches
      if (this.enableCache && invalidateCache.length > 0) {
        for (const pattern of invalidateCache) {
          try {
            await cache.deletePattern(pattern)
          } catch (error) {
            console.error('Cache invalidation error:', error)
          }
        }
      }

      return result
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  /**
   * Make a PUT request (no caching)
   */
  async put<T>(
    endpoint: string,
    data: any,
    options: {
      headers?: Record<string, string>
      invalidateCache?: string[]
    } = {}
  ): Promise<T> {
    const { headers = {}, invalidateCache = [] } = options

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      // Invalidate related caches
      if (this.enableCache && invalidateCache.length > 0) {
        for (const pattern of invalidateCache) {
          try {
            await cache.deletePattern(pattern)
          } catch (error) {
            console.error('Cache invalidation error:', error)
          }
        }
      }

      return result
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  /**
   * Make a DELETE request (no caching)
   */
  async delete<T>(
    endpoint: string,
    options: {
      headers?: Record<string, string>
      invalidateCache?: string[]
    } = {}
  ): Promise<T> {
    const { headers = {}, invalidateCache = [] } = options

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      // Invalidate related caches
      if (this.enableCache && invalidateCache.length > 0) {
        for (const pattern of invalidateCache) {
          try {
            await cache.deletePattern(pattern)
          } catch (error) {
            console.error('Cache invalidation error:', error)
          }
        }
      }

      return result
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  /**
   * Get or set cached value
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    return await cache.getOrSet(key, fetcher, ttl)
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidate(pattern: string): Promise<number> {
    return await cache.deletePattern(pattern)
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<boolean> {
    return await cache.clear()
  }
}

// Specialized clients for different services
export class StockMediaClient extends CacheAwareClient {
  constructor(baseURL: string) {
    super({
      baseURL,
      defaultTTL: CACHE_TTL.STOCK_SEARCH,
      enableCache: true,
      enableCDN: true,
    })
  }

  /**
   * Search stock media with caching
   */
  async searchStockMedia(query: string, filters: any = {}) {
    return await this.get('/api/stock/search', {
      params: { query, ...filters },
      cacheKey: `${CACHE_KEYS.STOCK_SEARCH}:${query}:${JSON.stringify(filters)}`,
      ttl: CACHE_TTL.STOCK_SEARCH,
    })
  }

  /**
   * Get stock providers with caching
   */
  async getStockProviders() {
    return await this.get('/api/stock/providers', {
      cacheKey: CACHE_KEYS.STOCK_PROVIDERS,
      ttl: CACHE_TTL.STOCK_PROVIDERS,
    })
  }

  /**
   * Get stock categories with caching
   */
  async getStockCategories() {
    return await this.get('/api/stock/categories', {
      cacheKey: CACHE_KEYS.STOCK_CATEGORIES,
      ttl: CACHE_TTL.STOCK_PROVIDERS,
    })
  }
}

export class AIGenerationClient extends CacheAwareClient {
  constructor(baseURL: string) {
    super({
      baseURL,
      defaultTTL: CACHE_TTL.AI_GENERATION,
      enableCache: true,
      enableCDN: true,
    })
  }

  /**
   * Get AI styles with caching
   */
  async getAIStyles() {
    return await this.get('/api/ai/styles', {
      cacheKey: CACHE_KEYS.AI_STYLES,
      ttl: CACHE_TTL.AI_GENERATION,
    })
  }

  /**
   * Get AI presets with caching
   */
  async getAIPresets() {
    return await this.get('/api/ai/presets', {
      cacheKey: CACHE_KEYS.AI_PRESETS,
      ttl: CACHE_TTL.AI_GENERATION,
    })
  }

  /**
   * Generate AI image (no caching)
   */
  async generateImage(prompt: string, options: any = {}) {
    return await this.post('/api/ai/generate', {
      prompt,
      ...options,
    }, {
      invalidateCache: [`${CACHE_KEYS.AI_GENERATION}:*`],
    })
  }
}

export class SystemClient extends CacheAwareClient {
  constructor(baseURL: string) {
    super({
      baseURL,
      defaultTTL: CACHE_TTL.SYSTEM_STATS,
      enableCache: true,
      enableCDN: true,
    })
  }

  /**
   * Get system stats with caching
   */
  async getSystemStats() {
    return await this.get('/api/system/stats', {
      cacheKey: CACHE_KEYS.SYSTEM_STATS,
      ttl: CACHE_TTL.SYSTEM_STATS,
    })
  }

  /**
   * Get API usage stats with caching
   */
  async getAPIUsage() {
    return await this.get('/api/system/usage', {
      cacheKey: CACHE_KEYS.API_USAGE,
      ttl: CACHE_TTL.SYSTEM_STATS,
    })
  }
}

// Create client instances
export const stockMediaClient = new StockMediaClient(process.env.NEXT_PUBLIC_API_URL || '')
export const aiGenerationClient = new AIGenerationClient(process.env.NEXT_PUBLIC_API_URL || '')
export const systemClient = new SystemClient(process.env.NEXT_PUBLIC_API_URL || '')

// Cache warming functions
export class CacheWarmer {
  /**
   * Warm up all caches
   */
  static async warmAll(): Promise<void> {
    try {
      // Warm up stock media cache
      await stockMediaClient.getStockProviders()
      await stockMediaClient.getStockCategories()
      
      // Warm up AI generation cache
      await aiGenerationClient.getAIStyles()
      await aiGenerationClient.getAIPresets()
      
      // Warm up system cache
      await systemClient.getSystemStats()
      
      console.log('Cache warming completed')
    } catch (error) {
      console.error('Cache warming error:', error)
    }
  }

  /**
   * Warm up stock media cache
   */
  static async warmStockMedia(): Promise<void> {
    try {
      await stockMediaClient.getStockProviders()
      await stockMediaClient.getStockCategories()
      console.log('Stock media cache warming completed')
    } catch (error) {
      console.error('Stock media cache warming error:', error)
    }
  }

  /**
   * Warm up AI generation cache
   */
  static async warmAIGeneration(): Promise<void> {
    try {
      await aiGenerationClient.getAIStyles()
      await aiGenerationClient.getAIPresets()
      console.log('AI generation cache warming completed')
    } catch (error) {
      console.error('AI generation cache warming error:', error)
    }
  }
}

// Export cache warmer
export const cacheWarmer = new CacheWarmer()
