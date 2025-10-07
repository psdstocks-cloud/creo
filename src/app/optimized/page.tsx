/**
 * Optimized Main Page
 * 
 * Performance-optimized version of the main page with lazy loading,
 * code splitting, and optimized rendering.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  LazyAuthTest,
  LazyNehtwAPIExample,
  LazyMockPaymentComponent,
  LazyComponentWrapper,
  preloadAuthComponents,
  preloadErrorHandling,
  logBundleInfo
} from '../../components/LazyComponents';
import { 
  usePerformanceMonitor,
  useMemoryMonitor,
  createOptimizedComponent
} from '../../utils/performance';

// ============================================================================
// Optimized Component Card
// ============================================================================

interface ComponentCardProps {
  title: string;
  description: string;
  href: string;
  gradient: string;
  icon: React.ReactNode;
  onHover?: () => void;
  onPreload?: () => void;
}

const ComponentCard: React.FC<ComponentCardProps> = React.memo(({ 
  title, 
  description, 
  href, 
  gradient, 
  icon, 
  onHover,
  onPreload
}) => {
  const handleMouseEnter = useCallback(() => {
    onHover?.();
    onPreload?.();
  }, [onHover, onPreload]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onMouseEnter={handleMouseEnter}
      className="glass-card p-6 rounded-lg group cursor-pointer transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-primaryOrange-500 to-deepPurple-500 rounded-lg flex items-center justify-center text-white text-xl">
          {icon}
        </div>
        <div className={`w-3 h-3 rounded-full ${gradient} opacity-60 group-hover:opacity-100 transition-opacity`}></div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primaryOrange-300 transition-colors">
        {title}
      </h3>
      
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {description}
      </p>
      
      <a 
        href={href}
        className={`inline-block w-full text-center py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${gradient} hover:shadow-lg hover:scale-105`}
      >
        View Component
      </a>
    </motion.div>
  );
});

ComponentCard.displayName = 'ComponentCard';

// ============================================================================
// Performance Monitor Component
// ============================================================================

const PerformanceMonitor: React.FC = React.memo(() => {
  const memoryInfo = useMemoryMonitor();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
        title="Show Performance Monitor"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-xl z-50 max-w-sm"
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-white">Performance Monitor</h4>
        <button
          onClick={toggleVisibility}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {memoryInfo && (
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Used Memory:</span>
            <span className="text-white">{(memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Memory:</span>
            <span className="text-white">{(memoryInfo.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Memory Limit:</span>
            <span className="text-white">{(memoryInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>
      )}
    </motion.div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

// ============================================================================
// Main Optimized Page Component
// ============================================================================

const OptimizedPage: React.FC = () => {
  const [, setPreloadedComponents] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Performance monitoring
  usePerformanceMonitor('OptimizedPage');

  // Preload critical components on mount
  useEffect(() => {
    const preloadCriticalComponents = async () => {
      try {
        await Promise.all([
          preloadAuthComponents(),
          preloadErrorHandling()
        ]);
        setPreloadedComponents(prev => new Set([...prev, 'auth', 'error-handling']));
      } catch (error) {
        console.error('Failed to preload critical components:', error);
      }
    };

    preloadCriticalComponents();
    
    // Log bundle info in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(logBundleInfo, 1000);
    }
  }, []);

  // Memoized component data
  const components = useMemo(() => [
    {
      title: 'AI Generation Interface',
      description: 'Advanced AI image generation with real-time progress and queue management',
      href: '/ai-generation',
      gradient: 'bg-gradient-to-r from-primaryOrange-500 to-deepPurple-500 hover:from-primaryOrange-600 hover:to-deepPurple-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      preload: () => Promise.resolve()
    },
    {
      title: 'Order Management',
      description: 'Complete order management with real-time updates and downloads',
      href: '/orders',
      gradient: 'bg-gradient-to-r from-deepPurple-500 to-blue-500 hover:from-deepPurple-600 hover:to-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      preload: () => Promise.resolve()
    },
    {
      title: 'Stock Media Search',
      description: 'Comprehensive search component with glassmorphism design',
      href: '/stock-search',
      gradient: 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      preload: () => Promise.resolve()
    },
    {
      title: 'Error Handling System',
      description: 'Comprehensive error handling with retry mechanisms and user feedback',
      href: '/error-handling',
      gradient: 'bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      preload: preloadErrorHandling
    }
  ], []);

  // Memoized handlers
  const handleComponentHover = useCallback((componentName: string) => {
    console.log(`Hovering over ${componentName}`);
  }, []);

  const handleComponentPreload = useCallback(async (preloadFn: () => Promise<unknown>) => {
    try {
      await preloadFn();
      console.log('Component preloaded successfully');
    } catch (error) {
      console.error('Failed to preload component:', error);
    }
  }, []);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primaryOrange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Optimized Components</h2>
          <p className="text-primaryOrange-200">Preparing performance-optimized experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white mb-4"
          >
            Creo - Optimized Components
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primaryOrange-200 text-xl"
          >
            Performance-optimized components with lazy loading and code splitting
          </motion.p>
        </div>

        {/* Performance Stats */}
        <div className="glass-card p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primaryOrange-500 mb-2">⚡</div>
              <h3 className="text-lg font-semibold text-white mb-1">Lazy Loading</h3>
              <p className="text-gray-300 text-sm">Components load only when needed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-deepPurple-500 mb-2">📦</div>
              <h3 className="text-lg font-semibold text-white mb-1">Code Splitting</h3>
              <p className="text-gray-300 text-sm">Smaller initial bundle size</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">🚀</div>
              <h3 className="text-lg font-semibold text-white mb-1">Optimized</h3>
              <p className="text-gray-300 text-sm">Virtual scrolling and memoization</p>
            </div>
          </div>
        </div>

        {/* Optimized Components Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Performance-Optimized Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {components.map((component, index) => (
              <motion.div
                key={component.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ComponentCard
                  title={component.title}
                  description={component.description}
                  href={component.href}
                  gradient={component.gradient}
                  icon={component.icon}
                  onHover={() => handleComponentHover(component.title)}
                  onPreload={() => handleComponentPreload(component.preload)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lazy Loaded Components Demo */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Lazy Loaded Components Demo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LazyComponentWrapper>
              <LazyAuthTest />
            </LazyComponentWrapper>
            
            <LazyComponentWrapper>
              <LazyNehtwAPIExample />
            </LazyComponentWrapper>
            
            <LazyComponentWrapper>
              <LazyMockPaymentComponent
                onPaymentSuccess={() => console.log('Payment successful!')}
                amount={25.99}
                description="Test Purchase"
              />
            </LazyComponentWrapper>
          </div>
        </div>

        {/* Performance Monitor */}
        <PerformanceMonitor />
      </div>
    </div>
  );
};

export default createOptimizedComponent(OptimizedPage, 'OptimizedPage');
