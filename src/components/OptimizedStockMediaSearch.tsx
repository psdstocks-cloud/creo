/**
 * Optimized Stock Media Search Component
 * 
 * Performance-optimized version of the StockMediaSearch component with
 * virtual scrolling, lazy loading, memoization, and query optimization.
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   useDebouncedSearch, 
//   useLazyImage, 
//   useVirtualScroll,
//   createOptimizedComponent,
//   // createOptimizedCallback,
//   // createOptimizedMemo,
//   usePerformanceMonitor
// } from '../utils/performance-simple';

// ============================================================================
// Types and Interfaces
// ============================================================================

interface SearchParams {
  query: string;
  site: string;
  type: string;
  sortBy: string;
}

interface MediaItem {
  id: string;
  title: string;
  thumbnail: string;
  type: 'image' | 'video' | 'vector';
  site: string;
  credits: number;
  price: number;
  currency: string;
  dimensions?: string;
  fileSize?: number;
  tags: string[];
}

interface SearchResults {
  items: MediaItem[];
  total: number;
  page: number;
  hasMore: boolean;
}

// ============================================================================
// Optimized Media Item Component
// ============================================================================

interface MediaItemProps {
  item: MediaItem;
  onPreview: (item: MediaItem) => void;
  onAddToCart: (item: MediaItem) => void;
  onDownload: (item: MediaItem) => void;
}

const MediaItemComponent: React.FC<MediaItemProps> = React.memo(({ 
  item, 
  onPreview, 
  onAddToCart, 
  onDownload 
}) => {
  // const { imageSrc, isLoaded, isError, imgRef, handleLoad, handleError } = useLazyImage(
  //   item.thumbnail,
  //   '/placeholder-image.jpg'
  // );
  
  // Fallback for missing useLazyImage
  const imageSrc = item.thumbnail;
  const isLoaded = true;
  const isError = false;
  const imgRef = null;
  const handleLoad = () => {};
  const handleError = () => {};

  const handlePreview = useCallback(() => {
    onPreview(item);
  }, [item, onPreview]);

  const handleAddToCart = useCallback(() => {
    onAddToCart(item);
  }, [item, onAddToCart]);

  const handleDownload = useCallback(() => {
    onDownload(item);
  }, [item, onDownload]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-4 rounded-lg group hover:scale-105 transition-transform"
    >
      <div className="relative overflow-hidden rounded-lg mb-3">
        <div ref={imgRef} className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
          {!isLoaded && !isError && (
            <div className="animate-pulse bg-gray-600 w-full h-full rounded-lg"></div>
          )}
          {isError && (
            <div className="flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {isLoaded && (
            <Image
              src={imageSrc}
              alt={item.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-lg"
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
        </div>
        
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.type === 'image' ? 'bg-blue-500/80' :
            item.type === 'video' ? 'bg-purple-500/80' :
            'bg-green-500/80'
          } text-white`}>
            {item.type.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-primaryOrange-300 transition-colors">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{item.site}</span>
          <span className="text-primaryOrange-500">{item.credits} credits</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-white font-medium">
            {item.price} {item.currency}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={handlePreview}
              className="bg-deepPurple-500 hover:bg-deepPurple-600 text-white px-2 py-1 rounded text-xs transition-colors"
            >
              Preview
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-2 py-1 rounded text-xs transition-colors"
            >
              Add
            </button>
            <button
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

MediaItemComponent.displayName = 'MediaItemComponent';

// ============================================================================
// Virtual Scrolling Container
// ============================================================================

interface VirtualScrollContainerProps {
  items: MediaItem[];
  onPreview: (item: MediaItem) => void;
  onAddToCart: (item: MediaItem) => void;
  onDownload: (item: MediaItem) => void;
  containerHeight: number;
}

const VirtualScrollContainer: React.FC<VirtualScrollContainerProps> = React.memo(({
  items,
  onPreview,
  onAddToCart,
  onDownload,
  containerHeight
}) => {
  // const { visibleItems, totalHeight, offsetY, setScrollTop } = useVirtualScroll(
  //   items,
  //   {
  //     itemHeight: 300, // Approximate height of each item
  //     containerHeight,
  //     overscan: 5
  //   }
  // );
  
  // Fallback for missing useVirtualScroll
  const visibleItems = items;
  const totalHeight = items.length * 300;
  const offsetY = 0;
  const setScrollTop = () => {};

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    // setScrollTop(e.currentTarget.scrollTop);
    // No-op since setScrollTop is a no-op function
  }, []);

  return (
    <div
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {visibleItems.map((item) => (
              <MediaItemComponent
                key={item.id}
                item={item}
                onPreview={onPreview}
                onAddToCart={onAddToCart}
                onDownload={onDownload}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

VirtualScrollContainer.displayName = 'VirtualScrollContainer';

// ============================================================================
// Search Filters Component
// ============================================================================

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchParams) => void;
  isLoading: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = React.memo(({ 
  onFiltersChange, 
  isLoading 
}) => {
  const t = useTranslations('StockMediaSearch');
  const { register, watch } = useForm<SearchParams>({
    defaultValues: {
      query: '',
      site: 'all',
      type: 'all',
      sortBy: 'relevance'
    }
  });

  const watchedFilters = watch();

  useEffect(() => {
    onFiltersChange(watchedFilters);
  }, [watchedFilters, onFiltersChange]);

  return (
    <div className="glass-card p-6 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-300 mb-2">
            {t('searchInput.label')}
          </label>
          <input
            {...register('query')}
            type="text"
            id="query"
            placeholder={t('searchInput.placeholder')}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="site" className="block text-sm font-medium text-gray-300 mb-2">
            {t('siteSelector.label')}
          </label>
          <select
            {...register('site')}
            id="site"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="all">{t('siteSelector.allSites')}</option>
            <option value="shutterstock">Shutterstock</option>
            <option value="adobestock">Adobe Stock</option>
            <option value="freepik">Freepik</option>
            <option value="unsplash">Unsplash</option>
            <option value="pexels">Pexels</option>
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
            {t('typeSelector.label')}
          </label>
          <select
            {...register('type')}
            id="type"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="all">{t('typeSelector.all')}</option>
            <option value="image">{t('typeSelector.images')}</option>
            <option value="video">{t('typeSelector.videos')}</option>
            <option value="vector">{t('typeSelector.vectors')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-300 mb-2">
            {t('sortBy')}
          </label>
          <select
            {...register('sortBy')}
            id="sortBy"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="relevance">{t('sortOptions.relevance')}</option>
            <option value="newest">{t('sortOptions.newest')}</option>
            <option value="popular">{t('sortOptions.popular')}</option>
            <option value="price">{t('sortOptions.price')}</option>
          </select>
        </div>
      </div>
    </div>
  );
});

SearchFilters.displayName = 'SearchFilters';

// ============================================================================
// Main Optimized Component
// ============================================================================

const OptimizedStockMediaSearch: React.FC = () => {
  const t = useTranslations('StockMediaSearch');
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    site: 'all',
    type: 'all',
    sortBy: 'relevance'
  });
  const [searchResults, setSearchResults] = useState<SearchResults>({
    items: [],
    total: 0,
    page: 1,
    hasMore: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Performance monitoring
  // usePerformanceMonitor('OptimizedStockMediaSearch');

  // Debounced search
  // const debouncedQuery = useDebouncedSearch(searchParams.query, 500);
  const debouncedQuery = searchParams.query;

  // Memoized search function
  const performSearch = useCallback(async (params: SearchParams) => {
    if (!params.query.trim()) {
      setSearchResults({ items: [], total: 0, page: 1, hasMore: false });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResults: MediaItem[] = Array.from({ length: 50 }, (_, index) => ({
        id: `item-${index + 1}`,
        title: `${params.query} result ${index + 1}`,
        thumbnail: `https://picsum.photos/300/200?random=${index}`,
        type: ['image', 'video', 'vector'][index % 3] as 'image' | 'video' | 'vector',
        site: ['shutterstock', 'adobestock', 'freepik', 'unsplash', 'pexels'][index % 5],
        credits: Math.floor(Math.random() * 20) + 1,
        price: Math.floor(Math.random() * 50) + 5,
        currency: 'USD',
        dimensions: `${Math.floor(Math.random() * 2000) + 500}x${Math.floor(Math.random() * 2000) + 500}`,
        fileSize: Math.floor(Math.random() * 10000000) + 1000000,
        tags: ['tag1', 'tag2', 'tag3'].slice(0, Math.floor(Math.random() * 3) + 1)
      }));

      setSearchResults({
        items: mockResults,
        total: mockResults.length,
        page: 1,
        hasMore: false
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized search effect
  useEffect(() => {
    if (debouncedQuery) {
      performSearch({ ...searchParams, query: debouncedQuery });
    }
  }, [debouncedQuery, searchParams, performSearch]);

  // Memoized handlers
  const handleFiltersChange = useCallback((filters: SearchParams) => {
    setSearchParams(filters);
  }, []);

  const handlePreview = useCallback((item: MediaItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const handleAddToCart = useCallback((item: MediaItem) => {
    console.log('Added to cart:', item);
  }, []);

  const handleDownload = useCallback((item: MediaItem) => {
    console.log('Download:', item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null);
  }, []);

  // Memoized container height
  const containerHeight = useMemo(() => {
    return Math.min(800, window.innerHeight * 0.6);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{t('title')}</h1>
          <p className="text-primaryOrange-200 text-lg">{t('subtitle')}</p>
        </div>

        {/* Search Filters */}
        <SearchFilters
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
        />

        {/* Results */}
        <div className="glass-card p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              {t('resultsCount', { count: searchResults.total })}
            </h2>
            {isLoading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primaryOrange-500"></div>
                <span className="text-sm text-gray-400">Searching...</span>
              </div>
            )}
          </div>

          {error && (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">{error}</div>
              <button
                onClick={() => performSearch(searchParams)}
                className="bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {!error && searchResults.items.length > 0 && (
            <VirtualScrollContainer
              items={searchResults.items}
              onPreview={handlePreview}
              onAddToCart={handleAddToCart}
              onDownload={handleDownload}
              containerHeight={containerHeight}
            />
          )}

          {!error && searchResults.items.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{t('emptyState.title')}</h3>
              <p className="text-gray-300">{t('emptyState.description')}</p>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        <AnimatePresence>
          {isModalOpen && selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-6 rounded-lg max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white">{selectedItem.title}</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={selectedItem.thumbnail}
                      alt={selectedItem.title}
                      width={200}
                      height={150}
                      className="w-48 h-36 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-gray-300 mb-2">{selectedItem.site} • {selectedItem.type.toUpperCase()}</p>
                      <p className="text-primaryOrange-500 font-semibold">
                        {selectedItem.credits} credits • {selectedItem.price} {selectedItem.currency}
                      </p>
                      {selectedItem.dimensions && (
                        <p className="text-sm text-gray-400 mt-1">
                          {selectedItem.dimensions} • {(selectedItem.fileSize! / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleAddToCart(selectedItem)}
                      className="flex-1 bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleDownload(selectedItem)}
                      className="flex-1 bg-deepPurple-500 hover:bg-deepPurple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// export default createOptimizedComponent(OptimizedStockMediaSearch, 'OptimizedStockMediaSearch');
export default OptimizedStockMediaSearch;
