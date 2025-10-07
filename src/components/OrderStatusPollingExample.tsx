'use client';

import React, { useState } from 'react';
import {
  useOrderStatusPolling,
  useOrderStatusWithProgress,
  useOrderStatusPollingWithIntervals,
  useMultipleOrderStatusPolling,
  OrderStatusError,
} from '../hooks/useOrderStatusPolling';

interface OrderStatusPollingExampleProps {
  className?: string;
}

export default function OrderStatusPollingExample({ className = '' }: OrderStatusPollingExampleProps) {
  
  // State
  const [taskId, setTaskId] = useState('');
  const [multipleTaskIds, setMultipleTaskIds] = useState<string[]>([]);
  const [pollingOptions, setPollingOptions] = useState({
    enabled: true,
    refetchInterval: 2000,
    maxPollingTime: 30 * 60 * 1000, // 30 minutes
    stopOnError: true,
    stopOnCompletion: true,
  });
  
  // Single order status polling
  const {
    data: orderStatus,
    isLoading,
    isError,
    error,
    isPolling,
    pollingTime,
    stopPolling,
    startPolling,
  } = useOrderStatusPolling(taskId, {
    enabled: pollingOptions.enabled && !!taskId,
    refetchInterval: pollingOptions.refetchInterval,
    maxPollingTime: pollingOptions.maxPollingTime,
    stopOnError: pollingOptions.stopOnError,
    stopOnCompletion: pollingOptions.stopOnCompletion,
    onStatusChange: (status) => {
      console.log('Status changed:', status);
    },
    onCompletion: (status) => {
      console.log('Order completed:', status);
    },
    onError: (error) => {
      console.error('Polling error:', error);
    },
  });
  
  // Order status with progress tracking
  const {
    data: progressStatus,
    isPolling: isProgressPolling,
    pollingTime: progressPollingTime,
    progress,
    estimatedTimeRemaining,
    isComplete,
    isError: isProgressCompleteError,
  } = useOrderStatusWithProgress(taskId, {
    enabled: pollingOptions.enabled && !!taskId,
    refetchInterval: pollingOptions.refetchInterval,
    maxPollingTime: pollingOptions.maxPollingTime,
    stopOnError: pollingOptions.stopOnError,
    stopOnCompletion: pollingOptions.stopOnCompletion,
  });
  
  // Order status with custom intervals
  const {
    data: intervalStatus,
    isPolling: isIntervalPolling,
    pollingTime: intervalPollingTime,
  } = useOrderStatusPollingWithIntervals(taskId, {
    initial: 1000,
    processing: 2000,
    ready: 5000,
    error: 10000,
  }, {
    enabled: pollingOptions.enabled && !!taskId,
    maxPollingTime: pollingOptions.maxPollingTime,
    stopOnError: pollingOptions.stopOnError,
    stopOnCompletion: pollingOptions.stopOnCompletion,
  });
  
  // Multiple order status polling
  const multipleOrderStatuses = useMultipleOrderStatusPolling(multipleTaskIds, {
    enabled: pollingOptions.enabled && multipleTaskIds.length > 0,
    refetchInterval: pollingOptions.refetchInterval,
    maxPollingTime: pollingOptions.maxPollingTime,
    stopOnError: pollingOptions.stopOnError,
    stopOnCompletion: pollingOptions.stopOnCompletion,
  });
  
  // Handlers
  const handleTaskIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskId(e.target.value);
  };
  
  const handleMultipleTaskIdsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const ids = e.target.value.split('\n').filter(id => id.trim().length > 0);
    setMultipleTaskIds(ids);
  };
  
  const handlePollingOptionsChange = (key: string, value: boolean | number) => {
    setPollingOptions(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const formatPollingTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'processing':
        return 'text-blue-400';
      case 'ready':
      case 'completed':
        return 'text-green-400';
      case 'error':
      case 'failed':
        return 'text-red-400';
      case 'cancelled':
        return 'text-gray-400';
      default:
        return 'text-white';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '🔄';
      case 'ready':
      case 'completed':
        return '✅';
      case 'error':
      case 'failed':
        return '❌';
      case 'cancelled':
        return '🚫';
      default:
        return '❓';
    }
  };
  
  const getErrorMessage = (error: OrderStatusError) => {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Network error. Please check your internet connection.';
      case 'HTTP_404':
        return 'Order not found.';
      case 'HTTP_401':
        return 'Authentication required.';
      case 'HTTP_403':
        return 'Access denied.';
      case 'HTTP_500':
        return 'Server error. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  };
  
  return (
    <div className={`glass-card p-6 max-w-6xl mx-auto ${className}`}>
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Order Status Polling
      </h2>
      
      {/* Configuration */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Task ID
            </label>
            <input
              type="text"
              value={taskId}
              onChange={handleTaskIdChange}
              placeholder="Enter task ID"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Polling Interval (ms)
            </label>
            <input
              type="number"
              value={pollingOptions.refetchInterval}
              onChange={(e) => handlePollingOptionsChange('refetchInterval', parseInt(e.target.value))}
              min="1000"
              max="60000"
              step="1000"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Max Polling Time (minutes)
            </label>
            <input
              type="number"
              value={pollingOptions.maxPollingTime / 60000}
              onChange={(e) => handlePollingOptionsChange('maxPollingTime', parseInt(e.target.value) * 60000)}
              min="1"
              max="60"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={pollingOptions.enabled}
                onChange={(e) => handlePollingOptionsChange('enabled', e.target.checked)}
                className="mr-2"
              />
              <span className="text-white">Enabled</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={pollingOptions.stopOnError}
                onChange={(e) => handlePollingOptionsChange('stopOnError', e.target.checked)}
                className="mr-2"
              />
              <span className="text-white">Stop on Error</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={pollingOptions.stopOnCompletion}
                onChange={(e) => handlePollingOptionsChange('stopOnCompletion', e.target.checked)}
                className="mr-2"
              />
              <span className="text-white">Stop on Completion</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Single Order Status */}
      {taskId && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Single Order Status</h3>
          
          <div className="glass-card p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">Task ID: {taskId}</span>
                <span className={`px-2 py-1 rounded text-sm ${isPolling ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'}`}>
                  {isPolling ? 'Polling' : 'Stopped'}
                </span>
                <span className="text-white text-sm">
                  Time: {formatPollingTime(pollingTime)}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={startPolling}
                  disabled={isPolling}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  Start
                </button>
                <button
                  onClick={stopPolling}
                  disabled={!isPolling}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  Stop
                </button>
              </div>
            </div>
            
            {isLoading && (
              <div className="flex items-center text-primaryOrange-200">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primaryOrange-500 mr-2"></div>
                Loading...
              </div>
            )}
            
            {isError && error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <h4 className="text-red-300 font-medium mb-1">Error</h4>
                <p className="text-red-200 text-sm">{getErrorMessage(error)}</p>
              </div>
            )}
            
            {orderStatus && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Status:</span>
                  <span className={`flex items-center ${getStatusColor(orderStatus.status)}`}>
                    <span className="mr-2">{getStatusIcon(orderStatus.status)}</span>
                    {orderStatus.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Progress:</span>
                  <span className="text-white">{orderStatus.progress}%</span>
                </div>
                
                {orderStatus.message && (
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Message:</span>
                    <span className="text-primaryOrange-200">{orderStatus.message}</span>
                  </div>
                )}
                
                {orderStatus.estimatedCompletionTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Estimated Completion:</span>
                    <span className="text-primaryOrange-200">
                      {new Date(orderStatus.estimatedCompletionTime).toLocaleString()}
                    </span>
                  </div>
                )}
                
                {orderStatus.metadata && (
                  <div className="mt-3 p-3 bg-white/5 rounded-lg">
                    <h5 className="text-white font-medium mb-2">Metadata</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {orderStatus.metadata.processingStage && (
                        <div>
                          <span className="text-white">Stage:</span>
                          <span className="text-primaryOrange-200 ml-2">{orderStatus.metadata.processingStage}</span>
                        </div>
                      )}
                      {orderStatus.metadata.currentStep && (
                        <div>
                          <span className="text-white">Step:</span>
                          <span className="text-primaryOrange-200 ml-2">{orderStatus.metadata.currentStep}</span>
                        </div>
                      )}
                      {orderStatus.metadata.queuePosition && (
                        <div>
                          <span className="text-white">Queue Position:</span>
                          <span className="text-primaryOrange-200 ml-2">{orderStatus.metadata.queuePosition}</span>
                        </div>
                      )}
                      {orderStatus.metadata.estimatedWaitTime && (
                        <div>
                          <span className="text-white">Wait Time:</span>
                          <span className="text-primaryOrange-200 ml-2">{orderStatus.metadata.estimatedWaitTime}ms</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Progress Tracking */}
      {taskId && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Progress Tracking</h3>
          
          <div className="glass-card p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">Progress: {progress}%</span>
              <span className="text-white text-sm">
                {isProgressPolling ? 'Polling' : 'Stopped'} - {formatPollingTime(progressPollingTime)}
              </span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-primaryOrange-500 to-primaryOrange-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white">Complete:</span>
                <span className={`ml-2 ${isComplete ? 'text-green-400' : 'text-gray-400'}`}>
                  {isComplete ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-white">Error:</span>
                <span className={`ml-2 ${isProgressCompleteError ? 'text-red-400' : 'text-gray-400'}`}>
                  {isProgressCompleteError ? 'Yes' : 'No'}
                </span>
              </div>
              {estimatedTimeRemaining && (
                <div className="col-span-2">
                  <span className="text-white">Time Remaining:</span>
                  <span className="text-primaryOrange-200 ml-2">
                    {Math.floor(estimatedTimeRemaining / 1000)} seconds
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Multiple Order Status */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Multiple Order Status</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Task IDs (one per line)
          </label>
          <textarea
            value={multipleTaskIds.join('\n')}
            onChange={handleMultipleTaskIdsChange}
            placeholder="Enter task IDs, one per line"
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
          />
        </div>
        
        {multipleTaskIds.length > 0 && (
          <div className="space-y-4">
            {multipleTaskIds.map((id) => {
              const status = multipleOrderStatuses[id];
              if (!status) return null;
              
              return (
                <div key={id} className="glass-card p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Task ID: {id}</span>
                    <span className={`px-2 py-1 rounded text-sm ${status.isPolling ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'}`}>
                      {status.isPolling ? 'Polling' : 'Stopped'}
                    </span>
                  </div>
                  
                  {status.data && (
                    <div className="flex items-center justify-between">
                      <span className="text-white">Status:</span>
                      <span className={`flex items-center ${getStatusColor(status.data.status)}`}>
                        <span className="mr-2">{getStatusIcon(status.data.status)}</span>
                        {status.data.status}
                      </span>
                    </div>
                  )}
                  
                  {status.isError && status.error && (
                    <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-200 text-sm">{getErrorMessage(status.error)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Statistics */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Polling Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Single Order</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white">Status:</span>
                <span className="text-primaryOrange-200">
                  {orderStatus ? orderStatus.status : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Polling:</span>
                <span className="text-primaryOrange-200">
                  {isPolling ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Time:</span>
                <span className="text-primaryOrange-200">
                  {formatPollingTime(pollingTime)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Progress Tracking</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white">Progress:</span>
                <span className="text-primaryOrange-200">{progress}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Complete:</span>
                <span className="text-primaryOrange-200">
                  {isComplete ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Error:</span>
                <span className="text-primaryOrange-200">
                  {isProgressCompleteError ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Multiple Orders</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white">Count:</span>
                <span className="text-primaryOrange-200">{multipleTaskIds.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Active:</span>
                <span className="text-primaryOrange-200">
                  {Object.values(multipleOrderStatuses).filter(s => s.isPolling).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Errors:</span>
                <span className="text-primaryOrange-200">
                  {Object.values(multipleOrderStatuses).filter(s => s.isError).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
