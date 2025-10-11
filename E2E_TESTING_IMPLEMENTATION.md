# E2E Testing Implementation

## Overview

This document describes the comprehensive end-to-end (E2E) testing setup for the Creo platform using Playwright. The E2E tests cover all critical user paths, ensuring the application works correctly across different browsers and devices.

## Table of Contents

- [Setup](#setup)
- [Test Structure](#test-structure)
- [Page Object Model](#page-object-model)
- [Test Categories](#test-categories)
- [Running Tests](#running-tests)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- Playwright browsers installed

### Installation

```bash
# Install Playwright and browsers
npm install --save-dev @playwright/test playwright
npx playwright install

# Install system dependencies (Linux)
npx playwright install-deps
```

### Configuration

The Playwright configuration is defined in `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Test Structure

```
e2e/
├── fixtures/
│   └── test-data.ts          # Test data and constants
├── pages/
│   ├── BasePage.ts           # Base page object
│   ├── AuthPage.ts           # Authentication page
│   ├── DashboardPage.ts       # Dashboard page
│   ├── StockSearchPage.ts     # Stock search page
│   ├── AIGenerationPage.ts    # AI generation page
│   └── AdminPage.ts           # Admin panel page
├── utils/
│   └── test-helpers.ts        # Test utility functions
├── global-setup.ts            # Global test setup
├── global-teardown.ts         # Global test teardown
├── auth.spec.ts               # Authentication tests
├── stock-search.spec.ts        # Stock search tests
├── ai-generation.spec.ts      # AI generation tests
├── admin.spec.ts              # Admin panel tests
└── user-journey.spec.ts       # Complete user journey tests
```

## Page Object Model

### BasePage

The `BasePage` class provides common functionality for all page objects:

```typescript
export class BasePage {
  protected page: Page
  protected helpers: TestHelpers

  constructor(page: Page) {
    this.page = page
    this.helpers = new TestHelpers(page)
  }

  async navigateTo(path: string) {
    await this.page.goto(path)
    await this.helpers.waitForPageLoad()
  }

  async waitForPageLoad() {
    await this.helpers.waitForPageLoad()
  }
}
```

### TestHelpers

The `TestHelpers` class provides utility functions for common test operations:

```typescript
export class TestHelpers {
  async waitForElement(selector: string, timeout = 10000) {
    await this.page.waitForSelector(selector, { timeout })
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}.png`,
      fullPage: true 
    })
  }

  async assertVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible()
  }
}
```

## Test Categories

### 1. Authentication Tests (`auth.spec.ts`)

Tests the complete authentication flow:

- **Sign In Flow**: Form validation, credential validation, success/failure scenarios
- **Sign Up Flow**: Registration validation, password requirements, email validation
- **Sign Out Flow**: Session termination, redirect behavior
- **Password Reset**: Forgot password functionality
- **Form Validation**: Required fields, email format, password strength
- **Navigation**: Tab switching, redirect behavior
- **Accessibility**: Keyboard navigation, ARIA labels, screen reader support

### 2. Stock Search Tests (`stock-search.spec.ts`)

Tests the stock media search functionality:

- **Basic Search**: Simple search queries, results display
- **Advanced Filters**: Category, orientation, color, date filters
- **Sorting and View**: Different sort options, view modes
- **Pagination**: Load more results, infinite scroll
- **Search Suggestions**: Autocomplete functionality
- **Saved Searches**: Save and retrieve search queries
- **Search History**: Previous searches, quick access
- **Results Interaction**: Click results, view details
- **Loading States**: Progress indicators, loading spinners
- **Error Handling**: Network errors, retry functionality
- **Accessibility**: Keyboard navigation, ARIA labels, live regions

### 3. AI Generation Tests (`ai-generation.spec.ts`)

Tests the AI image generation functionality:

- **Basic Generation**: Simple prompt generation, image creation
- **Advanced Settings**: Negative prompts, seed values, generation parameters
- **Style and Size Options**: Different styles, sizes, quality levels
- **Generation History**: Previous generations, history management
- **Presets**: Pre-configured generation settings
- **Image Actions**: Download, save, share, regenerate
- **Credits and Cost**: Credit display, cost calculation
- **Loading States**: Generation progress, status updates
- **Error Handling**: Generation failures, retry mechanisms
- **Form Validation**: Prompt validation, parameter validation
- **Accessibility**: Keyboard navigation, ARIA labels, live regions

### 4. Admin Panel Tests (`admin.spec.ts`)

Tests the admin panel functionality:

- **Admin Access**: Authentication, authorization, access control
- **User Management**: User listing, search, filtering, actions
- **Order Management**: Order listing, processing, cancellation, refunds
- **System Monitoring**: Statistics, health status, error logs
- **Navigation**: Tab switching, state management
- **Data Management**: Bulk operations, data export
- **Error Handling**: API errors, retry mechanisms
- **Accessibility**: Keyboard navigation, ARIA labels
- **Security**: CSRF protection, action logging

### 5. User Journey Tests (`user-journey.spec.ts`)

Tests complete user workflows:

- **Complete User Journey**: Registration to AI generation
- **Advanced Features**: Advanced search, AI generation with settings
- **Error Handling**: Network errors, API failures, recovery
- **Accessibility**: Keyboard navigation, screen reader support
- **Performance**: Load times, generation times, memory usage
- **Mobile Responsiveness**: Mobile viewport testing

## Running Tests

### Local Development

```bash
# Run all tests
npm run e2e

# Run tests with UI
npm run e2e:ui

# Run tests in headed mode
npm run e2e:headed

# Run specific test file
npm run e2e:test:auth

# Run tests with debug
npm run e2e:debug

# Generate test code
npm run e2e:codegen

# Show test report
npm run e2e:report
```

### CI/CD

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Multiple browsers (Chrome, Firefox, Safari)
- Mobile devices (Chrome Mobile, Safari Mobile)
- Smoke tests for quick validation

## CI/CD Integration

### GitHub Actions Workflow

The E2E tests are integrated with GitHub Actions through `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npx playwright install --with-deps
    - run: npm run build
    - run: npm start &
    - run: npx wait-on http://localhost:3000
    - run: npx playwright test --project=${{ matrix.browser }}
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report-${{ matrix.browser }}
        path: playwright-report/
```

### Test Artifacts

- **Test Reports**: HTML reports with screenshots and videos
- **Test Videos**: Recordings of failed tests
- **Test Screenshots**: Screenshots of failed tests
- **Test Traces**: Detailed execution traces

## Best Practices

### 1. Test Organization

- **Page Object Model**: Separate page objects for each page
- **Test Helpers**: Reusable utility functions
- **Test Data**: Centralized test data and constants
- **Test Isolation**: Each test should be independent

### 2. Test Reliability

- **Wait Strategies**: Use proper wait conditions
- **Retry Logic**: Implement retry mechanisms for flaky tests
- **Error Handling**: Graceful error handling and recovery
- **Test Data**: Use realistic test data

### 3. Performance

- **Parallel Execution**: Run tests in parallel when possible
- **Test Timeouts**: Set appropriate timeouts
- **Resource Management**: Clean up resources after tests
- **Test Selection**: Run only necessary tests

### 4. Maintenance

- **Test Documentation**: Document test purposes and scenarios
- **Test Updates**: Keep tests updated with application changes
- **Test Review**: Regular review of test quality
- **Test Metrics**: Track test performance and reliability

## Troubleshooting

### Common Issues

1. **Test Timeouts**
   - Increase timeout values
   - Check for slow operations
   - Verify network conditions

2. **Element Not Found**
   - Check selector accuracy
   - Verify element visibility
   - Wait for element to appear

3. **Test Flakiness**
   - Add proper wait conditions
   - Use stable selectors
   - Avoid timing-dependent tests

4. **Browser Issues**
   - Update browser versions
   - Check browser compatibility
   - Verify browser settings

### Debugging

```bash
# Run tests in debug mode
npm run e2e:debug

# Run specific test in debug mode
npx playwright test auth.spec.ts --debug

# Show test report
npm run e2e:report

# Generate test code
npm run e2e:codegen
```

### Test Reports

- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit Report**: `test-results/results.xml`
- **Videos**: `test-results/` directory
- **Screenshots**: `test-results/screenshots/` directory

## Test Data

### Test Users

```typescript
export const testUsers = {
  admin: {
    email: 'admin@example.com',
    password: 'adminpassword',
    fullName: 'Admin User',
    role: 'admin'
  },
  regular: {
    email: 'test@example.com',
    password: 'testpassword',
    fullName: 'Test User',
    role: 'user'
  }
}
```

### Test Prompts

```typescript
export const testPrompts = {
  basic: 'A beautiful sunset over mountains',
  detailed: 'A professional business portrait of a woman in a suit',
  creative: 'A futuristic cityscape with flying cars and neon lights'
}
```

### Test Selectors

```typescript
export const testSelectors = {
  common: {
    loading: '[data-testid="loading-spinner"]',
    error: '[data-testid="error-message"]',
    success: '[data-testid="success-message"]'
  },
  auth: {
    emailInput: '[data-testid="email-input"]',
    passwordInput: '[data-testid="password-input"]',
    signInButton: '[data-testid="sign-in-button"]'
  }
}
```

## Environment Variables

Required environment variables for E2E tests:

```bash
# Application
PLAYWRIGHT_BASE_URL=http://localhost:3000

# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# APIs
NEHTW_API_KEY=your_nehtw_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
RESEND_API_KEY=your_resend_api_key

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

## Conclusion

The E2E testing implementation provides comprehensive coverage of the Creo platform's critical user paths. The tests are designed to be reliable, maintainable, and provide valuable feedback on application quality. Regular execution of these tests ensures the application works correctly across different browsers and devices, providing confidence in the platform's stability and user experience.
