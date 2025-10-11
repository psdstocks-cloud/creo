import { testAPIRoute, setupIntegrationTest, createTestUser, expectAPIResponse, expectAPIError } from '@/test-utils/integration'

// Mock the AI generation route handler
jest.mock('@/app/api/ai/generate/route', () => ({
  POST: jest.fn(),
}))

describe('AI Generation API Integration Tests', () => {
  let mockSupabase: any

  beforeEach(() => {
    const setup = setupIntegrationTest()
    mockSupabase = setup.mockSupabase
  })

  describe('POST /api/ai/generate', () => {
    it('should generate AI image successfully', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
        credits: 100,
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      // Mock AI generation response
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

      mockSupabase.from('ai_generations').select.mockResolvedValue({
        data: [mockGeneration],
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/ai/generate/route').POST,
        {
          method: 'POST',
          url: '/api/ai/generate',
          body: {
            prompt: 'A beautiful sunset over mountains',
            style: 'realistic',
            size: '1024x1024',
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(response, 201)
      const data = await json()
      expect(data.generation).toBeDefined()
      expect(data.generation.prompt).toBe('A beautiful sunset over mountains')
      expect(data.generation.style).toBe('realistic')
    })

    it('should validate prompt requirements', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
        credits: 100,
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/ai/generate/route').POST,
        {
          method: 'POST',
          url: '/api/ai/generate',
          body: {
            // Missing prompt
            style: 'realistic',
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIError(response, 'Prompt is required')
    })

    it('should check user credits before generation', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
        credits: 0, // No credits
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
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

      expectAPIError(response, 'Insufficient credits')
    })

    it('should handle generation errors gracefully', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
        credits: 100,
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      mockSupabase.from('ai_generations').insert.mockResolvedValue({
        data: null,
        error: { message: 'Generation failed' },
      })

      const { response, status, json } = await testAPIRoute(
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

      expectAPIError(response, 'Generation failed')
    })

    it('should validate style parameter', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
        credits: 100,
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/ai/generate/route').POST,
        {
          method: 'POST',
          url: '/api/ai/generate',
          body: {
            prompt: 'A beautiful sunset over mountains',
            style: 'invalid-style',
          },
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIError(response, 'Invalid style')
    })
  })

  describe('GET /api/ai/generations', () => {
    it('should return user generations', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const mockGenerations = [
        {
          id: 'ai-gen-1',
          prompt: 'A beautiful sunset',
          style: 'realistic',
          status: 'completed',
          image_url: 'https://example.com/image1.jpg',
          created_at: new Date().toISOString(),
        },
        {
          id: 'ai-gen-2',
          prompt: 'A city skyline',
          style: 'artistic',
          status: 'completed',
          image_url: 'https://example.com/image2.jpg',
          created_at: new Date().toISOString(),
        },
      ]

      mockSupabase.from('ai_generations').select.mockResolvedValue({
        data: mockGenerations,
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/ai/generations/route').GET,
        {
          method: 'GET',
          url: '/api/ai/generations',
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.generations).toHaveLength(2)
      expect(data.generations[0].prompt).toBe('A beautiful sunset')
    })

    it('should handle pagination', async () => {
      const testUser = createTestUser(mockSupabase, {
        id: 'test-user-id',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const mockGenerations = Array.from({ length: 10 }, (_, i) => ({
        id: `ai-gen-${i}`,
        prompt: `Generation ${i}`,
        style: 'realistic',
        status: 'completed',
        image_url: `https://example.com/image${i}.jpg`,
        created_at: new Date().toISOString(),
      }))

      mockSupabase.from('ai_generations').select.mockResolvedValue({
        data: mockGenerations,
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/ai/generations/route').GET,
        {
          method: 'GET',
          url: '/api/ai/generations',
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
      expect(data.generations).toHaveLength(10)
      expect(data.pagination).toBeDefined()
    })
  })

  describe('GET /api/ai/styles', () => {
    it('should return available AI styles', async () => {
      const { response, status, json } = await testAPIRoute(
        require('@/app/api/ai/styles/route').GET,
        {
          method: 'GET',
          url: '/api/ai/styles',
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.styles).toBeDefined()
      expect(Array.isArray(data.styles)).toBe(true)
    })
  })
})
