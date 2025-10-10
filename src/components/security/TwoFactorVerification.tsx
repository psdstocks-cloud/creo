'use client'

import { useState } from 'react'
import { twoFactorAuthService } from '@/lib/2fa'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ShieldCheckIcon, 
  KeyIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface TwoFactorVerificationProps {
  onSuccess: () => void
  onCancel?: () => void
  title?: string
  description?: string
}

export function TwoFactorVerification({ 
  onSuccess, 
  onCancel, 
  title = "Two-Factor Authentication",
  description = "Enter the 6-digit code from your authenticator app"
}: TwoFactorVerificationProps) {
  const [code, setCode] = useState('')
  const [backupCode, setBackupCode] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (loading || locked) return
    
    if (!code && !backupCode) {
      setError('Please enter a verification code')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // Simulate user ID - in real app, get from auth context
      const userId = 'user-id' // This should come from auth context
      
      let result
      if (useBackupCode) {
        result = await twoFactorAuthService.verifyBackupCode(userId, backupCode)
      } else {
        result = await twoFactorAuthService.verify2FAToken(userId, code)
      }
      
      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || 'Invalid code')
        setAttempts(prev => prev + 1)
        
        // Lock after 5 attempts
        if (attempts >= 4) {
          setLocked(true)
          setError('Too many failed attempts. Please try again later.')
        }
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = () => {
    setCode('')
    setBackupCode('')
    setError('')
    setAttempts(0)
    setLocked(false)
  }

  const handleSwitchMode = () => {
    setUseBackupCode(!useBackupCode)
    setCode('')
    setBackupCode('')
    setError('')
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!useBackupCode ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Authentication Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={6}
                    disabled={loading || locked}
                    autoComplete="one-time-code"
                  />
                </div>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSwitchMode}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                    disabled={loading || locked}
                  >
                    Use backup code instead
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="backupCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Code
                  </label>
                  <input
                    id="backupCode"
                    type="text"
                    value={backupCode}
                    onChange={(e) => setBackupCode(e.target.value.toUpperCase().slice(0, 8))}
                    placeholder="XXXXXXXX"
                    className="w-full text-center font-mono tracking-wider border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={8}
                    disabled={loading || locked}
                  />
                </div>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSwitchMode}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                    disabled={loading || locked}
                  >
                    Use authenticator app instead
                  </button>
                </div>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2"
              >
                <XCircleIcon className="h-5 w-5 text-red-600" />
                <span className="text-sm text-red-800">{error}</span>
              </motion.div>
            )}

            {attempts > 0 && attempts < 5 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  {5 - attempts} attempts remaining
                </span>
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={loading || locked || (!code && !backupCode)}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify'
                )}
              </Button>

              {locked && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  className="w-full"
                >
                  Try Again
                </Button>
              )}

              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="w-full"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Need help?</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Make sure your device time is correct</p>
                <p>• Check that you're using the right authenticator app</p>
                <p>• Contact support if you're still having trouble</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
