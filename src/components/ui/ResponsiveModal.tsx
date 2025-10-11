'use client';

import React, { useEffect, useRef } from 'react';
import { useResponsiveModal } from '@/hooks/useResponsive';
import { createPortal } from 'react-dom';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  overlay?: boolean;
  overlayClassName?: string;
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  className = '',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  overlay = true,
  overlayClassName = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { getModalWidth, getModalHeight, getModalPadding, getModalBorderRadius } = useResponsiveModal();

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle body scroll lock
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

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) {
        firstElement.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    if (size === 'sm') return 'max-w-sm';
    if (size === 'md') return 'max-w-md';
    if (size === 'lg') return 'max-w-lg';
    if (size === 'xl') return 'max-w-xl';
    if (size === 'full') return 'max-w-full mx-4';
    return 'max-w-md';
  };

  const getModalClasses = () => {
    return [
      'relative',
      'bg-white',
      'rounded-lg',
      'shadow-xl',
      'transform',
      'transition-all',
      'duration-300',
      'ease-in-out',
      getSizeClasses(),
      className,
    ].join(' ');
  };

  const getModalStyle = () => {
    return {
      width: getModalWidth(),
      height: getModalHeight(),
      padding: getModalPadding(),
      borderRadius: getModalBorderRadius(),
    };
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        overlay ? 'bg-black bg-opacity-50' : ''
      } ${overlayClassName}`}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={getModalClasses()}
        style={getModalStyle()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="px-6 pt-4">
            <p id="modal-description" className="text-sm text-gray-600">
              {description}
            </p>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Responsive Drawer Component (Mobile-first modal)
interface ResponsiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  position?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  overlay?: boolean;
}

export const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({
  isOpen,
  onClose,
  children,
  title,
  position = 'right',
  size = 'md',
  className = '',
  overlay = true,
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

  const getPositionClasses = () => {
    if (position === 'left') {
      return 'left-0 top-0 bottom-0';
    } else if (position === 'right') {
      return 'right-0 top-0 bottom-0';
    } else {
      return 'left-0 right-0 bottom-0';
    }
  };

  const getSizeClasses = () => {
    if (size === 'sm') return 'max-w-sm';
    if (size === 'md') return 'max-w-md';
    if (size === 'lg') return 'max-w-lg';
    if (size === 'full') return 'w-full';
    return 'max-w-md';
  };

  const getDrawerClasses = () => {
    return [
      'fixed',
      'z-50',
      'bg-white',
      'shadow-xl',
      'transform',
      'transition-transform',
      'duration-300',
      'ease-in-out',
      getPositionClasses(),
      getSizeClasses(),
      className,
    ].join(' ');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const drawerContent = (
    <div
      className={`fixed inset-0 z-50 ${overlay ? 'bg-black bg-opacity-50' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={getDrawerClasses()}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};

// Responsive Popover Component
interface ResponsivePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  trigger: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  offset?: number;
}

export const ResponsivePopover: React.FC<ResponsivePopoverProps> = ({
  isOpen,
  onClose,
  children,
  trigger,
  placement = 'bottom',
  className = '',
  offset = 8,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const getPlacementClasses = () => {
    if (placement === 'top') return 'bottom-full mb-2';
    if (placement === 'bottom') return 'top-full mt-2';
    if (placement === 'left') return 'right-full mr-2';
    if (placement === 'right') return 'left-full ml-2';
    return 'top-full mt-2';
  };

  return (
    <div className="relative">
      {trigger}
      {isOpen && (
        <div
          ref={popoverRef}
          className={`absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 ${getPlacementClasses()} ${className}`}
          style={{ minWidth: '200px' }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Responsive Tooltip Component
interface ResponsiveTooltipProps {
  children: React.ReactNode;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const ResponsiveTooltip: React.FC<ResponsiveTooltipProps> = ({
  children,
  content,
  placement = 'top',
  delay = 200,
  className = '',
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const getPlacementClasses = () => {
    if (placement === 'top') return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
    if (placement === 'bottom') return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
    if (placement === 'left') return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
    if (placement === 'right') return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
    return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap ${getPlacementClasses()} ${className}`}
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              placement === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
              placement === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
              placement === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
              'right-full top-1/2 -translate-y-1/2 -mr-1'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default ResponsiveModal;
