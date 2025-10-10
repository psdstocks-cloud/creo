/**
 * Monitoring Dashboard Component
 * 
 * Comprehensive monitoring dashboard for API testing, error tracking,
 * performance metrics, and user feedback collection.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { 
  createMonitoringDashboard,
  ErrorAnalytics,
  PerformanceAnalytics,
  UserFeedback
} from '../utils/error-logging';
// import { createApiTester, ApiTestResult, ApiMetrics } from '../utils/api-testing';
// import { useQueryClient } from '@tanstack/react-query';

// ============================================================================
// Types and Interfaces
// ============================================================================

interface MonitoringData {
  errors: ErrorAnalytics;
  performance: PerformanceAnalytics;
  feedback: {
    totalFeedback: number;
    averageRating: number;
    feedbackByType: Record<string, number>;
    recentFeedback: UserFeedback[];
  };
  summary: {
    totalErrors: number;
    averageResponseTime: number;
    totalFeedback: number;
    systemHealth: 'healthy' | 'warning' | 'critical';
  };
}

interface ApiTestData {
  results: Array<{
    success: boolean;
    endpoint: string;
    duration: number;
    data?: unknown;
    error?: string;
    timestamp: string;
  }>;
  metrics: {
    averageResponseTime: number;
    totalRequests: number;
    errorRate: number;
  };
  summary: {
    total: number;
    passed: number;
    failed: number;
    successRate: number;
  };
}

// ============================================================================
// Monitoring Dashboard Component
// ============================================================================

const MonitoringDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'errors' | 'performance' | 'api' | 'feedback'>('overview');
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [apiTestData, setApiTestData] = useState<ApiTestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // const queryClient = useQueryClient();
  const monitoringDashboard = createMonitoringDashboard();
  // const apiTester = createApiTester({
  //   baseUrl: process.env.NEXT_PUBLIC_NEHTW_BASE_URL || 'https://nehtw.com/api',
  //   timeout: 30000,
  //   retries: 3,
  //   rateLimit: { requests: 100, window: 60000 }
  // });

  // Load monitoring data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Get monitoring data
        const data = monitoringDashboard.getMonitoringData();
        setMonitoringData(data);

        // Run API tests
        // const testResults = await apiTester.testEndpoints([
        //   { method: 'GET', endpoint: '/api/me' },
        //   { method: 'GET', endpoint: '/api/stockinfo/shutterstock/12345' },
        //   { method: 'GET', endpoint: '/api/stockorder/shutterstock/12345' }
        // ]);

        // const metrics = apiTester.getMetrics();
        // const summary = {
        //   total: testResults.length,
        //   passed: testResults.filter(r => r.status === 'success').length,
        //   failed: testResults.filter(r => r.status === 'error').length,
        //   successRate: testResults.filter(r => r.status === 'success').length / testResults.length
        // };

        // setApiTestData({ results: testResults, metrics, summary });
      } catch (error) {
        console.error('Failed to load monitoring data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Auto-refresh every 30 seconds
    if (autoRefresh) {
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, monitoringDashboard]);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircleIcon className="w-5 h-5" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'critical': return <XCircleIcon className="w-5 h-5" />;
      default: return <ClockIcon className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Monitoring Dashboard</h1>
            <p className="text-gray-400">Real-time system monitoring and analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Auto-refresh</span>
            </label>
            <div className={`flex items-center space-x-2 ${getHealthColor(monitoringData?.summary.systemHealth || 'healthy')}`}>
              {getHealthIcon(monitoringData?.summary.systemHealth || 'healthy')}
              <span className="font-medium capitalize">
                {monitoringData?.summary.systemHealth || 'healthy'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="glass-card p-6 mb-8">
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'errors', label: 'Errors', icon: ExclamationTriangleIcon },
            { id: 'performance', label: 'Performance', icon: ClockIcon },
            { id: 'api', label: 'API Tests', icon: ArrowTrendingUpIcon },
            { id: 'feedback', label: 'Feedback', icon: ChatBubbleLeftRightIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'errors' | 'performance' | 'api' | 'feedback')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-primaryOrange-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && monitoringData && (
            <OverviewTab data={monitoringData} />
          )}
          {activeTab === 'errors' && monitoringData && (
            <ErrorsTab data={monitoringData.errors} />
          )}
          {activeTab === 'performance' && monitoringData && (
            <PerformanceTab data={monitoringData.performance} />
          )}
          {activeTab === 'api' && apiTestData && (
            <ApiTab data={apiTestData} />
          )}
          {activeTab === 'feedback' && monitoringData && (
            <FeedbackTab data={monitoringData.feedback} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// Tab Components
// ============================================================================

const OverviewTab: React.FC<{ data: MonitoringData }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-red-500/20">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-2xl font-bold text-white">{data.summary.totalErrors}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-400">Total Errors</h3>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <ClockIcon className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white">
              {data.summary.averageResponseTime.toFixed(0)}ms
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-400">Avg Response Time</h3>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-2xl font-bold text-white">{data.summary.totalFeedback}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-400">User Feedback</h3>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <EyeIcon className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-2xl font-bold text-white">
              {(data.errors.errorRate * 100).toFixed(1)}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-400">Error Rate</h3>
        </div>
      </div>

      {/* System Health */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-6">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {data.errors.totalErrors}
            </div>
            <div className="text-sm text-gray-400">Total Errors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {data.performance.averageResponseTime.toFixed(0)}ms
            </div>
            <div className="text-sm text-gray-400">Average Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {data.feedback.averageRating.toFixed(1)}/5
            </div>
            <div className="text-sm text-gray-400">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ErrorsTab: React.FC<{ data: ErrorAnalytics }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Error Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Errors by Category</h3>
          <div className="space-y-3">
            {Object.entries(data.errorsByCategory).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-300 capitalize">{category}</span>
                <span className="text-white font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Errors by Level</h3>
          <div className="space-y-3">
            {Object.entries(data.errorsByLevel).map(([level, count]) => (
              <div key={level} className="flex justify-between items-center">
                <span className="text-gray-300 capitalize">{level}</span>
                <span className="text-white font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Errors */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Errors</h3>
        <div className="space-y-3">
          {data.topErrors.slice(0, 5).map((error, index) => (
            <div key={index} className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-white font-medium">{error.message}</div>
                <div className="text-sm text-gray-400">
                  Last occurred: {new Date(error.lastOccurred).toLocaleString()}
                </div>
              </div>
              <div className="text-white font-bold">{error.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PerformanceTab: React.FC<{ data: PerformanceAnalytics }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Average Response Time</h3>
          <div className="text-3xl font-bold text-white mb-2">
            {data.averageResponseTime.toFixed(2)}ms
          </div>
          <div className="text-sm text-gray-400">
            {data.averageResponseTime < 1000 ? 'Excellent' : 
             data.averageResponseTime < 3000 ? 'Good' : 'Needs Improvement'}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Trend</h3>
          <div className="text-sm text-gray-400">
            Last 7 days average: {data.performanceTrend[data.performanceTrend.length - 1]?.averageDuration.toFixed(2)}ms
          </div>
        </div>
      </div>

      {/* Slowest Operations */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Slowest Operations</h3>
        <div className="space-y-3">
          {data.slowestOperations.slice(0, 10).map((operation, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <div className="text-white font-medium">{operation.name}</div>
                <div className="text-sm text-gray-400">
                  {operation.count} executions
                </div>
              </div>
              <div className="text-white font-bold">
                {operation.averageDuration.toFixed(2)}ms
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ApiTab: React.FC<{ data: ApiTestData }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* API Test Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Test Results</h3>
          <div className="text-3xl font-bold text-white mb-2">
            {data.summary.passed}/{data.summary.total}
          </div>
          <div className="text-sm text-gray-400">
            {(data.summary.successRate * 100).toFixed(1)}% success rate
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Average Response Time</h3>
          <div className="text-3xl font-bold text-white mb-2">
            {data.metrics.averageResponseTime.toFixed(2)}ms
          </div>
          <div className="text-sm text-gray-400">
            {data.metrics.totalRequests} total requests
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Error Rate</h3>
          <div className="text-3xl font-bold text-white mb-2">
            {(data.metrics.errorRate * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">
            {Math.round(data.metrics.errorRate * data.metrics.totalRequests)} failed requests
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Test Results</h3>
        <div className="space-y-3">
          {data.results.map((result, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <div>
                <div className="text-white font-medium">
                  {result.endpoint}
                </div>
                <div className="text-sm text-gray-400">
                  {result.duration}ms
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.success 
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {result.success ? 'Success' : 'Failed'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeedbackTab: React.FC<{ data: MonitoringData['feedback'] }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Feedback Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Total Feedback</h3>
          <div className="text-3xl font-bold text-white mb-2">{data.totalFeedback}</div>
          <div className="text-sm text-gray-400">
            Average rating: {data.averageRating.toFixed(1)}/5
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Feedback by Type</h3>
          <div className="space-y-3">
            {Object.entries(data.feedbackByType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-gray-300 capitalize">{type.replace('_', ' ')}</span>
                <span className="text-white font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Feedback</h3>
        <div className="space-y-4">
          {data.recentFeedback.slice(0, 5).map((feedback) => (
            <div key={feedback.id} className="p-4 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="text-white font-medium capitalize">
                  {feedback.type.replace('_', ' ')}
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(feedback.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="text-gray-300 mb-2">{feedback.message}</div>
              {feedback.rating && (
                <div className="text-sm text-gray-400">
                  Rating: {feedback.rating}/5
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
