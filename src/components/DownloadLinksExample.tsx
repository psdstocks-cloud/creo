'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  useDownloadLink,
  useGenerateDownloadLink,
  useDownloadLinks,
  useDownloadLinkWithRefresh,
  useDownloadLinkStats,
  useDownloadFile,
  DownloadLink,
  DownloadLinkRequest,
  DownloadLinkError,
} from '../hooks/useDownloadLinks';

interface DownloadLinksExampleProps {
  className?: string;
}

export default function DownloadLinksExample({ className = '' }: DownloadLinksExampleProps) {
  const t = useTranslations('DownloadLinks');
  
  // State
  const [orderId, setOrderId] = useState('');
  const [taskId, setTaskId] = useState('');
  const [selectedDownloadLink, setSelectedDownloadLink] = useState<DownloadLink | null>(null);
  const [downloadParams, setDownloadParams] = useState({
    responseType: 'original' as 'original' | 'compressed' | 'thumbnail' | 'preview' | 'watermarked',
    format: '',
    quality: 'original' as 'low' | 'medium' | 'high' | 'original',
    watermark: false,
    watermarkText: '',
    watermarkPosition: 'bottom-right' as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center',
  });
  
  // Single download link query
  const {
    data: downloadLink,
    isLoading: isDownloadLinkLoading,
    isError: isDownloadLinkError,
    error: downloadLinkError,
    refetch: refetchDownloadLink,
  } = useDownloadLink(orderId, taskId, {
    enabled: !!orderId && !!taskId,
    onSuccess: (data) => {
      console.log('Download link fetched:', data);
    },
    onError: (error) => {
      console.error('Download link fetch error:', error);
    },
  });
  
  // Generate download link mutation
  const {
    mutate: generateDownloadLink,
    isLoading: isGenerating,
    isError: isGenerateError,
    error: generateError,
    data: generatedLink,
  } = useGenerateDownloadLink({
    onSuccess: (data) => {
      console.log('Download link generated:', data);
      setSelectedDownloadLink(data);
    },
    onError: (error) => {
      console.error('Download link generation error:', error);
    },
  });
  
  // Multiple download links query
  const {
    data: downloadLinks,
    isLoading: isDownloadLinksLoading,
    isError: isDownloadLinksError,
    error: downloadLinksError,
    refetch: refetchDownloadLinks,
  } = useDownloadLinks({
    orderId: orderId || undefined,
    taskId: taskId || undefined,
    page: 1,
    pageSize: 20,
    status: 'all',
    sortBy: 'created',
    sortOrder: 'desc',
  }, {
    enabled: !!orderId || !!taskId,
  });
  
  // Download link with refresh
  const {
    data: refreshDownloadLink,
    isLoading: isRefreshLoading,
    isError: isRefreshError,
    error: refreshError,
    isExpiringSoon,
    timeUntilExpiry,
    refreshDownloadLink,
  } = useDownloadLinkWithRefresh(orderId, taskId, {
    enabled: !!orderId && !!taskId,
    refreshInterval: 60000, // 1 minute
    refreshThreshold: 5, // 5 minutes
  });
  
  // Download link stats
  const {
    data: downloadStats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
  } = useDownloadLinkStats(selectedDownloadLink?.id || '', {
    enabled: !!selectedDownloadLink?.id,
  });
  
  // Download file mutation
  const {
    mutate: downloadFile,
    isLoading: isDownloading,
    isError: isDownloadError,
    error: downloadError,
  } = useDownloadFile({
    onSuccess: (data) => {
      console.log('File downloaded:', data);
    },
    onError: (error) => {
      console.error('File download error:', error);
    },
  });
  
  // Handlers
  const handleOrderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderId(e.target.value);
  };
  
  const handleTaskIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskId(e.target.value);
  };
  
  const handleDownloadParamsChange = (key: string, value: any) => {
    setDownloadParams(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const handleGenerateDownloadLink = () => {
    if (!orderId || !taskId) {
      alert('Please enter both Order ID and Task ID');
      return;
    }
    
    const request: DownloadLinkRequest = {
      orderId,
      taskId,
      responseType: downloadParams.responseType,
      format: downloadParams.format || undefined,
      quality: downloadParams.quality,
      watermark: downloadParams.watermark,
      watermarkText: downloadParams.watermarkText || undefined,
      watermarkPosition: downloadParams.watermarkPosition,
    };
    
    generateDownloadLink(request);
  };
  
  const handleDownloadFile = (downloadUrl: string) => {
    downloadFile(downloadUrl);
  };
  
  const handleSelectDownloadLink = (link: DownloadLink) => {
    setSelectedDownloadLink(link);
  };
  
  // Utility functions
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatTimeUntilExpiry = (timeUntilExpiry: number) => {
    if (timeUntilExpiry <= 0) return 'Expired';
    
    const minutes = Math.floor(timeUntilExpiry / 60000);
    const seconds = Math.floor((timeUntilExpiry % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };
  
  const getErrorMessage = (error: DownloadLinkError) => {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Network error. Please check your internet connection.';
      case 'HTTP_404':
        return 'Download link not found.';
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
      case 'active':
        return 'text-green-400';
      case 'expired':
        return 'text-red-400';
      case 'expiring':
        return 'text-yellow-400';
      default:
        return 'text-white';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '✅';
      case 'expired':
        return '❌';
      case 'expiring':
        return '⚠️';
      default:
        return '❓';
    }
  };
  
  return (
    <div className={`glass-card p-6 max-w-6xl mx-auto ${className}`}>
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Download Links Management
      </h2>
      
      {/* Configuration */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Order ID
            </label>
            <input
              type="text"
              value={orderId}
              onChange={handleOrderIdChange}
              placeholder="Enter order ID"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
          </div>
          
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
        </div>
      </div>
      
      {/* Download Parameters */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Download Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Response Type
            </label>
            <select
              value={downloadParams.responseType}
              onChange={(e) => handleDownloadParamsChange('responseType', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            >
              <option value="original">Original</option>
              <option value="compressed">Compressed</option>
              <option value="thumbnail">Thumbnail</option>
              <option value="preview">Preview</option>
              <option value="watermarked">Watermarked</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Quality
            </label>
            <select
              value={downloadParams.quality}
              onChange={(e) => handleDownloadParamsChange('quality', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="original">Original</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Format
            </label>
            <input
              type="text"
              value={downloadParams.format}
              onChange={(e) => handleDownloadParamsChange('format', e.target.value)}
              placeholder="e.g., jpg, png, pdf"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={downloadParams.watermark}
                onChange={(e) => handleDownloadParamsChange('watermark', e.target.checked)}
                className="mr-2"
              />
              <span className="text-white">Watermark</span>
            </label>
          </div>
          
          {downloadParams.watermark && (
            <>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={downloadParams.watermarkText}
                  onChange={(e) => handleDownloadParamsChange('watermarkText', e.target.value)}
                  placeholder="Enter watermark text"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Watermark Position
                </label>
                <select
                  value={downloadParams.watermarkPosition}
                  onChange={(e) => handleDownloadParamsChange('watermarkPosition', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="center">Center</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Generate Download Link */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Generate Download Link</h3>
        
        <div className="flex space-x-4 mb-4">
          <button
            onClick={handleGenerateDownloadLink}
            disabled={isGenerating || !orderId || !taskId}
            className="px-6 py-3 bg-gradient-to-r from-primaryOrange-500 to-primaryOrange-600 text-white rounded-lg font-medium hover:from-primaryOrange-600 hover:to-primaryOrange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Download Link'}
          </button>
          
          <button
            onClick={() => refetchDownloadLink()}
            disabled={!orderId || !taskId}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Refresh Link
          </button>
        </div>
        
        {isGenerateError && generateError && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
            <h4 className="text-red-300 font-medium mb-1">Generation Error</h4>
            <p className="text-red-200 text-sm">{getErrorMessage(generateError)}</p>
          </div>
        )}
        
        {generatedLink && (
          <div className="glass-card p-4 rounded-lg mb-4">
            <h4 className="text-white font-medium mb-2">Generated Download Link</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white">ID:</span>
                <span className="text-primaryOrange-200">{generatedLink.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">File Name:</span>
                <span className="text-primaryOrange-200">{generatedLink.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">File Size:</span>
                <span className="text-primaryOrange-200">{formatFileSize(generatedLink.fileSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Expires At:</span>
                <span className="text-primaryOrange-200">
                  {new Date(generatedLink.expiresAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Max Downloads:</span>
                <span className="text-primaryOrange-200">{generatedLink.maxDownloads}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Remaining:</span>
                <span className="text-primaryOrange-200">{generatedLink.remainingDownloads}</span>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleDownloadFile(generatedLink.downloadUrl)}
                disabled={isDownloading}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50"
              >
                {isDownloading ? 'Downloading...' : 'Download File'}
              </button>
              
              <button
                onClick={() => handleSelectDownloadLink(generatedLink)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
              >
                View Stats
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Single Download Link */}
      {orderId && taskId && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Single Download Link</h3>
          
          {isDownloadLinkLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOrange-500"></div>
              <span className="ml-2 text-white">Loading download link...</span>
            </div>
          )}
          
          {isDownloadLinkError && downloadLinkError && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
              <h4 className="text-red-300 font-medium mb-1">Fetch Error</h4>
              <p className="text-red-200 text-sm">{getErrorMessage(downloadLinkError)}</p>
            </div>
          )}
          
          {downloadLink && (
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">Download Link Details</h4>
                <span className={`px-2 py-1 rounded text-sm ${
                  downloadLink.remainingDownloads > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {downloadLink.remainingDownloads > 0 ? 'Active' : 'Expired'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white">File Name:</span>
                  <span className="text-primaryOrange-200 ml-2">{downloadLink.fileName}</span>
                </div>
                <div>
                  <span className="text-white">File Size:</span>
                  <span className="text-primaryOrange-200 ml-2">{formatFileSize(downloadLink.fileSize)}</span>
                </div>
                <div>
                  <span className="text-white">Content Type:</span>
                  <span className="text-primaryOrange-200 ml-2">{downloadLink.contentType}</span>
                </div>
                <div>
                  <span className="text-white">Expires At:</span>
                  <span className="text-primaryOrange-200 ml-2">
                    {new Date(downloadLink.expiresAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-white">Max Downloads:</span>
                  <span className="text-primaryOrange-200 ml-2">{downloadLink.maxDownloads}</span>
                </div>
                <div>
                  <span className="text-white">Remaining:</span>
                  <span className="text-primaryOrange-200 ml-2">{downloadLink.remainingDownloads}</span>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleDownloadFile(downloadLink.downloadUrl)}
                  disabled={isDownloading || downloadLink.remainingDownloads <= 0}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? 'Downloading...' : 'Download File'}
                </button>
                
                <button
                  onClick={() => handleSelectDownloadLink(downloadLink)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
                >
                  View Stats
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Download Link with Refresh */}
      {orderId && taskId && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Download Link with Auto-Refresh</h3>
          
          {isRefreshLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOrange-500"></div>
              <span className="ml-2 text-white">Loading...</span>
            </div>
          )}
          
          {isRefreshError && refreshError && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
              <h4 className="text-red-300 font-medium mb-1">Refresh Error</h4>
              <p className="text-red-200 text-sm">{getErrorMessage(refreshError)}</p>
            </div>
          )}
          
          {refreshDownloadLink && (
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">Auto-Refresh Download Link</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    isExpiringSoon ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'
                  }`}>
                    {isExpiringSoon ? 'Expiring Soon' : 'Active'}
                  </span>
                  <button
                    onClick={refreshDownloadLink}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Refresh
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white">File Name:</span>
                  <span className="text-primaryOrange-200 ml-2">{refreshDownloadLink.fileName}</span>
                </div>
                <div>
                  <span className="text-white">File Size:</span>
                  <span className="text-primaryOrange-200 ml-2">{formatFileSize(refreshDownloadLink.fileSize)}</span>
                </div>
                <div>
                  <span className="text-white">Time Until Expiry:</span>
                  <span className="text-primaryOrange-200 ml-2">
                    {timeUntilExpiry ? formatTimeUntilExpiry(timeUntilExpiry) : 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-white">Remaining Downloads:</span>
                  <span className="text-primaryOrange-200 ml-2">{refreshDownloadLink.remainingDownloads}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Multiple Download Links */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Multiple Download Links</h3>
        
        {isDownloadLinksLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOrange-500"></div>
            <span className="ml-2 text-white">Loading download links...</span>
          </div>
        )}
        
        {isDownloadLinksError && downloadLinksError && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
            <h4 className="text-red-300 font-medium mb-1">Fetch Error</h4>
            <p className="text-red-200 text-sm">{getErrorMessage(downloadLinksError)}</p>
          </div>
        )}
        
        {downloadLinks && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white">Total: {downloadLinks.total} links</span>
              <button
                onClick={() => refetchDownloadLinks()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
              >
                Refresh
              </button>
            </div>
            
            {downloadLinks.data.map((link) => (
              <div key={link.id} className="glass-card p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{link.fileName}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    link.remainingDownloads > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {link.remainingDownloads > 0 ? 'Active' : 'Expired'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white">Size:</span>
                    <span className="text-primaryOrange-200 ml-2">{formatFileSize(link.fileSize)}</span>
                  </div>
                  <div>
                    <span className="text-white">Expires:</span>
                    <span className="text-primaryOrange-200 ml-2">
                      {new Date(link.expiresAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-white">Downloads:</span>
                    <span className="text-primaryOrange-200 ml-2">
                      {link.currentDownloads}/{link.maxDownloads}
                    </span>
                  </div>
                  <div>
                    <span className="text-white">Remaining:</span>
                    <span className="text-primaryOrange-200 ml-2">{link.remainingDownloads}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleDownloadFile(link.downloadUrl)}
                    disabled={isDownloading || link.remainingDownloads <= 0}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Download
                  </button>
                  
                  <button
                    onClick={() => handleSelectDownloadLink(link)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
                  >
                    View Stats
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Download Link Stats */}
      {selectedDownloadLink && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Download Link Statistics</h3>
          
          {isStatsLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOrange-500"></div>
              <span className="ml-2 text-white">Loading stats...</span>
            </div>
          )}
          
          {isStatsError && statsError && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
              <h4 className="text-red-300 font-medium mb-1">Stats Error</h4>
              <p className="text-red-200 text-sm">{getErrorMessage(statsError)}</p>
            </div>
          )}
          
          {downloadStats && (
            <div className="glass-card p-4 rounded-lg">
              <h4 className="text-white font-medium mb-4">Statistics for {selectedDownloadLink.fileName}</h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white">Total Downloads:</span>
                  <span className="text-primaryOrange-200 ml-2">{downloadStats.totalDownloads}</span>
                </div>
                <div>
                  <span className="text-white">Remaining Downloads:</span>
                  <span className="text-primaryOrange-200 ml-2">{downloadStats.remainingDownloads}</span>
                </div>
                <div>
                  <span className="text-white">Download Count:</span>
                  <span className="text-primaryOrange-200 ml-2">{downloadStats.downloadCount}</span>
                </div>
                <div>
                  <span className="text-white">Last Downloaded:</span>
                  <span className="text-primaryOrange-200 ml-2">
                    {downloadStats.lastDownloadedAt ? new Date(downloadStats.lastDownloadedAt).toLocaleString() : 'Never'}
                  </span>
                </div>
                <div>
                  <span className="text-white">Expires At:</span>
                  <span className="text-primaryOrange-200 ml-2">
                    {new Date(downloadStats.expiresAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-white">Status:</span>
                  <span className={`ml-2 ${
                    downloadStats.isExpired ? 'text-red-400' :
                    downloadStats.isExpiringSoon ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {downloadStats.isExpired ? 'Expired' :
                     downloadStats.isExpiringSoon ? 'Expiring Soon' : 'Active'}
                  </span>
                </div>
              </div>
              
              {downloadStats.timeUntilExpiry > 0 && (
                <div className="mt-4">
                  <span className="text-white">Time Until Expiry:</span>
                  <span className="text-primaryOrange-200 ml-2">
                    {formatTimeUntilExpiry(downloadStats.timeUntilExpiry)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Statistics Summary */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Statistics Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Single Download Link</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white">Status:</span>
                <span className="text-primaryOrange-200">
                  {downloadLink ? 'Loaded' : 'Not Loaded'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">File Size:</span>
                <span className="text-primaryOrange-200">
                  {downloadLink ? formatFileSize(downloadLink.fileSize) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Remaining:</span>
                <span className="text-primaryOrange-200">
                  {downloadLink ? downloadLink.remainingDownloads : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Multiple Download Links</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white">Total:</span>
                <span className="text-primaryOrange-200">
                  {downloadLinks ? downloadLinks.total : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Page:</span>
                <span className="text-primaryOrange-200">
                  {downloadLinks ? downloadLinks.page : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Has Next:</span>
                <span className="text-primaryOrange-200">
                  {downloadLinks ? (downloadLinks.hasNext ? 'Yes' : 'No') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Auto-Refresh</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white">Status:</span>
                <span className="text-primaryOrange-200">
                  {refreshDownloadLink ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Expiring Soon:</span>
                <span className="text-primaryOrange-200">
                  {isExpiringSoon ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Time Until Expiry:</span>
                <span className="text-primaryOrange-200">
                  {timeUntilExpiry ? formatTimeUntilExpiry(timeUntilExpiry) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
