import { NextRequest, NextResponse } from 'next/server'
import { cache } from '@/lib/cache'

export async function POST(request: NextRequest) {
  try {
    // Clear all cache
    const success = await cache.clear()
    
    if (success) {
      return NextResponse.json({ 
        message: 'Cache cleared successfully',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to clear cache' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error clearing cache:', error)
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}
