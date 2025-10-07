// Export all API hooks for easy importing

// Credits hooks
export {
  useCredits,
  useRefreshCredits,
  usePurchaseCredits,
  useCreditHistory,
} from './useCredits';

// Media search hooks
export {
  useMediaSearch,
  useInfiniteMediaSearch,
  useMediaItem,
  useRelatedMedia,
  useTrendingMedia,
  useMediaCategories,
  useMediaSources,
} from './useMediaSearch';

// Orders hooks
export {
  useCreateOrder,
  useOrders,
  useOrder,
  useCancelOrder,
  useRetryOrder,
  useOrderStats,
  useRecentOrders,
} from './useOrders';

// Downloads hooks
export {
  useDownloadLinks,
  useUserDownloadLinks,
  useDownloadLink,
  useRefreshDownloadLinks,
  useTrackDownload,
  useDownloadStats,
  useDownloadHistory,
  useBulkDownload,
} from './useDownloads';

// New nehtw API hooks
export {
  useStockMediaSearch,
  useStockMediaSearchInfinite,
} from './useStockMediaSearch';

export {
  useCreateOrder,
  useCreateBatchOrder,
} from './useCreateOrder';

export {
  useOrderStatus,
  useMultipleOrderStatus,
  useOrderHistory,
} from './useOrderStatus';

export {
  useDownloadLink,
  useDownloadStats,
  useGenerateDownloadLink,
  useDownloadFile,
  useBatchDownload,
} from './useDownloadLink';

export {
  useAIGenerate,
  useAIGenerationStatus,
  useAIGenerationHistory,
  useCancelAIGeneration,
  useDownloadAIGeneratedImage,
} from './useAIGeneration';

// Stock Media Search Query hooks
export {
  useStockMediaSearch,
  useStockMediaSearchInfinite,
  useTrendingStockMedia,
  useRelatedStockMedia,
  useSearchSuggestions,
  useSearchFilters,
  useSearchAnalytics,
  fetchStockMediaSearch,
} from './useStockMediaSearchQuery';

// Create Order Mutation hooks
export {
  useCreateOrderMutation,
  createOrderAPI,
} from './useCreateOrderMutation';

// Order Status Polling hooks
export {
  useOrderStatusPolling,
  useOrderStatusWithProgress,
  useOrderStatusPollingWithIntervals,
  useMultipleOrderStatusPolling,
  fetchOrderStatus,
} from './useOrderStatusPolling';

// Download Links hooks
export {
  useDownloadLink,
  useGenerateDownloadLink,
  useDownloadLinks,
  useDownloadLinkWithRefresh,
  useDownloadLinkStats,
  useDownloadFile,
  fetchDownloadLink,
  generateDownloadLink,
  fetchDownloadLinks,
} from './useDownloadLinks';

// AI Generation hooks
export {
  useCreateAIGenerationJob,
  useAIGenerationJob,
  useAIGenerationJobPolling,
  useAIGenerationJobs,
  useCancelAIGenerationJob,
  useAIGenerationJobWithProgress,
  createAIGenerationJob,
  fetchAIGenerationJob,
  fetchAIGenerationJobs,
  cancelAIGenerationJob,
} from './useAIGeneration';

// Re-export types for convenience
export type {
  ApiResponse,
  PaginatedResponse,
  CreditBalance,
  MediaItem,
  MediaSearchParams,
  MediaSearchResponse,
  Order,
  CreateOrderRequest,
  CreateOrderResponse,
  DownloadLink,
  DownloadLinksResponse,
  ApiError,
  AuthTokens,
  User,
  UseQueryResult,
  UseMutationResult,
} from '../types/api';
