import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { UserProvider } from '@/contexts/UserContext'
import { ToastProvider } from '@/components/ui/Toast'

// Mock user data
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    role: 'user',
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

// Mock auth context
const mockAuthContext = {
  user: mockUser,
  loading: false,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  updateUser: jest.fn(),
}

// Mock user context
const mockUserContext = {
  user: mockUser,
  balance: { balance: 100.00 },
  isLoading: false,
  refetch: jest.fn(),
}

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider value={mockAuthContext}>
        <UserProvider value={mockUserContext}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Helper functions for testing
export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides,
})

export const createMockAuthContext = (overrides = {}) => ({
  ...mockAuthContext,
  ...overrides,
})

export const createMockUserContext = (overrides = {}) => ({
  ...mockUserContext,
  ...overrides,
})

// Mock API responses
export const mockApiResponses = {
  stockSearch: {
    data: [
      {
        id: '1',
        title: 'Test Image',
        url: 'https://example.com/image.jpg',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        site: 'unsplash',
        photographer: 'Test Photographer',
        tags: ['test', 'image'],
        width: 1920,
        height: 1080,
        price: 10.00,
      },
    ],
    total: 1,
    page: 1,
    perPage: 20,
  },
  aiGeneration: {
    id: 'ai-1',
    status: 'completed',
    files: [
      {
        id: 'file-1',
        name: 'generated-image.png',
        url: 'https://example.com/generated.png',
        thumbnailUrl: 'https://example.com/generated-thumb.png',
        size: 1024000,
        type: 'image',
        format: 'PNG',
      },
    ],
    cost: 5.00,
    createdAt: '2024-01-01T00:00:00Z',
  },
  orders: [
    {
      id: 'order-1',
      type: 'stock',
      status: 'completed',
      title: 'Test Order',
      description: 'Test order description',
      cost: 10.00,
      createdAt: '2024-01-01T00:00:00Z',
      files: [
        {
          id: 'file-1',
          name: 'test-image.jpg',
          url: 'https://example.com/test.jpg',
          thumbnailUrl: 'https://example.com/test-thumb.jpg',
          size: 512000,
          type: 'image',
          format: 'JPEG',
          downloadCount: 1,
        },
      ],
      metadata: {
        site: 'unsplash',
        stockId: 'photo-123',
      },
    },
  ],
  userBalance: {
    balance: 100.00,
    credits: 50,
    lastUpdated: '2024-01-01T00:00:00Z',
  },
}

// Mock functions
export const mockFunctions = {
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  onClick: jest.fn(),
  onChange: jest.fn(),
  onSelect: jest.fn(),
  onToggle: jest.fn(),
  onView: jest.fn(),
  onDownload: jest.fn(),
  onCancel: jest.fn(),
  onRetry: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onSave: jest.fn(),
  onSearch: jest.fn(),
  onFilter: jest.fn(),
  onSort: jest.fn(),
  onPaginate: jest.fn(),
  onRefresh: jest.fn(),
  onLoadMore: jest.fn(),
  onBulkAction: jest.fn(),
  onSelectAll: jest.fn(),
  onClearSelection: jest.fn(),
}

// Test data generators
export const generateMockOrders = (count = 5) =>
  Array.from({ length: count }, (_, i) => ({
    id: `order-${i + 1}`,
    type: i % 2 === 0 ? 'stock' : 'ai',
    status: ['pending', 'processing', 'completed', 'failed'][i % 4],
    title: `Test Order ${i + 1}`,
    description: `Test order description ${i + 1}`,
    cost: (i + 1) * 10.00,
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    files: i % 3 === 0 ? [] : [
      {
        id: `file-${i + 1}`,
        name: `test-file-${i + 1}.jpg`,
        url: `https://example.com/file-${i + 1}.jpg`,
        thumbnailUrl: `https://example.com/thumb-${i + 1}.jpg`,
        size: 512000,
        type: 'image',
        format: 'JPEG',
        downloadCount: Math.floor(Math.random() * 10),
      },
    ],
    metadata: {
      site: i % 2 === 0 ? 'unsplash' : 'pexels',
      stockId: `photo-${i + 1}`,
    },
  }))

export const generateMockUsers = (count = 5) =>
  Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    email: `user${i + 1}@example.com`,
    fullName: `User ${i + 1}`,
    role: i === 0 ? 'admin' : 'user',
    status: ['active', 'inactive', 'suspended'][i % 3],
    createdAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    totalOrders: Math.floor(Math.random() * 20),
    totalSpent: Math.floor(Math.random() * 500),
    balance: Math.floor(Math.random() * 100),
  }))