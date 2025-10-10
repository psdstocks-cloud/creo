import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { trackAPICall, trackAPIError } from '@/lib/sentry'

/**
 * Sentry middleware for API routes
 */
export function withSentryAPIMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = performance.now()
    const url = new URL(req.url)
    const endpoint = url.pathname
    const method = req.method

    // Set request context
    Sentry.setContext('request', {
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
    })

    try {
      // Execute the handler
      const response = await handler(req)
      
      // Track successful API call
      const duration = performance.now() - startTime
      trackAPICall(endpoint, method, response.status, duration)
      
      return response
    } catch (error) {
      // Track API error
      const duration = performance.now() - startTime
      trackAPIError(error as Error, {
        url: req.url,
        method: req.method,
        headers: Object.fromEntries(req.headers.entries()),
        body: req.body,
      })
      
      // Re-throw the error
      throw error
    }
  }
}

/**
 * Sentry middleware for page routes
 */
export function withSentryPageMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = performance.now()
    const url = new URL(req.url)
    const pathname = url.pathname

    // Set request context
    Sentry.setContext('request', {
      url: req.url,
      method: req.method,
      pathname,
      headers: Object.fromEntries(req.headers.entries()),
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
    })

    try {
      // Execute the handler
      const response = await handler(req)
      
      // Track page performance
      const duration = performance.now() - startTime
      trackAPICall(pathname, 'GET', response.status, duration)
      
      return response
    } catch (error) {
      // Track page error
      const duration = performance.now() - startTime
      trackAPIError(error as Error, {
        url: req.url,
        method: req.method,
        headers: Object.fromEntries(req.headers.entries()),
      })
      
      // Re-throw the error
      throw error
    }
  }
}

/**
 * Sentry middleware for Edge runtime
 */
export function withSentryEdgeMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = performance.now()
    const url = new URL(req.url)
    const endpoint = url.pathname
    const method = req.method

    // Set request context
    Sentry.setContext('request', {
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
    })

    try {
      // Execute the handler
      const response = await handler(req)
      
      // Track successful request
      const duration = performance.now() - startTime
      trackAPICall(endpoint, method, response.status, duration)
      
      return response
    } catch (error) {
      // Track error
      const duration = performance.now() - startTime
      trackAPIError(error as Error, {
        url: req.url,
        method: req.method,
        headers: Object.fromEntries(req.headers.entries()),
      })
      
      // Re-throw the error
      throw error
    }
  }
}
