/**
 * Optimized Image Component
 * 
 * Performance-optimized image component with lazy loading,
 * blur placeholders, and responsive loading.
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
// import { useLazyImage } from '../utils/performance';

// ============================================================================
// Types and Interfaces
// ============================================================================

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  fallback?: React.ReactNode;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
}

// ============================================================================
// Blur Placeholder Generator
// ============================================================================

const generateBlurDataURL = (width: number, height: number, color: string = '#1f2937'): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  canvas.width = width;
  canvas.height = height;
  
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
};

// ============================================================================
// Loading Skeleton Component
// ============================================================================

interface LoadingSkeletonProps {
  width: number;
  height: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ width, height, className = '' }) => (
  <div 
    className={`animate-pulse bg-gray-700 rounded ${className}`}
    style={{ width, height }}
  >
    <div className="w-full h-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded animate-pulse"></div>
  </div>
);

// ============================================================================
// Error Fallback Component
// ============================================================================

interface ErrorFallbackProps {
  width: number;
  height: number;
  className?: string;
  onRetry?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  width, 
  height, 
  className = '', 
  onRetry 
}) => (
  <div 
    className={`bg-gray-800 border border-gray-700 rounded flex items-center justify-center ${className}`}
    style={{ width, height }}
  >
    <div className="text-center">
      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="text-xs text-gray-400 mb-2">Failed to load</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-primaryOrange-400 hover:text-primaryOrange-300 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  </div>
);

// ============================================================================
// Main Optimized Image Component
// ============================================================================

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 300,
  height = 200,
  className = '',
  placeholder,
  blurDataURL,
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  style,
  onClick,
  onLoad,
  onError,
  fallback,
  loading = 'lazy',
  decoding = 'async'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLDivElement>(null);
  const maxRetries = 3;

  // Generate blur placeholder if not provided
  const defaultBlurDataURL = blurDataURL || generateBlurDataURL(width, height);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsError(false);
    onLoad?.();
  }, [onLoad]);

  // Handle image error
  const handleError = useCallback(() => {
    setIsError(true);
    setIsLoaded(false);
    onError?.();
  }, [onError]);

  // Handle retry
  const handleRetry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setIsError(false);
      setIsLoaded(false);
    }
  }, [retryCount, maxRetries]);

  // Don't render if not in view and not priority
  if (!isInView && !priority) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-700 rounded ${className}`}
        style={{ width, height, ...style }}
      >
        <LoadingSkeleton width={width} height={height} />
      </div>
    );
  }

  // Show error fallback
  if (isError && retryCount >= maxRetries) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <ErrorFallback
        width={width}
        height={height}
        className={className}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden rounded ${className}`}
      style={{ width, height, ...style }}
      onClick={onClick}
    >
      {/* Loading skeleton */}
      {!isLoaded && !isError && (
        <LoadingSkeleton width={width} height={height} />
      )}

      {/* Actual image */}
      {isInView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          <Image
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            className={`object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            quality={quality}
            sizes={sizes}
            priority={priority}
            loading={loading}
            decoding={decoding}
            placeholder={defaultBlurDataURL ? 'blur' : 'empty'}
            blurDataURL={defaultBlurDataURL}
            onLoad={handleLoad}
            onError={handleError}
          />
        </motion.div>
      )}

      {/* Loading indicator */}
      {!isLoaded && !isError && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOrange-500"></div>
        </div>
      )}

      {/* Error state */}
      {isError && retryCount < maxRetries && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
          <button
            onClick={handleRetry}
            className="bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Retry ({retryCount}/{maxRetries})
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Responsive Image Component
// ============================================================================

interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'width' | 'height'> {
  aspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  aspectRatio = 16 / 9,
  maxWidth = 800,
  maxHeight = 600,
  breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 },
  ...props
}) => {
  const [containerWidth, setContainerWidth] = useState(maxWidth);
  const [containerHeight, setContainerHeight] = useState(maxHeight);

  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(window.innerWidth, maxWidth);
      const height = Math.min(width / aspectRatio, maxHeight);
      setContainerWidth(width);
      setContainerHeight(height);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [aspectRatio, maxWidth, maxHeight]);

  return (
    <OptimizedImage
      {...props}
      width={containerWidth}
      height={containerHeight}
      sizes={`(max-width: ${breakpoints.sm}px) 100vw, (max-width: ${breakpoints.md}px) 50vw, (max-width: ${breakpoints.lg}px) 33vw, (max-width: ${breakpoints.xl}px) 25vw, 20vw`}
    />
  );
};

// ============================================================================
// Image Gallery Component
// ============================================================================

interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    thumbnail?: string;
  }>;
  columns?: number;
  gap?: number;
  onImageClick?: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  gap = 16,
  onImageClick
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleImageClick = useCallback((index: number) => {
    setSelectedImage(index);
    onImageClick?.(index);
  }, [onImageClick]);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return (
    <>
      <div 
        className="grid gap-4"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`
        }}
      >
        {images.map((image, index) => (
          <OptimizedImage
            key={index}
            src={image.thumbnail || image.src}
            alt={image.alt}
            width={300}
            height={200}
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>

      {/* Modal for selected image */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <OptimizedImage
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              width={800}
              height={600}
              className="rounded-lg"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default OptimizedImage;
export { ResponsiveImage, ImageGallery, LoadingSkeleton, ErrorFallback };
