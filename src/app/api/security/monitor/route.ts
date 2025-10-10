import { NextRequest, NextResponse } from 'next/server'
import { securityAuditLogger } from '@/lib/security'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, message, metadata } = body
    
    // Get request information
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || 'unknown'
    const ip = request.ip || headersList.get('x-forwarded-for') || 'unknown'
    const userId = headersList.get('x-user-id') || 'anonymous'
    
    // Log security event
    securityAuditLogger.logSecurityEvent({
      type,
      message,
      ip,
      userAgent,
      userId,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        url: request.url,
        method: request.method,
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Security monitoring error:', error)
    return NextResponse.json(
      { error: 'Failed to log security event' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Security monitoring dashboard endpoint
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const limit = parseInt(searchParams.get('limit') || '100')
  
  // In a real implementation, this would query a security monitoring database
  // For now, return mock data
  const mockEvents = [
    {
      id: '1',
      type: 'suspicious_activity',
      message: 'Multiple failed login attempts detected',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      userId: 'user_123',
      timestamp: new Date().toISOString(),
      metadata: { attempts: 5, timeWindow: '5 minutes' }
    },
    {
      id: '2',
      type: 'rate_limit_exceeded',
      message: 'API rate limit exceeded',
      ip: '10.0.0.1',
      userAgent: 'curl/7.68.0',
      userId: 'anonymous',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      metadata: { endpoint: '/api/stock-search', limit: 100 }
    },
    {
      id: '3',
      type: 'invalid_input',
      message: 'Suspicious input detected',
      ip: '203.0.113.1',
      userAgent: 'Mozilla/5.0...',
      userId: 'user_456',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      metadata: { field: 'search_query', value: '<script>alert(1)</script>' }
    }
  ]
  
  let filteredEvents = mockEvents
  
  if (type) {
    filteredEvents = mockEvents.filter(event => event.type === type)
  }
  
  return NextResponse.json({
    events: filteredEvents.slice(0, limit),
    total: filteredEvents.length,
    hasMore: filteredEvents.length > limit
  })
}
