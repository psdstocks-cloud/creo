'use client';

import React from 'react';
import { useResponsiveCard } from '@/hooks/useResponsive';

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  shadow = 'md',
  hover = false,
  interactive = false,
  onClick,
}) => {
  const { getCardPadding, getCardBorderRadius } = useResponsiveCard();

  // Get card classes
  const getCardClasses = () => {
    const baseClasses = ['w-full', 'transition-all', 'duration-200'];

    // Variant classes
    if (variant === 'glass') {
      baseClasses.push('bg-white/10', 'backdrop-blur-md', 'border', 'border-white/20');
    } else if (variant === 'elevated') {
      baseClasses.push('bg-white', 'shadow-lg');
    } else if (variant === 'outlined') {
      baseClasses.push('bg-white', 'border', 'border-gray-200');
    } else {
      baseClasses.push('bg-white');
    }

    // Shadow classes
    if (shadow === 'sm') baseClasses.push('shadow-sm');
    if (shadow === 'md') baseClasses.push('shadow-md');
    if (shadow === 'lg') baseClasses.push('shadow-lg');
    if (shadow === 'xl') baseClasses.push('shadow-xl');

    // Rounded classes
    if (rounded === 'sm') baseClasses.push('rounded-sm');
    if (rounded === 'md') baseClasses.push('rounded-md');
    if (rounded === 'lg') baseClasses.push('rounded-lg');
    if (rounded === 'xl') baseClasses.push('rounded-xl');

    // Interactive classes
    if (interactive) {
      baseClasses.push('cursor-pointer', 'hover:shadow-lg', 'hover:scale-105');
    }

    // Hover effects
    if (hover) {
      baseClasses.push('hover:shadow-lg', 'hover:scale-105');
    }

    return baseClasses.join(' ');
  };

  // Get padding style
  const getPaddingStyle = () => {
    const paddingValue = getCardPadding();
    return { padding: paddingValue };
  };

  // Get border radius style
  const getBorderRadiusStyle = () => {
    const borderRadiusValue = getCardBorderRadius();
    return { borderRadius: borderRadiusValue };
  };

  const cardStyle = {
    ...getPaddingStyle(),
    ...getBorderRadiusStyle(),
  };

  const CardComponent = interactive ? 'button' : 'div';

  return (
    <CardComponent
      className={`${getCardClasses()} ${className}`}
      style={cardStyle}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </CardComponent>
  );
};

// Responsive Card Header Component
interface ResponsiveCardHeaderProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const ResponsiveCardHeader: React.FC<ResponsiveCardHeaderProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
}) => {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div className="flex-1">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-600 mb-2">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {action && (
        <div className="ml-4 flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

// Responsive Card Content Component
interface ResponsiveCardContentProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const ResponsiveCardContent: React.FC<ResponsiveCardContentProps> = ({
  children,
  className = '',
  padding = 'md',
}) => {
  const { getCardPadding } = useResponsiveCard();

  const getPaddingClass = () => {
    if (padding === 'none') return '';
    if (padding === 'sm') return 'p-2';
    if (padding === 'md') return 'p-4';
    if (padding === 'lg') return 'p-6';
    return 'p-4';
  };

  return (
    <div className={`${getPaddingClass()} ${className}`}>
      {children}
    </div>
  );
};

// Responsive Card Footer Component
interface ResponsiveCardFooterProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export const ResponsiveCardFooter: React.FC<ResponsiveCardFooterProps> = ({
  children,
  className = '',
  align = 'right',
}) => {
  const getAlignClass = () => {
    if (align === 'left') return 'justify-start';
    if (align === 'center') return 'justify-center';
    if (align === 'right') return 'justify-end';
    if (align === 'between') return 'justify-between';
    return 'justify-end';
  };

  return (
    <div className={`flex items-center ${getAlignClass()} ${className}`}>
      {children}
    </div>
  );
};

// Responsive Image Card Component
interface ResponsiveImageCardProps {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'tall';
  overlay?: boolean;
  onClick?: () => void;
}

export const ResponsiveImageCard: React.FC<ResponsiveImageCardProps> = ({
  src,
  alt,
  title,
  subtitle,
  className = '',
  aspectRatio = 'video',
  overlay = false,
  onClick,
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getAspectRatioClass = () => {
    if (aspectRatio === 'square') return 'aspect-square';
    if (aspectRatio === 'video') return 'aspect-video';
    if (aspectRatio === 'wide') return 'aspect-[16/9]';
    if (aspectRatio === 'tall') return 'aspect-[3/4]';
    return 'aspect-video';
  };

  const getImageSize = () => {
    if (isMobile) return 'w-full h-48';
    if (isTablet) return 'w-full h-56';
    return 'w-full h-64';
  };

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div className={`${getAspectRatioClass()} ${getImageSize()}`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {overlay && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
        )}
        {(title || subtitle) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            {title && (
              <h3 className="text-white font-semibold text-sm mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-white/80 text-xs">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Responsive Stats Card Component
interface ResponsiveStatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  className?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

export const ResponsiveStatsCard: React.FC<ResponsiveStatsCardProps> = ({
  title,
  value,
  change,
  icon,
  className = '',
  color = 'blue',
}) => {
  const { isMobile } = useResponsive();

  const getColorClasses = () => {
    if (color === 'blue') return 'text-blue-600 bg-blue-50';
    if (color === 'green') return 'text-green-600 bg-green-50';
    if (color === 'orange') return 'text-orange-600 bg-orange-50';
    if (color === 'red') return 'text-red-600 bg-red-50';
    if (color === 'purple') return 'text-purple-600 bg-purple-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getChangeColor = () => {
    if (!change) return '';
    return change.type === 'increase' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <ResponsiveCard className={`${className}`}>
      <ResponsiveCardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {value}
            </p>
            {change && (
              <p className={`text-sm font-medium ${getChangeColor()}`}>
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </p>
            )}
          </div>
          {icon && (
            <div className={`p-3 rounded-lg ${getColorClasses()}`}>
              {icon}
            </div>
          )}
        </div>
      </ResponsiveCardContent>
    </ResponsiveCard>
  );
};

// Responsive Grid Card Component
interface ResponsiveGridCardProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ResponsiveGridCard: React.FC<ResponsiveGridCardProps> = ({
  children,
  className = '',
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getGridClasses = () => {
    const baseClasses = ['grid'];

    // Responsive columns
    if (isMobile) {
      baseClasses.push(`grid-cols-${columns.mobile}`);
    } else if (isTablet) {
      baseClasses.push(`sm:grid-cols-${columns.tablet}`);
    } else {
      baseClasses.push(`md:grid-cols-${columns.desktop}`);
    }

    // Gap
    if (gap === 'sm') baseClasses.push('gap-2');
    if (gap === 'md') baseClasses.push('gap-4');
    if (gap === 'lg') baseClasses.push('gap-6');
    if (gap === 'xl') baseClasses.push('gap-8');

    return baseClasses.join(' ');
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveCard;
