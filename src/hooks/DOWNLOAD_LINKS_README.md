# Download Links React Query Hooks

A comprehensive set of React Query hooks in TypeScript for generating and fetching download links for completed orders, with robust error handling, caching, and advanced features.

## Features

- 🔗 **Download Link Generation**: Create download links with custom parameters
- 📥 **File Downloading**: Direct file download with progress tracking
- 📊 **Statistics Tracking**: Monitor download usage and limits
- 🔄 **Auto-Refresh**: Automatic refresh for expiring links
- 📱 **Multiple Links**: Manage multiple download links simultaneously
- 🛡️ **Error Handling**: Comprehensive error handling with retry logic
- ⚡ **Performance Optimized**: Efficient caching and background updates
- 🎨 **TypeScript Support**: Full type safety with detailed interfaces

## Installation

```bash
npm install @tanstack/react-query axios
```

## Basic Usage

```typescript
import { useDownloadLink, useGenerateDownloadLink } from './hooks/useDownloadLinks';

function DownloadComponent() {
  const {
    data: downloadLink,
    isLoading,
    isError,
    error,
  } = useDownloadLink('order-123', 'task-456');

  const {
    mutate: generateDownloadLink,
    isLoading: isGenerating,
  } = useGenerateDownloadLink();

  const handleGenerate = () => {
    generateDownloadLink({
      orderId: 'order-123',
      taskId: 'task-456',
      responseType: 'original',
      quality: 'high',
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>Download Link: {downloadLink?.fileName}</h3>
      <p>File Size: {downloadLink?.fileSize} bytes</p>
      <p>Expires: {downloadLink?.expiresAt}</p>
      <button onClick={handleGenerate}>Generate New Link</button>
    </div>
  );
}
```

## API Reference

### `useDownloadLink`

Fetches a single download link for a specific order and task.

```typescript
const {
  data: downloadLink,
  isLoading,
  isError,
  error,
  refetch,
} = useDownloadLink(orderId: string, taskId: string, options?: DownloadLinkOptions);
```

#### Parameters

**orderId: string** - The order ID
**taskId: string** - The task ID
**DownloadLinkOptions:**
- `enabled?: boolean` - Enable/disable the query (default: true)
- `staleTime?: number` - Time before data is considered stale (default: 300000)
- `cacheTime?: number` - Time to keep data in cache (default: 1800000)
- `retry?: boolean | number` - Retry configuration (default: true)
- `retryDelay?: number | ((attemptIndex: number) => number)` - Retry delay function
- `refetchInterval?: number | false` - Auto-refetch interval (default: false)
- `refetchOnWindowFocus?: boolean` - Refetch when window gains focus (default: true)
- `refetchOnMount?: boolean` - Refetch when component mounts (default: true)
- `onSuccess?: (data: DownloadLink) => void` - Success callback
- `onError?: (error: DownloadLinkError) => void` - Error callback
- `onSettled?: (data: DownloadLink | undefined, error: DownloadLinkError | null) => void` - Settled callback

#### Returns

- `data: DownloadLink | undefined` - Download link data
- `isLoading: boolean` - Loading state
- `isError: boolean` - Error state
- `error: DownloadLinkError | null` - Error object
- `refetch: () => void` - Manual refetch function

### `useGenerateDownloadLink`

Generates a new download link with custom parameters.

```typescript
const {
  mutate: generateDownloadLink,
  isLoading: isGenerating,
  isError: isGenerateError,
  error: generateError,
  data: generatedLink,
} = useGenerateDownloadLink(options?: DownloadLinkMutationOptions);
```

#### Parameters

**DownloadLinkRequest:**
- `orderId: string` - The order ID
- `taskId: string` - The task ID
- `responseType?: 'original' | 'compressed' | 'thumbnail' | 'preview' | 'watermarked'` - Response type
- `format?: string` - File format (e.g., 'jpg', 'png', 'pdf')
- `quality?: 'low' | 'medium' | 'high' | 'original'` - Quality level
- `watermark?: boolean` - Add watermark
- `watermarkText?: string` - Watermark text
- `watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'` - Watermark position
- `customFields?: Record<string, string>` - Custom fields

#### Returns

- `mutate: (request: DownloadLinkRequest) => void` - Generate function
- `isLoading: boolean` - Loading state
- `isError: boolean` - Error state
- `error: DownloadLinkError | null` - Error object
- `data: DownloadLink | undefined` - Generated download link

### `useDownloadLinks`

Fetches multiple download links with pagination and filtering.

```typescript
const {
  data: downloadLinks,
  isLoading,
  isError,
  error,
  refetch,
} = useDownloadLinks(params: {
  orderId?: string;
  taskId?: string;
  page?: number;
  pageSize?: number;
  status?: 'active' | 'expired' | 'all';
  sortBy?: 'created' | 'expires' | 'downloads' | 'name';
  sortOrder?: 'asc' | 'desc';
}, options?: DownloadLinkOptions);
```

#### Parameters

**params:**
- `orderId?: string` - Filter by order ID
- `taskId?: string` - Filter by task ID
- `page?: number` - Page number (default: 1)
- `pageSize?: number` - Items per page (default: 20)
- `status?: 'active' | 'expired' | 'all'` - Filter by status (default: 'all')
- `sortBy?: 'created' | 'expires' | 'downloads' | 'name'` - Sort field (default: 'created')
- `sortOrder?: 'asc' | 'desc'` - Sort order (default: 'desc')

#### Returns

- `data: DownloadLinksResponse | undefined` - Paginated download links
- `isLoading: boolean` - Loading state
- `isError: boolean` - Error state
- `error: DownloadLinkError | null` - Error object
- `refetch: () => void` - Manual refetch function

### `useDownloadLinkWithRefresh`

Download link with automatic refresh for expiring links.

```typescript
const {
  data: downloadLink,
  isLoading,
  isError,
  error,
  isExpiringSoon,
  timeUntilExpiry,
  refreshDownloadLink,
} = useDownloadLinkWithRefresh(orderId: string, taskId: string, options?: DownloadLinkOptions & {
  refreshInterval?: number;
  refreshThreshold?: number;
});
```

#### Additional Parameters

- `refreshInterval?: number` - Refresh interval in ms (default: 60000)
- `refreshThreshold?: number` - Refresh when expires in X minutes (default: 5)

#### Additional Returns

- `isExpiringSoon: boolean` - Whether link is expiring soon
- `timeUntilExpiry: number | null` - Time until expiry in ms
- `refreshDownloadLink: () => void` - Manual refresh function

### `useDownloadLinkStats`

Statistics for a specific download link.

```typescript
const {
  data: stats,
  isLoading,
  isError,
  error,
} = useDownloadLinkStats(downloadLinkId: string, options?: DownloadLinkOptions);
```

#### Returns

- `data: DownloadLinkStats | undefined` - Statistics data
- `isLoading: boolean` - Loading state
- `isError: boolean` - Error state
- `error: DownloadLinkError | null` - Error object

### `useDownloadFile`

Direct file download with progress tracking.

```typescript
const {
  mutate: downloadFile,
  isLoading: isDownloading,
  isError: isDownloadError,
  error: downloadError,
} = useDownloadFile(options?: DownloadLinkMutationOptions);
```

#### Usage

```typescript
const { mutate: downloadFile } = useDownloadFile();

// Download file
downloadFile(downloadUrl);
```

## Data Types

### `DownloadLink`

```typescript
interface DownloadLink {
  id: string;
  orderId: string;
  taskId: string;
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  expiresAt: string;
  maxDownloads: number;
  currentDownloads: number;
  remainingDownloads: number;
  checksum?: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  metadata?: {
    originalFileName?: string;
    uploadedAt?: string;
    lastModified?: string;
    dimensions?: {
      width: number;
      height: number;
    };
    tags?: string[];
    category?: string;
    license?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### `DownloadLinkRequest`

```typescript
interface DownloadLinkRequest {
  orderId: string;
  taskId: string;
  responseType?: 'original' | 'compressed' | 'thumbnail' | 'preview' | 'watermarked';
  format?: string;
  quality?: 'low' | 'medium' | 'high' | 'original';
  watermark?: boolean;
  watermarkText?: string;
  watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  customFields?: Record<string, string>;
}
```

### `DownloadLinkError`

```typescript
interface DownloadLinkError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
  retryable?: boolean;
}
```

## Advanced Usage

### Custom Download Parameters

```typescript
const { mutate: generateDownloadLink } = useGenerateDownloadLink();

const handleGenerate = () => {
  generateDownloadLink({
    orderId: 'order-123',
    taskId: 'task-456',
    responseType: 'watermarked',
    quality: 'high',
    format: 'jpg',
    watermark: true,
    watermarkText: 'Sample Watermark',
    watermarkPosition: 'bottom-right',
    customFields: {
      clientId: 'client-123',
      projectId: 'project-456',
    },
  });
};
```

### Auto-Refresh for Expiring Links

```typescript
const {
  data: downloadLink,
  isExpiringSoon,
  timeUntilExpiry,
  refreshDownloadLink,
} = useDownloadLinkWithRefresh('order-123', 'task-456', {
  refreshInterval: 60000, // 1 minute
  refreshThreshold: 5, // 5 minutes
});

// Check if link is expiring soon
if (isExpiringSoon) {
  console.log('Link expires in:', timeUntilExpiry, 'ms');
}

// Manual refresh
const handleRefresh = () => {
  refreshDownloadLink();
};
```

### Multiple Download Links with Pagination

```typescript
const {
  data: downloadLinks,
  isLoading,
  error,
} = useDownloadLinks({
  orderId: 'order-123',
  page: 1,
  pageSize: 10,
  status: 'active',
  sortBy: 'created',
  sortOrder: 'desc',
});

if (downloadLinks) {
  console.log('Total links:', downloadLinks.total);
  console.log('Current page:', downloadLinks.page);
  console.log('Has next page:', downloadLinks.hasNext);
  
  downloadLinks.data.forEach(link => {
    console.log('Link:', link.fileName, 'Size:', link.fileSize);
  });
}
```

### Download Link Statistics

```typescript
const {
  data: stats,
  isLoading,
  error,
} = useDownloadLinkStats('download-link-123');

if (stats) {
  console.log('Total downloads:', stats.totalDownloads);
  console.log('Remaining downloads:', stats.remainingDownloads);
  console.log('Is expired:', stats.isExpired);
  console.log('Is expiring soon:', stats.isExpiringSoon);
  console.log('Time until expiry:', stats.timeUntilExpiry);
}
```

### Direct File Download

```typescript
const { mutate: downloadFile } = useDownloadFile({
  onSuccess: (data) => {
    console.log('File downloaded:', data.fileName);
    console.log('File size:', data.size);
    console.log('File type:', data.type);
  },
  onError: (error) => {
    console.error('Download failed:', error.message);
  },
});

// Download file
const handleDownload = (downloadUrl: string) => {
  downloadFile(downloadUrl);
};
```

### Error Handling

```typescript
const {
  data: downloadLink,
  isError,
  error,
} = useDownloadLink('order-123', 'task-456', {
  onError: (error) => {
    switch (error.code) {
      case 'NETWORK_ERROR':
        showToast('Network error. Please check your connection.', 'error');
        break;
      case 'HTTP_404':
        showToast('Download link not found.', 'error');
        break;
      case 'HTTP_401':
        showToast('Authentication required.', 'error');
        break;
      case 'HTTP_403':
        showToast('Access denied.', 'error');
        break;
      case 'HTTP_500':
        showToast('Server error. Please try again later.', 'error');
        break;
      case 'VALIDATION_ERROR':
        showToast(error.message, 'error');
        break;
      default:
        showToast('Download error. Please try again.', 'error');
    }
  },
});
```

### Custom Retry Logic

```typescript
const { mutate: generateDownloadLink } = useGenerateDownloadLink({
  retry: (failureCount, error) => {
    // Don't retry on client errors (4xx)
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      return false;
    }
    
    // Don't retry on non-retryable errors
    if (error.retryable === false) {
      return false;
    }
    
    // Retry up to 3 times for server errors
    return failureCount < 3;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://api.stockmedia.com/v1
NEXT_PUBLIC_API_KEY=your_api_key_here
```

### API Client Configuration

The hooks use a configured Axios instance with:
- 30-second timeout
- Automatic retry logic
- Error handling
- Request/response interceptors
- Authentication headers

## Performance Optimizations

### Caching Strategy

- **Download Links**: 5-minute stale time with background updates
- **Statistics**: 30-second stale time with frequent updates
- **File Downloads**: No caching for security

### Background Updates

- **Auto-refresh**: Automatic refresh for expiring links
- **Statistics**: Real-time statistics updates
- **Error Recovery**: Smart retry logic

## Best Practices

1. **Use appropriate cache times**: Adjust based on link expiry
2. **Handle errors gracefully**: Show user-friendly error messages
3. **Implement retry logic**: Use smart retry for server errors
4. **Monitor link expiry**: Use auto-refresh for expiring links
5. **Validate parameters**: Check required fields before generation
6. **Use statistics**: Monitor download usage and limits
7. **Implement security**: Validate download URLs and permissions

## Examples

### Complete Download Management Component

```typescript
function DownloadManagementComponent({ orderId, taskId }: { orderId: string; taskId: string }) {
  const {
    data: downloadLink,
    isLoading,
    isError,
    error,
    refetch,
  } = useDownloadLink(orderId, taskId);

  const {
    mutate: generateDownloadLink,
    isLoading: isGenerating,
  } = useGenerateDownloadLink();

  const {
    mutate: downloadFile,
    isLoading: isDownloading,
  } = useDownloadFile();

  const {
    data: stats,
    isLoading: isStatsLoading,
  } = useDownloadLinkStats(downloadLink?.id || '');

  const handleGenerate = () => {
    generateDownloadLink({
      orderId,
      taskId,
      responseType: 'original',
      quality: 'high',
    });
  };

  const handleDownload = () => {
    if (downloadLink?.downloadUrl) {
      downloadFile(downloadLink.downloadUrl);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading download link...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-600">{error?.message}</p>
        <button
          onClick={() => refetch()}
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
        <h3 className="text-lg font-semibold">Download Link</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate New'}
          </button>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Refresh
          </button>
        </div>
      </div>

      {downloadLink && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">File Name:</span>
              <span className="ml-2">{downloadLink.fileName}</span>
            </div>
            <div>
              <span className="font-medium">File Size:</span>
              <span className="ml-2">{formatFileSize(downloadLink.fileSize)}</span>
            </div>
            <div>
              <span className="font-medium">Expires At:</span>
              <span className="ml-2">{new Date(downloadLink.expiresAt).toLocaleString()}</span>
            </div>
            <div>
              <span className="font-medium">Remaining Downloads:</span>
              <span className="ml-2">{downloadLink.remainingDownloads}</span>
            </div>
          </div>

          {stats && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Downloads:</span>
                  <span className="ml-2">{stats.totalDownloads}</span>
                </div>
                <div>
                  <span className="font-medium">Download Count:</span>
                  <span className="ml-2">{stats.downloadCount}</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 ${
                    stats.isExpired ? 'text-red-600' :
                    stats.isExpiringSoon ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {stats.isExpired ? 'Expired' :
                     stats.isExpiringSoon ? 'Expiring Soon' : 'Active'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Time Until Expiry:</span>
                  <span className="ml-2">
                    {stats.timeUntilExpiry > 0 ? formatTimeUntilExpiry(stats.timeUntilExpiry) : 'Expired'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              disabled={isDownloading || !downloadLink.remainingDownloads}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? 'Downloading...' : 'Download File'}
            </button>
            
            {downloadLink.previewUrl && (
              <button
                onClick={() => window.open(downloadLink.previewUrl, '_blank')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Preview
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Download Links List Component

```typescript
function DownloadLinksListComponent({ orderId }: { orderId: string }) {
  const {
    data: downloadLinks,
    isLoading,
    isError,
    error,
    refetch,
  } = useDownloadLinks({
    orderId,
    page: 1,
    pageSize: 20,
    status: 'all',
    sortBy: 'created',
    sortOrder: 'desc',
  });

  const { mutate: downloadFile } = useDownloadFile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading download links...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-600">{error?.message}</p>
        <button
          onClick={() => refetch()}
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
        <h3 className="text-lg font-semibold">Download Links</h3>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {downloadLinks && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Total: {downloadLinks.total} links | Page: {downloadLinks.page} of {downloadLinks.totalPages}
          </div>

          {downloadLinks.data.map((link) => (
            <div key={link.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{link.fileName}</h4>
                <span className={`px-2 py-1 rounded text-sm ${
                  link.remainingDownloads > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {link.remainingDownloads > 0 ? 'Active' : 'Expired'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Size:</span>
                  <span className="ml-2">{formatFileSize(link.fileSize)}</span>
                </div>
                <div>
                  <span className="font-medium">Expires:</span>
                  <span className="ml-2">{new Date(link.expiresAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium">Downloads:</span>
                  <span className="ml-2">{link.currentDownloads}/{link.maxDownloads}</span>
                </div>
                <div>
                  <span className="font-medium">Remaining:</span>
                  <span className="ml-2">{link.remainingDownloads}</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => downloadFile(link.downloadUrl)}
                  disabled={link.remainingDownloads <= 0}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download
                </button>
                
                {link.previewUrl && (
                  <button
                    onClick={() => window.open(link.previewUrl, '_blank')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Preview
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **Download link not found**: Check order ID and task ID
2. **Authentication errors**: Verify API key and permissions
3. **Network errors**: Check internet connection and API endpoint
4. **File download fails**: Verify download URL and permissions
5. **Link expired**: Generate new download link

### Debug Mode

Enable debug mode to see download states:

```typescript
const {
  data: downloadLink,
  isLoading,
  isError,
  error,
} = useDownloadLink(orderId, taskId, {
  onSuccess: (data) => console.log('Download link loaded:', data),
  onError: (error) => console.error('Download link error:', error),
});
```

## Support

For issues or questions:

1. Check the React Query documentation
2. Review error messages in the browser console
3. Verify API configuration and endpoints
4. Check network connectivity and API limits
5. Review download link parameters and permissions
