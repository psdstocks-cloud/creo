'use client'

import { useEffect, useRef, useCallback } from 'react'
import { trackPerformance, trackWebVitals } from '@/lib/sentry'

/**
 * Hook for tracking performance metrics and Core Web Vitals
 */
export function useSentryPerformance() {
  const performanceObserver = useRef<PerformanceObserver | null>(null)

  // Track Core Web Vitals
  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          trackWebVitals({
            name: 'LCP',
            value: entry.startTime,
            id: entry.id,
            delta: entry.startTime,
          })
        } else if (entry.entryType === 'first-input') {
          const firstInput = entry as PerformanceEventTiming
          trackWebVitals({
            name: 'FID',
            value: firstInput.processingStart - firstInput.startTime,
            id: entry.id,
            delta: firstInput.processingStart - firstInput.startTime,
          })
        } else if (entry.entryType === 'layout-shift') {
          const layoutShift = entry as PerformanceEntry & { value: number }
          if (!layoutShift.hadRecentInput) {
            trackWebVitals({
              name: 'CLS',
              value: layoutShift.value,
              id: entry.id,
              delta: layoutShift.value,
            })
          }
        }
      }
    })

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
      performanceObserver.current = observer
    } catch (e) {
      // Performance Observer not supported
      console.warn('Performance Observer not supported')
    }

    return () => {
      if (performanceObserver.current) {
        performanceObserver.current.disconnect()
      }
    }
  }, [])

  // Track custom performance metrics
  const trackCustomMetric = useCallback((name: string, value: number, unit: string = 'ms') => {
    trackPerformance(name, value, unit)
  }, [])

  // Track page load performance
  const trackPageLoad = useCallback(() => {
    if (typeof window === 'undefined') return

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigation) {
      trackPerformance('DOM Content Loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart)
      trackPerformance('Page Load Complete', navigation.loadEventEnd - navigation.loadEventStart)
      trackPerformance('Time to First Byte', navigation.responseStart - navigation.requestStart)
      trackPerformance('DOM Interactive', navigation.domInteractive - navigation.navigationStart)
    }
  }, [])

  // Track resource loading performance
  const trackResourceLoad = useCallback((resourceName: string) => {
    if (typeof window === 'undefined') return

    const resources = performance.getEntriesByName(resourceName)
    if (resources.length > 0) {
      const resource = resources[resources.length - 1] as PerformanceResourceTiming
      trackPerformance(`Resource Load: ${resourceName}`, resource.duration)
    }
  }, [])

  // Track API call performance
  const trackAPICall = useCallback((endpoint: string, startTime: number) => {
    const duration = performance.now() - startTime
    trackPerformance(`API Call: ${endpoint}`, duration)
  }, [])

  // Track component render performance
  const trackComponentRender = useCallback((componentName: string, startTime: number) => {
    const duration = performance.now() - startTime
    trackPerformance(`Component Render: ${componentName}`, duration)
  }, [])

  // Track user interaction performance
  const trackUserInteraction = useCallback((interaction: string, startTime: number) => {
    const duration = performance.now() - startTime
    trackPerformance(`User Interaction: ${interaction}`, duration)
  }, [])

  return {
    trackCustomMetric,
    trackPageLoad,
    trackResourceLoad,
    trackAPICall,
    trackComponentRender,
    trackUserInteraction,
  }
}

/**
 * Hook for tracking component performance
 */
export function useComponentPerformance(componentName: string) {
  const renderStartTime = useRef<number>(0)

  useEffect(() => {
    renderStartTime.current = performance.now()
  })

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current
    trackPerformance(`Component Mount: ${componentName}`, renderTime)
  }, [componentName])

  const trackComponentAction = useCallback((action: string, startTime: number) => {
    const duration = performance.now() - startTime
    trackPerformance(`Component Action: ${componentName} - ${action}`, duration)
  }, [componentName])

  return {
    trackComponentAction,
  }
}

/**
 * Hook for tracking API performance
 */
export function useAPIPerformance() {
  const trackAPICall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> => {
    const startTime = performance.now()
    
    try {
      const result = await apiCall()
      const duration = performance.now() - startTime
      trackPerformance(`API Success: ${endpoint}`, duration)
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      trackPerformance(`API Error: ${endpoint}`, duration)
      throw error
    }
  }, [])

  return {
    trackAPICall,
  }
}

/**
 * Hook for tracking user interaction performance
 */
export function useInteractionPerformance() {
  const trackInteraction = useCallback((interaction: string, action: () => void) => {
    const startTime = performance.now()
    
    try {
      action()
      const duration = performance.now() - startTime
      trackPerformance(`User Interaction: ${interaction}`, duration)
    } catch (error) {
      const duration = performance.now() - startTime
      trackPerformance(`User Interaction Error: ${interaction}`, duration)
      throw error
    }
  }, [])

  return {
    trackInteraction,
  }
}
