/**
 * Dashboard Page - Main Dashboard Integration
 * 
 * Comprehensive dashboard that integrates all components with glassmorphism design,
 * responsive layout, and smooth transitions between sections.
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  MagnifyingGlassIcon, 
  SparklesIcon, 
  DocumentTextIcon,
  UserIcon,
  CogIcon,
  BellIcon,
  CreditCardIcon,
  CloudArrowDownIcon,
  CpuChipIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { usePerformanceMonitor } from '../../utils/performance';

// ============================================================================
// Dashboard Components
// ============================================================================

interface QuickStat {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  trend?: 'up' | 'down' | 'neutral';
}

interface ActivityItem {
  id: string;
  type: 'download' | 'generation' | 'order' | 'payment';
  title: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'processing' | 'failed' | 'pending';
  icon: React.ComponentType<{ className?: string }>;
}

interface OrderStatus {
  id: string;
  title: string;
  status: 'processing' | 'ready' | 'failed';
  progress: number;
  estimatedTime?: string;
  downloadUrl?: string;
}

// ============================================================================
// Quick Stats Component
// ============================================================================

const QuickStats: React.FC<{ stats: QuickStat[] }> = ({ stats }) => {

  const getColorClasses = (color: QuickStat['color']) => {
    switch (color) {
      case 'primary':
        return 'bg-gradient-to-r from-primaryOrange-500 to-primaryOrange-600';
      case 'secondary':
        return 'bg-gradient-to-r from-deepPurple-500 to-deepPurple-600';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getTrendIcon = (trend?: QuickStat['trend']) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />;
      case 'down':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-6 hover:scale-105 transition-transform duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            {getTrendIcon(stat.trend)}
          </div>
          <h3 className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">
            {stat.title}
          </h3>
          <p className="text-2xl font-bold text-white mb-2">
            {stat.value}
          </p>
          {stat.change !== undefined && (
            <p className={`text-sm ${
              stat.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stat.change >= 0 ? '+' : ''}{stat.change}%
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ============================================================================
// Activity Feed Component
// ============================================================================

const ActivityFeed: React.FC<{ activities: ActivityItem[] }> = ({ activities }) => {

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'processing':
        return 'text-blue-400';
      case 'failed':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: ActivityItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'processing':
        return <ClockIcon className="w-4 h-4" />;
      case 'failed':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        <Link 
          href="/orders" 
          className="text-primaryOrange-400 hover:text-primaryOrange-300 text-sm font-medium"
        >
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex-shrink-0">
              <activity.icon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {activity.title}
              </p>
              <p className="text-sm text-gray-400 truncate">
                {activity.description}
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <div className={`flex items-center space-x-1 ${getStatusColor(activity.status)}`}>
                  {getStatusIcon(activity.status)}
                  <span className="text-xs capitalize">{activity.status}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {activity.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// Order Status Widget
// ============================================================================

const OrderStatusWidget: React.FC<{ orders: OrderStatus[] }> = ({ orders }) => {

  const getStatusColor = (status: OrderStatus['status']) => {
    switch (status) {
      case 'processing':
        return 'text-blue-400';
      case 'ready':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: OrderStatus['status']) => {
    switch (status) {
      case 'processing':
        return <ClockIcon className="w-4 h-4" />;
      case 'ready':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'failed':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Order Status</h2>
        <Link 
          href="/orders" 
          className="text-primaryOrange-400 hover:text-primaryOrange-300 text-sm font-medium"
        >
          Manage Orders
        </Link>
      </div>
      
      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white">{order.title}</h3>
              <div className={`flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="text-xs capitalize">{order.status}</span>
              </div>
            </div>
            
            {order.status === 'processing' && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{order.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-primaryOrange-500 to-primaryOrange-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${order.progress}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                </div>
                {order.estimatedTime && (
                  <p className="text-xs text-gray-400 mt-1">
                    Estimated Time: {order.estimatedTime}
                  </p>
                )}
              </div>
            )}
            
            {order.status === 'ready' && order.downloadUrl && (
              <Link
                href={order.downloadUrl}
                className="inline-flex items-center space-x-2 text-primaryOrange-400 hover:text-primaryOrange-300 text-sm font-medium"
              >
                <CloudArrowDownIcon className="w-4 h-4" />
                <span>Download</span>
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// Quick Actions Component
// ============================================================================

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Search Media',
      description: 'Find and download stock media',
      icon: MagnifyingGlassIcon,
      href: '/stock-search',
      color: 'from-primaryOrange-500 to-primaryOrange-600'
    },
    {
      title: 'AI Generation',
      description: 'Create AI-generated images',
      icon: SparklesIcon,
      href: '/ai-generation',
      color: 'from-deepPurple-500 to-deepPurple-600'
    },
    {
      title: 'Order History',
      description: 'View your order history',
      icon: DocumentTextIcon,
      href: '/orders',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Account Settings',
      description: 'Manage your account',
      icon: UserIcon,
      href: '/dashboard/settings',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={action.href}
              className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white group-hover:text-primaryOrange-300 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// Navigation Sidebar Component
// ============================================================================

const NavigationSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const navigationItems = [
    { name: 'Overview', href: '/dashboard', icon: ChartBarIcon, active: true },
    { name: 'Search', href: '/stock-search', icon: MagnifyingGlassIcon },
    { name: 'AI Generation', href: '/ai-generation', icon: SparklesIcon },
    { name: 'Orders', href: '/orders', icon: DocumentTextIcon },
    { name: 'Downloads', href: '/downloads', icon: CloudArrowDownIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 glass-card z-50 lg:relative lg:translate-x-0 lg:z-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-white">Creo</h1>
                <button
                  onClick={onClose}
                  className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <nav className="space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        item.active
                          ? 'bg-gradient-to-r from-primaryOrange-500 to-primaryOrange-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// Main Dashboard Component
// ============================================================================

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Performance monitoring
  usePerformanceMonitor('Dashboard');

  // Mock data - replace with real data from your API
  const quickStats: QuickStat[] = useMemo(() => [
    {
      id: 'credits',
      title: 'Credits',
      value: '1,250',
      change: 12,
      icon: CreditCardIcon,
      color: 'primary',
      trend: 'up'
    },
    {
      id: 'downloads',
      title: 'Downloads',
      value: '342',
      change: 8,
      icon: CloudArrowDownIcon,
      color: 'secondary',
      trend: 'up'
    },
    {
      id: 'aiGenerations',
      title: 'AI Generations',
      value: '89',
      change: -3,
      icon: CpuChipIcon,
      color: 'success',
      trend: 'down'
    },
    {
      id: 'activeOrders',
      title: 'Active Orders',
      value: '3',
      change: 0,
      icon: ClockIcon,
      color: 'warning',
      trend: 'neutral'
    }
  ], []);

  const recentActivities: ActivityItem[] = useMemo(() => [
    {
      id: '1',
      type: 'download',
      title: 'Download Completed',
      description: 'Stock photo downloaded successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'completed',
      icon: CloudArrowDownIcon
    },
    {
      id: '2',
      type: 'generation',
      title: 'AI Generation Completed',
      description: 'AI image generated successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: 'completed',
      icon: SparklesIcon
    },
    {
      id: '3',
      type: 'order',
      title: 'Order Processing',
      description: 'Your order is being processed',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'processing',
      icon: ClockIcon
    }
  ], []);

  const orderStatuses: OrderStatus[] = useMemo(() => [
    {
      id: '1',
      title: 'Stock Photo Order #1234',
      status: 'processing',
      progress: 75,
      estimatedTime: '5 minutes'
    },
    {
      id: '2',
      title: 'AI Generation Order #5678',
      status: 'ready',
      progress: 100,
      downloadUrl: '/download/order-2'
    },
    {
      id: '3',
      title: 'Video Download Order #9012',
      status: 'processing',
      progress: 25,
      estimatedTime: '15 minutes'
    }
  ], []);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-gray-400 mb-6">Please sign in to access your dashboard</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primaryOrange-500 to-primaryOrange-600 text-white font-medium rounded-lg hover:from-primaryOrange-600 hover:to-primaryOrange-700 transition-all duration-200"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Navigation Sidebar */}
      <NavigationSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Header */}
        <header className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome back, {user.email?.split('@')[0]}</h1>
                <p className="text-gray-400">Here&apos;s what&apos;s happening with your account</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <BellIcon className="w-6 h-6 text-white" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primaryOrange-500 to-primaryOrange-600 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-8">
          {/* Quick Stats */}
          <QuickStats stats={quickStats} />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activity Feed */}
            <div className="lg:col-span-2">
              <ActivityFeed activities={recentActivities} />
            </div>

            {/* Order Status */}
            <div>
              <OrderStatusWidget orders={orderStatuses} />
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;