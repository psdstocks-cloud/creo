import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface VirtualPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess?: (amount: number) => void
}

export const VirtualPaymentModal = ({ 
  isOpen, 
  onClose, 
  onPaymentSuccess 
}: VirtualPaymentModalProps) => {
  const [amount, setAmount] = useState(10)
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    onPaymentSuccess?.(amount)
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Add Credits
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="1"
                max="1000"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : `Pay $${amount}`}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
