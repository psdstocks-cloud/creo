'use client'

import { useState, useCallback } from 'react'
import { useStockSites, useStockInfo, useCreateOrder, useOrderStatus, useDownloadLink } from '@/hooks/useStockMedia'
import { useAuth } from '@/components/auth/AuthProvider'
import { MagnifyingGlassIcon, PhotoIcon, CloudArrowDownIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline'
// import { LoadingState, LoadingCard } from '@/components/ui/LoadingState'
import { useToastHelpers } from '@/components/ui/Toast'
import { BatchStockSearch } from '@/components/stock-search/BatchStockSearch'
import { PageLayout } from '@/components/layout/PageLayout'
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
  const [searchMode, setSearchMode] = useState<'single' | 'batch'>('single')

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
      
      setActiveOrders(prev => [...prev, response])
      success('Order Created', 'Your download order has been created successfully.')
    } catch (error) {
      console.error('Failed to create order:', error)
      showError('Order Failed', 'Failed to create order. Please try again.')
    }
  }, [stockInfo, searchParams, createOrderMutation, success, showError])

  if (!user) {
    return (
      <PageLayout
        title="Stock Media Search"
        subtitle="Search and download stock media from multiple sources"
        requiresAuth={true}
      />
    )
  }

  return (
    <PageLayout
      title="Stock Media Search"
      subtitle="Search and download stock media from multiple sources"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Mode Toggle */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="bg-white/60 backdrop-blur-md rounded-lg p-1 border border-white/20">
              <button
                onClick={() => setSearchMode('single')}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  searchMode === 'single'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Single Search
              </button>
              <button
                onClick={() => setSearchMode('batch')}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  searchMode === 'batch'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                <Squares2X2Icon className="h-4 w-4 mr-2" />
                Batch Search
              </button>
            </div>
          </div>
        </div>

        {/* Render appropriate search interface */}
        {searchMode === 'batch' ? (
          <BatchStockSearch />
        ) : (
          <SingleStockSearch
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            activeOrders={activeOrders}
            setActiveOrders={setActiveOrders}
            stockSites={stockSites}
            sitesLoading={sitesLoading}
            stockInfo={stockInfo}
            infoLoading={infoLoading}
            infoError={infoError}
            createOrderMutation={createOrderMutation}
            downloadLinkMutation={downloadLinkMutation}
            handleSearch={handleSearch}
            handleCreateOrder={handleCreateOrder}
          />
        )}
      </div>
    </PageLayout>
  )
}

// Single Search Component
function SingleStockSearch({
  searchParams,
  setSearchParams,
  activeOrders,
  setActiveOrders,
  stockSites,
  sitesLoading,
  stockInfo,
  infoLoading,
  infoError,
  createOrderMutation,
  downloadLinkMutation,
  handleSearch,
  handleCreateOrder
}: {
  searchParams: SearchParams
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>
  activeOrders: string[]
  setActiveOrders: React.Dispatch<React.SetStateAction<string[]>>
  stockSites: any
  sitesLoading: boolean
  stockInfo: any
  infoLoading: boolean
  infoError: any
  createOrderMutation: any
  downloadLinkMutation: any
  handleSearch: (e: React.FormEvent) => void
  handleCreateOrder: () => void
}) {
  return (
    <div className="space-y-8">
      {/* Search Form */}
      <div className="bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Error: {infoError.message}
          </p>
        </div>
      )}

      {stockInfo && (
        <div className="bg-white/60 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden">
          <div className="md:flex">
            {/* Media Preview */}
            <div className="md:w-1/3 p-6">
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={stockInfo.url}
                  alt={stockInfo.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>

            {/* Media Details */}
            <div className="md:w-2/3 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{stockInfo.title}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm font-medium text-gray-500">Source:</span>
                  <p className="text-lg text-gray-900">{stockInfo.site.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Cost:</span>
                  <p className="text-lg text-gray-900">${stockInfo.pricing.price}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Author:</span>
                  <p className="text-lg text-gray-900">{stockInfo.contributor.name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">File Size:</span>
                  <p className="text-lg text-gray-900">{stockInfo.metadata.file_size_mb ? `${stockInfo.metadata.file_size_mb} MB` : 'N/A'}</p>
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
        <div className="bg-white/60 backdrop-blur-md rounded-lg border border-white/20 p-6">
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
      if (result.url) {
        window.open(result.url, '_blank')
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
              orderStatus.status === 'completed' ? 'text-green-600' : 
              orderStatus.status === 'processing' ? 'text-blue-600' : 'text-red-600'
            }`}>
              {orderStatus.status}
            </span>
          </p>
        </div>
        
        {orderStatus.status === 'completed' && (
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
