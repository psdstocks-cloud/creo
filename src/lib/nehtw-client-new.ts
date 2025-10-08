import axios, { AxiosResponse } from 'axios'

const NEHTW_BASE_URL = process.env.NEXT_PUBLIC_NEHTW_BASE_URL || 'https://nehtw.com/api'
const NEHTW_API_KEY = process.env.NEXT_PUBLIC_NEHTW_API_KEY

// Rate limiter class to enforce 2-second minimum between requests
class RateLimiter {
  private lastRequestTime = 0
  private readonly minInterval = 2000 // 2 seconds as per API docs

  async waitForRateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    this.lastRequestTime = Date.now()
  }
}

// Custom error class for NEHTW API errors
class NehtwAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'NehtwAPIError'
  }
}

interface NehtwResponse<T> {
  success: boolean
  data?: T
  error?: boolean
  message?: string
}

interface StockInfo {
  image: string
  title: string
  id: string
  source: string
  cost: number
  ext: string
  name: string
  author: string
  sizeInBytes: string
}

interface OrderResponse {
  success: boolean
  task_id: string
}

interface OrderStatus {
  success: boolean
  status: 'processing' | 'ready' | 'error'
}

interface DownloadLink {
  success: boolean
  status: 'downloading' | 'ready'
  downloadLink?: string
  fileName?: string
  linkType?: string
}

interface AIJobResponse {
  success: boolean
  job_id: string
  get_result_url: string
  message?: string
}

interface AIResult {
  __id: string
  prompt: string
  type: string
  cost: number
  status: 'processing' | 'completed' | 'failed'
  percentage_complete: number
  files?: Array<{
    index: number
    thumb_sm: string
    thumb_lg: string
    download: string
  }>
}

class NehtwClient {
  private client = axios.create({
    baseURL: NEHTW_BASE_URL,
    headers: {
      'X-Api-Key': NEHTW_API_KEY,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  })
  private rateLimiter = new RateLimiter()

  constructor() {
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          throw new NehtwAPIError('Invalid API key', 401)
        }
        if (error.response?.status === 429) {
          throw new NehtwAPIError('Rate limit exceeded', 429)
        }
        if (error.code === 'ECONNABORTED') {
          throw new NehtwAPIError('Request timeout', 408)
        }
        throw new NehtwAPIError(error.response?.data?.message || error.message)
      }
    )
  }

  // Stock Media Methods
  async getStockInfo(site: string, id: string, url?: string): Promise<StockInfo> {
    await this.rateLimiter.waitForRateLimit()
    
    const params = new URLSearchParams({ site, id })
    if (url) params.append('url', encodeURIComponent(url))
    
    const response: AxiosResponse<NehtwResponse<StockInfo>> = await this.client.get(
      `/stockinfo/${site}/${id}?${params.toString()}`
    )
    
    if (!response.data.success || !response.data.data) {
      throw new NehtwAPIError(response.data.message || 'Failed to get stock info')
    }
    
    return response.data.data
  }

  async createOrder(site: string, id: string, url?: string): Promise<string> {
    await this.rateLimiter.waitForRateLimit()
    
    const params = new URLSearchParams()
    if (url) params.append('url', encodeURIComponent(url))
    
    const response: AxiosResponse<OrderResponse> = await this.client.get(
      `/stockorder/${site}/${id}?${params.toString()}`
    )
    
    if (!response.data.success) {
      throw new NehtwAPIError('Failed to create order')
    }
    
    return response.data.task_id
  }

  async getOrderStatus(taskId: string, responseType: 'any' | 'gdrive' = 'any'): Promise<OrderStatus> {
    await this.rateLimiter.waitForRateLimit()
    
    const response: AxiosResponse<OrderStatus> = await this.client.get(
      `/order/${taskId}/status?responsetype=${responseType}`
    )
    
    return response.data
  }

  async getDownloadLink(taskId: string, responseType: 'any' | 'gdrive' | 'mydrivelink' | 'asia' = 'any'): Promise<DownloadLink> {
    await this.rateLimiter.waitForRateLimit()
    
    const response: AxiosResponse<DownloadLink> = await this.client.get(
      `/v2/order/${taskId}/download?responsetype=${responseType}`
    )
    
    return response.data
  }

  // AI Generation Methods
  async createAIJob(prompt: string): Promise<string> {
    await this.rateLimiter.waitForRateLimit()
    
    const response: AxiosResponse<AIJobResponse> = await this.client.post('/aig/create', {
      prompt,
    })
    
    if (!response.data.success) {
      throw new NehtwAPIError(response.data.message || 'Failed to create AI job')
    }
    
    return response.data.job_id
  }

  async getAIResult(jobId: string): Promise<AIResult> {
    await this.rateLimiter.waitForRateLimit()
    
    const response: AxiosResponse<AIResult> = await this.client.get(
      `/aig/public/${jobId}`
    )
    
    return response.data
  }

  async performAIAction(jobId: string, action: 'vary' | 'upscale', index: number, varyType?: 'subtle' | 'strong'): Promise<string> {
    await this.rateLimiter.waitForRateLimit()
    
    const payload: Record<string, unknown> = { job_id: jobId, action, index }
    if (action === 'vary' && varyType) {
      payload.vary_type = varyType
    }
    
    const response: AxiosResponse<AIJobResponse> = await this.client.post('/aig/actions', payload)
    
    if (!response.data.success) {
      throw new NehtwAPIError('Failed to perform AI action')
    }
    
    return response.data.job_id
  }

  // Account Methods
  async getBalance(): Promise<{ username: string; balance: number }> {
    await this.rateLimiter.waitForRateLimit()
    
    const response = await this.client.get('/me')
    
    if (!response.data.success) {
      throw new NehtwAPIError('Failed to get balance')
    }
    
    return {
      username: response.data.username,
      balance: response.data.balance,
    }
  }

  // Utility Methods
  async getStockSites(): Promise<Record<string, { active: boolean; price: number }>> {
    await this.rateLimiter.waitForRateLimit()
    
    const response = await this.client.get('/stocksites')
    return response.data
  }
}

export const nehtwClient = new NehtwClient()
export { NehtwAPIError }
