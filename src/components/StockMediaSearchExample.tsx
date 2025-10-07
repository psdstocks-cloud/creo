'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  useStockMediaSearch,
  useStockMediaSearchInfinite,
  useTrendingStockMedia,
  useRelatedStockMedia,
  useSearchSuggestions,
  useSearchFilters,
  useSearchAnalytics,
  StockMediaSearchParams,
  StockMediaItem,
} from '../hooks/useStockMediaSearchQuery';

interface StockMediaSearchExampleProps {
  className?: string;
}

export default function StockMediaSearchExample({ className = '' }: StockMediaSearchExampleProps) {
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useState<StockMediaSearchParams>({
    query: '',
    page: 1,
    pageSize: 20,
    type: 'all',
    sortBy: 'relevance',
  });
  const [selectedMedia, setSelectedMedia] = useState<StockMediaItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Search hooks
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
    isFetching: isFetchingSearch,
    refetch: refetchSearch,
  } = useStockMediaSearch(searchParams, {
    enabled: !!searchParams.query && searchParams.query.trim().length > 0,
  });
  
  // Infinite scroll hook
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useStockMediaSearchInfinite({
    query: searchParams.query,
    type: searchParams.type,
    category: searchParams.category,
    sortBy: searchParams.sortBy,
  }, {
    enabled: !!searchParams.query && searchParams.query.trim().length > 0,
  });
  
  // Trending media
  const {
    data: trendingMedia,
  } = useTrendingStockMedia({
    limit: 12,
    type: 'image',
  });
  
  // Related media
  const {
    data: relatedMedia,
  } = useRelatedStockMedia(selectedMedia?.id || '', {
    limit: 8,
    enabled: !!selectedMedia?.id,
  });
  
  // Search suggestions
  const {
    data: suggestions,
  } = useSearchSuggestions(searchQuery, {
    limit: 8,
    enabled: searchQuery.trim().length >= 2,
  });
  
  // Search filters
  const {
    data: filters,
  } = useSearchFilters();
  
  // Search analytics
  const {
    data: analytics,
  } = useSearchAnalytics(searchParams, {
    enabled: !!searchParams.query,
  });
  
  // Memoized search results for infinite scroll
  const allResults = useMemo(() => {
    if (infiniteData?.pages) {
      return infiniteData.pages.flatMap(page => page.results);
    }
    return searchResults?.results || [];
  }, [infiniteData, searchResults]);
  
  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams(prev => ({
        ...prev,
        query: searchQuery.trim(),
        page: 1,
      }));
    }
  };
  
  const handleFilterChange = (key: keyof StockMediaSearchParams, value: string | number | boolean) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };
  
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };
  
  const handleMediaSelect = (media: StockMediaItem) => {
    setSelectedMedia(media);
  };
  
  const handleRetry = () => {
    refetchSearch();
  };
  
  return (
    <div className={`glass-card p-6 max-w-7xl mx-auto ${className}`}>
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Stock Media Search
      </h2>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for stock media..."
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
            />
            {suggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 z-10">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setSearchParams(prev => ({
                        ...prev,
                        query: suggestion,
                        page: 1,
                      }));
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/20 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3 bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {/* Filter Toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </form>
      
      {/* Advanced Filters */}
      {showFilters && filters && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Type</label>
              <select
                value={searchParams.type || 'all'}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
              >
                <option value="all">All Types</option>
                {filters.types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Category</label>
              <select
                value={searchParams.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
              >
                <option value="">All Categories</option>
                {filters.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Sort By</label>
              <select
                value={searchParams.sortBy || 'relevance'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Popular</option>
              </select>
            </div>
            
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={searchParams.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={searchParams.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {searchError && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-300 font-medium">Search Error</h3>
              <p className="text-red-200 text-sm mt-1">{searchError.message}</p>
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {/* Search Results */}
      {searchResults && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              Search Results ({searchResults.total.toLocaleString()})
            </h3>
            {isFetchingSearch && (
              <div className="flex items-center text-primaryOrange-200">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primaryOrange-500 mr-2"></div>
                Updating...
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allResults.map((item) => (
              <div
                key={item.id}
                className="glass-card p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => handleMediaSelect(item)}
              >
                <div className="relative mb-3">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={300}
                    height={128}
                    className="w-full h-32 object-cover rounded-lg"
                    loading="lazy"
                  />
                  {item.isPremium && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                      Premium
                    </div>
                  )}
                </div>
                <h4 className="text-white font-medium mb-2 line-clamp-2">{item.title}</h4>
                <p className="text-primaryOrange-200 text-sm mb-2">
                  {item.source} • {item.ext}
                </p>
                <p className="text-white font-bold">
                  {item.currency} {item.cost}
                </p>
              </div>
            ))}
          </div>
          
          {/* Load More Button */}
          {hasNextPage && (
            <div className="text-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="px-6 py-3 bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Trending Media */}
      {!searchResults && trendingMedia && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Trending Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {trendingMedia.results.map((item) => (
              <div
                key={item.id}
                className="glass-card p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => handleMediaSelect(item)}
              >
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  width={300}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                  loading="lazy"
                />
                <h4 className="text-white font-medium mb-2 line-clamp-2">{item.title}</h4>
                <p className="text-primaryOrange-200 text-sm mb-2">
                  {item.source} • {item.ext}
                </p>
                <p className="text-white font-bold">
                  {item.currency} {item.cost}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Selected Media Details */}
      {selectedMedia && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Media Details</h3>
          <div className="glass-card p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Image
                  src={selectedMedia.thumbnail}
                  alt={selectedMedia.title}
                  width={600}
                  height={256}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">{selectedMedia.title}</h4>
                {selectedMedia.description && (
                  <p className="text-primaryOrange-200 mb-4">{selectedMedia.description}</p>
                )}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-white font-medium">Source:</span>
                    <span className="text-primaryOrange-200 ml-2">{selectedMedia.source}</span>
                  </div>
                  <div>
                    <span className="text-white font-medium">Type:</span>
                    <span className="text-primaryOrange-200 ml-2">{selectedMedia.type}</span>
                  </div>
                  <div>
                    <span className="text-white font-medium">Format:</span>
                    <span className="text-primaryOrange-200 ml-2">{selectedMedia.ext}</span>
                  </div>
                  <div>
                    <span className="text-white font-medium">Price:</span>
                    <span className="text-white font-bold ml-2">
                      {selectedMedia.currency} {selectedMedia.cost}
                    </span>
                  </div>
                </div>
                {selectedMedia.tags && selectedMedia.tags.length > 0 && (
                  <div className="mb-4">
                    <span className="text-white font-medium">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedMedia.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/10 text-white text-sm rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <button className="w-full px-6 py-3 bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white rounded-lg font-medium">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Related Media */}
      {relatedMedia && relatedMedia.results.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Related Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedMedia.results.map((item) => (
              <div
                key={item.id}
                className="glass-card p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => handleMediaSelect(item)}
              >
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  width={300}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                  loading="lazy"
                />
                <h4 className="text-white font-medium mb-2 line-clamp-2">{item.title}</h4>
                <p className="text-primaryOrange-200 text-sm mb-2">
                  {item.source} • {item.ext}
                </p>
                <p className="text-white font-bold">
                  {item.currency} {item.cost}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Search Analytics */}
      {analytics && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Search Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Total Searches</h4>
              <p className="text-2xl font-bold text-primaryOrange-500">
                {analytics.totalSearches.toLocaleString()}
              </p>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Average Results</h4>
              <p className="text-2xl font-bold text-primaryOrange-500">
                {analytics.averageResults.toLocaleString()}
              </p>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Popular Queries</h4>
              <div className="space-y-1">
                {analytics.popularQueries.slice(0, 3).map((query, index) => (
                  <p key={index} className="text-primaryOrange-200 text-sm">
                    {query}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
