/**
 * Error Handling Example Component
 * 
 * Demonstrates the comprehensive error handling system including
 * APIErrorBoundary, error utilities, and toast notifications.
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import APIErrorBoundary from './APIErrorBoundary';
import { useToastNotifications } from './ToastNotification';
import { 
  classifyError, 
  retryWithBackoff, 
  RetryConfig,
  ErrorType
} from '../utils/error-handling';

// ============================================================================
// Mock API Functions for Testing
// ============================================================================

const mockAPICall = async (shouldFail: boolean, errorType: string = 'network'): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (shouldFail) {
    const error = new Error(`Mock ${errorType} error`);
    error.name = errorType === 'network' ? 'NetworkError' : 'APIError';
    throw error;
  }
  
  return 'Success!';
};

const mockLongRunningTask = async (progressCallback: (progress: number) => void): Promise<string> => {
  for (let i = 0; i <= 100; i += 10) {
    await new Promise(resolve => setTimeout(resolve, 200));
    progressCallback(i);
  }
  return 'Task completed!';
};

// ============================================================================
// Error Simulation Component
// ============================================================================

const ErrorSimulation: React.FC = () => {
  const t = useTranslations('ErrorHandlingExample');
  const { showSuccess, showError, showWarning, showProgress, updateProgress, completeProgress } = useToastNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleNetworkError = async () => {
    setIsLoading(true);
    try {
      await mockAPICall(true, 'network');
    } catch (error) {
      const classified = classifyError(error, { component: 'ErrorSimulation', action: 'network_test' });
      showError('Network Error', classified.message, {
        label: 'Retry',
        onClick: handleNetworkError
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = async () => {
    setIsLoading(true);
    try {
      await mockAPICall(true, 'auth');
    } catch {
      showError('Authentication Error', 'Your session has expired. Please sign in again.', {
        label: 'Sign In',
        onClick: () => console.log('Redirect to login')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidationError = async () => {
    setIsLoading(true);
    try {
      await mockAPICall(true, 'validation');
    } catch {
      showError('Validation Error', 'Please check your input and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleServerError = async () => {
    setIsLoading(true);
    try {
      await mockAPICall(true, 'server');
    } catch {
      showError('Server Error', 'A server error occurred. Please try again later.', {
        label: 'Retry',
        onClick: handleServerError
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = async () => {
    setIsLoading(true);
    try {
      await mockAPICall(false);
      showSuccess('Success!', 'The operation completed successfully.');
    } catch {
      showError('Unexpected Error', 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressTask = async () => {
    setProgress(0);
    const progressId = showProgress('Long Running Task', 'Processing your request...', 0, 100);
    
    try {
      await mockLongRunningTask((currentProgress) => {
        setProgress(currentProgress);
        updateProgress(progressId, currentProgress, 100);
      });
      
      completeProgress(progressId, 'Task completed successfully!');
    } catch {
      showError('Task Failed', 'The long running task failed.');
    }
  };

  const handleRetryWithBackoff = async () => {
    setIsLoading(true);
    
    const retryConfig: RetryConfig = {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 5000,
      backoffMultiplier: 2,
      retryCondition: (error) => error.type === ErrorType.NETWORK
    };

    try {
      await retryWithBackoff(
        () => mockAPICall(true, 'network'),
        retryConfig,
        (attempt) => {
          showWarning('Retry Attempt', `Attempt ${attempt} failed. Retrying...`);
        }
      );
    } catch {
      showError('Retry Failed', `All ${retryConfig.maxAttempts} attempts failed. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-white mb-4">{t('title')}</h2>
      <p className="text-gray-300 mb-6">{t('description')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleNetworkError}
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-colors"
        >
          {isLoading ? 'Testing...' : 'Simulate Network Error'}
        </button>

        <button
          onClick={handleAuthError}
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-colors"
        >
          {isLoading ? 'Testing...' : 'Simulate Auth Error'}
        </button>

        <button
          onClick={handleValidationError}
          disabled={isLoading}
          className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-colors"
        >
          {isLoading ? 'Testing...' : 'Simulate Validation Error'}
        </button>

        <button
          onClick={handleServerError}
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-colors"
        >
          {isLoading ? 'Testing...' : 'Simulate Server Error'}
        </button>

        <button
          onClick={handleSuccess}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-colors"
        >
          {isLoading ? 'Testing...' : 'Simulate Success'}
        </button>

        <button
          onClick={handleProgressTask}
          disabled={progress > 0}
          className="bg-primaryOrange-500 hover:bg-primaryOrange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-colors"
        >
          {progress > 0 ? `${progress}%` : 'Simulate Progress Task'}
        </button>

        <button
          onClick={handleRetryWithBackoff}
          disabled={isLoading}
          className="bg-deepPurple-500 hover:bg-deepPurple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-colors"
        >
          {isLoading ? 'Retrying...' : 'Test Retry with Backoff'}
        </button>
      </div>

      {progress > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-primaryOrange-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-primaryOrange-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Error Boundary Test Component
// ============================================================================

const ErrorBoundaryTest: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('This is a test error for the error boundary!');
  }

  return (
    <div className="glass-card p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Error Boundary Test</h3>
      <p className="text-gray-300 mb-4">
        Click the button below to trigger an error that will be caught by the error boundary.
      </p>
      <button
        onClick={() => setShouldThrow(true)}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
      >
        Trigger Error Boundary
      </button>
    </div>
  );
};

// ============================================================================
// Main Error Handling Example Component
// ============================================================================

const ErrorHandlingExample: React.FC = () => {
  const t = useTranslations('ErrorHandlingExample');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{t('mainTitle')}</h1>
          <p className="text-primaryOrange-200 text-lg">{t('mainSubtitle')}</p>
        </div>

        <div className="space-y-8">
          <ErrorSimulation />
          
          <APIErrorBoundary
            context={{ component: 'ErrorHandlingExample', action: 'test_boundary' }}
            showRetryButton={true}
            showContactSupport={true}
          >
            <ErrorBoundaryTest />
          </APIErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandlingExample;
