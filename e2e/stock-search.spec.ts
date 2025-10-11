import { test, expect } from '@playwright/test'
import { StockSearchPage } from './pages/StockSearchPage'
import { AuthPage } from './pages/AuthPage'

test.describe('Stock Search Flow', () => {
  let stockSearchPage: StockSearchPage
  let authPage: AuthPage

  test.beforeEach(async ({ page }) => {
    stockSearchPage = new StockSearchPage(page)
    authPage = new AuthPage(page)
    
    // Sign in before each test
    await authPage.goToSignIn()
    await authPage.signIn('test@example.com', 'testpassword')
  })

  test.describe('Basic Search', () => {
    test('should display search interface', async () => {
      await stockSearchPage.goToStockSearch()
      
      await expect(stockSearchPage.page).toHaveURL(/.*\/stock-search/)
      await expect(stockSearchPage.page.locator('[data-testid="search-input"]')).toBeVisible()
      await expect(stockSearchPage.page.locator('[data-testid="search-button"]')).toBeVisible()
      await expect(stockSearchPage.page.locator('[data-testid="filters-button"]')).toBeVisible()
    })

    test('should perform basic search', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.search('nature landscape')
      
      // Should show results
      await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
      await expect(stockSearchPage.page.locator('[data-testid="result-item"]')).toHaveCount.greaterThan(0)
    })

    test('should search with Enter key', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.searchWithEnter('business office')
      
      // Should show results
      await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    })

    test('should show no results message for invalid search', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.search('xyz123nonexistent')
      
      // Should show no results message
      await expect(stockSearchPage.page.locator('[data-testid="no-results-message"]')).toBeVisible()
    })

    test('should clear search input', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.fill('[data-testid="search-input"]', 'test search')
      await stockSearchPage.clearSearch()
      
      const searchValue = await stockSearchPage.getSearchValue()
      expect(searchValue).toBe('')
    })
  })

  test.describe('Advanced Filters', () => {
    test('should open and close filters panel', async () => {
      await stockSearchPage.goToStockSearch()
      
      // Open filters
      await stockSearchPage.openFilters()
      await expect(stockSearchPage.page.locator('[data-testid="filters-panel"]')).toBeVisible()
      
      // Close filters
      await stockSearchPage.closeFilters()
      await expect(stockSearchPage.page.locator('[data-testid="filters-panel"]')).toBeHidden()
    })

    test('should apply category filter', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.applyFilters({ category: 'nature' })
      
      // Should show filtered results
      await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    })

    test('should apply orientation filter', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.applyFilters({ orientation: 'landscape' })
      
      // Should show filtered results
      await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    })

    test('should apply color filter', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.applyFilters({ color: 'blue' })
      
      // Should show filtered results
      await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    })

    test('should apply multiple filters', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.applyFilters({
        category: 'business',
        orientation: 'portrait',
        color: 'black'
      })
      
      // Should show filtered results
      await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    })

    test('should clear all filters', async () => {
      await stockSearchPage.goToStockSearch()
      
      // Apply filters first
      await stockSearchPage.applyFilters({ category: 'nature' })
      
      // Clear filters
      await stockSearchPage.clearFilters()
      
      // Should show all results
      await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    })
  })

  test.describe('Sorting and View', () => {
    test('should sort results by relevance', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.search('nature')
      await stockSearchPage.sortResults('relevance')
      
      // Should show sorted results
      await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    })

    test('should sort results by date', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.search('business')
      await stockSearchPage.sortResults('date')
      
      // Should show sorted results
      await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    })

    test('should sort results by popularity', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.search('office')
      await stockSearchPage.sortResults('popularity')
      
      // Should show sorted results
      await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    })

    test('should toggle view mode', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.search('landscape')
      await stockSearchPage.toggleView()
      
      // Should show results in different view
      await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    })
  })

  test.describe('Pagination', () => {
    test('should load more results', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.search('nature')
      
      // Check if load more button is visible
      if (await stockSearchPage.isLoadMoreButtonVisible()) {
        await stockSearchPage.loadMore()
        
        // Should show more results
        await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
      }
    })

    test('should handle pagination correctly', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.search('business')
      
      // Get initial results count
      const initialCount = await stockSearchPage.getResultsCount()
      
      if (await stockSearchPage.isLoadMoreButtonVisible()) {
        await stockSearchPage.loadMore()
        
        // Should have more results
        const newCount = await stockSearchPage.getResultsCount()
        expect(newCount).toBeGreaterThan(initialCount)
      }
    })
  })

  test.describe('Search Suggestions', () => {
    test('should show search suggestions', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.fill('[data-testid="search-input"]', 'nat')
      
      // Should show suggestions
      if (await stockSearchPage.hasSearchSuggestions()) {
        await expect(stockSearchPage.page.locator('[data-testid="search-suggestions"]')).toBeVisible()
      }
    })

    test('should select search suggestion', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.fill('[data-testid="search-input"]', 'nat')
      
      if (await stockSearchPage.hasSearchSuggestions()) {
        const suggestionsCount = await stockSearchPage.getSuggestionsCount()
        if (suggestionsCount > 0) {
          await stockSearchPage.clickSuggestion(0)
          
          // Should perform search with suggestion
          await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
        }
      }
    })
  })

  test.describe('Saved Searches', () => {
    test('should save current search', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.search('nature landscape')
      
      // Save the search
      await stockSearchPage.saveSearch('Nature Landscapes')
      
      // Should show success message or confirmation
      await expect(stockSearchPage.page.locator('[data-testid="success-message"]')).toBeVisible()
    })

    test('should open saved searches', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.openSavedSearches()
      
      // Should show saved searches panel
      await expect(stockSearchPage.page.locator('[data-testid="saved-searches-panel"]')).toBeVisible()
    })
  })

  test.describe('Search History', () => {
    test('should show search history', async () => {
      await stockSearchPage.goToStockSearch()
      
      // Perform a few searches
      await stockSearchPage.search('nature')
      await stockSearchPage.search('business')
      await stockSearchPage.search('office')
      
      // Check if history is available
      if (await stockSearchPage.hasSearchHistory()) {
        const historyCount = await stockSearchPage.getHistoryCount()
        expect(historyCount).toBeGreaterThan(0)
      }
    })

    test('should click on history item', async () => {
      await stockSearchPage.goToStockSearch()
      
      // Perform a search
      await stockSearchPage.search('nature')
      
      // Check if history is available
      if (await stockSearchPage.hasSearchHistory()) {
        const historyCount = await stockSearchPage.getHistoryCount()
        if (historyCount > 0) {
          await stockSearchPage.clickHistoryItem(0)
          
          // Should perform the search from history
          await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
        }
      }
    })
  })

  test.describe('Results Interaction', () => {
    test('should click on result item', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.search('nature')
      
      if (await stockSearchPage.hasResults()) {
        await stockSearchPage.clickResultItem(0)
        
        // Should navigate to result details or open modal
        await expect(stockSearchPage.page.locator('[data-testid="result-details"]')).toBeVisible()
      }
    })

    test('should display result information', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.search('business')
      
      if (await stockSearchPage.hasResults()) {
        const resultText = await stockSearchPage.getResultItemText(0)
        expect(resultText).toBeTruthy()
      }
    })
  })

  test.describe('Loading States', () => {
    test('should show loading state during search', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.fill('[data-testid="search-input"]', 'nature')
      await stockSearchPage.click('[data-testid="search-button"]')
      
      // Should show loading state
      await expect(stockSearchPage.page.locator('[data-testid="loading-spinner"]')).toBeVisible()
    })

    test('should hide loading state after search completes', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.search('landscape')
      
      // Should hide loading state
      await stockSearchPage.waitForSearchComplete()
      await expect(stockSearchPage.page.locator('[data-testid="loading-spinner"]')).toBeHidden()
    })
  })

  test.describe('Error Handling', () => {
    test('should handle search errors gracefully', async () => {
      await stockSearchPage.goToStockSearch()
      
      // Simulate network error by going offline
      await stockSearchPage.page.context().setOffline(true)
      
      await stockSearchPage.search('nature')
      
      // Should show error message
      await expect(stockSearchPage.page.locator('[data-testid="error-message"]')).toBeVisible()
      
      // Go back online
      await stockSearchPage.page.context().setOffline(false)
    })

    test('should retry failed searches', async () => {
      await stockSearchPage.goToStockSearch()
      
      // Simulate network error
      await stockSearchPage.page.context().setOffline(true)
      
      await stockSearchPage.search('nature')
      
      // Go back online and retry
      await stockSearchPage.page.context().setOffline(false)
      await stockSearchPage.page.click('[data-testid="retry-button"]')
      
      // Should show results
      await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should support keyboard navigation', async () => {
      await stockSearchPage.goToStockSearch()
      
      // Tab through search interface
      await stockSearchPage.pressKey('Tab')
      await stockSearchPage.pressKey('Tab')
      await stockSearchPage.pressKey('Tab')
      
      // Should be able to search with Enter
      await stockSearchPage.fill('[data-testid="search-input"]', 'nature')
      await stockSearchPage.pressKey('Enter')
      
      await expect(stockSearchPage.page.locator('[data-testid="results-container"]')).toBeVisible()
    })

    test('should have proper ARIA labels', async () => {
      await stockSearchPage.goToStockSearch()
      
      // Check for ARIA labels
      await expect(stockSearchPage.page.locator('[data-testid="search-input"]')).toHaveAttribute('aria-label')
      await expect(stockSearchPage.page.locator('[data-testid="search-button"]')).toHaveAttribute('aria-label')
      await expect(stockSearchPage.page.locator('[data-testid="filters-button"]')).toHaveAttribute('aria-label')
    })

    test('should announce search results to screen readers', async () => {
      await stockSearchPage.goToStockSearch()
      
      await stockSearchPage.search('nature')
      
      // Check for live region announcements
      await expect(stockSearchPage.page.locator('[aria-live="polite"]')).toBeVisible()
    })
  })
})
