/**
 * SEO Utilities
 * 
 * This file contains utilities for generating SEO-friendly content,
 * meta tags, and structured data for the Creo platform.
 */

export interface SEOConfig {
  title: string
  description: string
  keywords: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product' | 'service'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  noindex?: boolean
  nofollow?: boolean
  canonical?: string
}

export interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: any
}

// Default SEO configuration
export const defaultSEO: SEOConfig = {
  title: 'Creo - AI-Powered Stock Media & Image Generation Platform',
  description: 'Discover and generate stunning stock media with AI. Search millions of high-quality photos, videos, and graphics. Create custom images with artificial intelligence.',
  keywords: [
    'stock photos',
    'AI image generation',
    'creative assets',
    'digital media',
    'content creation',
    'stock images',
    'artificial intelligence',
    'image generation',
    'stock videos',
    'graphics',
    'design',
    'marketing',
    'business',
    'professional',
    'high quality',
    'royalty free',
    'commercial use'
  ],
  image: 'https://creo.vercel.app/og-image.jpg',
  url: 'https://creo.vercel.app',
  type: 'website',
  author: 'Creo Team'
}

// Generate page title
export function generatePageTitle(pageTitle?: string, siteName = 'Creo'): string {
  if (!pageTitle) return defaultSEO.title
  return `${pageTitle} | ${siteName}`
}

// Generate meta description
export function generateMetaDescription(description?: string, maxLength = 160): string {
  const metaDescription = description || defaultSEO.description
  return metaDescription.length > maxLength 
    ? metaDescription.substring(0, maxLength - 3) + '...'
    : metaDescription
}

// Generate keywords string
export function generateKeywords(additionalKeywords: string[] = []): string {
  const allKeywords = [...defaultSEO.keywords, ...additionalKeywords]
  return [...new Set(allKeywords)].join(', ')
}

// Generate canonical URL
export function generateCanonicalUrl(path: string, baseUrl = 'https://creo.vercel.app'): string {
  return `${baseUrl}${path}`
}

// Generate Open Graph image URL
export function generateOGImageUrl(
  title: string, 
  description: string, 
  baseUrl = 'https://creo.vercel.app'
): string {
  const params = new URLSearchParams({
    title: title.substring(0, 60),
    description: description.substring(0, 120),
    site: 'Creo'
  })
  
  return `${baseUrl}/api/og?${params.toString()}`
}

// Generate structured data for organization
export function generateOrganizationStructuredData(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Creo',
    description: 'AI-powered stock media and image generation platform for creators and businesses',
    url: 'https://creo.vercel.app',
    logo: 'https://creo.vercel.app/logo.png',
    sameAs: [
      'https://twitter.com/creo',
      'https://linkedin.com/company/creo',
      'https://github.com/creo'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@creo.vercel.app',
      availableLanguage: ['English', 'Arabic']
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    },
    foundingDate: '2024',
    numberOfEmployees: '1-10',
    industry: 'Technology'
  }
}

// Generate structured data for website
export function generateWebsiteStructuredData(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Creo',
    description: 'AI-powered stock media and image generation platform',
    url: 'https://creo.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://creo.vercel.app/stock-search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Creo',
      logo: {
        '@type': 'ImageObject',
        url: 'https://creo.vercel.app/logo.png'
      }
    }
  }
}

// Generate structured data for software application
export function generateSoftwareApplicationStructuredData(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Creo',
    description: 'AI-powered stock media and image generation platform',
    url: 'https://creo.vercel.app',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1'
    },
    author: {
      '@type': 'Organization',
      name: 'Creo Team'
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0]
  }
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

// Generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

// Generate product structured data
export function generateProductStructuredData(product: {
  name: string
  description: string
  image: string
  category: string
  price?: number
  currency?: string
  availability?: string
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category,
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'USD',
        availability: product.availability || 'https://schema.org/InStock'
      }
    })
  }
}

// Generate service structured data
export function generateServiceStructuredData(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'AI Stock Media & Image Generation',
    description: 'Professional stock media search and AI-powered image generation services',
    provider: {
      '@type': 'Organization',
      name: 'Creo',
      url: 'https://creo.vercel.app'
    },
    serviceType: 'Digital Media Services',
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Creo Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Stock Media Search',
            description: 'Search and download high-quality stock photos, videos, and graphics'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Image Generation',
            description: 'Generate custom images using artificial intelligence'
          }
        }
      ]
    }
  }
}

// Generate robots meta content
export function generateRobotsContent(noindex = false, nofollow = false): string {
  const index = noindex ? 'noindex' : 'index'
  const follow = nofollow ? 'nofollow' : 'follow'
  return `${index}, ${follow}`
}

// Generate alternate language links
export function generateAlternateLinks(path: string, baseUrl = 'https://creo.vercel.app') {
  return [
    { href: `${baseUrl}${path}`, hreflang: 'en' },
    { href: `${baseUrl}/ar${path}`, hreflang: 'ar' }
  ]
}

// SEO validation
export function validateSEO(config: SEOConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!config.title || config.title.length < 10) {
    errors.push('Title should be at least 10 characters long')
  }
  
  if (config.title && config.title.length > 60) {
    errors.push('Title should be less than 60 characters for optimal SEO')
  }
  
  if (!config.description || config.description.length < 50) {
    errors.push('Description should be at least 50 characters long')
  }
  
  if (config.description && config.description.length > 160) {
    errors.push('Description should be less than 160 characters for optimal SEO')
  }
  
  if (!config.keywords || config.keywords.length === 0) {
    errors.push('Keywords should not be empty')
  }
  
  if (config.keywords && config.keywords.length > 20) {
    errors.push('Too many keywords (max 20 recommended)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Generate SEO score
export function generateSEOScore(config: SEOConfig): number {
  let score = 0
  const maxScore = 100
  
  // Title (20 points)
  if (config.title && config.title.length >= 10 && config.title.length <= 60) {
    score += 20
  } else if (config.title && config.title.length > 0) {
    score += 10
  }
  
  // Description (20 points)
  if (config.description && config.description.length >= 50 && config.description.length <= 160) {
    score += 20
  } else if (config.description && config.description.length > 0) {
    score += 10
  }
  
  // Keywords (15 points)
  if (config.keywords && config.keywords.length > 0 && config.keywords.length <= 20) {
    score += 15
  }
  
  // Image (15 points)
  if (config.image) {
    score += 15
  }
  
  // URL (10 points)
  if (config.url) {
    score += 10
  }
  
  // Type (10 points)
  if (config.type) {
    score += 10
  }
  
  // Author (10 points)
  if (config.author) {
    score += 10
  }
  
  return Math.min(score, maxScore)
}
