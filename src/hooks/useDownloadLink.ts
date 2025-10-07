import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api-client';

export interface DownloadLinkResponse {
  downloadLink: string;
  fileName: string;
  fileSize: number;
  expiresAt: string;
  maxDownloads: number;
  currentDownloads: number;
  downloadId: string;
  contentType: string;
  checksum?: string;
}

export interface DownloadLinkParams {
  taskId: string;
  responseType?: 'original' | 'compressed' | 'thumbnail' | 'preview';
  format?: string;
  quality?: 'low' | 'medium' | 'high' | 'original';
  watermark?: boolean;
  watermarkText?: string;
}

export interface DownloadStats {
  totalDownloads: number;
  remainingDownloads: number;
  downloadCount: number;
  lastDownloadedAt?: string;
  expiresAt: string;
}

const fetchDownloadLink = async (params: DownloadLinkParams): Promise<DownloadLinkResponse> => {
  const { data } = await apiClient.get<DownloadLinkResponse>(`/order/${params.taskId}/download`, {
    params: {
      response_type: params.responseType || 'original',
      format: params.format,
      quality: params.quality || 'original',
      watermark: params.watermark || false,
      watermark_text: params.watermarkText,
    }
  });
  
  if (!data) {
    throw new Error('Failed to generate download link');
  }
  
  return data;
};

const fetchDownloadStats = async (downloadId: string): Promise<DownloadStats> => {
  const { data } = await apiClient.get<DownloadStats>(`/download/${downloadId}/stats`);
  
  if (!data) {
    throw new Error('Failed to fetch download stats');
  }
  
  return data;
};

export function useDownloadLink(params: DownloadLinkParams, options?: {
  enabled?: boolean;
  staleTime?: number;
  retry?: boolean;
}) {
  const {
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minutes cache
    retry = true,
  } = options || {};

  return useQuery({
    queryKey: ['downloadLink', params],
    queryFn: () => fetchDownloadLink(params),
    enabled: enabled && !!params.taskId,
    staleTime,
    retry: retry ? 3 : false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useDownloadStats(downloadId: string, options?: {
  enabled?: boolean;
  refetchInterval?: number | false;
  staleTime?: number;
}) {
  const {
    enabled = true,
    refetchInterval = 10000, // Poll every 10 seconds
    staleTime = 1000 * 30, // 30 seconds
  } = options || {};

  return useQuery({
    queryKey: ['downloadStats', downloadId],
    queryFn: () => fetchDownloadStats(downloadId),
    enabled: enabled && !!downloadId,
    refetchInterval,
    staleTime,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for generating download link with mutation
export function useGenerateDownloadLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: fetchDownloadLink,
    onSuccess: (data) => {
      // Invalidate and refetch download-related queries
      queryClient.invalidateQueries({ queryKey: ['downloadLink'] });
      queryClient.invalidateQueries({ queryKey: ['downloadStats', data.downloadId] });
      
      // Prefetch download stats
      queryClient.prefetchQuery({
        queryKey: ['downloadStats', data.downloadId],
        queryFn: () => fetchDownloadStats(data.downloadId),
        staleTime: 1000 * 30, // 30 seconds
      });
    },
    onError: (error) => {
      console.error('Download link generation failed:', error);
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for downloading file directly
export function useDownloadFile() {
  return useMutation({
    mutationFn: async (downloadLink: string) => {
      const response = await fetch(downloadLink, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      return {
        blob,
        url,
        size: blob.size,
        type: blob.type,
      };
    },
    onSuccess: (data) => {
      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = data.url;
      link.download = 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      setTimeout(() => {
        window.URL.revokeObjectURL(data.url);
      }, 1000);
    },
    onError: (error) => {
      console.error('File download failed:', error);
    },
  });
}

// Hook for batch download
export function useBatchDownload() {
  return useMutation({
    mutationFn: async (downloadLinks: string[]) => {
      const downloadPromises = downloadLinks.map(async (link) => {
        const response = await fetch(link, {
          method: 'GET',
          headers: {
            'Accept': 'application/octet-stream',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Download failed: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        return {
          blob,
          url,
          size: blob.size,
          type: blob.type,
        };
      });
      
      const results = await Promise.allSettled(downloadPromises);
      
      return results.map((result, index) => ({
        link: downloadLinks[index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null,
      }));
    },
    onSuccess: (results) => {
      // Create download links for successful downloads
      results.forEach((result) => {
        if (result.success && result.data) {
          const link = document.createElement('a');
          link.href = result.data.url;
          link.download = 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the object URL
          setTimeout(() => {
            window.URL.revokeObjectURL(result.data!.url);
          }, 1000);
        }
      });
    },
    onError: (error) => {
      console.error('Batch download failed:', error);
    },
  });
}
