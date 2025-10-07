/**
 * Order Management Component
 * 
 * Comprehensive order management interface with real-time status updates,
 * download links, order details, search/filter, and export functionality.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  RefreshIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

// ============================================================================
// Types and Interfaces
// ============================================================================

interface Order {
  id: string;
  taskId: string;
  site: string;
  mediaId: string;
  title: string;
  thumbnail: string;
  cost: number;
  status: 'pending' | 'processing' | 'ready' | 'error' | 'cancelled';
  progress: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  errorMessage?: string;
  downloadUrl?: string;
  fileName?: string;
  fileSize?: string;
}

interface OrderFilters {
  status: string;
  site: string;
  dateRange: {
    start: string;
    end: string;
  };
  search: string;
}

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (order: Order) => void;
  onCancel: (order: Order) => void;
  onRedownload: (order: Order) => void;
}

// ============================================================================
// Order Status Badge Component
// ============================================================================

const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const t = useTranslations('OrderManagement');

  const statusConfig = {
    pending: {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-100',
      icon: ClockIcon,
      label: t('status.pending')
    },
    processing: {
      color: 'bg-primaryOrange-500',
      textColor: 'text-white',
      icon: RefreshIcon,
      label: t('status.processing')
    },
    ready: {
      color: 'bg-green-500',
      textColor: 'text-white',
      icon: CheckCircleIcon,
      label: t('status.ready')
    },
    error: {
      color: 'bg-red-500',
      textColor: 'text-white',
      icon: XCircleIcon,
      label: t('status.error')
    },
    cancelled: {
      color: 'bg-gray-500',
      textColor: 'text-white',
      icon: XMarkIcon,
      label: t('status.cancelled')
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${config.textColor}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

// ============================================================================
// Progress Bar Component
// ============================================================================

const ProgressBar: React.FC<{ progress: number; status: Order['status'] }> = ({ progress, status }) => {
  const isProcessing = status === 'processing';
  const isCompleted = status === 'ready';
  const isError = status === 'error';

  return (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <motion.div
        className={`h-2 rounded-full ${
          isError ? 'bg-red-500' : 
          isCompleted ? 'bg-green-500' : 
          'bg-primaryOrange-500'
        }`}
        initial={{ width: 0 }}
        animate={{ width: isProcessing ? `${progress}%` : isCompleted ? '100%' : '0%' }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

// ============================================================================
// Order Details Modal Component
// ============================================================================

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  order, 
  isOpen, 
  onClose, 
  onDownload, 
  onCancel, 
  onRedownload 
}) => {
  const t = useTranslations('OrderManagement');

  if (!order) return null;

  const canCancel = order.status === 'pending' || order.status === 'processing';
  const canDownload = order.status === 'ready' && order.downloadUrl;
  const canRedownload = order.status === 'ready';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{t('modal.title')}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={t('modal.close')}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Media Preview */}
                <div className="relative">
                  <Image
                    src={order.thumbnail}
                    alt={order.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{order.title}</h3>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>{t('modal.orderId')}:</span>
                        <span className="font-mono text-sm">{order.taskId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('modal.site')}:</span>
                        <span className="capitalize">{order.site}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('modal.cost')}:</span>
                        <span className="text-primaryOrange-400 font-semibold">{order.cost} EGP</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('modal.created')}:</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      {order.completedAt && (
                        <div className="flex justify-between">
                          <span>{t('modal.completed')}:</span>
                          <span>{new Date(order.completedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  {order.status === 'processing' && (
                    <div>
                      <div className="flex justify-between text-sm text-gray-300 mb-2">
                        <span>{t('modal.progress')}</span>
                        <span>{order.progress}%</span>
                      </div>
                      <ProgressBar progress={order.progress} status={order.status} />
                    </div>
                  )}

                  {/* Error Message */}
                  {order.status === 'error' && order.errorMessage && (
                    <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
                      <p className="text-red-300 text-sm">{order.errorMessage}</p>
                    </div>
                  )}

                  {/* File Info */}
                  {order.status === 'ready' && (
                    <div className="bg-green-900/50 border border-green-500 rounded-lg p-3">
                      <div className="flex items-center text-green-300 text-sm mb-2">
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        {t('modal.readyForDownload')}
                      </div>
                      {order.fileName && (
                        <p className="text-green-200 text-sm">{order.fileName}</p>
                      )}
                      {order.fileSize && (
                        <p className="text-green-200 text-sm">{order.fileSize}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6">
                {canDownload && (
                  <button
                    onClick={() => onDownload(order)}
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span>{t('modal.download')}</span>
                  </button>
                )}
                
                {canRedownload && (
                  <button
                    onClick={() => onRedownload(order)}
                    className="flex items-center space-x-2 bg-deepPurple-500 hover:bg-deepPurple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <RefreshIcon className="w-4 h-4" />
                    <span>{t('modal.redownload')}</span>
                  </button>
                )}
                
                {canCancel && (
                  <button
                    onClick={() => onCancel(order)}
                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>{t('modal.cancel')}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// Search and Filter Component
// ============================================================================

const SearchAndFilter: React.FC<{
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ filters, onFiltersChange, isOpen, onToggle }) => {
  const t = useTranslations('OrderManagement');

  const statusOptions = [
    { value: 'all', label: t('filters.allStatuses') },
    { value: 'pending', label: t('filters.pending') },
    { value: 'processing', label: t('filters.processing') },
    { value: 'ready', label: t('filters.ready') },
    { value: 'error', label: t('filters.error') },
    { value: 'cancelled', label: t('filters.cancelled') }
  ];

  const siteOptions = [
    { value: 'all', label: t('filters.allSites') },
    { value: 'shutterstock', label: 'Shutterstock' },
    { value: 'adobestock', label: 'Adobe Stock' },
    { value: 'freepik', label: 'Freepik' },
    { value: 'unsplash', label: 'Unsplash' },
    { value: 'pexels', label: 'Pexels' }
  ];

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            placeholder={t('filters.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="md:w-48">
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Site Filter */}
        <div className="md:w-48">
          <select
            value={filters.site}
            onChange={(e) => onFiltersChange({ ...filters, site: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
          >
            {siteOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Toggle */}
        <button
          onClick={onToggle}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
        >
          <CalendarIcon className="w-4 h-4" />
          <span>{t('filters.dateRange')}</span>
        </button>
      </div>

      {/* Date Range Picker */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('filters.startDate')}
              </label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value }
                })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('filters.endDate')}
              </label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value }
                })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// Loading Skeleton Component
// ============================================================================

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4"
        >
          <div className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-700 h-16 w-16 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="bg-gray-700 h-4 rounded w-3/4"></div>
                <div className="bg-gray-700 h-4 rounded w-1/2"></div>
                <div className="bg-gray-700 h-3 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ============================================================================
// Empty State Component
// ============================================================================

const EmptyState: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const t = useTranslations('OrderManagement');

  return (
    <div className="text-center py-12">
      <DocumentArrowDownIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{t('empty.title')}</h3>
      <p className="text-gray-400 mb-6">{t('empty.description')}</p>
      <button
        onClick={onRefresh}
        className="bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-6 py-2 rounded-lg transition-colors"
      >
        {t('empty.refresh')}
      </button>
    </div>
  );
};

// ============================================================================
// Main OrderManagement Component
// ============================================================================

const OrderManagement: React.FC = () => {
  const t = useTranslations('OrderManagement');
  const { user } = useAuth();

  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all',
    site: 'all',
    dateRange: { start: '', end: '' },
    search: ''
  });

  // Mock data for development
  const mockOrders: Order[] = [
    {
      id: '1',
      taskId: 'task_123456',
      site: 'shutterstock',
      mediaId: 'media_789',
      title: 'Beautiful landscape photography',
      thumbnail: 'https://picsum.photos/300/200?random=1',
      cost: 25,
      status: 'ready',
      progress: 100,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      downloadUrl: 'https://example.com/download/1',
      fileName: 'landscape_photo.jpg',
      fileSize: '2.5 MB'
    },
    {
      id: '2',
      taskId: 'task_123457',
      site: 'adobestock',
      mediaId: 'media_790',
      title: 'Professional business image',
      thumbnail: 'https://picsum.photos/300/200?random=2',
      cost: 30,
      status: 'processing',
      progress: 65,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      taskId: 'task_123458',
      site: 'freepik',
      mediaId: 'media_791',
      title: 'Creative abstract design',
      thumbnail: 'https://picsum.photos/300/200?random=3',
      cost: 15,
      status: 'pending',
      progress: 0,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      taskId: 'task_123459',
      site: 'unsplash',
      mediaId: 'media_792',
      title: 'Modern technology concept',
      thumbnail: 'https://picsum.photos/300/200?random=4',
      cost: 20,
      status: 'error',
      progress: 0,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      errorMessage: 'Download failed due to network error'
    }
  ];

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = [...orders];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Site filter
    if (filters.site !== 'all') {
      filtered = filtered.filter(order => order.site === filters.site);
    }

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(order =>
        order.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.taskId.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Date range filter
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      filtered = filtered.filter(order => new Date(order.createdAt) >= startDate);
    }
    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end);
      filtered = filtered.filter(order => new Date(order.createdAt) <= endDate);
    }

    setFilteredOrders(filtered);
  }, [orders, filters]);

  // Handlers
  const handleViewDetails = useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  }, []);

  const handleDownload = useCallback((order: Order) => {
    if (order.downloadUrl) {
      window.open(order.downloadUrl, '_blank');
    }
  }, []);

  const handleCancel = useCallback((order: Order) => {
    // Implement cancel order logic
    console.log('Cancelling order:', order.id);
    setOrders(prev => prev.map(o => 
      o.id === order.id ? { ...o, status: 'cancelled' as const } : o
    ));
    setIsModalOpen(false);
  }, []);

  const handleRedownload = useCallback((order: Order) => {
    // Implement redownload logic
    console.log('Redownloading order:', order.id);
    if (order.downloadUrl) {
      window.open(order.downloadUrl, '_blank');
    }
  }, []);

  const handleExport = useCallback(() => {
    const csvContent = [
      ['Order ID', 'Task ID', 'Title', 'Site', 'Cost', 'Status', 'Created At', 'Completed At'],
      ...filteredOrders.map(order => [
        order.id,
        order.taskId,
        order.title,
        order.site,
        order.cost.toString(),
        order.status,
        new Date(order.createdAt).toLocaleDateString(),
        order.completedAt ? new Date(order.completedAt).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filteredOrders]);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t('authRequired')}</h2>
          <p className="text-gray-300 mb-6">{t('authRequiredMessage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{t('title')}</h1>
            <p className="text-gray-300">{t('subtitle')}</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshIcon className="w-4 h-4" />
              <span>{t('refresh')}</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 bg-deepPurple-500 hover:bg-deepPurple-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>{t('export')}</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={isDateRangeOpen}
          onToggle={() => setIsDateRangeOpen(!isDateRangeOpen)}
        />

        {/* Orders List */}
        <div className="space-y-4">
          {isLoading && <LoadingSkeleton />}
          
          {!isLoading && filteredOrders.length === 0 && (
            <EmptyState onRefresh={handleRefresh} />
          )}

          {!isLoading && filteredOrders.length > 0 && (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <div className="glass-card overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {t('table.media')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {t('table.orderId')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {t('table.status')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {t('table.progress')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {t('table.cost')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {t('table.created')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {t('table.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredOrders.map((order) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <Image
                                src={order.thumbnail}
                                alt={order.title}
                                width={48}
                                height={32}
                                className="w-12 h-8 object-cover rounded"
                              />
                              <div>
                                <div className="text-sm font-medium text-white truncate max-w-xs">
                                  {order.title}
                                </div>
                                <div className="text-xs text-gray-400 capitalize">
                                  {order.site}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <code className="text-xs text-gray-300 font-mono">
                              {order.taskId}
                            </code>
                          </td>
                          <td className="px-6 py-4">
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="px-6 py-4">
                            {order.status === 'processing' && (
                              <div className="w-24">
                                <ProgressBar progress={order.progress} status={order.status} />
                                <div className="text-xs text-gray-400 mt-1">
                                  {order.progress}%
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-primaryOrange-400 font-semibold">
                              {order.cost} EGP
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-300">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDetails(order)}
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label={t('table.viewDetails')}
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                              {order.status === 'ready' && order.downloadUrl && (
                                <button
                                  onClick={() => handleDownload(order)}
                                  className="text-green-400 hover:text-green-300 transition-colors"
                                  aria-label={t('table.download')}
                                >
                                  <ArrowDownTrayIcon className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-4"
                  >
                    <div className="flex items-start space-x-4">
                      <Image
                        src={order.thumbnail}
                        alt={order.title}
                        width={80}
                        height={60}
                        className="w-20 h-15 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{order.title}</h3>
                        <p className="text-gray-400 text-sm capitalize">{order.site}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <OrderStatusBadge status={order.status} />
                          <span className="text-primaryOrange-400 font-semibold text-sm">
                            {order.cost} EGP
                          </span>
                        </div>
                        {order.status === 'processing' && (
                          <div className="mt-2">
                            <ProgressBar progress={order.progress} status={order.status} />
                            <div className="text-xs text-gray-400 mt-1">
                              {order.progress}%
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            {order.status === 'ready' && order.downloadUrl && (
                              <button
                                onClick={() => handleDownload(order)}
                                className="text-green-400 hover:text-green-300 transition-colors"
                              >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDownload={handleDownload}
        onCancel={handleCancel}
        onRedownload={handleRedownload}
      />
    </div>
  );
};

export default OrderManagement;