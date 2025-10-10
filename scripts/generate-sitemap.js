#!/usr/bin/env node

/**
 * Sitemap Generation Script
 * 
 * This script generates a comprehensive sitemap for the Creo platform
 * including static pages, dynamic routes, and API endpoints.
 */

const fs = require('fs')
const path = require('path')

const SITE_URL = process.env.SITE_URL || 'https://creo.vercel.app'
const OUTPUT_DIR = './public'

// Static pages
const staticPages = [
  {
    url: '/',
    priority: 1.0,
    changefreq: 'daily',
    lastmod: new Date().toISOString()
  },
  {
    url: '/stock-search',
    priority: 0.9,
    changefreq: 'daily',
    lastmod: new Date().toISOString()
  },
  {
    url: '/ai-generation',
    priority: 0.9,
    changefreq: 'daily',
    lastmod: new Date().toISOString()
  },
  {
    url: '/dashboard',
    priority: 0.8,
    changefreq: 'weekly',
    lastmod: new Date().toISOString()
  },
  {
    url: '/billing',
    priority: 0.6,
    changefreq: 'monthly',
    lastmod: new Date().toISOString()
  }
]

// Dynamic routes for stock search
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
  'fashion',
  'health',
  'education',
  'sports',
  'entertainment',
  'automotive',
  'real-estate',
  'finance',
  'marketing',
  'design',
  'art'
]

// AI generation categories
const aiCategories = [
  'portrait',
  'landscape',
  'abstract',
  'product',
  'logo',
  'illustration',
  'concept',
  'artistic',
  'business',
  'technology',
  'nature',
  'people',
  'architecture',
  'food',
  'fashion',
  'health',
  'education',
  'sports',
  'entertainment',
  'marketing'
]

// Generate dynamic pages
const generateDynamicPages = () => {
  const dynamicPages = []
  
  // Stock search category pages
  stockCategories.forEach(category => {
    dynamicPages.push({
      url: `/stock-search?category=${category}`,
      priority: 0.7,
      changefreq: 'daily',
      lastmod: new Date().toISOString()
    })
  })
  
  // AI generation category pages
  aiCategories.forEach(category => {
    dynamicPages.push({
      url: `/ai-generation?category=${category}`,
      priority: 0.7,
      changefreq: 'daily',
      lastmod: new Date().toISOString()
    })
  })
  
  return dynamicPages
}

// Generate sitemap XML
const generateSitemap = () => {
  const allPages = [...staticPages, ...generateDynamicPages()]
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return sitemap
}

// Generate robots.txt
const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /billing/history
Disallow: /downloads
Disallow: /settings
Disallow: /orders

# Disallow AI crawlers
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl delay
Crawl-delay: 1`
}

// Generate sitemap index
const generateSitemapIndex = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`
}

// Main function
const main = () => {
  console.log('🗺️  Generating sitemap and robots.txt...')
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }
  
  // Generate sitemap
  const sitemap = generateSitemap()
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap)
  console.log('✅ Generated sitemap.xml')
  
  // Generate robots.txt
  const robotsTxt = generateRobotsTxt()
  fs.writeFileSync(path.join(OUTPUT_DIR, 'robots.txt'), robotsTxt)
  console.log('✅ Generated robots.txt')
  
  // Generate sitemap index
  const sitemapIndex = generateSitemapIndex()
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-index.xml'), sitemapIndex)
  console.log('✅ Generated sitemap-index.xml')
  
  console.log(`\n📊 Sitemap Statistics:`)
  console.log(`   - Static pages: ${staticPages.length}`)
  console.log(`   - Stock categories: ${stockCategories.length}`)
  console.log(`   - AI categories: ${aiCategories.length}`)
  console.log(`   - Total URLs: ${staticPages.length + stockCategories.length + aiCategories.length}`)
  console.log(`\n🌐 Sitemap URL: ${SITE_URL}/sitemap.xml`)
  console.log(`🤖 Robots.txt URL: ${SITE_URL}/robots.txt`)
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = {
  generateSitemap,
  generateRobotsTxt,
  generateSitemapIndex,
  staticPages,
  stockCategories,
  aiCategories
}
