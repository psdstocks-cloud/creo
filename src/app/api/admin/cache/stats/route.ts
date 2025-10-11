import { NextRequest, NextResponse } from 'next/server'
import { cache } from '@/lib/cache'
import { CDNManager } from '@/lib/cdn'

export async function GET(request: NextRequest) {
  try {
    // Get cache statistics
    const cacheStats = await cache.getStats()
    
    // Get cache performance metrics
    const hits = await cache.get<number>('cache:hits') || 0
    const misses = await cache.get<number>('cache:misses') || 0
    const totalRequests = hits + misses
    const hitRate = totalRequests > 0 ? hits / totalRequests : 0
    const missRate = totalRequests > 0 ? misses / totalRequests : 0
    
    // Get CDN statistics
    const cdnStats = await CDNManager.getCacheStats()
    
    // Combine all statistics
    const stats = {
      totalKeys: cacheStats.totalKeys,
      memoryUsage: cacheStats.memoryUsage,
      hitRate: hitRate,
      missRate: missRate,
      totalRequests: totalRequests,
      cachedRequests: hits,
      averageResponseTime: 0, // Would need to track this separately
      cdnHitRate: cdnStats.hitRate,
      cdnTotalRequests: cdnStats.totalRequests,
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching cache stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cache statistics' },
      { status: 500 }
    )
  }
}
