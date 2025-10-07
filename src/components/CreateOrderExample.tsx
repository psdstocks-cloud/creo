'use client';

import React, { useState } from 'react';
import {
  useCreateOrder,
  useCreateBatchOrder,
  useCreateOrderOptimistic,
  CreateOrderRequest,
  CreateOrderError,
} from '../hooks/useCreateOrderMutation';

interface CreateOrderExampleProps {
  className?: string;
}

export default function CreateOrderExample({ className = '' }: CreateOrderExampleProps) {
  
  // Form state
  const [formData, setFormData] = useState<CreateOrderRequest>({
    siteId: '',
    stockId: '',
    quantity: 1,
    paymentMethod: 'credit_card',
    notes: '',
    priority: 'normal',
  });
  
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: '',
  });
  
  const [selectedItems, setSelectedItems] = useState<Array<{ stockId: string; quantity: number }>>([]);
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [useOptimistic, setUseOptimistic] = useState(false);
  
  // Mutation hooks
  const createOrderMutation = useCreateOrder({
    onSuccess: (data) => {
      console.log('Order created successfully:', data);
      // Reset form
      setFormData({
        siteId: '',
        stockId: '',
        quantity: 1,
        paymentMethod: 'credit_card',
        notes: '',
        priority: 'normal',
      });
      setBillingAddress({
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        phone: '',
      });
    },
    onError: (error) => {
      console.error('Order creation failed:', error);
    },
  });
  
  const batchOrderMutation = useCreateBatchOrder({
    onSuccess: (data) => {
      console.log('Batch orders created successfully:', data);
      setSelectedItems([]);
    },
    onError: (error) => {
      console.error('Batch order creation failed:', error);
    },
  });
  
  const optimisticOrderMutation = useCreateOrderOptimistic({
    onSuccess: (data) => {
      console.log('Optimistic order created successfully:', data);
    },
    onError: (error) => {
      console.error('Optimistic order creation failed:', error);
    },
  });
  
  // Handlers
  const handleInputChange = (field: keyof CreateOrderRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleBillingChange = (field: string, value: string) => {
    setBillingAddress(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderData: CreateOrderRequest = {
      ...formData,
      billingAddress: showBillingForm ? billingAddress : undefined,
    };
    
    try {
      if (useOptimistic) {
        await optimisticOrderMutation.mutateAsync(orderData);
      } else {
        await createOrderMutation.mutateAsync(orderData);
      }
    } catch {
      // Error is handled by the mutation's onError callback
    }
  };
  
  const handleBatchSubmit = async () => {
    if (selectedItems.length === 0) return;
    
    const batchOrders: CreateOrderRequest[] = selectedItems.map(item => ({
      siteId: formData.siteId,
      stockId: item.stockId,
      quantity: item.quantity,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      priority: formData.priority,
    }));
    
    try {
      await batchOrderMutation.mutateAsync(batchOrders);
    } catch {
      // Error is handled by the mutation's onError callback
    }
  };
  
  const handleAddItem = () => {
    if (formData.stockId) {
      setSelectedItems(prev => [...prev, {
        stockId: formData.stockId,
        quantity: formData.quantity || 1,
      }]);
      setFormData(prev => ({ ...prev, stockId: '' }));
    }
  };
  
  const handleRemoveItem = (index: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };
  
  const getErrorMessage = (error: CreateOrderError) => {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        return error.message;
      case 'NETWORK_ERROR':
        return 'Network error. Please check your internet connection.';
      case 'HTTP_400':
        return 'Invalid request. Please check your input.';
      case 'HTTP_401':
        return 'Authentication required. Please log in.';
      case 'HTTP_403':
        return 'Access denied. You do not have permission to create orders.';
      case 'HTTP_404':
        return 'Stock item not found.';
      case 'HTTP_409':
        return 'Order conflict. Please try again.';
      case 'HTTP_422':
        return 'Invalid data. Please check your input.';
      case 'HTTP_429':
        return 'Too many requests. Please wait before trying again.';
      case 'HTTP_500':
        return 'Server error. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  };
  
  return (
    <div className={`glass-card p-6 max-w-4xl mx-auto ${className}`}>
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Create Order
      </h2>
      
      {/* Order Creation Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Order Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Site ID *
              </label>
              <input
                type="text"
                value={formData.siteId}
                onChange={(e) => handleInputChange('siteId', e.target.value)}
                placeholder="Enter site ID"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Stock ID *
              </label>
              <input
                type="text"
                value={formData.stockId}
                onChange={(e) => handleInputChange('stockId', e.target.value)}
                placeholder="Enter stock ID"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity || 1}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                min="1"
                max="1000"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod || 'credit_card'}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Priority
              </label>
              <select
                value={formData.priority || 'normal'}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          {/* Billing Address */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Billing Address</h3>
              <button
                type="button"
                onClick={() => setShowBillingForm(!showBillingForm)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                {showBillingForm ? 'Hide' : 'Add'}
              </button>
            </div>
            
            {showBillingForm && (
              <>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={billingAddress.street}
                    onChange={(e) => handleBillingChange('street', e.target.value)}
                    placeholder="Enter street address"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={billingAddress.city}
                      onChange={(e) => handleBillingChange('city', e.target.value)}
                      placeholder="City"
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={billingAddress.state}
                      onChange={(e) => handleBillingChange('state', e.target.value)}
                      placeholder="State"
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={billingAddress.country}
                      onChange={(e) => handleBillingChange('country', e.target.value)}
                      placeholder="Country"
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={billingAddress.postalCode}
                      onChange={(e) => handleBillingChange('postalCode', e.target.value)}
                      placeholder="Postal Code"
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={billingAddress.phone}
                    onChange={(e) => handleBillingChange('phone', e.target.value)}
                    placeholder="Phone number"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes for the order"
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
              />
            </div>
          </div>
        </div>
        
        {/* Options */}
        <div className="mt-6 flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={useOptimistic}
              onChange={(e) => setUseOptimistic(e.target.checked)}
              className="mr-2"
            />
            <span className="text-white">Use optimistic updates</span>
          </label>
        </div>
        
        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={createOrderMutation.isPending || optimisticOrderMutation.isPending}
            className="w-full px-6 py-3 bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createOrderMutation.isPending || optimisticOrderMutation.isPending
              ? 'Creating Order...'
              : 'Create Order'
            }
          </button>
        </div>
      </form>
      
      {/* Error Display */}
      {(createOrderMutation.error || optimisticOrderMutation.error) && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <h3 className="text-red-300 font-medium mb-2">Order Creation Failed</h3>
          <p className="text-red-200 text-sm">
            {getErrorMessage(createOrderMutation.error || optimisticOrderMutation.error!)}
          </p>
          {createOrderMutation.error?.retryable && (
            <button
              onClick={() => createOrderMutation.reset()}
              className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      )}
      
      {/* Success Display */}
      {(createOrderMutation.isSuccess || optimisticOrderMutation.isSuccess) && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <h3 className="text-green-300 font-medium mb-2">Order Created Successfully!</h3>
          <p className="text-green-200 text-sm">
            Order ID: {(createOrderMutation.data || optimisticOrderMutation.data)?.orderId}
          </p>
          <p className="text-green-200 text-sm">
            Task ID: {(createOrderMutation.data || optimisticOrderMutation.data)?.taskId}
          </p>
        </div>
      )}
      
      {/* Batch Order Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Batch Order</h3>
        
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.stockId}
              onChange={(e) => handleInputChange('stockId', e.target.value)}
              placeholder="Stock ID"
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
            <input
              type="number"
              value={formData.quantity || 1}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
              min="1"
              max="1000"
              className="w-24 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
            <button
              type="button"
              onClick={handleAddItem}
              disabled={!formData.stockId}
              className="px-4 py-2 bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
        
        {selectedItems.length > 0 && (
          <div className="mb-4">
            <h4 className="text-white font-medium mb-2">Selected Items:</h4>
            <div className="space-y-2">
              {selectedItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <span className="text-white">
                    {item.stockId} (Qty: {item.quantity})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={handleBatchSubmit}
          disabled={batchOrderMutation.isPending || selectedItems.length === 0}
          className="w-full px-6 py-3 bg-deepPurple-500 hover:bg-deepPurple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {batchOrderMutation.isPending ? 'Creating Batch Orders...' : 'Create Batch Orders'}
        </button>
      </div>
      
      {/* Batch Order Error */}
      {batchOrderMutation.error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <h3 className="text-red-300 font-medium mb-2">Batch Order Creation Failed</h3>
          <p className="text-red-200 text-sm">
            {getErrorMessage(batchOrderMutation.error)}
          </p>
        </div>
      )}
      
      {/* Batch Order Success */}
      {batchOrderMutation.isSuccess && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <h3 className="text-green-300 font-medium mb-2">Batch Orders Created Successfully!</h3>
          <p className="text-green-200 text-sm">
            Created {batchOrderMutation.data?.length} orders
          </p>
        </div>
      )}
    </div>
  );
}
