'use client'
import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/components/auth/AuthProvider'
import { useStockSites } from '@/hooks/useStockMedia'
import { useBatchStockInfo, useBatchStockOrder } from '@/hooks/useBatchStockInfo'
import { parseInputLines, getInputStats, ParsedStockInput } from '@/lib/stock-parse'
import { StockSiteCard, StockSitesGrid } from './StockSiteCard'
import { PageLayout } from '@/components/layout/PageLayout'

interface BatchStockSearchProps {
  className?: string
}

export function BatchStockSearch({ className = '' }: BatchStockSearchProps) {
  const { user } = useAuth()
  const [inputText, setInputText] = useState('')
  const [showSites, setShowSites] = useState(false)
  
  // Get available stock sites
  const { data: stockSites, isLoading: sitesLoading } = useStockSites()
  
  // Parse input lines
  const parsedInputs = useMemo(() => {
    return parseInputLines(inputText, stockSites)
  }, [inputText, stockSites])
  
  // Get input statistics
  const inputStats = useMemo(() => {
    return getInputStats(parsedInputs)
  }, [parsedInputs])
  
  // Batch stock info hook
  const batchStockInfo = useBatchStockInfo(parsedInputs, {
    enabled: parsedInputs.length > 0 && !!user
  })
  
  // Batch order hook
  const { createBatchOrder } = useBatchStockOrder()
  
  // Handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
  }, [])
  
  const handleClearInput = useCallback(() => {
    setInputText('')
  }, [])
  
  const handleCreateBatchOrder = useCallback(async () => {
    if (!batchStockInfo.data) return
    
    try {
      await createBatchOrder(batchStockInfo.data)
    } catch (error) {
      console.error('Batch order creation failed:', error)
    }
  }, [batchStockInfo.data, createBatchOrder])
  
  const handleAddExample = useCallback(() => {
    const examples = [
      'https://www.shutterstock.com/image-photo/beautiful-landscape-mountain-lake-1234567890',
      'istockphoto:gm1234567890',
      'https://unsplash.com/photos/abc123def456',
      '1234567890', // Shutterstock ID
      'https://www.pexels.com/photo/example-1234567/'
    ]
    
    setInputText(examples.join('\n'))
  }, [])

  if (!user) {
    return (
      <PageLayout
        title="Batch Stock Search"
        subtitle="Search and order multiple stock media items at once"
        requiresAuth={true}
      />
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Batch Stock Search
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Paste multiple stock URLs, IDs, or use the format <code>site:id</code> to search and order 
          multiple stock media items at once.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
            Input Stock Items
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleAddExample}
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Examples
            </button>
            <button
              onClick={handleClearInput}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Clear
            </button>
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder={`Paste your stock URLs or IDs here, one per line:

Examples:
https://www.shutterstock.com/image-photo/beautiful-landscape-1234567890
istockphoto:gm1234567890
https://unsplash.com/photos/abc123def456
1234567890
https://www.pexels.com/photo/example-1234567/`}
          className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />

        {/* Input Statistics */}
        {parsedInputs.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex space-x-4">
                <span className="text-gray-600">
                  Total: <span className="font-medium text-gray-900">{inputStats.total}</span>
                </span>
                <span className="text-green-600">
                  Valid: <span className="font-medium">{inputStats.valid}</span>
                </span>
                <span className="text-red-600">
                  Invalid: <span className="font-medium">{inputStats.invalid}</span>
                </span>
              </div>
              {Object.keys(inputStats.siteBreakdown).length > 0 && (
                <div className="text-gray-600">
                  Sites: {Object.entries(inputStats.siteBreakdown)
                    .map(([site, count]) => `${site} (${count})`)
                    .join(', ')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stock Sites Section */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Available Stock Sites
          </h2>
          <button
            onClick={() => setShowSites(!showSites)}
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            {showSites ? 'Hide' : 'Show'} Sites
          </button>
        </div>

        <AnimatePresence>
          {showSites && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {sitesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading stock sites...</p>
                </div>
              ) : stockSites ? (
                <StockSitesGrid sites={stockSites} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No stock sites available</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Section */}
      {parsedInputs.length > 0 && (
        <div className="bg-white/60 backdrop-blur-md rounded-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Search Results
            </h2>
            {batchStockInfo.stats.success > 0 && (
              <button
                onClick={handleCreateBatchOrder}
                disabled={batchStockInfo.isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                Order All ({batchStockInfo.stats.success})
              </button>
            )}
          </div>

          {/* Results Grid */}
          <div className="space-y-4">
            {parsedInputs.map((input, index) => {
              const result = batchStockInfo.data?.[index]
              if (!result) return null

              return (
                <motion.div
                  key={input.raw}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 bg-white/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {input.site}:{input.id}
                        </span>
                        {result.isLoading && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                        )}
                        {result.isSuccess && (
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        )}
                        {result.error && (
                          <XCircleIcon className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate">
                        {input.raw}
                      </p>
                      
                      {result.error && (
                        <p className="text-sm text-red-600 mt-1">
                          {result.error.message}
                        </p>
                      )}
                      
                      {result.data && (
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>${result.data.pricing?.price || 'N/A'}</span>
                          <span>{result.data.title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {batchStockInfo.stats.total}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {batchStockInfo.stats.success}
                </div>
                <div className="text-sm text-gray-500">Found</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {batchStockInfo.stats.errors}
                </div>
                <div className="text-sm text-gray-500">Errors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  ${batchStockInfo.getTotalCost().toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">Total Cost</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
