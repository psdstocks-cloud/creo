/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove or empty experimental config to fix 'turbo' errors
  experimental: {},
  // Enable static export for Netlify
  output: 'export' as const,
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Other config options if any
};

export default nextConfig;