import { NextRequest, NextResponse } from 'next/server'
import { cache } from '@/lib/cache'

export async function GET(request: NextRequest) {
  try {
    // Get cache health status
    const health = await cache.health()
    
    return NextResponse.json(health)
  } catch (error) {
    console.error('Error fetching cache health:', error)
    return NextResponse.json(
      { 
        status: 'unhealthy',
        latency: 0,
        error: 'Failed to check cache health'
      },
      { status: 500 }
    )
  }
}
