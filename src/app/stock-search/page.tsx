'use client';

/**
 * Stock Media Search Page
 * 
 * Page showcasing the comprehensive StockMediaSearch component
 * with all features including search, filters, preview, and cart functionality.
 */

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the StockMediaSearch component
const StockMediaSearch = dynamic(() => import('../../components/StockMediaSearch'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading search interface...</p>
      </div>
    </div>
  )
});

export default function StockSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading search interface...</p>
        </div>
      </div>
    }>
      <StockMediaSearch />
    </Suspense>
  );
}