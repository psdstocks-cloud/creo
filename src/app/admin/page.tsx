'use client';

import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const AdminDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access the admin dashboard.
          </p>
          <Link 
            href="/auth/signin"
            className="bg-primaryOrange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {user.email}</p>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Admin Access
          </div>
        </div>

        {/* Admin content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <div className="space-y-2">
              <div className="text-sm">Total Users: 1,234</div>
              <div className="text-sm">Active Users: 987</div>
              <div className="text-sm">New This Month: 156</div>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded text-sm">
              View Users
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Order Management</h2>
            <div className="space-y-2">
              <div className="text-sm">Pending Orders: 23</div>
              <div className="text-sm">Completed Today: 156</div>
              <div className="text-sm">Failed Orders: 3</div>
            </div>
            <Link href="/orders" className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded text-sm">
              View Orders
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Content & Analytics</h2>
            <div className="space-y-2">
              <div className="text-sm">Total Downloads: 45,678</div>
              <div className="text-sm">Popular Categories: Images</div>
              <div className="text-sm">Revenue: $12,345</div>
            </div>
            <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded text-sm">
              View Analytics
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            <div className="space-y-2">
              <div className="text-sm">API Status: Online</div>
              <div className="text-sm">Server Load: 45%</div>
              <div className="text-sm">Last Backup: 2 hours ago</div>
            </div>
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded text-sm">
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
