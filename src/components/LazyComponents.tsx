/**
 * Lazy Components
 * 
 * Code-split components for lazy loading and bundle optimization.
 * These components are loaded only when needed to improve initial bundle size.
 */

'use client';

import React from 'react';
import { createLazyComponent } from '../utils/performance-simple';

// ============================================================================
// Lazy Loading Fallbacks
// ============================================================================

const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOrange-500"></div>
    <span className="ml-3 text-white">Loading...</span>
  </div>
);

const ErrorFallback: React.FC<{ error?: Error; retry?: () => void }> = ({ error, retry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Component</h3>
    <p className="text-gray-300 mb-4">
      {error?.message || 'An error occurred while loading this component.'}
    </p>
    {retry && (
      <button
        onClick={retry}
        className="bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

// ============================================================================
// AI Generation Components
// ============================================================================

export const LazyAIGenerationInterface = createLazyComponent(
  () => import('./AIGenerationInterface')
);

// Removed AIGenerationExample as it doesn't exist

// ============================================================================
// Order Management Components
// ============================================================================

export const LazyOrderManagement = createLazyComponent(
  () => import('./OrderManagement')
);

export const LazyOptimizedOrderManagement = createLazyComponent(
  () => import('./OptimizedOrderManagement')
);

// ============================================================================
// Stock Media Components
// ============================================================================

export const LazyStockMediaSearch = createLazyComponent(
  () => import('./StockMediaSearch'),
);

export const LazyOptimizedStockMediaSearch = createLazyComponent(
  () => import('./OptimizedStockMediaSearch'),
);

// ============================================================================
// Authentication Components
// ============================================================================

export const LazyAuthModal = createLazyComponent(
  () => import('./AuthModal'),
);

export const LazyAuthButton = createLazyComponent(
  () => import('./AuthButton'),
);

export const LazyAuthTest = createLazyComponent(
  () => import('./AuthTest'),
);

// ============================================================================
// UI Components
// ============================================================================

export const LazyFAQAccordion = createLazyComponent(
  () => import('./FAQAccordionFriendly'),
);

export const LazyTestimonialsCarousel = createLazyComponent(
  () => import('./TestimonialsPlaceholderCarousel'),
);

export const LazyInteractivePricing = createLazyComponent(
  () => import('./InteractivePricingSliderExample'),
);

export const LazyPricingRollback = createLazyComponent(
  () => import('./PricingRollbackInfo'),
);

// ============================================================================
// Error Handling Components
// ============================================================================

export const LazyAPIErrorBoundary = createLazyComponent(
  () => import('./APIErrorBoundary'),
);

export const LazyToastNotification = createLazyComponent(
  () => import('./ToastNotification'),
);

export const LazyErrorHandlingExample = createLazyComponent(
  () => import('./ErrorHandlingExample'),
);

// ============================================================================
// Dashboard Components
// ============================================================================

// Removed DashboardPage and AdminDashboard as they don't exist

// ============================================================================
// Payment Components
// ============================================================================

export const LazyMockPaymentComponent = createLazyComponent(
  () => import('./MockPaymentComponent'),
);

// ============================================================================
// API Example Components
// ============================================================================

export const LazyNehtwAPIExample = createLazyComponent(
  () => import('./NehtwAPIExampleSimple'),
);

// ============================================================================
// Lazy Component Wrapper with Error Boundary
// ============================================================================

interface LazyComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error?: Error; retry?: () => void }>;
}

export const LazyComponentWrapper: React.FC<LazyComponentWrapperProps> = ({
  children,
  fallback: Fallback = LoadingFallback,
  errorFallback: ErrorFallbackComponent = ErrorFallback
}) => {
  const [error, setError] = React.useState<Error | null>(null);

  const handleRetry = React.useCallback(() => {
    setError(null);
  }, []);

  if (error) {
    return <ErrorFallbackComponent error={error} retry={handleRetry} />;
  }

  return (
    <React.Suspense fallback={<Fallback />}>
      <ErrorBoundary onError={setError}>
        {children}
      </ErrorBoundary>
    </React.Suspense>
  );
};

// Simple Error Boundary for lazy components
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null; // Let the parent handle the error
    }

    return this.props.children;
  }
}

// ============================================================================
// Preload Utilities
// ============================================================================

export const preloadAIGeneration = () => {
  return import('./AIGenerationInterface');
};

export const preloadOrderManagement = () => {
  return import('./OrderManagement');
};

export const preloadStockMediaSearch = () => {
  return import('./StockMediaSearch');
};

export const preloadAuthComponents = () => {
  return Promise.all([
    import('./AuthModal'),
    import('./AuthButton'),
    import('./AuthTest')
  ]);
};

export const preloadUIComponents = () => {
  return Promise.all([
    import('./FAQAccordionFriendly'),
    import('./TestimonialsPlaceholderCarousel'),
    import('./InteractivePricingSliderExample'),
    import('./PricingRollbackInfo')
  ]);
};

export const preloadErrorHandling = () => {
  return Promise.all([
    import('./APIErrorBoundary'),
    import('./ToastNotification'),
    import('./ErrorHandlingExample')
  ]);
};

// ============================================================================
// Bundle Analysis Utilities
// ============================================================================

export const getBundleInfo = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
    };
  }
  return null;
};

export const logBundleInfo = () => {
  const info = getBundleInfo();
  if (info && process.env.NODE_ENV === 'development') {
    console.group('📊 Bundle Performance');
    console.log('Load Time:', `${info.loadTime.toFixed(2)}ms`);
    console.log('DOM Content Loaded:', `${info.domContentLoaded.toFixed(2)}ms`);
    console.log('First Paint:', `${info.firstPaint.toFixed(2)}ms`);
    console.log('First Contentful Paint:', `${info.firstContentfulPaint.toFixed(2)}ms`);
    console.groupEnd();
  }
};

const LazyComponents = {
  // Lazy Components
  LazyAIGenerationInterface,
  LazyOrderManagement,
  LazyStockMediaSearch,
  LazyAuthModal,
  LazyAuthButton,
  LazyFAQAccordion,
  LazyTestimonialsCarousel,
  LazyInteractivePricing,
  LazyAPIErrorBoundary,
  LazyToastNotification,
  LazyErrorHandlingExample,
  LazyMockPaymentComponent,
  LazyNehtwAPIExample,
  
  // Wrappers
  LazyComponentWrapper,
  
  // Preload Functions
  preloadAIGeneration,
  preloadOrderManagement,
  preloadStockMediaSearch,
  preloadAuthComponents,
  preloadUIComponents,
  preloadErrorHandling,
  
  // Utilities
  getBundleInfo,
  logBundleInfo
};

export default LazyComponents;
