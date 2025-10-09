import withNextIntl from './next-intl.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove or empty experimental config to fix 'turbo' errors
  experimental: {},
  // Remove static export for Vercel compatibility
  // output: 'export' as const, // Commented out for Vercel
  trailingSlash: true,
  images: {
    // Enable image optimization for Vercel
    unoptimized: false
  },
  // Skip linting during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Other config options if any
};

export default withNextIntl(nextConfig);