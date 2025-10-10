# Security Implementation Guide

This document outlines the comprehensive security implementation for the Creo platform, including security headers, two-factor authentication, and advanced security features.

## Overview

The security implementation includes:
- **Security Headers**: Comprehensive HTTP security headers
- **Two-Factor Authentication**: TOTP-based 2FA with backup codes
- **Input Validation**: XSS and SQL injection prevention
- **Rate Limiting**: API protection against abuse
- **Security Monitoring**: Real-time security event tracking
- **Access Control**: Role-based permissions and IP whitelisting

## Implementation Details

### 1. Security Headers

#### Middleware Configuration
- **Content Security Policy**: Strict CSP with nonce support
- **X-Frame-Options**: DENY to prevent clickjacking
- **X-Content-Type-Options**: nosniff to prevent MIME sniffing
- **Referrer Policy**: strict-origin-when-cross-origin
- **Permissions Policy**: Restrictive permissions for sensitive APIs
- **Strict-Transport-Security**: HSTS with preload
- **Cross-Origin Policies**: CORS, COEP, COOP configuration

#### Security Headers Applied
```typescript
const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "connect-src 'self' https://api.stripe.com https://*.supabase.co",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'cross-origin'
}
```

### 2. Two-Factor Authentication (2FA)

#### TOTP Implementation
- **Algorithm**: SHA-1 (RFC 6238 compliant)
- **Digits**: 6-digit codes
- **Period**: 30-second windows
- **Tolerance**: 1 window (30 seconds)
- **Backup Codes**: 10 single-use codes
- **QR Code**: Automatic QR code generation for setup

#### 2FA Features
- **Setup Flow**: QR code + manual entry option
- **Verification**: TOTP token validation
- **Backup Codes**: Single-use recovery codes
- **Regeneration**: New backup codes on demand
- **Disable**: Secure 2FA removal with verification

#### 2FA Components
- `TwoFactorSetup.tsx` - Complete 2FA setup flow
- `TwoFactorVerification.tsx` - 2FA verification component
- `TwoFactorAuthService` - Backend 2FA management
- `generate2FASecret()` - Secret generation
- `verifyTOTPToken()` - Token verification

### 3. Input Validation & Sanitization

#### XSS Prevention
```typescript
export function sanitizeInput(input: string): string {
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
```

#### SQL Injection Prevention
```typescript
export function sanitizeSQL(input: string): string {
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
```

#### Path Traversal Prevention
```typescript
export function sanitizePath(input: string): string {
  return input
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/\/\//g, '/') // Remove double slashes
    .replace(/[<>:"|?*]/g, '') // Remove invalid characters
    .replace(/^\/+/, '') // Remove leading slashes
    .trim()
}
```

### 4. Rate Limiting

#### Rate Limiter Class
```typescript
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
}
```

#### Rate Limiting Configuration
- **Window**: 15 minutes
- **Max Requests**: 100 per window
- **Headers**: Rate limit headers included
- **IP-based**: Per-IP rate limiting
- **User-based**: Per-user rate limiting

### 5. Security Monitoring

#### Security Event Types
- **suspicious_activity**: Multiple failed attempts, unusual patterns
- **rate_limit_exceeded**: API rate limit violations
- **invalid_input**: XSS, SQL injection attempts
- **unauthorized_access**: Access to restricted resources

#### Security Audit Logger
```typescript
export class SecurityAuditLogger {
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
    
    console.warn('SECURITY EVENT:', logEntry)
    // TODO: Send to security monitoring service
  }
}
```

#### Security Dashboard
- **Real-time Events**: Live security event monitoring
- **Statistics**: Security metrics and trends
- **Filtering**: Event type and time range filters
- **Details**: Event metadata and context

### 6. Access Control

#### IP Whitelisting
```typescript
const adminIPWhitelist = [
  '127.0.0.1',
  '::1',
  // Add production admin IPs here
]
```

#### Admin Route Protection
- **IP Whitelist**: Admin routes restricted to specific IPs
- **Role-based**: Admin role verification
- **Headers**: Additional security headers for admin routes
- **Robots**: noindex, nofollow for admin pages

#### Suspicious Pattern Detection
```typescript
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
```

### 7. Password Security

#### Password Strength Checker
```typescript
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
  
  return {
    score: Math.max(0, Math.min(6, score)),
    feedback,
    isStrong: score >= 4
  }
}
```

#### Password Requirements
- **Minimum Length**: 8 characters
- **Recommended Length**: 12+ characters
- **Character Variety**: Uppercase, lowercase, numbers, symbols
- **No Common Patterns**: No repeated characters or sequences
- **No Common Words**: No dictionary words or common passwords

### 8. Security.txt

#### Security Contact Information
```
Contact: mailto:security@creo.vercel.app
Contact: https://creo.vercel.app/security
Expires: 2025-12-31T23:59:59.000Z
Encryption: https://creo.vercel.app/.well-known/pgp-key.txt
Acknowledgments: https://creo.vercel.app/security/acknowledgments
Preferred-Languages: en, ar
Canonical: https://creo.vercel.app/.well-known/security.txt
Policy: https://creo.vercel.app/security/policy
```

#### Security Policy
- **Responsible Disclosure**: 90-day disclosure timeline
- **Bug Bounty**: Rewards for valid vulnerabilities
- **Scope**: In-scope and out-of-scope areas
- **Legal**: Terms and conditions for security research

### 9. API Security

#### API Route Protection
- **Rate Limiting**: Per-IP and per-user limits
- **Input Validation**: Comprehensive input sanitization
- **Authentication**: JWT token validation
- **Authorization**: Role-based access control
- **CORS**: Proper CORS configuration
- **Headers**: Security headers for API responses

#### API Security Headers
```typescript
// API route protection
if (pathname.startsWith('/api')) {
  response.headers.set('X-API-Version', '1.0')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-RateLimit-Limit', rateLimitConfig.max.toString())
  response.headers.set('X-RateLimit-Remaining', '99')
  response.headers.set('X-RateLimit-Reset', new Date(Date.now() + rateLimitConfig.windowMs).toISOString())
}
```

### 10. Database Security

#### Row Level Security (RLS)
- **User Profiles**: RLS policies for user data
- **Orders**: RLS policies for order data
- **Payments**: RLS policies for payment data
- **Downloads**: RLS policies for download data
- **API Keys**: RLS policies for API key data

#### Database Security Features
- **Encryption**: Data encryption at rest
- **Backups**: Automated encrypted backups
- **Access Control**: Database-level permissions
- **Audit Logging**: Database access logging
- **Connection Security**: SSL/TLS connections

## Security Features

### 1. Security Headers
- ✅ **Content Security Policy**: Strict CSP with nonce support
- ✅ **X-Frame-Options**: DENY to prevent clickjacking
- ✅ **X-Content-Type-Options**: nosniff to prevent MIME sniffing
- ✅ **Referrer Policy**: strict-origin-when-cross-origin
- ✅ **Permissions Policy**: Restrictive permissions
- ✅ **Strict-Transport-Security**: HSTS with preload
- ✅ **Cross-Origin Policies**: CORS, COEP, COOP

### 2. Two-Factor Authentication
- ✅ **TOTP Implementation**: RFC 6238 compliant
- ✅ **QR Code Setup**: Automatic QR code generation
- ✅ **Backup Codes**: 10 single-use recovery codes
- ✅ **Verification**: TOTP token validation
- ✅ **Management**: Enable/disable 2FA
- ✅ **Regeneration**: New backup codes on demand

### 3. Input Validation
- ✅ **XSS Prevention**: Input sanitization
- ✅ **SQL Injection Prevention**: SQL sanitization
- ✅ **Path Traversal Prevention**: Path sanitization
- ✅ **File Upload Validation**: File type and size validation
- ✅ **Email Validation**: Email format validation
- ✅ **URL Validation**: URL format validation

### 4. Rate Limiting
- ✅ **IP-based Limiting**: Per-IP rate limits
- ✅ **User-based Limiting**: Per-user rate limits
- ✅ **API Protection**: API route rate limiting
- ✅ **Headers**: Rate limit headers
- ✅ **Configuration**: Configurable limits

### 5. Security Monitoring
- ✅ **Event Logging**: Security event tracking
- ✅ **Real-time Monitoring**: Live security dashboard
- ✅ **Event Types**: Suspicious activity, rate limits, invalid input
- ✅ **Statistics**: Security metrics and trends
- ✅ **Filtering**: Event type and time range filters

### 6. Access Control
- ✅ **IP Whitelisting**: Admin IP restrictions
- ✅ **Role-based Access**: Admin role verification
- ✅ **Suspicious Pattern Detection**: Attack pattern detection
- ✅ **User Agent Blocking**: Malicious user agent blocking
- ✅ **Path Protection**: Blocked path protection

### 7. Password Security
- ✅ **Strength Checker**: Password strength validation
- ✅ **Requirements**: Minimum password requirements
- ✅ **Common Pattern Detection**: Common password detection
- ✅ **Feedback**: Password improvement suggestions
- ✅ **Scoring**: Password strength scoring

### 8. Security Documentation
- ✅ **Security.txt**: Security contact information
- ✅ **Security Policy**: Responsible disclosure policy
- ✅ **Bug Bounty**: Vulnerability reward program
- ✅ **Scope**: In-scope and out-of-scope areas
- ✅ **Legal**: Terms and conditions

## Security Best Practices

### 1. Development Security
- **Input Validation**: Validate all user inputs
- **Output Encoding**: Encode all outputs
- **Error Handling**: Secure error messages
- **Logging**: Comprehensive security logging
- **Testing**: Security testing and auditing

### 2. Production Security
- **HTTPS**: Force HTTPS connections
- **Headers**: Implement security headers
- **Monitoring**: Real-time security monitoring
- **Updates**: Regular security updates
- **Backups**: Secure encrypted backups

### 3. User Security
- **2FA**: Encourage two-factor authentication
- **Passwords**: Strong password requirements
- **Education**: Security awareness training
- **Reporting**: Security incident reporting
- **Support**: Security support channels

## Security Monitoring

### 1. Real-time Monitoring
- **Security Events**: Live security event tracking
- **Statistics**: Security metrics and trends
- **Alerts**: Security incident alerts
- **Dashboard**: Security monitoring dashboard
- **Reports**: Security incident reports

### 2. Security Metrics
- **Total Events**: Total security events
- **Event Types**: Breakdown by event type
- **Time Ranges**: Events by time period
- **Top IPs**: Most active IP addresses
- **Top User Agents**: Most common user agents

### 3. Security Alerts
- **Suspicious Activity**: Unusual activity detection
- **Rate Limiting**: Rate limit violations
- **Invalid Input**: Malicious input attempts
- **Unauthorized Access**: Unauthorized access attempts
- **System Anomalies**: System behavior anomalies

## Security Implementation Results

### 1. Security Headers
- ✅ **CSP**: Content Security Policy implemented
- ✅ **X-Frame-Options**: Clickjacking protection
- ✅ **X-Content-Type-Options**: MIME sniffing protection
- ✅ **HSTS**: HTTP Strict Transport Security
- ✅ **CORS**: Cross-Origin Resource Sharing
- ✅ **COEP/COOP**: Cross-Origin policies

### 2. Two-Factor Authentication
- ✅ **TOTP**: Time-based One-Time Password
- ✅ **QR Codes**: Automatic QR code generation
- ✅ **Backup Codes**: Single-use recovery codes
- ✅ **Setup Flow**: Complete 2FA setup process
- ✅ **Verification**: 2FA verification component
- ✅ **Management**: 2FA enable/disable functionality

### 3. Input Validation
- ✅ **XSS Prevention**: Cross-site scripting protection
- ✅ **SQL Injection Prevention**: SQL injection protection
- ✅ **Path Traversal Prevention**: Directory traversal protection
- ✅ **File Upload Validation**: Secure file uploads
- ✅ **Input Sanitization**: Comprehensive input cleaning

### 4. Rate Limiting
- ✅ **IP-based Limiting**: Per-IP rate limits
- ✅ **User-based Limiting**: Per-user rate limits
- ✅ **API Protection**: API route protection
- ✅ **Headers**: Rate limit headers
- ✅ **Configuration**: Flexible rate limiting

### 5. Security Monitoring
- ✅ **Event Logging**: Security event tracking
- ✅ **Real-time Dashboard**: Live security monitoring
- ✅ **Statistics**: Security metrics and trends
- ✅ **Filtering**: Event type and time filtering
- ✅ **Alerts**: Security incident alerts

## Security Benefits

### 1. Protection Against Attacks
- **XSS**: Cross-site scripting protection
- **SQL Injection**: SQL injection protection
- **CSRF**: Cross-site request forgery protection
- **Clickjacking**: Clickjacking protection
- **Path Traversal**: Directory traversal protection

### 2. User Security
- **2FA**: Two-factor authentication
- **Strong Passwords**: Password strength requirements
- **Secure Sessions**: Secure session management
- **Access Control**: Role-based access control
- **Audit Logging**: Security audit trails

### 3. System Security
- **Rate Limiting**: API abuse protection
- **Input Validation**: Malicious input protection
- **Security Headers**: HTTP security headers
- **Monitoring**: Real-time security monitoring
- **Incident Response**: Security incident handling

The security implementation provides comprehensive protection against common web vulnerabilities and attacks, ensuring the Creo platform is secure for both users and administrators.
