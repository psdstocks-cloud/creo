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
