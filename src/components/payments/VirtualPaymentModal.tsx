'use client'

import { useState } from 'react'
import { XMarkIcon, CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { BrandButton } from '@/components/ui/BrandButton'
// import { BrandInput } from '@/components/ui/BrandInput'
import { GlassCard } from '@/components/ui/GlassCard'
import { useToastHelpers } from '@/components/ui/Toast'

interface VirtualPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  onSuccess: (paymentId: string) => void
}

const VIRTUAL_CARDS = [
  { id: 'visa', name: 'Visa', number: '**** **** **** 4242', color: 'bg-blue-600' },
  { id: 'mastercard', name: 'Mastercard', number: '**** **** **** 5555', color: 'bg-red-600' },
  { id: 'amex', name: 'American Express', number: '**** ****** *1234', color: 'bg-green-600' },
]

export function VirtualPaymentModal({ isOpen, onClose, amount, onSuccess }: VirtualPaymentModalProps) {
  const [selectedCard, setSelectedCard] = useState('visa')
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'card' | 'processing' | 'success'>('card')
  const { success, error } = useToastHelpers()

  if (!isOpen) return null

  const handlePayment = async () => {
    setIsProcessing(true)
    setStep('processing')

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        setStep('success')
        success('Payment Successful!', 'Your credits have been added to your account.')
        setTimeout(() => {
          onSuccess(`virtual_${Date.now()}`)
          onClose()
          setStep('card')
          setIsProcessing(false)
        }, 2000)
      } else {
        throw new Error('Payment failed. Please try again.')
      }
    } catch (err) {
      error('Payment Failed', err instanceof Error ? err.message : 'Please try again.')
      setStep('card')
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (!isProcessing) {
      onClose()
      setStep('card')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <GlassCard variant="light" intensity="strong" className="w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add Credits</h2>
          <button 
            onClick={handleClose}
            disabled={isProcessing}
            className="text-white/60 hover:text-white disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {step === 'card' && (
          <>
            <div className="mb-6">
              <div className="bg-gradient-brand rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center text-white">
                  <span className="text-lg font-medium">Total Amount</span>
                  <span className="text-2xl font-bold">${amount.toFixed(2)}</span>
                </div>
                <p className="text-white/80 text-sm mt-1">
                  Credits will be added immediately after payment
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-white mb-2">
                  Select Payment Method
                </label>
                {VIRTUAL_CARDS.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(card.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all ${
                      selectedCard === card.id
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-6 rounded ${card.color} flex items-center justify-center`}>
                        <CreditCardIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white font-medium">{card.name}</div>
                        <div className="text-white/60 text-sm">{card.number}</div>
                      </div>
                      {selectedCard === card.id && (
                        <CheckCircleIcon className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <BrandButton
                variant="glass"
                className="flex-1"
                onClick={handleClose}
                disabled={isProcessing}
              >
                Cancel
              </BrandButton>
              <BrandButton
                variant="primary"
                className="flex-1"
                onClick={handlePayment}
                loading={isProcessing}
                disabled={isProcessing}
              >
                Pay ${amount.toFixed(2)}
              </BrandButton>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Processing Payment</h3>
            <p className="text-white/70">Please wait while we process your payment...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Payment Successful!</h3>
            <p className="text-white/70">Your credits have been added to your account.</p>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
