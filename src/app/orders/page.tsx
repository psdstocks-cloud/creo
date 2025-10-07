/**
 * Orders Management Page
 * 
 * Page showcasing the comprehensive OrderManagement component
 * with all features including order tracking, downloads, and management.
 */

'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the OrderManagement component to avoid SSR issues
const OrderManagement = dynamic(() => import('../../components/OrderManagement'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading order management...</p>
      </div>
    </div>
  )
});

const OrdersPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading order management...</p>
        </div>
      </div>
    }>
      <OrderManagement />
    </Suspense>
  );
};

export default OrdersPage;