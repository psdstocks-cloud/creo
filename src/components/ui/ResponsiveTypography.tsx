'use client';

import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { typography } from '@/lib/responsive';

// Responsive Heading Component
interface ResponsiveHeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  color?: 'primary' | 'secondary' | 'muted' | 'accent';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  responsive?: boolean;
}

export const ResponsiveHeading: React.FC<ResponsiveHeadingProps> = ({
  children,
  level = 1,
  className = '',
  color = 'primary',
  weight = 'bold',
  align = 'left',
  responsive = true,
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Get responsive typography classes
  const getTypographyClasses = () => {
    if (!responsive) {
      return typography.desktop[`h${level}` as keyof typeof typography.desktop];
    }

    if (isMobile) {
      return typography.mobile[`h${level}` as keyof typeof typography.mobile];
    } else if (isTablet) {
      return typography.tablet[`h${level}` as keyof typeof typography.tablet];
    } else {
      return typography.desktop[`h${level}` as keyof typeof typography.desktop];
    }
  };

  // Get color classes
  const getColorClasses = () => {
    if (color === 'primary') return 'text-gray-900';
    if (color === 'secondary') return 'text-gray-700';
    if (color === 'muted') return 'text-gray-500';
    if (color === 'accent') return 'text-orange-600';
    return 'text-gray-900';
  };

  // Get weight classes
  const getWeightClasses = () => {
    if (weight === 'light') return 'font-light';
    if (weight === 'normal') return 'font-normal';
    if (weight === 'medium') return 'font-medium';
    if (weight === 'semibold') return 'font-semibold';
    if (weight === 'bold') return 'font-bold';
    return 'font-bold';
  };

  // Get alignment classes
  const getAlignClasses = () => {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };

  const headingClasses = [
    getTypographyClasses(),
    getColorClasses(),
    getWeightClasses(),
    getAlignClasses(),
    className,
  ].join(' ');

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag className={headingClasses}>
      {children}
    </HeadingTag>
  );
};

// Responsive Text Component
interface ResponsiveTextProps {
  children: React.ReactNode;
  variant?: 'body' | 'small' | 'caption' | 'lead';
  className?: string;
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  responsive?: boolean;
  as?: 'p' | 'span' | 'div';
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  variant = 'body',
  className = '',
  color = 'primary',
  weight = 'normal',
  align = 'left',
  responsive = true,
  as: Component = 'p',
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Get responsive typography classes
  const getTypographyClasses = () => {
    if (!responsive) {
      return typography.desktop[variant];
    }

    if (isMobile) {
      return typography.mobile[variant];
    } else if (isTablet) {
      return typography.tablet[variant];
    } else {
      return typography.desktop[variant];
    }
  };

  // Get color classes
  const getColorClasses = () => {
    if (color === 'primary') return 'text-gray-900';
    if (color === 'secondary') return 'text-gray-700';
    if (color === 'muted') return 'text-gray-500';
    if (color === 'accent') return 'text-orange-600';
    if (color === 'success') return 'text-green-600';
    if (color === 'warning') return 'text-yellow-600';
    if (color === 'error') return 'text-red-600';
    return 'text-gray-900';
  };

  // Get weight classes
  const getWeightClasses = () => {
    if (weight === 'light') return 'font-light';
    if (weight === 'normal') return 'font-normal';
    if (weight === 'medium') return 'font-medium';
    if (weight === 'semibold') return 'font-semibold';
    if (weight === 'bold') return 'font-bold';
    return 'font-normal';
  };

  // Get alignment classes
  const getAlignClasses = () => {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    if (align === 'justify') return 'text-justify';
    return 'text-left';
  };

  const textClasses = [
    getTypographyClasses(),
    getColorClasses(),
    getWeightClasses(),
    getAlignClasses(),
    className,
  ].join(' ');

  return (
    <Component className={textClasses}>
      {children}
    </Component>
  );
};

// Responsive Link Component
interface ResponsiveLinkProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  underline?: boolean;
  external?: boolean;
  disabled?: boolean;
}

export const ResponsiveLink: React.FC<ResponsiveLinkProps> = ({
  children,
  href,
  onClick,
  className = '',
  variant = 'default',
  size = 'md',
  underline = true,
  external = false,
  disabled = false,
}) => {
  const { isMobile } = useResponsive();

  // Get variant classes
  const getVariantClasses = () => {
    if (variant === 'primary') return 'text-orange-600 hover:text-orange-700';
    if (variant === 'secondary') return 'text-gray-600 hover:text-gray-700';
    if (variant === 'accent') return 'text-blue-600 hover:text-blue-700';
    return 'text-gray-900 hover:text-gray-700';
  };

  // Get size classes
  const getSizeClasses = () => {
    if (size === 'sm') return 'text-sm';
    if (size === 'lg') return 'text-lg';
    return 'text-base';
  };

  // Get underline classes
  const getUnderlineClasses = () => {
    if (underline) return 'underline hover:no-underline';
    return 'no-underline hover:underline';
  };

  // Get disabled classes
  const getDisabledClasses = () => {
    if (disabled) return 'opacity-50 cursor-not-allowed pointer-events-none';
    return '';
  };

  // Get mobile optimizations
  const getMobileClasses = () => {
    if (isMobile) return 'min-h-[44px] flex items-center'; // Minimum touch target
    return '';
  };

  const linkClasses = [
    'inline-flex',
    'items-center',
    'transition-colors',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-orange-500',
    'focus:ring-offset-2',
    getVariantClasses(),
    getSizeClasses(),
    getUnderlineClasses(),
    getDisabledClasses(),
    getMobileClasses(),
    className,
  ].join(' ');

  const linkProps = {
    className: linkClasses,
    onClick: disabled ? undefined : onClick,
    'aria-disabled': disabled,
    ...(external && { target: '_blank', rel: 'noopener noreferrer' }),
  };

  if (href && !disabled) {
    return (
      <a href={href} {...linkProps}>
        {children}
        {external && (
          <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )}
      </a>
    );
  }

  return (
    <button {...linkProps} type="button">
      {children}
    </button>
  );
};

// Responsive Code Component
interface ResponsiveCodeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'inline' | 'block';
  language?: string;
  showLineNumbers?: boolean;
}

export const ResponsiveCode: React.FC<ResponsiveCodeProps> = ({
  children,
  className = '',
  variant = 'inline',
  language,
  showLineNumbers = false,
}) => {
  const { isMobile } = useResponsive();

  const getVariantClasses = () => {
    if (variant === 'block') {
      return [
        'block',
        'w-full',
        'p-4',
        'bg-gray-900',
        'text-gray-100',
        'rounded-lg',
        'overflow-x-auto',
        'font-mono',
        'text-sm',
        isMobile ? 'text-xs' : 'text-sm',
      ].join(' ');
    }
    return [
      'inline',
      'px-1.5',
      'py-0.5',
      'bg-gray-100',
      'text-gray-800',
      'rounded',
      'font-mono',
      'text-sm',
    ].join(' ');
  };

  const codeClasses = [
    getVariantClasses(),
    className,
  ].join(' ');

  if (variant === 'block') {
    return (
      <pre className={codeClasses}>
        <code className={language ? `language-${language}` : ''}>
          {children}
        </code>
      </pre>
    );
  }

  return (
    <code className={codeClasses}>
      {children}
    </code>
  );
};

// Responsive Quote Component
interface ResponsiveQuoteProps {
  children: React.ReactNode;
  author?: string;
  source?: string;
  className?: string;
  variant?: 'default' | 'accent' | 'minimal';
}

export const ResponsiveQuote: React.FC<ResponsiveQuoteProps> = ({
  children,
  author,
  source,
  className = '',
  variant = 'default',
}) => {
  const { isMobile } = useResponsive();

  const getVariantClasses = () => {
    if (variant === 'accent') {
      return [
        'border-l-4',
        'border-orange-500',
        'bg-orange-50',
        'pl-4',
        'py-2',
      ].join(' ');
    } else if (variant === 'minimal') {
      return [
        'border-l-2',
        'border-gray-300',
        'pl-4',
        'py-2',
      ].join(' ');
    }
    return [
      'border-l-4',
      'border-gray-300',
      'bg-gray-50',
      'pl-4',
      'py-2',
    ].join(' ');
  };

  const quoteClasses = [
    'italic',
    'text-gray-700',
    isMobile ? 'text-sm' : 'text-base',
    getVariantClasses(),
    className,
  ].join(' ');

  return (
    <blockquote className={quoteClasses}>
      <ResponsiveText variant="body" className="mb-2">
        "{children}"
      </ResponsiveText>
      {(author || source) && (
        <footer className="text-sm text-gray-500">
          {author && <cite className="font-medium">{author}</cite>}
          {author && source && <span> — </span>}
          {source && <span>{source}</span>}
        </footer>
      )}
    </blockquote>
  );
};

// Responsive List Component
interface ResponsiveListProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'bullet' | 'number' | 'none';
  spacing?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
}

export const ResponsiveList: React.FC<ResponsiveListProps> = ({
  children,
  className = '',
  variant = 'bullet',
  spacing = 'md',
  responsive = true,
}) => {
  const { isMobile } = useResponsive();

  const getVariantClasses = () => {
    if (variant === 'number') return 'list-decimal';
    if (variant === 'none') return 'list-none';
    return 'list-disc';
  };

  const getSpacingClasses = () => {
    if (spacing === 'sm') return 'space-y-1';
    if (spacing === 'lg') return 'space-y-3';
    return 'space-y-2';
  };

  const getResponsiveClasses = () => {
    if (!responsive) return '';
    if (isMobile) return 'pl-4';
    return 'pl-6';
  };

  const listClasses = [
    getVariantClasses(),
    getSpacingClasses(),
    getResponsiveClasses(),
    className,
  ].join(' ');

  return (
    <ul className={listClasses}>
      {children}
    </ul>
  );
};

// Responsive List Item Component
interface ResponsiveListItemProps {
  children: React.ReactNode;
  className?: string;
  marker?: 'default' | 'check' | 'arrow' | 'star';
}

export const ResponsiveListItem: React.FC<ResponsiveListItemProps> = ({
  children,
  className = '',
  marker = 'default',
}) => {
  const getMarkerClasses = () => {
    if (marker === 'check') return 'list-none before:content-["✓"] before:text-green-500 before:font-bold before:mr-2';
    if (marker === 'arrow') return 'list-none before:content-["→"] before:text-orange-500 before:font-bold before:mr-2';
    if (marker === 'star') return 'list-none before:content-["★"] before:text-yellow-500 before:font-bold before:mr-2';
    return '';
  };

  const itemClasses = [
    getMarkerClasses(),
    className,
  ].join(' ');

  return (
    <li className={itemClasses}>
      {children}
    </li>
  );
};

export default ResponsiveHeading;
