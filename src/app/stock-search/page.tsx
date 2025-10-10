'use client'
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { 
  useStockSites, 
  useUserBalance 
} from '@/hooks/useStockMedia'
import { useBatchStockInfo, useBatchStockOrder } from '@/hooks/useBatchStockInfo'
import { parseInputLines, getInputStats } from '@/lib/stock-parse'
import { StockSitesGrid, StockSitesGridSkeleton } from '@/components/stock-search/StockSiteCard'
import { BatchSearchResults, BatchSearchResultsSkeleton } from '@/components/stock-search/BatchSearchResults'
import { useToastHelpers } from '@/components/ui/Toast'
import { 
  MagnifyingGlassIcon, 
  ExclamationCircleIcon,
  DocumentTextIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function StockSearchPage() {
  const { user } = useAuth()
  const { success, error: showError } = useToastHelpers()
  
  // State management
  const [input, setInput] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  
  // API hooks
  const { data: stockSites, isLoading: sitesLoading, error: sitesError } = useStockSites()
  const { data: userBalance } = useUserBalance()
  const { createBatchOrder } = useBatchStockOrder()

  // Parse input lines
  const parsedInputs = useMemo(() => {
    return parseInputLines(input, stockSites)
  }, [input, stockSites])

  // Input statistics
  const inputStats = useMemo(() => {
    return getInputStats(parsedInputs)
  }, [parsedInputs])

  // Batch info fetching
  const {
    data: batchResults = [],
    isLoading: resultsLoading,
    refetch: refetchResults,
    stats: resultsStats
  } = useBatchStockInfo(parsedInputs, {
    enabled: hasSearched && parsedInputs.length > 0
  })

  // Handle form submission
  const handleCheckFiles = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim()) {
      showError('Empty Input', 'Please enter some URLs or IDs to search.')
      return
    }

    if (inputStats.valid === 0) {
      showError('No Valid Inputs', 'Please enter valid stock media URLs or IDs.')
      return
    }

    setHasSearched(true)
    refetchResults()
  }

  // Handle bulk order
  const handleBulkOrder = async () => {
    const validResults = batchResults.filter(r => r.isSuccess && r.data)
    
    if (validResults.length === 0) {
      showError('No Items to Order', 'No valid items available for ordering.')
      return
    }

    const totalCost = validResults.reduce((sum, r) => sum + (r.data?.cost || 0), 0)
    
    if (userBalance && userBalance.balance < totalCost) {
      showError('Insufficient Balance', `You need $${totalCost.toFixed(2)} but have $${userBalance.balance.toFixed(2)}.`)
      return
    }

    try {
      await createBatchOrder(validResults)
    } catch (error: any) {
      showError('Bulk Order Failed', error.message || 'Failed to create bulk order.')
    }
  }

  // Check for missing environment variables
  const hasEnvIssues = !process.env.NEXT_PUBLIC_NEHTW_API_KEY || !process.env.NEXT_PUBLIC_NEHTW_BASE_URL

  // Allow demo access or require authentication
  const hasDemoUser = typeof window !== 'undefined' && localStorage.getItem('demo_user') === 'true'
  
  if (!user && !hasDemoUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <SparklesIcon className="h-12 w-12 mx-auto text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please sign in to access the stock search feature.</p>
          <button 
            onClick={() => {
              localStorage.setItem('demo_user', 'true')
              window.location.reload()
            }}
            className="button-primary"
          >
            Try Demo Mode
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8 px-4">
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-orange-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      
      <div className="max-w-7xl mx-auto space-y-8" id="main-content">
        
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Batch Stock Search
          </h1>
          <p className="text-lg text-gray-600">
            Check and order stock assets from multiple sources with one action
          </p>
          {userBalance && (
            <p className="text-sm text-gray-500 mt-1">
              Available Balance: <span className="font-semibold text-purple-600">
                ${userBalance.balance.toFixed(2)}
              </span>
            </p>
          )}
        </motion.header>

        {/* Environment Warning */}
        {hasEnvIssues && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="status-warning p-4 rounded-xl"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              <div>
                <strong>Configuration Issue:</strong> NEHTW API credentials are missing. 
                Stock search functionality will be limited.
              </div>
            </div>
          </motion.div>
        )}

        {/* Stock Sites Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Available Stock Sources</h2>
              <div className="flex items-center space-x-2">
                <span className="status-success text-xs px-2 py-1 rounded-full">
                  {stockSites && Object.values(stockSites).filter(s => s.active).length} Active
                </span>
                <span className="text-sm text-gray-500">
                  {stockSites && Object.values(stockSites).length} Total Sources
                </span>
              </div>
            </div>
            
            {sitesError ? (
              <div className="text-center py-8">
                <div className="status-error inline-flex items-center px-4 py-2 rounded-lg mb-4">
                  <ExclamationCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  <span className="font-medium">Failed to Load Stock Sources</span>
                </div>
                <p className="text-gray-600">{sitesError.message}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="button-secondary mt-4"
                >
                  Retry
                </button>
              </div>
            ) : sitesLoading ? (
              <StockSitesGridSkeleton />
            ) : stockSites ? (
              <StockSitesGrid sites={stockSites} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" aria-hidden="true" />
                <p className="text-lg font-medium">No stock sources available</p>
                <p className="text-sm">Please check your configuration or try again later.</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Input Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleCheckFiles} className="glass-card p-6">
            <div className="mb-4">
              <label htmlFor="batch-input" className="block text-lg font-semibold text-gray-900 mb-2">
                Enter Stock Media URLs or IDs
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Paste image URLs or IDs, one per line. We support Shutterstock, iStock, Adobe Stock, and more.
              </p>
              
              <textarea
                id="batch-input"
                rows={8}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`https://www.shutterstock.com/image-photo/beautiful-sunset-landscape-123456789
https://www.istockphoto.com/photo/example-gm987654321
adobe:555666777
1234567890`}
                className="form-textarea w-full font-mono text-sm resize-vertical focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={resultsLoading}
                aria-describedby="input-help"
              />
              
              {/* Input Statistics */}
              {input.trim() && (
                <div className="mt-3 flex items-center space-x-6 text-sm">
                  <span className="text-gray-600">
                    Total: <span className="font-medium">{inputStats.total}</span>
                  </span>
                  <span className="text-green-600">
                    Valid: <span className="font-medium">{inputStats.valid}</span>
                  </span>
                  {inputStats.invalid > 0 && (
                    <span className="text-red-600">
                      Invalid: <span className="font-medium">{inputStats.invalid}</span>
                    </span>
                  )}
                  
                  {/* Site Breakdown */}
                  {Object.entries(inputStats.siteBreakdown).length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Sites:</span>
                      {Object.entries(inputStats.siteBreakdown).map(([site, count]) => (
                        <span key={site} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {site}: {count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <motion.button
                type="submit"
                disabled={!input.trim() || inputStats.valid === 0 || resultsLoading || sitesLoading}
                className="button-primary inline-flex items-center px-8 py-3 text-base font-semibold text-white rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-describedby="submit-help"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                {resultsLoading ? 'Checking Files...' : 'Check Files'}
              </motion.button>
            </div>
            
            {/* Help Text */}
            <p id="input-help" className="text-xs text-gray-500 mt-2 text-center">
              Enter one URL or ID per line. Supported formats: URLs, numeric IDs, or site:id format.
            </p>
          </form>
        </motion.section>

        {/* Results Section */}
        {hasSearched && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Search Results</h2>
              
              {resultsStats.success > 0 && (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {resultsStats.success} items found
                  </span>
                  <button
                    onClick={handleBulkOrder}
                    disabled={!userBalance || resultsStats.success === 0}
                    className="button-success inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    aria-describedby="bulk-order-help"
                  >
                    Order All Valid Items
                  </button>
                </div>
              )}
            </div>
            
            {/* Bulk Order Help */}
            {resultsStats.success > 0 && (
              <p id="bulk-order-help" className="text-xs text-gray-500 mb-4">
                Order all valid items at once. Individual items can also be ordered separately.
              </p>
            )}
            
            {resultsLoading ? (
              <BatchSearchResultsSkeleton />
            ) : (
              <BatchSearchResults
                results={batchResults}
                isLoading={resultsLoading}
                userBalance={userBalance?.balance || 0}
                onOrder={(result) => {
                  // Handle individual order
                  console.log('Order individual item:', result)
                }}
                onViewOriginal={(result) => {
                  if (result.input.url) {
                    window.open(result.input.url, '_blank')
                  }
                }}
                onRemove={(result) => {
                  // Remove item from input
                  const lines = input.split('\n')
                  const filteredLines = lines.filter(line => line.trim() !== result.input.raw.trim())
                  setInput(filteredLines.join('\n'))
                }}
              />
            )}
          </motion.section>
        )}
      </div>
    </div>
  )
}

