'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useUserBalance } from '@/hooks/useStockMedia'
import { VirtualPaymentModal } from '@/components/payments/VirtualPaymentModal'
import { CreditCardIcon, BanknotesIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const CREDIT_PACKAGES = [
  { amount: 10, price: 10, bonus: 0, popular: false },
  { amount: 25, price: 25, bonus: 5, popular: true },
  { amount: 50, price: 50, bonus: 15, popular: false },
  { amount: 100, price: 100, bonus: 40, popular: false },
]

export default function BillingPage() {
  const { user } = useAuth()
  const { data: balance, isLoading: balanceLoading } = useUserBalance()
  const [selectedPackage, setSelectedPackage] = useState<typeof CREDIT_PACKAGES[0] | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Authentication Required</h3>
          <p className="mt-1 text-sm text-gray-500">Please sign in to manage your billing.</p>
        </div>
      </div>
    )
  }

  const handlePurchaseCredits = (pkg: typeof CREDIT_PACKAGES[0]) => {
    setSelectedPackage(pkg)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('Payment successful:', paymentIntentId)
    // Here you would typically:
    // 1. Refresh the user balance
    // 2. Show success notification
    // 3. Redirect to dashboard
    setShowPaymentModal(false)
    setSelectedPackage(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing & Credits</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your account balance and purchase credits
          </p>
        </div>

        {/* Current Balance */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Current Balance</h2>
              <p className="text-sm text-gray-600">Available credits for downloads and AI generation</p>
            </div>
            <div className="text-right">
              {balanceLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              ) : (
                <div className="text-3xl font-bold text-green-600">
                  ${balance?.balance?.toFixed(2) || '0.00'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Credit Packages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase Credits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CREDIT_PACKAGES.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-lg shadow-lg p-6 ${
                  pkg.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ${pkg.amount}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    {pkg.bonus > 0 && (
                      <span className="text-green-600 font-medium">
                        +${pkg.bonus} bonus credits
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Credits:</span>
                      <span className="font-medium">{pkg.amount + pkg.bonus}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Price:</span>
                      <span className="font-medium">${pkg.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchaseCredits(pkg)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
            <Link 
              href="/billing/history"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all payments
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="p-6">
            <div className="text-center py-8">
              <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No payments yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your payment history will appear here after your first purchase.
              </p>
              <div className="mt-4">
                <Link 
                  href="/billing/history"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                >
                  View Payment History
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Payment Modal */}
        {selectedPackage && (
          <VirtualPaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false)
              setSelectedPackage(null)
            }}
            amount={selectedPackage.price}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  )
}
