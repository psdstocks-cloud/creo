'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/stock-search"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Stock Search</h2>
          <p className="text-gray-600">Search and download stock media from various sources</p>
        </Link>
        
        <Link
          href="/ai-generation"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Generation</h2>
          <p className="text-gray-600">Generate images using AI with custom prompts</p>
        </Link>
        
        <Link
          href="/orders"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Orders</h2>
          <p className="text-gray-600">View and manage your orders</p>
        </Link>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
        <p className="text-gray-600">Welcome back, {user?.email}</p>
      </div>
    </div>
  )
}