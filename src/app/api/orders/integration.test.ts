import { testAPIRoute, setupIntegrationTest, createTestUser, createTestOrder, expectAPIResponse, expectAPIError } from '@/test-utils/integration'

// Mock the orders route handler
jest.mock('@/app/api/orders/route', () => ({
  GET: jest.fn(),
  POST: jest.fn(),
}))

describe('Orders API Integration Tests', () => {
  let mockSupabase: any

  beforeEach(() => {
    const setup = setupIntegrationTest()
    mockSupabase = setup.mockSupabase
  })

  describe('GET /api/orders', () => {
    it('should return user orders', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const mockOrders = [
        createTestOrder(mockSupabase, {
          id: 'order-1',
          user_id: 'test-user-id',
          status: 'completed',
          total_amount: 1000,
        }),
        createTestOrder(mockSupabase, {
          id: 'order-2',
          user_id: 'test-user-id',
          status: 'pending',
          total_amount: 500,
        }),
      ]

      mockSupabase.from('orders').select.mockResolvedValue({
        data: mockOrders,
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/orders/route').GET,
        {
          method: 'GET',
          url: '/api/orders',
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.orders).toHaveLength(2)
      expect(data.orders[0].id).toBe('order-1')
    })

    it('should handle pagination', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const mockOrders = Array.from({ length: 10 }, (_, i) => 
        createTestOrder(mockSupabase, {
          id: `order-${i}`,
          user_id: 'test-user-id',
          status: 'completed',
          total_amount: 1000,
        })
      )

      mockSupabase.from('orders').select.mockResolvedValue({
        data: mockOrders,
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/orders/route').GET,
        {
          method: 'GET',
          url: '/api/orders',
          query: {
            page: '1',
            limit: '10',
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.orders).toHaveLength(10)
      expect(data.pagination).toBeDefined()
    })

    it('should filter orders by status', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const mockOrders = [
        createTestOrder(mockSupabase, {
          id: 'order-1',
          user_id: 'test-user-id',
          status: 'completed',
          total_amount: 1000,
        }),
      ]

      mockSupabase.from('orders').select.mockResolvedValue({
        data: mockOrders,
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/orders/route').GET,
        {
          method: 'GET',
          url: '/api/orders',
          query: {
            status: 'completed',
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.orders).toHaveLength(1)
      expect(data.orders[0].status).toBe('completed')
    })

    it('should return error for unauthenticated user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: null,
        error: { message: 'Unauthorized' },
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/orders/route').GET,
        {
          method: 'GET',
          url: '/api/orders',
        }
      )

      expectAPIError(response, 'Unauthorized')
    })
  })

  describe('POST /api/orders', () => {
    it('should create new order', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
        credits: 100,
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const newOrder = createTestOrder(mockSupabase, {
        id: 'new-order-id',
        user_id: 'test-user-id',
        status: 'pending',
        total_amount: 1000,
      })

      mockSupabase.from('orders').insert.mockResolvedValue({
        data: [newOrder],
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/orders/route').POST,
        {
          method: 'POST',
          url: '/api/orders',
          body: {
            items: [
              {
                type: 'stock',
                id: 'stock-1',
                price: 1000,
              },
            ],
            total_amount: 1000,
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(response, 201)
      const data = await json()
      expect(data.order).toBeDefined()
      expect(data.order.id).toBe('new-order-id')
    })

    it('should validate order items', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
        credits: 100,
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/orders/route').POST,
        {
          method: 'POST',
          url: '/api/orders',
          body: {
            // Missing items
            total_amount: 1000,
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIError(response, 'Order items are required')
    })

    it('should check user credits', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
        credits: 0, // No credits
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/orders/route').POST,
        {
          method: 'POST',
          url: '/api/orders',
          body: {
            items: [
              {
                type: 'stock',
                id: 'stock-1',
                price: 1000,
              },
            ],
            total_amount: 1000,
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIError(response, 'Insufficient credits')
    })
  })

  describe('GET /api/orders/[id]', () => {
    it('should return specific order', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const mockOrder = createTestOrder(mockSupabase, {
        id: 'order-123',
        user_id: 'test-user-id',
        status: 'completed',
        total_amount: 1000,
      })

      mockSupabase.from('orders').select.mockResolvedValue({
        data: [mockOrder],
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/orders/[id]/route').GET,
        {
          method: 'GET',
          url: '/api/orders/order-123',
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.order.id).toBe('order-123')
    })

    it('should return error for non-existent order', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      mockSupabase.from('orders').select.mockResolvedValue({
        data: [],
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/orders/[id]/route').GET,
        {
          method: 'GET',
          url: '/api/orders/non-existent',
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIError(response, 'Order not found')
    })
  })

  describe('PUT /api/orders/[id]', () => {
    it('should update order status', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const updatedOrder = createTestOrder(mockSupabase, {
        id: 'order-123',
        user_id: 'test-user-id',
        status: 'completed',
        total_amount: 1000,
      })

      mockSupabase.from('orders').update.mockResolvedValue({
        data: [updatedOrder],
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/orders/[id]/route').PUT,
        {
          method: 'PUT',
          url: '/api/orders/order-123',
          body: {
            status: 'completed',
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.order.status).toBe('completed')
    })

    it('should validate order ownership', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      // Mock order belonging to different user
      mockSupabase.from('orders').select.mockResolvedValue({
        data: [createTestOrder(mockSupabase, {
          id: 'order-123',
          user_id: 'other-user-id',
          status: 'pending',
        })],
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/orders/[id]/route').PUT,
        {
          method: 'PUT',
          url: '/api/orders/order-123',
          body: {
            status: 'completed',
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIError(response, 'Order not found')
    })
  })
})
