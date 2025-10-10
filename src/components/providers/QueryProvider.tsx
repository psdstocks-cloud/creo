'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getQueryClient } from '@/lib/query-client'
import { ReactNode } from 'react'

export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  // Check for required environment variables
  const hasRequiredEnv = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!hasRequiredEnv) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-md">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Configuration Error</h3>
          <p className="text-yellow-700 text-sm mb-4">
            Missing required environment variables. Please check your deployment configuration.
          </p>
          <div className="text-xs text-yellow-600 space-y-1">
            <div>Required: NEXT_PUBLIC_SUPABASE_URL</div>
            <div>Required: NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
            <div>Optional: NEXT_PUBLIC_NEHTW_API_KEY</div>
            <div>Optional: NEXT_PUBLIC_NEHTW_BASE_URL</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}