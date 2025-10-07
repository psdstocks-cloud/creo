'use client';

import React, { useState } from 'react';

interface MockPaymentComponentProps {
  onPaymentSuccess: () => void;
  amount?: number;
  description?: string;
}

const MockPaymentComponent: React.FC<MockPaymentComponentProps> = ({ 
  onPaymentSuccess, 
  amount = 0,
  description = "Test Payment"
}) => {
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = () => {
    setIsPaying(true);
    // Simulate async payment delay
    setTimeout(() => {
      setIsPaying(false);
      onPaymentSuccess();
      alert('Mock payment successful!');
    }, 1500);
  };

  return (
    <div className="mock-payment-component p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-2">Mock Payment</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <p className="text-lg font-bold text-primaryOrange-500 mb-4">${amount.toFixed(2)}</p>
      
      <button
        onClick={handlePayment}
        disabled={isPaying}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPaying ? 'Processing...' : 'Pay Now (Mock)'}
      </button>
      
      <p className="text-xs text-gray-500 mt-2">
        This is a mock payment for testing purposes only.
      </p>
    </div>
  );
};

export default MockPaymentComponent;
