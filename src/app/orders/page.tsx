'use client';

import React from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Orders Management
          </h1>
          <p className="text-primaryOrange-200 text-lg">
            Order management system (simplified version)
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Orders Dashboard
            </h2>
            <p className="text-gray-300 mb-6">
              This is a simplified version of the orders page for testing Vercel deployment.
              The full order management functionality will be restored once we confirm the deployment is working.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-600/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Total Orders</h3>
                <p className="text-3xl font-bold text-blue-400">0</p>
              </div>
              <div className="bg-green-600/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Completed</h3>
                <p className="text-3xl font-bold text-green-400">0</p>
              </div>
              <div className="bg-yellow-600/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Pending</h3>
                <p className="text-3xl font-bold text-yellow-400">0</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                Full order management features will be available after authentication is properly configured.
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
