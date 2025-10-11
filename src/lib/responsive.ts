/**
 * Responsive Design Utilities
 * Comprehensive responsive design system for mobile, tablet, and desktop
 */

// Breakpoint definitions
export const breakpoints = {
  xs: '320px',   // Extra small devices (phones)
  sm: '640px',   // Small devices (large phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (desktops)
  xl: '1280px',  // Extra large devices (large desktops)
  '2xl': '1536px', // 2X large devices (larger desktops)
} as const;

// Device type detection
export const deviceTypes = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  touch: '(hover: none) and (pointer: coarse)',
  mouse: '(hover: hover) and (pointer: fine)',
} as const;

// Responsive spacing scale
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem',   // 128px
} as const;

// Typography scale for different screen sizes
export const typography = {
  mobile: {
    h1: 'text-2xl font-bold leading-tight',
    h2: 'text-xl font-semibold leading-tight',
    h3: 'text-lg font-semibold leading-snug',
    h4: 'text-base font-medium leading-snug',
    body: 'text-sm leading-relaxed',
    small: 'text-xs leading-relaxed',
  },
  tablet: {
    h1: 'text-3xl font-bold leading-tight',
    h2: 'text-2xl font-semibold leading-tight',
    h3: 'text-xl font-semibold leading-snug',
    h4: 'text-lg font-medium leading-snug',
    body: 'text-base leading-relaxed',
    small: 'text-sm leading-relaxed',
  },
  desktop: {
    h1: 'text-4xl font-bold leading-tight',
    h2: 'text-3xl font-semibold leading-tight',
    h3: 'text-2xl font-semibold leading-snug',
    h4: 'text-xl font-medium leading-snug',
    body: 'text-lg leading-relaxed',
    small: 'text-base leading-relaxed',
  },
} as const;

// Grid system
export const grid = {
  mobile: {
    cols: 4,
    gap: '1rem',
    padding: '1rem',
  },
  tablet: {
    cols: 8,
    gap: '1.5rem',
    padding: '1.5rem',
  },
  desktop: {
    cols: 12,
    gap: '2rem',
    padding: '2rem',
  },
} as const;

// Container max-widths
export const containers = {
  mobile: '100%',
  tablet: '768px',
  desktop: '1200px',
  wide: '1400px',
} as const;

// Touch target sizes (minimum 44px for accessibility)
export const touchTargets = {
  minimum: '44px',
  comfortable: '48px',
  large: '56px',
} as const;

// Z-index scale
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
} as const;

// Animation durations for different devices
export const animations = {
  mobile: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  tablet: {
    fast: '200ms',
    normal: '250ms',
    slow: '350ms',
  },
  desktop: {
    fast: '250ms',
    normal: '300ms',
    slow: '400ms',
  },
} as const;

// Responsive hook for detecting screen size
export const useResponsive = () => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isTouch: false,
      isMouse: false,
      screenSize: 'desktop',
    };
  }

  const width = window.innerWidth;
  const isTouch = window.matchMedia(deviceTypes.touch).matches;
  const isMouse = window.matchMedia(deviceTypes.mouse).matches;

  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    isTouch,
    isMouse,
    screenSize: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
  };
};

// Responsive class generator
export const responsiveClasses = {
  // Spacing
  padding: {
    mobile: 'p-4',
    tablet: 'p-6',
    desktop: 'p-8',
  },
  margin: {
    mobile: 'm-4',
    tablet: 'm-6',
    desktop: 'm-8',
  },
  // Typography
  heading: {
    mobile: 'text-2xl',
    tablet: 'text-3xl',
    desktop: 'text-4xl',
  },
  // Layout
  container: {
    mobile: 'px-4 max-w-full',
    tablet: 'px-6 max-w-4xl',
    desktop: 'px-8 max-w-6xl',
  },
  // Grid
  grid: {
    mobile: 'grid-cols-1 gap-4',
    tablet: 'grid-cols-2 gap-6',
    desktop: 'grid-cols-3 gap-8',
  },
} as const;

// Responsive image sizes
export const imageSizes = {
  mobile: {
    thumbnail: '80px',
    small: '120px',
    medium: '200px',
    large: '300px',
  },
  tablet: {
    thumbnail: '100px',
    small: '150px',
    medium: '250px',
    large: '400px',
  },
  desktop: {
    thumbnail: '120px',
    small: '180px',
    medium: '300px',
    large: '500px',
  },
} as const;

// Responsive navigation
export const navigation = {
  mobile: {
    height: '56px',
    itemHeight: '44px',
    fontSize: '16px',
  },
  tablet: {
    height: '64px',
    itemHeight: '48px',
    fontSize: '16px',
  },
  desktop: {
    height: '72px',
    itemHeight: '48px',
    fontSize: '14px',
  },
} as const;

// Form responsive design
export const forms = {
  mobile: {
    inputHeight: '48px',
    fontSize: '16px', // Prevents zoom on iOS
    padding: '12px 16px',
  },
  tablet: {
    inputHeight: '44px',
    fontSize: '16px',
    padding: '10px 14px',
  },
  desktop: {
    inputHeight: '40px',
    fontSize: '14px',
    padding: '8px 12px',
  },
} as const;

// Card responsive design
export const cards = {
  mobile: {
    padding: '16px',
    borderRadius: '12px',
    gap: '16px',
  },
  tablet: {
    padding: '20px',
    borderRadius: '16px',
    gap: '20px',
  },
  desktop: {
    padding: '24px',
    borderRadius: '20px',
    gap: '24px',
  },
} as const;

// Modal responsive design
export const modals = {
  mobile: {
    width: '100%',
    height: '100%',
    padding: '16px',
    borderRadius: '0px',
  },
  tablet: {
    width: '90%',
    height: 'auto',
    padding: '24px',
    borderRadius: '16px',
  },
  desktop: {
    width: '600px',
    height: 'auto',
    padding: '32px',
    borderRadius: '20px',
  },
} as const;

// Responsive utilities
export const responsiveUtils = {
  // Hide/show on different screen sizes
  hideOnMobile: 'hidden sm:block',
  hideOnTablet: 'block sm:hidden md:block',
  hideOnDesktop: 'block md:hidden',
  showOnMobile: 'block sm:hidden',
  showOnTablet: 'hidden sm:block md:hidden',
  showOnDesktop: 'hidden md:block',
  
  // Text alignment
  textCenterMobile: 'text-center sm:text-left',
  textLeftMobile: 'text-left',
  textCenterTablet: 'text-center md:text-left',
  
  // Flex direction
  flexColMobile: 'flex-col sm:flex-row',
  flexRowMobile: 'flex-row sm:flex-col',
  
  // Grid columns
  gridColsMobile: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  gridColsTablet: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  
  // Spacing
  spacingMobile: 'space-y-4 sm:space-y-0 sm:space-x-4',
  spacingTablet: 'space-y-6 md:space-y-0 md:space-x-6',
  
  // Width
  widthMobile: 'w-full sm:w-auto',
  widthTablet: 'w-full md:w-auto',
  
  // Height
  heightMobile: 'h-auto sm:h-screen',
  heightTablet: 'h-auto md:h-screen',
} as const;

// Performance optimizations for different devices
export const performance = {
  mobile: {
    // Reduce animations on mobile for better performance
    reducedMotion: 'prefers-reduced-motion:reduce',
    // Optimize images for mobile
    imageQuality: 0.8,
    // Reduce bundle size
    lazyLoad: true,
  },
  tablet: {
    // Balanced performance
    reducedMotion: 'prefers-reduced-motion:reduce',
    imageQuality: 0.9,
    lazyLoad: true,
  },
  desktop: {
    // Full experience on desktop
    reducedMotion: 'prefers-reduced-motion:no-preference',
    imageQuality: 1.0,
    lazyLoad: false,
  },
} as const;

// Accessibility considerations for responsive design
export const accessibility = {
  // Minimum touch target size
  touchTarget: 'min-h-[44px] min-w-[44px]',
  // Focus indicators
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
  // High contrast mode support
  highContrast: 'supports-[color-scheme:dark]:bg-gray-900',
  // Reduced motion support
  reducedMotion: 'motion-reduce:transition-none motion-reduce:animate-none',
} as const;

export type Breakpoint = keyof typeof breakpoints;
export type DeviceType = keyof typeof deviceTypes;
export type ScreenSize = 'mobile' | 'tablet' | 'desktop';
