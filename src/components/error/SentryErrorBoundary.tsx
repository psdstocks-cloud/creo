'use client'

import React from 'react'
import * as Sentry from '@sentry/nextjs'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  eventId: string | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{
    error: Error | null
    eventId: string | null
    resetError: () => void
  }>
}

export class SentryErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      eventId: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      eventId: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Capture the error with Sentry
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        errorBoundary: true,
      },
    })

    this.setState({ eventId })

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      eventId: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent
            error={this.state.error}
            eventId={this.state.eventId}
            resetError={this.resetError}
          />
        )
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          eventId={this.state.eventId}
          resetError={this.resetError}
        />
      )
    }

    return this.props.children
  }
}

// Default error fallback component
function DefaultErrorFallback({
  error,
  eventId,
  resetError,
}: {
  error: Error | null
  eventId: string | null
  resetError: () => void
}) {
  const handleReportFeedback = () => {
    if (eventId) {
      Sentry.showReportDialog({ eventId })
    }
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h1>
        
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
        </p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        <div className="space-y-3">
          <Button
            onClick={resetError}
            className="w-full"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
          
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full"
            leftIcon={<Home className="w-4 h-4" />}
          >
            Go Home
          </Button>
          
          {eventId && (
            <Button
              onClick={handleReportFeedback}
              variant="ghost"
              className="w-full text-sm"
            >
              Report this issue
            </Button>
          )}
        </div>
        
        {eventId && (
          <p className="mt-4 text-xs text-gray-500">
            Error ID: {eventId}
          </p>
        )}
      </div>
    </div>
  )
}

// Custom error fallback for specific pages
export function PageErrorFallback({
  error,
  eventId,
  resetError,
}: {
  error: Error | null
  eventId: string | null
  resetError: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h2>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        We encountered an error while loading this page. Please try again.
      </p>
      
      <div className="flex gap-3">
        <Button onClick={resetError} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Try Again
        </Button>
        
        <Button
          onClick={() => window.location.href = '/'}
          variant="outline"
          leftIcon={<Home className="w-4 h-4" />}
        >
          Go Home
        </Button>
      </div>
    </div>
  )
}

// Custom error fallback for components
export function ComponentErrorFallback({
  error,
  eventId,
  resetError,
}: {
  error: Error | null
  eventId: string | null
  resetError: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg">
      <AlertTriangle className="w-8 h-8 text-red-600 mb-3" />
      
      <h3 className="text-lg font-medium text-red-900 mb-2">
        Component Error
      </h3>
      
      <p className="text-red-700 text-center mb-4">
        This component encountered an error and couldn't render properly.
      </p>
      
      <Button
        onClick={resetError}
        size="sm"
        leftIcon={<RefreshCw className="w-4 h-4" />}
      >
        Reload Component
      </Button>
    </div>
  )
}

export default SentryErrorBoundary
