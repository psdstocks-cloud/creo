'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { PageLayout } from '@/components/layout/PageLayout'
import { 
  UsersIcon, 
  ClipboardDocumentListIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { PerformanceMonitor } from '@/components/admin/PerformanceMonitor'
import { PerformanceDashboard } from '@/components/ui/PerformanceDashboard'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Mock data - in real app, this would come from API
const mockStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalOrders: 3456,
  completedOrders: 3123,
  totalRevenue: 45678.90,
  monthlyRevenue: 12345.67,
  averageOrderValue: 13.22,
  conversionRate: 12.5,
  userGrowth: 8.3,
  orderGrowth: 15.2
}

const mockChartData = [
  { name: 'Jan', users: 400, orders: 240, revenue: 2400 },
  { name: 'Feb', users: 300, orders: 139, revenue: 2210 },
  { name: 'Mar', users: 200, orders: 980, revenue: 2290 },
  { name: 'Apr', users: 278, orders: 390, revenue: 2000 },
  { name: 'May', users: 189, orders: 480, revenue: 2181 },
  { name: 'Jun', users: 239, orders: 380, revenue: 2500 },
  { name: 'Jul', users: 349, orders: 430, revenue: 2100 },
]

const mockOrderStatusData = [
  { name: 'Completed', value: 3123, color: '#10B981' },
  { name: 'Processing', value: 234, color: '#F59E0B' },
  { name: 'Failed', value: 99, color: '#EF4444' },
]

const mockRecentActivity = [
  { id: 1, type: 'user', action: 'New user registered', user: 'john.doe@example.com', time: '2 minutes ago', status: 'success' },
  { id: 2, type: 'order', action: 'Order completed', user: 'jane.smith@example.com', time: '5 minutes ago', status: 'success' },
  { id: 3, type: 'payment', action: 'Payment processed', user: 'bob.wilson@example.com', time: '8 minutes ago', status: 'success' },
  { id: 4, type: 'order', action: 'Order failed', user: 'alice.brown@example.com', time: '12 minutes ago', status: 'error' },
  { id: 5, type: 'user', action: 'User suspended', user: 'charlie.davis@example.com', time: '15 minutes ago', status: 'warning' },
]

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading || isLoading) {
    return (
      <PageLayout title="Admin Dashboard" subtitle="System overview and monitoring">
        <div className="animate-pulse space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </PageLayout>
    )
  }

  if (!user) {
    return (
      <PageLayout title="Admin Dashboard" subtitle="System overview and monitoring">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-500">Please sign in to access the admin dashboard.</p>
        </div>
      </PageLayout>
    )
  }

  // Check if user is admin (in real app, this would check user role)
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.email === 'admin@creo.com'

  if (!isAdmin) {
    return (
      <PageLayout title="Admin Dashboard" subtitle="System overview and monitoring">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500">You don't have permission to access the admin dashboard.</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Users"
            value={mockStats.totalUsers.toLocaleString()}
            change={mockStats.userGrowth}
            icon={UsersIcon}
            color="blue"
          />
          <MetricCard
            title="Active Users"
            value={mockStats.activeUsers.toLocaleString()}
            change={5.2}
            icon={CheckCircleIcon}
            color="green"
          />
          <MetricCard
            title="Total Orders"
            value={mockStats.totalOrders.toLocaleString()}
            change={mockStats.orderGrowth}
            icon={ClipboardDocumentListIcon}
            color="purple"
          />
          <MetricCard
            title="Total Revenue"
            value={`$${mockStats.totalRevenue.toLocaleString()}`}
            change={12.8}
            icon={CurrencyDollarIcon}
            color="orange"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Chart */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockOrderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockOrderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${mockStats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                <p className="text-2xl font-bold text-gray-900">${mockStats.averageOrderValue}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  +3.2% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.conversionRate}%</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                  -0.8% from last month
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Monitoring */}
        <div className="mb-8">
          <PerformanceMonitor />
        </div>

        {/* Real-time Performance Dashboard */}
        <div className="mb-8">
          <PerformanceDashboard showDetails={true} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {mockRecentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 bg-white/50 rounded-lg"
              >
                <div className={`p-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-100' :
                  activity.status === 'error' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  {activity.type === 'user' && <UsersIcon className="h-4 w-4 text-gray-600" />}
                  {activity.type === 'order' && <ClipboardDocumentListIcon className="h-4 w-4 text-gray-600" />}
                  {activity.type === 'payment' && <CurrencyDollarIcon className="h-4 w-4 text-gray-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user}</p>
                </div>
                <div className="text-sm text-gray-400">{activity.time}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
  )
}

// Metric Card Component
function MetricCard({ title, value, change, icon: Icon, color }: {
  title: string
  value: string
  change: number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }

  const isPositive = change >= 0

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
            {Math.abs(change)}% from last month
          </p>
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}