'use client'
import { useState, useMemo } from 'react'
import { useUserOrders, useGenerateDownloadLink, useCancelOrder, UnifiedOrder } from '@/hooks/useOrderManagement'
import { useUser } from '@/contexts/UserContext'
import { PageLayout } from '@/components/layout/PageLayout'
import { OrderDetailsModal } from '@/components/orders/OrderDetailsModal'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CloudArrowDownIcon,
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface OrderFilters {
  type?: 'stock' | 'ai'
  status?: string
  search: string
  dateRange?: { start: string; end: string }
}

export default function OrdersPage() {
  const { user } = useUser()
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null)
  
  const { data: orders = [], isLoading, error } = useUserOrders(filters)
  const generateDownloadMutation = useGenerateDownloadLink()
  const cancelOrderMutation = useCancelOrder()

  // Calculate statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length
    const completedOrders = orders.filter((o: UnifiedOrder) => o.status === 'completed').length
    const processingOrders = orders.filter((o: UnifiedOrder) => o.status === 'processing').length
    const totalSpent = orders.reduce((sum: number, order: UnifiedOrder) => sum + order.cost, 0)
    
    return { totalOrders, completedOrders, processingOrders, totalSpent }
  }, [orders])

  if (!user) {
    return (
      <PageLayout requiresAuth title="Orders" subtitle="Manage your stock media and AI generation orders">
        <div className="text-center">Please sign in to view your orders.</div>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      title="Order Management"
      subtitle="Track your stock media purchases and AI generations"
      className="bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
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
            color="orange"
          />
          <StatCard
            title="Total Spent"
            value={`$${stats.totalSpent.toFixed(2)}`}
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
                placeholder="Search orders by title, description, or prompt..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Type
                    </label>
                    <select
                      value={filters.type || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        type: e.target.value as 'stock' | 'ai' | undefined 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">All Types</option>
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
                      value={filters.status || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        status: e.target.value || undefined 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">All Statuses</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setFilters({ search: '' })}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear all filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <OrdersListSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
            <p className="text-gray-500">Please try refreshing the page.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-4">
              {filters.search || filters.type || filters.status 
                ? "Try adjusting your filters to see more results."
                : "You haven't placed any orders yet."
              }
            </p>
            {!filters.search && !filters.type && !filters.status && (
              <div className="space-x-4">
                <button
                  onClick={() => window.location.href = '/stock-search'}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PhotoIcon className="h-4 w-4 mr-2" />
                  Browse Stock Media
                </button>
                <button
                  onClick={() => window.location.href = '/ai-generation'}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Generate AI Images
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order: UnifiedOrder) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={() => setSelectedOrder(order)}
                  onDownload={(fileId) => generateDownloadMutation.mutate({ 
                    orderId: order.id, 
                    fileId 
                  })}
                  onCancel={() => cancelOrderMutation.mutate(order.id)}
                  isDownloading={generateDownloadMutation.isPending}
                  isCancelling={cancelOrderMutation.isPending}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
        />
      )}
    </PageLayout>
  )
}

// Statistics Card Component
function StatCard({ title, value, icon: Icon, color }: {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'orange' | 'purple'
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
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

// Order Card Component
function OrderCard({ order, onViewDetails, onDownload, onCancel, isDownloading, isCancelling }: {
  order: UnifiedOrder
  onViewDetails: () => void
  onDownload: (fileId: string) => void
  onCancel: () => void
  isDownloading: boolean
  isCancelling: boolean
}) {
  const statusConfig = {
    pending: { color: 'text-yellow-600 bg-yellow-100', label: 'Pending', icon: ClockIcon },
    processing: { color: 'text-blue-600 bg-blue-100', label: 'Processing', icon: ClockIcon },
    completed: { color: 'text-green-600 bg-green-100', label: 'Completed', icon: CheckCircleIcon },
    failed: { color: 'text-red-600 bg-red-100', label: 'Failed', icon: ExclamationCircleIcon },
    cancelled: { color: 'text-gray-600 bg-gray-100', label: 'Cancelled', icon: XMarkIcon },
  }

  const status = statusConfig[order.status] || statusConfig.processing
  const StatusIcon = status.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            {/* Order Type Icon */}
            <div className={`p-2 rounded-lg ${
              order.type === 'ai' 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              {order.type === 'ai' ? (
                <SparklesIcon className="h-5 w-5" />
              ) : (
                <PhotoIcon className="h-5 w-5" />
              )}
            </div>
            
            {/* Order Title and Status */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {order.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Order Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {order.description}
          </p>

          {/* Progress Bar (if processing) */}
          {order.status === 'processing' && order.progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{order.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${order.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Files Preview */}
          {order.files && order.files.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Files ({order.files.length})
              </p>
              <div className="flex space-x-2 overflow-x-auto">
                {order.files.slice(0, 4).map((file) => (
                  <div
                    key={file.id}
                    className="flex-shrink-0 relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden"
                  >
                    {file.thumbnailUrl && (
                      <Image
                        src={file.thumbnailUrl}
                        alt={file.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                ))}
                {order.files.length > 4 && (
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-600">
                      +{order.files.length - 4}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Cost */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">
              ${order.cost.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={onViewDetails}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            View Details
          </button>
          
          {order.status === 'completed' && order.files && order.files.length > 0 && (
            <button
              onClick={() => onDownload(order.files![0].id)}
              disabled={isDownloading}
              className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <CloudArrowDownIcon className="h-4 w-4 inline mr-1" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </button>
          )}
          
          {order.status === 'processing' && (
            <button
              onClick={onCancel}
              disabled={isCancelling}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}


// Orders List Skeleton
function OrdersListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white/60 backdrop-blur-md rounded-xl p-6 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}