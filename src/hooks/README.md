# Creo API Hooks

This directory contains React Query hooks for integrating with the nehtw API. All hooks are built with TypeScript and include comprehensive error handling, loading states, and caching.

## Installation

Make sure you have the required dependencies:

```bash
npm install @tanstack/react-query axios
```

## Setup

1. Install React Query provider in your app:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  );
}
```

2. Set up environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.nehtw.com/v1
```

## Hooks Overview

### Credits Hooks

#### `useCredits(userId, options?)`
Fetches user credit balance with auto-refresh.

```tsx
const { data: credits, isLoading, error } = useCredits('user-123', {
  enabled: true,
  refetchInterval: 30000, // Refetch every 30 seconds
});
```

#### `useRefreshCredits(userId)`
Manually refresh credit balance.

```tsx
const refreshCredits = useRefreshCredits('user-123');
// Call refreshCredits.mutate() to refresh
```

#### `usePurchaseCredits(userId)`
Purchase additional credits.

```tsx
const purchaseCredits = usePurchaseCredits('user-123');
purchaseCredits.mutate({
  amount: 50,
  paymentMethod: 'credit_card',
});
```

#### `useCreditHistory(userId, options?)`
Get credit transaction history.

```tsx
const { data: history } = useCreditHistory('user-123', {
  page: 1,
  limit: 20,
  type: 'purchase',
});
```

### Media Search Hooks

#### `useMediaSearch(params, options?)`
Search for media with pagination.

```tsx
const { data: results, isLoading } = useMediaSearch({
  query: 'nature landscape',
  page: 1,
  limit: 20,
  type: 'image',
  category: 'photography',
}, {
  enabled: true,
  staleTime: 300000, // 5 minutes
});
```

#### `useInfiniteMediaSearch(baseParams, options?)`
Infinite scroll media search.

```tsx
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteMediaSearch({
  query: 'business',
  type: 'image',
});
```

#### `useMediaItem(mediaId, options?)`
Get specific media item details.

```tsx
const { data: mediaItem } = useMediaItem('media-123');
```

#### `useRelatedMedia(mediaId, options?)`
Get related media items.

```tsx
const { data: related } = useRelatedMedia('media-123', {
  limit: 10,
});
```

#### `useTrendingMedia(options?)`
Get trending media.

```tsx
const { data: trending } = useTrendingMedia({
  type: 'image',
  limit: 10,
  period: 'week',
});
```

#### `useMediaCategories()`
Get available media categories.

```tsx
const { data: categories } = useMediaCategories();
```

#### `useMediaSources()`
Get available media sources.

```tsx
const { data: sources } = useMediaSources();
```

### Orders Hooks

#### `useCreateOrder(userId)`
Create a new order.

```tsx
const createOrder = useCreateOrder('user-123');
createOrder.mutate({
  items: [
    {
      mediaId: 'media-123',
      quantity: 1,
      price: 15,
      currency: 'EGP',
    },
  ],
  paymentMethod: 'credit_card',
});
```

#### `useOrders(userId, options?)`
Get user orders with pagination.

```tsx
const { data: orders } = useOrders('user-123', {
  page: 1,
  limit: 10,
  status: 'completed',
});
```

#### `useOrder(orderId, options?)`
Get specific order details.

```tsx
const { data: order } = useOrder('order-123');
```

#### `useCancelOrder(userId)`
Cancel an order.

```tsx
const cancelOrder = useCancelOrder('user-123');
cancelOrder.mutate('order-123');
```

#### `useRetryOrder(userId)`
Retry a failed order.

```tsx
const retryOrder = useRetryOrder('user-123');
retryOrder.mutate('order-123');
```

#### `useOrderStats(userId, options?)`
Get order statistics.

```tsx
const { data: stats } = useOrderStats('user-123', {
  period: 'month',
});
```

#### `useRecentOrders(userId)`
Get recent orders (last 5).

```tsx
const { data: recentOrders } = useRecentOrders('user-123');
```

### Downloads Hooks

#### `useDownloadLinks(orderId, options?)`
Get download links for an order.

```tsx
const { data: downloadLinks } = useDownloadLinks('order-123');
```

#### `useUserDownloadLinks(userId, options?)`
Get all user download links.

```tsx
const { data: userDownloads } = useUserDownloadLinks('user-123', {
  page: 1,
  limit: 20,
  activeOnly: true,
});
```

#### `useDownloadLink(downloadId, options?)`
Get specific download link.

```tsx
const { data: downloadLink } = useDownloadLink('download-123');
```

#### `useRefreshDownloadLinks(orderId)`
Refresh expired download links.

```tsx
const refreshLinks = useRefreshDownloadLinks('order-123');
refreshLinks.mutate();
```

#### `useTrackDownload(downloadId)`
Track download usage.

```tsx
const trackDownload = useTrackDownload('download-123');
trackDownload.mutate();
```

#### `useDownloadStats(userId, options?)`
Get download statistics.

```tsx
const { data: downloadStats } = useDownloadStats('user-123', {
  period: 'month',
});
```

#### `useDownloadHistory(userId, options?)`
Get download history.

```tsx
const { data: history } = useDownloadHistory('user-123', {
  page: 1,
  limit: 20,
  mediaType: 'image',
});
```

#### `useBulkDownload(userId)`
Create bulk download.

```tsx
const bulkDownload = useBulkDownload('user-123');
bulkDownload.mutate(['download-1', 'download-2', 'download-3']);
```

## Error Handling

All hooks return error states that you can handle:

```tsx
const { data, isLoading, isError, error } = useCredits('user-123');

if (isError) {
  console.error('Error:', error.message);
  // Handle error (show toast, redirect, etc.)
}
```

## Loading States

All hooks provide loading states:

```tsx
const { data, isLoading, isRefetching } = useMediaSearch(params);

if (isLoading) {
  return <div>Loading...</div>;
}

if (isRefetching) {
  return <div>Refreshing...</div>;
}
```

## Caching

Hooks automatically cache data and provide smart refetching:

- **Stale Time**: Data is considered fresh for a configurable period
- **Cache Time**: Data stays in cache even when unused
- **Background Refetching**: Data refetches when window regains focus
- **Automatic Invalidation**: Related queries invalidate when data changes

## TypeScript Support

All hooks are fully typed with TypeScript:

```tsx
import { MediaItem, CreditBalance, Order } from '../hooks';

const { data }: { data: MediaItem[] | undefined } = useTrendingMedia();
```

## Best Practices

1. **Enable/Disable Queries**: Use the `enabled` option to control when queries run
2. **Error Boundaries**: Wrap components in error boundaries for better error handling
3. **Loading States**: Always show loading states for better UX
4. **Optimistic Updates**: Use mutations for immediate UI updates
5. **Cache Management**: Use query invalidation to keep data fresh

## Example Usage

See `ApiHooksExample.tsx` for a complete example of how to use all hooks together in a real application.
