/**
 * Stock Media Search Component
 * 
 * A comprehensive search component for stock media with glassmorphism design,
 * internationalization support, and accessibility features.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useStockSites } from '../hooks/useStockMediaIntegration';

// ============================================================================
// Types and Interfaces
// ============================================================================

interface SearchFormData {
  query: string;
  site: string;
  type: 'all' | 'images' | 'videos' | 'vectors';
  sort: 'relevance' | 'newest' | 'popular' | 'price';
}

interface SearchResult {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'vector';
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  pricing: {
    credits: number;
    price: number;
    currency: string;
  };
  license_type: string;
  quality: 'standard' | 'high' | 'premium' | 'ultra';
  tags: string[];
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SearchResult | null;
  onAddToCart: (item: SearchResult) => void;
}

// ============================================================================
// Search Skeleton Component
// ============================================================================

const SearchSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass-card p-4 rounded-lg"
      >
        <div className="animate-pulse">
          <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/4"></div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// ============================================================================
// Empty State Component
// ============================================================================

const EmptyState = ({ onRetry }: { onRetry: () => void }) => {
  const t = useTranslations('StockMediaSearch');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="glass-card p-8 rounded-lg max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{t('emptyState.title')}</h3>
        <p className="text-gray-300 mb-6">{t('emptyState.description')}</p>
        <button
          onClick={onRetry}
          className="bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {t('emptyState.retryButton')}
        </button>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Error State Component
// ============================================================================

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => {
  const t = useTranslations('StockMediaSearch');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="glass-card p-8 rounded-lg max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{t('errorState.title')}</h3>
        <p className="text-gray-300 mb-2">{error}</p>
        <p className="text-gray-400 mb-6">{t('errorState.description')}</p>
        <button
          onClick={onRetry}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {t('errorState.retryButton')}
        </button>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Search Result Card Component
// ============================================================================

const SearchResultCard = ({ 
  item, 
  onPreview, 
  onAddToCart 
}: { 
  item: SearchResult; 
  onPreview: (item: SearchResult) => void;
  onAddToCart: (item: SearchResult) => void;
}) => {
  const t = useTranslations('StockMediaSearch');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card p-4 rounded-lg cursor-pointer group"
      onClick={() => onPreview(item)}
    >
      <div className="relative overflow-hidden rounded-lg mb-3">
        <Image
          src={item.thumbnail}
          alt={item.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.type === 'image' ? 'bg-blue-500/80' :
            item.type === 'video' ? 'bg-purple-500/80' :
            'bg-green-500/80'
          } text-white`}>
            {item.type.toUpperCase()}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(item);
            }}
          >
            {t('previewButton')}
          </motion.button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-primaryOrange-300 transition-colors">
          {item.title}
        </h3>
        <p className="text-gray-400 text-xs line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-primaryOrange-500 font-bold">
              {item.pricing.credits} {t('credits')}
            </span>
            <span className="text-gray-400 text-sm">
              {item.pricing.price} {item.pricing.currency}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className="bg-deepPurple-500 hover:bg-deepPurple-600 text-white px-3 py-1 rounded text-xs transition-colors"
          >
            {t('addToCart')}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Preview Modal Component
// ============================================================================

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, item, onAddToCart }) => {
  const t = useTranslations('StockMediaSearch');

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{item.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={t('closeModal')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="w-full h-64 lg:h-80 object-cover"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onAddToCart(item)}
                    className="flex-1 bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {t('addToCart')} - {item.pricing.credits} {t('credits')}
                  </button>
                  <button className="flex-1 bg-deepPurple-500 hover:bg-deepPurple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    {t('downloadNow')}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('details')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('type')}:</span>
                      <span className="text-white capitalize">{item.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('size')}:</span>
                      <span className="text-white">{item.size.toLocaleString()} bytes</span>
                    </div>
                    {item.dimensions && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t('dimensions')}:</span>
                        <span className="text-white">{item.dimensions.width} × {item.dimensions.height}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('license')}:</span>
                      <span className="text-white">{item.license_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('quality')}:</span>
                      <span className="text-white">{item.quality}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('description')}</h3>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('tags')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
// Main Stock Media Search Component
// ============================================================================

const StockMediaSearch: React.FC = () => {
  const t = useTranslations('StockMediaSearch');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<SearchResult | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<SearchFormData>({
    defaultValues: {
      query: '',
      site: 'all',
      type: 'all',
      sort: 'relevance'
    }
  });

  const watchedQuery = watch('query');
  const watchedSite = watch('site');
  const watchedType = watch('type');
  const watchedSort = watch('sort');

  // Get available stock sites (for future use)
  useStockSites();

  const performSearch = useCallback(async () => {
    if (!watchedQuery.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      // Simulate API call - replace with actual search implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock search results
      const mockResults: SearchResult[] = Array.from({ length: 12 }, (_, index) => ({
        id: `result-${index}`,
        thumbnail: `https://picsum.photos/300/200?random=${index}`,
        title: `Stock Media Item ${index + 1}`,
        description: `High-quality ${watchedType} content for your projects. Perfect for commercial use.`,
        type: watchedType === 'all' ? ['image', 'video', 'vector'][index % 3] as 'image' | 'video' | 'vector' : watchedType as 'image' | 'video' | 'vector',
        size: Math.floor(Math.random() * 10000000) + 1000000,
        dimensions: {
          width: 1920,
          height: 1080
        },
        pricing: {
          credits: Math.floor(Math.random() * 20) + 1,
          price: Math.floor(Math.random() * 50) + 5,
          currency: 'USD'
        },
        license_type: 'Commercial',
        quality: ['standard', 'high', 'premium', 'ultra'][Math.floor(Math.random() * 4)] as 'standard' | 'high' | 'premium' | 'ultra',
        tags: ['business', 'technology', 'modern', 'professional'].slice(0, Math.floor(Math.random() * 4) + 1)
      }));

      setSearchResults(mockResults);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  }, [watchedQuery, watchedType]);

  // Debounced search effect
  useEffect(() => {
    if (!watchedQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [watchedQuery, watchedSite, watchedType, watchedSort, performSearch]);


  const handlePreview = (item: SearchResult) => {
    setPreviewItem(item);
    setIsPreviewOpen(true);
  };

  const handleAddToCart = (item: SearchResult) => {
    // Implement add to cart functionality
    console.log('Added to cart:', item);
  };

  const handleRetry = () => {
    performSearch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{t('title')}</h1>
          <p className="text-primaryOrange-200 text-lg">{t('subtitle')}</p>
        </div>

        {/* Search Form */}
        <div className="glass-card p-6 rounded-lg mb-8">
          <form onSubmit={handleSubmit(() => {})} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="lg:col-span-2">
                <label htmlFor="query" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('searchInput.label')}
                </label>
                <div className="relative">
                  <input
                    {...register('query')}
                    type="text"
                    id="query"
                    placeholder={t('searchInput.placeholder')}
                    className="w-full px-4 py-3 pl-10 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Site Selector */}
              <div>
                <label htmlFor="site" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('siteSelector.label')}
                </label>
                <select
                  {...register('site')}
                  id="site"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
                >
                  <option value="all">{t('siteSelector.allSites')}</option>
                  <option value="shutterstock">Shutterstock</option>
                  <option value="adobestock">Adobe Stock</option>
                  <option value="freepik">Freepik</option>
                  <option value="unsplash">Unsplash</option>
                  <option value="pexels">Pexels</option>
                </select>
              </div>

              {/* Type Selector */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('typeSelector.label')}
                </label>
                <select
                  {...register('type')}
                  id="type"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
                >
                  <option value="all">{t('typeSelector.all')}</option>
                  <option value="images">{t('typeSelector.images')}</option>
                  <option value="videos">{t('typeSelector.videos')}</option>
                  <option value="vectors">{t('typeSelector.vectors')}</option>
                </select>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">{t('sortBy')}:</span>
                <div className="flex space-x-2">
                  {(['relevance', 'newest', 'popular', 'price'] as const).map((sortOption) => (
                    <button
                      key={sortOption}
                      type="button"
                      onClick={() => setValue('sort', sortOption)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        watchedSort === sortOption
                          ? 'bg-primaryOrange-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {t(`sortOptions.${sortOption}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Search Results */}
        <div className="space-y-6">
          {isSearching && <SearchSkeleton />}
          
          {error && <ErrorState error={error} onRetry={handleRetry} />}
          
          {!isSearching && !error && hasSearched && searchResults.length === 0 && (
            <EmptyState onRetry={handleRetry} />
          )}
          
          {!isSearching && !error && searchResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  {t('resultsCount', { count: searchResults.length })}
                </h2>
                <div className="text-sm text-gray-400">
                  {t('showingResults')}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((item) => (
                  <SearchResultCard
                    key={item.id}
                    item={item}
                    onPreview={handlePreview}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          item={previewItem}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default StockMediaSearch;
