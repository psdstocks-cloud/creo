'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { XMarkIcon } from '@heroicons/react/24/outline'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  onSuccess: (paymentIntentId: string) => void
}

export function PaymentModal({ isOpen, onClose, amount, onSuccess }: PaymentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Credits</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm 
            amount={amount} 
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </Elements>
      </div>
    </div>
  )
}

function PaymentForm({ 
  amount, 
  onSuccess, 
  onClose 
}: { 
  amount: number
  onSuccess: (paymentIntentId: string) => void
  onClose: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create payment intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'usd',
          metadata: {
            userId: 'current-user-id', // Replace with actual user ID
            type: 'credit_purchase',
          },
        }),
      })

      const { clientSecret } = await response.json()

      if (!clientSecret) {
        throw new Error('Failed to create payment intent')
      }

      // Confirm payment
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      })

      if (error) {
        setError(error.message || 'Payment failed')
      } else {
        onSuccess('payment-success')
        onClose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total Amount</span>
          <span className="text-2xl font-bold text-green-600">${amount.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Credits will be added to your account immediately after payment
        </p>
      </div>

      <PaymentElement />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  )
}
