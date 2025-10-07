# Order Status Polling React Query Hook

A comprehensive React Query hook that polls order status every 2 seconds until completion, with robust loading and error state handling, progress tracking, and advanced polling features.

## Features

- 🔄 **Automatic Polling**: Polls every 2 seconds until completion
- 📊 **Progress Tracking**: Real-time progress updates with percentage
- ⏱️ **Time Management**: Configurable polling intervals and maximum polling time
- 🛡️ **Error Handling**: Comprehensive error handling with retry logic
- 🎯 **Smart Stopping**: Automatic stop on completion, error, or timeout
- 📱 **Multiple Orders**: Support for polling multiple orders simultaneously
- ⚡ **Performance Optimized**: Efficient polling with background updates
- 🎨 **TypeScript Support**: Full type safety with detailed interfaces

## Installation

```bash
npm install @tanstack/react-query axios
```

## Basic Usage

```typescript
import { useOrderStatusPolling } from './hooks/useOrderStatusPolling';

function OrderStatusComponent() {
  const {
    data: orderStatus,
    isLoading,
    isError,
    error,
    isPolling,
    pollingTime,
    stopPolling,
    startPolling,
  } = useOrderStatusPolling('task-123', {
    refetchInterval: 2000, // Poll every 2 seconds
    maxPollingTime: 30 * 60 * 1000, // 30 minutes max
    stopOnCompletion: true,
    stopOnError: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>Order Status: {orderStatus?.status}</h3>
      <p>Progress: {orderStatus?.progress}%</p>
      <p>Polling: {isPolling ? 'Active' : 'Stopped'}</p>
      <p>Time: {Math.floor(pollingTime / 1000)}s</p>
      
      <button onClick={stopPolling}>Stop Polling</button>
      <button onClick={startPolling}>Start Polling</button>
    </div>
  );
}
```

## API Reference

### `useOrderStatusPolling`

Main hook for polling order status with automatic interval management.

```typescript
const {
  data: orderStatus,
  isLoading,
  isError,
  error,
  isPolling,
  pollingTime,
  stopPolling,
  startPolling,
} = useOrderStatusPolling(taskId: string, options?: OrderStatusPollingOptions);
```

#### Parameters

**taskId: string** - The task ID to poll for status

**OrderStatusPollingOptions:**
- `enabled?: boolean` - Enable/disable polling (default: true)
- `refetchInterval?: number | false` - Polling interval in ms (default: 2000)
- `refetchIntervalInBackground?: boolean` - Continue polling in background (default: true)
- `refetchOnWindowFocus?: boolean` - Refetch when window gains focus (default: true)
- `staleTime?: number` - Time before data is considered stale (default: 30000)
- `cacheTime?: number` - Time to keep data in cache (default: 300000)
- `retry?: boolean | number` - Retry configuration (default: true)
- `retryDelay?: number | ((attemptIndex: number) => number)` - Retry delay function
- `onStatusChange?: (status: OrderStatus) => void` - Status change callback
- `onCompletion?: (status: OrderStatus) => void` - Completion callback
- `onError?: (error: OrderStatusError) => void` - Error callback
- `maxPollingTime?: number` - Maximum polling time in ms (default: 1800000)
- `stopOnError?: boolean` - Stop polling on error (default: true)
- `stopOnCompletion?: boolean` - Stop polling when completed (default: true)

#### Returns

- `data: OrderStatus | undefined` - Current order status
- `isLoading: boolean` - Initial loading state
- `isError: boolean` - Error state
- `error: OrderStatusError | null` - Error object
- `isPolling: boolean` - Whether currently polling
- `pollingTime: number` - Time spent polling in ms
- `stopPolling: () => void` - Stop polling manually
- `startPolling: () => void` - Start polling manually

### `useOrderStatusWithProgress`

Hook with enhanced progress tracking and completion detection.

```typescript
const {
  data: orderStatus,
  isLoading,
  isError,
  error,
  isPolling,
  pollingTime,
  stopPolling,
  startPolling,
  progress,
  estimatedTimeRemaining,
  isComplete,
  isError: isCompleteError,
} = useOrderStatusWithProgress(taskId: string, options?: OrderStatusPollingOptions);
```

#### Additional Returns

- `progress: number` - Current progress percentage (0-100)
- `estimatedTimeRemaining: number | null` - Estimated time remaining in ms
- `isComplete: boolean` - Whether order is completed
- `isError: boolean` - Whether order has errored

### `useOrderStatusPollingWithIntervals`

Hook with custom polling intervals based on order status.

```typescript
const {
  data: orderStatus,
  isLoading,
  isError,
  error,
  isPolling,
  pollingTime,
  stopPolling,
  startPolling,
} = useOrderStatusPollingWithIntervals(
  taskId: string,
  intervals: {
    initial?: number;
    processing?: number;
    ready?: number;
    error?: number;
  },
  options?: OrderStatusPollingOptions
);
```

#### Intervals

- `initial: number` - Polling interval for pending status (default: 1000ms)
- `processing: number` - Polling interval for processing status (default: 2000ms)
- `ready: number` - Polling interval for ready status (default: 5000ms)
- `error: number` - Polling interval for error status (default: 10000ms)

### `useMultipleOrderStatusPolling`

Hook for polling multiple orders simultaneously.

```typescript
const multipleOrderStatuses = useMultipleOrderStatusPolling(
  taskIds: string[],
  options?: OrderStatusPollingOptions
);
```

#### Returns

- `Record<string, OrderStatusResult>` - Status for each task ID

## Data Types

### `OrderStatus`

```typescript
interface OrderStatus {
  orderId: string;
  taskId: string;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'error' | 'cancelled' | 'failed';
  progress: number; // 0-100
  message?: string;
  estimatedCompletionTime?: string;
  actualCompletionTime?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  metadata?: {
    processingStage?: string;
    currentStep?: string;
    totalSteps?: number;
    completedSteps?: number;
    queuePosition?: number;
    estimatedWaitTime?: number;
  };
  result?: {
    downloadUrl?: string;
    downloadExpiresAt?: string;
    fileSize?: number;
    fileName?: string;
    checksum?: string;
    previewUrl?: string;
    thumbnailUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

### `OrderStatusError`

```typescript
interface OrderStatusError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
  retryable?: boolean;
}
```

## Advanced Usage

### Custom Polling Intervals

```typescript
const {
  data: orderStatus,
  isPolling,
  pollingTime,
} = useOrderStatusPollingWithIntervals('task-123', {
  initial: 1000,      // 1 second for pending
  processing: 2000,    // 2 seconds for processing
  ready: 5000,         // 5 seconds for ready
  error: 10000,        // 10 seconds for error
}, {
  maxPollingTime: 30 * 60 * 1000, // 30 minutes max
  stopOnCompletion: true,
  stopOnError: true,
});
```

### Progress Tracking

```typescript
const {
  data: orderStatus,
  progress,
  estimatedTimeRemaining,
  isComplete,
  isError,
} = useOrderStatusWithProgress('task-123', {
  onStatusChange: (status) => {
    console.log('Status changed:', status.status);
    console.log('Progress:', status.progress + '%');
  },
  onCompletion: (status) => {
    console.log('Order completed:', status);
  },
  onError: (error) => {
    console.error('Polling error:', error);
  },
});

// Display progress bar
<div className="w-full bg-gray-700 rounded-full h-3">
  <div
    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

### Multiple Order Polling

```typescript
const taskIds = ['task-1', 'task-2', 'task-3'];
const multipleOrderStatuses = useMultipleOrderStatusPolling(taskIds, {
  refetchInterval: 2000,
  maxPollingTime: 30 * 60 * 1000,
  stopOnCompletion: true,
  stopOnError: true,
});

// Access individual order statuses
taskIds.forEach(taskId => {
  const status = multipleOrderStatuses[taskId];
  if (status?.data) {
    console.log(`Order ${taskId}: ${status.data.status}`);
  }
});
```

### Manual Control

```typescript
const {
  data: orderStatus,
  isPolling,
  pollingTime,
  stopPolling,
  startPolling,
} = useOrderStatusPolling('task-123', {
  enabled: false, // Start disabled
  refetchInterval: 2000,
});

// Manual control
const handleStartPolling = () => {
  startPolling();
};

const handleStopPolling = () => {
  stopPolling();
};

return (
  <div>
    <p>Status: {orderStatus?.status}</p>
    <p>Polling: {isPolling ? 'Active' : 'Stopped'}</p>
    <p>Time: {Math.floor(pollingTime / 1000)}s</p>
    
    <button onClick={handleStartPolling} disabled={isPolling}>
      Start Polling
    </button>
    <button onClick={handleStopPolling} disabled={!isPolling}>
      Stop Polling
    </button>
  </div>
);
```

### Error Handling

```typescript
const {
  data: orderStatus,
  isError,
  error,
  isPolling,
} = useOrderStatusPolling('task-123', {
  onError: (error) => {
    switch (error.code) {
      case 'NETWORK_ERROR':
        showToast('Network error. Please check your connection.', 'error');
        break;
      case 'HTTP_404':
        showToast('Order not found.', 'error');
        break;
      case 'HTTP_500':
        showToast('Server error. Please try again later.', 'error');
        break;
      default:
        showToast('Polling error. Please try again.', 'error');
    }
  },
  retry: (failureCount, error) => {
    // Don't retry on client errors
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      return false;
    }
    // Retry up to 3 times for server errors
    return failureCount < 3;
  },
});
```

### Custom Callbacks

```typescript
const {
  data: orderStatus,
  isPolling,
  pollingTime,
} = useOrderStatusPolling('task-123', {
  onStatusChange: (status) => {
    console.log('Status changed:', status.status);
    
    // Update UI based on status
    if (status.status === 'processing') {
      showProgressIndicator();
    } else if (status.status === 'ready') {
      showCompletionMessage();
    }
  },
  onCompletion: (status) => {
    console.log('Order completed:', status);
    
    // Handle completion
    if (status.result?.downloadUrl) {
      showDownloadLink(status.result.downloadUrl);
    }
  },
  onError: (error) => {
    console.error('Polling error:', error);
    
    // Handle error
    showErrorMessage(error.message);
  },
});
```

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://api.stockmedia.com/v1
NEXT_PUBLIC_API_KEY=your_api_key_here
```

### API Client Configuration

The hook uses a configured Axios instance with:
- 30-second timeout
- Automatic retry logic
- Error handling
- Request/response interceptors
- Authentication headers

## Performance Optimizations

### Polling Strategy

- **Smart Intervals**: Different polling intervals based on order status
- **Background Updates**: Continue polling when tab is not active
- **Automatic Stopping**: Stop polling on completion, error, or timeout
- **Memory Management**: Automatic cleanup of unused queries

### Caching Strategy

- **Order Status**: 30-second stale time with background updates
- **Progress Data**: Real-time updates with efficient caching
- **Error States**: Proper error handling with retry logic

## Best Practices

1. **Use appropriate intervals**: Adjust polling intervals based on order complexity
2. **Handle errors gracefully**: Show user-friendly error messages
3. **Implement timeouts**: Set maximum polling time to prevent infinite polling
4. **Clean up resources**: Stop polling when components unmount
5. **Use progress indicators**: Show progress bars and status updates
6. **Implement manual control**: Allow users to start/stop polling
7. **Handle multiple orders**: Use batch polling for efficiency

## Examples

### Complete Order Status Component

```typescript
function OrderStatusComponent({ taskId }: { taskId: string }) {
  const {
    data: orderStatus,
    isLoading,
    isError,
    error,
    isPolling,
    pollingTime,
    stopPolling,
    startPolling,
  } = useOrderStatusPolling(taskId, {
    refetchInterval: 2000,
    maxPollingTime: 30 * 60 * 1000,
    stopOnCompletion: true,
    stopOnError: true,
    onStatusChange: (status) => {
      console.log('Status changed:', status.status);
    },
    onCompletion: (status) => {
      console.log('Order completed:', status);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading order status...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-600">{error?.message}</p>
        <button
          onClick={startPolling}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Order Status</h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-sm ${
            isPolling ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isPolling ? 'Polling' : 'Stopped'}
          </span>
          <span className="text-sm text-gray-600">
            {Math.floor(pollingTime / 1000)}s
          </span>
        </div>
      </div>

      {orderStatus && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Status:</span>
            <span className={`px-2 py-1 rounded text-sm ${
              orderStatus.status === 'completed' ? 'bg-green-100 text-green-800' :
              orderStatus.status === 'error' ? 'bg-red-100 text-red-800' :
              orderStatus.status === 'processing' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {orderStatus.status}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Progress:</span>
            <span>{orderStatus.progress}%</span>
          </div>

          {orderStatus.message && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Message:</span>
              <span className="text-gray-600">{orderStatus.message}</span>
            </div>
          )}

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${orderStatus.progress}%` }}
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={startPolling}
              disabled={isPolling}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Start Polling
            </button>
            <button
              onClick={stopPolling}
              disabled={!isPolling}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              Stop Polling
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Progress Tracking Component

```typescript
function ProgressTrackingComponent({ taskId }: { taskId: string }) {
  const {
    data: orderStatus,
    progress,
    estimatedTimeRemaining,
    isComplete,
    isError,
    isPolling,
    pollingTime,
  } = useOrderStatusWithProgress(taskId, {
    refetchInterval: 2000,
    maxPollingTime: 30 * 60 * 1000,
    stopOnCompletion: true,
    stopOnError: true,
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Order Progress</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Progress:</span>
          <span className="text-2xl font-bold text-blue-600">{progress}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Complete:</span>
            <span className={`ml-2 ${isComplete ? 'text-green-600' : 'text-gray-600'}`}>
              {isComplete ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="font-medium">Error:</span>
            <span className={`ml-2 ${isError ? 'text-red-600' : 'text-gray-600'}`}>
              {isError ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {estimatedTimeRemaining && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Time Remaining:</span>
            <span className="ml-2">
              {Math.floor(estimatedTimeRemaining / 1000)} seconds
            </span>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <span className="font-medium">Polling Time:</span>
          <span className="ml-2">{Math.floor(pollingTime / 1000)}s</span>
        </div>
      </div>
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **Polling not starting**: Check if `enabled` option is set to true
2. **Polling not stopping**: Verify `stopOnCompletion` and `stopOnError` options
3. **Memory leaks**: Ensure proper cleanup when components unmount
4. **Rate limiting**: Implement appropriate retry logic with backoff
5. **Network errors**: Check internet connection and API endpoint

### Debug Mode

Enable debug mode to see polling states:

```typescript
const {
  data: orderStatus,
  isPolling,
  pollingTime,
} = useOrderStatusPolling(taskId, {
  onStatusChange: (status) => console.log('Status changed:', status),
  onCompletion: (status) => console.log('Order completed:', status),
  onError: (error) => console.error('Polling error:', error),
});
```

## Support

For issues or questions:

1. Check the React Query documentation
2. Review error messages in the browser console
3. Verify API configuration and endpoints
4. Check network connectivity and API limits
5. Review polling intervals and timeout settings
