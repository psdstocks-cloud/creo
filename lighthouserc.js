module.exports = {
  ci: {
    collect: {
      // Start the server before running Lighthouse
      startServerCommand: 'npm run start',
      // URL to run Lighthouse against
      url: [
        'http://localhost:3000',
        'http://localhost:3000/stock-search',
        'http://localhost:3000/ai-generation',
        'http://localhost:3000/orders',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/billing',
        'http://localhost:3000/settings',
        'http://localhost:3000/admin',
      ],
      // Number of runs to perform
      numberOfRuns: 3,
      // Settings for Lighthouse
      settings: {
        // Use mobile and desktop configurations
        formFactor: 'both',
        // Throttling settings
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
        // Screen emulation
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
        },
        // Additional settings
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        // Skip certain audits that might fail in CI
        skipAudits: [
          'uses-http2',
          'uses-long-cache-ttl',
          'uses-optimized-images',
        ],
      },
    },
    assert: {
      // Performance budgets
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        
        // Resource budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 500000 }], // 500KB
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }], // 100KB
        'resource-summary:image:size': ['error', { maxNumericValue: 1000000 }], // 1MB
        'resource-summary:font:size': ['error', { maxNumericValue: 200000 }], // 200KB
        
        // Network budgets
        'unused-css-rules': ['warn', { maxNumericValue: 50000 }], // 50KB
        'unused-javascript': ['warn', { maxNumericValue: 100000 }], // 100KB
        'render-blocking-resources': ['warn', { maxNumericValue: 2 }],
        
        // Accessibility assertions
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        'button-name': 'error',
        'html-has-lang': 'error',
        'html-lang-valid': 'error',
        'meta-viewport': 'error',
        
        // SEO assertions
        'document-title': 'error',
        'meta-description': 'error',
        'canonical': 'error',
        'robots-txt': 'error',
        'structured-data': 'warn',
      },
    },
    upload: {
      // Upload results to Lighthouse CI server (optional)
      target: 'temporary-public-storage',
    },
    // Server configuration
    server: {
      // Port for the Lighthouse CI server
      port: 9001,
    },
  },
};
