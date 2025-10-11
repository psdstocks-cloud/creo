import { testAPIRoute, setupIntegrationTest, createTestUser, createTestOrder, mockNEHTWResponse, mockStripeResponse, expectAPIResponse, expectAPIError } from '@/test-utils/integration'

describe('User Flow Integration Tests', () => {
  let mockSupabase: any

  beforeEach(() => {
    const setup = setupIntegrationTest()
    mockSupabase = setup.mockSupabase
  })

  describe('Complete User Journey', () => {
    it('should handle full user registration to order completion flow', async () => {
      // Step 1: User Registration
      const newUser = createTestUser(mockSupabase, {
        id: 'new-user-id',
        email: 'newuser@example.com',
        credits: 100,
      })

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: newUser },
        error: null,
      })

      const { response: registerResponse } = await testAPIRoute(
        require('@/app/api/auth/route').POST,
        {
          method: 'POST',
          url: '/api/auth/register',
          body: {
            email: 'newuser@example.com',
            password: 'password123',
            full_name: 'New User',
          },
        }
      )

      expectAPIResponse(registerResponse, 201)

      // Step 2: User Login
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: newUser },
        error: null,
      })

      const { response: loginResponse } = await testAPIRoute(
        require('@/app/api/auth/route').POST,
        {
          method: 'POST',
          url: '/api/auth/login',
          body: {
            email: 'newuser@example.com',
            password: 'password123',
          },
        }
      )

      expectAPIResponse(loginResponse, 200)

      // Step 3: Search Stock Media
      const mockSearchResults = mockNEHTWResponse({
        results: [
          {
            id: 'stock-1',
            title: 'Beautiful Landscape',
            url: 'https://example.com/landscape.jpg',
            provider: 'unsplash',
            price: 100,
          },
        ],
        total: 1,
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSearchResults),
      })

      const { response: searchResponse } = await testAPIRoute(
        require('@/app/api/stock/search/route').GET,
        {
          method: 'GET',
          url: '/api/stock/search',
          query: {
            q: 'landscape',
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(searchResponse, 200)

      // Step 4: Create Order
      const newOrder = createTestOrder(mockSupabase, {
        id: 'new-order-id',
        user_id: 'new-user-id',
        status: 'pending',
        total_amount: 100,
      })

      mockSupabase.from('orders').insert.mockResolvedValue({
        data: [newOrder],
        error: null,
      })

      const { response: orderResponse } = await testAPIRoute(
        require('@/app/api/orders/route').POST,
        {
          method: 'POST',
          url: '/api/orders',
          body: {
            items: [
              {
                type: 'stock',
                id: 'stock-1',
                price: 100,
              },
            ],
            total_amount: 100,
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(orderResponse, 201)

      // Step 5: Process Payment
      const mockPaymentIntent = mockStripeResponse({
        id: 'pi_test_123',
        amount: 100,
        currency: 'usd',
        status: 'succeeded',
      })

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPaymentIntent),
      })

      const { response: paymentResponse } = await testAPIRoute(
        require('@/app/api/stripe/create-payment-intent/route').POST,
        {
          method: 'POST',
          url: '/api/stripe/create-payment-intent',
          body: {
            order_id: 'new-order-id',
            amount: 100,
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(paymentResponse, 200)

      // Step 6: Update Order Status
      const completedOrder = createTestOrder(mockSupabase, {
        id: 'new-order-id',
        user_id: 'new-user-id',
        status: 'completed',
        total_amount: 100,
      })

      mockSupabase.from('orders').update.mockResolvedValue({
        data: [completedOrder],
        error: null,
      })

      const { response: updateResponse } = await testAPIRoute(
        require('@/app/api/orders/[id]/route').PUT,
        {
          method: 'PUT',
          url: '/api/orders/new-order-id',
          body: {
            status: 'completed',
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(updateResponse, 200)
    })

    it('should handle AI generation flow', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
        credits: 100,
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      // Step 1: Generate AI Image
      const mockGeneration = {
        id: 'ai-gen-123',
        prompt: 'A beautiful sunset over mountains',
        style: 'realistic',
        status: 'completed',
        image_url: 'https://example.com/generated.jpg',
        created_at: new Date().toISOString(),
      }

      mockSupabase.from('ai_generations').insert.mockResolvedValue({
        data: [mockGeneration],
        error: null,
      })

      const { response: generateResponse } = await testAPIRoute(
        require('@/app/api/ai/generate/route').POST,
        {
          method: 'POST',
          url: '/api/ai/generate',
          body: {
            prompt: 'A beautiful sunset over mountains',
            style: 'realistic',
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(generateResponse, 201)

      // Step 2: Get Generation History
      mockSupabase.from('ai_generations').select.mockResolvedValue({
        data: [mockGeneration],
        error: null,
      })

      const { response: historyResponse } = await testAPIRoute(
        require('@/app/api/ai/generations/route').GET,
        {
          method: 'GET',
          url: '/api/ai/generations',
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(historyResponse, 200)
    })

    it('should handle admin user management flow', async () => {
      const adminUser = createTestUser(mockSupabase, {
        id: 'admin-user-id',
        role: 'admin',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: adminUser },
        error: null,
      })

      // Step 1: Get All Users
      const mockUsers = [
        createTestUser(mockSupabase, {
          id: 'user-1',
          email: 'user1@example.com',
          credits: 100,
        }),
        createTestUser(mockSupabase, {
          id: 'user-2',
          email: 'user2@example.com',
          credits: 50,
        }),
      ]

      mockSupabase.from('user_profiles').select.mockResolvedValue({
        data: mockUsers,
        error: null,
      })

      const { response: usersResponse } = await testAPIRoute(
        require('@/app/api/admin/users/route').GET,
        {
          method: 'GET',
          url: '/api/admin/users',
          headers: {
            authorization: 'Bearer admin-token',
          },
        }
      )

      expectAPIResponse(usersResponse, 200)

      // Step 2: Update User Credits
      const updatedUser = createTestUser(mockSupabase, {
        id: 'user-1',
        email: 'user1@example.com',
        credits: 200,
      })

      mockSupabase.from('user_profiles').update.mockResolvedValue({
        data: [updatedUser],
        error: null,
      })

      const { response: updateResponse } = await testAPIRoute(
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

      expectAPIResponse(updateResponse, 200)

      // Step 3: Get System Statistics
      mockSupabase.from('user_profiles').select.mockResolvedValue({
        data: Array.from({ length: 100 }, (_, i) => ({ id: `user-${i}` })),
        error: null,
      })

      mockSupabase.from('orders').select.mockResolvedValue({
        data: Array.from({ length: 50 }, (_, i) => ({ id: `order-${i}` })),
        error: null,
      })

      const { response: statsResponse } = await testAPIRoute(
        require('@/app/api/admin/stats/route').GET,
        {
          method: 'GET',
          url: '/api/admin/stats',
          headers: {
            authorization: 'Bearer admin-token',
          },
        }
      )

      expectAPIResponse(statsResponse, 200)
    })
  })

  describe('Error Handling Flows', () => {
    it('should handle authentication errors gracefully', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      })

      const { response } = await testAPIRoute(
        require('@/app/api/auth/route').POST,
        {
          method: 'POST',
          url: '/api/auth/login',
          body: {
            email: 'test@example.com',
            password: 'wrongpassword',
          },
        }
      )

      expectAPIError(response, 'Invalid credentials')
    })

    it('should handle API rate limiting', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
        credits: 100,
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      // Mock rate limit exceeded
      const { response } = await testAPIRoute(
        require('@/app/api/stock/search/route').GET,
        {
          method: 'GET',
          url: '/api/stock/search',
          query: {
            q: 'test',
          },
          headers: {
            authorization: 'Bearer test-token',
            'x-ratelimit-remaining': '0',
          },
        }
      )

      // This would be handled by middleware in real implementation
      expect(response.status).toBeGreaterThanOrEqual(400)
    })

    it('should handle insufficient credits', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
        credits: 0, // No credits
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const { response } = await testAPIRoute(
        require('@/app/api/orders/route').POST,
        {
          method: 'POST',
          url: '/api/orders',
          body: {
            items: [
              {
                type: 'stock',
                id: 'stock-1',
                price: 100,
              },
            ],
            total_amount: 100,
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIError(response, 'Insufficient credits')
    })
  })

  describe('Data Consistency Flows', () => {
    it('should maintain data consistency across related operations', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
        credits: 100,
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      // Create order
      const newOrder = createTestOrder(mockSupabase, {
        id: 'order-123',
        user_id: 'test-user-id',
        status: 'pending',
        total_amount: 100,
      })

      mockSupabase.from('orders').insert.mockResolvedValue({
        data: [newOrder],
        error: null,
      })

      const { response: orderResponse } = await testAPIRoute(
        require('@/app/api/orders/route').POST,
        {
          method: 'POST',
          url: '/api/orders',
          body: {
            items: [
              {
                type: 'stock',
                id: 'stock-1',
                price: 100,
              },
            ],
            total_amount: 100,
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(orderResponse, 201)

      // Verify order exists
      mockSupabase.from('orders').select.mockResolvedValue({
        data: [newOrder],
        error: null,
      })

      const { response: getResponse } = await testAPIRoute(
        require('@/app/api/orders/[id]/route').GET,
        {
          method: 'GET',
          url: '/api/orders/order-123',
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(getResponse, 200)
    })
  })
})
