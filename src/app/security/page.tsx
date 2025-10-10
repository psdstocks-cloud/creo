'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { twoFactorAuthService } from '@/lib/2fa'
import { PageLayout } from '@/components/layout/PageLayout'
import { TwoFactorSetup } from '@/components/security/TwoFactorSetup'
import { TwoFactorVerification } from '@/components/security/TwoFactorVerification'
import { SecurityDashboard } from '@/components/security/SecurityDashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  ShieldCheckIcon, 
  KeyIcon, 
  EyeIcon, 
  LockClosedIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

export default function SecurityPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | '2fa' | 'monitoring'>('overview')
  const [show2FASetup, setShow2FASetup] = useState(false)
  const [show2FAVerification, setShow2FAVerification] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      check2FAStatus()
    }
  }, [user?.id])

  const check2FAStatus = async () => {
    try {
      setLoading(true)
      const isEnabled = await twoFactorAuthService.is2FAEnabled(user?.id || '')
      setTwoFactorEnabled(isEnabled)
    } catch (error) {
      console.error('Error checking 2FA status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handle2FASetup = () => {
    setShow2FASetup(true)
  }

  const handle2FADisable = () => {
    setShow2FAVerification(true)
  }

  const handle2FAComplete = () => {
    setShow2FASetup(false)
    setShow2FAVerification(false)
    check2FAStatus()
  }

  const handle2FACancel = () => {
    setShow2FASetup(false)
    setShow2FAVerification(false)
  }

  const handle2FADisableConfirm = async () => {
    try {
      setLoading(true)
      const result = await twoFactorAuthService.disable2FA(user?.id || '')
      if (result.success) {
        setTwoFactorEnabled(false)
        setShow2FAVerification(false)
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <PageLayout requiresAuth title="Security Settings" subtitle="Manage your account security">
        <div className="text-center">Please sign in to manage your security settings.</div>
      </PageLayout>
    )
  }

  if (show2FASetup) {
    return (
      <PageLayout title="Two-Factor Authentication Setup" subtitle="Secure your account with 2FA">
        <TwoFactorSetup onComplete={handle2FAComplete} onCancel={handle2FACancel} />
      </PageLayout>
    )
  }

  if (show2FAVerification) {
    return (
      <PageLayout title="Disable Two-Factor Authentication" subtitle="Verify your identity to disable 2FA">
        <TwoFactorVerification 
          onSuccess={handle2FADisableConfirm}
          onCancel={handle2FACancel}
          title="Disable 2FA"
          description="Enter your 2FA code to disable two-factor authentication"
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      title="Security Settings" 
      subtitle="Manage your account security and monitoring"
      className="bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Security Overview
            </button>
            <button
              onClick={() => setActiveTab('2fa')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === '2fa'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Two-Factor Authentication
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'monitoring'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Security Monitoring
            </button>
          </nav>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Security Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Two-Factor Authentication</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {loading ? '...' : twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      {twoFactorEnabled ? (
                        <CheckCircleIcon className="h-8 w-8 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-8 w-8 text-red-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Password Strength</p>
                        <p className="text-2xl font-bold text-gray-900">Strong</p>
                      </div>
                      <LockClosedIcon className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Last Login</p>
                        <p className="text-2xl font-bold text-gray-900">2 hours ago</p>
                      </div>
                      <EyeIcon className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Security Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Recommendations</CardTitle>
                  <CardDescription>
                    Improve your account security with these recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!twoFactorEnabled && (
                    <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium text-yellow-800">Enable Two-Factor Authentication</p>
                          <p className="text-sm text-yellow-700">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <Button onClick={handle2FASetup} size="sm">
                        Enable 2FA
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <KeyIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">Update Your Password</p>
                        <p className="text-sm text-blue-700">Use a strong, unique password</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Review Login Activity</p>
                        <p className="text-sm text-green-700">Check for any suspicious activity</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === '2fa' && (
            <motion.div
              key="2fa"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Secure your account with an additional layer of protection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {twoFactorEnabled ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-6 w-6 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {twoFactorEnabled ? '2FA is Enabled' : '2FA is Disabled'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {twoFactorEnabled 
                            ? 'Your account is protected with two-factor authentication'
                            : 'Enable 2FA to add an extra layer of security'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {twoFactorEnabled ? (
                        <Button variant="outline" onClick={handle2FADisable}>
                          Disable 2FA
                        </Button>
                      ) : (
                        <Button onClick={handle2FASetup}>
                          Enable 2FA
                        </Button>
                      )}
                    </div>
                  </div>

                  {twoFactorEnabled && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800">2FA is Active</p>
                          <p className="text-sm text-green-700 mt-1">
                            Your account is protected with two-factor authentication. 
                            You'll need to enter a code from your authenticator app when signing in.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'monitoring' && (
            <motion.div
              key="monitoring"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SecurityDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  )
}
