import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api-client';
import { DownloadLink, DownloadLinksResponse, ApiError } from '../types/api';

/**
 * Hook to get download links for an order
 * @param orderId - Order ID to get download links for
 * @param options - Additional query options
 */
export const useDownloadLinks = (
  orderId: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<DownloadLinksResponse, ApiError>({
    queryKey: ['downloads', 'links', orderId],
    queryFn: () => apiClient.get<DownloadLinksResponse>(`/orders/${orderId}/downloads`),
    enabled: options?.enabled ?? !!orderId,
    staleTime: 300000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to get all active download links for a user
 * @param userId - User ID to get download links for
 * @param options - Pagination options
 */
export const useUserDownloadLinks = (
  userId: string,
  options?: {
    page?: number;
    limit?: number;
    activeOnly?: boolean;
    enabled?: boolean;
  }
) => {
  const params = new URLSearchParams();
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.activeOnly) params.append('activeOnly', 'true');

  return useQuery({
    queryKey: ['downloads', 'user', userId, options],
    queryFn: () => apiClient.get(`/users/${userId}/downloads?${params.toString()}`),
    enabled: options?.enabled ?? true,
    staleTime: 60000, // 1 minute
    retry: 2,
  });
};

/**
 * Hook to get a specific download link
 * @param downloadId - Download link ID
 * @param options - Additional query options
 */
export const useDownloadLink = (
  downloadId: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<DownloadLink, ApiError>({
    queryKey: ['downloads', 'link', downloadId],
    queryFn: () => apiClient.get<DownloadLink>(`/downloads/${downloadId}`),
    enabled: options?.enabled ?? !!downloadId,
    staleTime: 300000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to refresh download links (regenerate if expired)
 * @param orderId - Order ID to refresh download links for
 */
export const useRefreshDownloadLinks = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation<DownloadLinksResponse, ApiError, void>({
    mutationFn: () => 
      apiClient.post<DownloadLinksResponse>(`/orders/${orderId}/downloads/refresh`),
    onSuccess: (data) => {
      // Update the cache with new download links
      queryClient.setQueryData(['downloads', 'links', orderId], data);
      
      // Invalidate user download links
      queryClient.invalidateQueries({ queryKey: ['downloads', 'user'] });
    },
    onError: (error) => {
      console.error('Failed to refresh download links:', error);
    },
  });
};

/**
 * Hook to track download usage
 * @param downloadId - Download link ID to track
 */
export const useTrackDownload = (downloadId: string) => {
  const queryClient = useQueryClient();

  return useMutation<DownloadLink, ApiError, void>({
    mutationFn: () => 
      apiClient.post<DownloadLink>(`/downloads/${downloadId}/track`),
    onSuccess: (data) => {
      // Update the download link in cache
      queryClient.setQueryData(['downloads', 'link', downloadId], data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['downloads', 'links'] });
      queryClient.invalidateQueries({ queryKey: ['downloads', 'user'] });
    },
    onError: (error) => {
      console.error('Failed to track download:', error);
    },
  });
};

/**
 * Hook to get download statistics
 * @param userId - User ID to get statistics for
 * @param options - Time period options
 */
export const useDownloadStats = (
  userId: string,
  options?: {
    period?: 'day' | 'week' | 'month' | 'year';
    enabled?: boolean;
  }
) => {
  const params = new URLSearchParams();
  if (options?.period) params.append('period', options.period);

  return useQuery({
    queryKey: ['downloads', 'stats', userId, options?.period],
    queryFn: () => apiClient.get(`/users/${userId}/downloads/stats?${params.toString()}`),
    enabled: options?.enabled ?? true,
    staleTime: 300000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to get download history
 * @param userId - User ID to get download history for
 * @param options - Pagination options
 */
export const useDownloadHistory = (
  userId: string,
  options?: {
    page?: number;
    limit?: number;
    mediaType?: 'image' | 'video' | 'audio' | 'vector' | 'all';
    enabled?: boolean;
  }
) => {
  const params = new URLSearchParams();
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.mediaType && options.mediaType !== 'all') {
    params.append('mediaType', options.mediaType);
  }

  return useQuery({
    queryKey: ['downloads', 'history', userId, options],
    queryFn: () => apiClient.get(`/users/${userId}/downloads/history?${params.toString()}`),
    enabled: options?.enabled ?? true,
    staleTime: 300000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to bulk download multiple files
 * @param userId - User ID performing the download
 */
export const useBulkDownload = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation<{ downloadUrl: string; expiresAt: string }, ApiError, string[]>({
    mutationFn: (downloadIds) => 
      apiClient.post<{ downloadUrl: string; expiresAt: string }>('/downloads/bulk', {
        downloadIds,
      }),
    onSuccess: () => {
      // Invalidate download-related queries
      queryClient.invalidateQueries({ queryKey: ['downloads', 'user', userId] });
      queryClient.invalidateQueries({ queryKey: ['downloads', 'history', userId] });
    },
    onError: (error) => {
      console.error('Failed to create bulk download:', error);
    },
  });
};
