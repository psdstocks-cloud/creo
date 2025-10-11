import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class DashboardPage extends BasePage {
  // Selectors
  private welcomeMessage = '[data-testid="welcome-message"]'
  private userMenu = '[data-testid="user-menu"]'
  private userAvatar = '[data-testid="user-avatar"]'
  private creditsDisplay = '[data-testid="credits-display"]'
  private subscriptionStatus = '[data-testid="subscription-status"]'
  private quickActions = '[data-testid="quick-actions"]'
  private searchButton = '[data-testid="search-button"]'
  private generateButton = '[data-testid="generate-button"]'
  private ordersButton = '[data-testid="orders-button"]'
  private downloadsButton = '[data-testid="downloads-button"]'
  private settingsButton = '[data-testid="settings-button"]'
  private recentOrders = '[data-testid="recent-orders"]'
  private recentDownloads = '[data-testid="recent-downloads"]'
  private orderItem = '[data-testid="order-item"]'
  private downloadItem = '[data-testid="download-item"]'
  private statsContainer = '[data-testid="stats-container"]'
  private totalOrders = '[data-testid="total-orders"]'
  private totalDownloads = '[data-testid="total-downloads"]'
  private totalSpent = '[data-testid="total-spent"]'
  private activityFeed = '[data-testid="activity-feed"]'
  private activityItem = '[data-testid="activity-item"]'
  private notificationsButton = '[data-testid="notifications-button"]'
  private notificationsPanel = '[data-testid="notifications-panel"]'
  private notificationItem = '[data-testid="notification-item"]'
  private helpButton = '[data-testid="help-button"]'
  private supportButton = '[data-testid="support-button"]'

  constructor(page: Page) {
    super(page)
  }

  /**
   * Navigate to dashboard
   */
  async goToDashboard() {
    await this.navigateTo('/dashboard')
  }

  /**
   * Check if welcome message is visible
   */
  async hasWelcomeMessage(): Promise<boolean> {
    return await this.helpers.isVisible(this.welcomeMessage)
  }

  /**
   * Get welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    if (await this.hasWelcomeMessage()) {
      return await this.getText(this.welcomeMessage)
    }
    return ''
  }

  /**
   * Check if user menu is visible
   */
  async hasUserMenu(): Promise<boolean> {
    return await this.helpers.isVisible(this.userMenu)
  }

  /**
   * Open user menu
   */
  async openUserMenu() {
    await this.click(this.userMenu)
  }

  /**
   * Check if user avatar is visible
   */
  async hasUserAvatar(): Promise<boolean> {
    return await this.helpers.isVisible(this.userAvatar)
  }

  /**
   * Get current credits
   */
  async getCredits(): Promise<string> {
    if (await this.helpers.isVisible(this.creditsDisplay)) {
      return await this.getText(this.creditsDisplay)
    }
    return ''
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(): Promise<string> {
    if (await this.helpers.isVisible(this.subscriptionStatus)) {
      return await this.getText(this.subscriptionStatus)
    }
    return ''
  }

  /**
   * Check if quick actions are visible
   */
  async hasQuickActions(): Promise<boolean> {
    return await this.helpers.isVisible(this.quickActions)
  }

  /**
   * Click search button
   */
  async clickSearchButton() {
    await this.click(this.searchButton)
  }

  /**
   * Click generate button
   */
  async clickGenerateButton() {
    await this.click(this.generateButton)
  }

  /**
   * Click orders button
   */
  async clickOrdersButton() {
    await this.click(this.ordersButton)
  }

  /**
   * Click downloads button
   */
  async clickDownloadsButton() {
    await this.click(this.downloadsButton)
  }

  /**
   * Click settings button
   */
  async clickSettingsButton() {
    await this.click(this.settingsButton)
  }

  /**
   * Check if recent orders are visible
   */
  async hasRecentOrders(): Promise<boolean> {
    return await this.helpers.isVisible(this.recentOrders)
  }

  /**
   * Get recent orders count
   */
  async getRecentOrdersCount(): Promise<number> {
    return await this.page.locator(this.orderItem).count()
  }

  /**
   * Click on a recent order
   */
  async clickRecentOrder(index: number) {
    const orders = await this.page.locator(this.orderItem).all()
    if (orders[index]) {
      await orders[index].click()
    }
  }

  /**
   * Get recent order text
   */
  async getRecentOrderText(index: number): Promise<string> {
    const orders = await this.page.locator(this.orderItem).all()
    if (orders[index]) {
      return await orders[index].textContent() || ''
    }
    return ''
  }

  /**
   * Check if recent downloads are visible
   */
  async hasRecentDownloads(): Promise<boolean> {
    return await this.helpers.isVisible(this.recentDownloads)
  }

  /**
   * Get recent downloads count
   */
  async getRecentDownloadsCount(): Promise<number> {
    return await this.page.locator(this.downloadItem).count()
  }

  /**
   * Click on a recent download
   */
  async clickRecentDownload(index: number) {
    const downloads = await this.page.locator(this.downloadItem).all()
    if (downloads[index]) {
      await downloads[index].click()
    }
  }

  /**
   * Get recent download text
   */
  async getRecentDownloadText(index: number): Promise<string> {
    const downloads = await this.page.locator(this.downloadItem).all()
    if (downloads[index]) {
      return await downloads[index].textContent() || ''
    }
    return ''
  }

  /**
   * Check if stats container is visible
   */
  async hasStatsContainer(): Promise<boolean> {
    return await this.helpers.isVisible(this.statsContainer)
  }

  /**
   * Get total orders count
   */
  async getTotalOrders(): Promise<string> {
    if (await this.helpers.isVisible(this.totalOrders)) {
      return await this.getText(this.totalOrders)
    }
    return ''
  }

  /**
   * Get total downloads count
   */
  async getTotalDownloads(): Promise<string> {
    if (await this.helpers.isVisible(this.totalDownloads)) {
      return await this.getText(this.totalDownloads)
    }
    return ''
  }

  /**
   * Get total spent amount
   */
  async getTotalSpent(): Promise<string> {
    if (await this.helpers.isVisible(this.totalSpent)) {
      return await this.getText(this.totalSpent)
    }
    return ''
  }

  /**
   * Check if activity feed is visible
   */
  async hasActivityFeed(): Promise<boolean> {
    return await this.helpers.isVisible(this.activityFeed)
  }

  /**
   * Get activity items count
   */
  async getActivityCount(): Promise<number> {
    return await this.page.locator(this.activityItem).count()
  }

  /**
   * Get activity item text
   */
  async getActivityText(index: number): Promise<string> {
    const activities = await this.page.locator(this.activityItem).all()
    if (activities[index]) {
      return await activities[index].textContent() || ''
    }
    return ''
  }

  /**
   * Click on notifications button
   */
  async clickNotificationsButton() {
    await this.click(this.notificationsButton)
  }

  /**
   * Check if notifications panel is visible
   */
  async hasNotificationsPanel(): Promise<boolean> {
    return await this.helpers.isVisible(this.notificationsPanel)
  }

  /**
   * Get notifications count
   */
  async getNotificationsCount(): Promise<number> {
    return await this.page.locator(this.notificationItem).count()
  }

  /**
   * Get notification text
   */
  async getNotificationText(index: number): Promise<string> {
    const notifications = await this.page.locator(this.notificationItem).all()
    if (notifications[index]) {
      return await notifications[index].textContent() || ''
    }
    return ''
  }

  /**
   * Click on a notification
   */
  async clickNotification(index: number) {
    const notifications = await this.page.locator(this.notificationItem).all()
    if (notifications[index]) {
      await notifications[index].click()
    }
  }

  /**
   * Click help button
   */
  async clickHelpButton() {
    await this.click(this.helpButton)
  }

  /**
   * Click support button
   */
  async clickSupportButton() {
    await this.click(this.supportButton)
  }

  /**
   * Check if dashboard is fully loaded
   */
  async isDashboardLoaded(): Promise<boolean> {
    try {
      await this.helpers.waitForElement(this.welcomeMessage, 10000)
      return true
    } catch {
      return false
    }
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboardLoad() {
    await this.helpers.waitForElement(this.welcomeMessage)
    await this.waitForLoadingComplete()
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    return await this.helpers.isVisible(this.userMenu)
  }

  /**
   * Check if credits are displayed
   */
  async hasCreditsDisplay(): Promise<boolean> {
    return await this.helpers.isVisible(this.creditsDisplay)
  }

  /**
   * Check if subscription status is displayed
   */
  async hasSubscriptionStatus(): Promise<boolean> {
    return await this.helpers.isVisible(this.subscriptionStatus)
  }

  /**
   * Check if quick action buttons are visible
   */
  async hasQuickActionButtons(): Promise<boolean> {
    const searchVisible = await this.helpers.isVisible(this.searchButton)
    const generateVisible = await this.helpers.isVisible(this.generateButton)
    const ordersVisible = await this.helpers.isVisible(this.ordersButton)
    const downloadsVisible = await this.helpers.isVisible(this.downloadsButton)
    
    return searchVisible && generateVisible && ordersVisible && downloadsVisible
  }

  /**
   * Check if stats are displayed
   */
  async hasStatsDisplayed(): Promise<boolean> {
    const ordersVisible = await this.helpers.isVisible(this.totalOrders)
    const downloadsVisible = await this.helpers.isVisible(this.totalDownloads)
    const spentVisible = await this.helpers.isVisible(this.totalSpent)
    
    return ordersVisible && downloadsVisible && spentVisible
  }

  /**
   * Check if recent activity is displayed
   */
  async hasRecentActivity(): Promise<boolean> {
    const ordersVisible = await this.helpers.isVisible(this.recentOrders)
    const downloadsVisible = await this.helpers.isVisible(this.recentDownloads)
    
    return ordersVisible && downloadsVisible
  }

  /**
   * Check if notifications are available
   */
  async hasNotifications(): Promise<boolean> {
    return await this.helpers.isVisible(this.notificationsButton)
  }

  /**
   * Check if help and support are available
   */
  async hasHelpSupport(): Promise<boolean> {
    const helpVisible = await this.helpers.isVisible(this.helpButton)
    const supportVisible = await this.helpers.isVisible(this.supportButton)
    
    return helpVisible && supportVisible
  }
}
