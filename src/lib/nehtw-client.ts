import axios, { AxiosResponse } from 'axios'
import {
  StockInfo,
  OrderRequest,
  OrderResponse,
  OrderStatus,
  DownloadLink,
  AIGenerationRequest,
  AIGenerationResponse,
  AIGenerationJob,
  AccountBalance,
  StockSitesResponse,
} from '../types/nehtw'

const NEHTW_BASE_URL = process.env.NEXT_PUBLIC_NEHTW_BASE_URL || 'https://nehtw.com/api'
const NEHTW_API_KEY = process.env.NEXT_PUBLIC_NEHTW_API_KEY

interface NehtwResponse<T> {
  success: boolean
  data?: T
  error?: boolean
  message?: string
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

  // Stock Media Methods
  async getStockInfo(site: string, id: string, url?: string): Promise<StockInfo> {
    const params = new URLSearchParams({ site, id })
    if (url) params.append('url', encodeURIComponent(url))
    
    const response: AxiosResponse<NehtwResponse<{
      image: string
      title: string
      id: string
      source: string
      cost: number
      ext: string
      name: string
      author: string
      sizeInBytes: string
    }>> = await this.client.get(
      `/stockinfo/${site}/${id}?${params.toString()}`
    )
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to get stock info')
    }
    
    const apiData = response.data.data
    
    // Transform API response to StockInfo format
    return {
      id: apiData.id,
      title: apiData.title,
      description: apiData.title,
      url: apiData.image,
      thumbnail: apiData.image,
      type: 'image' as const,
      category: 'stock',
      tags: [],
      keywords: [],
      size: parseInt(apiData.sizeInBytes) || 0,
      format: apiData.ext,
      quality: 'high' as const,
      license_type: 'royalty_free' as const,
      usage_rights: {
        commercial: true,
        editorial: true,
        print: true,
        web: true,
        social_media: true,
        unlimited: false,
      },
      attribution_required: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      site: {
        id: apiData.source,
        name: apiData.source,
        url: `https://${apiData.source}.com`,
      },
      contributor: {
        id: apiData.author || 'unknown',
        name: apiData.author || 'Unknown Author',
      },
      pricing: {
        credits: Math.ceil(apiData.cost * 10),
        currency: 'USD',
        price: apiData.cost,
      },
      statistics: {
        views: 0,
        downloads: 0,
        likes: 0,
        rating: 0,
      },
      metadata: {
        file_size_mb: parseFloat(apiData.sizeInBytes) / (1024 * 1024) || 0,
      },
    }
  }

  async createOrder(site: string, id: string, url?: string): Promise<string> {
    const params = new URLSearchParams()
    if (url) params.append('url', encodeURIComponent(url))
    
    const response: AxiosResponse<{ success: boolean; task_id: string; message?: string }> = await this.client.get(
      `/stockorder/${site}/${id}?${params.toString()}`
    )
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create order')
    }
    
    return response.data.task_id
  }

  async getOrderStatus(taskId: string, responseType: 'any' | 'gdrive' = 'any'): Promise<OrderStatus> {
    const response: AxiosResponse<{ success: boolean; status: 'processing' | 'ready' | 'error' }> = await this.client.get(
      `/order/${taskId}/status?responsetype=${responseType}`
    )
    
    // Transform API response to match OrderStatus interface
    return {
      order_id: taskId,
      status: response.data.status === 'ready' ? 'completed' : 
              response.data.status === 'error' ? 'failed' : 'processing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  async getDownloadLink(taskId: string, responseType: 'any' | 'gdrive' | 'mydrivelink' | 'asia' = 'any'): Promise<DownloadLink> {
    const response: AxiosResponse<DownloadLink> = await this.client.get(
      `/v2/order/${taskId}/download?responsetype=${responseType}`
    )
    
    return response.data
  }

  // AI Generation Methods
  async createAIJob(prompt: string): Promise<string> {
    const response: AxiosResponse<{ success: boolean; job_id: string; message?: string }> = await this.client.post('/aig/create', {
      prompt,
    })
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create AI job')
    }
    
    return response.data.job_id
  }

  async getAIResult(jobId: string): Promise<AIGenerationJob> {
    const response: AxiosResponse<{
      job_id: string;
      status: 'pending' | 'processing' | 'completed' | 'failed';
      percentage_complete: number;
      files?: Array<{
        index: number;
        thumb_sm: string;
        thumb_lg: string;
        download: string;
      }>;
    }> = await this.client.get(
      `/aig/public/${jobId}`
    )
    
    // Transform API response to AIGenerationJob format
    return {
      job_id: response.data.job_id,
      status: response.data.status,
      prompt: 'AI generated image',
      progress: response.data.percentage_complete,
      result: response.data.files ? {
        images: response.data.files.map(file => ({
          id: file.index.toString(),
          url: file.thumb_lg,
          thumbnail_url: file.thumb_sm,
          filename: `generated_${file.index}.jpg`,
          size: 0,
          dimensions: { width: 512, height: 512 },
          format: 'jpg',
          quality: 'high',
          metadata: {
            prompt: 'AI generated image',
            seed: Math.floor(Math.random() * 1000000),
            model: 'stable-diffusion',
            generation_time: 30,
          },
        })),
        generation_time: 30,
        model_used: 'stable-diffusion',
        parameters: {
          style: 'realistic',
          size: '512x512',
          steps: 20,
          guidance_scale: 7.5,
          seed: Math.floor(Math.random() * 1000000),
        },
      } : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  async performAIAction(jobId: string, action: 'vary' | 'upscale', index: number, varyType?: 'subtle' | 'strong'): Promise<string> {
    const payload: Record<string, unknown> = { job_id: jobId, action, index }
    if (action === 'vary' && varyType) {
      payload.vary_type = varyType
    }
    
    const response: AxiosResponse<{ success: boolean; job_id: string; message?: string }> = await this.client.post('/aig/actions', payload)
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to perform AI action')
    }
    
    return response.data.job_id
  }

  // Account Methods
  async getBalance(): Promise<AccountBalance> {
    const response = await this.client.get('/me')
    
    if (!response.data.success) {
      throw new Error('Failed to get balance')
    }
    
    const apiData = response.data
    
    return {
      user_id: apiData.username || 'unknown',
      balance: apiData.balance || 0,
      currency: 'USD',
      credits: Math.floor((apiData.balance || 0) * 10), // Convert balance to credits
      credit_value: 0.1, // Each credit is worth $0.10
      last_updated: new Date().toISOString(),
      transactions: {
        total_spent: 0,
        total_earned: Math.floor((apiData.balance || 0) * 10),
      },
      limits: {
        daily_download_limit: 1000,
        monthly_download_limit: 10000,
        max_file_size: 100 * 1024 * 1024, // 100MB
      },
      usage: {
        downloads_this_month: 0,
        downloads_today: 0,
        storage_used: 0,
        bandwidth_used: 0,
      },
    }
  }
}

export const nehtwClient = new NehtwClient()