import { testAPIRoute, setupIntegrationTest, mockNEHTWResponse, expectAPIResponse, expectAPIError } from '@/test-utils/integration'

// Mock the stock search route handler
jest.mock('@/app/api/stock/search/route', () => ({
  GET: jest.fn(),
}))

describe('Stock Search API Integration Tests', () => {
  let mockSupabase: any

  beforeEach(() => {
    const setup = setupIntegrationTest()
    mockSupabase = setup.mockSupabase
  })

  describe('GET /api/stock/search', () => {
    it('should search stock media successfully', async () => {
      const mockResults = mockNEHTWResponse({
        results: [
          {
            id: 'stock-1',
            title: 'Beautiful Landscape',
            url: 'https://example.com/landscape.jpg',
            provider: 'unsplash',
            price: 100,
          },
          {
            id: 'stock-2',
            title: 'City Skyline',
            url: 'https://example.com/city.jpg',
            provider: 'pexels',
            price: 150,
          },
        ],
        total: 2,
      })

      // Mock fetch for NEHTW API
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResults),
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/stock/search/route').GET,
        {
          method: 'GET',
          url: '/api/stock/search',
          query: {
            q: 'landscape',
            page: '1',
            limit: '10',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.results).toHaveLength(2)
      expect(data.total).toBe(2)
      expect(data.results[0].title).toBe('Beautiful Landscape')
    })

    it('should handle search with filters', async () => {
      const mockResults = mockNEHTWResponse({
        results: [
          {
            id: 'stock-1',
            title: 'Portrait Photo',
            url: 'https://example.com/portrait.jpg',
            provider: 'unsplash',
            orientation: 'portrait',
            color: 'blue',
          },
        ],
        total: 1,
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResults),
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/stock/search/route').GET,
        {
          method: 'GET',
          url: '/api/stock/search',
          query: {
            q: 'portrait',
            orientation: 'portrait',
            color: 'blue',
            category: 'people',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.results).toHaveLength(1)
      expect(data.results[0].orientation).toBe('portrait')
    })

    it('should handle empty search results', async () => {
      const mockResults = mockNEHTWResponse({
        results: [],
        total: 0,
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResults),
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/stock/search/route').GET,
        {
          method: 'GET',
          url: '/api/stock/search',
          query: {
            q: 'nonexistent',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.results).toHaveLength(0)
      expect(data.total).toBe(0)
    })

    it('should handle API errors gracefully', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('API Error'))

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/stock/search/route').GET,
        {
          method: 'GET',
          url: '/api/stock/search',
          query: {
            q: 'test',
          },
        }
      )

      expectAPIError(response, 'Failed to search stock media')
    })

    it('should validate required parameters', async () => {
      const { response, status, json } = await testAPIRoute(
        require('@/app/api/stock/search/route').GET,
        {
          method: 'GET',
          url: '/api/stock/search',
          // Missing query parameter
        }
      )

      expectAPIError(response, 'Search query is required')
    })

    it('should handle pagination correctly', async () => {
      const mockResults = mockNEHTWResponse({
        results: Array.from({ length: 10 }, (_, i) => ({
          id: `stock-${i}`,
          title: `Image ${i}`,
          url: `https://example.com/image${i}.jpg`,
          provider: 'unsplash',
        })),
        total: 100,
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResults),
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/stock/search/route').GET,
        {
          method: 'GET',
          url: '/api/stock/search',
          query: {
            q: 'test',
            page: '2',
            limit: '10',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.results).toHaveLength(10)
      expect(data.total).toBe(100)
      expect(data.page).toBe(2)
      expect(data.limit).toBe(10)
    })
  })

  describe('GET /api/stock/providers', () => {
    it('should return available stock providers', async () => {
      const { response, status, json } = await testAPIRoute(
        require('@/app/api/stock/providers/route').GET,
        {
          method: 'GET',
          url: '/api/stock/providers',
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.providers).toBeDefined()
      expect(Array.isArray(data.providers)).toBe(true)
    })
  })

  describe('GET /api/stock/categories', () => {
    it('should return available categories', async () => {
      const { response, status, json } = await testAPIRoute(
        require('@/app/api/stock/categories/route').GET,
        {
          method: 'GET',
          url: '/api/stock/categories',
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.categories).toBeDefined()
      expect(Array.isArray(data.categories)).toBe(true)
    })
  })
})
