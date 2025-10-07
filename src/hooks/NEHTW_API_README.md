# nehtw API Integration with React Query

This document describes the comprehensive React Query hooks for integrating with the nehtw API for stock media, orders, downloads, and AI image generation.

## Overview

The nehtw API integration provides a complete solution for:
- **Stock Media Search**: Search and browse stock media from multiple sources
- **Order Management**: Create and track orders for stock media
- **Download Management**: Generate and manage download links
- **AI Image Generation**: Generate images using AI with real-time status tracking

## API Client Setup

The centralized API client is configured to work with the nehtw API:

```typescript
// src/lib/api-client.ts
const apiClient = new ApiClient(`${process.env.NEXT_PUBLIC_NEHTW_BASE_URL}?apikey=${process.env.NEXT_PUBLIC_NEHTW_API_KEY}`);
```

## Available Hooks

### 1. Stock Media Search

#### `useStockMediaSearch`
Search for stock media with advanced filtering options.

```typescript
import { useStockMediaSearch } from '../hooks';

const { data, isLoading, error } = useStockMediaSearch({
  query: 'nature landscape',
  page: 1,
  pageSize: 20,
  type: 'image',
  category: 'nature',
  sortBy: 'relevance'
});
```

**Features:**
- Advanced search parameters (query, type, category, price range)
- Pagination support
- Caching with 5-minute stale time
- Automatic retry on failure
- Real-time search suggestions

#### `useStockMediaSearchInfinite`
Infinite scroll support for large result sets.

```typescript
import { useStockMediaSearchInfinite } from '../hooks';

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useStockMediaSearchInfinite({
  query: 'business people',
  type: 'image'
});
```

### 2. Order Management

#### `useCreateOrder`
Create orders for stock media with payment processing.

```typescript
import { useCreateOrder } from '../hooks';

const createOrderMutation = useCreateOrder();

const handleCreateOrder = async (mediaItem) => {
  const result = await createOrderMutation.mutateAsync({
    siteId: 'default',
    stockId: mediaItem.id,
    quantity: 1,
    paymentMethod: 'credit_card'
  });
  // result.taskId for tracking
};
```

**Features:**
- Automatic order creation
- Payment method selection
- Billing address support
- Order validation
- Error handling with retry logic

#### `useCreateBatchOrder`
Create multiple orders in a single request.

```typescript
import { useCreateBatchOrder } from '../hooks';

const batchOrderMutation = useCreateBatchOrder();

const handleBatchOrder = async (mediaItems) => {
  const orders = mediaItems.map(item => ({
    siteId: 'default',
    stockId: item.id,
    quantity: 1
  }));
  
  const results = await batchOrderMutation.mutateAsync(orders);
};
```

### 3. Order Status Tracking

#### `useOrderStatus`
Real-time order status tracking with automatic polling.

```typescript
import { useOrderStatus } from '../hooks';

const { data: orderStatus, isLoading } = useOrderStatus(taskId, {
  refetchInterval: 2000, // Poll every 2 seconds
  enabled: !!taskId
});
```

**Features:**
- Real-time status updates
- Progress tracking (0-100%)
- Automatic polling until completion
- Error state handling
- Download link generation when ready

#### `useMultipleOrderStatus`
Track multiple orders simultaneously.

```typescript
import { useMultipleOrderStatus } from '../hooks';

const { data: orderStatuses } = useMultipleOrderStatus(['task1', 'task2', 'task3']);
```

#### `useOrderHistory`
Retrieve order history with filtering.

```typescript
import { useOrderHistory } from '../hooks';

const { data: history } = useOrderHistory({
  page: 1,
  limit: 20,
  status: 'completed',
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});
```

### 4. Download Management

#### `useDownloadLink`
Generate download links for completed orders.

```typescript
import { useDownloadLink } from '../hooks';

const { data: downloadLink } = useDownloadLink({
  taskId: 'order-task-id',
  responseType: 'original',
  quality: 'high'
});
```

**Features:**
- Multiple download formats (original, compressed, thumbnail)
- Quality options (low, medium, high, original)
- Watermark support
- Download expiration tracking
- Usage statistics

#### `useDownloadStats`
Track download usage and limits.

```typescript
import { useDownloadStats } from '../hooks';

const { data: stats } = useDownloadStats(downloadId, {
  refetchInterval: 10000 // Poll every 10 seconds
});
```

#### `useDownloadFile`
Direct file download with progress tracking.

```typescript
import { useDownloadFile } from '../hooks';

const downloadMutation = useDownloadFile();

const handleDownload = async (downloadUrl) => {
  await downloadMutation.mutateAsync(downloadUrl);
};
```

#### `useBatchDownload`
Download multiple files simultaneously.

```typescript
import { useBatchDownload } from '../hooks';

const batchDownloadMutation = useBatchDownload();

const handleBatchDownload = async (downloadUrls) => {
  await batchDownloadMutation.mutateAsync(downloadUrls);
};
```

### 5. AI Image Generation

#### `useAIGenerate`
Generate images using AI with advanced parameters.

```typescript
import { useAIGenerate } from '../hooks';

const aiGenerateMutation = useAIGenerate();

const handleGenerate = async () => {
  const result = await aiGenerateMutation.mutateAsync({
    prompt: 'A beautiful sunset over mountains',
    style: 'realistic',
    size: '1024x1024',
    quality: 'hd',
    aspectRatio: '16:9'
  });
  // result.jobId for tracking
};
```

**Features:**
- Multiple art styles (realistic, artistic, cartoon, anime)
- Various image sizes and aspect ratios
- Quality settings (standard, hd, ultra)
- Negative prompts for better control
- Seed and guidance parameters

#### `useAIGenerationStatus`
Real-time AI generation status tracking.

```typescript
import { useAIGenerationStatus } from '../hooks';

const { data: aiStatus } = useAIGenerationStatus(jobId, {
  refetchInterval: 2000 // Poll every 2 seconds
});
```

**Features:**
- Progress tracking (0-100%)
- Queue position display
- Estimated completion time
- Real-time status updates
- Error handling

#### `useAIGenerationHistory`
Retrieve AI generation history.

```typescript
import { useAIGenerationHistory } from '../hooks';

const { data: history } = useAIGenerationHistory({
  page: 1,
  limit: 20,
  status: 'completed'
});
```

#### `useCancelAIGeneration`
Cancel ongoing AI generation jobs.

```typescript
import { useCancelAIGeneration } from '../hooks';

const cancelMutation = useCancelAIGeneration();

const handleCancel = async (jobId) => {
  await cancelMutation.mutateAsync(jobId);
};
```

#### `useDownloadAIGeneratedImage`
Download AI-generated images.

```typescript
import { useDownloadAIGeneratedImage } from '../hooks';

const downloadMutation = useDownloadAIGeneratedImage();

const handleDownload = async (imageUrl) => {
  await downloadMutation.mutateAsync(imageUrl);
};
```

## Error Handling

All hooks include comprehensive error handling:

- **Network errors**: Automatic retry with exponential backoff
- **API errors**: Detailed error messages with status codes
- **Validation errors**: Client-side validation with user-friendly messages
- **Timeout handling**: Configurable timeouts for long-running operations

## Caching Strategy

React Query provides intelligent caching:

- **Search results**: 5-minute cache with background updates
- **Order status**: 30-second cache with real-time polling
- **Download links**: 5-minute cache with usage tracking
- **AI generation**: 30-second cache with progress updates

## Performance Optimizations

- **Parallel requests**: Multiple API calls executed simultaneously
- **Background updates**: Automatic data refresh without user interaction
- **Optimistic updates**: Immediate UI updates with rollback on failure
- **Memory management**: Automatic cleanup of unused data

## Usage Example

```typescript
import React, { useState } from 'react';
import {
  useStockMediaSearch,
  useCreateOrder,
  useOrderStatus,
  useDownloadLink,
  useAIGenerate,
  useAIGenerationStatus
} from '../hooks';

export default function MediaBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [orderTaskId, setOrderTaskId] = useState(null);
  const [aiJobId, setAiJobId] = useState(null);
  
  // Search for media
  const { data: searchResults, isLoading } = useStockMediaSearch({
    query: searchQuery,
    page: 1,
    pageSize: 20
  });
  
  // Create order
  const createOrderMutation = useCreateOrder();
  
  // Track order status
  const { data: orderStatus } = useOrderStatus(orderTaskId, {
    enabled: !!orderTaskId
  });
  
  // Get download link when ready
  const { data: downloadLink } = useDownloadLink({
    taskId: orderTaskId,
    responseType: 'original'
  }, {
    enabled: !!orderTaskId && orderStatus?.status === 'ready'
  });
  
  // AI generation
  const aiGenerateMutation = useAIGenerate();
  const { data: aiStatus } = useAIGenerationStatus(aiJobId, {
    enabled: !!aiJobId
  });
  
  const handleOrder = async (mediaItem) => {
    const result = await createOrderMutation.mutateAsync({
      siteId: 'default',
      stockId: mediaItem.id,
      quantity: 1
    });
    setOrderTaskId(result.taskId);
  };
  
  const handleAIGenerate = async (prompt) => {
    const result = await aiGenerateMutation.mutateAsync({
      prompt,
      style: 'realistic',
      size: '1024x1024'
    });
    setAiJobId(result.jobId);
  };
  
  return (
    <div>
      {/* Search interface */}
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for media..."
      />
      
      {/* Search results */}
      {searchResults?.results.map(item => (
        <div key={item.id}>
          <img src={item.thumbnail} alt={item.title} />
          <h3>{item.title}</h3>
          <p>${item.cost}</p>
          <button onClick={() => handleOrder(item)}>
            Order
          </button>
        </div>
      ))}
      
      {/* Order status */}
      {orderStatus && (
        <div>
          <p>Status: {orderStatus.status}</p>
          {orderStatus.progress && (
            <div>Progress: {orderStatus.progress}%</div>
          )}
        </div>
      )}
      
      {/* Download link */}
      {downloadLink && (
        <a href={downloadLink.downloadLink} download>
          Download
        </a>
      )}
      
      {/* AI generation */}
      <button onClick={() => handleAIGenerate('A beautiful landscape')}>
        Generate AI Image
      </button>
      
      {/* AI status */}
      {aiStatus && (
        <div>
          <p>AI Status: {aiStatus.status}</p>
          {aiStatus.progress && (
            <div>Progress: {aiStatus.progress}%</div>
          )}
          {aiStatus.result && (
            <img src={aiStatus.result.thumbnailUrl} alt="Generated" />
          )}
        </div>
      )}
    </div>
  );
}
```

## TypeScript Support

All hooks are fully typed with comprehensive interfaces:

- **Request parameters**: Type-safe input validation
- **Response data**: Detailed type definitions
- **Error handling**: Typed error objects with status codes
- **Loading states**: Boolean flags for UI state management

## Best Practices

1. **Use enabled option**: Only run queries when necessary
2. **Handle loading states**: Show appropriate UI feedback
3. **Implement error boundaries**: Catch and handle errors gracefully
4. **Optimize polling**: Use appropriate refetch intervals
5. **Clean up resources**: Cancel ongoing requests when components unmount
6. **Use mutations for actions**: Separate read and write operations
7. **Implement optimistic updates**: Provide immediate feedback for better UX

## Environment Variables

Add these to your `.env.local`:

```env
NEXT_PUBLIC_NEHTW_API_KEY=your_api_key_here
NEXT_PUBLIC_API_BASE_URL=https://nehtw.com/api/me
```

## Dependencies

Required packages:

```json
{
  "@tanstack/react-query": "^5.0.0",
  "axios": "^1.6.0"
}
```

## Support

For issues or questions about the nehtw API integration:

1. Check the API documentation
2. Review error messages in the browser console
3. Verify API key configuration
4. Check network connectivity
5. Review rate limiting and quota usage
