import Head from 'next/head'

interface JsonLdProps {
  data: Record<string, any>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  )
}

// Organization Schema
export function OrganizationJsonLd() {
  const organizationData = {
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
    industry: 'Technology',
    keywords: [
      'stock photos',
      'AI image generation',
      'creative assets',
      'digital media',
      'content creation',
      'stock images',
      'artificial intelligence',
      'image generation'
    ]
  }

  return <JsonLd data={organizationData} />
}

// Website Schema
export function WebsiteJsonLd() {
  const websiteData = {
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

  return <JsonLd data={websiteData} />
}

// Software Application Schema
export function SoftwareApplicationJsonLd() {
  const softwareData = {
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

  return <JsonLd data={softwareData} />
}

// Breadcrumb Schema
interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return <JsonLd data={breadcrumbData} />
}

// FAQ Schema
interface FAQJsonLdProps {
  faqs: Array<{
    question: string
    answer: string
  }>
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const faqData = {
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

  return <JsonLd data={faqData} />
}

// Product Schema for Stock Media
interface ProductJsonLdProps {
  product: {
    name: string
    description: string
    image: string
    category: string
    price?: number
    currency?: string
    availability?: string
  }
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const productData = {
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

  return <JsonLd data={productData} />
}

// Service Schema
export function ServiceJsonLd() {
  const serviceData = {
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

  return <JsonLd data={serviceData} />
}

// Local Business Schema (if applicable)
export function LocalBusinessJsonLd() {
  const businessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Creo',
    description: 'AI-powered stock media and image generation platform',
    url: 'https://creo.vercel.app',
    telephone: '+1-555-CREO-123',
    email: 'contact@creo.vercel.app',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Tech Street',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      postalCode: '94105',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '37.7749',
      longitude: '-122.4194'
    },
    openingHours: 'Mo-Fr 09:00-17:00',
    priceRange: '$$'
  }

  return <JsonLd data={businessData} />
}
