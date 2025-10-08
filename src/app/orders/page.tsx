'use client'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Your orders will appear here once you start downloading content.</p>
      </div>
    </div>
  )
}