import * as Sentry from '@sentry/nextjs'
import { User } from '@supabase/supabase-js'

// Sentry utilities for enhanced error tracking and performance monitoring

/**
 * Set user context in Sentry
 */
export function setUserContext(user: User | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.user_metadata?.full_name || user.email,
    })
    
    // Set additional user context
    Sentry.setContext('user', {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      app_metadata: user.app_metadata,
      user_metadata: user.user_metadata,
    })
  } else {
    Sentry.setUser(null)
  }
}

/**
 * Set additional user context from user profile
 */
export function setUserProfileContext(profile: any) {
  Sentry.setContext('user_profile', {
    credits: profile.credits,
    subscription_plan: profile.subscription_plan,
    subscription_status: profile.subscription_status,
    is_active: profile.is_active,
    created_at: profile.created_at,
    last_login_at: profile.last_login_at,
  })
}

/**
 * Track custom business events
 */
export function trackBusinessEvent(event: string, data?: any) {
  Sentry.addBreadcrumb({
    category: 'business',
    message: event,
    level: 'info',
    data,
  })
  
  Sentry.captureMessage(event, {
    level: 'info',
    tags: {
      type: 'business_event',
    },
    extra: data,
  })
}

/**
 * Track API calls
 */
export function trackAPICall(endpoint: string, method: string, status: number, duration?: number) {
  Sentry.addBreadcrumb({
    category: 'api',
    message: `${method} ${endpoint}`,
    level: status >= 400 ? 'error' : 'info',
    data: {
      endpoint,
      method,
      status,
      duration,
    },
  })
  
  if (status >= 400) {
    Sentry.captureMessage(`API Error: ${method} ${endpoint}`, {
      level: 'error',
      tags: {
        type: 'api_error',
        endpoint,
        method,
        status,
      },
      extra: {
        duration,
      },
    })
  }
}

/**
 * Track order events
 */
export function trackOrderEvent(orderId: string, event: string, data?: any) {
  Sentry.addBreadcrumb({
    category: 'order',
    message: `Order ${orderId}: ${event}`,
    level: 'info',
    data: {
      orderId,
      event,
      ...data,
    },
  })
  
  Sentry.captureMessage(`Order Event: ${event}`, {
    level: 'info',
    tags: {
      type: 'order_event',
      orderId,
    },
    extra: {
      orderId,
      event,
      ...data,
    },
  })
}

/**
 * Track payment events
 */
export function trackPaymentEvent(paymentId: string, event: string, data?: any) {
  Sentry.addBreadcrumb({
    category: 'payment',
    message: `Payment ${paymentId}: ${event}`,
    level: 'info',
    data: {
      paymentId,
      event,
      ...data,
    },
  })
  
  Sentry.captureMessage(`Payment Event: ${event}`, {
    level: 'info',
    tags: {
      type: 'payment_event',
      paymentId,
    },
    extra: {
      paymentId,
      event,
      ...data,
    },
  })
}

/**
 * Track performance metrics
 */
export function trackPerformance(metric: string, value: number, unit: string = 'ms') {
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `${metric}: ${value}${unit}`,
    level: 'info',
    data: {
      metric,
      value,
      unit,
    },
  })
  
  Sentry.captureMessage(`Performance: ${metric}`, {
    level: 'info',
    tags: {
      type: 'performance_metric',
      metric,
    },
    extra: {
      value,
      unit,
    },
  })
}

/**
 * Track user actions
 */
export function trackUserAction(action: string, data?: any) {
  Sentry.addBreadcrumb({
    category: 'user_action',
    message: action,
    level: 'info',
    data,
  })
}

/**
 * Track search events
 */
export function trackSearchEvent(query: string, results: number, filters?: any) {
  Sentry.addBreadcrumb({
    category: 'search',
    message: `Search: ${query}`,
    level: 'info',
    data: {
      query,
      results,
      filters,
    },
  })
  
  Sentry.captureMessage(`Search: ${query}`, {
    level: 'info',
    tags: {
      type: 'search_event',
    },
    extra: {
      query,
      results,
      filters,
    },
  })
}

/**
 * Track download events
 */
export function trackDownloadEvent(fileName: string, fileSize: number, fileType: string) {
  Sentry.addBreadcrumb({
    category: 'download',
    message: `Download: ${fileName}`,
    level: 'info',
    data: {
      fileName,
      fileSize,
      fileType,
    },
  })
  
  Sentry.captureMessage(`Download: ${fileName}`, {
    level: 'info',
    tags: {
      type: 'download_event',
      fileType,
    },
    extra: {
      fileName,
      fileSize,
      fileType,
    },
  })
}

/**
 * Track AI generation events
 */
export function trackAIGenerationEvent(prompt: string, model: string, duration: number, success: boolean) {
  Sentry.addBreadcrumb({
    category: 'ai_generation',
    message: `AI Generation: ${prompt.substring(0, 50)}...`,
    level: success ? 'info' : 'error',
    data: {
      prompt: prompt.substring(0, 100), // Truncate for privacy
      model,
      duration,
      success,
    },
  })
  
  Sentry.captureMessage(`AI Generation: ${success ? 'Success' : 'Failed'}`, {
    level: success ? 'info' : 'error',
    tags: {
      type: 'ai_generation',
      model,
      success,
    },
    extra: {
      prompt: prompt.substring(0, 100), // Truncate for privacy
      model,
      duration,
      success,
    },
  })
}

/**
 * Track admin actions
 */
export function trackAdminAction(action: string, targetType: string, targetId?: string, data?: any) {
  Sentry.addBreadcrumb({
    category: 'admin',
    message: `Admin Action: ${action}`,
    level: 'info',
    data: {
      action,
      targetType,
      targetId,
      ...data,
    },
  })
  
  Sentry.captureMessage(`Admin Action: ${action}`, {
    level: 'info',
    tags: {
      type: 'admin_action',
      action,
      targetType,
    },
    extra: {
      action,
      targetType,
      targetId,
      ...data,
    },
  })
}

/**
 * Track errors with enhanced context
 */
export function trackError(error: Error, context?: any) {
  Sentry.captureException(error, {
    tags: {
      type: 'application_error',
    },
    extra: context,
  })
}

/**
 * Track API errors with request context
 */
export function trackAPIError(error: Error, request: {
  url: string
  method: string
  headers?: any
  body?: any
}) {
  Sentry.captureException(error, {
    tags: {
      type: 'api_error',
      endpoint: request.url,
      method: request.method,
    },
    extra: {
      url: request.url,
      method: request.method,
      headers: request.headers,
      body: request.body,
    },
  })
}

/**
 * Set custom tags for filtering
 */
export function setCustomTags(tags: Record<string, string>) {
  Sentry.setTags(tags)
}

/**
 * Set custom context
 */
export function setCustomContext(key: string, context: any) {
  Sentry.setContext(key, context)
}

/**
 * Clear all context
 */
export function clearContext() {
  Sentry.setUser(null)
  Sentry.setContext('user', null)
  Sentry.setContext('user_profile', null)
}

/**
 * Get current Sentry scope
 */
export function getCurrentScope() {
  return Sentry.getCurrentScope()
}

/**
 * Create a custom transaction for performance monitoring
 */
export function startTransaction(name: string, op: string = 'custom') {
  return Sentry.startTransaction({
    name,
    op,
  })
}

/**
 * Track Core Web Vitals
 */
export function trackWebVitals(metric: {
  name: string
  value: number
  id: string
  delta: number
}) {
  Sentry.addBreadcrumb({
    category: 'web_vitals',
    message: `${metric.name}: ${metric.value}`,
    level: 'info',
    data: metric,
  })
  
  Sentry.captureMessage(`Web Vital: ${metric.name}`, {
    level: 'info',
    tags: {
      type: 'web_vital',
      metric: metric.name,
    },
    extra: metric,
  })
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(feature: string, data?: any) {
  Sentry.addBreadcrumb({
    category: 'feature_usage',
    message: `Feature: ${feature}`,
    level: 'info',
    data: {
      feature,
      ...data,
    },
  })
  
  Sentry.captureMessage(`Feature Usage: ${feature}`, {
    level: 'info',
    tags: {
      type: 'feature_usage',
      feature,
    },
    extra: {
      feature,
      ...data,
    },
  })
}
