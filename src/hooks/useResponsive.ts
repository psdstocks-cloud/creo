'use client';

import { useState, useEffect } from 'react';
import { breakpoints, deviceTypes, useResponsive as getResponsive } from '@/lib/responsive';

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  isMouse: boolean;
  screenSize: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  isLandscape: boolean;
  isPortrait: boolean;
}

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouch: false,
    isMouse: true,
    screenSize: 'desktop',
    width: 1024,
    height: 768,
    orientation: 'landscape',
    isLandscape: true,
    isPortrait: false,
  });

  useEffect(() => {
    const updateResponsive = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;
      const isPortrait = height > width;
      
      const responsive = getResponsive();
      
      setState({
        ...responsive,
        width,
        height,
        orientation: isLandscape ? 'landscape' : 'portrait',
        isLandscape,
        isPortrait,
      });
    };

    // Initial check
    updateResponsive();

    // Add event listeners
    window.addEventListener('resize', updateResponsive);
    window.addEventListener('orientationchange', updateResponsive);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateResponsive);
      window.removeEventListener('orientationchange', updateResponsive);
    };
  }, []);

  return state;
};

// Hook for specific breakpoint checks
export const useBreakpoint = (breakpoint: keyof typeof breakpoints): boolean => {
  const { width } = useResponsive();
  
  const breakpointValues = {
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };

  return width >= breakpointValues[breakpoint];
};

// Hook for device type detection
export const useDeviceType = () => {
  const { isMobile, isTablet, isDesktop, isTouch, isMouse } = useResponsive();
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
    isMouse,
    isSmallScreen: isMobile,
    isMediumScreen: isTablet,
    isLargeScreen: isDesktop,
  };
};

// Hook for orientation detection
export const useOrientation = () => {
  const { orientation, isLandscape, isPortrait } = useResponsive();
  
  return {
    orientation,
    isLandscape,
    isPortrait,
  };
};

// Hook for responsive classes
export const useResponsiveClasses = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const getResponsiveClass = (mobile: string, tablet: string, desktop: string) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };
  
  const getSpacingClass = (mobile: string, tablet: string, desktop: string) => {
    return getResponsiveClass(mobile, tablet, desktop);
  };
  
  const getTypographyClass = (mobile: string, tablet: string, desktop: string) => {
    return getResponsiveClass(mobile, tablet, desktop);
  };
  
  const getLayoutClass = (mobile: string, tablet: string, desktop: string) => {
    return getResponsiveClass(mobile, tablet, desktop);
  };
  
  return {
    getResponsiveClass,
    getSpacingClass,
    getTypographyClass,
    getLayoutClass,
  };
};

// Hook for responsive values
export const useResponsiveValue = <T>(mobile: T, tablet: T, desktop: T): T => {
  const { isMobile, isTablet } = useResponsive();
  
  if (isMobile) return mobile;
  if (isTablet) return tablet;
  return desktop;
};

// Hook for responsive images
export const useResponsiveImage = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const getImageSize = (baseSize: number) => {
    if (isMobile) return Math.round(baseSize * 0.8);
    if (isTablet) return Math.round(baseSize * 0.9);
    return baseSize;
  };
  
  const getImageQuality = () => {
    if (isMobile) return 0.8;
    if (isTablet) return 0.9;
    return 1.0;
  };
  
  return {
    getImageSize,
    getImageQuality,
  };
};

// Hook for responsive animations
export const useResponsiveAnimation = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const getAnimationDuration = (baseDuration: number) => {
    if (isMobile) return Math.round(baseDuration * 0.8);
    if (isTablet) return Math.round(baseDuration * 0.9);
    return baseDuration;
  };
  
  const shouldReduceMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  
  return {
    getAnimationDuration,
    shouldReduceMotion,
  };
};

// Hook for responsive grid
export const useResponsiveGrid = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const getGridCols = (mobileCols: number, tabletCols: number, desktopCols: number) => {
    if (isMobile) return mobileCols;
    if (isTablet) return tabletCols;
    return desktopCols;
  };
  
  const getGridGap = (mobileGap: string, tabletGap: string, desktopGap: string) => {
    if (isMobile) return mobileGap;
    if (isTablet) return tabletGap;
    return desktopGap;
  };
  
  return {
    getGridCols,
    getGridGap,
  };
};

// Hook for responsive forms
export const useResponsiveForm = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const getInputHeight = () => {
    if (isMobile) return '48px'; // Prevents zoom on iOS
    if (isTablet) return '44px';
    return '40px';
  };
  
  const getInputFontSize = () => {
    if (isMobile) return '16px'; // Prevents zoom on iOS
    if (isTablet) return '16px';
    return '14px';
  };
  
  const getFormLayout = () => {
    if (isMobile) return 'flex-col space-y-4';
    if (isTablet) return 'flex-col md:flex-row md:space-y-0 md:space-x-4';
    return 'flex-row space-x-4';
  };
  
  return {
    getInputHeight,
    getInputFontSize,
    getFormLayout,
  };
};

// Hook for responsive navigation
export const useResponsiveNavigation = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const getNavHeight = () => {
    if (isMobile) return '56px';
    if (isTablet) return '64px';
    return '72px';
  };
  
  const getNavItemHeight = () => {
    if (isMobile) return '44px';
    if (isTablet) return '48px';
    return '48px';
  };
  
  const getNavFontSize = () => {
    if (isMobile) return '16px';
    if (isTablet) return '16px';
    return '14px';
  };
  
  const shouldShowMobileMenu = () => isMobile || isTablet;
  
  return {
    getNavHeight,
    getNavItemHeight,
    getNavFontSize,
    shouldShowMobileMenu,
  };
};

// Hook for responsive modals
export const useResponsiveModal = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const getModalWidth = () => {
    if (isMobile) return '100%';
    if (isTablet) return '90%';
    return '600px';
  };
  
  const getModalHeight = () => {
    if (isMobile) return '100%';
    if (isTablet) return 'auto';
    return 'auto';
  };
  
  const getModalPadding = () => {
    if (isMobile) return '16px';
    if (isTablet) return '24px';
    return '32px';
  };
  
  const getModalBorderRadius = () => {
    if (isMobile) return '0px';
    if (isTablet) return '16px';
    return '20px';
  };
  
  return {
    getModalWidth,
    getModalHeight,
    getModalPadding,
    getModalBorderRadius,
  };
};

// Hook for responsive cards
export const useResponsiveCard = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const getCardPadding = () => {
    if (isMobile) return '16px';
    if (isTablet) return '20px';
    return '24px';
  };
  
  const getCardBorderRadius = () => {
    if (isMobile) return '12px';
    if (isTablet) return '16px';
    return '20px';
  };
  
  const getCardGap = () => {
    if (isMobile) return '16px';
    if (isTablet) return '20px';
    return '24px';
  };
  
  return {
    getCardPadding,
    getCardBorderRadius,
    getCardGap,
  };
};

export default useResponsive;