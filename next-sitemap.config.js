/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://creo.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin/*',
    '/api/*',
    '/_next/*',
    '/404',
    '/500',
    '/billing/history',
    '/downloads',
    '/settings',
    '/orders',
  ],
  additionalPaths: async (config) => {
    const result = []
    
    // Add dynamic routes for stock search
    const stockCategories = [
      'business',
      'technology',
      'lifestyle',
      'nature',
      'abstract',
      'people',
      'food',
      'travel',
      'architecture',
      'fashion'
    ]
    
    stockCategories.forEach(category => {
      result.push({
        loc: `/stock-search?category=${category}`,
        changefreq: 'daily',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      })
    })
    
    // Add AI generation categories
    const aiCategories = [
      'portrait',
      'landscape',
      'abstract',
      'product',
      'logo',
      'illustration',
      'concept',
      'artistic'
    ]
    
    aiCategories.forEach(category => {
      result.push({
        loc: `/ai-generation?category=${category}`,
        changefreq: 'daily',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      })
    })
    
    return result
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/billing/history',
          '/downloads',
          '/settings',
          '/orders',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    additionalSitemaps: [
      'https://creo.vercel.app/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom priority and changefreq based on path
    let priority = 0.5
    let changefreq = 'monthly'
    
    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    } else if (path === '/stock-search') {
      priority = 0.9
      changefreq = 'daily'
    } else if (path === '/ai-generation') {
      priority = 0.9
      changefreq = 'daily'
    } else if (path === '/dashboard') {
      priority = 0.8
      changefreq = 'weekly'
    } else if (path === '/billing') {
      priority = 0.6
      changefreq = 'monthly'
    } else if (path.includes('stock-search') || path.includes('ai-generation')) {
      priority = 0.7
      changefreq = 'daily'
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
}
