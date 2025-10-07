# Hooks Documentation

This guide covers all the custom React hooks in the Creo application, their parameters, return types, usage patterns, error handling, and performance considerations.

## Table of Contents

- [Stock Media Hooks](#stock-media-hooks)
- [AI Generation Hooks](#ai-generation-hooks)
- [Authentication Hooks](#authentication-hooks)
- [Utility Hooks](#utility-hooks)
- [Error Handling](#error-handling)
- [Performance Considerations](#performance-considerations)

## Stock Media Hooks

### useStockMediaSearch

Hook for searching stock media across multiple platforms.

#### Parameters

```typescript
interface UseStockMediaSearchOptions {
  query?: string;
  site?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}
```

#### Return Type

```typescript
interface UseStockMediaSearchReturn {
  data: {
    results: StockMediaItem[];
    total: number;
    page: number;
    hasMore: boolean;
  } | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  search: (options: SearchOptions) => void;
  clearSearch: () => void;
  refetch: () => void;
}

interface StockMediaItem {
  id: string;
  title: string;
  thumbnail: string;
  cost: number;
  filesize: string;
  site: string;
  tags: string[];
  dimensions: {
    width: number;
    height: number;
  };
}
```

#### Usage Example

```typescript
import { useStockMediaSearch } from '../hooks/useStockMediaIntegration';

function SearchComponent() {
  const {
    data: searchResults,
    isLoading,
    isError,
    error,
    search,
    clearSearch
  } = useStockMediaSearch({
    enabled: false // Don't search automatically
  });

  const handleSearch = (query: string, site: string) => {
    search({
      query,
      site,
      page: 1,
      limit: 20
    });
  };

  if (isLoading) return <div>Searching...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      <SearchInput onSearch={handleSearch} />
      {searchResults?.results.map(item => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### useStockInfo

Hook for fetching detailed information about a specific stock media item.

#### Parameters

```typescript
interface UseStockInfoOptions {
  site: string;
  id: string;
  url?: string;
  enabled?: boolean;
}
```

#### Return Type

```typescript
interface UseStockInfoReturn {
  data: {
    id: string;
    title: string;
    thumbnail: string;
    cost: number;
    filesize: string;
    site: string;
    description: string;
    tags: string[];
    dimensions: {
      width: number;
      height: number;
    };
    license: {
      type: string;
      restrictions: string[];
    };
  } | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
```

#### Usage Example

```typescript
import { useStockInfo } from '../hooks/useStockMediaIntegration';

function MediaDetailComponent({ site, id }: { site: string; id: string }) {
  const {
    data: mediaInfo,
    isLoading,
    isError,
    error
  } = useStockInfo({
    site,
    id,
    enabled: !!site && !!id
  });

  if (isLoading) return <MediaDetailSkeleton />;
  if (isError) return <ErrorMessage error={error} />;
  if (!mediaInfo) return <div>Media not found</div>;

  return (
    <div>
      <img src={mediaInfo.thumbnail} alt={mediaInfo.title} />
      <h2>{mediaInfo.title}</h2>
      <p>{mediaInfo.description}</p>
      <div>Cost: {mediaInfo.cost} EGP</div>
      <div>Size: {mediaInfo.filesize}</div>
    </div>
  );
}
```

### useCreateOrder

Hook for creating orders for stock media downloads.

#### Parameters

```typescript
interface UseCreateOrderOptions {
  onSuccess?: (data: CreateOrderResponse) => void;
  onError?: (error: Error) => void;
}

interface CreateOrderRequest {
  site: string;
  id: string;
}
```

#### Return Type

```typescript
interface UseCreateOrderReturn {
  mutate: (variables: CreateOrderRequest) => void;
  mutateAsync: (variables: CreateOrderRequest) => Promise<CreateOrderResponse>;
  data: CreateOrderResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  reset: () => void;
}

interface CreateOrderResponse {
  task_id: string;
  status: 'processing' | 'ready' | 'error';
  estimated_time: string;
}
```

#### Usage Example

```typescript
import { useCreateOrder } from '../hooks/useStockMediaIntegration';

function OrderButton({ site, id }: { site: string; id: string }) {
  const createOrder = useCreateOrder({
    onSuccess: (data) => {
      console.log('Order created:', data.task_id);
      // Redirect to order status page
      router.push(`/orders/${data.task_id}`);
    },
    onError: (error) => {
      console.error('Failed to create order:', error);
      toast.error('Failed to create order');
    }
  });

  const handleCreateOrder = () => {
    createOrder.mutate({ site, id });
  };

  return (
    <button 
      onClick={handleCreateOrder}
      disabled={createOrder.isLoading}
    >
      {createOrder.isLoading ? 'Creating Order...' : 'Create Order'}
    </button>
  );
}
```

### useOrderStatus

Hook for polling order status with automatic updates.

#### Parameters

```typescript
interface UseOrderStatusOptions {
  taskId: string;
  enabled?: boolean;
  refetchInterval?: number;
}
```

#### Return Type

```typescript
interface UseOrderStatusReturn {
  data: {
    task_id: string;
    status: 'pending' | 'processing' | 'ready' | 'error';
    progress: number;
    estimated_time?: string;
    download_url?: string;
    error_message?: string;
  } | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
```

#### Usage Example

```typescript
import { useOrderStatus } from '../hooks/useStockMediaIntegration';

function OrderStatusComponent({ taskId }: { taskId: string }) {
  const {
    data: orderStatus,
    isLoading,
    isError,
    error
  } = useOrderStatus({
    taskId,
    enabled: !!taskId,
    refetchInterval: 2000 // Poll every 2 seconds
  });

  if (isLoading) return <OrderStatusSkeleton />;
  if (isError) return <ErrorMessage error={error} />;
  if (!orderStatus) return <div>Order not found</div>;

  return (
    <div>
      <h3>Order Status: {orderStatus.status}</h3>
      {orderStatus.progress !== undefined && (
        <div>
          <div>Progress: {orderStatus.progress}%</div>
          <ProgressBar value={orderStatus.progress} />
        </div>
      )}
      {orderStatus.status === 'ready' && orderStatus.download_url && (
        <a href={orderStatus.download_url} download>
          Download Files
        </a>
      )}
    </div>
  );
}
```

### useDownloadLink

Hook for generating download links for completed orders.

#### Parameters

```typescript
interface UseDownloadLinkOptions {
  taskId: string;
  responseType?: 'any' | 'gdrive' | 'asia';
  enabled?: boolean;
}
```

#### Return Type

```typescript
interface UseDownloadLinkReturn {
  data: {
    downloadLink: string;
    fileName: string;
    linkType: string;
    expiresAt: string;
  } | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
```

#### Usage Example

```typescript
import { useDownloadLink } from '../hooks/useStockMediaIntegration';

function DownloadComponent({ taskId }: { taskId: string }) {
  const {
    data: downloadData,
    isLoading,
    isError,
    error
  } = useDownloadLink({
    taskId,
    responseType: 'gdrive',
    enabled: !!taskId
  });

  if (isLoading) return <div>Preparing download...</div>;
  if (isError) return <ErrorMessage error={error} />;
  if (!downloadData) return <div>Download not available</div>;

  return (
    <div>
      <a 
        href={downloadData.downloadLink}
        download={downloadData.fileName}
        className="download-button"
      >
        Download {downloadData.fileName}
      </a>
      <p>Link expires: {new Date(downloadData.expiresAt).toLocaleString()}</p>
    </div>
  );
}
```

## AI Generation Hooks

### useCreateAIJob

Hook for creating AI image generation jobs.

#### Parameters

```typescript
interface UseCreateAIJobOptions {
  onSuccess?: (data: CreateAIJobResponse) => void;
  onError?: (error: Error) => void;
}

interface CreateAIJobRequest {
  prompt: string;
  style?: 'realistic' | 'artistic' | 'abstract' | 'minimalist';
  quality?: 'standard' | 'high' | 'premium' | 'ultra';
  count?: number;
}
```

#### Return Type

```typescript
interface UseCreateAIJobReturn {
  mutate: (variables: CreateAIJobRequest) => void;
  mutateAsync: (variables: CreateAIJobRequest) => Promise<CreateAIJobResponse>;
  data: CreateAIJobResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  reset: () => void;
}

interface CreateAIJobResponse {
  job_id: string;
  status: 'generating' | 'completed' | 'failed';
  estimated_time: string;
}
```

#### Usage Example

```typescript
import { useCreateAIJob } from '../hooks/useAIGeneration';

function AIGenerationForm() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<'realistic' | 'artistic'>('realistic');

  const createJob = useCreateAIJob({
    onSuccess: (data) => {
      console.log('AI job created:', data.job_id);
      // Redirect to generation status page
      router.push(`/ai-generation/${data.job_id}`);
    },
    onError: (error) => {
      console.error('Failed to create AI job:', error);
      toast.error('Failed to create AI job');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJob.mutate({
      prompt,
      style,
      quality: 'high',
      count: 1
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the image you want to generate..."
      />
      <select value={style} onChange={(e) => setStyle(e.target.value)}>
        <option value="realistic">Realistic</option>
        <option value="artistic">Artistic</option>
      </select>
      <button type="submit" disabled={createJob.isLoading}>
        {createJob.isLoading ? 'Generating...' : 'Generate Image'}
      </button>
    </form>
  );
}
```

### useAIJobStatus

Hook for polling AI generation job status.

#### Parameters

```typescript
interface UseAIJobStatusOptions {
  jobId: string;
  enabled?: boolean;
  refetchInterval?: number;
}
```

#### Return Type

```typescript
interface UseAIJobStatusReturn {
  data: {
    job_id: string;
    status: 'generating' | 'completed' | 'failed';
    percentage_complete: number;
    files: {
      id: string;
      url: string;
      thumbnail: string;
    }[];
    error_message?: string;
  } | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
```

#### Usage Example

```typescript
import { useAIJobStatus } from '../hooks/useAIGeneration';

function AIJobStatusComponent({ jobId }: { jobId: string }) {
  const {
    data: jobStatus,
    isLoading,
    isError,
    error
  } = useAIJobStatus({
    jobId,
    enabled: !!jobId,
    refetchInterval: 2000 // Poll every 2 seconds
  });

  if (isLoading) return <AIJobStatusSkeleton />;
  if (isError) return <ErrorMessage error={error} />;
  if (!jobStatus) return <div>Job not found</div>;

  return (
    <div>
      <h3>Generation Status: {jobStatus.status}</h3>
      {jobStatus.percentage_complete !== undefined && (
        <div>
          <div>Progress: {jobStatus.percentage_complete}%</div>
          <ProgressBar value={jobStatus.percentage_complete} />
        </div>
      )}
      {jobStatus.status === 'completed' && jobStatus.files.length > 0 && (
        <div>
          <h4>Generated Images:</h4>
          {jobStatus.files.map((file) => (
            <div key={file.id}>
              <img src={file.thumbnail} alt="Generated image" />
              <a href={file.url} download>Download</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### useAIActions

Hook for performing actions on AI-generated images (vary, upscale).

#### Parameters

```typescript
interface UseAIActionsOptions {
  onSuccess?: (data: AIActionResponse) => void;
  onError?: (error: Error) => void;
}

interface AIActionRequest {
  action: 'vary' | 'upscale';
  index: number;
  vary_type?: 'strong' | 'subtle';
}
```

#### Return Type

```typescript
interface UseAIActionsReturn {
  mutate: (variables: AIActionRequest) => void;
  mutateAsync: (variables: AIActionRequest) => Promise<AIActionResponse>;
  data: AIActionResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  reset: () => void;
}

interface AIActionResponse {
  action_id: string;
  status: 'processing' | 'completed' | 'failed';
  result_url?: string;
}
```

#### Usage Example

```typescript
import { useAIActions } from '../hooks/useAIGeneration';

function AIActionButtons({ imageId, index }: { imageId: string; index: number }) {
  const aiActions = useAIActions({
    onSuccess: (data) => {
      console.log('Action completed:', data.action_id);
      toast.success('Action completed successfully');
    },
    onError: (error) => {
      console.error('Action failed:', error);
      toast.error('Action failed');
    }
  });

  const handleVary = (type: 'strong' | 'subtle') => {
    aiActions.mutate({
      action: 'vary',
      index,
      vary_type: type
    });
  };

  const handleUpscale = () => {
    aiActions.mutate({
      action: 'upscale',
      index
    });
  };

  return (
    <div>
      <button 
        onClick={() => handleVary('strong')}
        disabled={aiActions.isLoading}
      >
        Vary (Strong)
      </button>
      <button 
        onClick={() => handleVary('subtle')}
        disabled={aiActions.isLoading}
      >
        Vary (Subtle)
      </button>
      <button 
        onClick={handleUpscale}
        disabled={aiActions.isLoading}
      >
        Upscale
      </button>
    </div>
  );
}
```

### useAccountBalance

Hook for fetching user account balance and information.

#### Parameters

```typescript
interface UseAccountBalanceOptions {
  enabled?: boolean;
  staleTime?: number;
}
```

#### Return Type

```typescript
interface UseAccountBalanceReturn {
  data: {
    username: string;
    balance: number;
    credits_used: number;
    credits_remaining: number;
    subscription_status: string;
  } | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
```

#### Usage Example

```typescript
import { useAccountBalance } from '../hooks/useAIGeneration';

function AccountInfo() {
  const {
    data: accountInfo,
    isLoading,
    isError,
    error
  } = useAccountBalance({
    enabled: true,
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });

  if (isLoading) return <AccountInfoSkeleton />;
  if (isError) return <ErrorMessage error={error} />;
  if (!accountInfo) return <div>Account not found</div>;

  return (
    <div>
      <h3>Welcome, {accountInfo.username}</h3>
      <div>Balance: {accountInfo.balance} credits</div>
      <div>Used: {accountInfo.credits_used} credits</div>
      <div>Remaining: {accountInfo.credits_remaining} credits</div>
      <div>Status: {accountInfo.subscription_status}</div>
    </div>
  );
}
```

## Authentication Hooks

### useAuth

Hook for authentication state and methods.

#### Return Type

```typescript
interface UseAuthReturn {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  signInWithProvider: (provider: 'google' | 'facebook' | 'github' | 'twitter') => Promise<{ data: any; error: any }>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  updatePassword: (password: string) => Promise<{ data: any; error: any }>;
}
```

#### Usage Example

```typescript
import { useAuth } from '../contexts/AuthContext';

function AuthComponent() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user) {
    return (
      <div>
        <p>Welcome, {user.email}</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => signIn('user@example.com', 'password')}>
        Sign In
      </button>
    </div>
  );
}
```

## Utility Hooks

### useDebounce

Hook for debouncing values to prevent excessive API calls.

#### Parameters

```typescript
interface UseDebounceOptions {
  delay?: number;
}
```

#### Return Type

```typescript
function useDebounce<T>(value: T, options?: UseDebounceOptions): T;
```

#### Usage Example

```typescript
import { useDebounce } from '../hooks/useDebounce';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, { delay: 500 });

  useEffect(() => {
    if (debouncedQuery) {
      // Perform search with debounced query
      searchMedia(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search media..."
    />
  );
}
```

### useLocalStorage

Hook for managing localStorage with React state.

#### Parameters

```typescript
interface UseLocalStorageOptions {
  defaultValue?: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}
```

#### Return Type

```typescript
function useLocalStorage<T>(
  key: string, 
  options?: UseLocalStorageOptions
): [T, (value: T) => void, () => void];
```

#### Usage Example

```typescript
import { useLocalStorage } from '../hooks/useLocalStorage';

function PreferencesComponent() {
  const [theme, setTheme, clearTheme] = useLocalStorage('theme', {
    defaultValue: 'light'
  });

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <button onClick={clearTheme}>Reset Theme</button>
    </div>
  );
}
```

## Error Handling

### Error Types

```typescript
interface APIError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

interface NetworkError {
  message: string;
  type: 'network' | 'timeout' | 'cors';
}

interface ValidationError {
  message: string;
  field: string;
  value: unknown;
}
```

### Error Handling Patterns

```typescript
// Global error handling
const { data, error, isError } = useQuery();

if (isError) {
  if (error instanceof APIError) {
    // Handle API errors
    console.error('API Error:', error.message);
  } else if (error instanceof NetworkError) {
    // Handle network errors
    console.error('Network Error:', error.message);
  } else {
    // Handle unknown errors
    console.error('Unknown Error:', error);
  }
}

// Retry logic
const { data, error, refetch } = useQuery({
  retry: (failureCount, error) => {
    if (error.status === 404) return false; // Don't retry 404s
    return failureCount < 3; // Retry up to 3 times
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
});
```

### Error Boundaries

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## Performance Considerations

### Query Optimization

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

// Background refetching
const { data } = useQuery({
  queryKey: ['orders'],
  queryFn: fetchOrders,
  refetchInterval: 30000, // Refetch every 30 seconds
  refetchIntervalInBackground: true
});
```

### Memory Management

```typescript
// Cleanup on unmount
useEffect(() => {
  const subscription = subscribeToUpdates();
  
  return () => {
    subscription.unsubscribe();
  };
}, []);

// Optimize re-renders
const memoizedData = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

const memoizedCallback = useCallback(() => {
  handleClick(id);
}, [id]);
```

### Bundle Optimization

```typescript
// Dynamic imports for code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Conditional loading
const { data: user } = useAuth();
const shouldLoadData = !!user;

const { data } = useQuery({
  queryKey: ['userData'],
  queryFn: fetchUserData,
  enabled: shouldLoadData // Only run when user is authenticated
});
```

## Best Practices

### 1. Hook Design

- Keep hooks focused on a single responsibility
- Use TypeScript for type safety
- Provide sensible defaults
- Handle loading and error states

### 2. Performance

- Use React.memo for expensive components
- Implement proper cleanup
- Optimize re-renders with useMemo and useCallback
- Use dynamic imports for code splitting

### 3. Error Handling

- Provide meaningful error messages
- Implement retry logic where appropriate
- Use error boundaries for graceful failures
- Log errors for debugging

### 4. Testing

```typescript
// Test hooks with React Testing Library
import { renderHook, act } from '@testing-library/react-hooks';
import { useStockMediaSearch } from '../hooks/useStockMediaIntegration';

test('should search for media', async () => {
  const { result } = renderHook(() => useStockMediaSearch());

  act(() => {
    result.current.search({ query: 'nature', site: 'shutterstock' });
  });

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.data).toBeDefined();
});
```

For more examples and advanced usage patterns, refer to the individual hook files in the `src/hooks` directory.
