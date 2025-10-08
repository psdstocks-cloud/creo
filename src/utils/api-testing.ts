import { nehtwClient, NehtwAPIError } from '@/lib/nehtw-api-client';

// ============================================================================
// API Testing Utilities for Development and Debugging
// ============================================================================

export interface TestResult {
  success: boolean;
  endpoint: string;
  duration: number;
  data?: unknown;
  error?: string;
  timestamp: string;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  totalDuration: number;
  successCount: number;
  failureCount: number;
}

// ============================================================================
// Individual Test Functions
// ============================================================================

/**
 * Test stock sites endpoint
 */
export async function testStockSites(): Promise<TestResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    console.log('🧪 Testing stock sites endpoint...');
    const data = await nehtwClient.getStockSites();
    const duration = Date.now() - startTime;
    
    console.log('✅ Stock sites test passed:', { duration, siteCount: Object.keys(data).length });
    
    return {
      success: true,
      endpoint: 'GET /api/stocksites',
      duration,
      data,
      timestamp
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof NehtwAPIError ? error.message : 'Unknown error';
    
    console.error('❌ Stock sites test failed:', errorMessage);
    
    return {
      success: false,
      endpoint: 'GET /api/stocksites',
      duration,
      error: errorMessage,
      timestamp
    };
  }
}

/**
 * Test stock info endpoint with sample data
 */
export async function testStockInfo(site: string = 'shutterstock', id: string = '12345'): Promise<TestResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    console.log(`🧪 Testing stock info endpoint for ${site}/${id}...`);
    const data = await nehtwClient.getStockInfo(site, id);
    const duration = Date.now() - startTime;
    
    console.log('✅ Stock info test passed:', { duration, title: data.data?.title });
    
    return {
      success: true,
      endpoint: `GET /api/stockinfo/${site}/${id}`,
      duration,
      data,
      timestamp
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof NehtwAPIError ? error.message : 'Unknown error';
    
    console.error('❌ Stock info test failed:', errorMessage);
    
    return {
      success: false,
      endpoint: `GET /api/stockinfo/${site}/${id}`,
      duration,
      error: errorMessage,
      timestamp
    };
  }
}

/**
 * Test user balance endpoint
 */
export async function testUserBalance(): Promise<TestResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    console.log('🧪 Testing user balance endpoint...');
    const data = await nehtwClient.getUserBalance();
    const duration = Date.now() - startTime;
    
    console.log('✅ User balance test passed:', { duration, balance: data.balance });
    
    return {
      success: true,
      endpoint: 'GET /api/me',
      duration,
      data,
      timestamp
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof NehtwAPIError ? error.message : 'Unknown error';
    
    console.error('❌ User balance test failed:', errorMessage);
    
    return {
      success: false,
      endpoint: 'GET /api/me',
      duration,
      error: errorMessage,
      timestamp
    };
  }
}

/**
 * Test rate limiting by making multiple rapid requests
 */
export async function testRateLimit(): Promise<TestResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    console.log('🧪 Testing rate limiting with rapid requests...');
    
    const requests: Promise<void>[] = [];
    const requestTimes: number[] = [];
    
    // Make 3 rapid requests to test rate limiting
    for (let i = 0; i < 3; i++) {
      const requestStart = Date.now();
      requests.push(
        nehtwClient.getStockSites().then(() => {
          requestTimes.push(Date.now() - requestStart);
        })
      );
    }
    
    await Promise.all(requests);
    const duration = Date.now() - startTime;
    
    console.log('✅ Rate limit test passed:', { 
      duration, 
      requestTimes,
      averageTime: requestTimes.reduce((a, b) => a + b, 0) / requestTimes.length
    });
    
    return {
      success: true,
      endpoint: 'Rate Limit Test (3 rapid requests)',
      duration,
      data: { requestTimes, averageTime: requestTimes.reduce((a, b) => a + b, 0) / requestTimes.length },
      timestamp
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof NehtwAPIError ? error.message : 'Unknown error';
    
    console.error('❌ Rate limit test failed:', errorMessage);
    
    return {
      success: false,
      endpoint: 'Rate Limit Test',
      duration,
      error: errorMessage,
      timestamp
    };
  }
}

/**
 * Test AI generation endpoint
 */
export async function testAIGeneration(prompt: string = 'A beautiful sunset over mountains'): Promise<TestResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    console.log('🧪 Testing AI generation endpoint...');
    const data = await nehtwClient.createAIJob(prompt);
    const duration = Date.now() - startTime;
    
    console.log('✅ AI generation test passed:', { duration, jobId: data.job_id });
    
    return {
      success: true,
      endpoint: 'POST /api/aig/create',
      duration,
      data,
      timestamp
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof NehtwAPIError ? error.message : 'Unknown error';
    
    console.error('❌ AI generation test failed:', errorMessage);
    
    return {
      success: false,
      endpoint: 'POST /api/aig/create',
      duration,
      error: errorMessage,
      timestamp
    };
  }
}

/**
 * Test health check endpoint
 */
export async function testHealthCheck(): Promise<TestResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    console.log('🧪 Testing health check endpoint...');
    const data = await nehtwClient.healthCheck();
    const duration = Date.now() - startTime;
    
    console.log('✅ Health check test passed:', { duration, status: data.status });
    
    return {
      success: true,
      endpoint: 'GET /api/health',
      duration,
      data,
      timestamp
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof NehtwAPIError ? error.message : 'Unknown error';
    
    console.error('❌ Health check test failed:', errorMessage);
    
    return {
      success: false,
      endpoint: 'GET /api/health',
      duration,
      error: errorMessage,
      timestamp
    };
  }
}

// ============================================================================
// Test Suite Functions
// ============================================================================

/**
 * Run all basic API tests
 */
export async function runBasicTests(): Promise<TestSuite> {
  const startTime = Date.now();
  const tests: TestResult[] = [];
  
  console.log('🚀 Starting basic API tests...');
  
  // Run tests in sequence to respect rate limiting
  tests.push(await testHealthCheck());
  tests.push(await testStockSites());
  tests.push(await testUserBalance());
  tests.push(await testStockInfo());
  
  const totalDuration = Date.now() - startTime;
  const successCount = tests.filter(t => t.success).length;
  const failureCount = tests.filter(t => !t.success).length;
  
  console.log(`🏁 Basic tests completed: ${successCount} passed, ${failureCount} failed in ${totalDuration}ms`);
  
  return {
    name: 'Basic API Tests',
    tests,
    totalDuration,
    successCount,
    failureCount
  };
}

/**
 * Run comprehensive test suite
 */
export async function runComprehensiveTests(): Promise<TestSuite> {
  const startTime = Date.now();
  const tests: TestResult[] = [];
  
  console.log('🚀 Starting comprehensive API tests...');
  
  // Run all tests in sequence
  tests.push(await testHealthCheck());
  tests.push(await testStockSites());
  tests.push(await testUserBalance());
  tests.push(await testStockInfo());
  tests.push(await testRateLimit());
  tests.push(await testAIGeneration());
  
  const totalDuration = Date.now() - startTime;
  const successCount = tests.filter(t => t.success).length;
  const failureCount = tests.filter(t => !t.success).length;
  
  console.log(`🏁 Comprehensive tests completed: ${successCount} passed, ${failureCount} failed in ${totalDuration}ms`);
  
  return {
    name: 'Comprehensive API Tests',
    tests,
    totalDuration,
    successCount,
    failureCount
  };
}

/**
 * Test specific endpoint with custom parameters
 */
export async function testCustomEndpoint(
  endpoint: string,
  params: Record<string, unknown> = {}
): Promise<TestResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    console.log(`🧪 Testing custom endpoint: ${endpoint}`, params);
    
    let data;
    switch (endpoint) {
      case 'stocksites':
        data = await nehtwClient.getStockSites();
        break;
      case 'stockinfo':
        data = await nehtwClient.getStockInfo(params.site as string, params.id as string, params.url as string);
        break;
      case 'userbalance':
        data = await nehtwClient.getUserBalance();
        break;
      case 'aigeneration':
        data = await nehtwClient.createAIJob(params.prompt as string);
        break;
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
    
    const duration = Date.now() - startTime;
    console.log(`✅ Custom endpoint test passed: ${endpoint}`, { duration });
    
    return {
      success: true,
      endpoint: endpoint,
      duration,
      data,
      timestamp
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof NehtwAPIError ? error.message : 'Unknown error';
    
    console.error(`❌ Custom endpoint test failed: ${endpoint}`, errorMessage);
    
    return {
      success: false,
      endpoint: endpoint,
      duration,
      error: errorMessage,
      timestamp
    };
  }
}

// ============================================================================
// Logging and Monitoring Utilities
// ============================================================================

/**
 * Log test results to console with formatting
 */
export function logTestResults(suite: TestSuite): void {
  console.log('\n' + '='.repeat(60));
  console.log(`📊 ${suite.name} Results`);
  console.log('='.repeat(60));
  console.log(`⏱️  Total Duration: ${suite.totalDuration}ms`);
  console.log(`✅ Passed: ${suite.successCount}`);
  console.log(`❌ Failed: ${suite.failureCount}`);
  console.log(`📈 Success Rate: ${((suite.successCount / suite.tests.length) * 100).toFixed(1)}%`);
  console.log('\n📋 Individual Test Results:');
  
  suite.tests.forEach((test, index) => {
    const status = test.success ? '✅' : '❌';
    const duration = `${test.duration}ms`;
    console.log(`${status} ${index + 1}. ${test.endpoint} (${duration})`);
    if (!test.success && test.error) {
      console.log(`   Error: ${test.error}`);
    }
  });
  
  console.log('='.repeat(60) + '\n');
}

/**
 * Export test results to JSON
 */
export function exportTestResults(suite: TestSuite): string {
  return JSON.stringify(suite, null, 2);
}

/**
 * Check if API is properly configured
 */
export function checkAPIConfiguration(): { configured: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!process.env.NEXT_PUBLIC_NEHTW_API_KEY) {
    issues.push('NEXT_PUBLIC_NEHTW_API_KEY is not set');
  }
  
  if (!process.env.NEXT_PUBLIC_NEHTW_BASE_URL) {
    issues.push('NEXT_PUBLIC_NEHTW_BASE_URL is not set');
  }
  
  return {
    configured: issues.length === 0,
    issues
  };
}