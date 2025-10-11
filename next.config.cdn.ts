import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable experimental features for better caching
  experimental: {
    // Enable server components caching
    serverComponentsExternalPackages: ['@upstash/redis'],
  },

  // Image optimization for CDN
  images: {
    // Enable image optimization
    unoptimized: false,
    
    // Configure image domains for external images
    domains: [
      'images.unsplash.com',
      'cdn.pixabay.com',
      'images.pexels.com',
      'cdn.stocksy.com',
      'images.shutterstock.com',
      'cdn.gettyimages.com',
      'images.istockphoto.com',
      'cdn.freepik.com',
      'images.dreamstime.com',
      'cdn.alamy.com',
    ],
    
    // Configure image formats
    formats: ['image/webp', 'image/avif'],
    
    // Configure image sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for CDN optimization
  async headers() {
    return [
      // Static assets caching
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=31536000',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=31536000',
          },
        ],
      },
      
      // API responses caching
      {
        source: '/api/stock/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1800, s-maxage=1800',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=1800',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=1800',
          },
        ],
      },
      
      // AI generation API caching
      {
        source: '/api/ai/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=3600',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=3600',
          },
        ],
      },
      
      // System API caching
      {
        source: '/api/system/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=300',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=300',
          },
        ],
      },
      
      // Images caching
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=2592000',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=2592000',
          },
        ],
      },
      
      // No cache for sensitive routes
      {
        source: '/api/auth/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      
      {
        source: '/api/user/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      
      {
        source: '/api/orders/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      
      {
        source: '/api/payments/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      
      {
        source: '/api/admin/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ]
  },

  // Redirects for CDN optimization
  async redirects() {
    return [
      // Redirect old API endpoints to new ones
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
        permanent: true,
      },
    ]
  },

  // Rewrites for CDN optimization
  async rewrites() {
    return [
      // Rewrite API routes for better caching
      {
        source: '/api/cache/:path*',
        destination: '/api/admin/cache/:path*',
      },
    ]
  },

  // Compress responses
  compress: true,

  // Enable SWC minification
  swcMinify: true,

  // Configure build output
  output: 'standalone',

  // Enable experimental features
  experimental: {
    // Enable server components caching
    serverComponentsExternalPackages: ['@upstash/redis'],
    
    // Enable optimized package imports
    optimizePackageImports: ['@upstash/redis', 'ioredis'],
  },

  // Configure webpack for better caching
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add cache configuration
    if (!dev && !isServer) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      }
    }

    return config
  },

  // Configure environment variables
  env: {
    CACHE_TTL_SHORT: '300',
    CACHE_TTL_MEDIUM: '3600',
    CACHE_TTL_LONG: '86400',
    CACHE_TTL_VERY_LONG: '604800',
  },
}

export default nextConfig
