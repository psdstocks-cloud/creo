'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { 
  CreditCardIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Mock payment history data - in real app, this would come from API
const mockPayments = [
  {
    id: 'pi_1234567890',
    amount: 25.00,
    currency: 'USD',
    status: 'succeeded',
    createdAt: '2024-01-15T10:30:00Z',
    description: 'Credits Purchase - 25 Credits + 5 Bonus',
    creditsAdded: 30,
    paymentMethod: 'card_****1234',
    receiptUrl: '#'
  },
  {
    id: 'pi_0987654321',
    amount: 50.00,
    currency: 'USD',
    status: 'succeeded',
    createdAt: '2024-01-10T14:22:00Z',
    description: 'Credits Purchase - 50 Credits + 15 Bonus',
    creditsAdded: 65,
    paymentMethod: 'card_****5678',
    receiptUrl: '#'
  },
  {
    id: 'pi_1122334455',
    amount: 10.00,
    currency: 'USD',
    status: 'failed',
    createdAt: '2024-01-08T09:15:00Z',
    description: 'Credits Purchase - 10 Credits',
    creditsAdded: 0,
    paymentMethod: 'card_****9999',
    receiptUrl: null
  },
  {
    id: 'pi_5566778899',
    amount: 100.00,
    currency: 'USD',
    status: 'processing',
    createdAt: '2024-01-05T16:45:00Z',
    description: 'Credits Purchase - 100 Credits + 40 Bonus',
    creditsAdded: 0,
    paymentMethod: 'card_****1111',
    receiptUrl: null
  }
]

export default function PaymentHistoryPage() {
  const { user, loading } = useAuth()
  const [filter, setFilter] = useState<'all' | 'succeeded' | 'failed' | 'processing'>('all')

  if (loading) {
    return (
      <PageLayout title="Payment History" subtitle="Your transaction history">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </PageLayout>
    )
  }

  if (!user) {
    return (
      <PageLayout title="Payment History" subtitle="Your transaction history">
        <div className="text-center py-12">
          <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-500">Please sign in to view your payment history.</p>
        </div>
      </PageLayout>
    )
  }

  const filteredPayments = mockPayments.filter(payment => 
    filter === 'all' || payment.status === filter
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'text-green-600 bg-green-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      case 'processing':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <PageLayout title="Payment History" subtitle="Your transaction history">
      <div className="space-y-6">
        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-white/60 backdrop-blur-md rounded-lg p-1 border border-white/20">
          {[
            { key: 'all', label: 'All Payments', count: mockPayments.length },
            { key: 'succeeded', label: 'Successful', count: mockPayments.filter(p => p.status === 'succeeded').length },
            { key: 'failed', label: 'Failed', count: mockPayments.filter(p => p.status === 'failed').length },
            { key: 'processing', label: 'Processing', count: mockPayments.filter(p => p.status === 'processing').length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === key
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-700 hover:bg-white/50'
              }`}
            >
              {label}
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Payment List */}
        <div className="space-y-4">
          {filteredPayments.length === 0 ? (
            <Card variant="glass" className="text-center py-12">
              <CardContent>
                <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                <p className="text-gray-500">No payments match your current filter.</p>
              </CardContent>
            </Card>
          ) : (
            filteredPayments.map((payment, index) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" hover>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <CreditCardIcon className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {payment.description}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                              ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                            </span>
                            <span>Card ending in {payment.paymentMethod.split('_')[1]}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(payment.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </div>
                          {payment.creditsAdded > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                              +{payment.creditsAdded} credits
                            </p>
                          )}
                        </div>
                        
                        {payment.receiptUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                            onClick={() => window.open(payment.receiptUrl, '_blank')}
                          >
                            Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Overview of your payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${mockPayments
                    .filter(p => p.status === 'succeeded')
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">Total Paid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {mockPayments
                    .filter(p => p.status === 'succeeded')
                    .reduce((sum, p) => sum + p.creditsAdded, 0)}
                </div>
                <div className="text-sm text-gray-500">Credits Purchased</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {mockPayments.filter(p => p.status === 'succeeded').length}
                </div>
                <div className="text-sm text-gray-500">Successful Payments</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
