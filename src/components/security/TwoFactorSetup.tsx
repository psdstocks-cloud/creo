'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { twoFactorAuthService, generate2FASecret, generateQRCode, verifyTOTPToken } from '@/lib/2fa'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ShieldCheckIcon, 
  QrCodeIcon, 
  KeyIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface TwoFactorSetupProps {
  onComplete?: () => void
  onCancel?: () => void
}

export function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<'setup' | 'verify' | 'backup' | 'complete'>('setup')
  const [secret, setSecret] = useState<string>('')
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [manualEntryKey, setManualEntryKey] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  // Initialize 2FA setup
  useEffect(() => {
    if (step === 'setup' && user?.email) {
      initialize2FA()
    }
  }, [step, user?.email])

  const initialize2FA = async () => {
    try {
      setLoading(true)
      setError('')
      
      const { secret, qrCodeUrl, manualEntryKey } = generate2FASecret(user?.email || '')
      const qrCodeDataUrl = await generateQRCode(qrCodeUrl)
      
      setSecret(secret)
      setQrCodeUrl(qrCodeUrl)
      setQrCodeDataUrl(qrCodeDataUrl)
      setManualEntryKey(manualEntryKey)
    } catch (err) {
      setError('Failed to initialize 2FA setup')
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const isValid = verifyTOTPToken(verificationCode, secret)
      
      if (!isValid) {
        setError('Invalid verification code. Please try again.')
        return
      }
      
      // Generate backup codes
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 10).toUpperCase()
      )
      setBackupCodes(codes)
      setStep('backup')
    } catch (err) {
      setError('Failed to verify code')
    } finally {
      setLoading(false)
    }
  }

  const handleEnable2FA = async () => {
    if (!user?.id) {
      setError('User not found')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const result = await twoFactorAuthService.enable2FA(user.id, secret, backupCodes)
      
      if (!result.success) {
        setError(result.error || 'Failed to enable 2FA')
        return
      }
      
      setStep('complete')
      setSuccess('2FA has been successfully enabled!')
    } catch (err) {
      setError('Failed to enable 2FA')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setStep('setup')
    setVerificationCode('')
    setError('')
    setSuccess('')
    onCancel?.()
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle>Two-Factor Authentication Setup</CardTitle>
              <CardDescription>
                Secure your account with an additional layer of protection
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Step 1: Scan QR Code</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Use your authenticator app to scan this QR code
                  </p>
                  
                  {loading ? (
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="w-48 h-48 mx-auto bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                      {qrCodeDataUrl && (
                        <img 
                          src={qrCodeDataUrl} 
                          alt="2FA QR Code" 
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold mb-3">Can't scan the QR code?</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Enter this code manually in your authenticator app:
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-sm font-mono break-all">{manualEntryKey}</code>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={() => setStep('verify')}>
                    Next: Verify Code
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'verify' && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Step 2: Verify Setup</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter the 6-digit code from your authenticator app
                  </p>
                  
                  <div className="max-w-xs mx-auto">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="w-full text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={6}
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                    <XCircleIcon className="h-5 w-5 text-red-600" />
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setStep('setup')}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleVerification}
                    disabled={loading || verificationCode.length !== 6}
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'backup' && (
              <motion.div
                key="backup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Step 3: Backup Codes</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device.
                  </p>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Important:</p>
                        <p>Each backup code can only be used once. Store them securely!</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="text-sm font-mono text-center py-2 bg-white rounded border">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleEnable2FA} disabled={loading}>
                    {loading ? 'Enabling...' : 'Enable 2FA'}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">2FA Successfully Enabled!</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your account is now protected with two-factor authentication.
                  </p>
                </div>

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-800">{success}</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={onComplete}>
                    Complete Setup
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
