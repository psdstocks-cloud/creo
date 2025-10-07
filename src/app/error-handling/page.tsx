/**
 * Error Handling Example Page
 * 
 * A dedicated page showcasing the comprehensive error handling system
 * with proper internationalization and RTL support.
 */

'use client';

import dynamic from 'next/dynamic';

// Dynamically import the component to prevent SSR issues
const ErrorHandlingExample = dynamic(() => import('../../components/ErrorHandlingExample'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
      <div className="glass-card p-8 rounded-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryOrange-500 mx-auto mb-4"></div>
        <p className="text-white">Loading Error Handling System...</p>
      </div>
    </div>
  )
});

export default function ErrorHandlingPage() {
  return <ErrorHandlingExample />;
}
