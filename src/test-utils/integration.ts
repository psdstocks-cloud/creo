import { NextRequest, NextResponse } from 'next/server'
import { createMocks } from 'node-mocks-http'
import { createClient } from '@supabase/supabase-js'
import { QueryClient } from '@tanstack/react-query'
import { render, RenderOptions } from '@testing-library/react'

// Mock Supabase client for integration tests
export const createMockSupabaseClient = () => {
  return {
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      maybeSingle: jest.fn(),
    })),
    rpc: jest.fn(),
  }
}

// Mock Next.js request/response for API testing
export const createMockRequest = (options: {
  method?: string
  url?: string
  headers?: Record<string, string>
  body?: any
  query?: Record<string, string>
} = {}) => {
  const { method = 'GET', url = '/', headers = {}, body, query = {} } = options
  
  const request = new NextRequest(url, {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  
  // Add query parameters
  if (Object.keys(query).length > 0) {
    const urlWithQuery = new URL(url)
    Object.entries(query).forEach(([key, value]) => {
      urlWithQuery.searchParams.set(key, value)
    })
    return new NextRequest(urlWithQuery.toString(), {
      method,
      headers: request.headers,
      body: request.body,
    })
  }
  
  return request
}

// Mock Next.js response
export const createMockResponse = () => {
  return new NextResponse()
}

// Integration test setup
export const setupIntegrationTest = () => {
  // Mock environment variables
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
  process.env.STRIPE_SECRET_KEY = 'sk_test_123'
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123'
  process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io'
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token'
  process.env.RESEND_API_KEY = 're_test_123'
  process.env.NEHTW_API_KEY = 'test-nehtw-key'
  process.env.NEHTW_API_URL = 'https://test.nehtw.com'
  
  // Mock Supabase client
  const mockSupabase = createMockSupabaseClient()
  jest.mock('@/lib/supabase', () => ({
    supabase: mockSupabase,
  }))
  
  return { mockSupabase }
}

// API route testing utilities
export const testAPIRoute = async (
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    method?: string
    url?: string
    headers?: Record<string, string>
    body?: any
    query?: Record<string, string>
  } = {}
) => {
  const request = createMockRequest(options)
  const response = await handler(request)
  
  return {
    request,
    response,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: await response.text(),
    json: async () => JSON.parse(await response.text()),
  }
}

// Database testing utilities
export const createTestUser = async (supabase: any, userData: any = {}) => {
  const user = {
    id: 'test-user-id',
    email: 'test@example.com',
    ...userData,
  }
  
  supabase.auth.getUser.mockResolvedValue({
    data: { user },
    error: null,
  })
  
  return user
}

export const createTestOrder = async (supabase: any, orderData: any = {}) => {
  const order = {
    id: 'test-order-id',
    user_id: 'test-user-id',
    status: 'pending',
    total_amount: 1000,
    created_at: new Date().toISOString(),
    ...orderData,
  }
  
  supabase.from('orders').select().mockResolvedValue({
    data: [order],
    error: null,
  })
  
  return order
}

// Mock external API responses
export const mockNEHTWResponse = (data: any = {}) => {
  return {
    success: true,
    data: {
      results: [
        {
          id: 'test-stock-id',
          title: 'Test Stock Image',
          url: 'https://example.com/image.jpg',
          provider: 'test-provider',
          ...data,
        },
      ],
      total: 1,
    },
  }
}

export const mockStripeResponse = (data: any = {}) => {
  return {
    id: 'pi_test_123',
    amount: 1000,
    currency: 'usd',
    status: 'succeeded',
    ...data,
  }
}

// Integration test providers - simplified for Node.js environment
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, options)

// Test data factories
export const createTestData = {
  user: (overrides: any = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    full_name: 'Test User',
    avatar_url: null,
    credits: 100,
    created_at: new Date().toISOString(),
    ...overrides,
  }),
  
  order: (overrides: any = {}) => ({
    id: 'test-order-id',
    user_id: 'test-user-id',
    status: 'pending',
    total_amount: 1000,
    currency: 'usd',
    created_at: new Date().toISOString(),
    ...overrides,
  }),
  
  stockItem: (overrides: any = {}) => ({
    id: 'test-stock-id',
    title: 'Test Stock Image',
    url: 'https://example.com/image.jpg',
    provider: 'test-provider',
    price: 100,
    license_type: 'standard',
    ...overrides,
  }),
  
  aiGeneration: (overrides: any = {}) => ({
    id: 'test-ai-id',
    user_id: 'test-user-id',
    prompt: 'Test prompt',
    style: 'realistic',
    status: 'completed',
    image_url: 'https://example.com/generated.jpg',
    created_at: new Date().toISOString(),
    ...overrides,
  }),
}

// Cleanup utilities
export const cleanupTestData = async (supabase: any) => {
  // Clean up test data after each test
  jest.clearAllMocks()
}

// Integration test helpers
export const expectAPIResponse = (response: any, expectedStatus: number) => {
  expect(response.status).toBe(expectedStatus)
}

export const expectAPIError = (response: any, expectedMessage?: string) => {
  expect(response.status).toBeGreaterThanOrEqual(400)
  if (expectedMessage) {
    expect(response.body).toContain(expectedMessage)
  }
}

export const expectAPISuccess = (response: any) => {
  expect(response.status).toBeLessThan(400)
}

// Mock external services
export const mockExternalServices = () => {
  // Mock fetch for external API calls
  global.fetch = jest.fn()
  
  // Mock NEHTW API
  ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
    if (url.includes('nehtw.com')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockNEHTWResponse()),
      })
    }
    
    if (url.includes('stripe.com')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockStripeResponse()),
      })
    }
    
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  })
}

// Export everything
export * from '@testing-library/react'
export { renderWithProviders as render }
