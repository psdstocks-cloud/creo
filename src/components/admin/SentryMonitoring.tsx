'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  Zap,
  RefreshCw,
  ExternalLink
} from 'lucide-react'

interface SentryStats {
  errorCount: number
  errorRate: number
  performanceScore: number
  activeUsers: number
  responseTime: number
  uptime: number
}

interface ErrorData {
  id: string
  message: string
  level: string
  timestamp: string
  user: string
  url: string
  count: number
}

interface PerformanceData {
  metric: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
}

export function SentryMonitoring() {
  const [stats, setStats] = useState<SentryStats | null>(null)
  const [errors, setErrors] = useState<ErrorData[]>([])
  const [performance, setPerformance] = useState<PerformanceData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Mock data - replace with actual Sentry API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        errorCount: 12,
        errorRate: 0.02,
        performanceScore: 94,
        activeUsers: 1247,
        responseTime: 245,
        uptime: 99.9
      })
      
      setErrors([
        {
          id: '1',
          message: 'TypeError: Cannot read property of undefined',
          level: 'error',
          timestamp: '2024-01-15T10:30:00Z',
          user: 'user@example.com',
          url: '/dashboard',
          count: 5
        },
        {
          id: '2',
          message: 'NetworkError: Failed to fetch',
          level: 'error',
          timestamp: '2024-01-15T10:25:00Z',
          user: 'admin@example.com',
          url: '/api/orders',
          count: 3
        },
        {
          id: '3',
          message: 'ValidationError: Invalid input',
          level: 'warning',
          timestamp: '2024-01-15T10:20:00Z',
          user: 'user@example.com',
          url: '/settings',
          count: 2
        }
      ])
      
      setPerformance([
        { metric: 'LCP', value: 1.2, unit: 's', trend: 'down' },
        { metric: 'FID', value: 45, unit: 'ms', trend: 'stable' },
        { metric: 'CLS', value: 0.05, unit: '', trend: 'up' },
        { metric: 'TTFB', value: 180, unit: 'ms', trend: 'down' }
      ])
      
      setLoading(false)
    }
    
    fetchData()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const getErrorLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'destructive'
      case 'warning':
        return 'secondary'
      case 'info':
        return 'default'
      default:
        return 'default'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case 'down':
        return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
      case 'stable':
        return <Activity className="w-4 h-4 text-blue-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Sentry Monitoring</h2>
          <Button disabled>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sentry Monitoring</h2>
          <p className="text-gray-600">Real-time error tracking and performance monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            leftIcon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Button
            onClick={() => window.open('https://sentry.io', '_blank')}
            variant="outline"
            leftIcon={<ExternalLink className="w-4 h-4" />}
          >
            View in Sentry
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Count</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.errorCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.errorRate}% error rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <Zap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.performanceScore}</div>
            <p className="text-xs text-muted-foreground">
              Core Web Vitals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.responseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Errors */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Errors</CardTitle>
            <CardDescription>Latest errors from your application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {errors.map((error) => (
                <div key={error.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    <Badge variant={getErrorLevelColor(error.level) as any}>
                      {error.level}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {error.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {error.url} • {error.user} • {error.count} occurrences
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(error.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Core Web Vitals and performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performance.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{metric.metric}</p>
                      <p className="text-xs text-gray-500">
                        {metric.metric === 'LCP' ? 'Largest Contentful Paint' :
                         metric.metric === 'FID' ? 'First Input Delay' :
                         metric.metric === 'CLS' ? 'Cumulative Layout Shift' :
                         metric.metric === 'TTFB' ? 'Time to First Byte' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {metric.value}{metric.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      {metric.trend === 'up' ? 'Improving' :
                       metric.trend === 'down' ? 'Declining' : 'Stable'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Overall system health and uptime</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">All Systems Operational</p>
                <p className="text-xs text-gray-500">
                  {stats?.uptime}% uptime in the last 30 days
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800">
              Healthy
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
