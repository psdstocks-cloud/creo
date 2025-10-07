'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '../contexts/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';

// ============================================================================
// QueryClient Configuration
// ============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// ============================================================================
// Error Fallback Component
// ============================================================================

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-6 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-300 mb-4">
            An error occurred while loading the application. This might be a temporary issue.
          </p>
          <details className="text-left mb-4">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
              Error Details
            </summary>
            <pre className="mt-2 text-xs text-red-300 bg-red-900/20 p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetErrorBoundary}
            className="flex-1 bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Loading Component
// ============================================================================

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading application...</p>
      </div>
    </div>
  );
}

// ============================================================================
// ClientAuthProvider Component
// ============================================================================

interface ClientAuthProviderProps {
  children: ReactNode;
}

export default function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Application Error:', error);
        console.error('Error Info:', errorInfo);
        // Here you could send error reports to a service like Sentry
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* React Query Devtools - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools 
            initialIsOpen={false}
            position="bottom-right"
            buttonPosition="bottom-right"
          />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
