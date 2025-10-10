/**
 * Stock Input Parser for Creo
 * Parses multi-line input to extract stock site URLs and IDs
 * Supports all major stock providers with domain matching
 */

export interface ParsedStockInput {
  raw: string
  site: string
  id: string
  url?: string
  isValid: boolean
  error?: string
}

export interface StockSiteConfig {
  active: boolean
  price: number
  name?: string
}

// Stock site domain patterns and ID extraction rules
const STOCK_SITE_PATTERNS = {
  shutterstock: {
    domains: ['shutterstock.com', 'www.shutterstock.com'],
    patterns: [
      /shutterstock\.com\/.*?(\d+)/,
      /shutterstock\.com\/image-photo\/.*?-(\d+)/,
      /shutterstock\.com\/.*\/(\d+)$/
    ]
  },
  istockphoto: {
    domains: ['istockphoto.com', 'www.istockphoto.com'],
    patterns: [
      /istockphoto\.com\/.*?gm(\d+)/,
      /istockphoto\.com\/.*?(\d+)$/,
      /istockphoto\.com\/photo\/.*?-gm(\d+)/
    ]
  },
  adobestock: {
    domains: ['stock.adobe.com', 'adobe.com'],
    patterns: [
      /stock\.adobe\.com\/.*?(\d+)/,
      /adobe\.com\/stock\/.*?(\d+)/
    ]
  },
  dreamstime: {
    domains: ['dreamstime.com', 'www.dreamstime.com'],
    patterns: [
      /dreamstime\.com\/.*?(\d+)/,
      /dreamstime\.com\/.*?image(\d+)/
    ]
  },
  alamy: {
    domains: ['alamy.com', 'www.alamy.com'],
    patterns: [
      /alamy\.com\/.*?([A-Z0-9]{6,})/,
      /alamy\.com\/stock-photo\/.*?-([A-Z0-9]+)\.html/
    ]
  },
  freepik: {
    domains: ['freepik.com', 'www.freepik.com'],
    patterns: [
      /freepik\.com\/.*?(\d+)/,
      /freepik\.com\/free-photo\/.*?_(\d+)/
    ]
  },
  unsplash: {
    domains: ['unsplash.com', 'www.unsplash.com'],
    patterns: [
      /unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/,
      /unsplash\.com\/.*?\/([a-zA-Z0-9_-]+)$/
    ]
  },
  pexels: {
    domains: ['pexels.com', 'www.pexels.com'],
    patterns: [
      /pexels\.com\/photo\/.*?-(\d+)/,
      /pexels\.com\/.*?(\d+)/
    ]
  },
  pixabay: {
    domains: ['pixabay.com', 'www.pixabay.com'],
    patterns: [
      /pixabay\.com\/.*?-(\d+)/,
      /pixabay\.com\/.*?(\d+)$/
    ]
  },
  gettyimages: {
    domains: ['gettyimages.com', 'www.gettyimages.com'],
    patterns: [
      /gettyimages\.com\/.*?(\d+)/,
      /gettyimages\.com\/detail\/.*?(\d+)$/
    ]
  }
}

/**
 * Parse a single input line to extract stock site and ID
 */
export function parseStockInput(input: string): ParsedStockInput {
  const trimmed = input.trim()
  
  if (!trimmed) {
    return {
      raw: input,
      site: '',
      id: '',
      isValid: false,
      error: 'Empty input'
    }
  }

  // Check if it's a URL
  if (trimmed.startsWith('http')) {
    return parseStockURL(trimmed)
  }
  
  // Check if it's just a numeric ID (assume shutterstock for now)
  if (/^\d+$/.test(trimmed)) {
    return {
      raw: input,
      site: 'shutterstock', // Default assumption
      id: trimmed,
      isValid: true
    }
  }

  // Check if it's a site:id format
  const siteIdMatch = trimmed.match(/^([a-zA-Z]+):(.+)$/)
  if (siteIdMatch) {
    const [, site, id] = siteIdMatch
    const normalizedSite = site.toLowerCase()
    
    if (STOCK_SITE_PATTERNS[normalizedSite as keyof typeof STOCK_SITE_PATTERNS]) {
      return {
        raw: input,
        site: normalizedSite,
        id: id.trim(),
        isValid: true
      }
    }
  }

  return {
    raw: input,
    site: '',
    id: '',
    isValid: false,
    error: 'Unrecognized format. Use URL, ID, or site:id format'
  }
}

/**
 * Parse a stock photo URL to extract site and ID
 */
function parseStockURL(url: string): ParsedStockInput {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()
    
    // Find matching site pattern
    for (const [siteName, config] of Object.entries(STOCK_SITE_PATTERNS)) {
      if (config.domains.some(domain => hostname.includes(domain))) {
        // Try each pattern for this site
        for (const pattern of config.patterns) {
          const match = url.match(pattern)
          if (match && match[1]) {
            return {
              raw: url,
              site: siteName,
              id: match[1],
              url,
              isValid: true
            }
          }
        }
        
        // Site matched but no ID pattern worked
        return {
          raw: url,
          site: siteName,
          id: '',
          isValid: false,
          error: `Could not extract ID from ${siteName} URL`
        }
      }
    }
    
    return {
      raw: url,
      site: '',
      id: '',
      isValid: false,
      error: 'Unsupported stock site'
    }
  } catch (error) {
    return {
      raw: url,
      site: '',
      id: '',
      isValid: false,
      error: 'Invalid URL format'
    }
  }
}

/**
 * Parse multiple input lines
 */
export function parseInputLines(
  input: string, 
  stockSites?: Record<string, StockSiteConfig>
): ParsedStockInput[] {
  if (!input.trim()) {
    return []
  }

  const lines = input.split('\n').filter(line => line.trim())
  const results = lines.map(parseStockInput)
  
  // Filter out inputs for inactive sites
  if (stockSites) {
    return results.map(result => {
      if (result.isValid && result.site) {
        const siteConfig = stockSites[result.site]
        if (!siteConfig || !siteConfig.active) {
          return {
            ...result,
            isValid: false,
            error: `${result.site} is currently inactive`
          }
        }
      }
      return result
    })
  }
  
  return results
}

/**
 * Get statistics about parsed inputs
 */
export function getInputStats(inputs: ParsedStockInput[]) {
  const total = inputs.length
  const valid = inputs.filter(i => i.isValid).length
  const invalid = total - valid
  
  const siteBreakdown = inputs
    .filter(i => i.isValid && i.site)
    .reduce((acc, input) => {
      acc[input.site] = (acc[input.site] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  return {
    total,
    valid,
    invalid,
    siteBreakdown
  }
}

/**
 * Validate if a site name is supported
 */
export function isSupportedSite(siteName: string): boolean {
  return siteName.toLowerCase() in STOCK_SITE_PATTERNS
}

/**
 * Get all supported site names
 */
export function getSupportedSites(): string[] {
  return Object.keys(STOCK_SITE_PATTERNS)
}
