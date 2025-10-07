/**
 * Order Management Component
 * 
 * A comprehensive order management interface with glassmorphism design,
 * real-time updates, and full order lifecycle management.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

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
  type: 'image' | 'video' | 'vector';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  credits: number;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  downloadUrl?: string;
  fileName?: string;
  fileSize?: number;
  errorMessage?: string;
}

interface OrderFilters {
  status: 'all' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  type: 'all' | 'image' | 'video' | 'vector';
  site: 'all' | 'shutterstock' | 'adobestock' | 'freepik' | 'unsplash' | 'pexels';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  search: string;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onCancel: (orderId: string) => void;
  onDownload: (orderId: string) => void;
}

// ============================================================================
// Loading Skeleton Component
// ============================================================================

const OrderSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass-card p-6 rounded-lg"
      >
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-700 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-48"></div>
                <div className="h-3 bg-gray-700 rounded w-32"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-700 rounded w-20"></div>
          </div>
          <div className="h-2 bg-gray-700 rounded w-full"></div>
        </div>
      </motion.div>
    ))}
  </div>
);

// ============================================================================
// Empty State Component
// ============================================================================

const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => {
  const t = useTranslations('OrderManagement');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="glass-card p-8 rounded-lg max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{t('emptyState.title')}</h3>
        <p className="text-gray-300 mb-6">{t('emptyState.description')}</p>
        <button
          onClick={onRefresh}
          className="bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {t('emptyState.refreshButton')}
        </button>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Error State Component
// ============================================================================

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => {
  const t = useTranslations('OrderManagement');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="glass-card p-8 rounded-lg max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{t('errorState.title')}</h3>
        <p className="text-gray-300 mb-2">{error}</p>
        <p className="text-gray-400 mb-6">{t('errorState.description')}</p>
        <button
          onClick={onRetry}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {t('errorState.retryButton')}
        </button>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Order Card Component
// ============================================================================

const OrderCard = ({ 
  order, 
  onViewDetails, 
  onCancel, 
  onDownload 
}: { 
  order: Order; 
  onViewDetails: (order: Order) => void;
  onCancel: (orderId: string) => void;
  onDownload: (orderId: string) => void;
}) => {
  const t = useTranslations('OrderManagement');

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'processing':
        return 'bg-primaryOrange-500/20 text-primaryOrange-300 border-primaryOrange-500/30';
      case 'completed':
        return 'bg-deepPurple-500/20 text-deepPurple-300 border-deepPurple-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'processing':
        return (
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'cancelled':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="glass-card p-6 rounded-lg cursor-pointer group"
      onClick={() => onViewDetails(order)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={order.thumbnail}
              alt={order.title}
              width={64}
              height={64}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="absolute -top-1 -right-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.type === 'image' ? 'bg-blue-500/80' :
                order.type === 'video' ? 'bg-purple-500/80' :
                'bg-green-500/80'
              } text-white`}>
                {order.type.toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-primaryOrange-300 transition-colors">
              {order.title}
            </h3>
            <p className="text-gray-400 text-xs">
              {order.site} • {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span>{t(`status.${order.status}`)}</span>
          </span>
        </div>
      </div>

      {/* Progress Bar for Processing Orders */}
      {order.status === 'processing' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">{t('progress')}</span>
            <span className="text-sm text-primaryOrange-300">{order.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-primaryOrange-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${order.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Order Details */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">
            {t('credits')}: <span className="text-white font-medium">{order.credits}</span>
          </span>
          <span className="text-gray-400">
            {t('price')}: <span className="text-white font-medium">{order.price} {order.currency}</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {order.status === 'completed' && order.downloadUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload(order.id);
              }}
              className="bg-deepPurple-500 hover:bg-deepPurple-600 text-white px-3 py-1 rounded text-xs transition-colors flex items-center space-x-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{t('download')}</span>
            </button>
          )}
          
          {(order.status === 'pending' || order.status === 'processing') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel(order.id);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors flex items-center space-x-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{t('cancel')}</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Order Details Modal Component
// ============================================================================

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  order, 
  onCancel, 
  onDownload 
}) => {
  const t = useTranslations('OrderManagement');

  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">{t('orderDetails.title')}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={t('closeModal')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex items-center space-x-4">
                <Image
                  src={order.thumbnail}
                  alt={order.title}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">{order.title}</h3>
                  <p className="text-gray-400 text-sm">{order.site} • {order.type.toUpperCase()}</p>
                </div>
              </div>

              {/* Order Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t('orderDetails.status')}
                  </label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'processing' ? 'bg-primaryOrange-500/20 text-primaryOrange-300' :
                    order.status === 'completed' ? 'bg-deepPurple-500/20 text-deepPurple-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {t(`status.${order.status}`)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t('orderDetails.progress')}
                  </label>
                  <span className="text-white">{order.progress}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              {order.status === 'processing' && (
                <div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <motion.div
                      className="bg-primaryOrange-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${order.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              {/* Order Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t('orderDetails.credits')}
                  </label>
                  <span className="text-white">{order.credits}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t('orderDetails.price')}
                  </label>
                  <span className="text-white">{order.price} {order.currency}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t('orderDetails.createdAt')}
                  </label>
                  <span className="text-white">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                {order.completedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {t('orderDetails.completedAt')}
                    </label>
                    <span className="text-white">{new Date(order.completedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Download Information */}
              {order.downloadUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t('orderDetails.downloadInfo')}
                  </label>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">
                      {t('orderDetails.fileName')}: {order.fileName}
                    </div>
                    {order.fileSize && (
                      <div className="text-sm text-gray-400">
                        {t('orderDetails.fileSize')}: {(order.fileSize / 1024 / 1024).toFixed(2)} MB
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {order.errorMessage && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                  <div className="text-red-300 text-sm">
                    <strong>{t('orderDetails.error')}:</strong> {order.errorMessage}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {order.status === 'completed' && order.downloadUrl && (
                  <button
                    onClick={() => onDownload(order.id)}
                    className="flex-1 bg-deepPurple-500 hover:bg-deepPurple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{t('downloadNow')}</span>
                  </button>
                )}
                
                {(order.status === 'pending' || order.status === 'processing') && (
                  <button
                    onClick={() => onCancel(order.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>{t('cancelOrder')}</span>
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
// Main Order Management Component
// ============================================================================

const OrderManagement: React.FC = () => {
  const t = useTranslations('OrderManagement');
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { register, watch } = useForm<OrderFilters>({
    defaultValues: {
      status: 'all',
      type: 'all',
      site: 'all',
      dateRange: 'all',
      search: ''
    }
  });

  const watchedFilters = watch();

  // Mock data for demonstration
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock orders data
        const mockOrders: Order[] = Array.from({ length: 25 }, (_, index) => ({
          id: `order-${index + 1}`,
          taskId: `task-${index + 1}`,
          site: ['shutterstock', 'adobestock', 'freepik', 'unsplash', 'pexels'][index % 5],
          mediaId: `media-${index + 1}`,
          title: `Stock Media Item ${index + 1}`,
          thumbnail: `https://picsum.photos/300/200?random=${index}`,
          type: ['image', 'video', 'vector'][index % 3] as 'image' | 'video' | 'vector',
          status: ['pending', 'processing', 'completed', 'failed', 'cancelled'][index % 5] as Order['status'],
          progress: Math.floor(Math.random() * 100),
          credits: Math.floor(Math.random() * 20) + 1,
          price: Math.floor(Math.random() * 50) + 5,
          currency: 'USD',
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          completedAt: index % 3 === 0 ? new Date().toISOString() : undefined,
          downloadUrl: index % 3 === 0 ? `https://example.com/download/${index + 1}` : undefined,
          fileName: index % 3 === 0 ? `media-${index + 1}.jpg` : undefined,
          fileSize: index % 3 === 0 ? Math.floor(Math.random() * 10000000) + 1000000 : undefined,
          errorMessage: index % 5 === 0 ? 'Download failed due to network error' : undefined
        }));

        setOrders(mockOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Filter orders based on current filters
  useEffect(() => {
    let filtered = [...orders];

    if (watchedFilters.status !== 'all') {
      filtered = filtered.filter(order => order.status === watchedFilters.status);
    }

    if (watchedFilters.type !== 'all') {
      filtered = filtered.filter(order => order.type === watchedFilters.type);
    }

    if (watchedFilters.site !== 'all') {
      filtered = filtered.filter(order => order.site === watchedFilters.site);
    }

    if (watchedFilters.search) {
      filtered = filtered.filter(order => 
        order.title.toLowerCase().includes(watchedFilters.search.toLowerCase()) ||
        order.site.toLowerCase().includes(watchedFilters.search.toLowerCase())
      );
    }

    // Date range filtering
    if (watchedFilters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (watchedFilters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, watchedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'cancelled' as const, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const handleDownload = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order?.downloadUrl) {
      window.open(order.downloadUrl, '_blank');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Title', 'Site', 'Type', 'Status', 'Credits', 'Price', 'Created At'],
      ...filteredOrders.map(order => [
        order.id,
        order.title,
        order.site,
        order.type,
        order.status,
        order.credits.toString(),
        `${order.price} ${order.currency}`,
        new Date(order.createdAt).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{t('title')}</h1>
            <p className="text-primaryOrange-200 text-lg">{t('subtitle')}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="bg-deepPurple-500 hover:bg-deepPurple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{t('export')}</span>
            </button>
            <button
              onClick={handleRefresh}
              className="bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{t('refresh')}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 rounded-lg mb-8">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('filters.search')}
                </label>
                <div className="relative">
                  <input
                    {...register('search')}
                    type="text"
                    id="search"
                    placeholder={t('filters.searchPlaceholder')}
                    className="w-full px-4 py-3 pl-10 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('filters.status')}
                </label>
                <select
                  {...register('status')}
                  id="status"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
                >
                  <option value="all">{t('filters.allStatuses')}</option>
                  <option value="pending">{t('status.pending')}</option>
                  <option value="processing">{t('status.processing')}</option>
                  <option value="completed">{t('status.completed')}</option>
                  <option value="failed">{t('status.failed')}</option>
                  <option value="cancelled">{t('status.cancelled')}</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('filters.type')}
                </label>
                <select
                  {...register('type')}
                  id="type"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
                >
                  <option value="all">{t('filters.allTypes')}</option>
                  <option value="image">{t('filters.images')}</option>
                  <option value="video">{t('filters.videos')}</option>
                  <option value="vector">{t('filters.vectors')}</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label htmlFor="dateRange" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('filters.dateRange')}
                </label>
                <select
                  {...register('dateRange')}
                  id="dateRange"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
                >
                  <option value="all">{t('filters.allDates')}</option>
                  <option value="today">{t('filters.today')}</option>
                  <option value="week">{t('filters.thisWeek')}</option>
                  <option value="month">{t('filters.thisMonth')}</option>
                  <option value="year">{t('filters.thisYear')}</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {isLoading && <OrderSkeleton />}
          
          {error && <ErrorState error={error} onRetry={handleRefresh} />}
          
          {!isLoading && !error && filteredOrders.length === 0 && (
            <EmptyState onRefresh={handleRefresh} />
          )}
          
          {!isLoading && !error && currentOrders.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  {t('resultsCount', { count: filteredOrders.length })}
                </h2>
                <div className="text-sm text-gray-400">
                  {t('showingResults', { 
                    start: startIndex + 1, 
                    end: Math.min(endIndex, filteredOrders.length),
                    total: filteredOrders.length 
                  })}
                </div>
              </div>
              
              <div className="space-y-4">
                {currentOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                    onCancel={handleCancelOrder}
                    onDownload={handleDownload}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                  >
                    {t('pagination.previous')}
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-primaryOrange-500 text-white'
                              : 'bg-gray-700 text-white hover:bg-gray-600'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                  >
                    {t('pagination.next')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Order Details Modal */}
        <OrderDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
          onCancel={handleCancelOrder}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};

export default OrderManagement;
