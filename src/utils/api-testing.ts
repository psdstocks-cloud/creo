/**
 * API Testing Utilities
 * 
 * Comprehensive testing suite for API endpoints including mock responses,
 * validation, rate limiting compliance, and error scenario testing.
 */

import { AxiosResponse } from 'axios';

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface MockApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config?: Record<string, unknown>;
  delay?: number;
}

export interface ApiTestConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  rateLimit: {
    requests: number;
    window: number; // in milliseconds
  };
}

export interface ApiTestResult {
  endpoint: string;
  method: string;
  status: 'success' | 'error' | 'timeout' | 'rate_limited';
  responseTime: number;
  statusCode?: number;
  error?: string;
  timestamp: Date;
}

export interface RateLimitInfo {
  remaining: number;
  reset: number;
  limit: number;
}

export interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  rateLimitHits: number;
  errorRate: number;
}

// ============================================================================
// Mock API Responses
// ============================================================================

export class MockApiServer {
  private responses: Map<string, MockApiResponse> = new Map();
  private delays: Map<string, number> = new Map();

  /**
   * Register a mock response for an endpoint
   */
  registerMock<T>(
    method: string,
    endpoint: string,
    response: MockApiResponse<T>,
    delay: number = 0
  ): void {
    const key = `${method.toUpperCase()}:${endpoint}`;
    this.responses.set(key, response);
    this.delays.set(key, delay);
  }

  /**
   * Get mock response for an endpoint
   */
  getMock(method: string, endpoint: string): MockApiResponse | null {
    const key = `${method.toUpperCase()}:${endpoint}`;
    return this.responses.get(key) || null;
  }

  /**
   * Get delay for an endpoint
   */
  getDelay(method: string, endpoint: string): number {
    const key = `${method.toUpperCase()}:${endpoint}`;
    return this.delays.get(key) || 0;
  }

  /**
   * Clear all mocks
   */
  clearMocks(): void {
    this.responses.clear();
    this.delays.clear();
  }

  /**
   * Setup common mock responses for development
   */
  setupDevelopmentMocks(): void {
    // Stock media search mock
    this.registerMock('GET', '/api/stockinfo/shutterstock/12345', {
      data: {
        id: '12345',
        title: 'Beautiful Landscape',
        thumbnail: 'https://example.com/thumb.jpg',
        cost: 15.99,
        filesize: '2.5MB',
        site: 'shutterstock'
      },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' }
    });

    // Order creation mock
    this.registerMock('GET', '/api/stockorder/shutterstock/12345', {
      data: {
        task_id: 'task_12345',
        status: 'processing',
        estimated_time: '2-3 minutes'
      },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' }
    });

    // Order status mock
    this.registerMock('GET', '/api/order/task_12345/status', {
      data: {
        task_id: 'task_12345',
        status: 'ready',
        progress: 100,
        download_url: 'https://example.com/download/file.zip'
      },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' }
    });

    // AI generation mock
    this.registerMock('POST', '/api/aig/create', {
      data: {
        job_id: 'job_67890',
        status: 'generating',
        estimated_time: '30-60 seconds'
      },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' }
    });

    // Account balance mock
    this.registerMock('GET', '/api/me', {
      data: {
        username: 'testuser',
        balance: 1250,
        credits_used: 150,
        credits_remaining: 1100
      },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' }
    });
  }
}

// ============================================================================
// API Endpoint Testing
// ============================================================================

export class ApiTester {
  private config: ApiTestConfig;
  private metrics: ApiMetrics;
  private rateLimitTracker: Map<string, RateLimitInfo> = new Map();

  constructor(config: ApiTestConfig) {
    this.config = config;
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      rateLimitHits: 0,
      errorRate: 0
    };
  }

  /**
   * Test a single API endpoint
   */
  async testEndpoint(
    method: string,
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiTestResult> {
    const startTime = Date.now();
    const fullUrl = `${this.config.baseUrl}${endpoint}`;

    try {
      // Check rate limiting
      if (this.isRateLimited(endpoint)) {
        return {
          endpoint,
          method,
          status: 'rate_limited',
          responseTime: Date.now() - startTime,
          timestamp: new Date()
        };
      }

      // Make the request
      const response = await this.makeRequest(method, fullUrl, data, headers);
      const responseTime = Date.now() - startTime;

      // Update metrics
      this.updateMetrics(true, responseTime);
      this.updateRateLimitInfo(endpoint, response.headers as Record<string, string>);

      return {
        endpoint,
        method,
        status: 'success',
        responseTime,
        statusCode: response.status,
        timestamp: new Date()
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateMetrics(false, responseTime);

      return {
        endpoint,
        method,
        status: 'error',
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  /**
   * Test multiple endpoints concurrently
   */
  async testEndpoints(
    tests: Array<{
      method: string;
      endpoint: string;
      data?: unknown;
      headers?: Record<string, string>;
    }>
  ): Promise<ApiTestResult[]> {
    const promises = tests.map(test =>
      this.testEndpoint(test.method, test.endpoint, test.data, test.headers)
    );

    return Promise.all(promises);
  }

  /**
   * Validate API response structure
   */
  validateResponse<T>(
    response: AxiosResponse<T>,
    expectedStructure: Record<string, unknown>
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      const data = response.data as Record<string, unknown>;
      
      for (const [key, expectedType] of Object.entries(expectedStructure)) {
        if (!(key in data)) {
          errors.push(`Missing required field: ${key}`);
          continue;
        }

        const actualType = typeof data[key];
        const expectedTypeStr = typeof expectedType;
        
        if (actualType !== expectedTypeStr) {
          errors.push(`Field ${key} has type ${actualType}, expected ${expectedTypeStr}`);
        }
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Response validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  /**
   * Test error scenarios
   */
  async testErrorScenarios(endpoint: string): Promise<ApiTestResult[]> {
    const errorTests = [
      { method: 'GET', endpoint: `${endpoint}?invalid=param` },
      { method: 'POST', endpoint, data: { invalid: 'data' } },
      { method: 'GET', endpoint: `${endpoint}/nonexistent` },
      { method: 'DELETE', endpoint: `${endpoint}/protected` }
    ];

    return this.testEndpoints(errorTests);
  }

  /**
   * Get current metrics
   */
  getMetrics(): ApiMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      rateLimitHits: 0,
      errorRate: 0
    };
  }

  // Private methods
  private async makeRequest(): Promise<AxiosResponse> {
    // This would be replaced with actual HTTP client implementation
    // For now, we'll simulate the request
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate for testing
          resolve({
            data: { success: true },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {}
          } as AxiosResponse);
        } else {
          reject(new Error('Simulated network error'));
        }
      }, Math.random() * 1000); // Random delay 0-1s
    });
  }

  private isRateLimited(endpoint: string): boolean {
    const rateLimitInfo = this.rateLimitTracker.get(endpoint);
    if (!rateLimitInfo) return false;

    const now = Date.now();
    if (now > rateLimitInfo.reset) {
      this.rateLimitTracker.delete(endpoint);
      return false;
    }

    return rateLimitInfo.remaining <= 0;
  }

  private updateRateLimitInfo(endpoint: string, headers: Record<string, string>): void {
    const remaining = parseInt(headers['x-ratelimit-remaining'] || '100');
    const reset = parseInt(headers['x-ratelimit-reset'] || '0');
    const limit = parseInt(headers['x-ratelimit-limit'] || '100');

    this.rateLimitTracker.set(endpoint, {
      remaining,
      reset: reset * 1000, // Convert to milliseconds
      limit
    });
  }

  private updateMetrics(success: boolean, responseTime: number): void {
    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    // Update average response time
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime) / 
      this.metrics.totalRequests;

    // Update error rate
    this.metrics.errorRate = this.metrics.failedRequests / this.metrics.totalRequests;
  }
}

// ============================================================================
// Error Scenario Testing
// ============================================================================

export class ErrorScenarioTester {
  /**
   * Test network timeout scenarios
   */
  async testTimeoutScenarios(endpoint: string): Promise<ApiTestResult[]> {
    const timeoutTests = [
      { method: 'GET', endpoint: `${endpoint}?timeout=5000` },
      { method: 'POST', endpoint, data: { large: 'data'.repeat(1000) } }
    ];

    const tester = new ApiTester({
      baseUrl: 'https://api.example.com',
      timeout: 1000, // 1 second timeout
      retries: 0,
      rateLimit: { requests: 100, window: 60000 }
    });

    return tester.testEndpoints(timeoutTests);
  }

  /**
   * Test rate limiting scenarios
   */
  async testRateLimitScenarios(endpoint: string): Promise<ApiTestResult[]> {
    const rateLimitTests = Array.from({ length: 10 }, (_, i) => ({
      method: 'GET',
      endpoint: `${endpoint}?test=${i}`
    }));

    const tester = new ApiTester({
      baseUrl: 'https://api.example.com',
      timeout: 5000,
      retries: 0,
      rateLimit: { requests: 5, window: 60000 } // 5 requests per minute
    });

    return tester.testEndpoints(rateLimitTests);
  }

  /**
   * Test authentication scenarios
   */
  async testAuthScenarios(endpoint: string): Promise<ApiTestResult[]> {
    const authTests = [
      { method: 'GET', endpoint, headers: { 'Authorization': '' } },
      { method: 'GET', endpoint, headers: { 'Authorization': 'Bearer invalid' } },
      { method: 'GET', endpoint, headers: { 'Authorization': 'Bearer expired' } }
    ];

    const tester = new ApiTester({
      baseUrl: 'https://api.example.com',
      timeout: 5000,
      retries: 0,
      rateLimit: { requests: 100, window: 60000 }
    });

    return tester.testEndpoints(authTests);
  }
}

// ============================================================================
// Development Utilities
// ============================================================================

export class ApiTestingDevTools {
  private mockServer: MockApiServer;
  private tester: ApiTester;

  constructor(config: ApiTestConfig) {
    this.mockServer = new MockApiServer();
    this.tester = new ApiTester(config);
  }

  /**
   * Setup development environment
   */
  setupDevelopment(): void {
    this.mockServer.setupDevelopmentMocks();
    console.log('🚀 API Testing DevTools initialized');
    console.log('📝 Mock responses registered');
    console.log('🔧 Development environment ready');
  }

  /**
   * Run comprehensive API tests
   */
  async runComprehensiveTests(): Promise<{
    results: ApiTestResult[];
    metrics: ApiMetrics;
    summary: {
      total: number;
      passed: number;
      failed: number;
      successRate: number;
    };
  }> {
    console.log('🧪 Running comprehensive API tests...');

    const testEndpoints = [
      { method: 'GET', endpoint: '/api/stockinfo/shutterstock/12345' },
      { method: 'GET', endpoint: '/api/stockorder/shutterstock/12345' },
      { method: 'GET', endpoint: '/api/order/task_12345/status' },
      { method: 'POST', endpoint: '/api/aig/create', data: { prompt: 'test' } },
      { method: 'GET', endpoint: '/api/me' }
    ];

    const results = await this.tester.testEndpoints(testEndpoints);
    const metrics = this.tester.getMetrics();

    const summary = {
      total: results.length,
      passed: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      successRate: results.filter(r => r.status === 'success').length / results.length
    };

    console.log('✅ API tests completed');
    console.log(`📊 Results: ${summary.passed}/${summary.total} passed (${(summary.successRate * 100).toFixed(1)}%)`);
    console.log(`⏱️ Average response time: ${metrics.averageResponseTime.toFixed(2)}ms`);
    console.log(`❌ Error rate: ${(metrics.errorRate * 100).toFixed(1)}%`);

    return { results, metrics, summary };
  }

  /**
   * Get mock server instance
   */
  getMockServer(): MockApiServer {
    return this.mockServer;
  }

  /**
   * Get tester instance
   */
  getTester(): ApiTester {
    return this.tester;
  }
}

// ============================================================================
// Export utilities
// ============================================================================

export const createApiTester = (config: ApiTestConfig) => new ApiTester(config);
export const createMockServer = () => new MockApiServer();
export const createDevTools = (config: ApiTestConfig) => new ApiTestingDevTools(config);

// Default configuration
export const defaultApiTestConfig: ApiTestConfig = {
  baseUrl: process.env.NEXT_PUBLIC_NEHTW_BASE_URL || 'https://nehtw.com/api',
  timeout: 30000,
  retries: 3,
  rateLimit: {
    requests: 100,
    window: 60000 // 1 minute
  }
};
