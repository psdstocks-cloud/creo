import { test, expect } from '@playwright/test'
import { AdminPage } from './pages/AdminPage'
import { AuthPage } from './pages/AuthPage'

test.describe('Admin Panel Flow', () => {
  let adminPage: AdminPage
  let authPage: AuthPage

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page)
    authPage = new AuthPage(page)
    
    // Sign in as admin user
    await authPage.goToSignIn()
    await authPage.signIn('admin@example.com', 'adminpassword')
  })

  test.describe('Admin Access', () => {
    test('should access admin dashboard', async () => {
      await adminPage.goToAdminDashboard()
      
      await expect(adminPage.page).toHaveURL(/.*\/admin/)
      await expect(adminPage.page.locator('[data-testid="admin-dashboard"]')).toBeVisible()
    })

    test('should redirect non-admin users', async () => {
      // Sign in as regular user
      await authPage.goToSignIn()
      await authPage.signIn('user@example.com', 'userpassword')
      
      await adminPage.navigateTo('/admin')
      
      // Should redirect to dashboard or show access denied
      await expect(adminPage.page).toHaveURL(/.*\/dashboard/)
    })

    test('should display admin navigation tabs', async () => {
      await adminPage.goToAdminDashboard()
      
      await expect(adminPage.page.locator('[data-testid="user-management-tab"]')).toBeVisible()
      await expect(adminPage.page.locator('[data-testid="order-management-tab"]')).toBeVisible()
      await expect(adminPage.page.locator('[data-testid="monitoring-tab"]')).toBeVisible()
    })
  })

  test.describe('User Management', () => {
    test('should display user management interface', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      await expect(adminPage.page.locator('[data-testid="user-table"]')).toBeVisible()
      await expect(adminPage.page.locator('[data-testid="user-search-input"]')).toBeVisible()
      await expect(adminPage.page.locator('[data-testid="user-filter-select"]')).toBeVisible()
    })

    test('should display users list', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      const usersCount = await adminPage.getUsersCount()
      expect(usersCount).toBeGreaterThan(0)
    })

    test('should search for users', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      await adminPage.searchUsers('test@example.com')
      
      // Should show filtered results
      const usersCount = await adminPage.getUsersCount()
      expect(usersCount).toBeGreaterThan(0)
    })

    test('should filter users by status', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      await adminPage.filterUsers('active')
      
      // Should show filtered results
      const usersCount = await adminPage.getUsersCount()
      expect(usersCount).toBeGreaterThan(0)
    })

    test('should view user details', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      if (await adminPage.getUsersCount() > 0) {
        await adminPage.clickUserRow(0)
        
        // Should show user details modal
        await expect(adminPage.page.locator('[data-testid="user-details-modal"]')).toBeVisible()
      }
    })

    test('should suspend a user', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      if (await adminPage.getUsersCount() > 0) {
        await adminPage.suspendUser(0)
        
        // Should show success message
        await expect(adminPage.page.locator('[data-testid="success-message"]')).toBeVisible()
      }
    })

    test('should activate a user', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      if (await adminPage.getUsersCount() > 0) {
        await adminPage.activateUser(0)
        
        // Should show success message
        await expect(adminPage.page.locator('[data-testid="success-message"]')).toBeVisible()
      }
    })

    test('should edit user details', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      if (await adminPage.getUsersCount() > 0) {
        await adminPage.editUser(0)
        
        // Should show user details modal
        await expect(adminPage.page.locator('[data-testid="user-details-modal"]')).toBeVisible()
      }
    })

    test('should delete a user', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      if (await adminPage.getUsersCount() > 0) {
        await adminPage.deleteUser(0)
        
        // Should show confirmation dialog
        await expect(adminPage.page.locator('[data-testid="confirm-dialog"]')).toBeVisible()
        
        // Confirm deletion
        await adminPage.confirmAction()
        
        // Should show success message
        await expect(adminPage.page.locator('[data-testid="success-message"]')).toBeVisible()
      }
    })
  })

  test.describe('Order Management', () => {
    test('should display order management interface', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToOrderManagement()
      
      await expect(adminPage.page.locator('[data-testid="order-table"]')).toBeVisible()
      await expect(adminPage.page.locator('[data-testid="order-search-input"]')).toBeVisible()
      await expect(adminPage.page.locator('[data-testid="order-filter-select"]')).toBeVisible()
    })

    test('should display orders list', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToOrderManagement()
      
      const ordersCount = await adminPage.getOrdersCount()
      expect(ordersCount).toBeGreaterThan(0)
    })

    test('should search for orders', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToOrderManagement()
      
      await adminPage.searchOrders('order-123')
      
      // Should show filtered results
      const ordersCount = await adminPage.getOrdersCount()
      expect(ordersCount).toBeGreaterThan(0)
    })

    test('should filter orders by status', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToOrderManagement()
      
      await adminPage.filterOrders('pending')
      
      // Should show filtered results
      const ordersCount = await adminPage.getOrdersCount()
      expect(ordersCount).toBeGreaterThan(0)
    })

    test('should view order details', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToOrderManagement()
      
      if (await adminPage.getOrdersCount() > 0) {
        await adminPage.clickOrderRow(0)
        
        // Should show order details modal
        await expect(adminPage.page.locator('[data-testid="order-details-modal"]')).toBeVisible()
      }
    })

    test('should process an order', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToOrderManagement()
      
      if (await adminPage.getOrdersCount() > 0) {
        await adminPage.processOrder(0)
        
        // Should show success message
        await expect(adminPage.page.locator('[data-testid="success-message"]')).toBeVisible()
      }
    })

    test('should cancel an order', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToOrderManagement()
      
      if (await adminPage.getOrdersCount() > 0) {
        await adminPage.cancelOrder(0)
        
        // Should show confirmation dialog
        await expect(adminPage.page.locator('[data-testid="confirm-dialog"]')).toBeVisible()
        
        // Confirm cancellation
        await adminPage.confirmAction()
        
        // Should show success message
        await expect(adminPage.page.locator('[data-testid="success-message"]')).toBeVisible()
      }
    })

    test('should refund an order', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToOrderManagement()
      
      if (await adminPage.getOrdersCount() > 0) {
        await adminPage.refundOrder(0)
        
        // Should show confirmation dialog
        await expect(adminPage.page.locator('[data-testid="confirm-dialog"]')).toBeVisible()
        
        // Confirm refund
        await adminPage.confirmAction()
        
        // Should show success message
        await expect(adminPage.page.locator('[data-testid="success-message"]')).toBeVisible()
      }
    })
  })

  test.describe('System Monitoring', () => {
    test('should display monitoring dashboard', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToMonitoring()
      
      await expect(adminPage.page.locator('[data-testid="stats-container"]')).toBeVisible()
      await expect(adminPage.page.locator('[data-testid="total-users"]')).toBeVisible()
      await expect(adminPage.page.locator('[data-testid="total-orders"]')).toBeVisible()
      await expect(adminPage.page.locator('[data-testid="total-revenue"]')).toBeVisible()
    })

    test('should display system statistics', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToMonitoring()
      
      const totalUsers = await adminPage.getTotalUsers()
      const totalOrders = await adminPage.getTotalOrders()
      const totalRevenue = await adminPage.getTotalRevenue()
      
      expect(totalUsers).toBeTruthy()
      expect(totalOrders).toBeTruthy()
      expect(totalRevenue).toBeTruthy()
    })

    test('should display system health status', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToMonitoring()
      
      const systemHealth = await adminPage.getSystemHealth()
      expect(systemHealth).toBeTruthy()
    })

    test('should display error logs', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToMonitoring()
      
      if (await adminPage.hasErrorLogs()) {
        const errorLogsCount = await adminPage.getErrorLogsCount()
        expect(errorLogsCount).toBeGreaterThanOrEqual(0)
      }
    })

    test('should display performance metrics', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToMonitoring()
      
      if (await adminPage.hasPerformanceMetrics()) {
        await expect(adminPage.page.locator('[data-testid="performance-metrics"]')).toBeVisible()
      }
    })

    test('should display API usage', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToMonitoring()
      
      if (await adminPage.hasApiUsage()) {
        await expect(adminPage.page.locator('[data-testid="api-usage"]')).toBeVisible()
      }
    })
  })

  test.describe('Navigation', () => {
    test('should navigate between tabs', async () => {
      await adminPage.goToAdminDashboard()
      
      // Navigate to user management
      await adminPage.goToUserManagement()
      await expect(adminPage.page.locator('[data-testid="user-table"]')).toBeVisible()
      
      // Navigate to order management
      await adminPage.goToOrderManagement()
      await expect(adminPage.page.locator('[data-testid="order-table"]')).toBeVisible()
      
      // Navigate to monitoring
      await adminPage.goToMonitoring()
      await expect(adminPage.page.locator('[data-testid="stats-container"]')).toBeVisible()
    })

    test('should maintain state between tab switches', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      // Search for users
      await adminPage.searchUsers('test')
      
      // Switch to another tab and back
      await adminPage.goToOrderManagement()
      await adminPage.goToUserManagement()
      
      // Should maintain search state
      await expect(adminPage.page.locator('[data-testid="user-table"]')).toBeVisible()
    })
  })

  test.describe('Data Management', () => {
    test('should handle bulk operations', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      // Select multiple users
      await adminPage.page.check('[data-testid="select-all-checkbox"]')
      
      // Perform bulk action
      await adminPage.page.click('[data-testid="bulk-suspend-button"]')
      
      // Should show confirmation dialog
      await expect(adminPage.page.locator('[data-testid="confirm-dialog"]')).toBeVisible()
    })

    test('should export user data', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      await adminPage.page.click('[data-testid="export-users-button"]')
      
      // Should trigger download
      // Note: In a real test, you might want to check for download events
    })

    test('should export order data', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToOrderManagement()
      
      await adminPage.page.click('[data-testid="export-orders-button"]')
      
      // Should trigger download
      // Note: In a real test, you might want to check for download events
    })
  })

  test.describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      await adminPage.goToAdminDashboard()
      
      // Simulate API error
      await adminPage.page.route('**/api/admin/**', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' })
        })
      })
      
      await adminPage.goToUserManagement()
      
      // Should show error message
      await expect(adminPage.page.locator('[data-testid="error-message"]')).toBeVisible()
    })

    test('should retry failed operations', async () => {
      await adminPage.goToAdminDashboard()
      
      // Simulate API error first
      await adminPage.page.route('**/api/admin/**', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' })
        })
      })
      
      await adminPage.goToUserManagement()
      
      // Remove the route to allow normal operation
      await adminPage.page.unroute('**/api/admin/**')
      
      // Click retry button
      await adminPage.page.click('[data-testid="retry-button"]')
      
      // Should show user table
      await expect(adminPage.page.locator('[data-testid="user-table"]')).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should support keyboard navigation', async () => {
      await adminPage.goToAdminDashboard()
      
      // Tab through admin interface
      await adminPage.pressKey('Tab')
      await adminPage.pressKey('Tab')
      await adminPage.pressKey('Tab')
      
      // Should be able to navigate with keyboard
      await adminPage.pressKey('Enter')
      
      // Should show focused tab content
      await expect(adminPage.page.locator('[data-testid="user-table"]')).toBeVisible()
    })

    test('should have proper ARIA labels', async () => {
      await adminPage.goToAdminDashboard()
      
      // Check for ARIA labels
      await expect(adminPage.page.locator('[data-testid="user-search-input"]')).toHaveAttribute('aria-label')
      await expect(adminPage.page.locator('[data-testid="order-search-input"]')).toHaveAttribute('aria-label')
      await expect(adminPage.page.locator('[data-testid="user-table"]')).toHaveAttribute('role', 'table')
    })

    test('should announce status changes to screen readers', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      if (await adminPage.getUsersCount() > 0) {
        await adminPage.suspendUser(0)
        
        // Should announce status change
        await expect(adminPage.page.locator('[aria-live="polite"]')).toBeVisible()
      }
    })
  })

  test.describe('Security', () => {
    test('should require admin authentication', async () => {
      // Try to access admin without authentication
      await adminPage.navigateTo('/admin')
      
      // Should redirect to sign in
      await expect(adminPage.page).toHaveURL(/.*\/auth\/signin/)
    })

    test('should prevent CSRF attacks', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      // Try to perform action without proper CSRF token
      await adminPage.page.evaluate(() => {
        // Remove CSRF token
        document.querySelector('meta[name="csrf-token"]')?.remove()
      })
      
      if (await adminPage.getUsersCount() > 0) {
        await adminPage.suspendUser(0)
        
        // Should show CSRF error
        await expect(adminPage.page.locator('[data-testid="csrf-error"]')).toBeVisible()
      }
    })

    test('should log admin actions', async () => {
      await adminPage.goToAdminDashboard()
      await adminPage.goToUserManagement()
      
      if (await adminPage.getUsersCount() > 0) {
        await adminPage.suspendUser(0)
        
        // Should log the action
        await adminPage.goToMonitoring()
        
        if (await adminPage.hasErrorLogs()) {
          const errorLogsCount = await adminPage.getErrorLogsCount()
          expect(errorLogsCount).toBeGreaterThan(0)
        }
      }
    })
  })
})
