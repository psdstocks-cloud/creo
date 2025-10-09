'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { DashboardLoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { AdvancedAnalyticsDashboard } from '@/components/analytics/AdvancedAnalyticsDashboard'
import { PageLayout } from '@/components/layout/PageLayout'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  CloudArrowDownIcon,
  SparklesIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  Cog6ToothIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview')

  if (loading) {
    return <DashboardLoadingSkeleton />
  }

  if (!user) {
    return (
      <PageLayout requiresAuth title="Dashboard" subtitle="Your creative workspace">
        <div className="text-center py-12">
          <HomeIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-500">Please sign in to access your dashboard.</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Dashboard" subtitle="Your creative workspace">
      <div className="space-y-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/60 backdrop-blur-md rounded-lg p-1 border border-white/20">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <OverviewTab user={user} />
          )}
          {activeTab === 'analytics' && (
            <AdvancedAnalyticsDashboard />
          )}
        </motion.div>
      </div>
    </PageLayout>
  )
}

// ============================================================================
// Overview Tab Component
// ============================================================================

function OverviewTab({ user }: { user: any }) {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user.email?.split('@')[0]}!</h2>
        <p className="text-purple-100">Ready to create something amazing? Let's get started.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickActionCard
          title="Stock Search"
          description="Search and download stock media"
          icon={MagnifyingGlassIcon}
          href="/stock-search"
          color="blue"
        />
        <QuickActionCard
          title="AI Generation"
          description="Generate images with AI"
          icon={SparklesIcon}
          href="/ai-generation"
          color="purple"
        />
        <QuickActionCard
          title="Orders"
          description="View and manage orders"
          icon={ClipboardDocumentListIcon}
          href="/orders"
          color="green"
        />
        <QuickActionCard
          title="Downloads"
          description="Manage downloaded files"
          icon={CloudArrowDownIcon}
          href="/downloads"
          color="orange"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <ActivityItem
            icon={SparklesIcon}
            title="AI Generation Completed"
            description="Your AI-generated image is ready for download"
            time="2 hours ago"
            color="purple"
          />
          <ActivityItem
            icon={CloudArrowDownIcon}
            title="Stock Media Downloaded"
            description="High-quality stock photo downloaded successfully"
            time="5 hours ago"
            color="blue"
          />
          <ActivityItem
            icon={ClipboardDocumentListIcon}
            title="Order Processed"
            description="Your order has been completed and is ready"
            time="1 day ago"
            color="green"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Orders"
          value="12"
          change="+2 this week"
          icon={ClipboardDocumentListIcon}
          color="blue"
        />
        <StatCard
          title="Downloads"
          value="28"
          change="+5 this week"
          icon={CloudArrowDownIcon}
          color="green"
        />
        <StatCard
          title="AI Generations"
          value="8"
          change="+3 this week"
          icon={SparklesIcon}
          color="purple"
        />
      </div>
    </div>
  )
}

// ============================================================================
// Helper Components
// ============================================================================

function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  color 
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-200"
      >
        <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]} w-fit mb-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </motion.div>
    </Link>
  )
}

function ActivityItem({ 
  icon: Icon, 
  title, 
  description, 
  time, 
  color 
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  time: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
  }

  return (
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-full bg-gray-100 ${colorClasses[color]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color 
}: {
  title: string
  value: string
  change: string
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
          <p className="text-xs text-gray-500 mt-1">{change}</p>
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}