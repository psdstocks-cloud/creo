'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  EyeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { useUserAnalytics, useSpendingAnalytics, useUsageAnalytics, useTrendAnalytics, usePerformanceAnalytics, useExportAnalytics } from '@/hooks/useAnalytics'
import { useUser } from '@/contexts/UserContext'
import { PageLayout } from '@/components/layout/PageLayout'

// ============================================================================
// Enhanced Analytics Dashboard Component
// ============================================================================

export function AdvancedAnalyticsDashboard() {
  const { user } = useUser()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [activeTab, setActiveTab] = useState<'overview' | 'spending' | 'usage' | 'trends' | 'performance'>('overview')
  
  const { data: analytics, isLoading } = useUserAnalytics(timeRange)
  const { data: spendingAnalytics } = useSpendingAnalytics(timeRange)
  const { data: usageAnalytics } = useUsageAnalytics(timeRange)
  const { data: trendAnalytics } = useTrendAnalytics(timeRange)
  const { data: performanceAnalytics } = usePerformanceAnalytics()
  const exportMutation = useExportAnalytics()

  if (!user) {
    return (
      <PageLayout requiresAuth title="Analytics Dashboard" subtitle="Comprehensive insights and performance metrics">
        <div className="text-center py-12">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-500">Please sign in to view analytics.</p>
        </div>
      </PageLayout>
    )
  }

  if (isLoading) {
    return <AnalyticsLoadingSkeleton />
  }

  return (
    <PageLayout title="Analytics Dashboard" subtitle="Comprehensive insights and performance metrics">
      <div className="space-y-8">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg bg-white/60 backdrop-blur-md border border-white/20">
              {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    timeRange === range
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => exportMutation.mutate({ format: 'pdf', timeRange })}
              disabled={exportMutation.isPending}
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export PDF
            </button>
            <button
              onClick={() => exportMutation.mutate({ format: 'csv', timeRange })}
              disabled={exportMutation.isPending}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/60 backdrop-blur-md rounded-lg p-1 border border-white/20">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'spending', label: 'Spending', icon: CurrencyDollarIcon },
            { id: 'usage', label: 'Usage', icon: UserGroupIcon },
            { id: 'trends', label: 'Trends', icon: ArrowTrendingUpIcon },
            { id: 'performance', label: 'Performance', icon: Cog6ToothIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-700 hover:bg-white/50'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && analytics && (
            <OverviewTab analytics={analytics} />
          )}
          {activeTab === 'spending' && spendingAnalytics && (
            <SpendingTab analytics={spendingAnalytics} />
          )}
          {activeTab === 'usage' && usageAnalytics && (
            <UsageTab analytics={usageAnalytics} />
          )}
          {activeTab === 'trends' && trendAnalytics && (
            <TrendsTab analytics={trendAnalytics} />
          )}
          {activeTab === 'performance' && performanceAnalytics && (
            <PerformanceTab analytics={performanceAnalytics} />
          )}
        </motion.div>
      </div>
    </PageLayout>
  )
}

// ============================================================================
// Tab Components
// ============================================================================

function OverviewTab({ analytics }: { analytics: any }) {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Orders"
          value={analytics.overview.totalOrders}
          change={analytics.overview.monthlyGrowth}
          icon={ChartBarIcon}
          color="blue"
        />
        <MetricCard
          title="Total Spent"
          value={`$${analytics.overview.totalSpent.toFixed(2)}`}
          change={analytics.overview.monthlyGrowth}
          icon={CurrencyDollarIcon}
          color="green"
        />
        <MetricCard
          title="Success Rate"
          value={`${analytics.overview.successRate.toFixed(1)}%`}
          change={5.2}
          icon={ArrowTrendingUpIcon}
          color="purple"
        />
        <MetricCard
          title="Active Orders"
          value={analytics.overview.activeOrders}
          change={-2.1}
          icon={ClockIcon}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.trends.orderTrends.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.spending.topSpendingCategories}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
              >
                {analytics.spending.topSpendingCategories.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={['#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function SpendingTab({ analytics }: { analytics: any }) {
  return (
    <div className="space-y-8">
      {/* Spending Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Spending</h3>
          <p className="text-3xl font-bold text-gray-900">${analytics.totalSpent.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">Average: ${analytics.averageSpending.toFixed(2)} per order</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Media</h3>
          <p className="text-2xl font-bold text-blue-600">${analytics.spendingByType.stock.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">
            {((analytics.spendingByType.stock / analytics.totalSpent) * 100).toFixed(1)}% of total
          </p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Generation</h3>
          <p className="text-2xl font-bold text-purple-600">${analytics.spendingByType.ai.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-2">
            {((analytics.spendingByType.ai / analytics.totalSpent) * 100).toFixed(1)}% of total
          </p>
        </div>
      </div>

      {/* Spending Trends */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={analytics.spendingByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
            <Area type="monotone" dataKey="amount" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Budget Insights */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Projected Spending</h4>
            <p className="text-2xl font-bold text-orange-600">${analytics.budgetInsights.projectedSpending.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Based on current trends</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recommended Budget</h4>
            <p className="text-2xl font-bold text-green-600">${analytics.budgetInsights.budgetRecommendation.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Optimal spending target</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Savings Opportunities</h4>
          <ul className="space-y-2">
            {analytics.budgetInsights.savingsOpportunities.map((opportunity: string, index: number) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                {opportunity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function UsageTab({ analytics }: { analytics: any }) {
  return (
    <div className="space-y-8">
      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Sessions"
          value={analytics.totalSessions}
          icon={UserGroupIcon}
          color="blue"
        />
        <MetricCard
          title="Avg Session Duration"
          value={`${Math.round(analytics.averageSessionDuration)}m`}
          icon={ClockIcon}
          color="green"
        />
        <MetricCard
          title="Daily Active Users"
          value={analytics.userEngagement.dailyActive}
          icon={EyeIcon}
          color="purple"
        />
        <MetricCard
          title="Retention Rate"
          value={`${analytics.userEngagement.retentionRate}%`}
          icon={ArrowTrendingUpIcon}
          color="orange"
        />
      </div>

      {/* Feature Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Features</h3>
          <div className="space-y-4">
            {analytics.mostUsedFeatures.map((feature: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{feature.feature}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${feature.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{feature.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Adoption</h3>
          <div className="space-y-4">
            {Object.entries(analytics.featureAdoption).map(([feature, adoption]) => (
              <div key={feature} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {feature.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${adoption}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{adoption}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage by Time of Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.usageByTimeOfDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage by Day of Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.usageByDayOfWeek}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function TrendsTab({ analytics }: { analytics: any }) {
  return (
    <div className="space-y-8">
      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Order Growth"
          value={`${analytics.growthMetrics.orderGrowth > 0 ? '+' : ''}${analytics.growthMetrics.orderGrowth.toFixed(1)}%`}
          change={analytics.growthMetrics.orderGrowth}
          icon={ArrowTrendingUpIcon}
          color="blue"
        />
        <MetricCard
          title="Spending Growth"
          value={`${analytics.growthMetrics.spendingGrowth > 0 ? '+' : ''}${analytics.growthMetrics.spendingGrowth.toFixed(1)}%`}
          change={analytics.growthMetrics.spendingGrowth}
          icon={CurrencyDollarIcon}
          color="green"
        />
        <MetricCard
          title="User Growth"
          value={`${analytics.growthMetrics.userGrowth > 0 ? '+' : ''}${analytics.growthMetrics.userGrowth.toFixed(1)}%`}
          change={analytics.growthMetrics.userGrowth}
          icon={UserGroupIcon}
          color="purple"
        />
        <MetricCard
          title="Revenue Growth"
          value={`${analytics.growthMetrics.revenueGrowth > 0 ? '+' : ''}${analytics.growthMetrics.revenueGrowth.toFixed(1)}%`}
          change={analytics.growthMetrics.revenueGrowth}
          icon={ArrowTrendingUpIcon}
          color="orange"
        />
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.orderTrends.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} name="Orders" />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="Value" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.spendingTrends.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              <Area type="monotone" dataKey="amount" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seasonal Patterns */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analytics.seasonalPatterns.seasonalTrends.map((trend: any, index: number) => (
            <div key={index} className="text-center">
              <h4 className="font-medium text-gray-900 mb-2">{trend.season}</h4>
              <p className="text-2xl font-bold text-purple-600">{trend.factor}x</p>
              <p className="text-sm text-gray-600 mt-1">{trend.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PerformanceTab({ analytics }: { analytics: any }) {
  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Avg Processing Time"
          value={`${analytics.orderPerformance.averageProcessingTime}h`}
          icon={ClockIcon}
          color="blue"
        />
        <MetricCard
          title="Completion Rate"
          value={`${analytics.orderPerformance.completionRate}%`}
          icon={ArrowTrendingUpIcon}
          color="green"
        />
        <MetricCard
          title="Error Rate"
          value={`${analytics.orderPerformance.errorRate}%`}
          icon={ArrowTrendingDownIcon}
          color="red"
        />
        <MetricCard
          title="Customer Satisfaction"
          value={`${analytics.orderPerformance.customerSatisfaction}/5`}
          icon={UserGroupIcon}
          color="purple"
        />
      </div>

      {/* System Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Response Time</span>
              <span className="text-sm text-gray-900">{analytics.systemPerformance.averageResponseTime}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Uptime</span>
              <span className="text-sm text-gray-900">{analytics.systemPerformance.uptime}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Error Rate</span>
              <span className="text-sm text-gray-900">{analytics.systemPerformance.errorRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Throughput</span>
              <span className="text-sm text-gray-900">{analytics.systemPerformance.throughput} req/h</span>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Experience</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Page Load Time</span>
              <span className="text-sm text-gray-900">{analytics.userExperience.pageLoadTime}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Navigation Efficiency</span>
              <span className="text-sm text-gray-900">{analytics.userExperience.navigationEfficiency}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Task Completion</span>
              <span className="text-sm text-gray-900">{analytics.userExperience.taskCompletionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Satisfaction Score</span>
              <span className="text-sm text-gray-900">{analytics.userExperience.userSatisfactionScore}/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Metrics */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <h4 className="font-medium text-gray-900 mb-2">Conversion Rate</h4>
            <p className="text-2xl font-bold text-blue-600">{analytics.businessMetrics.conversionRate}%</p>
          </div>
          <div className="text-center">
            <h4 className="font-medium text-gray-900 mb-2">Churn Rate</h4>
            <p className="text-2xl font-bold text-red-600">{analytics.businessMetrics.churnRate}%</p>
          </div>
          <div className="text-center">
            <h4 className="font-medium text-gray-900 mb-2">Lifetime Value</h4>
            <p className="text-2xl font-bold text-green-600">${analytics.businessMetrics.lifetimeValue}</p>
          </div>
          <div className="text-center">
            <h4 className="font-medium text-gray-900 mb-2">Acquisition Cost</h4>
            <p className="text-2xl font-bold text-orange-600">${analytics.businessMetrics.acquisitionCost}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Helper Components
// ============================================================================

function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color 
}: {
  title: string
  value: string | number
  change?: number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
  }

  const changeColorClass = change !== undefined
    ? change >= 0 ? 'text-green-500' : 'text-red-500'
    : 'text-gray-500'

  const ChangeIcon = change !== undefined
    ? change >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon
    : null

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
              {ChangeIcon && <ChangeIcon className={`h-4 w-4 mr-1 ${changeColorClass}`} />}
              <span className={`text-sm font-medium ${changeColorClass}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last period</span>
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

function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
