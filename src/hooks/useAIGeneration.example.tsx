/**
 * AI Generation Hooks Usage Examples
 * 
 * Comprehensive examples showing how to use the AI generation hooks
 * with proper error handling, loading states, and user interactions.
 */

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  useCreateAIJob,
  useAIJobStatus,
  useAIActions,
  useAccountBalance,
  useUserProfile,
  useAIGeneration,
} from './useAIGeneration';

// ============================================================================
// Example 1: Basic AI Job Creation
// ============================================================================

export function BasicAIGenerationExample() {
  const [prompt, setPrompt] = useState('a beautiful sunset over mountains');
  const [jobId, setJobId] = useState<string>('');

  const createJob = useCreateAIJob({
    onSuccess: (data) => {
      console.log('AI job created:', data);
      setJobId(data.job_id);
    },
    onError: (error) => {
      console.error('Failed to create AI job:', error);
    },
  });

  const jobStatus = useAIJobStatus(jobId, {
    enabled: Boolean(jobId),
    refetchInterval: 2000,
  });

  const handleGenerate = () => {
    createJob.mutate({
      prompt,
      style: 'photorealistic',
      size: '1024x1024',
      count: 1,
      quality: 'high',
    });
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-white mb-4">Basic AI Generation</h2>
      
      {!jobId ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prompt:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
              rows={3}
              placeholder="Describe the image you want to generate..."
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={createJob.isLoading}
            className="bg-primaryOrange-500 text-white px-4 py-2 rounded hover:bg-primaryOrange-600 disabled:opacity-50"
          >
            {createJob.isLoading ? 'Creating Job...' : 'Generate Image'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Job Status</h3>
            {jobStatus?.isPolling && (
              <div className="text-primaryOrange-300 text-sm">Polling...</div>
            )}
          </div>

          {jobStatus?.isLoading && (
            <div className="text-gray-300">Loading job status...</div>
          )}

          {jobStatus?.isError && (
            <div className="text-red-500">
              <p>Error loading job status: {jobStatus.error?.message}</p>
            </div>
          )}

          {jobStatus?.data && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  jobStatus.data.status === 'completed' ? 'bg-green-500' :
                  jobStatus.data.status === 'failed' ? 'bg-red-500' :
                  jobStatus.data.status === 'processing' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`}>
                  {jobStatus.data.status}
                </span>
              </div>
              
              {jobStatus.data.progress !== undefined && (
                <div>
                  <span className="text-gray-400">Progress:</span>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-primaryOrange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${jobStatus.data.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-300">
                    {jobStatus.data.progress}%
                  </span>
                </div>
              )}

              {jobStatus.data.status === 'completed' && jobStatus.data.result?.images && (
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-white">Generated Images</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {jobStatus.data.result.images.map((file, index) => (
                      <div key={index} className="space-y-2">
                        <Image
                          src={file.thumbnail_url}
                          alt={`Generated image ${index + 1}`}
                          width={400}
                          height={400}
                          className="w-full h-64 object-cover rounded"
                        />
                        <div className="text-sm text-gray-300">
                          <p>Filename: {file.filename}</p>
                          <p>Size: {file.size} bytes</p>
                          <p>Dimensions: {file.dimensions.width}x{file.dimensions.height}</p>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-primaryOrange-500 text-white px-4 py-2 rounded hover:bg-primaryOrange-600"
                        >
                          Download Image
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 2: AI Actions (Vary/Upscale)
// ============================================================================

export function AIActionsExample() {
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [actionType, setActionType] = useState<'vary' | 'upscale'>('vary');
  const [varyType, setVaryType] = useState<'subtle' | 'strong'>('subtle');

  const performAction = useAIActions({
    onSuccess: (data) => {
      console.log('AI action completed:', data);
    },
    onError: (error) => {
      console.error('AI action failed:', error);
    },
  });

  const handlePerformAction = () => {
    if (!selectedJobId) return;

    performAction.mutate({
      job_id: selectedJobId,
      action: actionType,
      index: selectedImageIndex,
      vary_type: actionType === 'vary' ? varyType : undefined,
    });
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-white mb-4">AI Actions</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Job ID:
          </label>
          <input
            type="text"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            placeholder="Enter job ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Image Index:
          </label>
          <input
            type="number"
            value={selectedImageIndex}
            onChange={(e) => setSelectedImageIndex(Number(e.target.value))}
            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Action Type:
          </label>
          <select
            value={actionType}
            onChange={(e) => setActionType(e.target.value as 'vary' | 'upscale')}
            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
          >
            <option value="vary">Vary</option>
            <option value="upscale">Upscale</option>
          </select>
        </div>

        {actionType === 'vary' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Vary Type:
            </label>
            <select
              value={varyType}
              onChange={(e) => setVaryType(e.target.value as 'subtle' | 'strong')}
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            >
              <option value="subtle">Subtle</option>
              <option value="strong">Strong</option>
            </select>
          </div>
        )}

        <button
          onClick={handlePerformAction}
          disabled={performAction.isLoading || !selectedJobId}
          className="bg-primaryOrange-500 text-white px-4 py-2 rounded hover:bg-primaryOrange-600 disabled:opacity-50"
        >
          {performAction.isLoading ? 'Processing...' : `Perform ${actionType}`}
        </button>

        {performAction.isError && (
          <div className="text-red-500">
            <p>Error: {performAction.error?.message}</p>
          </div>
        )}

        {performAction.isSuccess && performAction.data && (
          <div className="text-green-500">
            <p>Action completed successfully!</p>
            <p>New Job ID: {performAction.data.job_id}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Example 3: Account Dashboard
// ============================================================================

export function AIAccountDashboardExample() {
  const accountBalance = useAccountBalance({
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const userProfile = useUserProfile({
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="space-y-6">
      {/* Account Balance */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Account Balance</h2>
        {accountBalance.isLoading && (
          <div className="text-gray-300">Loading balance...</div>
        )}
        {accountBalance.isError && (
          <div className="text-red-500">
            <p>Error loading balance: {accountBalance.error?.message}</p>
          </div>
        )}
        {accountBalance.data && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Credits:</span>
              <span className="text-white font-semibold">{accountBalance.data.credits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Balance:</span>
              <span className="text-white font-semibold">
                {accountBalance.data.balance} {accountBalance.data.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Credit Value:</span>
              <span className="text-white font-semibold">
                {accountBalance.data.credit_value} {accountBalance.data.currency}/credit
              </span>
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">User Profile</h2>
        {userProfile.isLoading && (
          <div className="text-gray-300">Loading profile...</div>
        )}
        {userProfile.isError && (
          <div className="text-red-500">
            <p>Error loading profile: {userProfile.error?.message}</p>
          </div>
        )}
        {userProfile.data && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="text-white">{userProfile.data.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="text-white">{userProfile.data.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Plan:</span>
              <span className="text-white capitalize">{userProfile.data.subscription.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                userProfile.data.subscription.status === 'active' ? 'bg-green-500' :
                userProfile.data.subscription.status === 'inactive' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}>
                {userProfile.data.subscription.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Example 4: Complete AI Generation Workflow
// ============================================================================

export function CompleteAIWorkflowExample() {
  const [prompt, setPrompt] = useState('a futuristic city at night');
  const [currentJobId, setCurrentJobId] = useState<string>('');

  const aiGeneration = useAIGeneration({
    jobId: currentJobId,
    autoStart: true,
    onJobComplete: (result) => {
      console.log('Job completed:', result);
    },
    onJobError: (error) => {
      console.error('Job error:', error);
    },
  });

  const handleGenerate = () => {
    aiGeneration.createJob.mutate({
      prompt,
      style: 'photorealistic',
      size: '1024x1024',
      count: 2,
      quality: 'high',
    });
  };

  const handleVaryImage = (index: number) => {
    if (!currentJobId) return;
    
    aiGeneration.performAction.mutate({
      job_id: currentJobId,
      action: 'vary',
      index,
      vary_type: 'subtle',
    });
  };

  const handleUpscaleImage = (index: number) => {
    if (!currentJobId) return;
    
    aiGeneration.performAction.mutate({
      job_id: currentJobId,
      action: 'upscale',
      index,
    });
  };

  // Update current job ID when a new job is created
  useEffect(() => {
    if (aiGeneration.createJob.data?.job_id) {
      setCurrentJobId(aiGeneration.createJob.data.job_id);
    }
  }, [aiGeneration.createJob.data?.job_id]);

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-white mb-4">Complete AI Workflow</h2>
      
      <div className="space-y-6">
        {/* Generation Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prompt:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
              rows={3}
              placeholder="Describe the image you want to generate..."
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={aiGeneration.createJob.isLoading}
            className="bg-primaryOrange-500 text-white px-4 py-2 rounded hover:bg-primaryOrange-600 disabled:opacity-50"
          >
            {aiGeneration.createJob.isLoading ? 'Creating Job...' : 'Generate Images'}
          </button>
        </div>

        {/* Job Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Job Status</h3>
          
          {aiGeneration.jobStatus.isLoading && (
            <div className="text-gray-300">Loading job status...</div>
          )}

          {aiGeneration.jobStatus.isError && (
            <div className="text-red-500">
              <p>Error: {aiGeneration.jobStatus.error?.message}</p>
            </div>
          )}

          {aiGeneration.jobStatus.data && (
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    aiGeneration.jobStatus.data.status === 'completed' ? 'bg-green-500' :
                    aiGeneration.jobStatus.data.status === 'failed' ? 'bg-red-500' :
                    aiGeneration.jobStatus.data.status === 'processing' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}>
                    {aiGeneration.jobStatus.data.status}
                  </span>
                  {aiGeneration.isJobActive && (
                    <span className="text-primaryOrange-300 text-sm">Active</span>
                  )}
                </div>

                {aiGeneration.jobStatus.data.progress !== undefined && (
                  <div>
                    <span className="text-gray-400">Progress:</span>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div
                        className="bg-primaryOrange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${aiGeneration.jobStatus.data.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-300">
                      {aiGeneration.jobStatus.data.progress}%
                    </span>
                  </div>
                )}

                {/* Generated Images */}
                {aiGeneration.isJobCompleted && aiGeneration.jobStatus.data.result?.images && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Generated Images</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiGeneration.jobStatus.data.result.images.map((file, index) => (
                        <div key={index} className="space-y-2">
                          <Image
                            src={file.thumbnail_url}
                            alt={`Generated image ${index + 1}`}
                            width={400}
                            height={400}
                            className="w-full h-64 object-cover rounded"
                          />
                          <div className="text-sm text-gray-300">
                            <p>Filename: {file.filename}</p>
                            <p>Size: {file.size} bytes</p>
                            <p>Dimensions: {file.dimensions.width}x{file.dimensions.height}</p>
                          </div>
                          <div className="flex space-x-2">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-primaryOrange-500 text-white px-3 py-2 rounded text-sm hover:bg-primaryOrange-600 text-center"
                            >
                              Download
                            </a>
                            <button
                              onClick={() => handleVaryImage(index)}
                              disabled={aiGeneration.performAction.isLoading}
                              className="flex-1 bg-deepPurple-500 text-white px-3 py-2 rounded text-sm hover:bg-deepPurple-600 disabled:opacity-50"
                            >
                              Vary
                            </button>
                            <button
                              onClick={() => handleUpscaleImage(index)}
                              disabled={aiGeneration.performAction.isLoading}
                              className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                            >
                              Upscale
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Account Information</h3>
          
          {aiGeneration.accountBalance.data && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Credits:</span>
                <span className="text-white ml-2">{aiGeneration.accountBalance.data.credits}</span>
              </div>
              <div>
                <span className="text-gray-400">Balance:</span>
                <span className="text-white ml-2">
                  {aiGeneration.accountBalance.data.balance} {aiGeneration.accountBalance.data.currency}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}

// ============================================================================
// All examples are already exported with 'export function' declarations above
// ============================================================================
