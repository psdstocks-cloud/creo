/**
 * React Query Hooks Usage Examples
 * 
 * Comprehensive examples showing how to use the stock media integration hooks
 * with proper error handling, loading states, and user interactions.
 */

import React, { useState } from 'react';
import Image from 'next/image';
import {
  useStockInfo,
  useCreateOrder,
  useOrderStatus,
  useDownloadLink,
  useAIGeneration,
  useAIJobStatus,
  useAccountBalance,
  useUserProfile,
  useStockSites,
} from './useStockMediaIntegration';

// ============================================================================
// Example 1: Stock Information Display
// ============================================================================

export function StockInfoExample() {
  const [site, setSite] = useState('shutterstock');
  const [id, setId] = useState('12345');
  const [enabled, setEnabled] = useState(false);

  const {
    data: stockInfo,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useStockInfo(site, id, undefined, {
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  const handleFetch = () => {
    setEnabled(true);
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass-card p-6">
        <div className="text-red-500 mb-4">
          <h3 className="font-bold">Error loading stock info</h3>
          <p>{error?.message || 'Unknown error occurred'}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="bg-primaryOrange-500 text-white px-4 py-2 rounded hover:bg-primaryOrange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-white">Stock Information</h2>
        {isFetching && (
          <div className="text-primaryOrange-300 text-sm">Updating...</div>
        )}
      </div>

      {!enabled ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Site:
            </label>
            <input
              type="text"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ID:
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            />
          </div>
          <button
            onClick={handleFetch}
            className="bg-primaryOrange-500 text-white px-4 py-2 rounded hover:bg-primaryOrange-600"
          >
            Fetch Stock Info
          </button>
        </div>
      ) : stockInfo ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Image
              src={stockInfo.thumbnail}
              alt={stockInfo.title}
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">{stockInfo.title}</h3>
              <p className="text-gray-300">{stockInfo.description}</p>
              <p className="text-primaryOrange-300">
                {stockInfo.pricing.credits} credits - ${stockInfo.pricing.price}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Type:</span>
              <span className="text-white ml-2">{stockInfo.type}</span>
            </div>
            <div>
              <span className="text-gray-400">Size:</span>
              <span className="text-white ml-2">{stockInfo.size} bytes</span>
            </div>
            <div>
              <span className="text-gray-400">License:</span>
              <span className="text-white ml-2">{stockInfo.license_type}</span>
            </div>
            <div>
              <span className="text-gray-400">Quality:</span>
              <span className="text-white ml-2">{stockInfo.quality}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ============================================================================
// Example 2: Order Creation and Tracking
// ============================================================================

export function OrderTrackingExample() {
  const [orderData, setOrderData] = useState({
    site_id: 'shutterstock',
    stock_id: '12345',
    user_id: 'user-123',
  });
  const [taskId, setTaskId] = useState<string>('');

  const createOrder = useCreateOrder({
    onSuccess: (data) => {
      console.log('Order created:', data);
      setTaskId(data.order_id);
    },
    onError: (error) => {
      console.error('Order creation failed:', error);
    },
  });

  const {
    data: orderStatus,
    isLoading: statusLoading,
    isError: statusError,
    error: statusErrorObj,
    isPolling,
  } = useOrderStatus(taskId, {
    enabled: Boolean(taskId),
    refetchInterval: 2000,
  });

  const {
    data: downloadLink,
    isLoading: downloadLoading,
    isError: downloadError,
  } = useDownloadLink(taskId, 'any', {
    enabled: orderStatus?.status === 'completed',
  });

  const handleCreateOrder = () => {
    createOrder.mutate(orderData);
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-white mb-4">Order Tracking</h2>

      {!taskId ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Site ID:
            </label>
            <input
              type="text"
              value={orderData.site_id}
              onChange={(e) => setOrderData({ ...orderData, site_id: e.target.value })}
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stock ID:
            </label>
            <input
              type="text"
              value={orderData.stock_id}
              onChange={(e) => setOrderData({ ...orderData, stock_id: e.target.value })}
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            />
          </div>
          <button
            onClick={handleCreateOrder}
            disabled={createOrder.isLoading}
            className="bg-primaryOrange-500 text-white px-4 py-2 rounded hover:bg-primaryOrange-600 disabled:opacity-50"
          >
            {createOrder.isLoading ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Order Status</h3>
            {isPolling && (
              <div className="text-primaryOrange-300 text-sm">Polling...</div>
            )}
          </div>

          {statusLoading && (
            <div className="text-gray-300">Loading order status...</div>
          )}

          {statusError && (
            <div className="text-red-500">
              <p>Error loading status: {statusErrorObj?.message}</p>
            </div>
          )}

          {orderStatus && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  orderStatus.status === 'completed' ? 'bg-green-500' :
                  orderStatus.status === 'failed' ? 'bg-red-500' :
                  orderStatus.status === 'processing' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`}>
                  {orderStatus.status}
                </span>
              </div>
              
              {orderStatus.progress !== undefined && (
                <div>
                  <span className="text-gray-400">Progress:</span>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-primaryOrange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${orderStatus.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-300">{orderStatus.progress}%</span>
                </div>
              )}

              {orderStatus.error_message && (
                <div className="text-red-500">
                  <p>Error: {orderStatus.error_message}</p>
                </div>
              )}
            </div>
          )}

          {orderStatus?.status === 'completed' && (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-white">Download Link</h4>
              {downloadLoading && (
                <div className="text-gray-300">Loading download link...</div>
              )}
              {downloadError && (
                <div className="text-red-500">
                  <p>Error loading download link</p>
                </div>
              )}
              {downloadLink && (
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Filename:</span>
                    <span className="text-white ml-2">{downloadLink.filename}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Size:</span>
                    <span className="text-white ml-2">{downloadLink.size} bytes</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Expires:</span>
                    <span className="text-white ml-2">
                      {new Date(downloadLink.expires_at).toLocaleString()}
                    </span>
                  </div>
                  <a
                    href={downloadLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primaryOrange-500 text-white px-4 py-2 rounded hover:bg-primaryOrange-600"
                  >
                    Download File
                  </a>
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
// Example 3: AI Generation
// ============================================================================

export function AIGenerationExample() {
  const [prompt, setPrompt] = useState('sunset over mountains');
  const [jobId, setJobId] = useState<string>('');

  const generateAI = useAIGeneration({
    onSuccess: (data) => {
      console.log('AI generation started:', data);
      setJobId(data.job_id);
    },
    onError: (error) => {
      console.error('AI generation failed:', error);
    },
  });

  const {
    data: jobStatus,
    isLoading: statusLoading,
    isError: statusError,
    error: statusErrorObj,
    isPolling,
  } = useAIJobStatus(jobId, {
    enabled: Boolean(jobId),
    refetchInterval: 5000,
  });

  const handleGenerate = () => {
    generateAI.mutate({
      prompt,
      style: 'photorealistic',
      size: '1024x1024',
      count: 1,
      quality: 'high',
    });
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-white mb-4">AI Image Generation</h2>

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
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={generateAI.isLoading}
            className="bg-primaryOrange-500 text-white px-4 py-2 rounded hover:bg-primaryOrange-600 disabled:opacity-50"
          >
            {generateAI.isLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Generation Status</h3>
            {isPolling && (
              <div className="text-primaryOrange-300 text-sm">Polling...</div>
            )}
          </div>

          {statusLoading && (
            <div className="text-gray-300">Loading job status...</div>
          )}

          {statusError && (
            <div className="text-red-500">
              <p>Error loading status: {statusErrorObj?.message}</p>
            </div>
          )}

          {jobStatus && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  jobStatus.status === 'completed' ? 'bg-green-500' :
                  jobStatus.status === 'failed' ? 'bg-red-500' :
                  jobStatus.status === 'processing' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`}>
                  {jobStatus.status}
                </span>
              </div>
              
              {jobStatus.progress !== undefined && (
                <div>
                  <span className="text-gray-400">Progress:</span>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-primaryOrange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${jobStatus.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-300">{jobStatus.progress}%</span>
                </div>
              )}

              {jobStatus.error_message && (
                <div className="text-red-500">
                  <p>Error: {jobStatus.error_message}</p>
                </div>
              )}

              {jobStatus.status === 'completed' && jobStatus.result && (
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-white">Generated Images</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {jobStatus.result.images.map((image, index) => (
                      <div key={index} className="space-y-2">
                        <Image
                          src={image.thumbnail_url}
                          alt={`Generated image ${index + 1}`}
                          width={400}
                          height={192}
                          className="w-full h-48 object-cover rounded"
                        />
                        <div className="text-sm text-gray-300">
                          <p>Filename: {image.filename}</p>
                          <p>Size: {image.size} bytes</p>
                          <p>Dimensions: {image.dimensions.width}x{image.dimensions.height}</p>
                        </div>
                        <a
                          href={image.url}
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
// Example 4: Account Dashboard
// ============================================================================

export function AccountDashboardExample() {
  const {
    data: balance,
    isLoading: balanceLoading,
    isError: balanceError,
    error: balanceErrorObj,
  } = useAccountBalance({
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErrorObj,
  } = useUserProfile();

  const {
    data: stockSites,
    isLoading: sitesLoading,
    isError: sitesError,
    error: sitesErrorObj,
  } = useStockSites();

  return (
    <div className="space-y-6">
      {/* Account Balance */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Account Balance</h2>
        {balanceLoading && (
          <div className="text-gray-300">Loading balance...</div>
        )}
        {balanceError && (
          <div className="text-red-500">
            <p>Error loading balance: {balanceErrorObj?.message}</p>
          </div>
        )}
        {balance && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Credits:</span>
              <span className="text-white font-semibold">{balance.credits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Balance:</span>
              <span className="text-white font-semibold">
                {balance.balance} {balance.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Credit Value:</span>
              <span className="text-white font-semibold">
                {balance.credit_value} {balance.currency}/credit
              </span>
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">User Profile</h2>
        {profileLoading && (
          <div className="text-gray-300">Loading profile...</div>
        )}
        {profileError && (
          <div className="text-red-500">
            <p>Error loading profile: {profileErrorObj?.message}</p>
          </div>
        )}
        {profile && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="text-white">{profile.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="text-white">{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Plan:</span>
              <span className="text-white capitalize">{profile.subscription.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                profile.subscription.status === 'active' ? 'bg-green-500' :
                profile.subscription.status === 'inactive' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}>
                {profile.subscription.status}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Stock Sites */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Available Stock Sites</h2>
        {sitesLoading && (
          <div className="text-gray-300">Loading stock sites...</div>
        )}
        {sitesError && (
          <div className="text-red-500">
            <p>Error loading stock sites: {sitesErrorObj?.message}</p>
          </div>
        )}
        {stockSites && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stockSites.sites.map((site) => (
              <div key={site.id} className="border border-gray-600 rounded p-4">
                <h3 className="font-semibold text-white mb-2">{site.name}</h3>
                <p className="text-sm text-gray-300 mb-2">{site.description}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Types:</span>
                    <span className="text-white">{site.supported_types.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pricing:</span>
                    <span className="text-white capitalize">{site.pricing_model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      site.status === 'active' ? 'bg-green-500' :
                      site.status === 'inactive' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`}>
                      {site.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Example 5: Complete Workflow
// ============================================================================

export function CompleteWorkflowExample() {
  const [step, setStep] = useState<'search' | 'order' | 'download'>('search');

  // This would be a simplified version of the complete workflow
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-white mb-4">Complete Workflow</h2>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setStep('search')}
            className={`px-4 py-2 rounded ${
              step === 'search' ? 'bg-primaryOrange-500 text-white' : 'bg-gray-600 text-gray-300'
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setStep('order')}
            className={`px-4 py-2 rounded ${
              step === 'order' ? 'bg-primaryOrange-500 text-white' : 'bg-gray-600 text-gray-300'
            }`}
          >
            Order
          </button>
          <button
            onClick={() => setStep('download')}
            className={`px-4 py-2 rounded ${
              step === 'download' ? 'bg-primaryOrange-500 text-white' : 'bg-gray-600 text-gray-300'
            }`}
          >
            Download
          </button>
        </div>

        {step === 'search' && (
          <div>
            <p className="text-gray-300">Search for stock media...</p>
            <StockInfoExample />
          </div>
        )}

        {step === 'order' && (
          <div>
            <p className="text-gray-300">Create and track orders...</p>
            <OrderTrackingExample />
          </div>
        )}

        {step === 'download' && (
          <div>
            <p className="text-gray-300">Download completed orders...</p>
            <p className="text-sm text-gray-400">
              This step would show download links for completed orders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// All examples are already exported with 'export function' declarations above
// ============================================================================
