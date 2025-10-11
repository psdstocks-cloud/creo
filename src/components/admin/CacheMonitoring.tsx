'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { RefreshCw, Database, Zap, Trash2, TrendingUp } from 'lucide-react'

interface CacheStats {
  totalKeys: number
  memoryUsage: string
  hitRate: number
  missRate: number
  totalRequests: number
  cachedRequests: number
  averageResponseTime: number
}

interface CacheHealth {
  status: 'healthy' | 'unhealthy'
  latency: number
  error?: string
}

export default function CacheMonitoring() {
  const [stats, setStats] = useState<CacheStats | null>(null)
  const [health, setHealth] = useState<CacheHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchCacheStats = async () => {
    try {
      const response = await fetch('/api/admin/cache/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching cache stats:', error)
    }
  }

  const fetchCacheHealth = async () => {
    try {
      const response = await fetch('/api/admin/cache/health')
      if (response.ok) {
        const data = await response.json()
        setHealth(data)
      }
    } catch (error) {
      console.error('Error fetching cache health:', error)
    }
  }

  const refreshStats = async () => {
    setRefreshing(true)
    await Promise.all([fetchCacheStats(), fetchCacheHealth()])
    setRefreshing(false)
  }

  const clearCache = async () => {
    try {
      const response = await fetch('/api/admin/cache/clear', {
        method: 'POST',
      })
      if (response.ok) {
        await refreshStats()
      }
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }

  const warmCache = async () => {
    try {
      const response = await fetch('/api/admin/cache/warm', {
        method: 'POST',
      })
      if (response.ok) {
        await refreshStats()
      }
    } catch (error) {
      console.error('Error warming cache:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchCacheStats(), fetchCacheHealth()])
      setLoading(false)
    }

    loadData()

    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading cache monitoring...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cache Monitoring</h2>
          <p className="text-gray-600">Monitor cache performance and health</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={refreshStats}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={warmCache}
            variant="outline"
            size="sm"
          >
            <Zap className="h-4 w-4 mr-2" />
            Warm Cache
          </Button>
          <Button
            onClick={clearCache}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Health Status */}
      {health && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Cache Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge
                  variant={health.status === 'healthy' ? 'default' : 'destructive'}
                >
                  {health.status === 'healthy' ? 'Healthy' : 'Unhealthy'}
                </Badge>
                <span className="text-sm text-gray-600">
                  Latency: {health.latency}ms
                </span>
              </div>
              {health.error && (
                <span className="text-sm text-red-600">{health.error}</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cache Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Keys */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalKeys.toLocaleString()}</div>
              <p className="text-xs text-gray-600">Cached items</p>
            </CardContent>
          </Card>

          {/* Memory Usage */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.memoryUsage}</div>
              <p className="text-xs text-gray-600">Redis memory</p>
            </CardContent>
          </Card>

          {/* Hit Rate */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Hit Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.hitRate * 100).toFixed(1)}%
              </div>
              <Progress value={stats.hitRate * 100} className="mt-2" />
            </CardContent>
          </Card>

          {/* Total Requests */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</div>
              <p className="text-xs text-gray-600">All time</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Metrics */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cache Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Cache Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Hit Rate</span>
                <span className="text-sm text-gray-600">
                  {(stats.hitRate * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={stats.hitRate * 100} />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Miss Rate</span>
                <span className="text-sm text-gray-600">
                  {(stats.missRate * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={stats.missRate * 100} />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Cached Requests</span>
                <span className="text-sm text-gray-600">
                  {stats.cachedRequests.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Response Times */}
          <Card>
            <CardHeader>
              <CardTitle>Response Times</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Response Time</span>
                <span className="text-sm text-gray-600">
                  {stats.averageResponseTime.toFixed(2)}ms
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Cache Latency</span>
                <span className="text-sm text-gray-600">
                  {health?.latency || 0}ms
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cache Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Cache Management</CardTitle>
          <CardDescription>
            Manage cache operations and monitor performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={warmCache}
              variant="outline"
              size="sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              Warm Cache
            </Button>
            <Button
              onClick={clearCache}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Cache
            </Button>
            <Button
              onClick={refreshStats}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Stats
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
