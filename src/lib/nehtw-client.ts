import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
  NehtwBaseResponse,
  NehtwErrorResponse,
  StockSearchParams,
  StockSearchResponse,
  OrderRequest,
  OrderResponse,
  OrderStatus,
  DownloadLink,
  AIGenerationRequest,
  AIGenerationResponse,
  AIGenerationJob,
  AccountBalance,
  UserProfile,
  StockSitesResponse,
  NehtwAPIError as NehtwAPIErrorType,
} from '../types/nehtw';

// Custom Error Classes
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

// Legacy interfaces - now using comprehensive types from ../types/nehtw

// Retry Configuration
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 2000, // 2 seconds
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
};

// Nehtw API Client Class
export class NehtwAPIClient {
  private client: AxiosInstance;
  private retryConfig: RetryConfig;
  private isDebugMode: boolean;

  constructor(
    baseURL: string = 'https://nehtw.com/api',
    apiKey?: string,
    retryConfig: Partial<RetryConfig> = {},
    debug: boolean = false
  ) {
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
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
        return Promise.reject(this.handleError(error as AxiosError<NehtwErrorResponse>));
      }
    );
  }

  private handleError(error: AxiosError<NehtwErrorResponse>): NehtwAPIError {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return new NehtwTimeoutError('Request timed out');
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return new NehtwNetworkError('Network connection failed');
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      return new NehtwAuthError('Invalid API key or insufficient permissions');
    }

    const statusCode = error.response?.status || 500;
    
    // Safely access message with proper typing and fallbacks
    const responseData = error.response?.data as NehtwErrorResponse | undefined;
    const message = responseData?.message || 
                   responseData?.error || 
                   (typeof error.response?.data === 'object' && error.response?.data !== null && 'message' in error.response.data ? (error.response.data as { message: string }).message : undefined) ||
                   error.message || 
                   'Unknown error occurred';
    
    const code = responseData?.code || 'UNKNOWN_ERROR';
    const details = error.response?.data;

    return new NehtwAPIError(message, statusCode, code, details);
  }

  private async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    attempt: number = 1
  ): Promise<AxiosResponse<T>> {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt >= this.retryConfig.maxAttempts) {
        throw error;
      }

      // Don't retry on authentication errors
      if (error instanceof NehtwAuthError) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1),
        this.retryConfig.maxDelay
      );

      if (this.isDebugMode) {
        console.log(`🔄 [NehtwAPI] Retry attempt ${attempt}/${this.retryConfig.maxAttempts} in ${delay}ms`);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      return this.retryRequest(requestFn, attempt + 1);
    }
  }

  // Public API Methods
  async search(params: StockSearchParams): Promise<StockSearchResponse> {
    const requestFn = () => this.client.get<NehtwBaseResponse<StockSearchResponse>>('/search', {
      params: {
        q: params.query,
        page: params.page || 1,
        limit: params.limit || 20,
        type: params.type || 'all',
        category: params.category,
        sort: params.sort || 'relevance',
      },
    });

    const response = await this.retryRequest(requestFn);
    return response.data.data;
  }

  async createOrder(orderData: OrderRequest): Promise<OrderResponse> {
    const requestFn = () => this.client.post<NehtwBaseResponse<OrderResponse>>('/orders', orderData);
    
    const response = await this.retryRequest(requestFn);
    return response.data.data;
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    const requestFn = () => this.client.get<NehtwBaseResponse<OrderStatus>>(`/orders/${orderId}`);
    
    const response = await this.retryRequest(requestFn);
    return response.data.data;
  }

  async getDownloadLink(orderId: string): Promise<DownloadLink> {
    const requestFn = () => this.client.get<NehtwBaseResponse<DownloadLink>>(`/orders/${orderId}/download`);
    
    const response = await this.retryRequest(requestFn);
    return response.data.data;
  }

  async getCredits(): Promise<AccountBalance> {
    const requestFn = () => this.client.get<NehtwBaseResponse<AccountBalance>>('/credits');
    
    const response = await this.retryRequest(requestFn);
    return response.data.data;
  }

  async generateAI(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const requestFn = () => this.client.post<NehtwBaseResponse<AIGenerationResponse>>('/ai/generate', request);
    
    const response = await this.retryRequest(requestFn);
    return response.data.data;
  }

  async getAIJobStatus(jobId: string): Promise<AIGenerationJob> {
    const requestFn = () => this.client.get<NehtwBaseResponse<AIGenerationJob>>(`/ai/jobs/${jobId}`);
    
    const response = await this.retryRequest(requestFn);
    return response.data.data;
  }

  // Utility Methods
  setDebugMode(enabled: boolean): void {
    this.isDebugMode = enabled;
  }

  setRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
  }

  updateApiKey(apiKey: string): void {
    this.client.defaults.headers['X-Api-Key'] = apiKey;
  }

  // Additional API Methods
  async getUserProfile(): Promise<UserProfile> {
    const requestFn = () => this.client.get<NehtwBaseResponse<UserProfile>>('/me');
    
    const response = await this.retryRequest(requestFn);
    return response.data.data;
  }

  async getStockSites(): Promise<StockSitesResponse> {
    const requestFn = () => this.client.get<NehtwBaseResponse<StockSitesResponse>>('/stocksites');
    
    const response = await this.retryRequest(requestFn);
    return response.data.data;
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const requestFn = () => this.client.get<NehtwBaseResponse<{ status: string; timestamp: string }>>('/health');
    
    const response = await this.retryRequest(requestFn);
    return response.data.data;
  }
}

// Create and export singleton instance
export const nehtwClient = new NehtwAPIClient(
  process.env.NEXT_PUBLIC_NEHTW_BASE_URL || 'https://nehtw.com/api',
  process.env.NEXT_PUBLIC_NEHTW_API_KEY,
  undefined, // Use default retry config
  process.env.NODE_ENV === 'development' // Enable debug in development
);

// Export default instance
export default nehtwClient;
