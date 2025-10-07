# AI Image Generation React Query Hooks

A comprehensive set of React Query hooks in TypeScript for AI image generation jobs with mutation and status polling until completion, featuring robust error handling, progress tracking, and advanced polling capabilities.

## Features

- 🎨 **AI Image Generation**: Create AI generation jobs with custom parameters
- 🔄 **Status Polling**: Poll job status until completion with configurable intervals
- 📊 **Progress Tracking**: Real-time progress updates with percentage
- ⏱️ **Time Management**: Configurable polling intervals and maximum polling time
- 🛡️ **Error Handling**: Comprehensive error handling with retry logic
- 🎯 **Smart Stopping**: Automatic stop on completion, error, or timeout
- 📱 **Multiple Jobs**: Manage multiple AI generation jobs simultaneously
- ⚡ **Performance Optimized**: Efficient polling with background updates
- 🎨 **TypeScript Support**: Full type safety with detailed interfaces

## Installation

```bash
npm install @tanstack/react-query axios
```

## Basic Usage

```typescript
import { useCreateAIGenerationJob, useAIGenerationJobPolling } from './hooks/useAIGeneration';

function AIGenerationComponent() {
  const {
    mutate: createJob,
    isLoading: isCreating,
    isError: isCreateError,
    error: createError,
    data: createdJob,
  } = useCreateAIGenerationJob({
    onSuccess: (data) => {
      console.log('Job created:', data);
    },
    onError: (error) => {
      console.error('Creation error:', error);
    },
  });

  const {
    data: job,
    isLoading,
    isError,
    error,
    isPolling,
    pollingTime,
    stopPolling,
    startPolling,
    isComplete,
    progress,
  } = useAIGenerationJobPolling(createdJob?.id || '', {
    enabled: !!createdJob?.id,
    refetchInterval: 2000, // Poll every 2 seconds
    maxPollingTime: 30 * 60 * 1000, // 30 minutes max
    stopOnCompletion: true,
    stopOnError: true,
  });

  const handleCreateJob = () => {
    createJob({
      prompt: 'A beautiful sunset over mountains',
      quality: 'high',
      dimensions: { width: 1024, height: 1024 },
      steps: 20,
      guidance: 7.5,
    });
  };

  if (isCreating) return <div>Creating job...</div>;
  if (isCreateError) return <div>Error: {createError.message}</div>;

  return (
    <div>
      <button onClick={handleCreateJob}>Create AI Image</button>
      {job && (
        <div>
          <h3>Status: {job.status}</h3>
          <p>Progress: {progress}%</p>
          <p>Polling: {isPolling ? 'Active' : 'Stopped'}</p>
          <p>Time: {Math.floor(pollingTime / 1000)}s</p>
          {job.result?.imageUrl && (
            <img src={job.result.imageUrl} alt="Generated image" />
          )}
        </div>
      )}
    </div>
  );
}
```

## API Reference

### `useCreateAIGenerationJob`

Creates a new AI generation job with custom parameters.

```typescript
const {
  mutate: createJob,
  isLoading: isCreating,
  isError: isCreateError,
  error: createError,
  data: createdJob,
} = useCreateAIGenerationJob(options?: AIGenerationMutationOptions);
```

#### Parameters

**AIGenerationRequest:**
- `prompt: string` - The text prompt for image generation
- `negativePrompt?: string` - What you don't want in the image
- `model?: string` - AI model to use (default: 'stable-diffusion-xl')
- `style?: string` - Art style
- `quality?: 'low' | 'medium' | 'high' | 'ultra'` - Quality level (default: 'high')
- `dimensions?: { width: number; height: number }` - Image dimensions
- `aspectRatio?: string` - Aspect ratio (e.g., '1:1', '16:9')
- `seed?: number` - Random seed for reproducibility
- `steps?: number` - Number of generation steps (default: 20)
- `guidance?: number` - Guidance scale (default: 7.5)
- `samplingMethod?: string` - Sampling method (default: 'DPM++ 2M Karras')
- `scheduler?: string` - Scheduler (default: 'Karras')
- `batchSize?: number` - Number of images to generate (default: 1)
- `priority?: 'low' | 'normal' | 'high' | 'urgent'` - Job priority (default: 'normal')
- `customFields?: Record<string, string>` - Custom metadata

#### Returns

- `mutate: (request: AIGenerationRequest) => void` - Create job function
- `isLoading: boolean` - Loading state
- `isError: boolean` - Error state
- `error: AIGenerationError | null` - Error object
- `data: AIGenerationJob | undefined` - Created job

### `useAIGenerationJob`

Fetches a single AI generation job status.

```typescript
const {
  data: job,
  isLoading,
  isError,
  error,
  refetch,
} = useAIGenerationJob(jobId: string, options?: AIGenerationOptions);
```

#### Parameters

**jobId: string** - The job ID
**AIGenerationOptions:**
- `enabled?: boolean` - Enable/disable the query (default: true)
- `staleTime?: number` - Time before data is considered stale (default: 30000)
- `cacheTime?: number` - Time to keep data in cache (default: 300000)
- `retry?: boolean | number` - Retry configuration (default: true)
- `retryDelay?: number | ((attemptIndex: number) => number)` - Retry delay function
- `refetchInterval?: number | false` - Auto-refetch interval (default: false)
- `refetchOnWindowFocus?: boolean` - Refetch when window gains focus (default: true)
- `refetchOnMount?: boolean` - Refetch when component mounts (default: true)
- `onSuccess?: (data: AIGenerationJob) => void` - Success callback
- `onError?: (error: AIGenerationError) => void` - Error callback
- `onSettled?: (data: AIGenerationJob | undefined, error: AIGenerationError | null) => void` - Settled callback

#### Returns

- `data: AIGenerationJob | undefined` - Job data
- `isLoading: boolean` - Loading state
- `isError: boolean` - Error state
- `error: AIGenerationError | null` - Error object
- `refetch: () => void` - Manual refetch function

### `useAIGenerationJobPolling`

AI generation job with polling until completion.

```typescript
const {
  data: job,
  isLoading,
  isError,
  error,
  isPolling,
  pollingTime,
  stopPolling,
  startPolling,
  isComplete,
  isError: isCompleteError,
  progress,
  estimatedTimeRemaining,
} = useAIGenerationJobPolling(jobId: string, options?: AIGenerationPollingOptions);
```

#### Additional Parameters

**AIGenerationPollingOptions:**
- `maxPollingTime?: number` - Maximum polling time in ms (default: 1800000)
- `stopOnError?: boolean` - Stop polling on error (default: true)
- `stopOnCompletion?: boolean` - Stop polling when completed (default: true)
- `onStatusChange?: (job: AIGenerationJob) => void` - Status change callback
- `onCompletion?: (job: AIGenerationJob) => void` - Completion callback
- `onProgress?: (progress: number) => void` - Progress callback

#### Additional Returns

- `isPolling: boolean` - Whether currently polling
- `pollingTime: number` - Time spent polling in ms
- `stopPolling: () => void` - Stop polling manually
- `startPolling: () => void` - Start polling manually
- `isComplete: boolean` - Whether job is completed
- `isError: boolean` - Whether job has errored
- `progress: number` - Current progress percentage (0-100)
- `estimatedTimeRemaining: number | null` - Estimated time remaining in ms

### `useAIGenerationJobs`

Fetches multiple AI generation jobs with pagination and filtering.

```typescript
const {
  data: jobs,
  isLoading,
  isError,
  error,
  refetch,
} = useAIGenerationJobs(params: {
  userId?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'all';
  page?: number;
  pageSize?: number;
  sortBy?: 'created' | 'updated' | 'completed' | 'status';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}, options?: AIGenerationOptions);
```

#### Parameters

**params:**
- `userId?: string` - Filter by user ID
- `status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'all'` - Filter by status (default: 'all')
- `page?: number` - Page number (default: 1)
- `pageSize?: number` - Items per page (default: 20)
- `sortBy?: 'created' | 'updated' | 'completed' | 'status'` - Sort field (default: 'created')
- `sortOrder?: 'asc' | 'desc'` - Sort order (default: 'desc')
- `search?: string` - Search term

#### Returns

- `data: AIGenerationJobsResponse | undefined` - Paginated jobs
- `isLoading: boolean` - Loading state
- `isError: boolean` - Error state
- `error: AIGenerationError | null` - Error object
- `refetch: () => void` - Manual refetch function

### `useCancelAIGenerationJob`

Cancels an AI generation job.

```typescript
const {
  mutate: cancelJob,
  isLoading: isCancelling,
  isError: isCancelError,
  error: cancelError,
} = useCancelAIGenerationJob(options?: AIGenerationMutationOptions);
```

#### Usage

```typescript
const { mutate: cancelJob } = useCancelAIGenerationJob();

// Cancel job
cancelJob(jobId);
```

### `useAIGenerationJobWithProgress`

AI generation job with enhanced progress tracking.

```typescript
const {
  data: job,
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
  isError,
  isProcessing,
  isPending,
  isFailed,
  isCancelled,
} = useAIGenerationJobWithProgress(jobId: string, options?: AIGenerationPollingOptions);
```

#### Additional Returns

- `isProcessing: boolean` - Whether job is processing
- `isPending: boolean` - Whether job is pending
- `isFailed: boolean` - Whether job has failed
- `isCancelled: boolean` - Whether job is cancelled

## Data Types

### `AIGenerationJob`

```typescript
interface AIGenerationJob {
  id: string;
  userId: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
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
    model?: string;
    style?: string;
    quality?: 'low' | 'medium' | 'high' | 'ultra';
    dimensions?: {
      width: number;
      height: number;
    };
    aspectRatio?: string;
    seed?: number;
    steps?: number;
    guidance?: number;
    negativePrompt?: string;
    samplingMethod?: string;
    scheduler?: string;
  };
  result?: {
    imageUrl?: string;
    thumbnailUrl?: string;
    previewUrl?: string;
    downloadUrl?: string;
    fileSize?: number;
    dimensions?: {
      width: number;
      height: number;
    };
    format?: string;
    checksum?: string;
    metadata?: {
      prompt?: string;
      negativePrompt?: string;
      model?: string;
      seed?: number;
      steps?: number;
      guidance?: number;
      samplingMethod?: string;
      scheduler?: string;
      generatedAt?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

### `AIGenerationRequest`

```typescript
interface AIGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  model?: string;
  style?: string;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  dimensions?: {
    width: number;
    height: number;
  };
  aspectRatio?: string;
  seed?: number;
  steps?: number;
  guidance?: number;
  samplingMethod?: string;
  scheduler?: string;
  batchSize?: number;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  customFields?: Record<string, string>;
}
```

### `AIGenerationError`

```typescript
interface AIGenerationError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
  retryable?: boolean;
}
```

## Advanced Usage

### Custom Generation Parameters

```typescript
const { mutate: createJob } = useCreateAIGenerationJob();

const handleCreateJob = () => {
  createJob({
    prompt: 'A futuristic cityscape at sunset',
    negativePrompt: 'blurry, low quality, distorted',
    model: 'stable-diffusion-xl',
    style: 'photorealistic',
    quality: 'ultra',
    dimensions: { width: 1024, height: 1024 },
    aspectRatio: '1:1',
    seed: 12345,
    steps: 30,
    guidance: 8.5,
    samplingMethod: 'DPM++ 2M Karras',
    scheduler: 'Karras',
    batchSize: 1,
    priority: 'high',
    customFields: {
      clientId: 'client-123',
      projectId: 'project-456',
    },
  });
};
```

### Polling with Custom Intervals

```typescript
const {
  data: job,
  isPolling,
  pollingTime,
  stopPolling,
  startPolling,
} = useAIGenerationJobPolling(jobId, {
  refetchInterval: 1000, // Poll every 1 second
  maxPollingTime: 15 * 60 * 1000, // 15 minutes max
  stopOnCompletion: true,
  stopOnError: true,
  onStatusChange: (job) => {
    console.log('Status changed:', job.status);
  },
  onCompletion: (job) => {
    console.log('Job completed:', job);
  },
  onProgress: (progress) => {
    console.log('Progress:', progress + '%');
  },
});
```

### Progress Tracking

```typescript
const {
  data: job,
  progress,
  estimatedTimeRemaining,
  isComplete,
  isError,
  isProcessing,
  isPending,
  isFailed,
  isCancelled,
} = useAIGenerationJobWithProgress(jobId, {
  refetchInterval: 2000,
  maxPollingTime: 30 * 60 * 1000,
  stopOnCompletion: true,
  stopOnError: true,
});

// Display progress bar
<div className="w-full bg-gray-700 rounded-full h-3">
  <div
    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>

// Display status
<div className="flex items-center space-x-2">
  {isPending && <span className="text-yellow-400">⏳ Pending</span>}
  {isProcessing && <span className="text-blue-400">🔄 Processing</span>}
  {isComplete && <span className="text-green-400">✅ Completed</span>}
  {isFailed && <span className="text-red-400">❌ Failed</span>}
  {isCancelled && <span className="text-gray-400">🚫 Cancelled</span>}
</div>
```

### Multiple Jobs Management

```typescript
const {
  data: jobs,
  isLoading,
  error,
} = useAIGenerationJobs({
  status: 'all',
  page: 1,
  pageSize: 20,
  sortBy: 'created',
  sortOrder: 'desc',
  search: 'sunset',
});

if (jobs) {
  console.log('Total jobs:', jobs.total);
  console.log('Current page:', jobs.page);
  console.log('Has next page:', jobs.hasNext);
  
  jobs.data.forEach(job => {
    console.log('Job:', job.id, 'Status:', job.status, 'Progress:', job.progress + '%');
  });
}
```

### Job Cancellation

```typescript
const { mutate: cancelJob } = useCancelAIGenerationJob({
  onSuccess: (data) => {
    console.log('Job cancelled:', data);
  },
  onError: (error) => {
    console.error('Cancellation failed:', error);
  },
});

// Cancel job
const handleCancel = (jobId: string) => {
  cancelJob(jobId);
};
```

### Error Handling

```typescript
const {
  data: job,
  isError,
  error,
} = useAIGenerationJobPolling(jobId, {
  onError: (error) => {
    switch (error.code) {
      case 'NETWORK_ERROR':
        showToast('Network error. Please check your connection.', 'error');
        break;
      case 'HTTP_404':
        showToast('Job not found.', 'error');
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
        showToast('Generation error. Please try again.', 'error');
    }
  },
});
```

### Custom Retry Logic

```typescript
const { mutate: createJob } = useCreateAIGenerationJob({
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

### Polling Strategy

- **Smart Intervals**: Different polling intervals based on job status
- **Automatic Stopping**: Stop polling on completion, error, or timeout
- **Background Updates**: Continue polling when tab is not active
- **Memory Management**: Automatic cleanup of unused queries

### Caching Strategy

- **Job Status**: 30-second stale time with background updates
- **Progress Data**: Real-time updates with efficient caching
- **Error States**: Proper error handling with retry logic

## Best Practices

1. **Use appropriate polling intervals**: Adjust based on job complexity
2. **Handle errors gracefully**: Show user-friendly error messages
3. **Implement timeouts**: Set maximum polling time to prevent infinite polling
4. **Monitor progress**: Use progress bars and status indicators
5. **Clean up resources**: Stop polling when components unmount
6. **Use job cancellation**: Allow users to cancel long-running jobs
7. **Implement retry logic**: Use smart retry for server errors

## Examples

### Complete AI Generation Component

```typescript
function AIGenerationComponent() {
  const [prompt, setPrompt] = useState('');
  const [jobId, setJobId] = useState('');
  
  const {
    mutate: createJob,
    isLoading: isCreating,
    isError: isCreateError,
    error: createError,
    data: createdJob,
  } = useCreateAIGenerationJob({
    onSuccess: (data) => {
      setJobId(data.id);
    },
  });

  const {
    data: job,
    isLoading: isJobLoading,
    isError: isJobError,
    error: jobError,
    isPolling,
    pollingTime,
    stopPolling,
    startPolling,
    isComplete,
    progress,
    estimatedTimeRemaining,
  } = useAIGenerationJobPolling(jobId, {
    enabled: !!jobId,
    refetchInterval: 2000,
    maxPollingTime: 30 * 60 * 1000,
    stopOnCompletion: true,
    stopOnError: true,
    onStatusChange: (job) => {
      console.log('Status changed:', job.status);
    },
    onCompletion: (job) => {
      console.log('Job completed:', job);
    },
  });

  const handleCreateJob = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    
    createJob({
      prompt: prompt.trim(),
      quality: 'high',
      dimensions: { width: 1024, height: 1024 },
      steps: 20,
      guidance: 7.5,
    });
  };

  if (isCreating) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Creating job...</span>
      </div>
    );
  }

  if (isCreateError) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-600">{createError?.message}</p>
        <button
          onClick={handleCreateJob}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleCreateJob}
        disabled={!prompt.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Generate Image
      </button>

      {job && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Job Status</h3>
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                job.status === 'completed' ? 'bg-green-100 text-green-800' :
                job.status === 'failed' ? 'bg-red-100 text-red-800' :
                job.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {job.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Progress:</span>
              <span>{progress}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {estimatedTimeRemaining && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Time Remaining:</span>
                <span>{Math.floor(estimatedTimeRemaining / 1000)}s</span>
              </div>
            )}

            {job.result?.imageUrl && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Generated Image</h4>
                <img
                  src={job.result.imageUrl}
                  alt="Generated image"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}

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
        </div>
      )}
    </div>
  );
}
```

### Jobs List Component

```typescript
function AIGenerationJobsList() {
  const {
    data: jobs,
    isLoading,
    isError,
    error,
    refetch,
  } = useAIGenerationJobs({
    status: 'all',
    page: 1,
    pageSize: 20,
    sortBy: 'created',
    sortOrder: 'desc',
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading jobs...</span>
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
        <h3 className="text-lg font-semibold">AI Generation Jobs</h3>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {jobs && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Total: {jobs.total} jobs | Page: {jobs.page} of {jobs.totalPages}
          </div>

          {jobs.data.map((job) => (
            <div key={job.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{job.id}</h4>
                <span className={`px-2 py-1 rounded text-sm ${
                  job.status === 'completed' ? 'bg-green-100 text-green-800' :
                  job.status === 'failed' ? 'bg-red-100 text-red-800' :
                  job.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {job.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Prompt:</span>
                  <span className="ml-2">{job.prompt}</span>
                </div>
                <div>
                  <span className="font-medium">Progress:</span>
                  <span className="ml-2">{job.progress}%</span>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <span className="ml-2">{new Date(job.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {job.result?.imageUrl && (
                <div className="mt-4">
                  <img
                    src={job.result.imageUrl}
                    alt="Generated image"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              )}
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

1. **Job not found**: Check job ID and permissions
2. **Polling not starting**: Check if `enabled` option is set to true
3. **Polling not stopping**: Verify `stopOnCompletion` and `stopOnError` options
4. **Memory leaks**: Ensure proper cleanup when components unmount
5. **Rate limiting**: Implement appropriate retry logic with backoff
6. **Network errors**: Check internet connection and API endpoint

### Debug Mode

Enable debug mode to see polling states:

```typescript
const {
  data: job,
  isPolling,
  pollingTime,
} = useAIGenerationJobPolling(jobId, {
  onStatusChange: (job) => console.log('Status changed:', job.status),
  onCompletion: (job) => console.log('Job completed:', job),
  onProgress: (progress) => console.log('Progress:', progress + '%'),
});
```

## Support

For issues or questions:

1. Check the React Query documentation
2. Review error messages in the browser console
3. Verify API configuration and endpoints
4. Check network connectivity and API limits
5. Review polling intervals and timeout settings
