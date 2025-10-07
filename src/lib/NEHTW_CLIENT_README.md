# Nehtw API Client

A robust, production-ready API client for nehtw integration with comprehensive error handling, retry logic, and TypeScript support.

## 🚀 Features

- **Robust Error Handling**: Custom error classes for different error types
- **Retry Logic**: Exponential backoff with configurable attempts
- **Request/Response Interceptors**: Built-in logging and debugging
- **Timeout Handling**: 30-second default timeout with custom error handling
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Debug Mode**: Detailed logging for development
- **Singleton Pattern**: Pre-configured instance ready to use

## 📦 Installation

The client is already included in the project. No additional installation required.

## 🔧 Configuration

### Environment Variables

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_NEHTW_API_KEY=your_api_key_here
NEXT_PUBLIC_NEHTW_BASE_URL=https://nehtw.com/api
```

### Netlify Configuration

Add the same variables to your Netlify environment variables in the dashboard.

## 🎯 Quick Start

```typescript
import { nehtwClient } from '@/lib/nehtw-client';

// Search for stock media
const results = await nehtwClient.search({
  query: 'business meeting',
  type: 'image',
  limit: 20
});

// Create an order
const order = await nehtwClient.createOrder({
  site_id: 'shutterstock',
  stock_id: '12345'
});

// Get download link
const downloadLink = await nehtwClient.getDownloadLink(order.order_id);
```

## 🔍 API Methods

### Search
```typescript
const results = await nehtwClient.search({
  query: string,
  page?: number,
  limit?: number,
  type?: 'image' | 'video' | 'audio' | 'all',
  category?: string,
  sort?: 'relevance' | 'newest' | 'oldest' | 'popular'
});
```

### Orders
```typescript
// Create order
const order = await nehtwClient.createOrder({
  site_id: string,
  stock_id: string,
  user_id?: string,
  metadata?: Record<string, unknown>
});

// Get order status
const status = await nehtwClient.getOrderStatus(orderId);
```

### Downloads
```typescript
const downloadLink = await nehtwClient.getDownloadLink(orderId);
```

### AI Generation
```typescript
// Start AI generation
const job = await nehtwClient.generateAI(prompt, {
  style?: string,
  size?: string,
  count?: number
});

// Check AI job status
const status = await nehtwClient.getAIJobStatus(jobId);
```

### Utilities
```typescript
// Check credits
const credits = await nehtwClient.getCredits();

// Health check
const health = await nehtwClient.healthCheck();
```

## 🛠️ Error Handling

The client provides custom error classes for different scenarios:

```typescript
import { 
  NehtwAPIError,
  NehtwTimeoutError,
  NehtwNetworkError,
  NehtwAuthError 
} from '@/lib/nehtw-client';

try {
  const results = await nehtwClient.search({ query: 'test' });
} catch (error) {
  if (error instanceof NehtwAuthError) {
    console.error('Authentication failed - check API key');
  } else if (error instanceof NehtwTimeoutError) {
    console.error('Request timed out');
  } else if (error instanceof NehtwNetworkError) {
    console.error('Network connection failed');
  } else {
    console.error('API error:', error.message);
  }
}
```

## 🔄 Retry Logic

The client automatically retries failed requests with exponential backoff:

- **Default**: 3 attempts with 2-second base delay
- **Backoff**: Exponential multiplier of 2
- **Max Delay**: 10 seconds
- **Exclusions**: Authentication errors are not retried

### Custom Retry Configuration

```typescript
import { NehtwAPIClient } from '@/lib/nehtw-client';

const customClient = new NehtwAPIClient(
  'https://nehtw.com/api',
  'your-api-key',
  {
    maxAttempts: 5,
    baseDelay: 1000,
    maxDelay: 5000,
    backoffMultiplier: 1.5
  },
  true // Enable debug mode
);
```

## 🐛 Debug Mode

Enable debug mode for detailed logging:

```typescript
// Enable debug mode
nehtwClient.setDebugMode(true);

// Or create a new client with debug enabled
const debugClient = new NehtwAPIClient(
  'https://nehtw.com/api',
  'your-api-key',
  undefined,
  true // Enable debug
);
```

Debug mode provides:
- Request/response logging
- Retry attempt tracking
- Error details
- Performance metrics

## 📊 Complete Workflow Example

```typescript
import { nehtwClient } from '@/lib/nehtw-client';

async function completeWorkflow(searchQuery: string) {
  try {
    // 1. Search for media
    const results = await nehtwClient.search({
      query: searchQuery,
      type: 'image',
      limit: 20
    });

    if (results.results.length === 0) {
      throw new Error('No results found');
    }

    // 2. Create order for first result
    const order = await nehtwClient.createOrder({
      site_id: 'shutterstock',
      stock_id: results.results[0].id
    });

    // 3. Wait for order completion
    let completedOrder;
    for (let i = 0; i < 30; i++) {
      const status = await nehtwClient.getOrderStatus(order.order_id);
      if (status.status === 'completed') {
        completedOrder = status;
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (!completedOrder) {
      throw new Error('Order did not complete in time');
    }

    // 4. Get download link
    const downloadLink = await nehtwClient.getDownloadLink(completedOrder.order_id);

    return {
      searchResults: results,
      order: completedOrder,
      downloadLink
    };
  } catch (error) {
    console.error('Workflow failed:', error);
    throw error;
  }
}
```

## 🎨 AI Generation Workflow

```typescript
async function generateAIImage(prompt: string) {
  try {
    // Start AI generation
    const job = await nehtwClient.generateAI(prompt, {
      style: 'photorealistic',
      size: '1024x1024',
      count: 1
    });

    // Wait for completion
    let result;
    for (let i = 0; i < 60; i++) {
      const status = await nehtwClient.getAIJobStatus(job.job_id);
      if (status.status === 'completed' && status.result) {
        result = status;
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return result;
  } catch (error) {
    console.error('AI generation failed:', error);
    throw error;
  }
}
```

## 🔧 Advanced Configuration

### Custom Client Instance

```typescript
import { NehtwAPIClient } from '@/lib/nehtw-client';

const customClient = new NehtwAPIClient(
  'https://nehtw.com/api', // Base URL
  'your-api-key', // API Key
  {
    maxAttempts: 5, // Retry attempts
    baseDelay: 1000, // Initial delay (ms)
    maxDelay: 10000, // Maximum delay (ms)
    backoffMultiplier: 2 // Exponential backoff
  },
  process.env.NODE_ENV === 'development' // Debug mode
);

// Update API key
customClient.updateApiKey('new-api-key');

// Configure retry settings
customClient.setRetryConfig({
  maxAttempts: 3,
  baseDelay: 2000
});
```

## 🚨 Error Types

| Error Class | Description | Status Code |
|-------------|-------------|-------------|
| `NehtwAPIError` | General API errors | 400-599 |
| `NehtwTimeoutError` | Request timeout | 408 |
| `NehtwNetworkError` | Network connection issues | 0 |
| `NehtwAuthError` | Authentication failures | 401/403 |

## 📝 TypeScript Interfaces

```typescript
interface NehtwSearchParams {
  query: string;
  page?: number;
  limit?: number;
  type?: 'image' | 'video' | 'audio' | 'all';
  category?: string;
  sort?: 'relevance' | 'newest' | 'oldest' | 'popular';
}

interface NehtwSearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  type: 'image' | 'video' | 'audio';
  category: string;
  tags: string[];
  size: number;
  dimensions?: { width: number; height: number };
  duration?: number;
  created_at: string;
  updated_at: string;
}

interface NehtwOrderRequest {
  site_id: string;
  stock_id: string;
  user_id?: string;
  metadata?: Record<string, unknown>;
}
```

## 🧪 Testing

The client includes comprehensive error handling and retry logic. Test different scenarios:

```typescript
// Test timeout handling
nehtwClient.setRetryConfig({ maxAttempts: 1, baseDelay: 100 });

// Test network errors
// Disconnect network and make requests

// Test authentication errors
// Use invalid API key
```

## 🔒 Security

- API keys are never logged in production
- Environment variables are properly secured
- Request/response data is sanitized in logs
- Debug mode is disabled in production

## 📚 Examples

See `nehtw-client.example.ts` for comprehensive usage examples including:
- Basic search operations
- Order creation and management
- Download link handling
- AI generation workflows
- Error handling patterns
- Custom client configuration

## 🆘 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify API key is correct
   - Check environment variables are set
   - Ensure API key has proper permissions

2. **Timeout Errors**
   - Increase timeout in client configuration
   - Check network connectivity
   - Verify API endpoint is accessible

3. **Network Errors**
   - Check internet connection
   - Verify API endpoint URL
   - Check firewall settings

4. **Retry Failures**
   - Increase max attempts
   - Adjust retry delays
   - Check for persistent API issues

### Debug Mode

Enable debug mode to see detailed request/response information:

```typescript
nehtwClient.setDebugMode(true);
```

This will log:
- Request details (URL, headers, data)
- Response details (status, data)
- Retry attempts
- Error information

## 📞 Support

For API-related issues:
- Check the nehtw API documentation
- Verify your API key permissions
- Contact nehtw support for API issues

For client-related issues:
- Check the error messages in debug mode
- Verify environment variable configuration
- Review the examples in `nehtw-client.example.ts`
