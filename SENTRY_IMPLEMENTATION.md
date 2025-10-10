# Sentry Implementation Guide

This document outlines the comprehensive Sentry integration for error tracking and performance monitoring in the Creo platform.

## Overview

Sentry provides:
- **Error Tracking**: Real-time error monitoring and alerting
- **Performance Monitoring**: Core Web Vitals and custom performance metrics
- **Session Replay**: User session recordings for debugging
- **Release Tracking**: Monitor errors across different app versions
- **User Context**: Enhanced error context with user information

## Implementation Features

### 1. Error Tracking
- ✅ **Automatic Error Capture**: All unhandled errors are automatically captured
- ✅ **Error Boundaries**: React error boundaries for graceful error handling
- ✅ **Custom Error Context**: Enhanced error context with user and request data
- ✅ **Error Filtering**: Smart filtering to reduce noise from non-actionable errors

### 2. Performance Monitoring
- ✅ **Core Web Vitals**: LCP, FID, CLS tracking
- ✅ **Custom Metrics**: API call performance, component render times
- ✅ **Transaction Tracking**: End-to-end request performance
- ✅ **Performance Budgets**: Automated performance regression detection

### 3. User Context
- ✅ **User Identification**: Automatic user context in errors
- ✅ **Custom Tags**: Business-specific error categorization
- ✅ **Breadcrumbs**: User action trail leading to errors
- ✅ **Session Tracking**: User session information

### 4. Admin Dashboard
- ✅ **Real-time Monitoring**: Live error and performance data
- ✅ **Error Analytics**: Error trends and patterns
- ✅ **Performance Metrics**: Core Web Vitals dashboard
- ✅ **System Health**: Overall application health status

## Configuration Files

### 1. Sentry Configuration Files

#### `sentry.client.config.ts`
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.5,
  replaysOnErrorSampleRate: 1.0,
  debug: process.env.NODE_ENV === 'development',
  environment: process.env.NODE_ENV || 'development',
  release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  beforeSend(event, hint) {
    // Filter out non-critical errors
    if (process.env.NODE_ENV === 'production') {
      // Filter logic here
    }
    return event
  },
  integrations: [
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
})
```

#### `sentry.server.config.ts`
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === 'development',
  environment: process.env.NODE_ENV || 'development',
  release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  beforeSend(event, hint) {
    // Server-specific error filtering
    return event
  },
})
```

#### `sentry.edge.config.ts`
```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === 'development',
  environment: process.env.NODE_ENV || 'development',
  release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
})
```

### 2. Sentry Utilities (`src/lib/sentry.ts`)

#### User Context Management
```typescript
// Set user context in Sentry
export function setUserContext(user: User | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.user_metadata?.full_name || user.email,
    })
  }
}

// Set additional user profile context
export function setUserProfileContext(profile: any) {
  Sentry.setContext('user_profile', {
    credits: profile.credits,
    subscription_plan: profile.subscription_plan,
    is_active: profile.is_active,
  })
}
```

#### Business Event Tracking
```typescript
// Track custom business events
export function trackBusinessEvent(event: string, data?: any) {
  Sentry.addBreadcrumb({
    category: 'business',
    message: event,
    level: 'info',
    data,
  })
}

// Track order events
export function trackOrderEvent(orderId: string, event: string, data?: any) {
  Sentry.addBreadcrumb({
    category: 'order',
    message: `Order ${orderId}: ${event}`,
    level: 'info',
    data: { orderId, event, ...data },
  })
}
```

#### Performance Tracking
```typescript
// Track custom performance metrics
export function trackPerformance(metric: string, value: number, unit: string = 'ms') {
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `${metric}: ${value}${unit}`,
    level: 'info',
    data: { metric, value, unit },
  })
}

// Track Core Web Vitals
export function trackWebVitals(metric: {
  name: string
  value: number
  id: string
  delta: number
}) {
  Sentry.addBreadcrumb({
    category: 'web_vitals',
    message: `${metric.name}: ${metric.value}`,
    level: 'info',
    data: metric,
  })
}
```

### 3. Error Boundaries

#### `SentryErrorBoundary` Component
```typescript
export class SentryErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        errorBoundary: true,
      },
    })
    
    this.setState({ eventId })
  }
}
```

#### Usage in Layout
```typescript
<SentryErrorBoundary>
  <div id="main-content" className="relative min-h-screen">
    <QueryProvider>
      <AuthProvider>
        <UserProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </UserProvider>
      </AuthProvider>
    </QueryProvider>
  </div>
</SentryErrorBoundary>
```

### 4. Performance Monitoring Hooks

#### `useSentryPerformance` Hook
```typescript
export function useSentryPerformance() {
  // Track Core Web Vitals
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          trackWebVitals({
            name: 'LCP',
            value: entry.startTime,
            id: entry.id,
            delta: entry.startTime,
          })
        }
        // ... other metrics
      }
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
  }, [])
}
```

#### `useComponentPerformance` Hook
```typescript
export function useComponentPerformance(componentName: string) {
  const trackComponentAction = useCallback((action: string, startTime: number) => {
    const duration = performance.now() - startTime
    trackPerformance(`Component Action: ${componentName} - ${action}`, duration)
  }, [componentName])
  
  return { trackComponentAction }
}
```

### 5. API Middleware

#### Sentry API Middleware
```typescript
export function withSentryAPIMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = performance.now()
    
    try {
      const response = await handler(req)
      const duration = performance.now() - startTime
      trackAPICall(endpoint, method, response.status, duration)
      return response
    } catch (error) {
      trackAPIError(error as Error, {
        url: req.url,
        method: req.method,
        headers: Object.fromEntries(req.headers.entries()),
      })
      throw error
    }
  }
}
```

### 6. Admin Dashboard

#### Sentry Monitoring Component
```typescript
export function SentryMonitoring() {
  const [stats, setStats] = useState<SentryStats | null>(null)
  const [errors, setErrors] = useState<ErrorData[]>([])
  const [performance, setPerformance] = useState<PerformanceData[]>([])
  
  // Real-time monitoring data
  // Error analytics
  // Performance metrics
  // System health status
}
```

## Environment Variables

### Required Environment Variables
```bash
# Sentry DSN (required)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Sentry Organization and Project (for source maps)
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token

# App Version (for release tracking)
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Optional Environment Variables
```bash
# Sentry Environment
SENTRY_ENVIRONMENT=production

# Sentry Debug Mode
SENTRY_DEBUG=true

# Sentry Sample Rates
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_REPLAYS_SAMPLE_RATE=0.1
```

## Usage Examples

### 1. Basic Error Tracking
```typescript
import { trackError } from '@/lib/sentry'

try {
  // Some operation that might fail
  await riskyOperation()
} catch (error) {
  trackError(error, { context: 'user_action' })
  throw error
}
```

### 2. Performance Monitoring
```typescript
import { useSentryPerformance } from '@/hooks/useSentryPerformance'

function MyComponent() {
  const { trackComponentRender } = useSentryPerformance()
  
  useEffect(() => {
    const startTime = performance.now()
    // Component logic
    trackComponentRender('MyComponent', startTime)
  }, [])
}
```

### 3. Business Event Tracking
```typescript
import { trackOrderEvent, trackPaymentEvent } from '@/lib/sentry'

// Track order creation
trackOrderEvent(orderId, 'created', { 
  orderType: 'stock_download',
  totalCost: 500 
})

// Track payment success
trackPaymentEvent(paymentId, 'succeeded', { 
  amount: 500,
  currency: 'USD' 
})
```

### 4. User Context Setting
```typescript
import { setUserContext, setUserProfileContext } from '@/lib/sentry'

// Set user context on login
useEffect(() => {
  if (user) {
    setUserContext(user)
    setUserProfileContext(userProfile)
  }
}, [user, userProfile])
```

## Monitoring Dashboard

### Admin Dashboard Features
- **Real-time Error Count**: Live error statistics
- **Performance Score**: Core Web Vitals score
- **Active Users**: Current user count
- **Response Time**: Average API response time
- **System Health**: Overall application health

### Error Analytics
- **Error Trends**: Error count over time
- **Error Categories**: Categorized error types
- **User Impact**: Errors affecting user experience
- **Resolution Status**: Error resolution tracking

### Performance Metrics
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Custom Metrics**: Application-specific performance
- **Performance Trends**: Performance over time
- **Performance Budgets**: Automated regression detection

## Testing and Validation

### 1. Error Tracking Test
```bash
# Test error tracking
npm run sentry:test

# This will trigger a test error and verify it's captured in Sentry
```

### 2. Performance Monitoring Test
```bash
# Test performance monitoring
npm run sentry:monitor

# This will fetch performance metrics from the monitoring API
```

### 3. Manual Testing
```typescript
// Test error boundary
throw new Error('Test error for Sentry')

// Test performance tracking
const startTime = performance.now()
// ... some operation
const duration = performance.now() - startTime
trackPerformance('Test Operation', duration)
```

## Best Practices

### 1. Error Filtering
- Filter out non-actionable errors (network issues, browser extensions)
- Focus on application-specific errors
- Use beforeSend hooks for smart filtering

### 2. Performance Monitoring
- Track Core Web Vitals for user experience
- Monitor custom business metrics
- Set up performance budgets
- Track API response times

### 3. User Context
- Always set user context for better error tracking
- Include relevant business context
- Use breadcrumbs for user action trails
- Track feature usage

### 4. Release Management
- Tag releases for error tracking
- Monitor error rates across versions
- Set up alerts for error spikes
- Track performance regressions

## Troubleshooting

### Common Issues

1. **Sentry not capturing errors**
   - Check DSN configuration
   - Verify environment variables
   - Check network connectivity
   - Verify Sentry project settings

2. **Performance data not showing**
   - Check tracesSampleRate configuration
   - Verify performance monitoring setup
   - Check Core Web Vitals implementation
   - Verify custom metrics tracking

3. **User context not appearing**
   - Verify user context setting
   - Check user authentication flow
   - Verify context data format
   - Check Sentry user identification

### Debug Commands
```bash
# Initialize Sentry setup
npm run sentry:init

# Test error tracking
npm run sentry:test

# Test performance monitoring
npm run sentry:monitor

# Check Sentry configuration
node -e "console.log(process.env.NEXT_PUBLIC_SENTRY_DSN)"
```

## Production Deployment

### 1. Environment Setup
- Set up Sentry project
- Configure environment variables
- Set up source map uploading
- Configure release tracking

### 2. Monitoring Setup
- Set up error alerts
- Configure performance budgets
- Set up user impact monitoring
- Configure release monitoring

### 3. Maintenance
- Regular error review
- Performance optimization
- User feedback integration
- Continuous monitoring

The Sentry implementation provides comprehensive error tracking and performance monitoring for the Creo platform, ensuring production-ready monitoring and debugging capabilities.
