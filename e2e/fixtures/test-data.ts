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
  },
  newUser: {
    email: 'newuser@example.com',
    password: 'newpassword123',
    fullName: 'New User',
    role: 'user'
  }
}

export const testPrompts = {
  basic: 'A beautiful sunset over mountains',
  detailed: 'A professional business portrait of a woman in a suit, high quality, studio lighting',
  creative: 'A futuristic cityscape with flying cars and neon lights, cyberpunk style',
  nature: 'A serene forest with sunlight filtering through trees, peaceful atmosphere',
  abstract: 'Abstract geometric shapes in vibrant colors, modern art style'
}

export const testSearchQueries = {
  nature: 'nature landscape',
  business: 'business office',
  people: 'people portrait',
  technology: 'technology computer',
  abstract: 'abstract geometric'
}

export const testFilters = {
  category: ['nature', 'business', 'people', 'technology', 'abstract'],
  orientation: ['landscape', 'portrait', 'square'],
  color: ['blue', 'green', 'red', 'yellow', 'black', 'white'],
  date: ['last-week', 'last-month', 'last-year', 'all-time']
}

export const testOrders = {
  pending: {
    id: 'order-123',
    status: 'pending',
    type: 'stock_search',
    cost: 5.00
  },
  completed: {
    id: 'order-456',
    status: 'completed',
    type: 'ai_generation',
    cost: 10.00
  },
  cancelled: {
    id: 'order-789',
    status: 'cancelled',
    type: 'stock_search',
    cost: 3.00
  }
}

export const testImages = {
  nature: {
    url: 'https://example.com/nature.jpg',
    title: 'Beautiful Nature Landscape',
    description: 'A stunning landscape with mountains and trees',
    tags: ['nature', 'landscape', 'mountains', 'trees']
  },
  business: {
    url: 'https://example.com/business.jpg',
    title: 'Modern Office Space',
    description: 'A clean, modern office environment',
    tags: ['business', 'office', 'modern', 'professional']
  }
}

export const testApiResponses = {
  success: {
    status: 200,
    data: { message: 'Success' }
  },
  error: {
    status: 500,
    error: 'Internal server error'
  },
  validationError: {
    status: 400,
    error: 'Validation failed',
    details: ['Email is required', 'Password must be at least 8 characters']
  }
}

export const testEnvironment = {
  baseUrl: 'http://localhost:3000',
  apiUrl: 'http://localhost:3000/api',
  timeout: 30000,
  retries: 3
}

export const testSelectors = {
  common: {
    loading: '[data-testid="loading-spinner"]',
    error: '[data-testid="error-message"]',
    success: '[data-testid="success-message"]',
    button: '[data-testid="button"]',
    input: '[data-testid="input"]',
    modal: '[data-testid="modal"]'
  },
  auth: {
    emailInput: '[data-testid="email-input"]',
    passwordInput: '[data-testid="password-input"]',
    signInButton: '[data-testid="sign-in-button"]',
    signUpButton: '[data-testid="sign-up-button"]',
    signOutButton: '[data-testid="sign-out-button"]'
  },
  dashboard: {
    welcomeMessage: '[data-testid="welcome-message"]',
    userMenu: '[data-testid="user-menu"]',
    creditsDisplay: '[data-testid="credits-display"]',
    quickActions: '[data-testid="quick-actions"]'
  },
  search: {
    searchInput: '[data-testid="search-input"]',
    searchButton: '[data-testid="search-button"]',
    resultsContainer: '[data-testid="results-container"]',
    resultItem: '[data-testid="result-item"]',
    filtersButton: '[data-testid="filters-button"]',
    filtersPanel: '[data-testid="filters-panel"]'
  },
  ai: {
    promptInput: '[data-testid="prompt-input"]',
    generateButton: '[data-testid="generate-button"]',
    generatedImage: '[data-testid="generated-image"]',
    generationProgress: '[data-testid="generation-progress"]',
    styleSelect: '[data-testid="style-select"]',
    sizeSelect: '[data-testid="size-select"]'
  },
  admin: {
    adminDashboard: '[data-testid="admin-dashboard"]',
    userTable: '[data-testid="user-table"]',
    orderTable: '[data-testid="order-table"]',
    statsContainer: '[data-testid="stats-container"]'
  }
}

export const testUrls = {
  home: '/',
  dashboard: '/dashboard',
  stockSearch: '/stock-search',
  aiGeneration: '/ai-generation',
  orders: '/orders',
  downloads: '/downloads',
  settings: '/settings',
  admin: '/admin',
  auth: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    forgotPassword: '/auth/forgot-password'
  }
}

export const testCredentials = {
  valid: {
    email: 'test@example.com',
    password: 'TestPassword123!'
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  },
  weak: {
    email: 'test@example.com',
    password: '123'
  }
}

export const testFilePaths = {
  images: {
    small: 'test-files/small-image.jpg',
    large: 'test-files/large-image.jpg',
    invalid: 'test-files/invalid-file.txt'
  },
  documents: {
    pdf: 'test-files/document.pdf',
    doc: 'test-files/document.doc'
  }
}

export const testTimeouts = {
  short: 5000,
  medium: 10000,
  long: 30000,
  veryLong: 60000
}

export const testViewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
  large: { width: 2560, height: 1440 }
}

export const testNetworkConditions = {
  offline: 'offline',
  slow3G: 'slow3g',
  fast3G: 'fast3g',
  wifi: 'wifi'
}

export const testBrowserSettings = {
  chromium: {
    headless: true,
    devtools: false
  },
  firefox: {
    headless: true
  },
  webkit: {
    headless: true
  }
}
