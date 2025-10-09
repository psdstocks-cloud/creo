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
  ClockIcon,
  Squares2X2Icon,
  Bars3Icon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
  XMarkIcon,
  ArchiveBoxIcon,
  TrashIcon,
  ShareIcon,
  StarIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface DownloadFilters {
  type?: 'image' | 'video' | 'document'
  orderType?: 'stock' | 'ai'
  search: string
  dateRange?: { start: string; end: string }
  tags?: string[]
}

export default function EnhancedDownloadsPage() {
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
    tags?: string[]
    isFavorite?: boolean
  } | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'downloads'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showPreview, setShowPreview] = useState(false)
  
  const { data: orders = [], isLoading } = useUserOrders()

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
          tags: [], // Mock tags
          isFavorite: false, // Mock favorite status
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
        file.orderTitle.toLowerCase().includes(searchTerm) ||
        file.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
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

    if (filters.tags && filters.tags.length > 0) {
      files = files.filter((file: typeof files[0]) => 
        filters.tags!.some(tag => file.tags?.includes(tag))
      )
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

  // Bulk operations
  const handleBulkDownload = () => {
    const selectedFileObjects = filteredFiles.filter(file => selectedFiles.includes(file.id))
    selectedFileObjects.forEach(file => {
      window.open(file.url, '_blank')
    })
    setSelectedFiles([])
  }

  const handleBulkDelete = () => {
    // Mock implementation - in real app, this would remove files from storage
    console.log('Bulk delete files:', selectedFiles)
    setSelectedFiles([])
  }

  const handleBulkFavorite = () => {
    // Mock implementation - toggle favorite status
    console.log('Bulk favorite files:', selectedFiles)
    setSelectedFiles([])
  }

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id))
    }
  }

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleDownload = (file: typeof filteredFiles[0]) => {
    window.open(file.url, '_blank')
    // Track download
    console.log('Downloaded file:', file.name)
  }

  const handlePreview = (file: typeof filteredFiles[0]) => {
    setSelectedFile(file)
    setShowPreview(true)
  }

  const handleFavorite = (fileId: string) => {
    // Mock implementation - toggle favorite status
    console.log('Toggle favorite for file:', fileId)
  }

  const handleShare = (file: typeof filteredFiles[0]) => {
    if (navigator.share) {
      navigator.share({
        title: file.name,
        url: file.url,
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(file.url)
      console.log('Link copied to clipboard')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return PhotoIcon
      case 'video':
        return VideoCameraIcon
      case 'document':
        return DocumentIcon
      default:
        return DocumentIcon
    }
  }

  if (!user) {
    return (
      <PageLayout requiresAuth title="Download Center" subtitle="Manage and organize your downloaded files">
        <div className="text-center py-12">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-500">Please sign in to view your downloads.</p>
        </div>
      </PageLayout>
    )
  }

  if (isLoading) {
    return <DownloadsLoadingSkeleton />
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

        {/* Enhanced Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg bg-white/60 backdrop-blur-md border border-white/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Bars3Icon className="h-4 w-4" />
              </button>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="downloads">Downloads</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sortOrder === 'asc' ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Bulk Actions */}
            {selectedFiles.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedFiles.length} selected</span>
                <button
                  onClick={handleBulkDownload}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Download Selected
                </button>
                <button
                  onClick={handleBulkFavorite}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                >
                  Favorite Selected
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  Delete Selected
                </button>
              </div>
            )}

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white/60 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/80 transition-colors"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                  <select
                    value={filters.type || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="document">Documents</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                  <select
                    value={filters.orderType || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, orderType: e.target.value as any || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Orders</option>
                    <option value="stock">Stock Media</option>
                    <option value="ai">AI Generation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                  <input
                    type="date"
                    value={filters.dateRange?.start || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dateRange: { 
                        ...prev.dateRange, 
                        start: e.target.value 
                      } 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                  <input
                    type="date"
                    value={filters.dateRange?.end || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dateRange: { 
                        ...prev.dateRange, 
                        end: e.target.value 
                      } 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Files List */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Select All</span>
                </button>
                <span className="text-sm text-gray-500">
                  {filteredFiles.length} files
                </span>
              </div>
            </div>
          </div>

          {/* Files Grid/List */}
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <FolderIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'p-6' : 'divide-y divide-gray-200/50'}>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      isSelected={selectedFiles.includes(file.id)}
                      onSelect={() => handleFileSelect(file.id)}
                      onDownload={() => handleDownload(file)}
                      onPreview={() => handlePreview(file)}
                      onFavorite={() => handleFavorite(file.id)}
                      onShare={() => handleShare(file)}
                    />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-200/50">
                  {filteredFiles.map((file) => (
                    <FileListItem
                      key={file.id}
                      file={file}
                      isSelected={selectedFiles.includes(file.id)}
                      onSelect={() => handleFileSelect(file.id)}
                      onDownload={() => handleDownload(file)}
                      onPreview={() => handlePreview(file)}
                      onFavorite={() => handleFavorite(file.id)}
                      onShare={() => handleShare(file)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* File Preview Modal */}
        <AnimatePresence>
          {showPreview && selectedFile && (
            <FilePreviewModal
              file={selectedFile}
              onClose={() => setShowPreview(false)}
              onDownload={() => handleDownload(selectedFile)}
              onShare={() => handleShare(selectedFile)}
            />
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  )
}

// ============================================================================
// Helper Components
// ============================================================================

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

function FileCard({ 
  file, 
  isSelected, 
  onSelect, 
  onDownload, 
  onPreview, 
  onFavorite, 
  onShare 
}: {
  file: any
  isSelected: boolean
  onSelect: () => void
  onDownload: () => void
  onPreview: () => void
  onFavorite: () => void
  onShare: () => void
}) {
  const FileIcon = getFileIcon(file.type)
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative bg-white/80 backdrop-blur-md rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'border-purple-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
      </div>

      {/* Favorite Button */}
      <button
        onClick={onFavorite}
        className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
      >
        <StarIcon className={`h-4 w-4 ${file.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
      </button>

      {/* File Preview */}
      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
        {file.thumbnailUrl ? (
          <Image
            src={file.thumbnailUrl}
            alt={file.name}
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate" title={file.name}>
          {file.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {file.type === 'image' ? 'Image' : file.type === 'video' ? 'Video' : 'Document'} • {file.format}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {file.size ? formatFileSize(file.size) : 'Unknown size'} • {file.downloadCount} downloads
        </p>
        
        {/* Order Info */}
        <div className="flex items-center mt-2 text-xs text-gray-500">
          {file.orderType === 'ai' ? (
            <SparklesIcon className="h-3 w-3 mr-1 text-purple-500" />
          ) : (
            <DocumentIcon className="h-3 w-3 mr-1 text-blue-500" />
          )}
          {file.orderTitle}
        </div>
      </div>

      {/* Actions */}
      <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onPreview}
          className="p-1 bg-white/80 backdrop-blur-sm rounded hover:bg-white transition-colors"
          title="Preview"
        >
          <EyeIcon className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={onDownload}
          className="p-1 bg-white/80 backdrop-blur-sm rounded hover:bg-white transition-colors"
          title="Download"
        >
          <CloudArrowDownIcon className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={onShare}
          className="p-1 bg-white/80 backdrop-blur-sm rounded hover:bg-white transition-colors"
          title="Share"
        >
          <ShareIcon className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </motion.div>
  )
}

function FileListItem({ 
  file, 
  isSelected, 
  onSelect, 
  onDownload, 
  onPreview, 
  onFavorite, 
  onShare 
}: {
  file: any
  isSelected: boolean
  onSelect: () => void
  onDownload: () => void
  onPreview: () => void
  onFavorite: () => void
  onShare: () => void
}) {
  const FileIcon = getFileIcon(file.type)
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center p-4 hover:bg-gray-50/50 transition-colors ${
        isSelected ? 'bg-purple-50/50' : ''
      }`}
    >
      {/* Selection Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-4"
      />

      {/* File Icon/Preview */}
      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-4">
        {file.thumbnailUrl ? (
          <Image
            src={file.thumbnailUrl}
            alt={file.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileIcon className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
          {file.isFavorite && (
            <StarIcon className="h-4 w-4 text-yellow-500 fill-current" />
          )}
        </div>
        <p className="text-sm text-gray-500">
          {file.type === 'image' ? 'Image' : file.type === 'video' ? 'Video' : 'Document'} • {file.format} • {file.size ? formatFileSize(file.size) : 'Unknown size'}
        </p>
        <div className="flex items-center mt-1 text-xs text-gray-400">
          {file.orderType === 'ai' ? (
            <SparklesIcon className="h-3 w-3 mr-1 text-purple-500" />
          ) : (
            <DocumentIcon className="h-3 w-3 mr-1 text-blue-500" />
          )}
          {file.orderTitle} • {file.downloadCount} downloads
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onFavorite}
          className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
          title="Favorite"
        >
          <StarIcon className={`h-4 w-4 ${file.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
        </button>
        <button
          onClick={onPreview}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Preview"
        >
          <EyeIcon className="h-4 w-4" />
        </button>
        <button
          onClick={onShare}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Share"
        >
          <ShareIcon className="h-4 w-4" />
        </button>
        <button
          onClick={onDownload}
          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
          title="Download"
        >
          <CloudArrowDownIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

function FilePreviewModal({ 
  file, 
  onClose, 
  onDownload, 
  onShare 
}: {
  file: any
  onClose: () => void
  onDownload: () => void
  onShare: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{file.name}</h2>
            <p className="text-sm text-gray-500">
              {file.type === 'image' ? 'Image' : file.type === 'video' ? 'Video' : 'Document'} • {file.format} • {file.size ? formatFileSize(file.size) : 'Unknown size'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {file.type === 'image' && file.thumbnailUrl ? (
            <div className="text-center">
              <Image
                src={file.thumbnailUrl}
                alt={file.name}
                width={800}
                height={600}
                className="max-w-full max-h-96 object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <DocumentIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500">Preview not available for this file type</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={onShare}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Share
            </button>
            <button
              onClick={onDownload}
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <CloudArrowDownIcon className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {file.downloadCount} downloads
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function DownloadsLoadingSkeleton() {
  return (
    <PageLayout title="Download Center" subtitle="Manage and organize your downloaded files">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

// Helper functions
function getFileIcon(type: string) {
  switch (type) {
    case 'image':
      return PhotoIcon
    case 'video':
      return VideoCameraIcon
    case 'document':
      return DocumentIcon
    default:
      return DocumentIcon
  }
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
