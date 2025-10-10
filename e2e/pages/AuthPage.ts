import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class AuthPage extends BasePage {
  // Selectors
  private emailInput = '[data-testid="email-input"]'
  private passwordInput = '[data-testid="password-input"]'
  private confirmPasswordInput = '[data-testid="confirm-password-input"]'
  private fullNameInput = '[data-testid="full-name-input"]'
  private signInButton = '[data-testid="sign-in-button"]'
  private signUpButton = '[data-testid="sign-up-button"]'
  private signOutButton = '[data-testid="sign-out-button"]'
  private forgotPasswordLink = '[data-testid="forgot-password-link"]'
  private resetPasswordButton = '[data-testid="reset-password-button"]'
  private authForm = '[data-testid="auth-form"]'
  private authError = '[data-testid="auth-error"]'
  private authSuccess = '[data-testid="auth-success"]'
  private loadingSpinner = '[data-testid="auth-loading"]'

  constructor(page: Page) {
    super(page)
  }

  /**
   * Navigate to sign in page
   */
  async goToSignIn() {
    await this.navigateTo('/auth/signin')
  }

  /**
   * Navigate to sign up page
   */
  async goToSignUp() {
    await this.navigateTo('/auth/signup')
  }

  /**
   * Navigate to forgot password page
   */
  async goToForgotPassword() {
    await this.navigateTo('/auth/forgot-password')
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    await this.fill(this.emailInput, email)
    await this.fill(this.passwordInput, password)
    await this.click(this.signInButton)
    await this.waitForLoadingComplete()
  }

  /**
   * Sign up with email, password, and full name
   */
  async signUp(email: string, password: string, fullName: string) {
    await this.fill(this.emailInput, email)
    await this.fill(this.passwordInput, password)
    await this.fill(this.confirmPasswordInput, password)
    await this.fill(this.fullNameInput, fullName)
    await this.click(this.signUpButton)
    await this.waitForLoadingComplete()
  }

  /**
   * Sign out
   */
  async signOut() {
    await this.click(this.signOutButton)
    await this.waitForLoadingComplete()
  }

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    await this.fill(this.emailInput, email)
    await this.click(this.resetPasswordButton)
    await this.waitForLoadingComplete()
  }

  /**
   * Check if user is signed in
   */
  async isSignedIn(): Promise<boolean> {
    try {
      await this.helpers.waitForElement('[data-testid="user-menu"]', 5000)
      return true
    } catch {
      return false
    }
  }

  /**
   * Check if user is signed out
   */
  async isSignedOut(): Promise<boolean> {
    try {
      await this.helpers.waitForElement('[data-testid="sign-in-button"]', 5000)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get authentication error message
   */
  async getAuthError(): Promise<string> {
    if (await this.helpers.isVisible(this.authError)) {
      return await this.getText(this.authError)
    }
    return ''
  }

  /**
   * Get authentication success message
   */
  async getAuthSuccess(): Promise<string> {
    if (await this.helpers.isVisible(this.authSuccess)) {
      return await this.getText(this.authSuccess)
    }
    return ''
  }

  /**
   * Check if authentication form is visible
   */
  async isAuthFormVisible(): Promise<boolean> {
    return await this.helpers.isVisible(this.authForm)
  }

  /**
   * Check if loading spinner is visible
   */
  async isAuthLoading(): Promise<boolean> {
    return await this.helpers.isVisible(this.loadingSpinner)
  }

  /**
   * Wait for authentication to complete
   */
  async waitForAuthComplete() {
    await this.helpers.waitForElementHidden(this.loadingSpinner)
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.click(this.forgotPasswordLink)
  }

  /**
   * Check if email input is visible
   */
  async isEmailInputVisible(): Promise<boolean> {
    return await this.helpers.isVisible(this.emailInput)
  }

  /**
   * Check if password input is visible
   */
  async isPasswordInputVisible(): Promise<boolean> {
    return await this.helpers.isVisible(this.passwordInput)
  }

  /**
   * Check if sign in button is visible
   */
  async isSignInButtonVisible(): Promise<boolean> {
    return await this.helpers.isVisible(this.signInButton)
  }

  /**
   * Check if sign up button is visible
   */
  async isSignUpButtonVisible(): Promise<boolean> {
    return await this.helpers.isVisible(this.signUpButton)
  }

  /**
   * Check if sign out button is visible
   */
  async isSignOutButtonVisible(): Promise<boolean> {
    return await this.helpers.isVisible(this.signOutButton)
  }

  /**
   * Get current email value
   */
  async getEmailValue(): Promise<string> {
    return await this.helpers.getAttribute(this.emailInput, 'value') || ''
  }

  /**
   * Get current password value
   */
  async getPasswordValue(): Promise<string> {
    return await this.helpers.getAttribute(this.passwordInput, 'value') || ''
  }

  /**
   * Clear email input
   */
  async clearEmail() {
    await this.helpers.clearField(this.emailInput)
  }

  /**
   * Clear password input
   */
  async clearPassword() {
    await this.helpers.clearField(this.passwordInput)
  }

  /**
   * Focus email input
   */
  async focusEmail() {
    await this.helpers.focus(this.emailInput)
  }

  /**
   * Focus password input
   */
  async focusPassword() {
    await this.helpers.focus(this.passwordInput)
  }

  /**
   * Check if email input is required
   */
  async isEmailRequired(): Promise<boolean> {
    const required = await this.helpers.getAttribute(this.emailInput, 'required')
    return required !== null
  }

  /**
   * Check if password input is required
   */
  async isPasswordRequired(): Promise<boolean> {
    const required = await this.helpers.getAttribute(this.passwordInput, 'required')
    return required !== null
  }

  /**
   * Check if email input is disabled
   */
  async isEmailDisabled(): Promise<boolean> {
    return await this.helpers.getProperty(this.emailInput, 'disabled')
  }

  /**
   * Check if password input is disabled
   */
  async isPasswordDisabled(): Promise<boolean> {
    return await this.helpers.getProperty(this.passwordInput, 'disabled')
  }

  /**
   * Check if sign in button is disabled
   */
  async isSignInButtonDisabled(): Promise<boolean> {
    return await this.helpers.getProperty(this.signInButton, 'disabled')
  }

  /**
   * Check if sign up button is disabled
   */
  async isSignUpButtonDisabled(): Promise<boolean> {
    return await this.helpers.getProperty(this.signUpButton, 'disabled')
  }
}
