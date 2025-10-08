'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useUserBalance } from '@/hooks/useStockMedia'
import { 
  UserIcon, 
  CreditCardIcon, 
  Cog6ToothIcon, 
  KeyIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const { user, userRole, isDemoUser, isAdmin } = useAuth()
  const { data: balance, isLoading: balanceLoading } = useUserBalance()
  const [activeTab, setActiveTab] = useState('account')

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-semibold text-gray-900">Authentication Required</h3>
          <p className="mt-1 text-gray-500">Please sign in to access settings.</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'account', name: 'Account', icon: UserIcon, description: 'Manage your account information' },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon, description: 'Payment methods and billing history' },
    { id: 'api', name: 'API', icon: KeyIcon, description: 'API keys and integrations' },
    { id: 'preferences', name: 'Preferences', icon: Cog6ToothIcon, description: 'Customize your experience' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your account preferences and configurations
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 inline mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                  <p className="text-sm text-gray-500">Manage your account details and profile information.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">{user.email}</span>
                        {isDemoUser && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Demo Account
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Role</label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <span className="text-gray-900 capitalize">
                        {userRole?.replace('_', ' ')}
                      </span>
                      {isAdmin && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Balance</label>
                    <div className="p-3 bg-green-50 rounded-md border border-green-200">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-green-800 font-medium text-lg">
                          ${balanceLoading ? 'Loading...' : balance?.balance.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                    <div className="p-3 bg-green-50 rounded-md border border-green-200">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-green-800 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {isDemoUser && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Demo Account</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>You&apos;re using a demo account for testing purposes. Some features may be limited.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Billing & Payments</h3>
                  <p className="text-sm text-gray-500">Manage your billing information and payment methods.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Billing Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Payment methods and billing history will be available soon.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">Current Plan</h4>
                    <p className="text-sm text-gray-500 mt-1">Free Tier</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">Next Billing Date</h4>
                    <p className="text-sm text-gray-500 mt-1">No active subscription</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">API Configuration</h3>
                  <p className="text-sm text-gray-500">API settings and integration information.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <h4 className="font-medium text-gray-900">NEHTW API</h4>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Connected and operational</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <h4 className="font-medium text-gray-900">TanStack Query</h4>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Caching and state management active</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-2">API Usage Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">0</div>
                      <div className="text-sm text-gray-500">API Calls Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">0</div>
                      <div className="text-sm text-gray-500">Orders Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">0</div>
                      <div className="text-sm text-gray-500">Downloads</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
                  <p className="text-sm text-gray-500">Customize your experience and default settings.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive updates about your orders and account</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">Auto-download</h4>
                      <p className="text-sm text-gray-500">Automatically download completed orders</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">Dark Mode</h4>
                      <p className="text-sm text-gray-500">Switch to dark theme</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <Cog6ToothIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">More Preferences</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Additional customization options will be available soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
