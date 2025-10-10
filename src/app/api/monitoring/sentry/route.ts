import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { withSentryAPIMiddleware } from '@/middleware/sentry'

async function handler(req: NextRequest) {
  try {
    // Get Sentry statistics (mock data for now)
    const stats = {
      errorCount: 12,
      errorRate: 0.02,
      performanceScore: 94,
      activeUsers: 1247,
      responseTime: 245,
      uptime: 99.9,
      timestamp: new Date().toISOString()
    }

    // Track the monitoring request
    Sentry.addBreadcrumb({
      category: 'monitoring',
      message: 'Sentry monitoring data requested',
      level: 'info',
    })

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    Sentry.captureException(error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch Sentry monitoring data' 
      },
      { status: 500 }
    )
  }
}

export const GET = withSentryAPIMiddleware(handler)
