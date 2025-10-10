'use client'
import { useState, useMemo } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useUserOrders, UnifiedOrder } from '@/hooks/useOrderManagement'
import { PageLayout } from '@/components/layout/PageLayout'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CloudArrowDownIcon,
  EyeIcon,
  FolderIcon,
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface DownloadFilters {
  type?: 'image' | 'video' | 'document'
  orderType?: 'stock' | 'ai'
  search: string
  dateRange?: { start: string; end: string }
}

export default function DownloadsPage() {
  const { user } = useUser()
  const [filters, setFilters] = useState<DownloadFilters>({
    search: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFile, setSelectedFile] = useState<{
    id: string
    name: string
    url: string
    thumbnailUrl?: string
    size?: number
    type: 'image' | 'video' | 'document'
    format: string
    downloadCount: number
    lastDownloaded?: string
    orderId: string
    orderType: 'stock' | 'ai'
    orderTitle: string
    orderCreatedAt: string
  } | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'downloads'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  const { data: orders = [], isLoading } = useUserOrders()

  // Bulk download handler
  const handleBulkDownload = () => {
    const selectedFilesData = filteredFiles.filter(file => selectedFiles.includes(file.id))
    selectedFilesData.forEach(file => {
      handleDownload(file)
    })
    setSelectedFiles([])
  }

  // Toggle file selection
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  // Select all files
  const selectAllFiles = () => {
    setSelectedFiles(filteredFiles.map(file => file.id))
  }

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedFiles([])
  }

  // Extract all files from completed orders
  const allFiles = useMemo(() => {
    return orders
      .filter((order: UnifiedOrder) => order.status === 'completed' && order.files)
      .flatMap((order: UnifiedOrder) => 
        order.files!.map((file: {
          id: string
          name: string
          url: string
          thumbnailUrl?: string
          size?: number
          type: 'image' | 'video' | 'document'
          format: string
          downloadCount: number
          lastDownloaded?: string
        }) => ({
          ...file,
          orderId: order.id,
          orderType: order.type,
          orderTitle: order.title,
          orderCreatedAt: order.createdAt,
        }))
      )
  }, [orders])

  // Apply filters and sorting
  const filteredFiles = useMemo(() => {
    let files = allFiles

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      files = files.filter((file: typeof files[0]) => 
        file.name.toLowerCase().includes(searchTerm) ||
        file.orderTitle.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.type) {
      files = files.filter((file: typeof files[0]) => file.type === filters.type)
    }

    if (filters.orderType) {
      files = files.filter((file: typeof files[0]) => file.orderType === filters.orderType)
    }

    if (filters.dateRange) {
      files = files.filter((file: typeof files[0]) => {
        const fileDate = new Date(file.orderCreatedAt)
        return fileDate >= new Date(filters.dateRange!.start) && 
               fileDate <= new Date(filters.dateRange!.end)
      })
    }

    // Apply sorting
    files.sort((a: typeof files[0], b: typeof files[0]) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'date':
          comparison = new Date(a.orderCreatedAt).getTime() - new Date(b.orderCreatedAt).getTime()
          break
        case 'size':
          comparison = (a.size || 0) - (b.size || 0)
          break
        case 'downloads':
          comparison = a.downloadCount - b.downloadCount
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return files
  }, [allFiles, filters, sortBy, sortOrder])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalFiles = allFiles.length
    const totalDownloads = allFiles.reduce((sum: number, file: typeof allFiles[0]) => sum + file.downloadCount, 0)
    const totalSize = allFiles.reduce((sum: number, file: typeof allFiles[0]) => sum + (file.size || 0), 0)
    const recentDownloads = allFiles
      .filter((file: typeof allFiles[0]) => file.lastDownloaded)
      .sort((a: typeof allFiles[0], b: typeof allFiles[0]) => new Date(b.lastDownloaded!).getTime() - new Date(a.lastDownloaded!).getTime())
      .slice(0, 5)

    return { totalFiles, totalDownloads, totalSize, recentDownloads }
  }, [allFiles])

  if (!user) {
    return (
      <PageLayout requiresAuth title="Downloads" subtitle="Manage your downloaded files">
        <div className="text-center">Please sign in to view your downloads.</div>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      title="Download Center"
      subtitle="Manage and organize your downloaded files"
      className="bg-gradient-to-br from-gray-50 to-green-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Files"
            value={stats.totalFiles}
            icon={FolderIcon}
            color="blue"
          />
          <StatCard
            title="Total Downloads"
            value={stats.totalDownloads}
            icon={CloudArrowDownIcon}
            color="green"
          />
          <StatCard
            title="Total Size"
            value={formatFileSize(stats.totalSize)}
            icon={DocumentIcon}
            color="purple"
          />
          <StatCard
            title="Recent Downloads"
            value={stats.recentDownloads.length}
            icon={ClockIcon}
            color="orange"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search files by name or order..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80"
              />
            </div>

            {/* Bulk Actions */}
            {selectedFiles.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedFiles.length} selected
                </span>
                <button
                  onClick={handleBulkDownload}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CloudArrowDownIcon className="h-4 w-4 mr-2" />
                  Download Selected
                </button>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg transition-colors ${
                showFilters ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200/50"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* File Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      File Type
                    </label>
                    <select
                      value={filters.type || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        type: e.target.value as 'image' | 'video' | 'document' | undefined 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="">All Types</option>
                      <option value="image">Images</option>
                      <option value="video">Videos</option>
                      <option value="document">Documents</option>
                    </select>
                  </div>

                  {/* Order Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source
                    </label>
                    <select
                      value={filters.orderType || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        orderType: e.target.value as 'stock' | 'ai' | undefined 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="">All Sources</option>
                      <option value="stock">Stock Media</option>
                      <option value="ai">AI Generation</option>
                    </select>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                      <option value="">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setFilters({ search: '' })}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear all filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Files Grid */}
        {isLoading ? (
          <FilesGridSkeleton />
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Files Found</h3>
            <p className="text-gray-500 mb-4">
              {filters.search || filters.type || filters.orderType 
                ? "Try adjusting your filters to see more results."
                : "You haven't downloaded any files yet."
              }
            </p>
            {!filters.search && !filters.type && !filters.orderType && (
              <div className="space-x-4">
                <button
                  onClick={() => window.location.href = '/stock-search'}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <PhotoIcon className="h-4 w-4 mr-2" />
                  Browse Stock Media
                </button>
                <button
                  onClick={() => window.location.href = '/ai-generation'}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Generate AI Images
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Select All Controls */}
            {filteredFiles.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={selectAllFiles}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Select All ({filteredFiles.length})
                  </button>
                  <button
                    onClick={clearAllSelections}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear Selection
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {selectedFiles.length} of {filteredFiles.length} selected
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredFiles.map((file: typeof filteredFiles[0]) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    isSelected={selectedFiles.includes(file.id)}
                    onView={() => setSelectedFile(file)}
                    onDownload={() => handleDownload(file)}
                    onToggleSelection={() => toggleFileSelection(file.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* File Preview Modal */}
      {selectedFile && (
        <FilePreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDownload={() => handleDownload(selectedFile)}
        />
      )}
    </PageLayout>
  )
}

// Statistics Card Component
function StatCard({ title, value, icon: Icon, color }: {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}

// File Card Component
function FileCard({ file, isSelected, onView, onDownload, onToggleSelection }: {
  file: {
    id: string
    name: string
    url: string
    thumbnailUrl?: string
    size?: number
    type: 'image' | 'video' | 'document'
    format: string
    downloadCount: number
    lastDownloaded?: string
    orderId: string
    orderType: 'stock' | 'ai'
    orderTitle: string
    orderCreatedAt: string
  }
  isSelected: boolean
  onView: () => void
  onDownload: () => void
  onToggleSelection: () => void
}) {
  const getFileIcon = (type: 'image' | 'video' | 'document') => {
    switch (type) {
      case 'image':
        return PhotoIcon
      case 'video':
        return VideoCameraIcon
      default:
        return DocumentIcon
    }
  }

  const FileIcon = getFileIcon(file.type)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white/60 backdrop-blur-md rounded-xl shadow-lg border overflow-hidden group cursor-pointer ${
        isSelected ? 'border-green-500 ring-2 ring-green-200' : 'border-white/20'
      }`}
      onClick={onToggleSelection}
    >
      {/* File Preview */}
      <div className="aspect-square relative bg-gray-100">
        {file.thumbnailUrl ? (
          <Image
            src={file.thumbnailUrl}
            alt={file.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <FileIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Selection Checkbox */}
        <div className="absolute top-2 right-2">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isSelected 
              ? 'bg-green-500 border-green-500' 
              : 'bg-white/80 border-white'
          }`}>
            {isSelected && (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onView()
            }}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDownload()
            }}
            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            <CloudArrowDownIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Order Type Badge */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            file.orderType === 'ai' 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {file.orderType === 'ai' ? (
              <SparklesIcon className="h-3 w-3 mr-1" />
            ) : (
              <PhotoIcon className="h-3 w-3 mr-1" />
            )}
            {file.orderType === 'ai' ? 'AI' : 'Stock'}
          </span>
        </div>
      </div>

      {/* File Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate mb-1">{file.name}</h3>
        <p className="text-sm text-gray-500 truncate mb-2">{file.orderTitle}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{formatFileSize(file.size || 0)}</span>
          <span>{file.downloadCount} downloads</span>
        </div>
      </div>
    </motion.div>
  )
}

// File Preview Modal Component
function FilePreviewModal({ file, onClose, onDownload }: {
  file: {
    id: string
    name: string
    url: string
    thumbnailUrl?: string
    size?: number
    type: 'image' | 'video' | 'document'
    format: string
    downloadCount: number
    lastDownloaded?: string
    orderId: string
    orderType: 'stock' | 'ai'
    orderTitle: string
    orderCreatedAt: string
  }
  onClose: () => void
  onDownload: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">File Preview</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* File Preview */}
          <div className="mb-6">
            {file.thumbnailUrl ? (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={file.thumbnailUrl}
                  alt={file.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <DocumentIcon className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* File Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">File Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm text-gray-900">{file.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="text-sm text-gray-900 capitalize">{file.type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Size</dt>
                  <dd className="text-sm text-gray-900">{formatFileSize(file.size || 0)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Format</dt>
                  <dd className="text-sm text-gray-900 uppercase">{file.format}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Downloads</dt>
                  <dd className="text-sm text-gray-900">{file.downloadCount}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd className="text-sm text-gray-900 font-mono">{file.orderId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Source</dt>
                  <dd className="text-sm text-gray-900 capitalize">{file.orderType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order Title</dt>
                  <dd className="text-sm text-gray-900">{file.orderTitle}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(file.orderCreatedAt).toLocaleString()}
                  </dd>
                </div>
                {file.lastDownloaded && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Downloaded</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(file.lastDownloaded).toLocaleString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onDownload()
              onClose()
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <CloudArrowDownIcon className="h-4 w-4 inline mr-2" />
            Download
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// Files Grid Skeleton Component
function FilesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Helper functions
function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function handleDownload(file: {
  id: string
  name: string
  url: string
  thumbnailUrl?: string
  size?: number
  type: 'image' | 'video' | 'document'
  format: string
  downloadCount: number
  lastDownloaded?: string
  orderId: string
  orderType: 'stock' | 'ai'
  orderTitle: string
  orderCreatedAt: string
}) {
  // In a real app, this would generate a download link
  // For now, just open the file URL
  if (file.url) {
    window.open(file.url, '_blank')
  }
}
