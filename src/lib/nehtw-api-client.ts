import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// ============================================================================
// Rate Limiter Class (CRITICAL - API requirement)
// ============================================================================

class RateLimiter {
  private lastRequestTime = 0;
  private readonly minInterval = 2000; // 2 seconds as per API docs

  async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }
}

// ============================================================================
// Custom Error Classes
// ============================================================================

export class NehtwAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'NehtwAPIError';
  }
}

export class NehtwTimeoutError extends NehtwAPIError {
  constructor(message: string = 'Request timeout') {
    super(message, 408, 'TIMEOUT');
    this.name = 'NehtwTimeoutError';
  }
}

export class NehtwNetworkError extends NehtwAPIError {
  constructor(message: string = 'Network error') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NehtwNetworkError';
  }
}

export class NehtwAuthError extends NehtwAPIError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'NehtwAuthError';
  }
}

export class NehtwRateLimitError extends NehtwAPIError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT');
    this.name = 'NehtwRateLimitError';
  }
}

// ============================================================================
// TypeScript Interfaces (Based on API docs)
// ============================================================================

// Stock Media Types
export interface StockSites {
  [siteName: string]: {
    active: boolean;
    price: number;
  };
}

export interface StockInfo {
  success: boolean;
  data: {
    image: string;
    title: string;
    id: string;
    source: string;
    cost: number;
    ext: string;
    name: string;
    author: string;
    sizeInBytes: string;
  };
}

export interface OrderResponse {
  success: boolean;
  task_id: string;
}

export interface OrderStatus {
  success: boolean;
  status: 'processing' | 'ready' | 'error';
}

export interface DownloadLink {
  success: boolean;
  status: 'downloading' | 'ready';
  downloadLink?: string;
  fileName?: string;
  linkType?: string;
}

// AI Generation Types
export interface AIJobResponse {
  success: boolean;
  job_id: string;
  get_result_url: string;
}

export interface AIResult {
  __id: string;
  prompt: string;
  type: 'imagine' | 'vary' | 'upscale';
  cost: number;
  error_message: string | null;
  parent_nh_job_id: string | null;
  status: 'completed' | 'processing' | 'failed';
  percentage_complete: number;
  strong: boolean | null;
  index: number | null;
  created_at: number;
  updated_at: number;
  updated_at_human: string;
  files?: Array<{
    index: number;
    thumb_sm: string;
    thumb_lg: string;
    download: string;
  }>;
}

// Account Types
export interface UserBalance {
  success: boolean;
  username: string;
  balance: number;
}

// AI Actions
export interface AIActionRequest {
  jobId: string;
  action: 'vary' | 'upscale';
  index: number;
  varyType?: 'subtle' | 'strong';
}

// ============================================================================
// Main NEHTW API Client Class
// ============================================================================

export class NehtwAPIClient {
  private client: AxiosInstance;
  private rateLimiter: RateLimiter;
  private isDebugMode: boolean;

  constructor(
    baseURL: string = process.env.NEXT_PUBLIC_NEHTW_BASE_URL || 'https://nehtw.com/api',
    apiKey?: string,
    debug: boolean = process.env.NODE_ENV === 'development'
  ) {
    this.rateLimiter = new RateLimiter();
    this.isDebugMode = debug;

    // Initialize Axios client
    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey || process.env.NEXT_PUBLIC_NEHTW_API_KEY || '',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for logging and debugging
    this.client.interceptors.request.use(
      (config) => {
        if (this.isDebugMode) {
          console.log(`🚀 [NehtwAPI] ${config.method?.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data,
            timestamp: new Date().toISOString(),
          });
        }
        return config;
      },
      (error) => {
        if (this.isDebugMode) {
          console.error('❌ [NehtwAPI] Request Error:', error);
        }
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (this.isDebugMode) {
          console.log(`✅ [NehtwAPI] ${response.status} ${response.config.url}`, {
            data: response.data,
            timestamp: new Date().toISOString(),
          });
        }
        return response;
      },
      (error: AxiosError<unknown>) => {
        if (this.isDebugMode) {
          console.error('❌ [NehtwAPI] Response Error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.message,
            data: error.response?.data,
          });
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError<unknown>): NehtwAPIError {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return new NehtwTimeoutError('Request timed out');
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return new NehtwNetworkError('Network connection failed');
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      return new NehtwAuthError('Invalid API key or insufficient permissions');
    }

    if (error.response?.status === 429) {
      return new NehtwRateLimitError('Rate limit exceeded. Please wait before making another request.');
    }

    const statusCode = error.response?.status || 500;
    const responseData = error.response?.data as Record<string, unknown> | undefined;
    const message = (responseData?.message as string) || 
                   (responseData?.error as string) || 
                   error.message || 
                   'Unknown error occurred';
    
    return new NehtwAPIError(message, statusCode);
  }

  // ============================================================================
  // Stock Media API Methods
  // ============================================================================

  /**
   * Get available stock sites with active status and pricing
   * GET /api/stocksites
   */
  async getStockSites(): Promise<StockSites> {
    await this.rateLimiter.waitForRateLimit();
    
    const response = await this.client.get<StockSites>('/stocksites');
    return response.data;
  }

  /**
   * Get stock information with image, title, cost, etc.
   * GET /api/stockinfo/{site}/{id}?url={urlencoded}
   */
  async getStockInfo(site: string, id: string, url?: string): Promise<StockInfo> {
    await this.rateLimiter.waitForRateLimit();
    
    const params = url ? { url: encodeURIComponent(url) } : {};
    const response = await this.client.get<StockInfo>(`/stockinfo/${site}/${id}`, { params });
    return response.data;
  }

  /**
   * Create stock order and get task_id
   * GET /api/stockorder/{site}/{id}?url={urlencoded}
   */
  async createStockOrder(site: string, id: string, url?: string): Promise<OrderResponse> {
    await this.rateLimiter.waitForRateLimit();
    
    const params = url ? { url: encodeURIComponent(url) } : {};
    const response = await this.client.get<OrderResponse>(`/stockorder/${site}/${id}`, { params });
    return response.data;
  }

  /**
   * Check order status (processing|ready|error)
   * GET /api/order/{task_id}/status?responsetype={any|gdrive}
   */
  async getOrderStatus(taskId: string, responseType: 'any' | 'gdrive' = 'any'): Promise<OrderStatus> {
    await this.rateLimiter.waitForRateLimit();
    
    const response = await this.client.get<OrderStatus>(`/order/${taskId}/status`, {
      params: { responsetype: responseType }
    });
    return response.data;
  }

  /**
   * Get download links
   * GET /api/v2/order/{task_id}/download?responsetype={any|gdrive|mydrivelink|asia}
   */
  async getDownloadLink(taskId: string, responseType: 'any' | 'gdrive' | 'mydrivelink' | 'asia' = 'any'): Promise<DownloadLink> {
    await this.rateLimiter.waitForRateLimit();
    
    const response = await this.client.get<DownloadLink>(`/v2/order/${taskId}/download`, {
      params: { responsetype: responseType }
    });
    return response.data;
  }

  // ============================================================================
  // AI Generation API Methods
  // ============================================================================

  /**
   * Create AI generation job with prompt, return job_id
   * POST /api/aig/create
   */
  async createAIJob(prompt: string): Promise<AIJobResponse> {
    await this.rateLimiter.waitForRateLimit();
    
    const response = await this.client.post<AIJobResponse>('/aig/create', { prompt });
    return response.data;
  }

  /**
   * Poll for AI results (status: completed, percentage_complete, files array)
   * GET /api/aig/public/{job_id}
   */
  async getAIResult(jobId: string): Promise<AIResult> {
    await this.rateLimiter.waitForRateLimit();
    
    const response = await this.client.get<AIResult>(`/aig/public/${jobId}`);
    return response.data;
  }

  /**
   * Perform vary/upscale actions on AI results
   * POST /api/aig/actions
   */
  async performAIAction(request: AIActionRequest): Promise<AIJobResponse> {
    await this.rateLimiter.waitForRateLimit();
    
    const response = await this.client.post<AIJobResponse>('/aig/actions', request);
    return response.data;
  }

  // ============================================================================
  // Account Management API Methods
  // ============================================================================

  /**
   * Get user balance and account info
   * GET /api/me
   */
  async getUserBalance(): Promise<UserBalance> {
    await this.rateLimiter.waitForRateLimit();
    
    const response = await this.client.get<UserBalance>('/me');
    return response.data;
  }

  /**
   * Transfer points between accounts
   * GET /api/sendpoint
   */
  async transferPoints(toUser: string, amount: number): Promise<{ success: boolean; message: string }> {
    await this.rateLimiter.waitForRateLimit();
    
    const response = await this.client.get<{ success: boolean; message: string }>('/sendpoint', {
      params: { to: toUser, amount }
    });
    return response.data;
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  setDebugMode(enabled: boolean): void {
    this.isDebugMode = enabled;
  }

  updateApiKey(apiKey: string): void {
    this.client.defaults.headers['X-Api-Key'] = apiKey;
  }

  /**
   * Health check method
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    await this.rateLimiter.waitForRateLimit();
    
    const response = await this.client.get<{ status: string; timestamp: string }>('/health');
    return response.data;
  }
}

// ============================================================================
// Create and export singleton instance
// ============================================================================

export const nehtwClient = new NehtwAPIClient(
  process.env.NEXT_PUBLIC_NEHTW_BASE_URL || 'https://nehtw.com/api',
  process.env.NEXT_PUBLIC_NEHTW_API_KEY,
  process.env.NODE_ENV === 'development'
);

// Export default instance
export default nehtwClient;
