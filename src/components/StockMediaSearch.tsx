/**
 * StockMediaSearch Component
 * 
 * Comprehensive stock media search interface with debounced search,
 * site selection, results grid, preview modal, and cart functionality.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { 
  MagnifyingGlassIcon, 
  PhotoIcon,
  ShoppingCartIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useStockMediaSearchSimple } from '../hooks/useStockMediaSearchSimple';
import { useAuth } from '../contexts/AuthContext';

// ============================================================================
// Types and Interfaces
// ============================================================================

interface StockMediaItem {
  id: string;
  title: string;
  thumbnail: string;
  cost: number;
  filesize: string;
  site: string;
  tags: string[];
  dimensions: {
    width: number;
    height: number;
  };
  license: string;
  downloads?: number;
  rating?: number;
}

interface SearchFilters {
  site: string;
  minCost: number;
  maxCost: number;
  minWidth: number;
  minHeight: number;
  license: string;
  sortBy: 'relevance' | 'price' | 'newest' | 'popular';
}

interface PreviewModalProps {
  item: StockMediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: StockMediaItem) => void;
  onDownload: (item: StockMediaItem) => void;
}

// ============================================================================
// Search Filters Component
// ============================================================================

const SearchFilters: React.FC<{
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ filters, onFiltersChange, isOpen, onToggle }) => {
  const t = useTranslations('StockMediaSearch');

  const sites = [
    { value: 'all', label: t('filters.allSites') },
    { value: 'shutterstock', label: 'Shutterstock' },
    { value: 'adobestock', label: 'Adobe Stock' },
    { value: 'freepik', label: 'Freepik' },
    { value: 'unsplash', label: 'Unsplash' },
    { value: 'pexels', label: 'Pexels' }
  ];

  const licenses = [
    { value: 'all', label: t('filters.allLicenses') },
    { value: 'commercial', label: t('filters.commercial') },
    { value: 'editorial', label: t('filters.editorial') },
    { value: 'free', label: t('filters.free') }
  ];

  const sortOptions = [
    { value: 'relevance', label: t('filters.relevance') },
    { value: 'price', label: t('filters.price') },
    { value: 'newest', label: t('filters.newest') },
    { value: 'popular', label: t('filters.popular') }
  ];

  return (
    <div className="glass-card p-4 mb-6">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 text-white hover:text-primaryOrange-300 transition-colors"
      >
        <FunnelIcon className="w-5 h-5" />
        <span>{t('filters.title')}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            {/* Site Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('filters.site')}
              </label>
              <select
                value={filters.site}
                onChange={(e) => onFiltersChange({ ...filters, site: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
              >
                {sites.map((site) => (
                  <option key={site.value} value={site.value}>
                    {site.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('filters.minPrice')}
                </label>
                <input
                  type="number"
                  value={filters.minCost}
                  onChange={(e) => onFiltersChange({ ...filters, minCost: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('filters.maxPrice')}
                </label>
                <input
                  type="number"
                  value={filters.maxCost}
                  onChange={(e) => onFiltersChange({ ...filters, maxCost: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
                  placeholder="1000"
                />
              </div>
            </div>

            {/* License Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('filters.license')}
              </label>
              <select
                value={filters.license}
                onChange={(e) => onFiltersChange({ ...filters, license: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
              >
                {licenses.map((license) => (
                  <option key={license.value} value={license.value}>
                    {license.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('filters.sortBy')}
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as 'relevance' | 'price' | 'newest' | 'popular' })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// Preview Modal Component
// ============================================================================

const PreviewModal: React.FC<PreviewModalProps> = ({ item, isOpen, onClose, onAddToCart, onDownload }) => {
  const t = useTranslations('StockMediaSearch');
  const { user } = useAuth();

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{item.title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={t('modal.close')}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image */}
                <div className="relative">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-64 lg:h-96 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {item.dimensions.width} × {item.dimensions.height}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('modal.details')}</h3>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>{t('modal.cost')}:</span>
                        <span className="text-primaryOrange-400 font-semibold">{item.cost} EGP</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('modal.filesize')}:</span>
                        <span>{item.filesize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('modal.site')}:</span>
                        <span className="capitalize">{item.site}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('modal.license')}:</span>
                        <span>{item.license}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">{t('modal.tags')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.slice(0, 6).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onAddToCart(item)}
                      className="flex-1 bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      disabled={!user}
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>{t('modal.addToCart')}</span>
                    </button>
                    <button
                      onClick={() => onDownload(item)}
                      className="flex-1 bg-deepPurple-500 hover:bg-deepPurple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      disabled={!user}
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                      <span>{t('modal.download')}</span>
                    </button>
                  </div>

                  {!user && (
                    <p className="text-yellow-400 text-sm text-center">
                      {t('modal.loginRequired')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// Loading Skeleton Component
// ============================================================================

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4"
        >
          <div className="animate-pulse">
            <div className="bg-gray-700 h-48 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="bg-gray-700 h-4 rounded w-3/4"></div>
              <div className="bg-gray-700 h-4 rounded w-1/2"></div>
              <div className="bg-gray-700 h-4 rounded w-1/4"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ============================================================================
// Empty State Component
// ============================================================================

const EmptyState: React.FC<{ onClearSearch: () => void }> = ({ onClearSearch }) => {
  const t = useTranslations('StockMediaSearch');

  return (
    <div className="text-center py-12">
      <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{t('empty.title')}</h3>
      <p className="text-gray-400 mb-6">{t('empty.description')}</p>
      <button
        onClick={onClearSearch}
        className="bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-6 py-2 rounded-lg transition-colors"
      >
        {t('empty.clearSearch')}
      </button>
    </div>
  );
};

// ============================================================================
// Error State Component
// ============================================================================

const ErrorState: React.FC<{ onRetry: () => void; error: string }> = ({ onRetry, error }) => {
  const t = useTranslations('StockMediaSearch');

  return (
    <div className="text-center py-12">
      <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{t('error.title')}</h3>
      <p className="text-gray-400 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
      >
        {t('error.retry')}
      </button>
    </div>
  );
};

// ============================================================================
// Main StockMediaSearch Component
// ============================================================================

const StockMediaSearch: React.FC = () => {
  const t = useTranslations('StockMediaSearch');
  const { user } = useAuth();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedSite, setSelectedSite] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewItem, setPreviewItem] = useState<StockMediaItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    site: 'all',
    minCost: 0,
    maxCost: 1000,
    minWidth: 0,
    minHeight: 0,
    license: 'all',
    sortBy: 'relevance'
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search hook
  const {
    data: searchResults,
    isLoading,
    isError,
    error,
    refetch
  } = useStockMediaSearchSimple({
    query: debouncedQuery,
    site: selectedSite === 'all' ? undefined : selectedSite,
    page: currentPage,
    limit: 20,
    enabled: debouncedQuery.length > 0
  });

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSiteChange = useCallback((site: string) => {
    setSelectedSite(site);
    setCurrentPage(1);
  }, []);

  const handlePreview = useCallback((item: StockMediaItem) => {
    setPreviewItem(item);
    setIsPreviewOpen(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setPreviewItem(null);
  }, []);

  const handleAddToCart = useCallback((item: StockMediaItem) => {
    if (!user) {
      // Show login modal or redirect to auth
      return;
    }
    // Implement add to cart logic
    console.log('Adding to cart:', item);
  }, [user]);

  const handleDownload = useCallback((item: StockMediaItem) => {
    if (!user) {
      // Show login modal or redirect to auth
      return;
    }
    // Implement download logic
    console.log('Downloading:', item);
  }, [user]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    setCurrentPage(1);
  }, []);

  // Pagination
  const totalPages = Math.ceil((searchResults?.total || 0) / 20);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handleNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const handlePrevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPrevPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{t('title')}</h1>
          <p className="text-gray-300 text-lg">{t('subtitle')}</p>
        </div>

        {/* Search Bar */}
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
                aria-label={t('search.label')}
              />
            </div>

            {/* Site Selector */}
            <div className="md:w-48">
              <select
                value={selectedSite}
                onChange={(e) => handleSiteChange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
                aria-label={t('search.siteLabel')}
              >
                <option value="all">{t('search.allSites')}</option>
                <option value="shutterstock">Shutterstock</option>
                <option value="adobestock">Adobe Stock</option>
                <option value="freepik">Freepik</option>
                <option value="unsplash">Unsplash</option>
                <option value="pexels">Pexels</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters */}
        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={filtersOpen}
          onToggle={() => setFiltersOpen(!filtersOpen)}
        />

        {/* Results */}
        <div className="mb-8">
          {isLoading && <LoadingSkeleton />}
          
          {isError && (
            <ErrorState 
              onRetry={handleRetry} 
              error={error?.message || t('error.generic')} 
            />
          )}

          {!isLoading && !isError && (!searchResults || searchResults.results.length === 0) && (
            <EmptyState onClearSearch={handleClearSearch} />
          )}

          {!isLoading && !isError && searchResults && searchResults.results.length > 0 && (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-300">
                  {t('results.found', { count: searchResults.total })}
                </p>
                <p className="text-gray-300">
                  {t('results.page', { current: currentPage, total: totalPages })}
                </p>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.results.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-4 hover:scale-105 transition-transform duration-200"
                  >
                    {/* Image */}
                    <div className="relative mb-4">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                        {item.dimensions.width} × {item.dimensions.height}
                      </div>
                      <button
                        onClick={() => handlePreview(item)}
                        className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100"
                        aria-label={t('results.preview')}
                      >
                        <EyeIcon className="w-8 h-8 text-white" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-white font-medium line-clamp-2">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-primaryOrange-400 font-semibold">
                          {item.cost} EGP
                        </span>
                        <span className="text-gray-400 text-sm capitalize">
                          {item.site}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">{item.filesize}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        disabled={!user}
                      >
                        <ShoppingCartIcon className="w-4 h-4" />
                        <span>{t('results.addToCart')}</span>
                      </button>
                      <button
                        onClick={() => handleDownload(item)}
                        className="flex-1 bg-deepPurple-500 hover:bg-deepPurple-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        disabled={!user}
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        <span>{t('results.download')}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 mt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={!hasPrevPage}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                    <span>{t('pagination.previous')}</span>
                  </button>

                  <div className="flex space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      const isActive = page === currentPage;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-primaryOrange-500 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>{t('pagination.next')}</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        item={previewItem}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        onAddToCart={handleAddToCart}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default StockMediaSearch;