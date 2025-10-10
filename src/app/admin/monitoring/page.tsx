'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { PageLayout } from '@/components/layout/PageLayout'
import { 
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ServerIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Mock monitoring data - in real app, this would come from API
const mockSystemMetrics = {
  cpuUsage: 45.2,
  memoryUsage: 67.8,
  diskUsage: 23.4,
  networkLatency: 12.5,
  uptime: '99.9%',
  responseTime: 145,
  errorRate: 0.02,
  requestsPerMinute: 1250
}

const mockApiMetrics = [
  { time: '00:00', requests: 1200, errors: 2, latency: 140 },
  { time: '01:00', requests: 980, errors: 1, latency: 135 },
  { time: '02:00', requests: 750, errors: 0, latency: 130 },
  { time: '03:00', requests: 650, errors: 1, latency: 125 },
  { time: '04:00', requests: 800, errors: 0, latency: 120 },
  { time: '05:00', requests: 1100, errors: 3, latency: 145 },
  { time: '06:00', requests: 1500, errors: 1, latency: 150 },
  { time: '07:00', requests: 1800, errors: 2, latency: 160 },
  { time: '08:00', requests: 2200, errors: 4, latency: 170 },
  { time: '09:00', requests: 2500, errors: 2, latency: 165 },
  { time: '10:00', requests: 2800, errors: 3, latency: 155 },
  { time: '11:00', requests: 3000, errors: 1, latency: 145 },
]

const mockErrorLogs = [
  {
    id: '1',
    level: 'error',
    message: 'Failed to process payment for order ORD-001',
    timestamp: '2024-01-20T10:30:00Z',
    source: 'payment-service',
    userId: 'user-123',
    orderId: 'ORD-001'
  },
  {
    id: '2',
    level: 'warning',
    message: 'High memory usage detected on server-1',
    timestamp: '2024-01-20T10:25:00Z',
    source: 'system-monitor',
    userId: null,
    orderId: null
  },
  {
    id: '3',
    level: 'error',
    message: 'NEHTW API rate limit exceeded',
    timestamp: '2024-01-20T10:20:00Z',
    source: 'nehtw-client',
    userId: 'user-456',
    orderId: 'ORD-002'
  },
  {
    id: '4',
    level: 'info',
    message: 'User registration completed successfully',
    timestamp: '2024-01-20T10:15:00Z',
    source: 'auth-service',
    userId: 'user-789',
    orderId: null
  },
  {
    id: '5',
    level: 'error',
    message: 'Database connection timeout',
    timestamp: '2024-01-20T10:10:00Z',
    source: 'database',
    userId: null,
    orderId: null
  }
]

const mockCostData = [
  { service: 'NEHTW API', cost: 1250.50, usage: '15,000 requests' },
  { service: 'Supabase', cost: 89.99, usage: '2.5M queries' },
  { service: 'Stripe', cost: 234.75, usage: '1,200 transactions' },
  { service: 'Vercel', cost: 45.00, usage: '500GB bandwidth' },
  { service: 'Sentry', cost: 29.99, usage: '10K errors' },
]

const mockPerformanceData = [
  { metric: 'Page Load Time', value: 1.2, target: 2.0, unit: 's' },
  { metric: 'API Response Time', value: 145, target: 200, unit: 'ms' },
  { metric: 'Database Query Time', value: 25, target: 50, unit: 'ms' },
  { metric: 'Image Processing', value: 0.8, target: 1.5, unit: 's' },
  { metric: 'AI Generation', value: 12.5, target: 30, unit: 's' },
]

export default function MonitoringPage() {
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Auto refresh effect
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // In real app, this would refresh data
      console.log('Refreshing monitoring data...')
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  if (loading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-500">Please sign in to access system monitoring.</p>
        </div>
      </div>
    )
  }

  const getErrorLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-600 bg-red-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'info':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="CPU Usage"
            value={`${mockSystemMetrics.cpuUsage}%`}
            icon={CpuChipIcon}
            color={mockSystemMetrics.cpuUsage > 80 ? 'red' : mockSystemMetrics.cpuUsage > 60 ? 'yellow' : 'green'}
            trend="+2.1%"
          />
          <MetricCard
            title="Memory Usage"
            value={`${mockSystemMetrics.memoryUsage}%`}
            icon={ServerIcon}
            color={mockSystemMetrics.memoryUsage > 80 ? 'red' : mockSystemMetrics.memoryUsage > 60 ? 'yellow' : 'green'}
            trend="+1.5%"
          />
          <MetricCard
            title="Response Time"
            value={`${mockSystemMetrics.responseTime}ms`}
            icon={ClockIcon}
            color={mockSystemMetrics.responseTime > 500 ? 'red' : mockSystemMetrics.responseTime > 200 ? 'yellow' : 'green'}
            trend="-5.2%"
          />
          <MetricCard
            title="Error Rate"
            value={`${(mockSystemMetrics.errorRate * 100).toFixed(2)}%`}
            icon={ExclamationTriangleIcon}
            color={mockSystemMetrics.errorRate > 0.05 ? 'red' : mockSystemMetrics.errorRate > 0.01 ? 'yellow' : 'green'}
            trend="-0.1%"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* API Metrics Chart */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockApiMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="requests" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="errors" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Response Time Chart */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockApiMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="latency" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              {mockPerformanceData.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{metric.metric}</p>
                    <p className="text-xs text-gray-500">Target: {metric.target}{metric.unit}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.value <= metric.target ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      metric.value <= metric.target ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.value}{metric.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Costs</h3>
            <div className="space-y-4">
              {mockCostData.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{service.service}</p>
                    <p className="text-xs text-gray-500">{service.usage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${service.cost.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Total</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${mockCostData.reduce((sum, service) => sum + service.cost, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Logs */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Error Logs</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              View All Logs
            </button>
          </div>
          <div className="space-y-3">
            {mockErrorLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 bg-white/50 rounded-lg"
              >
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getErrorLevelColor(log.level)}`}>
                  {log.level.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{log.message}</p>
                  <p className="text-xs text-gray-500">
                    {log.source} • {new Date(log.timestamp).toLocaleString()}
                    {log.userId && ` • User: ${log.userId}`}
                    {log.orderId && ` • Order: ${log.orderId}`}
                  </p>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <EyeIcon className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
  )
}

// Metric Card Component
function MetricCard({ title, value, icon: Icon, color, trend }: {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color: 'green' | 'yellow' | 'red'
  trend: string
}) {
  const colorClasses = {
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
  }

  const isPositive = trend.startsWith('+')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className={`text-sm flex items-center mt-1 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? (
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
            )}
            {trend}
          </p>
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}
