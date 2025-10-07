'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  useCreateAIGenerationJob,
  useAIGenerationJob,
  useAIGenerationJobPolling,
  useAIGenerationJobs,
  useCancelAIGenerationJob,
  useAIGenerationJobWithProgress,
  AIGenerationJob,
  AIGenerationRequest,
  AIGenerationError,
} from '../hooks/useAIGeneration';

interface AIGenerationExampleProps {
  className?: string;
}

export default function AIGenerationExample({ className = '' }: AIGenerationExampleProps) {
  const t = useTranslations('AIGeneration');
  
  // State
  const [selectedJobId, setSelectedJobId] = useState('');
  const [generationParams, setGenerationParams] = useState<AIGenerationRequest>({
    prompt: '',
    negativePrompt: '',
    model: 'stable-diffusion-xl',
    style: '',
    quality: 'high',
    dimensions: { width: 1024, height: 1024 },
    aspectRatio: '1:1',
    seed: undefined,
    steps: 20,
    guidance: 7.5,
    samplingMethod: 'DPM++ 2M Karras',
    scheduler: 'Karras',
    batchSize: 1,
    priority: 'normal',
  });
  
  const [pollingOptions, setPollingOptions] = useState({
    enabled: true,
    refetchInterval: 2000,
    maxPollingTime: 30 * 60 * 1000, // 30 minutes
    stopOnError: true,
    stopOnCompletion: true,
  });
  
  // Create AI generation job mutation
  const {
    mutate: createJob,
    isLoading: isCreating,
    isError: isCreateError,
    error: createError,
    data: createdJob,
  } = useCreateAIGenerationJob({
    onSuccess: (data) => {
      console.log('AI generation job created:', data);
      setSelectedJobId(data.id);
    },
    onError: (error) => {
      console.error('AI generation job creation error:', error);
    },
  });
  
  // Single AI generation job query
  const {
    data: aiJob,
    isLoading: isJobLoading,
    isError: isJobError,
    error: jobError,
    refetch: refetchJob,
  } = useAIGenerationJob(selectedJobId, {
    enabled: !!selectedJobId,
    onSuccess: (data) => {
      console.log('AI generation job loaded:', data);
    },
    onError: (error) => {
      console.error('AI generation job fetch error:', error);
    },
  });
  
  // AI generation job with polling
  const {
    data: pollingJob,
    isLoading: isPollingLoading,
    isError: isPollingError,
    error: pollingError,
    isPolling,
    pollingTime,
    stopPolling,
    startPolling,
    isComplete,
    isError: isPollingCompleteError,
    progress,
    estimatedTimeRemaining,
  } = useAIGenerationJobPolling(selectedJobId, {
    enabled: pollingOptions.enabled && !!selectedJobId,
    refetchInterval: pollingOptions.refetchInterval,
    maxPollingTime: pollingOptions.maxPollingTime,
    stopOnError: pollingOptions.stopOnError,
    stopOnCompletion: pollingOptions.stopOnCompletion,
    onStatusChange: (job) => {
      console.log('Status changed:', job.status);
    },
    onCompletion: (job) => {
      console.log('Job completed:', job);
    },
    onProgress: (progress) => {
      console.log('Progress:', progress + '%');
    },
  });
  
  // AI generation job with progress tracking
  const {
    data: progressJob,
    isLoading: isProgressLoading,
    isError: isProgressError,
    error: progressError,
    isPolling: isProgressPolling,
    pollingTime: progressPollingTime,
    stopPolling: stopProgressPolling,
    startPolling: startProgressPolling,
    progress: progressProgress,
    estimatedTimeRemaining: progressEstimatedTimeRemaining,
    isComplete: isProgressComplete,
    isError: isProgressCompleteError,
    isProcessing: isProgressProcessing,
    isPending: isProgressPending,
    isFailed: isProgressFailed,
    isCancelled: isProgressCancelled,
  } = useAIGenerationJobWithProgress(selectedJobId, {
    enabled: pollingOptions.enabled && !!selectedJobId,
    refetchInterval: pollingOptions.refetchInterval,
    maxPollingTime: pollingOptions.maxPollingTime,
    stopOnError: pollingOptions.stopOnError,
    stopOnCompletion: pollingOptions.stopOnCompletion,
  });
  
  // Multiple AI generation jobs query
  const {
    data: aiJobs,
    isLoading: isJobsLoading,
    isError: isJobsError,
    error: jobsError,
    refetch: refetchJobs,
  } = useAIGenerationJobs({
    status: 'all',
    page: 1,
    pageSize: 20,
    sortBy: 'created',
    sortOrder: 'desc',
  }, {
    onSuccess: (data) => {
      console.log('AI generation jobs loaded:', data.total);
    },
    onError: (error) => {
      console.error('AI generation jobs fetch error:', error);
    },
  });
  
  // Cancel AI generation job mutation
  const {
    mutate: cancelJob,
    isLoading: isCancelling,
    isError: isCancelError,
    error: cancelError,
  } = useCancelAIGenerationJob({
    onSuccess: (data) => {
      console.log('AI generation job cancelled:', data);
    },
    onError: (error) => {
      console.error('AI generation job cancellation error:', error);
    },
  });
  
  // Handlers
  const handleGenerationParamsChange = (key: string, value: any) => {
    setGenerationParams(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const handlePollingOptionsChange = (key: string, value: any) => {
    setPollingOptions(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const handleCreateJob = () => {
    if (!generationParams.prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    
    createJob(generationParams);
  };
  
  const handleCancelJob = () => {
    if (selectedJobId) {
      cancelJob(selectedJobId);
    }
  };
  
  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
  };
  
  // Utility functions
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatTimeUntilCompletion = (timeUntilCompletion: number) => {
    if (timeUntilCompletion <= 0) return 'Completed';
    
    const minutes = Math.floor(timeUntilCompletion / 60000);
    const seconds = Math.floor((timeUntilCompletion % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };
  
  const getErrorMessage = (error: AIGenerationError) => {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Network error. Please check your internet connection.';
      case 'HTTP_404':
        return 'AI generation job not found.';
      case 'HTTP_401':
        return 'Authentication required.';
      case 'HTTP_403':
        return 'Access denied.';
      case 'HTTP_500':
        return 'Server error. Please try again later.';
      case 'VALIDATION_ERROR':
        return error.message;
      default:
        return error.message || 'An unexpected error occurred.';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'processing':
        return 'text-blue-400';
      case 'completed':
        return 'text-green-400';
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
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      case 'cancelled':
        return '🚫';
      default:
        return '❓';
    }
  };
  
  return (
    <div className={`glass-card p-6 max-w-6xl mx-auto ${className}`}>
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        AI Image Generation
      </h2>
      
      {/* Generation Parameters */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Generation Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white mb-2">
              Prompt *
            </label>
            <textarea
              value={generationParams.prompt}
              onChange={(e) => handleGenerationParamsChange('prompt', e.target.value)}
              placeholder="Describe the image you want to generate..."
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Negative Prompt
            </label>
            <textarea
              value={generationParams.negativePrompt}
              onChange={(e) => handleGenerationParamsChange('negativePrompt', e.target.value)}
              placeholder="What you don't want in the image..."
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Model
            </label>
            <select
              value={generationParams.model}
              onChange={(e) => handleGenerationParamsChange('model', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            >
              <option value="stable-diffusion-xl">Stable Diffusion XL</option>
              <option value="stable-diffusion-2.1">Stable Diffusion 2.1</option>
              <option value="stable-diffusion-1.5">Stable Diffusion 1.5</option>
              <option value="midjourney">Midjourney</option>
              <option value="dalle-2">DALL-E 2</option>
              <option value="dalle-3">DALL-E 3</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Quality
            </label>
            <select
              value={generationParams.quality}
              onChange={(e) => handleGenerationParamsChange('quality', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="ultra">Ultra</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Aspect Ratio
            </label>
            <select
              value={generationParams.aspectRatio}
              onChange={(e) => handleGenerationParamsChange('aspectRatio', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            >
              <option value="1:1">1:1 (Square)</option>
              <option value="16:9">16:9 (Landscape)</option>
              <option value="9:16">9:16 (Portrait)</option>
              <option value="4:3">4:3 (Standard)</option>
              <option value="3:4">3:4 (Portrait)</option>
              <option value="21:9">21:9 (Ultrawide)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Steps
            </label>
            <input
              type="number"
              value={generationParams.steps}
              onChange={(e) => handleGenerationParamsChange('steps', parseInt(e.target.value))}
              min="1"
              max="100"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Guidance Scale
            </label>
            <input
              type="number"
              value={generationParams.guidance}
              onChange={(e) => handleGenerationParamsChange('guidance', parseFloat(e.target.value))}
              min="1"
              max="20"
              step="0.1"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Seed
            </label>
            <input
              type="number"
              value={generationParams.seed || ''}
              onChange={(e) => handleGenerationParamsChange('seed', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Random"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Priority
            </label>
            <select
              value={generationParams.priority}
              onChange={(e) => handleGenerationParamsChange('priority', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Polling Configuration */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Polling Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
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
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
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
      
      {/* Create Job */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Create AI Generation Job</h3>
        
        <div className="flex space-x-4 mb-4">
          <button
            onClick={handleCreateJob}
            disabled={isCreating || !generationParams.prompt.trim()}
            className="px-6 py-3 bg-gradient-to-r from-primaryOrange-500 to-primaryOrange-600 text-white rounded-lg font-medium hover:from-primaryOrange-600 hover:to-primaryOrange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create Job'}
          </button>
          
          <button
            onClick={() => refetchJob()}
            disabled={!selectedJobId}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Refresh Job
          </button>
        </div>
        
        {isCreateError && createError && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
            <h4 className="text-red-300 font-medium mb-1">Creation Error</h4>
            <p className="text-red-200 text-sm">{getErrorMessage(createError)}</p>
          </div>
        )}
        
        {createdJob && (
          <div className="glass-card p-4 rounded-lg mb-4">
            <h4 className="text-white font-medium mb-2">Job Created</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white">Job ID:</span>
                <span className="text-primaryOrange-200">{createdJob.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Status:</span>
                <span className={`flex items-center ${getStatusColor(createdJob.status)}`}>
                  <span className="mr-2">{getStatusIcon(createdJob.status)}</span>
                  {createdJob.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Progress:</span>
                <span className="text-primaryOrange-200">{createdJob.progress}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Created At:</span>
                <span className="text-primaryOrange-200">
                  {new Date(createdJob.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Single Job Status */}
      {selectedJobId && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Single Job Status</h3>
          
          {isJobLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOrange-500"></div>
              <span className="ml-2 text-white">Loading job...</span>
            </div>
          )}
          
          {isJobError && jobError && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
              <h4 className="text-red-300 font-medium mb-1">Fetch Error</h4>
              <p className="text-red-200 text-sm">{getErrorMessage(jobError)}</p>
            </div>
          )}
          
          {aiJob && (
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">Job Details</h4>
                <span className={`px-2 py-1 rounded text-sm ${
                  aiJob.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                  aiJob.status === 'failed' ? 'bg-red-500/20 text-red-300' :
                  aiJob.status === 'processing' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {aiJob.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Prompt:</span>
                  <span className="text-primaryOrange-200 text-sm max-w-md text-right">{aiJob.prompt}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Progress:</span>
                  <span className="text-primaryOrange-200">{aiJob.progress}%</span>
                </div>
                
                {aiJob.message && (
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Message:</span>
                    <span className="text-primaryOrange-200">{aiJob.message}</span>
                  </div>
                )}
                
                {aiJob.estimatedCompletionTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Estimated Completion:</span>
                    <span className="text-primaryOrange-200">
                      {new Date(aiJob.estimatedCompletionTime).toLocaleString()}
                    </span>
                  </div>
                )}
                
                {aiJob.result?.imageUrl && (
                  <div className="mt-4">
                    <h5 className="text-white font-medium mb-2">Generated Image</h5>
                    <img
                      src={aiJob.result.imageUrl}
                      alt="Generated image"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Job Polling */}
      {selectedJobId && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Job Polling</h3>
          
          {isPollingLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOrange-500"></div>
              <span className="ml-2 text-white">Polling job...</span>
            </div>
          )}
          
          {isPollingError && pollingError && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
              <h4 className="text-red-300 font-medium mb-1">Polling Error</h4>
              <p className="text-red-200 text-sm">{getErrorMessage(pollingError)}</p>
            </div>
          )}
          
          {pollingJob && (
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">Polling Status</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    isPolling ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'
                  }`}>
                    {isPolling ? 'Polling' : 'Stopped'}
                  </span>
                  <span className="text-white text-sm">
                    Time: {Math.floor(pollingTime / 1000)}s
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Status:</span>
                  <span className={`flex items-center ${getStatusColor(pollingJob.status)}`}>
                    <span className="mr-2">{getStatusIcon(pollingJob.status)}</span>
                    {pollingJob.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Progress:</span>
                  <span className="text-primaryOrange-200">{progress}%</span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-primaryOrange-500 to-primaryOrange-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                {estimatedTimeRemaining && (
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Time Remaining:</span>
                    <span className="text-primaryOrange-200">
                      {formatTimeUntilCompletion(estimatedTimeRemaining)}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Complete:</span>
                  <span className={`${isComplete ? 'text-green-400' : 'text-gray-400'}`}>
                    {isComplete ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Error:</span>
                  <span className={`${isPollingCompleteError ? 'text-red-400' : 'text-gray-400'}`}>
                    {isPollingCompleteError ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={startPolling}
                  disabled={isPolling}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50"
                >
                  Start Polling
                </button>
                <button
                  onClick={stopPolling}
                  disabled={!isPolling}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50"
                >
                  Stop Polling
                </button>
                <button
                  onClick={handleCancelJob}
                  disabled={isCancelling || pollingJob.status === 'completed' || pollingJob.status === 'failed' || pollingJob.status === 'cancelled'}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Job'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Progress Tracking */}
      {selectedJobId && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Progress Tracking</h3>
          
          {isProgressLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOrange-500"></div>
              <span className="ml-2 text-white">Loading progress...</span>
            </div>
          )}
          
          {isProgressError && progressError && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
              <h4 className="text-red-300 font-medium mb-1">Progress Error</h4>
              <p className="text-red-200 text-sm">{getErrorMessage(progressError)}</p>
            </div>
          )}
          
          {progressJob && (
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">Progress Details</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    isProgressPolling ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'
                  }`}>
                    {isProgressPolling ? 'Polling' : 'Stopped'}
                  </span>
                  <span className="text-white text-sm">
                    Time: {Math.floor(progressPollingTime / 1000)}s
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Progress:</span>
                  <span className="text-primaryOrange-200">{progressProgress}%</span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-primaryOrange-500 to-primaryOrange-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressProgress}%` }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white">Status:</span>
                    <span className={`ml-2 ${getStatusColor(progressJob.status)}`}>
                      {progressJob.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-white">Complete:</span>
                    <span className={`ml-2 ${isProgressComplete ? 'text-green-400' : 'text-gray-400'}`}>
                      {isProgressComplete ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white">Processing:</span>
                    <span className={`ml-2 ${isProgressProcessing ? 'text-blue-400' : 'text-gray-400'}`}>
                      {isProgressProcessing ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white">Pending:</span>
                    <span className={`ml-2 ${isProgressPending ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {isProgressPending ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white">Failed:</span>
                    <span className={`ml-2 ${isProgressFailed ? 'text-red-400' : 'text-gray-400'}`}>
                      {isProgressFailed ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white">Cancelled:</span>
                    <span className={`ml-2 ${isProgressCancelled ? 'text-gray-400' : 'text-gray-400'}`}>
                      {isProgressCancelled ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                
                {progressEstimatedTimeRemaining && (
                  <div className="mt-4">
                    <span className="text-white font-medium">Time Remaining:</span>
                    <span className="text-primaryOrange-200 ml-2">
                      {formatTimeUntilCompletion(progressEstimatedTimeRemaining)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Multiple Jobs */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Multiple Jobs</h3>
        
        {isJobsLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOrange-500"></div>
            <span className="ml-2 text-white">Loading jobs...</span>
          </div>
        )}
        
        {isJobsError && jobsError && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
            <h4 className="text-red-300 font-medium mb-1">Jobs Error</h4>
            <p className="text-red-200 text-sm">{getErrorMessage(jobsError)}</p>
          </div>
        )}
        
        {aiJobs && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white">Total: {aiJobs.total} jobs</span>
              <button
                onClick={() => refetchJobs()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
              >
                Refresh
              </button>
            </div>
            
            {aiJobs.data.map((job) => (
              <div key={job.id} className="glass-card p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Job ID: {job.id}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    job.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                    job.status === 'failed' ? 'bg-red-500/20 text-red-300' :
                    job.status === 'processing' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {job.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Prompt:</span>
                    <span className="text-primaryOrange-200 max-w-md text-right">{job.prompt}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Progress:</span>
                    <span className="text-primaryOrange-200">{job.progress}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Created:</span>
                    <span className="text-primaryOrange-200">
                      {new Date(job.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleSelectJob(job.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
                  >
                    Select Job
                  </button>
                  
                  {job.result?.imageUrl && (
                    <button
                      onClick={() => window.open(job.result.imageUrl, '_blank')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
                    >
                      View Image
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Statistics Summary */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Statistics Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Single Job</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white">Status:</span>
                <span className="text-primaryOrange-200">
                  {aiJob ? aiJob.status : 'Not Loaded'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Progress:</span>
                <span className="text-primaryOrange-200">
                  {aiJob ? aiJob.progress + '%' : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Complete:</span>
                <span className="text-primaryOrange-200">
                  {aiJob ? (aiJob.status === 'completed' ? 'Yes' : 'No') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Polling</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white">Status:</span>
                <span className="text-primaryOrange-200">
                  {isPolling ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Time:</span>
                <span className="text-primaryOrange-200">
                  {Math.floor(pollingTime / 1000)}s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Progress:</span>
                <span className="text-primaryOrange-200">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Multiple Jobs</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white">Total:</span>
                <span className="text-primaryOrange-200">
                  {aiJobs ? aiJobs.total : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Page:</span>
                <span className="text-primaryOrange-200">
                  {aiJobs ? aiJobs.page : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Has Next:</span>
                <span className="text-primaryOrange-200">
                  {aiJobs ? (aiJobs.hasNext ? 'Yes' : 'No') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
