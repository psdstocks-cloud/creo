'use client'

import { useState, useCallback } from 'react'
import { useStockSites, useStockInfo, useCreateOrder, useOrderStatus, useDownloadLink } from '@/hooks/useStockMedia'
import { useAuth } from '@/components/auth/AuthProvider'
import { MagnifyingGlassIcon, PhotoIcon, CloudArrowDownIcon } from '@heroicons/react/24/outline'
// import { LoadingState, LoadingCard } from '@/components/ui/LoadingState'
import { useToastHelpers } from '@/components/ui/Toast'
import Image from 'next/image'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface SearchParams {
  site: string
  query: string
  id: string
  url?: string
}

export default function StockSearchPage() {
  const { user } = useAuth()
  const { success, error: showError } = useToastHelpers()
  const [searchParams, setSearchParams] = useState<SearchParams>({
    site: '',
    query: '',
    id: '',
    url: ''
  })
  const [activeOrders, setActiveOrders] = useState<string[]>([])

  // API Hooks
  const { data: stockSites, isLoading: sitesLoading } = useStockSites()
  const { data: stockInfo, isLoading: infoLoading, error: infoError } = useStockInfo(
    searchParams.site, 
    searchParams.id, 
    searchParams.url,
  )
  
  const createOrderMutation = useCreateOrder()
  const downloadLinkMutation = useDownloadLink()

  // Handle search form submission
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchParams.site || !searchParams.id) {
      alert('Please select a site and enter an ID')
      return
    }

    // Search is automatic via the useStockInfo hook when params change
  }, [searchParams])

  // Handle order creation
  const handleCreateOrder = useCallback(async () => {
    if (!stockInfo) return

    try {
      const response = await createOrderMutation.mutateAsync({
        site: searchParams.site,
        id: searchParams.id,
        url: searchParams.url
      })
      
      setActiveOrders(prev => [...prev, response.task_id])
      success('Order Created', 'Your download order has been created successfully.')
    } catch (error) {
      console.error('Failed to create order:', error)
      showError('Order Failed', 'Failed to create order. Please try again.')
    }
  }, [stockInfo, searchParams, createOrderMutation, success, showError])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Authentication Required</h3>
          <p className="mt-1 text-sm text-gray-500">Please sign in to search stock media.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Stock Media Search</h1>
          <p className="mt-2 text-lg text-gray-600">
            Search and download stock media from multiple sources
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Site Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Site
                </label>
                <select
                  value={searchParams.site}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, site: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={sitesLoading}
                >
                  <option value="">Select a site...</option>
                  {stockSites && Object.entries(stockSites).map(([site, config]) => (
                    <option key={site} value={site} disabled={!config.active}>
                      {site} {config.active ? `($${config.price})` : '(Inactive)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Media ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media ID
                </label>
                <input
                  type="text"
                  value={searchParams.id}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, id: e.target.value }))}
                  placeholder="Enter media ID..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Optional URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original URL (Optional)
                </label>
                <input
                  type="url"
                  value={searchParams.url}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!searchParams.site || !searchParams.id || infoLoading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                {infoLoading ? 'Searching...' : 'Search Media'}
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {infoError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              Error: {infoError.message}
            </p>
          </div>
        )}

        {stockInfo && (
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="md:flex">
              {/* Media Preview */}
              <div className="md:w-1/3 p-6">
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={stockInfo.data.image}
                    alt={stockInfo.data.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>

              {/* Media Details */}
              <div className="md:w-2/3 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{stockInfo.data.title}</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Source:</span>
                    <p className="text-lg text-gray-900">{stockInfo.data.source}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Cost:</span>
                    <p className="text-lg text-gray-900">${stockInfo.data.cost}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Author:</span>
                    <p className="text-lg text-gray-900">{stockInfo.data.author || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">File Size:</span>
                    <p className="text-lg text-gray-900">{stockInfo.data.sizeInBytes || 'N/A'}</p>
                  </div>
                </div>

                <button
                  onClick={handleCreateOrder}
                  disabled={createOrderMutation.isPending}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <CloudArrowDownIcon className="h-5 w-5 mr-2" />
                  {createOrderMutation.isPending ? 'Creating Order...' : 'Order & Download'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Orders</h3>
            <div className="space-y-4">
              {activeOrders.map((taskId) => (
                <OrderStatusCard 
                  key={taskId} 
                  taskId={taskId} 
                  downloadLinkMutation={downloadLinkMutation}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Order Status Card Component
function OrderStatusCard({ 
  taskId, 
  downloadLinkMutation 
}: { 
  taskId: string
  downloadLinkMutation: ReturnType<typeof useDownloadLink>
}) {
  const { data: orderStatus } = useOrderStatus(taskId)

  const handleDownload = useCallback(async () => {
    try {
      const result = await downloadLinkMutation.mutateAsync({ taskId })
      if (result.downloadLink) {
        window.open(result.downloadLink, '_blank')
      }
    } catch (error) {
      console.error('Failed to get download link:', error)
      alert('Failed to get download link. Please try again.')
    }
  }, [taskId, downloadLinkMutation])

  if (!orderStatus) return null

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-900">Order: {taskId}</p>
          <p className="text-sm text-gray-500">
            Status: <span className={`font-medium ${
              orderStatus.status === 'ready' ? 'text-green-600' : 
              orderStatus.status === 'processing' ? 'text-blue-600' : 'text-red-600'
            }`}>
              {orderStatus.status}
            </span>
          </p>
        </div>
        
        {orderStatus.status === 'ready' && (
          <button
            onClick={handleDownload}
            disabled={downloadLinkMutation.isPending}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {downloadLinkMutation.isPending ? 'Getting Link...' : 'Download'}
          </button>
        )}
      </div>
    </div>
  )
}
