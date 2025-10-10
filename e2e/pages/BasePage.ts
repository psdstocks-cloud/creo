import { Page, Locator } from '@playwright/test'
import { TestHelpers } from '../utils/test-helpers'

export class BasePage {
  protected page: Page
  protected helpers: TestHelpers

  // Common selectors
  protected header = '[data-testid="header"]'
  protected navigation = '[data-testid="navigation"]'
  protected footer = '[data-testid="footer"]'
  protected loadingSpinner = '[data-testid="loading-spinner"]'
  protected errorMessage = '[data-testid="error-message"]'
  protected successMessage = '[data-testid="success-message"]'

  constructor(page: Page) {
    this.page = page
    this.helpers = new TestHelpers(page)
  }

  /**
   * Navigate to a specific page
   */
  async navigateTo(path: string) {
    await this.page.goto(path)
    await this.helpers.waitForPageLoad()
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForPageLoad() {
    await this.helpers.waitForPageLoad()
  }

  /**
   * Check if the page is loaded
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      await this.helpers.waitForElement('body')
      return true
    } catch {
      return false
    }
  }

  /**
   * Get the current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url()
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title()
  }

  /**
   * Check if an element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    return await this.helpers.isVisible(selector)
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(selector: string, timeout = 10000) {
    await this.helpers.waitForElement(selector, timeout)
  }

  /**
   * Click an element
   */
  async click(selector: string) {
    await this.page.click(selector)
  }

  /**
   * Fill a form field
   */
  async fill(selector: string, value: string) {
    await this.helpers.fillField(selector, value)
  }

  /**
   * Get text content of an element
   */
  async getText(selector: string): Promise<string> {
    return await this.helpers.getText(selector)
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name: string) {
    await this.helpers.takeScreenshot(name)
  }

  /**
   * Check if loading spinner is visible
   */
  async isLoading(): Promise<boolean> {
    return await this.helpers.isVisible(this.loadingSpinner)
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete() {
    await this.helpers.waitForElementHidden(this.loadingSpinner)
  }

  /**
   * Check if there's an error message
   */
  async hasError(): Promise<boolean> {
    return await this.helpers.isVisible(this.errorMessage)
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    if (await this.hasError()) {
      return await this.helpers.getText(this.errorMessage)
    }
    return ''
  }

  /**
   * Check if there's a success message
   */
  async hasSuccess(): Promise<boolean> {
    return await this.helpers.isVisible(this.successMessage)
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    if (await this.hasSuccess()) {
      return await this.helpers.getText(this.successMessage)
    }
    return ''
  }

  /**
   * Wait for a specific text to appear
   */
  async waitForText(text: string, timeout = 10000) {
    await this.helpers.waitForText(text, timeout)
  }

  /**
   * Wait for a specific text to disappear
   */
  async waitForTextHidden(text: string, timeout = 10000) {
    await this.helpers.waitForTextHidden(text, timeout)
  }

  /**
   * Scroll to an element
   */
  async scrollTo(selector: string) {
    await this.helpers.scrollToElement(selector)
  }

  /**
   * Press a key
   */
  async pressKey(key: string) {
    await this.helpers.pressKey(key)
  }

  /**
   * Hover over an element
   */
  async hover(selector: string) {
    await this.helpers.hover(selector)
  }

  /**
   * Reload the page
   */
  async reload() {
    await this.helpers.reload()
  }

  /**
   * Go back in browser history
   */
  async goBack() {
    await this.helpers.goBack()
  }

  /**
   * Go forward in browser history
   */
  async goForward() {
    await this.helpers.goForward()
  }
}
