import { test, expect } from '@playwright/test'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'

test.describe('Authentication Flow', () => {
  let authPage: AuthPage
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page)
    dashboardPage = new DashboardPage(page)
  })

  test.describe('Sign In Flow', () => {
    test('should display sign in form', async () => {
      await authPage.goToSignIn()
      
      await expect(authPage.page).toHaveURL(/.*\/auth\/signin/)
      await expect(authPage.page.locator('[data-testid="auth-form"]')).toBeVisible()
      await expect(authPage.page.locator('[data-testid="email-input"]')).toBeVisible()
      await expect(authPage.page.locator('[data-testid="password-input"]')).toBeVisible()
      await expect(authPage.page.locator('[data-testid="sign-in-button"]')).toBeVisible()
    })

    test('should show validation errors for empty fields', async () => {
      await authPage.goToSignIn()
      
      await authPage.click('[data-testid="sign-in-button"]')
      
      // Check for validation errors
      await expect(authPage.page.locator('[data-testid="email-error"]')).toBeVisible()
      await expect(authPage.page.locator('[data-testid="password-error"]')).toBeVisible()
    })

    test('should show error for invalid credentials', async () => {
      await authPage.goToSignIn()
      
      await authPage.signIn('invalid@example.com', 'wrongpassword')
      
      // Check for authentication error
      const errorMessage = await authPage.getAuthError()
      expect(errorMessage).toBeTruthy()
    })

    test('should successfully sign in with valid credentials', async () => {
      await authPage.goToSignIn()
      
      // Use test credentials (these should be set up in your test environment)
      await authPage.signIn('test@example.com', 'testpassword')
      
      // Should redirect to dashboard
      await expect(authPage.page).toHaveURL(/.*\/dashboard/)
      await expect(dashboardPage.page.locator('[data-testid="welcome-message"]')).toBeVisible()
    })

    test('should remember user session', async () => {
      await authPage.goToSignIn()
      await authPage.signIn('test@example.com', 'testpassword')
      
      // Navigate to another page and back
      await authPage.navigateTo('/stock-search')
      await authPage.navigateTo('/dashboard')
      
      // Should still be signed in
      await expect(dashboardPage.page.locator('[data-testid="user-menu"]')).toBeVisible()
    })
  })

  test.describe('Sign Up Flow', () => {
    test('should display sign up form', async () => {
      await authPage.goToSignUp()
      
      await expect(authPage.page).toHaveURL(/.*\/auth\/signup/)
      await expect(authPage.page.locator('[data-testid="auth-form"]')).toBeVisible()
      await expect(authPage.page.locator('[data-testid="email-input"]')).toBeVisible()
      await expect(authPage.page.locator('[data-testid="password-input"]')).toBeVisible()
      await expect(authPage.page.locator('[data-testid="confirm-password-input"]')).toBeVisible()
      await expect(authPage.page.locator('[data-testid="full-name-input"]')).toBeVisible()
      await expect(authPage.page.locator('[data-testid="sign-up-button"]')).toBeVisible()
    })

    test('should show validation errors for empty fields', async () => {
      await authPage.goToSignUp()
      
      await authPage.click('[data-testid="sign-up-button"]')
      
      // Check for validation errors
      await expect(authPage.page.locator('[data-testid="email-error"]')).toBeVisible()
      await expect(authPage.page.locator('[data-testid="password-error"]')).toBeVisible()
      await expect(authPage.page.locator('[data-testid="confirm-password-error"]')).toBeVisible()
      await expect(authPage.page.locator('[data-testid="full-name-error"]')).toBeVisible()
    })

    test('should show error for password mismatch', async () => {
      await authPage.goToSignUp()
      
      await authPage.fill('[data-testid="email-input"]', 'test@example.com')
      await authPage.fill('[data-testid="password-input"]', 'password123')
      await authPage.fill('[data-testid="confirm-password-input"]', 'differentpassword')
      await authPage.fill('[data-testid="full-name-input"]', 'Test User')
      
      await authPage.click('[data-testid="sign-up-button"]')
      
      // Check for password mismatch error
      await expect(authPage.page.locator('[data-testid="confirm-password-error"]')).toBeVisible()
    })

    test('should show error for weak password', async () => {
      await authPage.goToSignUp()
      
      await authPage.fill('[data-testid="email-input"]', 'test@example.com')
      await authPage.fill('[data-testid="password-input"]', '123')
      await authPage.fill('[data-testid="confirm-password-input"]', '123')
      await authPage.fill('[data-testid="full-name-input"]', 'Test User')
      
      await authPage.click('[data-testid="sign-up-button"]')
      
      // Check for weak password error
      await expect(authPage.page.locator('[data-testid="password-error"]')).toBeVisible()
    })

    test('should show error for invalid email', async () => {
      await authPage.goToSignUp()
      
      await authPage.fill('[data-testid="email-input"]', 'invalid-email')
      await authPage.fill('[data-testid="password-input"]', 'password123')
      await authPage.fill('[data-testid="confirm-password-input"]', 'password123')
      await authPage.fill('[data-testid="full-name-input"]', 'Test User')
      
      await authPage.click('[data-testid="sign-up-button"]')
      
      // Check for invalid email error
      await expect(authPage.page.locator('[data-testid="email-error"]')).toBeVisible()
    })

    test('should successfully sign up with valid data', async () => {
      await authPage.goToSignUp()
      
      const timestamp = Date.now()
      const email = `test${timestamp}@example.com`
      
      await authPage.signUp(email, 'password123', 'Test User')
      
      // Should redirect to dashboard or show success message
      await expect(authPage.page).toHaveURL(/.*\/dashboard/)
      await expect(dashboardPage.page.locator('[data-testid="welcome-message"]')).toBeVisible()
    })
  })

  test.describe('Sign Out Flow', () => {
    test('should successfully sign out', async () => {
      // First sign in
      await authPage.goToSignIn()
      await authPage.signIn('test@example.com', 'testpassword')
      
      // Then sign out
      await authPage.signOut()
      
      // Should redirect to sign in page
      await expect(authPage.page).toHaveURL(/.*\/auth\/signin/)
      await expect(authPage.page.locator('[data-testid="sign-in-button"]')).toBeVisible()
    })
  })

  test.describe('Password Reset Flow', () => {
    test('should display forgot password form', async () => {
      await authPage.goToForgotPassword()
      
      await expect(authPage.page).toHaveURL(/.*\/auth\/forgot-password/)
      await expect(authPage.page.locator('[data-testid="email-input"]')).toBeVisible()
      await expect(authPage.page.locator('[data-testid="reset-password-button"]')).toBeVisible()
    })

    test('should show error for invalid email', async () => {
      await authPage.goToForgotPassword()
      
      await authPage.resetPassword('invalid-email')
      
      // Check for invalid email error
      await expect(authPage.page.locator('[data-testid="email-error"]')).toBeVisible()
    })

    test('should show success message for valid email', async () => {
      await authPage.goToForgotPassword()
      
      await authPage.resetPassword('test@example.com')
      
      // Check for success message
      const successMessage = await authPage.getAuthSuccess()
      expect(successMessage).toBeTruthy()
    })
  })

  test.describe('Form Validation', () => {
    test('should validate email format', async () => {
      await authPage.goToSignIn()
      
      await authPage.fill('[data-testid="email-input"]', 'invalid-email')
      await authPage.fill('[data-testid="password-input"]', 'password123')
      await authPage.click('[data-testid="sign-in-button"]')
      
      await expect(authPage.page.locator('[data-testid="email-error"]')).toBeVisible()
    })

    test('should validate required fields', async () => {
      await authPage.goToSignIn()
      
      await authPage.click('[data-testid="sign-in-button"]')
      
      await expect(authPage.page.locator('[data-testid="email-error"]')).toBeVisible()
      await expect(authPage.page.locator('[data-testid="password-error"]')).toBeVisible()
    })

    test('should show loading state during authentication', async () => {
      await authPage.goToSignIn()
      
      await authPage.fill('[data-testid="email-input"]', 'test@example.com')
      await authPage.fill('[data-testid="password-input"]', 'testpassword')
      await authPage.click('[data-testid="sign-in-button"]')
      
      // Check for loading state
      await expect(authPage.page.locator('[data-testid="auth-loading"]')).toBeVisible()
    })
  })

  test.describe('Navigation', () => {
    test('should navigate between sign in and sign up', async () => {
      await authPage.goToSignIn()
      
      // Click sign up link
      await authPage.click('[data-testid="sign-up-link"]')
      await expect(authPage.page).toHaveURL(/.*\/auth\/signup/)
      
      // Click sign in link
      await authPage.click('[data-testid="sign-in-link"]')
      await expect(authPage.page).toHaveURL(/.*\/auth\/signin/)
    })

    test('should redirect to dashboard after successful authentication', async () => {
      await authPage.goToSignIn()
      await authPage.signIn('test@example.com', 'testpassword')
      
      await expect(authPage.page).toHaveURL(/.*\/dashboard/)
    })

    test('should redirect to sign in when accessing protected routes', async () => {
      await authPage.navigateTo('/dashboard')
      
      // Should redirect to sign in page
      await expect(authPage.page).toHaveURL(/.*\/auth\/signin/)
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper form labels', async () => {
      await authPage.goToSignIn()
      
      // Check for proper labels
      await expect(authPage.page.locator('label[for="email"]')).toBeVisible()
      await expect(authPage.page.locator('label[for="password"]')).toBeVisible()
    })

    test('should support keyboard navigation', async () => {
      await authPage.goToSignIn()
      
      // Tab through form elements
      await authPage.pressKey('Tab')
      await authPage.pressKey('Tab')
      await authPage.pressKey('Tab')
      
      // Should be able to submit with Enter
      await authPage.fill('[data-testid="email-input"]', 'test@example.com')
      await authPage.fill('[data-testid="password-input"]', 'testpassword')
      await authPage.pressKey('Enter')
    })

    test('should have proper ARIA attributes', async () => {
      await authPage.goToSignIn()
      
      // Check for ARIA attributes
      await expect(authPage.page.locator('[data-testid="auth-form"]')).toHaveAttribute('role', 'form')
      await expect(authPage.page.locator('[data-testid="email-input"]')).toHaveAttribute('type', 'email')
      await expect(authPage.page.locator('[data-testid="password-input"]')).toHaveAttribute('type', 'password')
    })
  })
})
