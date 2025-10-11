import { testAPIRoute, setupIntegrationTest, createTestUser, createTestOrder, expectAPIResponse, expectAPIError } from '@/test-utils/integration'

// Mock the admin route handlers
jest.mock('@/app/api/admin/users/route', () => ({
  GET: jest.fn(),
  PUT: jest.fn(),
}))
jest.mock('@/app/api/admin/orders/route', () => ({
  GET: jest.fn(),
}))
jest.mock('@/app/api/admin/stats/route', () => ({
  GET: jest.fn(),
}))

describe('Admin API Integration Tests', () => {
  let mockSupabase: any

  beforeEach(() => {
    const setup = setupIntegrationTest()
    mockSupabase = setup.mockSupabase
  })

  describe('GET /api/admin/users', () => {
    it('should return all users for admin', async () => {
      const adminUser = createTestUser(mockSupabase, {
        id: 'admin-user-id',
        role: 'admin',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: adminUser },
        error: null,
      })

      const mockUsers = [
        createTestUser(mockSupabase, {
          id: 'user-1',
          email: 'user1@example.com',
          full_name: 'User One',
          credits: 100,
        }),
        createTestUser(mockSupabase, {
          id: 'user-2',
          email: 'user2@example.com',
          full_name: 'User Two',
          credits: 50,
        }),
      ]

      mockSupabase.from('user_profiles').select.mockResolvedValue({
        data: mockUsers,
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/admin/users/route').GET,
        {
          method: 'GET',
          url: '/api/admin/users',
          headers: {
            authorization: 'Bearer admin-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.users).toHaveLength(2)
      expect(data.users[0].email).toBe('user1@example.com')
    })

    it('should filter users by search query', async () => {
      const adminUser = createTestUser(mockSupabase, {
        id: 'admin-user-id',
        role: 'admin',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: adminUser },
        error: null,
      })

      const mockUsers = [
        createTestUser(mockSupabase, {
          id: 'user-1',
          email: 'john@example.com',
          full_name: 'John Doe',
        }),
      ]

      mockSupabase.from('user_profiles').select.mockResolvedValue({
        data: mockUsers,
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/admin/users/route').GET,
        {
          method: 'GET',
          url: '/api/admin/users',
          query: {
            search: 'john',
          },
          headers: {
            authorization: 'Bearer admin-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.users).toHaveLength(1)
      expect(data.users[0].email).toBe('john@example.com')
    })

    it('should return error for non-admin user', async () => {
      const regularUser = createTestUser(mockSupabase, {
        id: 'regular-user-id',
        role: 'user',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: regularUser },
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/admin/users/route').GET,
        {
          method: 'GET',
          url: '/api/admin/users',
          headers: {
            authorization: 'Bearer user-token',
          },
        }
      )

      expectAPIError(response, 'Admin access required')
    })
  })

  describe('PUT /api/admin/users/[id]', () => {
    it('should update user credits', async () => {
      const adminUser = createTestUser(mockSupabase, {
        id: 'admin-user-id',
        role: 'admin',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: adminUser },
        error: null,
      })

      const updatedUser = createTestUser(mockSupabase, {
        id: 'user-1',
        email: 'user1@example.com',
        credits: 200,
      })

      mockSupabase.from('user_profiles').update.mockResolvedValue({
        data: [updatedUser],
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/admin/users/[id]/route').PUT,
        {
          method: 'PUT',
          url: '/api/admin/users/user-1',
          body: {
            credits: 200,
          },
          headers: {
            authorization: 'Bearer admin-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.user.credits).toBe(200)
    })

    it('should suspend user account', async () => {
      const adminUser = createTestUser(mockSupabase, {
        id: 'admin-user-id',
        role: 'admin',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: adminUser },
        error: null,
      })

      const suspendedUser = createTestUser(mockSupabase, {
        id: 'user-1',
        email: 'user1@example.com',
        is_suspended: true,
      })

      mockSupabase.from('user_profiles').update.mockResolvedValue({
        data: [suspendedUser],
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/admin/users/[id]/route').PUT,
        {
          method: 'PUT',
          url: '/api/admin/users/user-1',
          body: {
            is_suspended: true,
          },
          headers: {
            authorization: 'Bearer admin-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.user.is_suspended).toBe(true)
    })
  })

  describe('GET /api/admin/orders', () => {
    it('should return all orders for admin', async () => {
      const adminUser = createTestUser(mockSupabase, {
        id: 'admin-user-id',
        role: 'admin',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: adminUser },
        error: null,
      })

      const mockOrders = [
        createTestOrder(mockSupabase, {
          id: 'order-1',
          user_id: 'user-1',
          status: 'completed',
          total_amount: 1000,
        }),
        createTestOrder(mockSupabase, {
          id: 'order-2',
          user_id: 'user-2',
          status: 'pending',
          total_amount: 500,
        }),
      ]

      mockSupabase.from('orders').select.mockResolvedValue({
        data: mockOrders,
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/admin/orders/route').GET,
        {
          method: 'GET',
          url: '/api/admin/orders',
          headers: {
            authorization: 'Bearer admin-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.orders).toHaveLength(2)
    })

    it('should filter orders by status', async () => {
      const adminUser = createTestUser(mockSupabase, {
        id: 'admin-user-id',
        role: 'admin',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: adminUser },
        error: null,
      })

      const mockOrders = [
        createTestOrder(mockSupabase, {
          id: 'order-1',
          user_id: 'user-1',
          status: 'completed',
          total_amount: 1000,
        }),
      ]

      mockSupabase.from('orders').select.mockResolvedValue({
        data: mockOrders,
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/admin/orders/route').GET,
        {
          method: 'GET',
          url: '/api/admin/orders',
          query: {
            status: 'completed',
          },
          headers: {
            authorization: 'Bearer admin-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.orders).toHaveLength(1)
      expect(data.orders[0].status).toBe('completed')
    })
  })

  describe('GET /api/admin/stats', () => {
    it('should return system statistics', async () => {
      const adminUser = createTestUser(mockSupabase, {
        id: 'admin-user-id',
        role: 'admin',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: adminUser },
        error: null,
      })

      // Mock various statistics
      mockSupabase.from('user_profiles').select.mockResolvedValue({
        data: Array.from({ length: 100 }, (_, i) => ({ id: `user-${i}` })),
        error: null,
      })

      mockSupabase.from('orders').select.mockResolvedValue({
        data: Array.from({ length: 50 }, (_, i) => ({ id: `order-${i}` })),
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/admin/stats/route').GET,
        {
          method: 'GET',
          url: '/api/admin/stats',
          headers: {
            authorization: 'Bearer admin-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.stats).toBeDefined()
      expect(data.stats.totalUsers).toBe(100)
      expect(data.stats.totalOrders).toBe(50)
    })

    it('should return error for non-admin user', async () => {
      const regularUser = createTestUser(mockSupabase, {
        id: 'regular-user-id',
        role: 'user',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: regularUser },
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/admin/stats/route').GET,
        {
          method: 'GET',
          url: '/api/admin/stats',
          headers: {
            authorization: 'Bearer user-token',
          },
        }
      )

      expectAPIError(response, 'Admin access required')
    })
  })

  describe('GET /api/admin/monitoring', () => {
    it('should return system monitoring data', async () => {
      const adminUser = createTestUser(mockSupabase, {
        id: 'admin-user-id',
        role: 'admin',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: adminUser },
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/admin/monitoring/route').GET,
        {
          method: 'GET',
          url: '/api/admin/monitoring',
          headers: {
            authorization: 'Bearer admin-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.monitoring).toBeDefined()
      expect(data.monitoring.systemHealth).toBeDefined()
    })
  })
})
