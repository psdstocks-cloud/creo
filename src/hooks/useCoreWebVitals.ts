import { useEffect, useState } from 'react'

interface CoreWebVitals {
  fcp: number | null // First Contentful Paint
  lcp: number | null // Largest Contentful Paint
  cls: number | null // Cumulative Layout Shift
  fid: number | null // First Input Delay
  ttfb: number | null // Time to First Byte
}

interface WebVitalThresholds {
  fcp: number
  lcp: number
  cls: number
  fid: number
  ttfb: number
}

const THRESHOLDS: WebVitalThresholds = {
  fcp: 2000, // 2 seconds
  lcp: 2500, // 2.5 seconds
  cls: 0.1,  // 0.1
  fid: 100,  // 100ms
  ttfb: 600, // 600ms
}

export function useCoreWebVitals() {
  const [vitals, setVitals] = useState<CoreWebVitals>({
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    ttfb: null,
  })

  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if PerformanceObserver is supported
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    setIsSupported(true)

    // First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint')
        if (fcpEntry) {
          setVitals(prev => ({ ...prev, fcp: fcpEntry.startTime }))
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })
    } catch (error) {
      console.warn('FCP observer not supported:', error)
    }

    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          setVitals(prev => ({ ...prev, lcp: lastEntry.startTime }))
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (error) {
      console.warn('LCP observer not supported:', error)
    }

    // Cumulative Layout Shift
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        setVitals(prev => ({ ...prev, cls: clsValue }))
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (error) {
      console.warn('CLS observer not supported:', error)
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          setVitals(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }))
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (error) {
      console.warn('FID observer not supported:', error)
    }

    // Time to First Byte (from navigation timing)
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        setVitals(prev => ({ ...prev, ttfb: navigation.responseStart - navigation.requestStart }))
      }
    } catch (error) {
      console.warn('TTFB calculation failed:', error)
    }

    // Cleanup observers on unmount
    return () => {
      // Note: PerformanceObserver doesn't have a disconnect method in all browsers
      // This is a limitation of the current implementation
    }
  }, [])

  const getVitalStatus = (value: number | null, threshold: number, isLowerBetter = true): 'good' | 'needs-improvement' | 'poor' => {
    if (value === null) return 'poor'
    
    const isGood = isLowerBetter ? value <= threshold : value >= threshold
    const isPoor = isLowerBetter ? value > threshold * 1.5 : value < threshold * 0.5
    
    if (isGood) return 'good'
    if (isPoor) return 'poor'
    return 'needs-improvement'
  }

  const getVitalColor = (status: 'good' | 'needs-improvement' | 'poor') => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'needs-improvement': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
    }
  }

  const getVitalLabel = (status: 'good' | 'needs-improvement' | 'poor') => {
    switch (status) {
      case 'good': return 'Good'
      case 'needs-improvement': return 'Needs Improvement'
      case 'poor': return 'Poor'
    }
  }

  const vitalsStatus = {
    fcp: getVitalStatus(vitals.fcp, THRESHOLDS.fcp),
    lcp: getVitalStatus(vitals.lcp, THRESHOLDS.lcp),
    cls: getVitalStatus(vitals.cls, THRESHOLDS.cls),
    fid: getVitalStatus(vitals.fid, THRESHOLDS.fid),
    ttfb: getVitalStatus(vitals.ttfb, THRESHOLDS.ttfb),
  }

  const overallScore = Object.values(vitalsStatus).reduce((score, status) => {
    switch (status) {
      case 'good': return score + 1
      case 'needs-improvement': return score + 0.5
      case 'poor': return score + 0
      default: return score
    }
  }, 0) / Object.keys(vitalsStatus).length

  return {
    vitals,
    vitalsStatus,
    thresholds: THRESHOLDS,
    isSupported,
    overallScore,
    getVitalColor,
    getVitalLabel,
  }
}
