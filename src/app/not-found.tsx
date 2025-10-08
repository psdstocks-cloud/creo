'use client';

import Link from 'next/link';

export default function NotFound() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-24 h-24 bg-primaryOrange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-primaryOrange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.591M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">404</h1>
          <h2 className="text-xl font-semibold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-300 mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go Home
          </Link>
          
          <Link
            href="/stock-search"
            className="inline-block w-full bg-deepPurple-500 hover:bg-deepPurple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Search Stock Media
          </Link>
        </div>
      </div>
    </div>
  );
}
