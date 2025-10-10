'use client'
import { useOrderAnalytics } from '@/hooks/useOrderManagement'
import { useUser } from '@/contexts/UserContext'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CloudArrowDownIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export function AnalyticsDashboard() {
  const { user } = useUser()
  const { data: analytics, isLoading, error } = useOrderAnalytics()

  if (!user) {
    return (
      <div className="text-center py-12">
        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
        <p className="text-gray-500">Please sign in to view analytics.</p>
      </div>
    )
  }

  if (isLoading) {
    return <AnalyticsSkeleton />
  }

  if (error || !analytics) {
    return (
      <div className="text-center py-12">
        <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Analytics</h3>
        <p className="text-gray-500">Please try refreshing the page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Orders"
          value={analytics.totalOrders}
          change={getOrderGrowth(analytics.monthlyData)}
          icon={ChartBarIcon}
          color="blue"
        />
        <AnalyticsCard
          title="Completed Orders"
          value={analytics.completedOrders}
          change={getCompletionRate(analytics)}
          icon={CheckCircleIcon}
          color="green"
        />
        <AnalyticsCard
          title="Total Spent"
          value={`$${analytics.totalSpent.toFixed(2)}`}
          change={getSpendingGrowth(analytics.monthlyData)}
          icon={CurrencyDollarIcon}
          color="purple"
        />
        <AnalyticsCard
          title="Downloads"
          value={analytics.downloads.totalDownloads}
          change={getDownloadGrowth(analytics.downloads.downloadsByDay)}
          icon={CloudArrowDownIcon}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Type Breakdown */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Types</h3>
          <OrderTypeChart data={analytics.typeBreakdown} />
        </div>

        {/* Status Breakdown */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
          <OrderStatusChart data={analytics.statusBreakdown} />
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
        <MonthlyTrendsChart data={analytics.monthlyData} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Downloads</h3>
        <RecentDownloadsList downloads={analytics.downloads.recentDownloads} />
      </div>
    </div>
  )
}

// Analytics Card Component
function AnalyticsCard({ title, value, change, icon: Icon, color }: {
  title: string
  value: string | number
  change?: number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }

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
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}

// Order Type Chart Component
function OrderTypeChart({ data }: { data: { stock: number; ai: number } }) {
  const total = data.stock + data.ai
  const stockPercentage = total > 0 ? (data.stock / total) * 100 : 0
  const aiPercentage = total > 0 ? (data.ai / total) * 100 : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
          <span className="text-sm font-medium text-gray-700">Stock Media</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">{data.stock}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-blue-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${stockPercentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
          <span className="text-sm font-medium text-gray-700">AI Generation</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">{data.ai}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-purple-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${aiPercentage}%` }}
          transition={{ duration: 1, delay: 0.4 }}
        />
      </div>
    </div>
  )
}

// Order Status Chart Component
function OrderStatusChart({ data }: { data: { completed: number; processing: number; failed: number; cancelled: number } }) {
  const statuses = [
    { name: 'Completed', value: data.completed, color: 'bg-green-500' },
    { name: 'Processing', value: data.processing, color: 'bg-blue-500' },
    { name: 'Failed', value: data.failed, color: 'bg-red-500' },
    { name: 'Cancelled', value: data.cancelled, color: 'bg-gray-500' },
  ]

  return (
    <div className="space-y-3">
      {statuses.map((status, index) => (
        <div key={status.name} className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-3 h-3 ${status.color} rounded-full mr-3`}></div>
            <span className="text-sm font-medium text-gray-700">{status.name}</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{status.value}</span>
        </div>
      ))}
    </div>
  )
}

// Monthly Trends Chart Component
function MonthlyTrendsChart({ data }: { data: Array<{ month: string; orders: number; spent: number }> }) {
  const maxOrders = Math.max(...data.map(d => d.orders), 1)
  const maxSpent = Math.max(...data.map(d => d.spent), 1)

  return (
    <div className="space-y-6">
      {/* Orders Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Orders by Month</h4>
        <div className="flex items-end space-x-2 h-32">
          {data.map((month, index) => (
            <div key={month.month} className="flex-1 flex flex-col items-center">
              <motion.div
                className="bg-blue-500 rounded-t w-full"
                initial={{ height: 0 }}
                animate={{ height: `${(month.orders / maxOrders) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
              <span className="text-xs text-gray-500 mt-2">
                {new Date(month.month).toLocaleDateString('en', { month: 'short' })}
              </span>
              <span className="text-xs font-medium text-gray-900">{month.orders}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Spending by Month</h4>
        <div className="flex items-end space-x-2 h-32">
          {data.map((month, index) => (
            <div key={month.month} className="flex-1 flex flex-col items-center">
              <motion.div
                className="bg-purple-500 rounded-t w-full"
                initial={{ height: 0 }}
                animate={{ height: `${(month.spent / maxSpent) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.4 }}
              />
              <span className="text-xs text-gray-500 mt-2">
                {new Date(month.month).toLocaleDateString('en', { month: 'short' })}
              </span>
              <span className="text-xs font-medium text-gray-900">${month.spent.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Recent Downloads List Component
function RecentDownloadsList({ downloads }: { downloads: Array<{ orderId: string; fileId: string; timestamp: string }> }) {
  if (downloads.length === 0) {
    return (
      <div className="text-center py-8">
        <CloudArrowDownIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">No recent downloads</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {downloads.slice(0, 5).map((download, index) => (
        <motion.div
          key={`${download.orderId}-${download.fileId}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center">
            <CloudArrowDownIcon className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Order #{download.orderId.slice(0, 8)}...
              </p>
              <p className="text-xs text-gray-500">
                {new Date(download.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-400">Downloaded</span>
        </motion.div>
      ))}
    </div>
  )
}

// Analytics Skeleton Component
function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper functions
function getOrderGrowth(monthlyData: Array<{ month: string; orders: number; spent: number }>): number {
  if (monthlyData.length < 2) return 0
  const current = monthlyData[monthlyData.length - 1]?.orders || 0
  const previous = monthlyData[monthlyData.length - 2]?.orders || 0
  return previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0
}

function getCompletionRate(analytics: {
  totalOrders: number
  completedOrders: number
  processingOrders: number
  totalSpent: number
  monthlyData: Array<{ month: string; orders: number; spent: number }>
  typeBreakdown: { stock: number; ai: number }
  statusBreakdown: { completed: number; processing: number; failed: number; cancelled: number }
  downloads: { totalDownloads: number; recentDownloads: Array<{ orderId: string; fileId: string; timestamp: string }>; downloadsByDay: Array<{ day: string; count: number }> }
}): number {
  const total = analytics.totalOrders
  const completed = analytics.completedOrders
  return total > 0 ? Math.round((completed / total) * 100) : 0
}

function getSpendingGrowth(monthlyData: Array<{ month: string; orders: number; spent: number }>): number {
  if (monthlyData.length < 2) return 0
  const current = monthlyData[monthlyData.length - 1]?.spent || 0
  const previous = monthlyData[monthlyData.length - 2]?.spent || 0
  return previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0
}

function getDownloadGrowth(downloadsByDay: Array<{ day: string; count: number }>): number {
  if (downloadsByDay.length < 2) return 0
  const current = downloadsByDay[downloadsByDay.length - 1]?.count || 0
  const previous = downloadsByDay[downloadsByDay.length - 2]?.count || 0
  return previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0
}
