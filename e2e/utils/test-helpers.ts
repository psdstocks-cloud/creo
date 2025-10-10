import { Page, expect } from '@playwright/test'

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for the page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
    await this.page.waitForSelector('body')
  }

  /**
   * Take a screenshot with a custom name
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}.png`,
      fullPage: true 
    })
  }

  /**
   * Wait for a specific element to be visible
   */
  async waitForElement(selector: string, timeout = 10000) {
    await this.page.waitForSelector(selector, { timeout })
  }

  /**
   * Wait for an element to be hidden
   */
  async waitForElementHidden(selector: string, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout })
  }

  /**
   * Check if an element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 1000 })
      return true
    } catch {
      return false
    }
  }

  /**
   * Get text content of an element
   */
  async getText(selector: string): Promise<string> {
    const element = await this.page.waitForSelector(selector)
    return await element.textContent() || ''
  }

  /**
   * Click an element and wait for navigation
   */
  async clickAndWaitForNavigation(selector: string) {
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(selector)
    ])
  }

  /**
   * Fill a form field
   */
  async fillField(selector: string, value: string) {
    await this.page.fill(selector, value)
  }

  /**
   * Select an option from a dropdown
   */
  async selectOption(selector: string, value: string) {
    await this.page.selectOption(selector, value)
  }

  /**
   * Check a checkbox
   */
  async checkCheckbox(selector: string) {
    await this.page.check(selector)
  }

  /**
   * Uncheck a checkbox
   */
  async uncheckCheckbox(selector: string) {
    await this.page.uncheck(selector)
  }

  /**
   * Upload a file
   */
  async uploadFile(selector: string, filePath: string) {
    await this.page.setInputFiles(selector, filePath)
  }

  /**
   * Wait for a specific text to appear
   */
  async waitForText(text: string, timeout = 10000) {
    await this.page.waitForSelector(`text=${text}`, { timeout })
  }

  /**
   * Wait for a specific text to disappear
   */
  async waitForTextHidden(text: string, timeout = 10000) {
    await this.page.waitForSelector(`text=${text}`, { state: 'hidden', timeout })
  }

  /**
   * Scroll to an element
   */
  async scrollToElement(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded()
  }

  /**
   * Wait for a network request to complete
   */
  async waitForRequest(urlPattern: string | RegExp) {
    await this.page.waitForRequest(urlPattern)
  }

  /**
   * Wait for a network response
   */
  async waitForResponse(urlPattern: string | RegExp) {
    await this.page.waitForResponse(urlPattern)
  }

  /**
   * Wait for a specific number of elements
   */
  async waitForElementCount(selector: string, count: number, timeout = 10000) {
    await this.page.waitForFunction(
      ({ selector, count }) => document.querySelectorAll(selector).length === count,
      { selector, count },
      { timeout }
    )
  }

  /**
   * Get all text content from elements matching a selector
   */
  async getAllText(selector: string): Promise<string[]> {
    const elements = await this.page.locator(selector).all()
    return Promise.all(elements.map(el => el.textContent() || ''))
  }

  /**
   * Check if an element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 1000 })
      return true
    } catch {
      return false
    }
  }

  /**
   * Check if an element is hidden
   */
  async isHidden(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'hidden', timeout: 1000 })
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
   * Navigate to a specific URL
   */
  async navigateTo(url: string) {
    await this.page.goto(url)
    await this.waitForPageLoad()
  }

  /**
   * Go back in browser history
   */
  async goBack() {
    await this.page.goBack()
    await this.waitForPageLoad()
  }

  /**
   * Go forward in browser history
   */
  async goForward() {
    await this.page.goForward()
    await this.waitForPageLoad()
  }

  /**
   * Reload the page
   */
  async reload() {
    await this.page.reload()
    await this.waitForPageLoad()
  }

  /**
   * Press a key
   */
  async pressKey(key: string) {
    await this.page.keyboard.press(key)
  }

  /**
   * Type text
   */
  async typeText(text: string) {
    await this.page.keyboard.type(text)
  }

  /**
   * Clear a field
   */
  async clearField(selector: string) {
    await this.page.fill(selector, '')
  }

  /**
   * Focus an element
   */
  async focus(selector: string) {
    await this.page.focus(selector)
  }

  /**
   * Blur an element
   */
  async blur(selector: string) {
    await this.page.blur(selector)
  }

  /**
   * Hover over an element
   */
  async hover(selector: string) {
    await this.page.hover(selector)
  }

  /**
   * Double click an element
   */
  async doubleClick(selector: string) {
    await this.page.dblclick(selector)
  }

  /**
   * Right click an element
   */
  async rightClick(selector: string) {
    await this.page.click(selector, { button: 'right' })
  }

  /**
   * Wait for a specific condition
   */
  async waitForCondition(condition: () => Promise<boolean>, timeout = 10000) {
    await this.page.waitForFunction(condition, { timeout })
  }

  /**
   * Get element attribute
   */
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    const element = await this.page.waitForSelector(selector)
    return await element.getAttribute(attribute)
  }

  /**
   * Get element property
   */
  async getProperty(selector: string, property: string): Promise<any> {
    const element = await this.page.waitForSelector(selector)
    return await element.evaluate((el, prop) => (el as any)[prop], property)
  }

  /**
   * Assert element is visible
   */
  async assertVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible()
  }

  /**
   * Assert element is hidden
   */
  async assertHidden(selector: string) {
    await expect(this.page.locator(selector)).toBeHidden()
  }

  /**
   * Assert element has text
   */
  async assertText(selector: string, text: string) {
    await expect(this.page.locator(selector)).toContainText(text)
  }

  /**
   * Assert element has exact text
   */
  async assertExactText(selector: string, text: string) {
    await expect(this.page.locator(selector)).toHaveText(text)
  }

  /**
   * Assert element has value
   */
  async assertValue(selector: string, value: string) {
    await expect(this.page.locator(selector)).toHaveValue(value)
  }

  /**
   * Assert element is checked
   */
  async assertChecked(selector: string) {
    await expect(this.page.locator(selector)).toBeChecked()
  }

  /**
   * Assert element is not checked
   */
  async assertNotChecked(selector: string) {
    await expect(this.page.locator(selector)).not.toBeChecked()
  }

  /**
   * Assert element is enabled
   */
  async assertEnabled(selector: string) {
    await expect(this.page.locator(selector)).toBeEnabled()
  }

  /**
   * Assert element is disabled
   */
  async assertDisabled(selector: string) {
    await expect(this.page.locator(selector)).toBeDisabled()
  }

  /**
   * Assert URL contains text
   */
  async assertUrlContains(text: string) {
    await expect(this.page).toHaveURL(new RegExp(text))
  }

  /**
   * Assert page title
   */
  async assertTitle(title: string) {
    await expect(this.page).toHaveTitle(title)
  }

  /**
   * Assert page title contains text
   */
  async assertTitleContains(text: string) {
    await expect(this.page).toHaveTitle(new RegExp(text))
  }
}
