'use client';

import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { containers, responsiveUtils } from '@/lib/responsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'mobile' | 'tablet' | 'desktop' | 'wide' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
  fluid?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  maxWidth = 'desktop',
  padding = 'md',
  center = true,
  fluid = false,
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Get responsive padding classes
  const getPaddingClass = () => {
    if (padding === 'none') return '';
    if (padding === 'sm') return 'px-2 sm:px-4 md:px-6';
    if (padding === 'md') return 'px-4 sm:px-6 md:px-8';
    if (padding === 'lg') return 'px-6 sm:px-8 md:px-12';
    if (padding === 'xl') return 'px-8 sm:px-12 md:px-16';
    return 'px-4 sm:px-6 md:px-8';
  };

  // Get max width class
  const getMaxWidthClass = () => {
    if (fluid) return 'w-full';
    if (maxWidth === 'full') return 'w-full';
    if (maxWidth === 'mobile') return 'max-w-sm';
    if (maxWidth === 'tablet') return 'max-w-4xl';
    if (maxWidth === 'desktop') return 'max-w-6xl';
    if (maxWidth === 'wide') return 'max-w-7xl';
    return 'max-w-6xl';
  };

  // Get center class
  const getCenterClass = () => {
    return center ? 'mx-auto' : '';
  };

  // Combine all classes
  const containerClasses = [
    'w-full',
    getMaxWidthClass(),
    getPaddingClass(),
    getCenterClass(),
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  responsive = true,
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Get grid columns class
  const getGridColsClass = () => {
    if (!responsive) {
      return `grid-cols-${cols.desktop}`;
    }
    
    const mobileCols = cols.mobile;
    const tabletCols = cols.tablet;
    const desktopCols = cols.desktop;
    
    return `grid-cols-${mobileCols} sm:grid-cols-${tabletCols} md:grid-cols-${desktopCols}`;
  };

  // Get gap class
  const getGapClass = () => {
    if (gap === 'sm') return 'gap-2 sm:gap-4 md:gap-6';
    if (gap === 'md') return 'gap-4 sm:gap-6 md:gap-8';
    if (gap === 'lg') return 'gap-6 sm:gap-8 md:gap-12';
    if (gap === 'xl') return 'gap-8 sm:gap-12 md:gap-16';
    return 'gap-4 sm:gap-6 md:gap-8';
  };

  const gridClasses = [
    'grid',
    getGridColsClass(),
    getGapClass(),
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

// Responsive Flex Component
interface ResponsiveFlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  responsive?: boolean;
  wrap?: boolean;
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ResponsiveFlex: React.FC<ResponsiveFlexProps> = ({
  children,
  className = '',
  direction = 'row',
  responsive = true,
  wrap = false,
  justify = 'start',
  align = 'start',
  gap = 'md',
}) => {
  // Get flex direction class
  const getDirectionClass = () => {
    if (!responsive) {
      return `flex-${direction}`;
    }
    
    if (direction === 'col') {
      return 'flex-col sm:flex-row';
    }
    if (direction === 'row') {
      return 'flex-row sm:flex-col';
    }
    return `flex-${direction}`;
  };

  // Get wrap class
  const getWrapClass = () => {
    return wrap ? 'flex-wrap' : 'flex-nowrap';
  };

  // Get justify class
  const getJustifyClass = () => {
    return `justify-${justify}`;
  };

  // Get align class
  const getAlignClass = () => {
    return `items-${align}`;
  };

  // Get gap class
  const getGapClass = () => {
    if (gap === 'sm') return 'gap-2 sm:gap-4 md:gap-6';
    if (gap === 'md') return 'gap-4 sm:gap-6 md:gap-8';
    if (gap === 'lg') return 'gap-6 sm:gap-8 md:gap-12';
    if (gap === 'xl') return 'gap-8 sm:gap-12 md:gap-16';
    return 'gap-4 sm:gap-6 md:gap-8';
  };

  const flexClasses = [
    'flex',
    getDirectionClass(),
    getWrapClass(),
    getJustifyClass(),
    getAlignClass(),
    getGapClass(),
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={flexClasses}>
      {children}
    </div>
  );
};

// Responsive Section Component
interface ResponsiveSectionProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  background?: 'none' | 'white' | 'gray' | 'gradient';
  fullHeight?: boolean;
}

export const ResponsiveSection: React.FC<ResponsiveSectionProps> = ({
  children,
  className = '',
  padding = 'lg',
  margin = 'none',
  background = 'none',
  fullHeight = false,
}) => {
  // Get padding class
  const getPaddingClass = () => {
    if (padding === 'none') return '';
    if (padding === 'sm') return 'py-4 sm:py-6 md:py-8';
    if (padding === 'md') return 'py-6 sm:py-8 md:py-12';
    if (padding === 'lg') return 'py-8 sm:py-12 md:py-16';
    if (padding === 'xl') return 'py-12 sm:py-16 md:py-20';
    if (padding === '2xl') return 'py-16 sm:py-20 md:py-24';
    return 'py-8 sm:py-12 md:py-16';
  };

  // Get margin class
  const getMarginClass = () => {
    if (margin === 'none') return '';
    if (margin === 'sm') return 'my-4 sm:my-6 md:my-8';
    if (margin === 'md') return 'my-6 sm:my-8 md:my-12';
    if (margin === 'lg') return 'my-8 sm:my-12 md:my-16';
    if (margin === 'xl') return 'my-12 sm:my-16 md:my-20';
    if (margin === '2xl') return 'my-16 sm:my-20 md:my-24';
    return 'my-8 sm:my-12 md:my-16';
  };

  // Get background class
  const getBackgroundClass = () => {
    if (background === 'none') return '';
    if (background === 'white') return 'bg-white';
    if (background === 'gray') return 'bg-gray-50';
    if (background === 'gradient') return 'bg-gradient-to-br from-gray-50 to-purple-50';
    return '';
  };

  // Get height class
  const getHeightClass = () => {
    return fullHeight ? 'min-h-screen' : '';
  };

  const sectionClasses = [
    'w-full',
    getPaddingClass(),
    getMarginClass(),
    getBackgroundClass(),
    getHeightClass(),
    className,
  ].filter(Boolean).join(' ');

  return (
    <section className={sectionClasses}>
      {children}
    </section>
  );
};

export default ResponsiveContainer;
