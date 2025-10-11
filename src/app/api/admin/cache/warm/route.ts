import { NextRequest, NextResponse } from 'next/server'
import { cacheWarmer } from '@/lib/cache-aware-client'

export async function POST(request: NextRequest) {
  try {
    // Warm up all caches
    await cacheWarmer.warmAll()
    
    return NextResponse.json({ 
      message: 'Cache warming completed successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error warming cache:', error)
    return NextResponse.json(
      { error: 'Failed to warm cache' },
      { status: 500 }
    )
  }
}
