import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class AIGenerationPage extends BasePage {
  // Selectors
  private promptInput = '[data-testid="prompt-input"]'
  private generateButton = '[data-testid="generate-button"]'
  private styleSelect = '[data-testid="style-select"]'
  private sizeSelect = '[data-testid="size-select"]'
  private qualitySelect = '[data-testid="quality-select"]'
  private aspectRatioSelect = '[data-testid="aspect-ratio-select"]'
  private negativePromptInput = '[data-testid="negative-prompt-input"]'
  private seedInput = '[data-testid="seed-input"]'
  private stepsSlider = '[data-testid="steps-slider"]'
  private guidanceSlider = '[data-testid="guidance-slider"]'
  private generationContainer = '[data-testid="generation-container"]'
  private generatedImage = '[data-testid="generated-image"]'
  private generationProgress = '[data-testid="generation-progress"]'
  private generationStatus = '[data-testid="generation-status"]'
  private downloadButton = '[data-testid="download-button"]'
  private regenerateButton = '[data-testid="regenerate-button"]'
  private saveButton = '[data-testid="save-button"]'
  private shareButton = '[data-testid="share-button"]'
  private historyButton = '[data-testid="history-button"]'
  private creditsDisplay = '[data-testid="credits-display"]'
  private costDisplay = '[data-testid="cost-display"]'
  private generationHistory = '[data-testid="generation-history"]'
  private historyItem = '[data-testid="history-item"]'
  private presetButton = '[data-testid="preset-button"]'
  private presetModal = '[data-testid="preset-modal"]'
  private presetItem = '[data-testid="preset-item"]'
  private advancedSettingsButton = '[data-testid="advanced-settings-button"]'
  private advancedSettingsPanel = '[data-testid="advanced-settings-panel"]'

  constructor(page: Page) {
    super(page)
  }

  /**
   * Navigate to AI generation page
   */
  async goToAIGeneration() {
    await this.navigateTo('/ai-generation')
  }

  /**
   * Generate an image with a prompt
   */
  async generateImage(prompt: string, options?: {
    style?: string
    size?: string
    quality?: string
    aspectRatio?: string
    negativePrompt?: string
    seed?: string
    steps?: number
    guidance?: number
  }) {
    await this.fill(this.promptInput, prompt)
    
    if (options?.style) {
      await this.helpers.selectOption(this.styleSelect, options.style)
    }
    
    if (options?.size) {
      await this.helpers.selectOption(this.sizeSelect, options.size)
    }
    
    if (options?.quality) {
      await this.helpers.selectOption(this.qualitySelect, options.quality)
    }
    
    if (options?.aspectRatio) {
      await this.helpers.selectOption(this.aspectRatioSelect, options.aspectRatio)
    }
    
    if (options?.negativePrompt) {
      await this.fill(this.negativePromptInput, options.negativePrompt)
    }
    
    if (options?.seed) {
      await this.fill(this.seedInput, options.seed)
    }
    
    if (options?.steps) {
      await this.page.fill(this.stepsSlider, options.steps.toString())
    }
    
    if (options?.guidance) {
      await this.page.fill(this.guidanceSlider, options.guidance.toString())
    }
    
    await this.click(this.generateButton)
    await this.waitForGenerationComplete()
  }

  /**
   * Get prompt input value
   */
  async getPromptValue(): Promise<string> {
    return await this.helpers.getAttribute(this.promptInput, 'value') || ''
  }

  /**
   * Clear prompt input
   */
  async clearPrompt() {
    await this.helpers.clearField(this.promptInput)
  }

  /**
   * Check if prompt input is visible
   */
  async isPromptInputVisible(): Promise<boolean> {
    return await this.helpers.isVisible(this.promptInput)
  }

  /**
   * Check if generate button is visible
   */
  async isGenerateButtonVisible(): Promise<boolean> {
    return await this.helpers.isVisible(this.generateButton)
  }

  /**
   * Check if generate button is disabled
   */
  async isGenerateButtonDisabled(): Promise<boolean> {
    return await this.helpers.getProperty(this.generateButton, 'disabled')
  }

  /**
   * Wait for generation to complete
   */
  async waitForGenerationComplete() {
    await this.helpers.waitForElementHidden(this.generationProgress)
  }

  /**
   * Check if generation is in progress
   */
  async isGenerating(): Promise<boolean> {
    return await this.helpers.isVisible(this.generationProgress)
  }

  /**
   * Get generation status
   */
  async getGenerationStatus(): Promise<string> {
    if (await this.helpers.isVisible(this.generationStatus)) {
      return await this.getText(this.generationStatus)
    }
    return ''
  }

  /**
   * Check if generated image is visible
   */
  async hasGeneratedImage(): Promise<boolean> {
    return await this.helpers.isVisible(this.generatedImage)
  }

  /**
   * Get generated image count
   */
  async getGeneratedImageCount(): Promise<number> {
    return await this.page.locator(this.generatedImage).count()
  }

  /**
   * Download generated image
   */
  async downloadImage(index: number = 0) {
    const downloadButtons = await this.page.locator(this.downloadButton).all()
    if (downloadButtons[index]) {
      await downloadButtons[index].click()
    }
  }

  /**
   * Regenerate image
   */
  async regenerateImage() {
    await this.click(this.regenerateButton)
    await this.waitForGenerationComplete()
  }

  /**
   * Save generated image
   */
  async saveImage(index: number = 0) {
    const saveButtons = await this.page.locator(this.saveButton).all()
    if (saveButtons[index]) {
      await saveButtons[index].click()
    }
  }

  /**
   * Share generated image
   */
  async shareImage(index: number = 0) {
    const shareButtons = await this.page.locator(this.shareButton).all()
    if (shareButtons[index]) {
      await shareButtons[index].click()
    }
  }

  /**
   * Open generation history
   */
  async openHistory() {
    await this.click(this.historyButton)
    await this.helpers.waitForElement(this.generationHistory)
  }

  /**
   * Check if generation history is visible
   */
  async hasGenerationHistory(): Promise<boolean> {
    return await this.helpers.isVisible(this.generationHistory)
  }

  /**
   * Get history items count
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
   * Get current credits
   */
  async getCredits(): Promise<string> {
    if (await this.helpers.isVisible(this.creditsDisplay)) {
      return await this.getText(this.creditsDisplay)
    }
    return ''
  }

  /**
   * Get generation cost
   */
  async getGenerationCost(): Promise<string> {
    if (await this.helpers.isVisible(this.costDisplay)) {
      return await this.getText(this.costDisplay)
    }
    return ''
  }

  /**
   * Open presets modal
   */
  async openPresets() {
    await this.click(this.presetButton)
    await this.helpers.waitForElement(this.presetModal)
  }

  /**
   * Check if presets modal is visible
   */
  async hasPresetsModal(): Promise<boolean> {
    return await this.helpers.isVisible(this.presetModal)
  }

  /**
   * Select a preset
   */
  async selectPreset(index: number) {
    const presets = await this.page.locator(this.presetItem).all()
    if (presets[index]) {
      await presets[index].click()
    }
  }

  /**
   * Get presets count
   */
  async getPresetsCount(): Promise<number> {
    return await this.page.locator(this.presetItem).count()
  }

  /**
   * Open advanced settings
   */
  async openAdvancedSettings() {
    await this.click(this.advancedSettingsButton)
    await this.helpers.waitForElement(this.advancedSettingsPanel)
  }

  /**
   * Check if advanced settings panel is visible
   */
  async hasAdvancedSettings(): Promise<boolean> {
    return await this.helpers.isVisible(this.advancedSettingsPanel)
  }

  /**
   * Close advanced settings
   */
  async closeAdvancedSettings() {
    await this.click(this.advancedSettingsButton)
    await this.helpers.waitForElementHidden(this.advancedSettingsPanel)
  }

  /**
   * Set negative prompt
   */
  async setNegativePrompt(prompt: string) {
    await this.fill(this.negativePromptInput, prompt)
  }

  /**
   * Get negative prompt value
   */
  async getNegativePromptValue(): Promise<string> {
    return await this.helpers.getAttribute(this.negativePromptInput, 'value') || ''
  }

  /**
   * Set seed value
   */
  async setSeed(seed: string) {
    await this.fill(this.seedInput, seed)
  }

  /**
   * Get seed value
   */
  async getSeedValue(): Promise<string> {
    return await this.helpers.getAttribute(this.seedInput, 'value') || ''
  }

  /**
   * Set generation steps
   */
  async setSteps(steps: number) {
    await this.page.fill(this.stepsSlider, steps.toString())
  }

  /**
   * Get generation steps
   */
  async getSteps(): Promise<number> {
    const value = await this.helpers.getAttribute(this.stepsSlider, 'value')
    return parseInt(value || '20')
  }

  /**
   * Set guidance scale
   */
  async setGuidance(guidance: number) {
    await this.page.fill(this.guidanceSlider, guidance.toString())
  }

  /**
   * Get guidance scale
   */
  async getGuidance(): Promise<number> {
    const value = await this.helpers.getAttribute(this.guidanceSlider, 'value')
    return parseFloat(value || '7.5')
  }

  /**
   * Get current style
   */
  async getStyle(): Promise<string> {
    return await this.helpers.getAttribute(this.styleSelect, 'value') || ''
  }

  /**
   * Get current size
   */
  async getSize(): Promise<string> {
    return await this.helpers.getAttribute(this.sizeSelect, 'value') || ''
  }

  /**
   * Get current quality
   */
  async getQuality(): Promise<string> {
    return await this.helpers.getAttribute(this.qualitySelect, 'value') || ''
  }

  /**
   * Get current aspect ratio
   */
  async getAspectRatio(): Promise<string> {
    return await this.helpers.getAttribute(this.aspectRatioSelect, 'value') || ''
  }

  /**
   * Check if generation container is visible
   */
  async hasGenerationContainer(): Promise<boolean> {
    return await this.helpers.isVisible(this.generationContainer)
  }

  /**
   * Wait for generation to start
   */
  async waitForGenerationStart() {
    await this.helpers.waitForElement(this.generationProgress)
  }

  /**
   * Check if generation failed
   */
  async hasGenerationError(): Promise<boolean> {
    return await this.helpers.isVisible('[data-testid="generation-error"]')
  }

  /**
   * Get generation error message
   */
  async getGenerationError(): Promise<string> {
    if (await this.hasGenerationError()) {
      return await this.getText('[data-testid="generation-error"]')
    }
    return ''
  }
}
