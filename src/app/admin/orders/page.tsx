'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { PageLayout } from '@/components/layout/PageLayout'
import { 
  ClipboardDocumentListIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Mock order data - in real app, this would come from API
const mockOrders = [
  {
    id: 'ORD-001',
    userId: 'user-1',
    userEmail: 'john.doe@example.com',
    userName: 'John Doe',
    type: 'stock',
    status: 'completed',
    title: 'High-quality business photo',
    description: 'Professional business headshot',
    cost: 15.99,
    createdAt: '2024-01-20T10:30:00Z',
    completedAt: '2024-01-20T10:35:00Z',
    files: [
      { id: 'file-1', name: 'business-photo.jpg', size: 2048576, type: 'image' }
    ],
    metadata: {
      site: 'unsplash',
      stockId: 'photo-123456',
      resolution: '4K',
      format: 'JPEG'
    }
  },
  {
    id: 'ORD-002',
    userId: 'user-2',
    userEmail: 'jane.smith@example.com',
    userName: 'Jane Smith',
    type: 'ai',
    status: 'processing',
    title: 'AI Generated Landscape',
    description: 'Mountain landscape with sunset',
    cost: 8.99,
    createdAt: '2024-01-20T11:15:00Z',
    completedAt: null,
    files: [],
    metadata: {
      prompt: 'Beautiful mountain landscape with golden sunset',
      style: 'photorealistic',
      quality: 'high',
      resolution: '1024x1024'
    }
  },
  {
    id: 'ORD-003',
    userId: 'user-3',
    userEmail: 'bob.wilson@example.com',
    userName: 'Bob Wilson',
    type: 'stock',
    status: 'failed',
    title: 'City skyline photo',
    description: 'Modern city skyline at night',
    cost: 12.50,
    createdAt: '2024-01-20T09:45:00Z',
    completedAt: null,
    files: [],
    metadata: {
      site: 'pexels',
      stockId: 'photo-789012',
      resolution: '4K',
      format: 'JPEG'
    },
    errorMessage: 'Failed to download from source'
  },
  {
    id: 'ORD-004',
    userId: 'user-4',
    userEmail: 'alice.brown@example.com',
    userName: 'Alice Brown',
    type: 'ai',
    status: 'completed',
    title: 'Abstract Art Generation',
    description: 'Colorful abstract digital art',
    cost: 6.99,
    createdAt: '2024-01-19T16:20:00Z',
    completedAt: '2024-01-19T16:25:00Z',
    files: [
      { id: 'file-2', name: 'abstract-art.png', size: 1536000, type: 'image' }
    ],
    metadata: {
      prompt: 'Colorful abstract digital art with geometric shapes',
      style: 'abstract',
      quality: 'medium',
      resolution: '512x512'
    }
  }
]

interface OrderFilters {
  search: string
  type: 'all' | 'stock' | 'ai'
  status: 'all' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  user: string
  dateRange: { start: string; end: string }
  sortBy: 'createdAt' | 'cost' | 'status' | 'user'
  sortOrder: 'asc' | 'desc'
}

export default function AdminOrdersPage() {
  const { user, loading } = useAuth()
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    type: 'all',
    status: 'all',
    user: '',
    dateRange: { start: '', end: '' },
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null)

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let orders = mockOrders

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      orders = orders.filter(order => 
        order.id.toLowerCase().includes(searchTerm) ||
        order.title.toLowerCase().includes(searchTerm) ||
        order.userEmail.toLowerCase().includes(searchTerm) ||
        order.userName.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.type !== 'all') {
      orders = orders.filter(order => order.type === filters.type)
    }

    if (filters.status !== 'all') {
      orders = orders.filter(order => order.status === filters.status)
    }

    if (filters.user) {
      const userTerm = filters.user.toLowerCase()
      orders = orders.filter(order => 
        order.userEmail.toLowerCase().includes(userTerm) ||
        order.userName.toLowerCase().includes(userTerm)
      )
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      orders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        const startDate = new Date(filters.dateRange.start)
        const endDate = new Date(filters.dateRange.end)
        return orderDate >= startDate && orderDate <= endDate
      })
    }

    // Sort orders
    orders.sort((a, b) => {
      let comparison = 0
      
      switch (filters.sortBy) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'cost':
          comparison = a.cost - b.cost
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'user':
          comparison = a.userName.localeCompare(b.userName)
          break
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    return orders
  }, [filters])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalOrders = mockOrders.length
    const completedOrders = mockOrders.filter(o => o.status === 'completed').length
    const processingOrders = mockOrders.filter(o => o.status === 'processing').length
    const failedOrders = mockOrders.filter(o => o.status === 'failed').length
    const totalRevenue = mockOrders.reduce((sum, o) => sum + o.cost, 0)
    const averageOrderValue = totalRevenue / totalOrders

    return { totalOrders, completedOrders, processingOrders, failedOrders, totalRevenue, averageOrderValue }
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-500">Please sign in to access order management.</p>
        </div>
      </div>
    )
  }

  const handleOrderAction = (orderId: string, action: 'retry' | 'cancel' | 'refund') => {
    console.log(`Action ${action} for order ${orderId}`)
    // In real app, this would call API
  }

  const handleBulkAction = (action: 'retry' | 'cancel' | 'refund') => {
    console.log(`Bulk action ${action} for orders:`, selectedOrders)
    setSelectedOrders([])
  }

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const selectAllOrders = () => {
    setSelectedOrders(filteredOrders.map(order => order.id))
  }

  const clearSelection = () => {
    setSelectedOrders([])
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'failed':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
      case 'cancelled':
        return <XMarkIcon className="h-5 w-5 text-gray-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'processing':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      case 'cancelled':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ClipboardDocumentListIcon}
            color="blue"
          />
          <StatCard
            title="Completed"
            value={stats.completedOrders}
            icon={CheckCircleIcon}
            color="green"
          />
          <StatCard
            title="Processing"
            value={stats.processingOrders}
            icon={ClockIcon}
            color="yellow"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={CurrencyDollarIcon}
            color="purple"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID, title, or user..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
              />
            </div>

            {/* Bulk Actions */}
            {selectedOrders.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedOrders.length} selected
                </span>
                <button
                  onClick={() => handleBulkAction('retry')}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  Retry
                </button>
                <button
                  onClick={() => handleBulkAction('cancel')}
                  className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Cancel
                </button>
                <button
                  onClick={clearSelection}
                  className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg transition-colors ${
                showFilters ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200/50"
              >
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        type: e.target.value as any 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="all">All Types</option>
                      <option value="stock">Stock Media</option>
                      <option value="ai">AI Generation</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        status: e.target.value as any 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* User Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User
                    </label>
                    <input
                      type="text"
                      placeholder="Search by user..."
                      value={filters.user}
                      onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setFilters({
                      search: '',
                      type: 'all',
                      status: 'all',
                      user: '',
                      dateRange: { start: '', end: '' },
                      sortBy: 'createdAt',
                      sortOrder: 'desc'
                    })}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear all filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Orders Table */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={selectedOrders.length === filteredOrders.length ? clearSelection : selectAllOrders}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  {filteredOrders.length} orders
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {selectedOrders.length} selected
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order, index) => (
              <OrderRow
                key={order.id}
                order={order}
                isSelected={selectedOrders.includes(order.id)}
                onToggleSelection={() => toggleOrderSelection(order.id)}
                onView={() => setSelectedOrder(order)}
                onAction={handleOrderAction}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAction={handleOrderAction}
        />
      )}
  )
}

// Statistics Card Component
function StatCard({ title, value, icon: Icon, color }: {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'yellow' | 'purple'
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
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
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}

// Order Row Component
function OrderRow({ order, isSelected, onToggleSelection, onView, onAction, getStatusIcon, getStatusColor }: {
  order: typeof mockOrders[0]
  isSelected: boolean
  onToggleSelection: () => void
  onView: () => void
  onAction: (orderId: string, action: 'retry' | 'cancel' | 'refund') => void
  getStatusIcon: (status: string) => React.ReactNode
  getStatusColor: (status: string) => string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`px-6 py-4 hover:bg-gray-50/50 transition-colors ${
        isSelected ? 'bg-purple-50/50' : ''
      }`}
    >
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        
        {/* Order Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {order.id}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-1">{order.status}</span>
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              order.type === 'ai' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {order.type}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">{order.title}</p>
          <p className="text-xs text-gray-400">
            {order.userName} ({order.userEmail}) • {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Cost */}
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">${order.cost.toFixed(2)}</p>
          <p className="text-xs text-gray-500">
            {order.files.length} file{order.files.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onView}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="View Details"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          
          {order.status === 'failed' && (
            <button
              onClick={() => onAction(order.id, 'retry')}
              className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
              title="Retry Order"
            >
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          )}
          
          {order.status === 'processing' && (
            <button
              onClick={() => onAction(order.id, 'cancel')}
              className="p-2 text-red-400 hover:text-red-600 transition-colors"
              title="Cancel Order"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Order Details Modal Component
function OrderDetailsModal({ order, onClose, onAction }: {
  order: typeof mockOrders[0]
  onClose: () => void
  onAction: (orderId: string, action: 'retry' | 'cancel' | 'refund') => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd className="text-sm text-gray-900 font-mono">{order.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="text-sm text-gray-900 capitalize">{order.type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900 capitalize">{order.status}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Cost</dt>
                  <dd className="text-sm text-gray-900">${order.cost.toFixed(2)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleString()}
                  </dd>
                </div>
                {order.completedAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Completed</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(order.completedAt).toLocaleString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm text-gray-900">{order.userName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{order.userEmail}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="text-sm text-gray-900 font-mono">{order.userId}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Order Details */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{order.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{order.description}</p>
              
              {order.type === 'stock' && order.metadata.site && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Source:</span> {order.metadata.site}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Stock ID:</span> {order.metadata.stockId}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Resolution:</span> {order.metadata.resolution}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Format:</span> {order.metadata.format}
                  </div>
                </div>
              )}
              
              {order.type === 'ai' && order.metadata.prompt && (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Prompt:</span>
                    <p className="text-gray-600 italic">"{order.metadata.prompt}"</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="font-medium text-gray-500">Style:</span> {order.metadata.style}
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Quality:</span> {order.metadata.quality}
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Resolution:</span> {order.metadata.resolution}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Files */}
          {order.files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Files</h3>
              <div className="space-y-2">
                {order.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                      </p>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {order.status === 'failed' && order.errorMessage && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Details</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{order.errorMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
          
          {order.status === 'failed' && (
            <button
              onClick={() => {
                onAction(order.id, 'retry')
                onClose()
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Retry Order
            </button>
          )}
          
          {order.status === 'processing' && (
            <button
              onClick={() => {
                onAction(order.id, 'cancel')
                onClose()
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
