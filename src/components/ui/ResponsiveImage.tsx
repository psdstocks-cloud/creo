'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useResponsiveImage } from '@/hooks/useResponsive';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  fallback?: React.ReactNode;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  loading = 'lazy',
  onLoad,
  onError,
  fallback,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { getImageSize, getImageQuality } = useResponsiveImage();

  // Get responsive image size
  const getResponsiveSize = () => {
    if (width && height) {
      return {
        width: getImageSize(width),
        height: getImageSize(height),
      };
    }
    return { width, height };
  };

  // Get responsive quality
  const getResponsiveQuality = () => {
    return quality || getImageQuality();
  };

  // Get responsive sizes
  const getResponsiveSizes = () => {
    if (sizes) return sizes;
    return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  };

  // Get object fit classes
  const getObjectFitClasses = () => {
    if (objectFit === 'cover') return 'object-cover';
    if (objectFit === 'contain') return 'object-contain';
    if (objectFit === 'fill') return 'object-fill';
    if (objectFit === 'none') return 'object-none';
    if (objectFit === 'scale-down') return 'object-scale-down';
    return 'object-cover';
  };

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  if (imageError && fallback) {
    return <>{fallback}</>;
  }

  const imageProps = {
    src,
    alt,
    className: `${getObjectFitClasses()} ${className}`,
    priority,
    quality: getResponsiveQuality(),
    placeholder,
    blurDataURL,
    sizes: getResponsiveSizes(),
    loading,
    onLoad: handleLoad,
    onError: handleError,
    style: {
      objectPosition,
    },
  };

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          {...imageProps}
          fill
        />
      </div>
    );
  }

  const responsiveSize = getResponsiveSize();

  return (
    <Image
      {...imageProps}
      width={responsiveSize.width}
      height={responsiveSize.height}
    />
  );
};

// Responsive Image Gallery Component
interface ResponsiveImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  aspectRatio?: 'square' | 'video' | 'wide' | 'tall' | 'auto';
  showCaptions?: boolean;
  lightbox?: boolean;
}

export const ResponsiveImageGallery: React.FC<ResponsiveImageGalleryProps> = ({
  images,
  className = '',
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  aspectRatio = 'video',
  showCaptions = true,
  lightbox = false,
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Get responsive columns
  const getColumns = () => {
    if (isMobile) return columns.mobile;
    if (isTablet) return columns.tablet;
    return columns.desktop;
  };

  // Get gap classes
  const getGapClasses = () => {
    if (gap === 'sm') return 'gap-2';
    if (gap === 'md') return 'gap-4';
    if (gap === 'lg') return 'gap-6';
    return 'gap-4';
  };

  // Get aspect ratio classes
  const getAspectRatioClasses = () => {
    if (aspectRatio === 'square') return 'aspect-square';
    if (aspectRatio === 'video') return 'aspect-video';
    if (aspectRatio === 'wide') return 'aspect-[16/9]';
    if (aspectRatio === 'tall') return 'aspect-[3/4]';
    return '';
  };

  const gridClasses = [
    'grid',
    `grid-cols-${getColumns()}`,
    getGapClasses(),
    className,
  ].join(' ');

  return (
    <div className={gridClasses}>
      {images.map((image, index) => (
        <div key={index} className="group relative overflow-hidden rounded-lg">
          <ResponsiveImage
            src={image.src}
            alt={image.alt}
            className={`w-full h-full ${getAspectRatioClasses()}`}
            objectFit="cover"
            sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`}
          />
          {showCaptions && image.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-sm">{image.caption}</p>
            </div>
          )}
          {lightbox && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Responsive Avatar Component
interface ResponsiveAvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  fallback?: React.ReactNode;
  status?: 'online' | 'offline' | 'away' | 'busy';
  statusColor?: string;
  ring?: boolean;
  ringColor?: string;
}

export const ResponsiveAvatar: React.FC<ResponsiveAvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  fallback,
  status,
  statusColor,
  ring = false,
  ringColor = 'orange-500',
}) => {
  const { isMobile } = useResponsive();

  // Get size classes
  const getSizeClasses = () => {
    const sizes = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-20 h-20 text-2xl',
    };
    return sizes[size];
  };

  // Get ring classes
  const getRingClasses = () => {
    if (!ring) return '';
    return `ring-2 ring-${ringColor}`;
  };

  // Get status classes
  const getStatusClasses = () => {
    if (!status) return '';
    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
    };
    return statusColors[status];
  };

  // Get initials from name
  const getInitials = () => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarClasses = [
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'bg-gray-200',
    'text-gray-600',
    'font-medium',
    'overflow-hidden',
    getSizeClasses(),
    getRingClasses(),
    className,
  ].join(' ');

  return (
    <div className="relative">
      <div className={avatarClasses}>
        {src ? (
          <ResponsiveImage
            src={src}
            alt={alt || name || 'Avatar'}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : fallback ? (
          fallback
        ) : (
          <span>{getInitials()}</span>
        )}
      </div>
      {status && (
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusClasses()}`}
          style={statusColor ? { backgroundColor: statusColor } : {}}
        />
      )}
    </div>
  );
};

// Responsive Image Carousel Component
interface ResponsiveImageCarouselProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  showThumbnails?: boolean;
}

export const ResponsiveImageCarousel: React.FC<ResponsiveImageCarouselProps> = ({
  images,
  className = '',
  autoplay = false,
  autoplayInterval = 3000,
  showDots = true,
  showArrows = true,
  showThumbnails = false,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { isMobile } = useResponsive();

  // Autoplay effect
  React.useEffect(() => {
    if (!autoplay || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (images.length === 0) return null;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <ResponsiveImage
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="w-full h-full object-cover transition-transform duration-500"
          fill
        />
        
        {/* Caption */}
        {images[currentIndex].caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white text-sm">{images[currentIndex].caption}</p>
          </div>
        )}

        {/* Navigation Arrows */}
        {showArrows && images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-200"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-200"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {showDots && images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex space-x-2 mt-4 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-opacity duration-200 ${
                index === currentIndex ? 'opacity-100 ring-2 ring-orange-500' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <ResponsiveImage
                src={image.src}
                alt={image.alt}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;
