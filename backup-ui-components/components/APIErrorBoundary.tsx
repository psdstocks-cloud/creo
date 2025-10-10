/**
 * API Error Boundary Component
 * 
 * Catches and displays API-related errors gracefully with retry mechanisms,
 * user-friendly error messages, and error reporting.
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  ClassifiedError, 
  createErrorHandler, 
  reportError,
  shouldShowRetryButton,
  shouldShowContactSupport,
  getRecoveryAction,
  ErrorContext
} from '../utils/error-handling';

// ============================================================================
// Types and Interfaces
// ============================================================================

interface APIErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: ClassifiedError) => void;
  context?: ErrorContext;
  showRetryButton?: boolean;
  showContactSupport?: boolean;
  className?: string;
}

interface APIErrorBoundaryState {
  hasError: boolean;
  error: ClassifiedError | null;
  retryCount: number;
  isRetrying: boolean;
}

// ============================================================================
// Error Display Component
// ============================================================================

interface ErrorDisplayProps {
  error: ClassifiedError;
  onRetry: () => void;
  onDismiss: () => void;
  isRetrying: boolean;
  retryCount: number;
  showRetryButton: boolean;
  showContactSupport: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  isRetrying,
  retryCount,
  showRetryButton,
  showContactSupport
}) => {
  const t = useTranslations('APIErrorBoundary');

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'network':
        return (
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
      case 'auth':
        return (
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'validation':
        return (
          <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'server':
        return (
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
    }
  };

  const getErrorColor = (type: string) => {
    switch (type) {
      case 'network':
        return 'border-red-500/30 bg-red-500/10';
      case 'auth':
        return 'border-red-500/30 bg-red-500/10';
      case 'validation':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'server':
        return 'border-red-500/30 bg-red-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-6 rounded-lg max-w-md mx-auto"
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {getErrorIcon(error.type)}
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-2">
          {t('title')}
        </h2>
        
        <p className="text-gray-300 mb-4">
          {error.message}
        </p>
        
        <div className={`p-3 rounded-lg border ${getErrorColor(error.type)} mb-4`}>
          <p className="text-sm text-gray-300">
            {getRecoveryAction(error)}
          </p>
        </div>
        
        {retryCount > 0 && (
          <p className="text-xs text-gray-400 mb-4">
            {t('retryCount', { count: retryCount })}
          </p>
        )}
        
        <div className="flex space-x-3">
          {showRetryButton && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="flex-1 bg-primaryOrange-500 hover:bg-primaryOrange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {isRetrying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{t('retrying')}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{t('retry')}</span>
                </>
              )}
            </button>
          )}
          
          <button
            onClick={onDismiss}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            {t('dismiss')}
          </button>
        </div>
        
        {showContactSupport && (
          <div className="mt-4 pt-4 border-t border-gray-600">
            <p className="text-sm text-gray-400 mb-2">
              {t('contactSupport')}
            </p>
            <button className="text-primaryOrange-500 hover:text-primaryOrange-400 text-sm font-medium">
              {t('getHelp')}
            </button>
          </div>
        )}
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">
              {t('errorDetails')}
            </summary>
            <div className="mt-2 p-3 bg-gray-800 rounded text-xs text-gray-300 font-mono">
              <div><strong>Type:</strong> {error.type}</div>
              <div><strong>Severity:</strong> {error.severity}</div>
              <div><strong>Context:</strong> {JSON.stringify(error.context, null, 2)}</div>
              <div><strong>Original Error:</strong> {String(error.originalError)}</div>
            </div>
          </details>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// Main API Error Boundary Component
// ============================================================================

class APIErrorBoundary extends Component<APIErrorBoundaryProps, APIErrorBoundaryState> {
  private errorHandler: (error: unknown, errorInfo?: ErrorInfo) => ClassifiedError;

  constructor(props: APIErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false
    };

    this.errorHandler = createErrorHandler(props.context || {});
  }

  static getDerivedStateFromError(): Partial<APIErrorBoundaryState> {
    return {
      hasError: true
    };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    const classifiedError = this.errorHandler(error, {
      componentStack: errorInfo.componentStack
    });
    
    this.setState({
      error: classifiedError
    });

    // Report the error
    reportError(classifiedError);

    // Call the onError callback if provided
    this.props.onError?.(classifiedError);
  }

  handleRetry = async () => {
    if (!this.state.error) return;

    this.setState({ isRetrying: true });

    try {
      // Wait a bit to simulate retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset the error boundary state
      this.setState({
        hasError: false,
        error: null,
        retryCount: this.state.retryCount + 1,
        isRetrying: false
      });
    } catch {
      this.setState({ isRetrying: false });
    }
  };

  handleDismiss = () => {
    this.setState({
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Show error display
      return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4 ${this.props.className || ''}`}>
          <ErrorDisplay
            error={this.state.error}
            onRetry={this.handleRetry}
            onDismiss={this.handleDismiss}
            isRetrying={this.state.isRetrying}
            retryCount={this.state.retryCount}
            showRetryButton={this.props.showRetryButton !== false && shouldShowRetryButton(this.state.error)}
            showContactSupport={this.props.showContactSupport !== false && shouldShowContactSupport(this.state.error)}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default APIErrorBoundary;
