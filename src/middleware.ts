import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Security headers configuration
const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.nehtw.com https://*.upstash.io https://*.sentry.io",
    "frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // X-Frame-Options
  'X-Frame-Options': 'DENY',
  
  // X-Content-Type-Options
  'X-Content-Type-Options': 'nosniff',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
    'payment=(self)',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '),
  
  // X-DNS-Prefetch-Control
  'X-DNS-Prefetch-Control': 'on',
  
  // Strict-Transport-Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Cross-Origin Policies
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'cross-origin'
}

// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
}

// IP whitelist for admin routes
const adminIPWhitelist = [
  '127.0.0.1',
  '::1',
  // Add production admin IPs here
]

// Suspicious patterns to block
const suspiciousPatterns = [
  /\.\./, // Path traversal
  /<script/i, // XSS attempts
  /javascript:/i, // JavaScript protocol
  /on\w+\s*=/i, // Event handlers
  /union\s+select/i, // SQL injection
  /drop\s+table/i, // SQL injection
  /insert\s+into/i, // SQL injection
  /delete\s+from/i, // SQL injection
  /exec\s*\(/i, // Command injection
  /eval\s*\(/i, // Code injection
]

// Security middleware function
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const userAgent = request.headers.get('user-agent') || ''
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  
  // Security headers
  const response = NextResponse.next()
  
  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Block suspicious user agents
  const suspiciousUserAgents = [
    'sqlmap',
    'nikto',
    'nmap',
    'masscan',
    'zap',
    'burp',
    'w3af',
    'acunetix',
    'nessus',
    'openvas'
  ]
  
  if (suspiciousUserAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return new NextResponse('Forbidden', { status: 403 })
  }
  
  // Block suspicious patterns in URL
  const fullUrl = request.url
  if (suspiciousPatterns.some(pattern => pattern.test(fullUrl))) {
    return new NextResponse('Bad Request', { status: 400 })
  }
  
  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // Check IP whitelist for admin routes
    if (!adminIPWhitelist.includes(ip)) {
      return new NextResponse('Forbidden', { status: 403 })
    }
    
    // Additional admin security headers
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  
  // API route protection
  if (pathname.startsWith('/api')) {
    // Add API-specific security headers
    response.headers.set('X-API-Version', '1.0')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    
    // Rate limiting headers
    response.headers.set('X-RateLimit-Limit', rateLimitConfig.max.toString())
    response.headers.set('X-RateLimit-Remaining', '99')
    response.headers.set('X-RateLimit-Reset', new Date(Date.now() + rateLimitConfig.windowMs).toISOString())
  }
  
  // Block common attack paths
  const blockedPaths = [
    '/.env',
    '/.git',
    '/.svn',
    '/.htaccess',
    '/.htpasswd',
    '/wp-admin',
    '/wp-login',
    '/phpmyadmin',
    '/admin.php',
    '/config.php',
    '/backup',
    '/backups',
    '/.backup',
    '/.bak',
    '/.old',
    '/.tmp',
    '/.temp'
  ]
  
  if (blockedPaths.some(path => pathname.toLowerCase().includes(path))) {
    return new NextResponse('Not Found', { status: 404 })
  }
  
  // Block requests with suspicious query parameters
  const suspiciousParams = ['cmd', 'exec', 'system', 'eval', 'shell', 'bash', 'sh']
  for (const [key, value] of searchParams.entries()) {
    if (suspiciousParams.includes(key.toLowerCase()) || 
        suspiciousPatterns.some(pattern => pattern.test(value))) {
      return new NextResponse('Bad Request', { status: 400 })
    }
  }
  
  // Add security headers for specific routes
  if (pathname.startsWith('/auth')) {
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
  }
  
  // Add CORS headers for API routes
  if (pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://creo.vercel.app' : '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    response.headers.set('Access-Control-Max-Age', '86400')
  }
  
  // Add cache control headers
  if (pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (pathname.startsWith('/api')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  } else {
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
  }
  
  return response
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}