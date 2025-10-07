# Stock Media Search React Query Hook

A comprehensive React Query hook for fetching stock media search results from a REST API, with advanced features for loading states, error handling, caching, and more.

## Features

- 🔍 **Advanced Search**: Full-text search with filters and sorting
- 🔄 **Real-time Updates**: Automatic refetching and background updates
- 📱 **Infinite Scroll**: Support for pagination and infinite loading
- 🎯 **Smart Caching**: Intelligent caching with configurable stale times
- 🛡️ **Error Handling**: Comprehensive error handling with retry logic
- 📊 **Analytics**: Built-in search analytics and trending content
- 🔗 **Related Content**: Automatic related media suggestions
- 💡 **Autocomplete**: Search suggestions and autocomplete
- 🎨 **TypeScript**: Full TypeScript support with comprehensive types

## Installation

```bash
npm install @tanstack/react-query axios
```

## Basic Usage

```typescript
import { useStockMediaSearch } from './hooks/useStockMediaSearchQuery';

function SearchComponent() {
  const { data, isLoading, error } = useStockMediaSearch({
    query: 'nature landscape',
    page: 1,
    pageSize: 20,
    type: 'image',
    sortBy: 'relevance'
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.results.map(item => (
        <div key={item.id}>
          <img src={item.thumbnail} alt={item.title} />
          <h3>{item.title}</h3>
          <p>${item.cost}</p>
        </div>
      ))}
    </div>
  );
}
```

## API Reference

### `useStockMediaSearch`

Main hook for searching stock media with advanced filtering.

```typescript
const { data, isLoading, error, isFetching, refetch } = useStockMediaSearch(
  params: StockMediaSearchParams,
  options?: UseQueryOptions
);
```

#### Parameters

**Search Parameters:**
- `query: string` - Search query (required)
- `page?: number` - Page number (default: 1)
- `pageSize?: number` - Results per page (default: 20)
- `type?: 'image' | 'video' | 'audio' | 'vector' | 'document' | 'all'` - Media type filter
- `category?: string` - Category filter
- `source?: string` - Source filter
- `minPrice?: number` - Minimum price filter
- `maxPrice?: number` - Maximum price filter
- `isPremium?: boolean` - Premium content filter
- `sortBy?: 'relevance' | 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular'` - Sort order
- `tags?: string[]` - Tag filters
- `color?: string` - Color filter
- `orientation?: 'landscape' | 'portrait' | 'square'` - Orientation filter
- `dateRange?: { start: string; end: string }` - Date range filter

**Options:**
- `enabled?: boolean` - Enable/disable the query
- `staleTime?: number` - Time before data is considered stale
- `cacheTime?: number` - Time to keep data in cache
- `retry?: boolean | number` - Retry configuration
- `refetchOnWindowFocus?: boolean` - Refetch when window gains focus
- `refetchInterval?: number` - Auto-refetch interval

#### Returns

- `data: StockMediaSearchResponse | undefined` - Search results
- `isLoading: boolean` - Initial loading state
- `isFetching: boolean` - Any fetching state
- `error: Error | null` - Error state
- `refetch: () => void` - Manual refetch function
- `isStale: boolean` - Whether data is stale
- `isSuccess: boolean` - Whether query was successful

### `useStockMediaSearchInfinite`

Hook for infinite scroll/pagination support.

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useStockMediaSearchInfinite(
  params: Omit<StockMediaSearchParams, 'page'>,
  options?: { enabled?: boolean; staleTime?: number; cacheTime?: number }
);
```

### `useTrendingStockMedia`

Hook for fetching trending/popular media.

```typescript
const { data, isLoading } = useTrendingStockMedia({
  limit?: number;
  category?: string;
  type?: 'image' | 'video' | 'audio' | 'vector' | 'document' | 'all';
  enabled?: boolean;
});
```

### `useRelatedStockMedia`

Hook for fetching related media suggestions.

```typescript
const { data, isLoading } = useRelatedStockMedia(
  mediaId: string,
  options?: { limit?: number; enabled?: boolean }
);
```

### `useSearchSuggestions`

Hook for search autocomplete/suggestions.

```typescript
const { data, isLoading } = useSearchSuggestions(
  query: string,
  options?: { limit?: number; enabled?: boolean }
);
```

### `useSearchFilters`

Hook for fetching available search filters.

```typescript
const { data, isLoading } = useSearchFilters({
  enabled?: boolean;
});
```

### `useSearchAnalytics`

Hook for search analytics and insights.

```typescript
const { data, isLoading } = useSearchAnalytics(
  searchParams: StockMediaSearchParams,
  options?: { enabled?: boolean }
);
```

## Data Types

### `StockMediaItem`

```typescript
interface StockMediaItem {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  previewUrl?: string;
  downloadUrl?: string;
  cost: number;
  currency: string;
  source: string;
  type: 'image' | 'video' | 'audio' | 'vector' | 'document';
  ext: string;
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize?: number;
  tags?: string[];
  category?: string;
  license?: string;
  isPremium?: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### `StockMediaSearchResponse`

```typescript
interface StockMediaSearchResponse {
  results: StockMediaItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  searchTime: number;
  filters: {
    categories: string[];
    sources: string[];
    priceRange: {
      min: number;
      max: number;
    };
    types: string[];
  };
  suggestions?: string[];
  relatedQueries?: string[];
}
```

## Advanced Usage

### Custom Error Handling

```typescript
const { data, error, isError } = useStockMediaSearch(params, {
  onError: (error) => {
    console.error('Search failed:', error);
    // Custom error handling
  },
  retry: (failureCount, error) => {
    // Custom retry logic
    if (error.message.includes('429')) {
      return failureCount < 2; // Retry rate limit errors
    }
    return failureCount < 3;
  }
});
```

### Optimistic Updates

```typescript
const queryClient = useQueryClient();

const { data } = useStockMediaSearch(params, {
  onSuccess: (data) => {
    // Prefetch related data
    queryClient.prefetchQuery({
      queryKey: ['relatedMedia', data.results[0]?.id],
      queryFn: () => fetchRelatedMedia(data.results[0]?.id),
    });
  }
});
```

### Background Refetching

```typescript
const { data } = useStockMediaSearch(params, {
  refetchInterval: 30000, // Refetch every 30 seconds
  refetchIntervalInBackground: true, // Continue refetching in background
  staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
});
```

### Infinite Scroll Implementation

```typescript
function InfiniteSearchResults() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useStockMediaSearchInfinite({
    query: 'nature',
    type: 'image',
  });

  const allResults = useMemo(() => {
    return data?.pages.flatMap(page => page.results) || [];
  }, [data]);

  return (
    <div>
      {allResults.map(item => (
        <MediaCard key={item.id} item={item} />
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
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

## Performance Optimizations

### Caching Strategy

- **Search Results**: 5-minute stale time, 30-minute cache time
- **Trending Content**: 10-minute stale time, 1-hour cache time
- **Related Media**: 15-minute stale time, 30-minute cache time
- **Search Suggestions**: 5-minute stale time, 15-minute cache time
- **Filters**: 1-hour stale time, 24-hour cache time

### Memory Management

- Automatic cleanup of unused queries
- Background garbage collection
- Optimized re-renders with React Query's built-in optimizations

## Error Handling

The hook provides comprehensive error handling:

```typescript
// Network errors
if (error.message.includes('Network Error')) {
  // Handle network issues
}

// API errors
if (error.message.includes('400')) {
  // Handle bad request
}

// Rate limiting
if (error.message.includes('429')) {
  // Handle rate limiting
}
```

## Best Practices

1. **Use enabled option**: Only run queries when necessary
2. **Handle loading states**: Show appropriate UI feedback
3. **Implement error boundaries**: Catch and handle errors gracefully
4. **Optimize polling**: Use appropriate refetch intervals
5. **Clean up resources**: Cancel ongoing requests when components unmount
6. **Use mutations for actions**: Separate read and write operations
7. **Implement optimistic updates**: Provide immediate feedback for better UX

## Examples

### Basic Search Component

```typescript
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [searchParams, setSearchParams] = useState({
    query: '',
    page: 1,
    pageSize: 20,
  });

  const { data, isLoading, error } = useStockMediaSearch(searchParams, {
    enabled: !!query,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => ({ ...prev, query }));
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for media..."
      />
      <button type="submit">Search</button>
      
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <div>
          {data.results.map(item => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </form>
  );
}
```

### Advanced Search with Filters

```typescript
function AdvancedSearch() {
  const [filters, setFilters] = useState({
    query: '',
    type: 'all',
    category: '',
    sortBy: 'relevance',
    minPrice: undefined,
    maxPrice: undefined,
  });

  const { data, isLoading } = useStockMediaSearch(filters, {
    enabled: !!filters.query,
  });

  const { data: availableFilters } = useSearchFilters();

  return (
    <div>
      <SearchForm filters={filters} onFiltersChange={setFilters} />
      <FilterPanel 
        filters={availableFilters} 
        values={filters} 
        onChange={setFilters} 
      />
      <SearchResults data={data} isLoading={isLoading} />
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **Query not running**: Check if `enabled` option is set correctly
2. **Stale data**: Adjust `staleTime` and `cacheTime` options
3. **Memory leaks**: Ensure proper cleanup in useEffect
4. **Rate limiting**: Implement exponential backoff for retries
5. **Network errors**: Add proper error boundaries and fallbacks

### Debug Mode

Enable debug mode to see query states:

```typescript
const { data, isLoading, error, isFetching, isStale } = useStockMediaSearch(params, {
  onSuccess: (data) => console.log('Query successful:', data),
  onError: (error) => console.error('Query failed:', error),
});
```

## Support

For issues or questions:

1. Check the React Query documentation
2. Review error messages in the browser console
3. Verify API configuration and endpoints
4. Check network connectivity and API limits
5. Review caching and stale time configurations
