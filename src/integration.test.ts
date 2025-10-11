import { setupIntegrationTest, createTestUser, expectAPIResponse } from '@/test-utils/integration'

describe('Integration Test Setup', () => {
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
})
