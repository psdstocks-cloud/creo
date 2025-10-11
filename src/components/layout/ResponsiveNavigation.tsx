'use client';

import React, { useState, useEffect } from 'react';
import { useResponsive, useResponsiveNavigation } from '@/hooks/useResponsive';
import { useTranslations } from 'next-intl';

interface NavigationItem {
  key: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
}

interface ResponsiveNavigationProps {
  items: NavigationItem[];
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'solid';
  sticky?: boolean;
  transparent?: boolean;
}

export const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  items,
  logo,
  actions,
  className = '',
  variant = 'default',
  sticky = true,
  transparent = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { getNavHeight, getNavItemHeight, shouldShowMobileMenu } = useResponsiveNavigation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Get navigation classes
  const getNavClasses = () => {
    const baseClasses = [
      'w-full',
      'transition-all',
      'duration-300',
      'ease-in-out',
    ];

    if (sticky) {
      baseClasses.push('sticky', 'top-0', 'z-50');
    }

    if (transparent && !isScrolled) {
      baseClasses.push('bg-transparent');
    } else {
      if (variant === 'glass') {
        baseClasses.push('bg-white/10', 'backdrop-blur-md', 'border-b', 'border-white/20');
      } else if (variant === 'solid') {
        baseClasses.push('bg-white', 'border-b', 'border-gray-200', 'shadow-sm');
      } else {
        baseClasses.push('bg-white', 'border-b', 'border-gray-200', 'shadow-sm');
      }
    }

    return baseClasses.join(' ');
  };

  // Get container classes
  const getContainerClasses = () => {
    return [
      'max-w-7xl',
      'mx-auto',
      'px-4',
      'sm:px-6',
      'lg:px-8',
    ].join(' ');
  };

  // Get nav item classes
  const getNavItemClasses = (isActive = false) => {
    const baseClasses = [
      'flex',
      'items-center',
      'space-x-2',
      'px-3',
      'py-2',
      'rounded-lg',
      'text-sm',
      'font-medium',
      'transition-all',
      'duration-200',
      'hover:bg-gray-100',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-orange-500',
      'focus:ring-offset-2',
    ];

    if (isActive) {
      baseClasses.push('text-orange-600', 'bg-orange-50');
    } else {
      baseClasses.push('text-gray-700', 'hover:text-orange-600');
    }

    return baseClasses.join(' ');
  };

  // Get mobile menu classes
  const getMobileMenuClasses = () => {
    return [
      'absolute',
      'top-full',
      'left-0',
      'right-0',
      'bg-white',
      'border-t',
      'border-gray-200',
      'shadow-lg',
      'transition-all',
      'duration-300',
      'ease-in-out',
      isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
    ].join(' ');
  };

  // Menu icon component
  const MenuIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );

  // Close icon component
  const CloseIcon = () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <nav className={`${getNavClasses()} ${className}`}>
      <div className={getContainerClasses()}>
        <div className="flex justify-between items-center" style={{ height: getNavHeight() }}>
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo || (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Creo</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          {!shouldShowMobileMenu() && (
            <div className="hidden lg:flex items-center space-x-1">
              {items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    className={getNavItemClasses()}
                    style={{ minHeight: getNavItemHeight() }}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          )}

          {/* Desktop Actions */}
          {!shouldShowMobileMenu() && actions && (
            <div className="hidden lg:flex items-center space-x-4">
              {actions}
            </div>
          )}

          {/* Mobile Menu Button */}
          {shouldShowMobileMenu() && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {shouldShowMobileMenu() && (
          <div className={getMobileMenuClasses()}>
            <div className="px-4 py-2 space-y-1">
              {items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                    <span>{item.label}</span>
                  </a>
                );
              })}
              
              {/* Mobile Actions */}
              {actions && (
                <div className="pt-4 pb-2 border-t border-gray-200">
                  <div className="px-3 py-2">
                    {actions}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Responsive Breadcrumb Component
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ResponsiveBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

export const ResponsiveBreadcrumb: React.FC<ResponsiveBreadcrumbProps> = ({
  items,
  className = '',
  separator,
}) => {
  const { isMobile } = useResponsive();

  const defaultSeparator = (
    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  );

  if (isMobile && items.length > 3) {
    // Show only first and last items on mobile
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    
    return (
      <nav className={`flex items-center space-x-2 text-sm ${className}`}>
        <a
          href={firstItem.href}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          {firstItem.label}
        </a>
        {separator || defaultSeparator}
        <span className="text-gray-900 font-medium">
          {lastItem.label}
        </span>
      </nav>
    );
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (separator || defaultSeparator)}
          {item.href ? (
            <a
              href={item.href}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-gray-900 font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Responsive Sidebar Component
interface ResponsiveSidebarProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  overlay?: boolean;
  position?: 'left' | 'right';
}

export const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({
  children,
  isOpen,
  onClose,
  className = '',
  overlay = true,
  position = 'left',
}) => {
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      {overlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 ${position === 'left' ? 'left-0' : 'right-0'} bottom-0 z-50
          w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'}
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveNavigation;
