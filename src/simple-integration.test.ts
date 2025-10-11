import { setupIntegrationTest, createTestUser, expectAPIResponse } from '@/test-utils/integration'

describe('Simple Integration Test', () => {
  let mockSupabase: any

  beforeEach(() => {
    const setup = setupIntegrationTest()
    mockSupabase = setup.mockSupabase
  })

  it('should setup integration test environment', () => {
    expect(mockSupabase).toBeDefined()
    expect(mockSupabase.auth).toBeDefined()
    expect(mockSupabase.from).toBeDefined()
  })

  it('should create test user', () => {
    const testUser = createTestUser(mockSupabase, {
      id: 'test-user-id',
      email: 'test@example.com',
    })

    expect(testUser).toBeDefined()
    expect(testUser.id).toBe('test-user-id')
    expect(testUser.email).toBe('test@example.com')
  })

  it('should mock Supabase responses', async () => {
    const testUser = createTestUser(mockSupabase, {
      id: 'test-user-id',
      email: 'test@example.com',
    })

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: testUser },
      error: null,
    })

    const result = await mockSupabase.auth.getUser()
    expect(result.data.user).toEqual(testUser)
    expect(result.error).toBeNull()
  })

  it('should handle API response assertions', () => {
    const mockResponse = {
      status: 200,
      json: () => Promise.resolve({ success: true }),
    }

    expectAPIResponse(mockResponse, 200)
  })

  it('should create test data factories', () => {
    const user = createTestUser(mockSupabase, {
      id: 'user-1',
      email: 'user1@example.com',
      credits: 100,
    })

    expect(user.id).toBe('user-1')
    expect(user.email).toBe('user1@example.com')
    expect(user.credits).toBe(100)
  })

  it('should mock external API responses', () => {
    // Mock fetch for external API calls
    global.fetch = jest.fn()

    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ success: true, data: [] }),
    }

    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    expect(global.fetch).toBeDefined()
  })
})
