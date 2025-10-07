'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  useStockMediaSearch,
  useCreateOrderMutation,
  useOrderStatus,
  useDownloadLink,
  useAIGenerate,
  useAIGenerationStatus,
  useAIGenerationHistory,
  useDownloadFile,
  useDownloadAIGeneratedImage,
} from '../hooks';

interface NehtwAPIExampleProps {
  className?: string;
}

export default function NehtwAPIExample({ className = '' }: NehtwAPIExampleProps) {
  
  // State for different API operations
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia] = useState<{ id: string; title: string; thumbnail: string; cost: number; source: string; ext: string } | null>(null);
  const [orderTaskId, setOrderTaskId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiJobId, setAiJobId] = useState<string | null>(null);
  
  // Stock Media Search
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useStockMediaSearch({
    query: searchQuery,
    page: 1,
    pageSize: 20,
  });
  
  // Create Order
  const { mutate: createOrder, data: orderData, error: orderError, isLoading: isCreatingOrder } = useCreateOrderMutation();
  
  // Order Status
  const {
    data: orderStatus,
    isLoading: isOrderStatusLoading,
  } = useOrderStatus(orderTaskId || '', {
    enabled: !!orderTaskId,
  });
  
  // Download Link
  const {
    data: downloadLink,
  } = useDownloadLink(orderTaskId || '', {
    enabled: !!orderTaskId && orderStatus?.status === 'ready',
  });
  
  // AI Generation
  const aiGenerateMutation = useAIGenerate();
  
  // AI Generation Status
  const {
    data: aiStatus,
    isLoading: isAiStatusLoading,
  } = useAIGenerationStatus(aiJobId || '', {
    enabled: !!aiJobId,
  });
  
  // AI Generation History
  const {
    data: aiHistory,
  } = useAIGenerationHistory({
    page: 1,
    limit: 10,
  });
  
  // Download File
  const downloadFileMutation = useDownloadFile();
  const downloadAiImageMutation = useDownloadAIGeneratedImage();
  
  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search is handled by the hook automatically
    }
  };
  
  const handleCreateOrder = async (mediaItem: { id: string; title: string; thumbnail: string; cost: number; source: string; ext: string }) => {
    try {
      const result = await createOrder({
        siteId: 'default',
        stockId: mediaItem.id,
        quantity: 1,
      });
      setOrderTaskId(result.taskId);
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };
  
  const handleDownload = async () => {
    if (downloadLink?.downloadLink) {
      try {
        await downloadFileMutation.mutateAsync(downloadLink.downloadLink);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  };
  
  const handleAIGenerate = async () => {
    if (aiPrompt.trim()) {
      try {
        const result = await aiGenerateMutation.mutateAsync({
          prompt: aiPrompt,
          style: 'realistic',
          size: '1024x1024',
          quality: 'hd',
        });
        setAiJobId(result.jobId);
      } catch (error) {
        console.error('AI generation failed:', error);
      }
    }
  };
  
  const handleDownloadAI = async () => {
    if (aiStatus?.result?.imageUrl) {
      try {
        await downloadAiImageMutation.mutateAsync(aiStatus.result.imageUrl);
      } catch (error) {
        console.error('AI image download failed:', error);
      }
    }
  };
  
  return (
    <div className={`glass-card p-6 max-w-6xl mx-auto ${className}`}>
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        nehtw API Integration Example
      </h2>
      
      {/* Stock Media Search */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Stock Media Search</h3>
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for stock media..."
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-2 bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        
        {searchError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
            Search error: {searchError.message}
          </div>
        )}
        
        {searchResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.results.map((item: any) => (
              <div key={item.id} className="glass-card p-4 rounded-lg">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  width={300}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h4 className="text-white font-medium mb-2">{item.title}</h4>
                <p className="text-primaryOrange-200 text-sm mb-2">
                  {item.source} • {item.ext}
                </p>
                <p className="text-white font-bold mb-3">
                  ${item.cost}
                </p>
                <button
                  onClick={() => handleCreateOrder(item)}
                  disabled={isCreatingOrder}
                  className="w-full px-4 py-2 bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {isCreatingOrder ? 'Creating...' : 'Order'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Order Status */}
      {orderTaskId && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Order Status</h3>
          <div className="glass-card p-4 rounded-lg">
            {isOrderStatusLoading ? (
              <p className="text-primaryOrange-200">Loading order status...</p>
            ) : orderStatus ? (
              <div>
                <p className="text-white mb-2">
                  Status: <span className="font-bold">{orderStatus.status}</span>
                </p>
                {orderStatus.progress && (
                  <div className="mb-2">
                    <p className="text-white text-sm mb-1">Progress: {orderStatus.progress}%</p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primaryOrange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${orderStatus.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                {orderStatus.status === 'ready' && downloadLink && (
                  <button
                    onClick={handleDownload}
                    disabled={downloadFileMutation.isPending}
                    className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    {downloadFileMutation.isPending ? 'Downloading...' : 'Download'}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-red-300">Failed to load order status</p>
            )}
          </div>
        </div>
      )}
      
      {/* AI Generation */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">AI Image Generation</h3>
        <div className="mb-4">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
          />
        </div>
        <button
          onClick={handleAIGenerate}
          disabled={aiGenerateMutation.isPending || !aiPrompt.trim()}
          className="px-6 py-2 bg-deepPurple-500 hover:bg-deepPurple-600 text-white rounded-lg font-medium disabled:opacity-50"
        >
          {aiGenerateMutation.isPending ? 'Generating...' : 'Generate Image'}
        </button>
        
        {aiJobId && (
          <div className="mt-4 glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">AI Generation Status</h4>
            {isAiStatusLoading ? (
              <p className="text-primaryOrange-200">Loading status...</p>
            ) : aiStatus ? (
              <div>
                <p className="text-white mb-2">
                  Status: <span className="font-bold">{aiStatus.status}</span>
                </p>
                {aiStatus.progress && (
                  <div className="mb-2">
                    <p className="text-white text-sm mb-1">Progress: {aiStatus.progress}%</p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-deepPurple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${aiStatus.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                {aiStatus.status === 'completed' && aiStatus.result && (
                  <div className="mt-4">
                    <Image
                      src={aiStatus.result.thumbnailUrl}
                      alt="Generated image"
                      width={400}
                      height={400}
                      className="w-full max-w-md h-auto rounded-lg mb-2"
                    />
                    <button
                      onClick={handleDownloadAI}
                      disabled={downloadAiImageMutation.isPending}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                      {downloadAiImageMutation.isPending ? 'Downloading...' : 'Download Image'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-300">Failed to load AI generation status</p>
            )}
          </div>
        )}
      </div>
      
      {/* AI Generation History */}
      {aiHistory && aiHistory.jobs.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">AI Generation History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiHistory.jobs.map((job) => (
              <div key={job.jobId} className="glass-card p-4 rounded-lg">
                <p className="text-white font-medium mb-2">
                  Status: <span className="font-bold">{job.status}</span>
                </p>
                {job.result && (
                  <div>
                    <Image
                      src={job.result.thumbnailUrl}
                      alt="Generated image"
                      width={300}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-primaryOrange-200 text-sm">
                      {job.result.metadata.prompt}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
