'use client';

import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { DemoLogin } from '@/components/DemoLogin';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const AdminDashboard = () => {
  const { user, isAdmin, userRole, hasPermission } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl mb-6">Admin Dashboard</h1>
          <DemoLogin />
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Access Required</h2>
            <p className="text-gray-600">
              Please log in with an admin account to access the admin dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl mb-6">Access Denied</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Insufficient Permissions</h2>
            <p className="text-red-600">
              You need admin privileges to access this page. Your current role: {userRole}
            </p>
          </div>
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
            <p className="text-gray-600">Welcome, {user.email} ({userRole?.replace('_', ' ').toUpperCase()})</p>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Admin Access
          </div>
        </div>

        {/* Role-specific content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hasPermission('user_management') && (
          <div className="glass-card p-6">
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
        )}
        
        {hasPermission('order_management') && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Order Management</h2>
            <div className="space-y-2">
              <div className="text-sm">Pending Orders: 23</div>
              <div className="text-sm">Completed Today: 156</div>
              <div className="text-sm">Failed Orders: 3</div>
            </div>
            <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded text-sm">
              View Orders
            </button>
          </div>
        )}
        
        {hasPermission('analytics') && (
          <div className="glass-card p-6">
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
        )}
        
        {hasPermission('system_settings') && (
          <div className="glass-card p-6">
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
        )}

        {hasPermission('content_management') && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Content Management</h2>
            <div className="space-y-2">
              <div className="text-sm">Total Assets: 12,456</div>
              <div className="text-sm">Pending Review: 23</div>
              <div className="text-sm">Published Today: 45</div>
            </div>
            <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded text-sm">
              Manage Content
            </button>
          </div>
        )}

        {hasPermission('user_support') && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">User Support</h2>
            <div className="space-y-2">
              <div className="text-sm">Open Tickets: 12</div>
              <div className="text-sm">Resolved Today: 8</div>
              <div className="text-sm">Avg Response: 2.3h</div>
            </div>
            <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded text-sm">
              View Support
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
