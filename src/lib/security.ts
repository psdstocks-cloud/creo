/**
 * Security Utilities
 * 
 * This file contains security-related utilities for the Creo platform
 * including input validation, sanitization, and security checks.
 */

import { createHash, randomBytes, timingSafeEqual } from 'crypto'
import { z } from 'zod'

// Input validation schemas
export const securitySchemas = {
  // Email validation
  email: z.string().email().max(254).transform(email => email.toLowerCase().trim()),
  
  // Password validation
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  // Username validation
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  
  // API key validation
  apiKey: z.string()
    .min(32, 'API key must be at least 32 characters')
    .max(128, 'API key must be less than 128 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'API key can only contain letters, numbers, underscores, and hyphens'),
  
  // File upload validation
  fileUpload: z.object({
    name: z.string().max(255),
    size: z.number().max(10 * 1024 * 1024), // 10MB max
    type: z.string().regex(/^image\/(jpeg|jpg|png|gif|webp)$/),
  }),
  
  // Search query validation
  searchQuery: z.string()
    .max(100, 'Search query must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_.,!?]+$/, 'Search query contains invalid characters'),
}

// XSS prevention
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script tags
    .replace(/iframe/gi, '') // Remove iframe tags
    .replace(/object/gi, '') // Remove object tags
    .replace(/embed/gi, '') // Remove embed tags
    .replace(/link/gi, '') // Remove link tags
    .replace(/meta/gi, '') // Remove meta tags
    .replace(/style/gi, '') // Remove style tags
    .trim()
}

// SQL injection prevention
export function sanitizeSQL(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/['"`;]/g, '') // Remove quotes and semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comments start
    .replace(/\*\//g, '') // Remove block comments end
    .replace(/union/gi, '') // Remove UNION
    .replace(/select/gi, '') // Remove SELECT
    .replace(/insert/gi, '') // Remove INSERT
    .replace(/update/gi, '') // Remove UPDATE
    .replace(/delete/gi, '') // Remove DELETE
    .replace(/drop/gi, '') // Remove DROP
    .replace(/create/gi, '') // Remove CREATE
    .replace(/alter/gi, '') // Remove ALTER
    .replace(/exec/gi, '') // Remove EXEC
    .replace(/execute/gi, '') // Remove EXECUTE
    .trim()
}

// Path traversal prevention
export function sanitizePath(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/\/\//g, '/') // Remove double slashes
    .replace(/[<>:"|?*]/g, '') // Remove invalid characters
    .replace(/^\/+/, '') // Remove leading slashes
    .trim()
}

// CSRF token generation
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex')
}

// CSRF token validation
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false
  
  try {
    const tokenBuffer = Buffer.from(token, 'hex')
    const sessionBuffer = Buffer.from(sessionToken, 'hex')
    
    return timingSafeEqual(tokenBuffer, sessionBuffer)
  } catch {
    return false
  }
}

// Rate limiting
export class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map()
  
  constructor(
    private windowMs: number = 15 * 60 * 1000, // 15 minutes
    private maxRequests: number = 100
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const record = this.requests.get(identifier)
    
    if (!record || now > record.resetTime) {
      this.requests.set(identifier, { count: 1, resetTime: now + this.windowMs })
      return true
    }
    
    if (record.count >= this.maxRequests) {
      return false
    }
    
    record.count++
    return true
  }
  
  getRemainingRequests(identifier: string): number {
    const record = this.requests.get(identifier)
    if (!record || Date.now() > record.resetTime) {
      return this.maxRequests
    }
    return Math.max(0, this.maxRequests - record.count)
  }
  
  getResetTime(identifier: string): number {
    const record = this.requests.get(identifier)
    return record ? record.resetTime : Date.now() + this.windowMs
  }
}

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number
  feedback: string[]
  isStrong: boolean
} {
  const feedback: string[] = []
  let score = 0
  
  // Length check
  if (password.length >= 8) score += 1
  else feedback.push('Password should be at least 8 characters long')
  
  if (password.length >= 12) score += 1
  else feedback.push('Password should be at least 12 characters long for better security')
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Password should contain lowercase letters')
  
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Password should contain uppercase letters')
  
  if (/\d/.test(password)) score += 1
  else feedback.push('Password should contain numbers')
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  else feedback.push('Password should contain special characters')
  
  // Common patterns check
  if (/(.)\1{2,}/.test(password)) {
    score -= 1
    feedback.push('Password should not contain repeated characters')
  }
  
  if (/123|abc|qwe|asd|zxc/i.test(password)) {
    score -= 1
    feedback.push('Password should not contain common sequences')
  }
  
  // Common passwords check
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ]
  
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    score -= 2
    feedback.push('Password should not contain common words')
  }
  
  return {
    score: Math.max(0, Math.min(6, score)),
    feedback,
    isStrong: score >= 4
  }
}

// Secure hash generation
export function generateSecureHash(input: string, salt?: string): string {
  const actualSalt = salt || randomBytes(16).toString('hex')
  const hash = createHash('sha256')
  hash.update(input + actualSalt)
  return hash.digest('hex')
}

// Secure random string generation
export function generateSecureRandom(length: number = 32): string {
  return randomBytes(length).toString('hex')
}

// IP address validation
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// URL validation
export function isValidURL(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}

// File type validation
export function isValidFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension ? allowedTypes.includes(extension) : false
}

// Content Security Policy builder
export function buildCSP(directives: Record<string, string[]>): string {
  return Object.entries(directives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
}

// Security headers builder
export function buildSecurityHeaders(): Record<string, string> {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  }
}

// Input validation wrapper
export function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): {
  success: boolean
  data?: T
  errors?: string[]
} {
  try {
    const result = schema.parse(input)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      }
    }
    return { success: false, errors: ['Invalid input'] }
  }
}

// Security audit logger
export class SecurityAuditLogger {
  private static instance: SecurityAuditLogger
  
  static getInstance(): SecurityAuditLogger {
    if (!SecurityAuditLogger.instance) {
      SecurityAuditLogger.instance = new SecurityAuditLogger()
    }
    return SecurityAuditLogger.instance
  }
  
  logSecurityEvent(event: {
    type: 'suspicious_activity' | 'rate_limit_exceeded' | 'invalid_input' | 'unauthorized_access'
    message: string
    ip?: string
    userAgent?: string
    userId?: string
    metadata?: Record<string, any>
  }): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...event
    }
    
    // In production, this would be sent to a security monitoring service
    console.warn('SECURITY EVENT:', logEntry)
    
    // TODO: Send to security monitoring service (e.g., Sentry, DataDog)
  }
}

// Export singleton instance
export const securityAuditLogger = SecurityAuditLogger.getInstance()
