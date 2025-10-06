'use client';

import { useState } from 'react';
import {
  useCredits,
  useMediaSearch,
  useCreateOrder,
  useDownloadLinks,
  usePurchaseCredits,
  useMediaCategories,
  useTrendingMedia,
} from '../hooks';

/**
 * Example component demonstrating how to use the API hooks
 * This shows real-world usage patterns for the Creo app
 */
export default function ApiHooksExample() {
  const [userId] = useState('user-123'); // In real app, get from auth context
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);

  // Fetch user credits
  const {
    data: credits,
    isLoading: creditsLoading,
    isError: creditsError,
    refetch: refetchCredits,
  } = useCredits(userId);

  // Search for media
  const {
    data: searchResults,
    isLoading: searchLoading,
    isError: searchError,
    refetch: refetchSearch,
  } = useMediaSearch(
    {
      query: searchQuery,
      page: 1,
      limit: 20,
      type: 'image',
    },
    {
      enabled: searchQuery.length > 2,
    }
  );

  // Get trending media
  const {
    data: trendingMedia,
    isLoading: trendingLoading,
  } = useTrendingMedia({
    type: 'image',
    limit: 10,
  });

  // Get media categories
  const {
    data: categories,
    isLoading: categoriesLoading,
  } = useMediaCategories();

  // Create order mutation
  const createOrderMutation = useCreateOrder(userId);

  // Purchase credits mutation
  const purchaseCreditsMutation = usePurchaseCredits(userId);

  // Get download links for an order
  const {
    data: downloadLinks,
    isLoading: downloadLinksLoading,
  } = useDownloadLinks(createOrderMutation.data?.order.id || '', {
    enabled: !!createOrderMutation.data?.order.id,
  });

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle media selection
  const handleMediaSelect = (mediaId: string) => {
    setSelectedMedia(prev => 
      prev.includes(mediaId) 
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  // Handle order creation
  const handleCreateOrder = () => {
    if (selectedMedia.length === 0) return;

    const orderItems = selectedMedia.map(mediaId => ({
      mediaId,
      quantity: 1,
      price: 15, // 15 EGP per download
      currency: 'EGP',
    }));

    createOrderMutation.mutate({
      items: orderItems,
      paymentMethod: 'credit_card',
    });
  };

  // Handle credit purchase
  const handlePurchaseCredits = (amount: number) => {
    purchaseCreditsMutation.mutate({
      amount,
      paymentMethod: 'credit_card',
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">API Hooks Example</h1>

      {/* Credits Section */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Credit Balance</h2>
        {creditsLoading && <p>Loading credits...</p>}
        {creditsError && (
          <div className="text-red-500 mb-4">
            Error loading credits: {creditsError.message}
            <button 
              onClick={() => refetchCredits()}
              className="ml-2 px-3 py-1 bg-primaryOrange text-white rounded"
            >
              Retry
            </button>
          </div>
        )}
        {credits && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primaryOrange">
                {credits.availableCredits}
              </div>
              <div className="text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {credits.usedCredits}
              </div>
              <div className="text-gray-600">Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {credits.totalCredits}
              </div>
              <div className="text-gray-600">Total</div>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => handlePurchaseCredits(10)}
            disabled={purchaseCreditsMutation.isLoading}
            className="px-4 py-2 bg-primaryOrange text-white rounded disabled:opacity-50"
          >
            {purchaseCreditsMutation.isLoading ? 'Purchasing...' : 'Buy 10 Credits'}
          </button>
          <button
            onClick={() => handlePurchaseCredits(50)}
            disabled={purchaseCreditsMutation.isLoading}
            className="px-4 py-2 bg-primaryOrange text-white rounded disabled:opacity-50"
          >
            {purchaseCreditsMutation.isLoading ? 'Purchasing...' : 'Buy 50 Credits'}
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Media Search</h2>
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for images..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange"
          />
        </div>

        {searchLoading && <p>Searching...</p>}
        {searchError && (
          <div className="text-red-500">
            Search error: {searchError.message}
            <button 
              onClick={() => refetchSearch()}
              className="ml-2 px-3 py-1 bg-primaryOrange text-white rounded"
            >
              Retry
            </button>
          </div>
        )}
        {searchResults && (
          <div>
            <p className="mb-4">
              Found {searchResults.results.total} results in {searchResults.searchTime}ms
            </p>
            <div className="grid grid-cols-4 gap-4">
              {searchResults.results.items.map((media) => (
                <div
                  key={media.id}
                  className={`border-2 rounded-lg p-2 cursor-pointer transition-colors ${
                    selectedMedia.includes(media.id)
                      ? 'border-primaryOrange bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleMediaSelect(media.id)}
                >
                  <img
                    src={media.thumbnailUrl}
                    alt={media.title}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="mt-2">
                    <h3 className="font-semibold text-sm truncate">{media.title}</h3>
                    <p className="text-xs text-gray-600">{media.source}</p>
                    <p className="text-xs font-bold text-primaryOrange">
                      {media.price} {media.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trending Media */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Trending Media</h2>
        {trendingLoading && <p>Loading trending media...</p>}
        {trendingMedia && (
          <div className="grid grid-cols-5 gap-4">
            {trendingMedia.map((media) => (
              <div
                key={media.id}
                className="border rounded-lg p-2 cursor-pointer hover:border-primaryOrange"
                onClick={() => handleMediaSelect(media.id)}
              >
                <img
                  src={media.thumbnailUrl}
                  alt={media.title}
                  className="w-full h-24 object-cover rounded"
                />
                <h3 className="font-semibold text-xs mt-1 truncate">{media.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        {categoriesLoading && <p>Loading categories...</p>}
        {categories && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Order Creation */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
        <div className="mb-4">
          <p>Selected items: {selectedMedia.length}</p>
          <p>Total cost: {selectedMedia.length * 15} EGP</p>
        </div>
        
        <button
          onClick={handleCreateOrder}
          disabled={selectedMedia.length === 0 || createOrderMutation.isLoading}
          className="px-6 py-2 bg-primaryOrange text-white rounded disabled:opacity-50"
        >
          {createOrderMutation.isLoading ? 'Creating Order...' : 'Create Order'}
        </button>

        {createOrderMutation.isError && (
          <div className="mt-4 text-red-500">
            Order creation failed: {createOrderMutation.error?.message}
          </div>
        )}

        {createOrderMutation.isSuccess && (
          <div className="mt-4 text-green-500">
            Order created successfully! Order ID: {createOrderMutation.data?.order.id}
          </div>
        )}
      </div>

      {/* Download Links */}
      {downloadLinks && (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-semibold mb-4">Download Links</h2>
          {downloadLinksLoading && <p>Loading download links...</p>}
          {downloadLinks.links.map((link) => (
            <div key={link.id} className="border rounded-lg p-4 mb-2">
              <h3 className="font-semibold">{link.fileName}</h3>
              <p className="text-sm text-gray-600">
                Size: {(link.fileSize / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-sm text-gray-600">
                Downloads: {link.currentDownloads}/{link.maxDownloads}
              </p>
              <p className="text-sm text-gray-600">
                Expires: {new Date(link.expiresAt).toLocaleString()}
              </p>
              <a
                href={link.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-primaryOrange text-white rounded hover:bg-orange-600"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
