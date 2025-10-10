import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class StockSearchPage extends BasePage {
  // Selectors
  private searchInput = '[data-testid="search-input"]'
  private searchButton = '[data-testid="search-button"]'
  private filtersButton = '[data-testid="filters-button"]'
  private sortSelect = '[data-testid="sort-select"]'
  private viewToggle = '[data-testid="view-toggle"]'
  private resultsContainer = '[data-testid="results-container"]'
  private resultItems = '[data-testid="result-item"]'
  private loadMoreButton = '[data-testid="load-more-button"]'
  private noResultsMessage = '[data-testid="no-results-message"]'
  private searchSuggestions = '[data-testid="search-suggestions"]'
  private suggestionItem = '[data-testid="suggestion-item"]'
  private filtersPanel = '[data-testid="filters-panel"]'
  private categoryFilter = '[data-testid="category-filter"]'
  private orientationFilter = '[data-testid="orientation-filter"]'
  private colorFilter = '[data-testid="color-filter"]'
  private dateFilter = '[data-testid="date-filter"]'
  private applyFiltersButton = '[data-testid="apply-filters-button"]'
  private clearFiltersButton = '[data-testid="clear-filters-button"]'
  private savedSearchesButton = '[data-testid="saved-searches-button"]'
  private saveSearchButton = '[data-testid="save-search-button"]'
  private searchHistory = '[data-testid="search-history"]'
  private historyItem = '[data-testid="history-item"]'

  constructor(page: Page) {
    super(page)
  }

  /**
   * Navigate to stock search page
   */
  async goToStockSearch() {
    await this.navigateTo('/stock-search')
  }

  /**
   * Perform a search
   */
  async search(query: string) {
    await this.fill(this.searchInput, query)
    await this.click(this.searchButton)
    await this.waitForLoadingComplete()
  }

  /**
   * Search with Enter key
   */
  async searchWithEnter(query: string) {
    await this.fill(this.searchInput, query)
    await this.pressKey('Enter')
    await this.waitForLoadingComplete()
  }

  /**
   * Get search input value
   */
  async getSearchValue(): Promise<string> {
    return await this.helpers.getAttribute(this.searchInput, 'value') || ''
  }

  /**
   * Clear search input
   */
  async clearSearch() {
    await this.helpers.clearField(this.searchInput)
  }

  /**
   * Check if search input is visible
   */
  async isSearchInputVisible(): Promise<boolean> {
    return await this.helpers.isVisible(this.searchInput)
  }

  /**
   * Check if search button is visible
   */
  async isSearchButtonVisible(): Promise<boolean> {
    return await this.helpers.isVisible(this.searchButton)
  }

  /**
   * Check if search button is disabled
   */
  async isSearchButtonDisabled(): Promise<boolean> {
    return await this.helpers.getProperty(this.searchButton, 'disabled')
  }

  /**
   * Open filters panel
   */
  async openFilters() {
    await this.click(this.filtersButton)
    await this.helpers.waitForElement(this.filtersPanel)
  }

  /**
   * Close filters panel
   */
  async closeFilters() {
    await this.click(this.filtersButton)
    await this.helpers.waitForElementHidden(this.filtersPanel)
  }

  /**
   * Check if filters panel is visible
   */
  async isFiltersPanelVisible(): Promise<boolean> {
    return await this.helpers.isVisible(this.filtersPanel)
  }

  /**
   * Apply filters
   */
  async applyFilters(filters: {
    category?: string
    orientation?: string
    color?: string
    date?: string
  }) {
    await this.openFilters()
    
    if (filters.category) {
      await this.helpers.selectOption(this.categoryFilter, filters.category)
    }
    
    if (filters.orientation) {
      await this.helpers.selectOption(this.orientationFilter, filters.orientation)
    }
    
    if (filters.color) {
      await this.helpers.selectOption(this.colorFilter, filters.color)
    }
    
    if (filters.date) {
      await this.helpers.selectOption(this.dateFilter, filters.date)
    }
    
    await this.click(this.applyFiltersButton)
    await this.waitForLoadingComplete()
  }

  /**
   * Clear all filters
   */
  async clearFilters() {
    await this.openFilters()
    await this.click(this.clearFiltersButton)
    await this.waitForLoadingComplete()
  }

  /**
   * Sort results
   */
  async sortResults(sortBy: string) {
    await this.helpers.selectOption(this.sortSelect, sortBy)
    await this.waitForLoadingComplete()
  }

  /**
   * Toggle view mode
   */
  async toggleView() {
    await this.click(this.viewToggle)
  }

  /**
   * Load more results
   */
  async loadMore() {
    await this.click(this.loadMoreButton)
    await this.waitForLoadingComplete()
  }

  /**
   * Check if load more button is visible
   */
  async isLoadMoreButtonVisible(): Promise<boolean> {
    return await this.helpers.isVisible(this.loadMoreButton)
  }

  /**
   * Get number of results
   */
  async getResultsCount(): Promise<number> {
    const items = await this.page.locator(this.resultItems).count()
    return items
  }

  /**
   * Check if results are visible
   */
  async hasResults(): Promise<boolean> {
    return await this.helpers.isVisible(this.resultItems)
  }

  /**
   * Check if no results message is visible
   */
  async hasNoResults(): Promise<boolean> {
    return await this.helpers.isVisible(this.noResultsMessage)
  }

  /**
   * Get no results message
   */
  async getNoResultsMessage(): Promise<string> {
    if (await this.hasNoResults()) {
      return await this.getText(this.noResultsMessage)
    }
    return ''
  }

  /**
   * Click on a result item
   */
  async clickResultItem(index: number) {
    const items = await this.page.locator(this.resultItems).all()
    if (items[index]) {
      await items[index].click()
    }
  }

  /**
   * Get result item text
   */
  async getResultItemText(index: number): Promise<string> {
    const items = await this.page.locator(this.resultItems).all()
    if (items[index]) {
      return await items[index].textContent() || ''
    }
    return ''
  }

  /**
   * Check if search suggestions are visible
   */
  async hasSearchSuggestions(): Promise<boolean> {
    return await this.helpers.isVisible(this.searchSuggestions)
  }

  /**
   * Get search suggestions count
   */
  async getSuggestionsCount(): Promise<number> {
    return await this.page.locator(this.suggestionItem).count()
  }

  /**
   * Click on a search suggestion
   */
  async clickSuggestion(index: number) {
    const suggestions = await this.page.locator(this.suggestionItem).all()
    if (suggestions[index]) {
      await suggestions[index].click()
    }
  }

  /**
   * Open saved searches
   */
  async openSavedSearches() {
    await this.click(this.savedSearchesButton)
  }

  /**
   * Save current search
   */
  async saveSearch(name: string) {
    await this.click(this.saveSearchButton)
    // Handle save search modal if it appears
    const saveModal = '[data-testid="save-search-modal"]'
    if (await this.helpers.isVisible(saveModal)) {
      await this.fill('[data-testid="search-name-input"]', name)
      await this.click('[data-testid="save-button"]')
    }
  }

  /**
   * Check if search history is visible
   */
  async hasSearchHistory(): Promise<boolean> {
    return await this.helpers.isVisible(this.searchHistory)
  }

  /**
   * Get search history count
   */
  async getHistoryCount(): Promise<number> {
    return await this.page.locator(this.historyItem).count()
  }

  /**
   * Click on a history item
   */
  async clickHistoryItem(index: number) {
    const items = await this.page.locator(this.historyItem).all()
    if (items[index]) {
      await items[index].click()
    }
  }

  /**
   * Wait for search to complete
   */
  async waitForSearchComplete() {
    await this.helpers.waitForElementHidden(this.loadingSpinner)
  }

  /**
   * Check if search is loading
   */
  async isSearchLoading(): Promise<boolean> {
    return await this.helpers.isVisible(this.loadingSpinner)
  }

  /**
   * Get current sort value
   */
  async getSortValue(): Promise<string> {
    return await this.helpers.getAttribute(this.sortSelect, 'value') || ''
  }

  /**
   * Get current view mode
   */
  async getViewMode(): Promise<string> {
    const isGrid = await this.helpers.getAttribute(this.viewToggle, 'data-view')
    return isGrid || 'grid'
  }

  /**
   * Check if filters are applied
   */
  async hasActiveFilters(): Promise<boolean> {
    const clearButton = await this.helpers.isVisible(this.clearFiltersButton)
    return clearButton
  }

  /**
   * Get active filters count
   */
  async getActiveFiltersCount(): Promise<number> {
    const activeFilters = await this.page.locator('[data-testid="active-filter"]').count()
    return activeFilters
  }
}
