# Performance Monitoring Setup

This document describes the performance monitoring setup for the Creo platform using Lighthouse CI and Core Web Vitals.

## Overview

The performance monitoring system includes:
- **Lighthouse CI**: Automated performance testing in CI/CD
- **Core Web Vitals**: Real-time performance metrics
- **Bundle Analysis**: JavaScript bundle size monitoring
- **Performance Budgets**: Automated performance thresholds

## Setup

### 1. Dependencies

The following packages are installed for performance monitoring:

```json
{
  "devDependencies": {
    "@lhci/cli": "^0.15.1",
    "@next/bundle-analyzer": "^15.5.4",
    "lighthouse": "^13.0.0"
  }
}
```

### 2. Configuration Files

#### Lighthouse CI Configuration (`lighthouserc.js`)

```javascript
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      url: [
        'http://localhost:3000',
        'http://localhost:3000/stock-search',
        'http://localhost:3000/ai-generation',
        // ... other URLs
      ],
      numberOfRuns: 3,
      settings: {
        formFactor: 'both',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
      },
    },
  },
};
```

#### Performance Budget (`performance-budget.json`)

```json
{
  "budgets": [
    {
      "path": "/*",
      "timings": [
        { "metric": "first-contentful-paint", "budget": 2000 },
        { "metric": "largest-contentful-paint", "budget": 2500 },
        { "metric": "cumulative-layout-shift", "budget": 0.1 },
        { "metric": "total-blocking-time", "budget": 300 },
        { "metric": "speed-index", "budget": 3000 }
      ],
      "resourceSizes": [
        { "resourceType": "script", "budget": 500000 },
        { "resourceType": "stylesheet", "budget": 100000 },
        { "resourceType": "image", "budget": 1000000 },
        { "resourceType": "font", "budget": 200000 }
      ]
    }
  ]
}
```

### 3. Scripts

The following npm scripts are available:

```json
{
  "scripts": {
    "lighthouse": "lhci autorun --config=./lighthouserc.js",
    "lighthouse:mobile": "lhci autorun --config=./lighthouserc.js --collect.settings.formFactor=mobile",
    "lighthouse:desktop": "lhci autorun --config=./lighthouserc.js --collect.settings.formFactor=desktop",
    "performance": "node scripts/performance-monitor.js",
    "analyze": "ANALYZE=true npm run build",
    "bundle-size": "npm run build && npx @next/bundle-analyzer .next"
  }
}
```

## Usage

### 1. Local Performance Testing

```bash
# Start the development server
npm run dev

# In another terminal, run Lighthouse CI
npm run lighthouse

# Run performance monitoring script
npm run performance

# Analyze bundle size
npm run analyze
```

### 2. CI/CD Integration

The GitHub Actions workflow (`.github/workflows/lighthouse-ci.yml`) automatically runs:
- Lighthouse CI on every push and PR
- Bundle analysis on PRs
- Performance monitoring on main branch pushes

### 3. Performance Monitoring Components

#### Core Web Vitals Hook

```typescript
import { useCoreWebVitals } from '@/hooks/useCoreWebVitals'

function MyComponent() {
  const { vitals, vitalsStatus, overallScore } = useCoreWebVitals()
  
  return (
    <div>
      <p>FCP: {vitals.fcp}ms</p>
      <p>LCP: {vitals.lcp}ms</p>
      <p>CLS: {vitals.cls}</p>
      <p>Overall Score: {Math.round(overallScore * 100)}%</p>
    </div>
  )
}
```

#### Performance Dashboard

```typescript
import { PerformanceDashboard } from '@/components/ui/PerformanceDashboard'

function AdminPage() {
  return (
    <div>
      <PerformanceDashboard showDetails={true} />
    </div>
  )
}
```

## Performance Thresholds

### Core Web Vitals

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| FCP | ≤ 1.8s | 1.8s - 3.0s | > 3.0s |
| LCP | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| CLS | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| FID | ≤ 100ms | 100ms - 300ms | > 300ms |
| TTFB | ≤ 600ms | 600ms - 1.5s | > 1.5s |

### Lighthouse Scores

| Category | Minimum Score |
|-----------|---------------|
| Performance | 80 |
| Accessibility | 90 |
| Best Practices | 80 |
| SEO | 80 |

### Resource Budgets

| Resource Type | Maximum Size |
|---------------|--------------|
| JavaScript | 500KB |
| CSS | 100KB |
| Images | 1MB |
| Fonts | 200KB |

## Monitoring Dashboard

The admin dashboard includes:
- Real-time Core Web Vitals monitoring
- Performance score tracking
- Resource usage analysis
- Performance recommendations

## Troubleshooting

### Common Issues

1. **Lighthouse CI fails**: Check if the server is running on the correct port
2. **Performance scores low**: Review bundle size and image optimization
3. **Core Web Vitals not updating**: Ensure PerformanceObserver is supported

### Debug Commands

```bash
# Check Lighthouse CI configuration
npx lhci autorun --config=./lighthouserc.js --dry-run

# Run specific Lighthouse audits
npx lighthouse http://localhost:3000 --only-categories=performance

# Analyze bundle composition
npm run analyze
```

## Best Practices

1. **Regular Monitoring**: Run performance tests on every deployment
2. **Budget Enforcement**: Set up alerts for budget violations
3. **Optimization**: Focus on the largest performance impacts first
4. **User Experience**: Prioritize Core Web Vitals for user satisfaction

## Integration with External Services

### Slack Notifications

Configure webhook URLs in `performance-budget.json`:

```json
{
  "alerts": {
    "webhook": {
      "url": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
    }
  }
}
```

### Performance Monitoring Services

Consider integrating with:
- **Google PageSpeed Insights API**
- **WebPageTest API**
- **Sentry Performance Monitoring**

## Future Enhancements

1. **Real User Monitoring (RUM)**: Collect performance data from actual users
2. **Performance Regression Detection**: Automated alerts for performance degradation
3. **A/B Testing Integration**: Performance impact of feature changes
4. **Mobile Performance**: Dedicated mobile performance monitoring
5. **Third-party Impact**: Monitor performance impact of external scripts

## Resources

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)
