'use client'

import { useCoreWebVitals } from '@/hooks/useCoreWebVitals'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  ClockIcon, 
  CpuChipIcon, 
  SignalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface PerformanceDashboardProps {
  className?: string
  showDetails?: boolean
}

export function PerformanceDashboard({ className = '', showDetails = true }: PerformanceDashboardProps) {
  const { 
    vitals, 
    vitalsStatus, 
    thresholds, 
    isSupported, 
    overallScore, 
    getVitalColor, 
    getVitalLabel 
  } = useCoreWebVitals()

  if (!isSupported) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
          <p className="text-sm text-yellow-800">
            Performance monitoring is not supported in this browser.
          </p>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100'
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreIcon = (status: 'good' | 'needs-improvement' | 'poor') => {
    switch (status) {
      case 'good': return <CheckCircleIcon className="h-4 w-4" />
      case 'needs-improvement': return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'poor': return <XCircleIcon className="h-4 w-4" />
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(overallScore)}`}>
            Overall: {Math.round(overallScore * 100)}%
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* First Contentful Paint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">FCP</span>
              </div>
              {getScoreIcon(vitalsStatus.fcp)}
            </div>
            <div className="space-y-1">
              <p className={`text-2xl font-bold ${getVitalColor(vitalsStatus.fcp)}`}>
                {vitals.fcp ? `${Math.round(vitals.fcp)}ms` : '--'}
              </p>
              <p className="text-xs text-gray-500">
                Target: &lt; {thresholds.fcp}ms
              </p>
              <p className="text-xs text-gray-400">
                {getVitalLabel(vitalsStatus.fcp)}
              </p>
            </div>
          </motion.div>

          {/* Largest Contentful Paint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">LCP</span>
              </div>
              {getScoreIcon(vitalsStatus.lcp)}
            </div>
            <div className="space-y-1">
              <p className={`text-2xl font-bold ${getVitalColor(vitalsStatus.lcp)}`}>
                {vitals.lcp ? `${Math.round(vitals.lcp)}ms` : '--'}
              </p>
              <p className="text-xs text-gray-500">
                Target: &lt; {thresholds.lcp}ms
              </p>
              <p className="text-xs text-gray-400">
                {getVitalLabel(vitalsStatus.lcp)}
              </p>
            </div>
          </motion.div>

          {/* Cumulative Layout Shift */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <SignalIcon className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">CLS</span>
              </div>
              {getScoreIcon(vitalsStatus.cls)}
            </div>
            <div className="space-y-1">
              <p className={`text-2xl font-bold ${getVitalColor(vitalsStatus.cls)}`}>
                {vitals.cls !== null ? vitals.cls.toFixed(3) : '--'}
              </p>
              <p className="text-xs text-gray-500">
                Target: &lt; {thresholds.cls}
              </p>
              <p className="text-xs text-gray-400">
                {getVitalLabel(vitalsStatus.cls)}
              </p>
            </div>
          </motion.div>

          {/* First Input Delay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <CpuChipIcon className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">FID</span>
              </div>
              {getScoreIcon(vitalsStatus.fid)}
            </div>
            <div className="space-y-1">
              <p className={`text-2xl font-bold ${getVitalColor(vitalsStatus.fid)}`}>
                {vitals.fid ? `${Math.round(vitals.fid)}ms` : '--'}
              </p>
              <p className="text-xs text-gray-500">
                Target: &lt; {thresholds.fid}ms
              </p>
              <p className="text-xs text-gray-400">
                {getVitalLabel(vitalsStatus.fid)}
              </p>
            </div>
          </motion.div>

          {/* Time to First Byte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-indigo-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">TTFB</span>
              </div>
              {getScoreIcon(vitalsStatus.ttfb)}
            </div>
            <div className="space-y-1">
              <p className={`text-2xl font-bold ${getVitalColor(vitalsStatus.ttfb)}`}>
                {vitals.ttfb ? `${Math.round(vitals.ttfb)}ms` : '--'}
              </p>
              <p className="text-xs text-gray-500">
                Target: &lt; {thresholds.ttfb}ms
              </p>
              <p className="text-xs text-gray-400">
                {getVitalLabel(vitalsStatus.ttfb)}
              </p>
            </div>
          </motion.div>

          {/* Performance Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Score</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(overallScore * 100)}%
              </p>
              <p className="text-xs text-gray-500">
                Overall Performance
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallScore * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Performance Tips</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-700 mb-1">Optimize Images</p>
                <p>Use WebP format and lazy loading to improve LCP</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Code Splitting</p>
                <p>Split JavaScript bundles to reduce initial load time</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Caching</p>
                <p>Implement proper caching strategies for static assets</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">CDN</p>
                <p>Use a CDN to serve assets from locations closer to users</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
