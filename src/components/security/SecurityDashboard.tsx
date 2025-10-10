'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  EyeIcon, 
  LockClosedIcon,
  KeyIcon,
  ClockIcon,
  UserIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface SecurityEvent {
  id: string
  type: 'suspicious_activity' | 'rate_limit_exceeded' | 'invalid_input' | 'unauthorized_access'
  message: string
  ip: string
  userAgent: string
  userId: string
  timestamp: string
  metadata: Record<string, any>
}

interface SecurityStats {
  totalEvents: number
  suspiciousActivity: number
  rateLimitExceeded: number
  invalidInput: number
  unauthorizedAccess: number
  last24Hours: number
  topIPs: Array<{ ip: string; count: number }>
  topUserAgents: Array<{ userAgent: string; count: number }>
}

export function SecurityDashboard() {
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [stats, setStats] = useState<SecurityStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('24h')

  useEffect(() => {
    fetchSecurityData()
  }, [filter, timeRange])

  const fetchSecurityData = async () => {
    try {
      setLoading(true)
      
      // Fetch security events
      const eventsResponse = await fetch(`/api/security/monitor?type=${filter}&limit=50`)
      const eventsData = await eventsResponse.json()
      setEvents(eventsData.events || [])
      
      // Calculate stats (mock data for now)
      const mockStats: SecurityStats = {
        totalEvents: 1247,
        suspiciousActivity: 23,
        rateLimitExceeded: 156,
        invalidInput: 89,
        unauthorizedAccess: 12,
        last24Hours: 45,
        topIPs: [
          { ip: '192.168.1.100', count: 23 },
          { ip: '10.0.0.1', count: 18 },
          { ip: '203.0.113.1', count: 15 }
        ],
        topUserAgents: [
          { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', count: 45 },
          { userAgent: 'curl/7.68.0', count: 23 },
          { userAgent: 'PostmanRuntime/7.26.8', count: 12 }
        ]
      }
      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching security data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'suspicious_activity': return 'text-red-600 bg-red-100'
      case 'rate_limit_exceeded': return 'text-yellow-600 bg-yellow-100'
      case 'invalid_input': return 'text-orange-600 bg-orange-100'
      case 'unauthorized_access': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'suspicious_activity': return ExclamationTriangleIcon
      case 'rate_limit_exceeded': return ClockIcon
      case 'invalid_input': return KeyIcon
      case 'unauthorized_access': return LockClosedIcon
      default: return EyeIcon
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalEvents || 0}</p>
                </div>
                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last 24h</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.last24Hours || 0}</p>
                </div>
                <ClockIcon className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Suspicious</p>
                  <p className="text-2xl font-bold text-red-600">{stats?.suspiciousActivity || 0}</p>
                </div>
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rate Limited</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats?.rateLimitExceeded || 0}</p>
                </div>
                <LockClosedIcon className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All Events
          </Button>
          <Button
            variant={filter === 'suspicious_activity' ? 'default' : 'outline'}
            onClick={() => setFilter('suspicious_activity')}
            size="sm"
          >
            Suspicious
          </Button>
          <Button
            variant={filter === 'rate_limit_exceeded' ? 'default' : 'outline'}
            onClick={() => setFilter('rate_limit_exceeded')}
            size="sm"
          >
            Rate Limited
          </Button>
          <Button
            variant={filter === 'invalid_input' ? 'default' : 'outline'}
            onClick={() => setFilter('invalid_input')}
            size="sm"
          >
            Invalid Input
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={timeRange === '24h' ? 'default' : 'outline'}
            onClick={() => setTimeRange('24h')}
            size="sm"
          >
            Last 24h
          </Button>
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('7d')}
            size="sm"
          >
            Last 7 days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('30d')}
            size="sm"
          >
            Last 30 days
          </Button>
        </div>
      </div>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Security Events</CardTitle>
          <CardDescription>
            Recent security events and suspicious activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-8">
                <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No security events</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No security events found for the selected filters.
                </p>
              </div>
            ) : (
              events.map((event, index) => {
                const EventIcon = getEventTypeIcon(event.type)
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getEventTypeColor(event.type)}`}>
                          <EventIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                              {event.type.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {event.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <GlobeAltIcon className="h-3 w-3" />
                              <span>{event.ip}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <UserIcon className="h-3 w-3" />
                              <span>{event.userId}</span>
                            </div>
                          </div>
                          {Object.keys(event.metadata).length > 0 && (
                            <div className="mt-2 text-xs text-gray-600">
                              <details>
                                <summary className="cursor-pointer hover:text-gray-900">
                                  View Details
                                </summary>
                                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(event.metadata, null, 2)}
                                </pre>
                              </details>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
