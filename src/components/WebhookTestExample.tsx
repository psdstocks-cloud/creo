'use client';

import React, { useState } from 'react';

interface WebhookTestExampleProps {
  className?: string;
}

export default function WebhookTestExample({ className = '' }: WebhookTestExampleProps) {
  
  // State
  const [testEvent, setTestEvent] = useState({
    eventName: 'order.completed',
    eventStatus: 'success',
    extraInfo: 'Test webhook event',
    orderId: 'order-123',
    userId: 'user-456',
  });
  
  const [testResults, setTestResults] = useState<{
    success: boolean;
    message: string;
    timestamp: string;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Test webhook endpoint
  const testWebhook = async () => {
    setIsLoading(true);
    setTestResults(null);
    
    try {
      const response = await fetch('/api/webhooks/nehtw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-neh-event_name': testEvent.eventName,
          'x-neh-status': testEvent.eventStatus,
          'x-neh-extra': testEvent.extraInfo,
          'x-neh-order_id': testEvent.orderId,
          'x-neh-user_id': testEvent.userId,
          'x-neh-timestamp': new Date().toISOString(),
          'x-neh-request_id': `test-${Date.now()}`,
        },
        body: JSON.stringify({
          test: true,
          event: testEvent,
        }),
      });
      
      const result = await response.json();
      
      setTestResults({
        success: response.ok,
        message: result.error || result.received ? 'Webhook processed successfully' : 'Unknown response',
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      setTestResults({
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Test webhook verification
  const testVerification = async () => {
    setIsLoading(true);
    setTestResults(null);
    
    try {
      const response = await fetch('/api/webhooks/nehtw', {
        method: 'GET',
        headers: {
          'x-neh-event_name': 'test',
          'x-neh-status': 'success',
        },
      });
      
      const result = await response.json();
      
      setTestResults({
        success: response.ok,
        message: result.error || result.verified ? 'Webhook verification successful' : 'Unknown response',
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      setTestResults({
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle input changes
  const handleInputChange = (key: string, value: string) => {
    setTestEvent(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  // Predefined test events
  const predefinedEvents = [
    {
      name: 'Order Completed',
      event: {
        eventName: 'order.completed',
        eventStatus: 'success',
        extraInfo: 'Order processed successfully',
        orderId: 'order-123',
        userId: 'user-456',
      },
    },
    {
      name: 'Order Failed',
      event: {
        eventName: 'order.failed',
        eventStatus: 'failed',
        extraInfo: 'Payment failed',
        orderId: 'order-124',
        userId: 'user-457',
      },
    },
    {
      name: 'Download Ready',
      event: {
        eventName: 'download.ready',
        eventStatus: 'success',
        extraInfo: 'Download links generated',
        orderId: 'order-125',
        userId: 'user-458',
      },
    },
    {
      name: 'AI Generation Completed',
      event: {
        eventName: 'ai.completed',
        eventStatus: 'success',
        extraInfo: 'AI image generated successfully',
        orderId: 'order-126',
        userId: 'user-459',
      },
    },
    {
      name: 'User Credits Updated',
      event: {
        eventName: 'user.credits_updated',
        eventStatus: 'success',
        extraInfo: 'Credits added: 100',
        orderId: '',
        userId: 'user-460',
      },
    },
  ];
  
  return (
    <div className={`glass-card p-6 max-w-4xl mx-auto ${className}`}>
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Webhook Test Interface
      </h2>
      
      {/* Test Event Configuration */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Test Event Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Event Name
            </label>
            <input
              type="text"
              value={testEvent.eventName}
              onChange={(e) => handleInputChange('eventName', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Event Status
            </label>
            <select
              value={testEvent.eventStatus}
              onChange={(e) => handleInputChange('eventStatus', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            >
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Extra Info
            </label>
            <input
              type="text"
              value={testEvent.extraInfo}
              onChange={(e) => handleInputChange('extraInfo', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Order ID
            </label>
            <input
              type="text"
              value={testEvent.orderId}
              onChange={(e) => handleInputChange('orderId', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              User ID
            </label>
            <input
              type="text"
              value={testEvent.userId}
              onChange={(e) => handleInputChange('userId', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
          </div>
        </div>
      </div>
      
      {/* Predefined Test Events */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Predefined Test Events</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predefinedEvents.map((event, index) => (
            <button
              key={index}
              onClick={() => setTestEvent(event.event)}
              className="p-4 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors duration-200"
            >
              <h4 className="font-medium mb-2">{event.name}</h4>
              <p className="text-sm text-gray-300">
                {event.event.eventName} - {event.event.eventStatus}
              </p>
            </button>
          ))}
        </div>
      </div>
      
      {/* Test Actions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Test Actions</h3>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={testWebhook}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-primaryOrange-500 to-primaryOrange-600 text-white rounded-lg font-medium hover:from-primaryOrange-600 hover:to-primaryOrange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Testing...' : 'Test Webhook POST'}
          </button>
          
          <button
            onClick={testVerification}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Testing...' : 'Test Webhook GET'}
          </button>
        </div>
      </div>
      
      {/* Test Results */}
      {testResults && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Test Results</h3>
          
          <div className={`p-4 rounded-lg border ${
            testResults.success 
              ? 'bg-green-500/20 border-green-500/30' 
              : 'bg-red-500/20 border-red-500/30'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium ${
                testResults.success ? 'text-green-300' : 'text-red-300'
              }`}>
                {testResults.success ? 'Success' : 'Failed'}
              </span>
              <span className="text-sm text-gray-400">
                {testResults.timestamp}
              </span>
            </div>
            
            <p className={`text-sm ${
              testResults.success ? 'text-green-200' : 'text-red-200'
            }`}>
              {testResults.message}
            </p>
          </div>
        </div>
      )}
      
      {/* Webhook Information */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Webhook Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Endpoint URL</h4>
            <p className="text-primaryOrange-200 text-sm">
              POST /api/webhooks/nehtw
            </p>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Verification URL</h4>
            <p className="text-primaryOrange-200 text-sm">
              GET /api/webhooks/nehtw
            </p>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Required Headers</h4>
            <p className="text-primaryOrange-200 text-sm">
              x-neh-event_name, x-neh-status
            </p>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Optional Headers</h4>
            <p className="text-primaryOrange-200 text-sm">
              x-neh-extra, x-neh-timestamp, x-neh-request_id
            </p>
          </div>
        </div>
      </div>
      
      {/* Supported Events */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Supported Events</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Order Events</h4>
            <ul className="text-sm text-primaryOrange-200 space-y-1">
              <li>• order.completed</li>
              <li>• order.failed</li>
              <li>• order.processing</li>
              <li>• order.cancelled</li>
              <li>• order.refunded</li>
            </ul>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Download Events</h4>
            <ul className="text-sm text-primaryOrange-200 space-y-1">
              <li>• download.ready</li>
              <li>• download.expired</li>
              <li>• download.failed</li>
            </ul>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">AI Generation Events</h4>
            <ul className="text-sm text-primaryOrange-200 space-y-1">
              <li>• ai.completed</li>
              <li>• ai.failed</li>
              <li>• ai.processing</li>
            </ul>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">User Events</h4>
            <ul className="text-sm text-primaryOrange-200 space-y-1">
              <li>• user.credits_updated</li>
              <li>• user.subscription_updated</li>
              <li>• user.subscription_expired</li>
              <li>• user.subscription_cancelled</li>
            </ul>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">System Events</h4>
            <ul className="text-sm text-primaryOrange-200 space-y-1">
              <li>• system.maintenance</li>
              <li>• system.error</li>
              <li>• system.recovery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
