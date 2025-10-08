'use client';

import React from 'react';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function StockSearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Stock Media Search
          </h1>
          <p className="text-primaryOrange-200 text-lg">
            Search for stock media assets (simplified version)
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Search Interface
            </h2>
            <p className="text-gray-300 mb-6">
              This is a simplified version of the stock media search page for testing Vercel deployment.
              The full search functionality will be restored once we confirm the deployment is working.
            </p>
            
            <div className="mb-6">
              <input 
                type="text" 
                placeholder="Search for images, videos, or audio..."
                className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500"
                disabled
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="w-full h-32 bg-gray-700 rounded mb-2"></div>
                <p className="text-gray-400 text-sm">Sample Image 1</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="w-full h-32 bg-gray-700 rounded mb-2"></div>
                <p className="text-gray-400 text-sm">Sample Image 2</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="w-full h-32 bg-gray-700 rounded mb-2"></div>
                <p className="text-gray-400 text-sm">Sample Image 3</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                Full search functionality will be available after authentication is properly configured.
              </p>
              <Link 
                href="/" 
                className="bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
