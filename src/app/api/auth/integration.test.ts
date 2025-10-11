import { testAPIRoute, setupIntegrationTest, createTestUser, expectAPIResponse, expectAPIError } from '@/test-utils/integration'

// Mock the auth route handler
jest.mock('@/app/api/auth/route', () => ({
  POST: jest.fn(),
}))

describe('Authentication API Integration Tests', () => {
  let mockSupabase: any

  beforeEach(() => {
    const setup = setupIntegrationTest()
    mockSupabase = setup.mockSupabase
  })

  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const testUser = createTestUser(mockSupabase, {
        email: 'test@example.com',
        id: 'test-user-id',
      })

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/auth/route').POST,
        {
          method: 'POST',
          url: '/api/auth/login',
          body: {
            email: 'test@example.com',
            password: 'password123',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.user).toEqual(testUser)
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should return error for invalid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      })

      const { response, status, json } = await testAPIRoute(
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

    it('should return error for missing credentials', async () => {
      const { response, status, json } = await testAPIRoute(
        require('@/app/api/auth/route').POST,
        {
          method: 'POST',
          url: '/api/auth/login',
          body: {
            email: 'test@example.com',
            // Missing password
          },
        }
      )

      expectAPIError(response, 'Password is required')
    })
  })

  describe('POST /api/auth/register', () => {
    it('should register new user', async () => {
      const newUser = createTestUser(mockSupabase, {
        email: 'newuser@example.com',
        id: 'new-user-id',
      })

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: newUser },
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
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

      expectAPIResponse(response, 201)
      const data = await json()
      expect(data.user).toEqual(newUser)
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'New User',
          },
        },
      })
    })

    it('should return error for existing user', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'User already exists' },
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/auth/route').POST,
        {
          method: 'POST',
          url: '/api/auth/register',
          body: {
            email: 'existing@example.com',
            password: 'password123',
            full_name: 'Existing User',
          },
        }
      )

      expectAPIError(response, 'User already exists')
    })

    it('should validate password strength', async () => {
      const { response, status, json } = await testAPIRoute(
        require('@/app/api/auth/route').POST,
        {
          method: 'POST',
          url: '/api/auth/register',
          body: {
            email: 'test@example.com',
            password: '123', // Weak password
            full_name: 'Test User',
          },
        }
      )

      expectAPIError(response, 'Password must be at least 8 characters')
    })
  })

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        data: null,
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/auth/route').POST,
        {
          method: 'POST',
          url: '/api/auth/logout',
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.message).toBe('Logged out successfully')
      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })
  })

  describe('GET /api/auth/user', () => {
    it('should return current user', async () => {
      const testUser = createTestUser(mockSupabase, {
        email: 'test@example.com',
        id: 'test-user-id',
      })

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: testUser },
        error: null,
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/auth/route').GET,
        {
          method: 'GET',
          url: '/api/auth/user',
          headers: {
            authorization: 'Bearer test-token',
          },
        }
      )

      expectAPIResponse(response, 200)
      const data = await json()
      expect(data.user).toEqual(testUser)
    })

    it('should return error for unauthenticated user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: null,
        error: { message: 'Unauthorized' },
      })

      const { response, status, json } = await testAPIRoute(
        require('@/app/api/auth/route').GET,
        {
          method: 'GET',
          url: '/api/auth/user',
        }
      )

      expectAPIError(response, 'Unauthorized')
    })
  })
})