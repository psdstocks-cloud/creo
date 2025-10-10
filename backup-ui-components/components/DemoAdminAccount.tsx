'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'

interface DemoAdminAccountProps {
  onLogin: (email: string, password: string) => void
}

export function DemoAdminAccount({ onLogin }: DemoAdminAccountProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const demoAccounts = [
    {
      role: 'Super Admin',
      email: 'admin@creo.demo',
      password: 'admin123',
      permissions: ['All Access', 'User Management', 'System Settings', 'Analytics']
    },
    {
      role: 'Content Manager',
      email: 'content@creo.demo',
      password: 'content123',
      permissions: ['Content Management', 'Order Processing', 'Analytics']
    },
    {
      role: 'Support Admin',
      email: 'support@creo.demo',
      password: 'support123',
      permissions: ['User Support', 'Order Management', 'Basic Analytics']
    }
  ]

  const handleDemoLogin = (email: string, password: string) => {
    onLogin(email, password)
    setIsOpen(false)
  }

  if (user) {
    return null // Don't show demo accounts if user is already logged in
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors z-50"
      >
        🎭 Demo Admin
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Demo Admin Accounts</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Use these demo accounts to test admin functionality. These are pre-configured accounts with different permission levels.
            </p>

            <div className="space-y-4">
              {demoAccounts.map((account, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{account.role}</h3>
                      <p className="text-sm text-gray-600">{account.email}</p>
                    </div>
                    <button
                      onClick={() => handleDemoLogin(account.email, account.password)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Login
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-2">
                      {account.permissions.map((permission, permIndex) => (
                        <span
                          key={permIndex}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-gray-600 mb-1">Demo Credentials:</p>
                    <p className="text-sm font-mono">
                      <strong>Email:</strong> {account.email}<br />
                      <strong>Password:</strong> {account.password}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Demo Mode Notice</h4>
              <p className="text-sm text-yellow-700">
                These are demo accounts for testing purposes. In production, you would use real authentication with proper security measures.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
