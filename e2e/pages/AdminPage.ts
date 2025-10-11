import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class AdminPage extends BasePage {
  // Selectors
  private adminDashboard = '[data-testid="admin-dashboard"]'
  private userManagementTab = '[data-testid="user-management-tab"]'
  private orderManagementTab = '[data-testid="order-management-tab"]'
  private monitoringTab = '[data-testid="monitoring-tab"]'
  private userTable = '[data-testid="user-table"]'
  private userRow = '[data-testid="user-row"]'
  private orderTable = '[data-testid="order-table"]'
  private orderRow = '[data-testid="order-row"]'
  private userSearchInput = '[data-testid="user-search-input"]'
  private orderSearchInput = '[data-testid="order-search-input"]'
  private userFilterSelect = '[data-testid="user-filter-select"]'
  private orderFilterSelect = '[data-testid="order-filter-select"]'
  private userActionsButton = '[data-testid="user-actions-button"]'
  private orderActionsButton = '[data-testid="order-actions-button"]'
  private suspendUserButton = '[data-testid="suspend-user-button"]'
  private activateUserButton = '[data-testid="activate-user-button"]'
  private editUserButton = '[data-testid="edit-user-button"]'
  private deleteUserButton = '[data-testid="delete-user-button"]'
  private processOrderButton = '[data-testid="process-order-button"]'
  private cancelOrderButton = '[data-testid="cancel-order-button"]'
  private refundOrderButton = '[data-testid="refund-order-button"]'
  private statsContainer = '[data-testid="stats-container"]'
  private totalUsers = '[data-testid="total-users"]'
  private totalOrders = '[data-testid="total-orders"]'
  private totalRevenue = '[data-testid="total-revenue"]'
  private activeUsers = '[data-testid="active-users"]'
  private pendingOrders = '[data-testid="pending-orders"]'
  private systemHealth = '[data-testid="system-health"]'
  private errorLogs = '[data-testid="error-logs"]'
  private performanceMetrics = '[data-testid="performance-metrics"]'
  private apiUsage = '[data-testid="api-usage"]'
  private userDetailsModal = '[data-testid="user-details-modal"]'
  private orderDetailsModal = '[data-testid="order-details-modal"]'
  private confirmDialog = '[data-testid="confirm-dialog"]'
  private confirmButton = '[data-testid="confirm-button"]'
  private cancelButton = '[data-testid="cancel-button"]'

  constructor(page: Page) {
    super(page)
  }

  /**
   * Navigate to admin dashboard
   */
  async goToAdminDashboard() {
    await this.navigateTo('/admin')
  }

  /**
   * Check if admin dashboard is visible
   */
  async hasAdminDashboard(): Promise<boolean> {
    return await this.helpers.isVisible(this.adminDashboard)
  }

  /**
   * Check if user has admin access
   */
  async hasAdminAccess(): Promise<boolean> {
    try {
      await this.helpers.waitForElement(this.adminDashboard, 5000)
      return true
    } catch {
      return false
    }
  }

  /**
   * Navigate to user management tab
   */
  async goToUserManagement() {
    await this.click(this.userManagementTab)
    await this.helpers.waitForElement(this.userTable)
  }

  /**
   * Navigate to order management tab
   */
  async goToOrderManagement() {
    await this.click(this.orderManagementTab)
    await this.helpers.waitForElement(this.orderTable)
  }

  /**
   * Navigate to monitoring tab
   */
  async goToMonitoring() {
    await this.click(this.monitoringTab)
    await this.helpers.waitForElement(this.statsContainer)
  }

  /**
   * Search for users
   */
  async searchUsers(query: string) {
    await this.fill(this.userSearchInput, query)
    await this.pressKey('Enter')
    await this.waitForLoadingComplete()
  }

  /**
   * Search for orders
   */
  async searchOrders(query: string) {
    await this.fill(this.orderSearchInput, query)
    await this.pressKey('Enter')
    await this.waitForLoadingComplete()
  }

  /**
   * Filter users by status
   */
  async filterUsers(status: string) {
    await this.helpers.selectOption(this.userFilterSelect, status)
    await this.waitForLoadingComplete()
  }

  /**
   * Filter orders by status
   */
  async filterOrders(status: string) {
    await this.helpers.selectOption(this.orderFilterSelect, status)
    await this.waitForLoadingComplete()
  }

  /**
   * Get users count
   */
  async getUsersCount(): Promise<number> {
    return await this.page.locator(this.userRow).count()
  }

  /**
   * Get orders count
   */
  async getOrdersCount(): Promise<number> {
    return await this.page.locator(this.orderRow).count()
  }

  /**
   * Click on a user row
   */
  async clickUserRow(index: number) {
    const rows = await this.page.locator(this.userRow).all()
    if (rows[index]) {
      await rows[index].click()
    }
  }

  /**
   * Click on an order row
   */
  async clickOrderRow(index: number) {
    const rows = await this.page.locator(this.orderRow).all()
    if (rows[index]) {
      await rows[index].click()
    }
  }

  /**
   * Get user row text
   */
  async getUserRowText(index: number): Promise<string> {
    const rows = await this.page.locator(this.userRow).all()
    if (rows[index]) {
      return await rows[index].textContent() || ''
    }
    return ''
  }

  /**
   * Get order row text
   */
  async getOrderRowText(index: number): Promise<string> {
    const rows = await this.page.locator(this.orderRow).all()
    if (rows[index]) {
      return await rows[index].textContent() || ''
    }
    return ''
  }

  /**
   * Open user actions menu
   */
  async openUserActions(index: number) {
    const actionButtons = await this.page.locator(this.userActionsButton).all()
    if (actionButtons[index]) {
      await actionButtons[index].click()
    }
  }

  /**
   * Open order actions menu
   */
  async openOrderActions(index: number) {
    const actionButtons = await this.page.locator(this.orderActionsButton).all()
    if (actionButtons[index]) {
      await actionButtons[index].click()
    }
  }

  /**
   * Suspend a user
   */
  async suspendUser(index: number) {
    await this.openUserActions(index)
    await this.click(this.suspendUserButton)
    await this.confirmAction()
  }

  /**
   * Activate a user
   */
  async activateUser(index: number) {
    await this.openUserActions(index)
    await this.click(this.activateUserButton)
    await this.confirmAction()
  }

  /**
   * Edit a user
   */
  async editUser(index: number) {
    await this.openUserActions(index)
    await this.click(this.editUserButton)
    await this.helpers.waitForElement(this.userDetailsModal)
  }

  /**
   * Delete a user
   */
  async deleteUser(index: number) {
    await this.openUserActions(index)
    await this.click(this.deleteUserButton)
    await this.confirmAction()
  }

  /**
   * Process an order
   */
  async processOrder(index: number) {
    await this.openOrderActions(index)
    await this.click(this.processOrderButton)
    await this.confirmAction()
  }

  /**
   * Cancel an order
   */
  async cancelOrder(index: number) {
    await this.openOrderActions(index)
    await this.click(this.cancelOrderButton)
    await this.confirmAction()
  }

  /**
   * Refund an order
   */
  async refundOrder(index: number) {
    await this.openOrderActions(index)
    await this.click(this.refundOrderButton)
    await this.confirmAction()
  }

  /**
   * Confirm an action
   */
  async confirmAction() {
    if (await this.helpers.isVisible(this.confirmDialog)) {
      await this.click(this.confirmButton)
    }
  }

  /**
   * Cancel an action
   */
  async cancelAction() {
    if (await this.helpers.isVisible(this.confirmDialog)) {
      await this.click(this.cancelButton)
    }
  }

  /**
   * Get total users count
   */
  async getTotalUsers(): Promise<string> {
    if (await this.helpers.isVisible(this.totalUsers)) {
      return await this.getText(this.totalUsers)
    }
    return ''
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
   * Get total revenue
   */
  async getTotalRevenue(): Promise<string> {
    if (await this.helpers.isVisible(this.totalRevenue)) {
      return await this.getText(this.totalRevenue)
    }
    return ''
  }

  /**
   * Get active users count
   */
  async getActiveUsers(): Promise<string> {
    if (await this.helpers.isVisible(this.activeUsers)) {
      return await this.getText(this.activeUsers)
    }
    return ''
  }

  /**
   * Get pending orders count
   */
  async getPendingOrders(): Promise<string> {
    if (await this.helpers.isVisible(this.pendingOrders)) {
      return await this.getText(this.pendingOrders)
    }
    return ''
  }

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<string> {
    if (await this.helpers.isVisible(this.systemHealth)) {
      return await this.getText(this.systemHealth)
    }
    return ''
  }

  /**
   * Check if error logs are visible
   */
  async hasErrorLogs(): Promise<boolean> {
    return await this.helpers.isVisible(this.errorLogs)
  }

  /**
   * Get error logs count
   */
  async getErrorLogsCount(): Promise<number> {
    return await this.page.locator('[data-testid="error-log-item"]').count()
  }

  /**
   * Check if performance metrics are visible
   */
  async hasPerformanceMetrics(): Promise<boolean> {
    return await this.helpers.isVisible(this.performanceMetrics)
  }

  /**
   * Check if API usage is visible
   */
  async hasApiUsage(): Promise<boolean> {
    return await this.helpers.isVisible(this.apiUsage)
  }

  /**
   * Check if user details modal is visible
   */
  async hasUserDetailsModal(): Promise<boolean> {
    return await this.helpers.isVisible(this.userDetailsModal)
  }

  /**
   * Check if order details modal is visible
   */
  async hasOrderDetailsModal(): Promise<boolean> {
    return await this.helpers.isVisible(this.orderDetailsModal)
  }

  /**
   * Close user details modal
   */
  async closeUserDetailsModal() {
    if (await this.hasUserDetailsModal()) {
      await this.click('[data-testid="close-modal-button"]')
      await this.helpers.waitForElementHidden(this.userDetailsModal)
    }
  }

  /**
   * Close order details modal
   */
  async closeOrderDetailsModal() {
    if (await this.hasOrderDetailsModal()) {
      await this.click('[data-testid="close-modal-button"]')
      await this.helpers.waitForElementHidden(this.orderDetailsModal)
    }
  }

  /**
   * Check if stats container is visible
   */
  async hasStatsContainer(): Promise<boolean> {
    return await this.helpers.isVisible(this.statsContainer)
  }

  /**
   * Check if user table is visible
   */
  async hasUserTable(): Promise<boolean> {
    return await this.helpers.isVisible(this.userTable)
  }

  /**
   * Check if order table is visible
   */
  async hasOrderTable(): Promise<boolean> {
    return await this.helpers.isVisible(this.orderTable)
  }

  /**
   * Check if user search is visible
   */
  async hasUserSearch(): Promise<boolean> {
    return await this.helpers.isVisible(this.userSearchInput)
  }

  /**
   * Check if order search is visible
   */
  async hasOrderSearch(): Promise<boolean> {
    return await this.helpers.isVisible(this.orderSearchInput)
  }

  /**
   * Check if user filters are visible
   */
  async hasUserFilters(): Promise<boolean> {
    return await this.helpers.isVisible(this.userFilterSelect)
  }

  /**
   * Check if order filters are visible
   */
  async hasOrderFilters(): Promise<boolean> {
    return await this.helpers.isVisible(this.orderFilterSelect)
  }

  /**
   * Wait for admin dashboard to load
   */
  async waitForAdminDashboardLoad() {
    await this.helpers.waitForElement(this.adminDashboard)
    await this.waitForLoadingComplete()
  }

  /**
   * Check if admin dashboard is fully loaded
   */
  async isAdminDashboardLoaded(): Promise<boolean> {
    try {
      await this.helpers.waitForElement(this.adminDashboard, 10000)
      return true
    } catch {
      return false
    }
  }

  /**
   * Check if user management tab is active
   */
  async isUserManagementActive(): Promise<boolean> {
    const tab = await this.helpers.getAttribute(this.userManagementTab, 'aria-selected')
    return tab === 'true'
  }

  /**
   * Check if order management tab is active
   */
  async isOrderManagementActive(): Promise<boolean> {
    const tab = await this.helpers.getAttribute(this.orderManagementTab, 'aria-selected')
    return tab === 'true'
  }

  /**
   * Check if monitoring tab is active
   */
  async isMonitoringActive(): Promise<boolean> {
    const tab = await this.helpers.getAttribute(this.monitoringTab, 'aria-selected')
    return tab === 'true'
  }
}
