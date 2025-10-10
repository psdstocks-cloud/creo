'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  ClockIcon,
  CloudArrowDownIcon,
  ShoppingCartIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  PhotoIcon,
  DocumentIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { BatchStockInfoResult } from '@/hooks/useBatchStockInfo'
import { ParsedStockInput } from '@/lib/stock-parse'

export interface BatchSearchResultsProps {
  results: BatchStockInfoResult[]
  isLoading?: boolean
  onOrder?: (result: BatchStockInfoResult) => void
  onDownload?: (result: BatchStockInfoResult) => void
  onViewOriginal?: (result: BatchStockInfoResult) => void
  onRemove?: (result: BatchStockInfoResult) => void
  userBalance?: number
  className?: string
}

export function BatchSearchResults({
  results,
  isLoading = false,
  onOrder,
  onDownload, 
  onViewOriginal,
  onRemove,
  userBalance = 0,
  className = ''
}: BatchSearchResultsProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  
  // Calculate summary statistics
  const stats = useMemo(() => {
    const total = results.length
    const loading = results.filter(r => r.isLoading).length
    const success = results.filter(r => r.isSuccess && r.data).length
    const errors = results.filter(r => r.error).length
    const totalCost = results
      .filter(r => r.isSuccess && r.data)
      .reduce((sum, r) => sum + (r.data?.cost || 0), 0)
    
    return { total, loading, success, errors, totalCost }
  }, [results])

  // Handle row selection
  const toggleSelection = (inputRaw: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(inputRaw)) {
      newSelected.delete(inputRaw)
    } else {
      newSelected.add(inputRaw)
    }
    setSelectedItems(newSelected)
  }

  const selectAll = () => {
    const validInputs = results
      .filter(r => r.isSuccess && r.data)
      .map(r => r.input.raw)
    setSelectedItems(new Set(validInputs))
  }

  const clearSelection = () => {
    setSelectedItems(new Set())
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <DocumentIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">No results to display</p>
        <p className="text-sm">Enter URLs or IDs above and click "Check Files" to get started.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Header */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Statistics */}
          <div className="flex flex-wrap gap-6">
            <StatItem 
              label="Total" 
              value={stats.total} 
              color="text-gray-700"
            />
            <StatItem 
              label="Success" 
              value={stats.success} 
              color="text-green-600"
            />
            <StatItem 
              label="Errors" 
              value={stats.errors} 
              color="text-red-600"
            />
            {stats.loading > 0 && (
              <StatItem 
                label="Loading" 
                value={stats.loading} 
                color="text-blue-600"
              />
            )}
            <StatItem 
              label="Total Cost" 
              value={`$${stats.totalCost.toFixed(2)}`} 
              color="text-purple-600"
            />
          </div>

          {/* Bulk Actions */}
          {stats.success > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={selectedItems.size === stats.success ? clearSelection : selectAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {selectedItems.size === stats.success ? 'Clear All' : 'Select All'}
              </button>
              
              {selectedItems.size > 0 && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-600">
                    {selectedItems.size} selected
                  </span>
                  
                  <button
                    onClick={() => {/* Handle bulk order */}}
                    disabled={userBalance < stats.totalCost}
                    className="ml-4 inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg hover:from-orange-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-1" />
                    Order Selected
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Balance Warning */}
        {userBalance < stats.totalCost && stats.success > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-sm text-amber-800">
                Insufficient balance. You need ${stats.totalCost.toFixed(2)} but have ${userBalance.toFixed(2)}.
                <a href="/billing" className="ml-1 text-amber-900 underline hover:text-amber-700">
                  Add credits
                </a>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Results List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {results.map((result, index) => (
            <ResultRow
              key={result.input.raw}
              result={result}
              index={index}
              isSelected={selectedItems.has(result.input.raw)}
              onToggleSelection={() => toggleSelection(result.input.raw)}
              onOrder={onOrder}
              onDownload={onDownload}
              onViewOriginal={onViewOriginal}
              onRemove={onRemove}
              userBalance={userBalance}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Individual result row component
function ResultRow({
  result,
  index,
  isSelected,
  onToggleSelection,
  onOrder,
  onDownload,
  onViewOriginal,
  onRemove,
  userBalance = 0
}: {
  result: BatchStockInfoResult
  index: number
  isSelected: boolean
  onToggleSelection: () => void
  onOrder?: (result: BatchStockInfoResult) => void
  onDownload?: (result: BatchStockInfoResult) => void
  onViewOriginal?: (result: BatchStockInfoResult) => void
  onRemove?: (result: BatchStockInfoResult) => void
  userBalance: number
}) {
  const { input, data, isLoading, error, isSuccess } = result
  
  // Determine row status and styling
  const getStatusConfig = () => {
    if (isLoading) {
      return {
        icon: ClockIcon,
        color: 'text-blue-600 bg-blue-100',
        label: 'Loading...',
        bgColor: 'bg-blue-50/50'
      }
    }
    
    if (error) {
      return {
        icon: ExclamationCircleIcon,
        color: 'text-red-600 bg-red-100',
        label: 'Error',
        bgColor: 'bg-red-50/50'
      }
    }
    
    if (isSuccess && data) {
      return {
        icon: CheckCircleIcon,
        color: 'text-green-600 bg-green-100',
        label: 'Success',
        bgColor: 'bg-green-50/50'
      }
    }
    
    return {
      icon: XMarkIcon,
      color: 'text-gray-600 bg-gray-100',
      label: 'Invalid',
      bgColor: 'bg-gray-50/50'
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon
  const canOrder = isSuccess && data && userBalance >= (data.cost || 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`
        relative overflow-hidden rounded-xl border border-white/20 
        bg-white/60 backdrop-blur-md shadow-lg
        transition-all duration-200 hover:shadow-xl
        ${isSelected ? 'ring-2 ring-orange-500/50' : ''}
        ${statusConfig.bgColor}
      `}
    >
      <div className="p-4">
        <div className="flex items-start space-x-4">
          {/* Selection Checkbox */}
          {isSuccess && data && (
            <div className="flex-shrink-0 mt-1">
              <button
                onClick={onToggleSelection}
                className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                  ${isSelected 
                    ? 'bg-orange-500 border-orange-500' 
                    : 'border-gray-300 hover:border-orange-400'
                  }
                `}
              >
                {isSelected && <CheckCircleIcon className="h-3 w-3 text-white" />}
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Left: Input and Site Info */}
              <div className="flex-1 min-w-0">
                {/* Original Input */}
                <div className="mb-2">
                  <p className="text-sm font-mono text-gray-600 truncate" title={input.raw}>
                    {input.raw}
                  </p>
                </div>

                {/* Parsed Site Badge */}
                {input.site && (
                  <div className="flex items-center space-x-2 mb-2">
                    <SiteBadge site={input.site} />
                    <span className="text-xs text-gray-500">ID: {input.id}</span>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig.label}
                  </span>
                  
                  {data?.cost && (
                    <span className="text-sm font-semibold text-gray-900">
                      ${data.cost.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <p className="text-sm text-red-600 mt-1">
                    {error.message || 'Unknown error'}
                  </p>
                )}
              </div>

              {/* Right: Preview and Actions */}
              {isSuccess && data && (
                <div className="flex items-start space-x-4">
                  {/* Preview Thumbnail */}
                  {data.image && (
                    <div className="w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={data.image}
                        alt={data.title || 'Preview'}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    {onOrder && (
                      <button
                        onClick={() => onOrder(result)}
                        disabled={!canOrder}
                        className={`
                          inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                          ${canOrder
                            ? 'text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                            : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                          }
                        `}
                      >
                        <ShoppingCartIcon className="h-3 w-3 mr-1" />
                        Order
                      </button>
                    )}

                    <div className="flex space-x-1">
                      {onViewOriginal && input.url && (
                        <button
                          onClick={() => onViewOriginal(result)}
                          className="inline-flex items-center p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View original"
                        >
                          <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                        </button>
                      )}

                      {data.image && (
                        <button
                          onClick={() => window.open(data.image, '_blank')}
                          className="inline-flex items-center p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                          title="Preview image"
                        >
                          <EyeIcon className="h-3 w-3" />
                        </button>
                      )}

                      {onRemove && (
                        <button
                          onClick={() => onRemove(result)}
                          className="inline-flex items-center p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove from list"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info for Success Cases */}
            {isSuccess && data && data.title && (
              <div className="mt-3 p-3 bg-white/40 rounded-lg">
                <h4 className="font-medium text-gray-900 text-sm mb-1">{data.title}</h4>
                {data.author && (
                  <p className="text-xs text-gray-600">by {data.author}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex items-center justify-center">
          <div className="flex items-center space-x-2 text-blue-600">
            <ClockIcon className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Loading...</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Helper components
function StatItem({ 
  label, 
  value, 
  color = 'text-gray-700' 
}: { 
  label: string
  value: string | number
  color?: string 
}) {
  return (
    <div className="text-center">
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}

function SiteBadge({ site }: { site: string }) {
  // Site-specific styling
  const siteConfig = {
    shutterstock: { bg: 'bg-red-100 text-red-800', name: 'Shutterstock' },
    istockphoto: { bg: 'bg-green-100 text-green-800', name: 'iStock' },
    adobestock: { bg: 'bg-purple-100 text-purple-800', name: 'Adobe Stock' },
    dreamstime: { bg: 'bg-orange-100 text-orange-800', name: 'Dreamstime' },
    alamy: { bg: 'bg-teal-100 text-teal-800', name: 'Alamy' },
    freepik: { bg: 'bg-indigo-100 text-indigo-800', name: 'Freepik' },
    unsplash: { bg: 'bg-gray-100 text-gray-800', name: 'Unsplash' },
    pexels: { bg: 'bg-blue-100 text-blue-800', name: 'Pexels' },
    pixabay: { bg: 'bg-yellow-100 text-yellow-800', name: 'Pixabay' },
    gettyimages: { bg: 'bg-black text-white', name: 'Getty Images' }
  }

  const config = siteConfig[site as keyof typeof siteConfig] || { 
    bg: 'bg-gray-100 text-gray-800', 
    name: site.charAt(0).toUpperCase() + site.slice(1) 
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg}`}>
      {config.name}
    </span>
  )
}

// Loading skeleton
export function BatchSearchResultsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="rounded-xl border border-white/20 bg-white/60 backdrop-blur-md p-4 animate-pulse">
          <div className="flex items-start space-x-4">
            <div className="w-5 h-5 bg-gray-200 rounded" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-20" />
            </div>
            <div className="w-16 h-16 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}
