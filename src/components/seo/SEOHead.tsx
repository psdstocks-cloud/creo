import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
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
  alternate?: {
    href: string
    hreflang: string
  }[]
}

const defaultSEO = {
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
  type: 'website' as const,
  author: 'Creo Team',
  siteName: 'Creo'
}

export function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  nofollow = false,
  canonical,
  alternate = []
}: SEOHeadProps) {
  const router = useRouter()
  const currentUrl = url || `https://creo.vercel.app${router.asPath}`
  const fullTitle = title ? `${title} | ${defaultSEO.siteName}` : defaultSEO.title
  const metaDescription = description || defaultSEO.description
  const metaKeywords = [...defaultSEO.keywords, ...keywords].join(', ')
  const ogImage = image || defaultSEO.image
  const canonicalUrl = canonical || currentUrl

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={author || defaultSEO.author} />
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#F59E0B" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate Language Links */}
      {alternate.map((alt, index) => (
        <link key={index} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
      ))}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={defaultSEO.siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific Open Graph tags */}
      {type === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@creo" />
      <meta name="twitter:creator" content="@creo" />
      
      {/* Additional Meta Tags */}
      <meta name="application-name" content="Creo" />
      <meta name="apple-mobile-web-app-title" content="Creo" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://api.unsplash.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="dns-prefetch" href="//api.unsplash.com" />
    </Head>
  )
}

// Page-specific SEO components
export function HomePageSEO() {
  return (
    <SEOHead
      title="AI-Powered Stock Media & Image Generation"
      description="Discover and generate stunning stock media with AI. Search millions of high-quality photos, videos, and graphics. Create custom images with artificial intelligence."
      keywords={[
        'stock photos',
        'AI image generation',
        'creative assets',
        'digital media',
        'content creation'
      ]}
      type="website"
    />
  )
}

export function StockSearchSEO({ query, category }: { query?: string; category?: string }) {
  const title = query 
    ? `Stock Photos: ${query} | Creo`
    : category 
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} Stock Photos | Creo`
    : 'Stock Photos & Images | Creo'
    
  const description = query
    ? `Find high-quality stock photos of ${query}. Professional images for your projects. Download instantly with Creo.`
    : category
    ? `Browse ${category} stock photos. Professional ${category} images for your projects. Download instantly with Creo.`
    : 'Search millions of high-quality stock photos, videos, and graphics. Professional images for your projects.'

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={[
        'stock photos',
        query || category || 'images',
        'professional photos',
        'commercial use',
        'high quality'
      ]}
      type="website"
    />
  )
}

export function AIGenerationSEO({ prompt, category }: { prompt?: string; category?: string }) {
  const title = prompt 
    ? `AI Image: ${prompt} | Creo`
    : category 
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} AI Images | Creo`
    : 'AI Image Generation | Creo'
    
  const description = prompt
    ? `Generate AI images of ${prompt}. Create custom images with artificial intelligence. Professional results with Creo.`
    : category
    ? `Generate ${category} AI images. Create custom ${category} images with artificial intelligence. Professional results with Creo.`
    : 'Generate custom images with AI. Create professional images from text descriptions. Fast, high-quality results with Creo.'

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={[
        'AI image generation',
        'artificial intelligence',
        'custom images',
        'text to image',
        'AI art',
        prompt || category || 'image generation'
      ]}
      type="website"
    />
  )
}

export function DashboardSEO() {
  return (
    <SEOHead
      title="Dashboard"
      description="Manage your Creo account, view your orders, and access your downloads."
      noindex={true}
    />
  )
}

export function BillingSEO() {
  return (
    <SEOHead
      title="Billing & Credits"
      description="Manage your Creo billing, purchase credits, and view payment history."
      noindex={true}
    />
  )
}

export function SettingsSEO() {
  return (
    <SEOHead
      title="Settings"
      description="Manage your Creo account settings, preferences, and API keys."
      noindex={true}
    />
  )
}

export function OrdersSEO() {
  return (
    <SEOHead
      title="Orders"
      description="View and manage your Creo orders and downloads."
      noindex={true}
    />
  )
}

export function DownloadsSEO() {
  return (
    <SEOHead
      title="Downloads"
      description="Access your downloaded files and manage your Creo downloads."
      noindex={true}
    />
  )
}

export function AdminSEO() {
  return (
    <SEOHead
      title="Admin Dashboard"
      description="Creo admin dashboard for user management and system monitoring."
      noindex={true}
      nofollow={true}
    />
  )
}
