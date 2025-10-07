# NEHTW API Integration Guide

This guide covers the complete integration with the NEHTW API for stock media access, AI image generation, and order management.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Usage Examples](#api-usage-examples)
- [Common Troubleshooting](#common-troubleshooting)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @tanstack/react-query axios
```

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# NEHTW API Configuration
NEXT_PUBLIC_NEHTW_API_KEY=your_nehtw_api_key_here
NEXT_PUBLIC_NEHTW_BASE_URL=https://nehtw.com/api

# Optional: Custom timeout and retry settings
NEXT_PUBLIC_NEHTW_TIMEOUT=30000
NEXT_PUBLIC_NEHTW_RETRIES=3
```

### 3. Initialize Query Client

```typescript
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

### 4. Wrap Your App with QueryClient

```typescript
// src/app/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/query-client';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_NEHTW_API_KEY` | Your NEHTW API key | `sk_1234567890abcdef` |
| `NEXT_PUBLIC_NEHTW_BASE_URL` | NEHTW API base URL | `https://nehtw.com/api` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_NEHTW_TIMEOUT` | Request timeout in ms | `30000` | `30000` |
| `NEXT_PUBLIC_NEHTW_RETRIES` | Number of retry attempts | `3` | `3` |

## API Usage Examples

### 1. Stock Media Search

```typescript
import { useStockMediaSearch } from '../hooks/useStockMediaIntegration';

function StockSearchComponent() {
  const {
    data: searchResults,
    isLoading,
    error,
    search,
    clearSearch
  } = useStockMediaSearch();

  const handleSearch = (query: string, site: string) => {
    search({ query, site, page: 1, limit: 20 });
  };

  return (
    <div>
      <input 
        placeholder="Search for images..."
        onChange={(e) => handleSearch(e.target.value, 'shutterstock')}
      />
      
      {isLoading && <div>Searching...</div>}
      {error && <div>Error: {error.message}</div>}
      
      {searchResults?.results.map((item) => (
        <div key={item.id}>
          <img src={item.thumbnail} alt={item.title} />
          <h3>{item.title}</h3>
          <p>Cost: {item.cost} EGP</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Creating Orders

```typescript
import { useCreateOrder } from '../hooks/useStockMediaIntegration';

function CreateOrderComponent() {
  const createOrderMutation = useCreateOrder();

  const handleCreateOrder = async (site: string, id: string) => {
    try {
      const result = await createOrderMutation.mutateAsync({
        site,
        id
      });
      
      console.log('Order created:', result.task_id);
      // Redirect to order status page or show success message
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  return (
    <button 
      onClick={() => handleCreateOrder('shutterstock', '12345')}
      disabled={createOrderMutation.isPending}
    >
      {createOrderMutation.isPending ? 'Creating Order...' : 'Create Order'}
    </button>
  );
}
```

### 3. Order Status Polling

```typescript
import { useOrderStatus } from '../hooks/useStockMediaIntegration';

function OrderStatusComponent({ taskId }: { taskId: string }) {
  const {
    data: orderStatus,
    isLoading,
    error
  } = useOrderStatus(taskId);

  if (isLoading) return <div>Loading order status...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>Order Status: {orderStatus?.status}</h3>
      {orderStatus?.progress && (
        <div>Progress: {orderStatus.progress}%</div>
      )}
      {orderStatus?.status === 'ready' && (
        <button>Download Files</button>
      )}
    </div>
  );
}
```

### 4. AI Image Generation

```typescript
import { useCreateAIJob, useAIJobStatus } from '../hooks/useAIGeneration';

function AIGenerationComponent() {
  const createJobMutation = useCreateAIJob();
  const [jobId, setJobId] = useState<string | null>(null);
  
  const { data: jobStatus } = useAIJobStatus(jobId || '');

  const handleGenerate = async (prompt: string) => {
    try {
      const result = await createJobMutation.mutateAsync({
        prompt,
        style: 'realistic',
        quality: 'high'
      });
      
      setJobId(result.job_id);
    } catch (error) {
      console.error('Failed to create AI job:', error);
    }
  };

  return (
    <div>
      <input 
        placeholder="Describe the image you want to generate..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleGenerate(e.target.value);
          }
        }}
      />
      
      {jobStatus && (
        <div>
          <p>Status: {jobStatus.status}</p>
          {jobStatus.percentage_complete && (
            <p>Progress: {jobStatus.percentage_complete}%</p>
          )}
        </div>
      )}
    </div>
  );
}
```

### 5. Download Links

```typescript
import { useDownloadLink } from '../hooks/useStockMediaIntegration';

function DownloadComponent({ taskId }: { taskId: string }) {
  const {
    data: downloadData,
    isLoading,
    error
  } = useDownloadLink(taskId);

  if (isLoading) return <div>Preparing download...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {downloadData?.downloadLink && (
        <a 
          href={downloadData.downloadLink}
          download={downloadData.fileName}
          className="download-button"
        >
          Download {downloadData.fileName}
        </a>
      )}
    </div>
  );
}
```

## Common Troubleshooting

### 1. API Key Issues

**Problem**: `401 Unauthorized` errors

**Solutions**:
- Verify your API key is correct in `.env.local`
- Check that the API key has the required permissions
- Ensure the API key is not expired

```typescript
// Check if API key is loaded
console.log('API Key:', process.env.NEXT_PUBLIC_NEHTW_API_KEY);
```

### 2. Network Timeout Issues

**Problem**: Requests timing out

**Solutions**:
- Increase timeout value in environment variables
- Check network connectivity
- Implement retry logic

```typescript
// Custom timeout configuration
const apiClient = new NehtwClient({
  baseURL: process.env.NEXT_PUBLIC_NEHTW_BASE_URL,
  timeout: 60000, // 60 seconds
  retries: 5
});
```

### 3. Rate Limiting

**Problem**: `429 Too Many Requests` errors

**Solutions**:
- Implement exponential backoff
- Add request queuing
- Monitor rate limit headers

```typescript
// Rate limiting handling
const handleRateLimit = (error: any) => {
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers['retry-after'];
    console.log(`Rate limited. Retry after ${retryAfter} seconds`);
    // Implement retry logic
  }
};
```

### 4. CORS Issues

**Problem**: CORS errors in development

**Solutions**:
- Use Next.js API routes as proxy
- Configure CORS headers
- Use server-side requests

```typescript
// pages/api/proxy/nehtw.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_NEHTW_BASE_URL}${req.url}`, {
    headers: {
      'X-Api-Key': process.env.NEXT_PUBLIC_NEHTW_API_KEY,
    },
  });
  
  const data = await response.json();
  res.json(data);
}
```

## Error Handling

### 1. Global Error Handling

```typescript
// src/utils/error-handling.ts
export const handleAPIError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return 'Invalid request parameters';
      case 401:
        return 'Authentication failed';
      case 403:
        return 'Access forbidden';
      case 404:
        return 'Resource not found';
      case 429:
        return 'Rate limit exceeded';
      case 500:
        return 'Internal server error';
      default:
        return `API Error: ${data.message || 'Unknown error'}`;
    }
  } else if (error.request) {
    // Network error
    return 'Network error - please check your connection';
  } else {
    // Other error
    return 'An unexpected error occurred';
  }
};
```

### 2. Retry Logic

```typescript
// src/hooks/useRetry.ts
export const useRetry = (fn: () => Promise<any>, maxRetries = 3) => {
  const [retryCount, setRetryCount] = useState(0);
  
  const executeWithRetry = async () => {
    try {
      const result = await fn();
      setRetryCount(0);
      return result;
    } catch (error) {
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        return executeWithRetry();
      }
      throw error;
    }
  };
  
  return { executeWithRetry, retryCount };
};
```

## Performance Optimization

### 1. Query Optimization

```typescript
// Optimize query caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
```

### 2. Request Deduplication

```typescript
// Prevent duplicate requests
const useStockInfo = (site: string, id: string) => {
  return useQuery({
    queryKey: ['stockInfo', site, id],
    queryFn: () => getStockInfo(site, id),
    enabled: !!site && !!id,
    staleTime: 5 * 60 * 1000,
  });
};
```

### 3. Background Refetching

```typescript
// Background updates for order status
const useOrderStatus = (taskId: string) => {
  return useQuery({
    queryKey: ['orderStatus', taskId],
    queryFn: () => getOrderStatus(taskId),
    enabled: !!taskId,
    refetchInterval: (data) => {
      // Stop polling when order is complete
      return data?.status === 'ready' || data?.status === 'error' ? false : 2000;
    },
  });
};
```

## Best Practices

### 1. Environment Security

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Implement API key rotation
- Use different keys for development and production

### 2. Error Boundaries

```typescript
// Wrap components with error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <StockMediaSearch />
</ErrorBoundary>
```

### 3. Loading States

```typescript
// Always provide loading states
const { data, isLoading, error } = useQuery();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;
```

### 4. Type Safety

```typescript
// Use TypeScript interfaces
interface StockMediaItem {
  id: string;
  title: string;
  thumbnail: string;
  cost: number;
  filesize: string;
}

const useStockMediaSearch = (): UseQueryResult<StockMediaItem[]> => {
  // Implementation
};
```

## Monitoring and Debugging

### 1. React Query DevTools

```typescript
// Add to your app for development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 2. API Monitoring

```typescript
// Monitor API calls
const apiClient = new NehtwClient({
  baseURL: process.env.NEXT_PUBLIC_NEHTW_BASE_URL,
  onRequest: (config) => {
    console.log('API Request:', config);
  },
  onResponse: (response) => {
    console.log('API Response:', response);
  },
  onError: (error) => {
    console.error('API Error:', error);
  },
});
```

## Support and Resources

- **NEHTW API Documentation**: [https://nehtw.com/docs](https://nehtw.com/docs)
- **React Query Documentation**: [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
- **Next.js API Routes**: [https://nextjs.org/docs/api-routes/introduction](https://nextjs.org/docs/api-routes/introduction)

For additional support, please contact the development team or refer to the project's main README file.
