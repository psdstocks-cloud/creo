'use client'

import { useState, useEffect } from 'react'
import { ChartBarIcon, ClockIcon, CpuChipIcon, SignalIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface PerformanceMetrics {
  timestamp: string
  page: string
  metrics: {
    fcp: number // First Contentful Paint
    lcp: number // Largest Contentful Paint
    cls: number // Cumulative Layout Shift
    tbt: number // Total Blocking Time
    si: number  // Speed Index
    ttfb: number // Time to First Byte
  }
  scores: {
    performance: number
    accessibility: number
    'best-practices': number
    seo: number
  }
}

interface PerformanceStats {
  averageFCP: number
  averageLCP: number
  averageCLS: number
  averageTBT: number
  performanceScore: number
  accessibilityScore: number
  bestPracticesScore: number
  seoScore: number
  totalPages: number
  slowPages: string[]
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([])
  const [stats, setStats] = useState<PerformanceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h')

  // Mock data - in production, this would come from your monitoring service
  useEffect(() => {
    const mockMetrics: PerformanceMetrics[] = [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        page: '/',
        metrics: {
          fcp: 1200,
          lcp: 2100,
          cls: 0.05,
          tbt: 150,
          si: 1800,
          ttfb: 200,
        },
        scores: {
          performance: 85,
          accessibility: 92,
          'best-practices': 88,
          seo: 90,
        },
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        page: '/stock-search',
        metrics: {
          fcp: 1500,
          lcp: 2500,
          cls: 0.08,
          tbt: 200,
          si: 2200,
          ttfb: 250,
        },
        scores: {
          performance: 78,
          accessibility: 95,
          'best-practices': 85,
          seo: 88,
        },
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        page: '/ai-generation',
        metrics: {
          fcp: 1800,
          lcp: 2800,
          cls: 0.12,
          tbt: 300,
          si: 2500,
          ttfb: 300,
        },
        scores: {
          performance: 72,
          accessibility: 90,
          'best-practices': 82,
          seo: 85,
        },
      },
    ]

    setMetrics(mockMetrics)

    // Calculate stats
    const calculatedStats: PerformanceStats = {
      averageFCP: mockMetrics.reduce((sum, m) => sum + m.metrics.fcp, 0) / mockMetrics.length,
      averageLCP: mockMetrics.reduce((sum, m) => sum + m.metrics.lcp, 0) / mockMetrics.length,
      averageCLS: mockMetrics.reduce((sum, m) => sum + m.metrics.cls, 0) / mockMetrics.length,
      averageTBT: mockMetrics.reduce((sum, m) => sum + m.metrics.tbt, 0) / mockMetrics.length,
      performanceScore: mockMetrics.reduce((sum, m) => sum + m.scores.performance, 0) / mockMetrics.length,
      accessibilityScore: mockMetrics.reduce((sum, m) => sum + m.scores.accessibility, 0) / mockMetrics.length,
      bestPracticesScore: mockMetrics.reduce((sum, m) => sum + m.scores['best-practices'], 0) / mockMetrics.length,
      seoScore: mockMetrics.reduce((sum, m) => sum + m.scores.seo, 0) / mockMetrics.length,
      totalPages: mockMetrics.length,
      slowPages: mockMetrics.filter(m => m.metrics.lcp > 2500).map(m => m.page),
    }

    setStats(calculatedStats)
    setLoading(false)
  }, [selectedTimeframe])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getMetricStatus = (value: number, threshold: number, isLowerBetter = true) => {
    const isGood = isLowerBetter ? value <= threshold : value >= threshold
    return isGood ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Performance Monitoring</h2>
        <div className="flex space-x-2">
          {(['1h', '24h', '7d', '30d'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">First Contentful Paint</p>
              <p className={`text-2xl font-bold ${getMetricStatus(stats!.averageFCP, 2000)}`}>
                {Math.round(stats!.averageFCP)}ms
              </p>
              <p className="text-xs text-gray-400">Target: &lt; 2000ms</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Largest Contentful Paint</p>
              <p className={`text-2xl font-bold ${getMetricStatus(stats!.averageLCP, 2500)}`}>
                {Math.round(stats!.averageLCP)}ms
              </p>
              <p className="text-xs text-gray-400">Target: &lt; 2500ms</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <SignalIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Cumulative Layout Shift</p>
              <p className={`text-2xl font-bold ${getMetricStatus(stats!.averageCLS, 0.1)}`}>
                {stats!.averageCLS.toFixed(3)}
              </p>
              <p className="text-xs text-gray-400">Target: &lt; 0.1</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <CpuChipIcon className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Blocking Time</p>
              <p className={`text-2xl font-bold ${getMetricStatus(stats!.averageTBT, 300)}`}>
                {Math.round(stats!.averageTBT)}ms
              </p>
              <p className="text-xs text-gray-400">Target: &lt; 300ms</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lighthouse Scores */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lighthouse Scores</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(stats!.performanceScore)}`}>
              Performance: {Math.round(stats!.performanceScore)}
            </div>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(stats!.accessibilityScore)}`}>
              Accessibility: {Math.round(stats!.accessibilityScore)}
            </div>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(stats!.bestPracticesScore)}`}>
              Best Practices: {Math.round(stats!.bestPracticesScore)}
            </div>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(stats!.seoScore)}`}>
              SEO: {Math.round(stats!.seoScore)}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Issues */}
      {stats!.slowPages.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Performance Issues Detected</h4>
          <p className="text-sm text-yellow-700">
            The following pages are experiencing slow loading times: {stats!.slowPages.join(', ')}
          </p>
        </div>
      )}

      {/* Recent Metrics Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Performance Data</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  FCP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LCP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CLS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.map((metric, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {metric.page}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getMetricStatus(metric.metrics.fcp, 2000)}`}>
                    {metric.metrics.fcp}ms
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getMetricStatus(metric.metrics.lcp, 2500)}`}>
                    {metric.metrics.lcp}ms
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getMetricStatus(metric.metrics.cls, 0.1)}`}>
                    {metric.metrics.cls.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(metric.scores.performance)}`}>
                      {metric.scores.performance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-blue-900 mb-3">Performance Recommendations</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Optimize images using WebP format and lazy loading</li>
          <li>• Implement code splitting for better initial load times</li>
          <li>• Add service worker for offline functionality</li>
          <li>• Use CDN for static assets</li>
          <li>• Minimize JavaScript bundle size</li>
        </ul>
      </div>
    </div>
  )
}
