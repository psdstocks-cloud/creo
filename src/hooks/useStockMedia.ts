import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nehtwClient } from '@/lib/nehtw-client-new'
import { queryKeys } from '@/lib/query-client'

export const useStockInfo = (site: string, id: string, url?: string) => {
  return useQuery({
    queryKey: queryKeys.stockMedia.info(site, id),
    queryFn: () => nehtwClient.getStockInfo(site, id, url),
    enabled: !!(site && id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ site, id, url }: { site: string; id: string; url?: string }) =>
      nehtwClient.createOrder(site, id, url),
    onSuccess: (taskId) => {
      // Invalidate orders list and start polling for status
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
      
      // Pre-populate the order status cache
      queryClient.setQueryData(queryKeys.orders.status(taskId), {
        success: true,
        status: 'processing'
      })
    },
    onError: (error) => {
      console.error('Failed to create stock order:', error)
    },
  })
}

export const useOrderStatus = (taskId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.orders.status(taskId),
    queryFn: () => nehtwClient.getOrderStatus(taskId),
    enabled: enabled && !!taskId,
    refetchInterval: (query) => {
      // Poll every 3 seconds if processing (respecting 2s rate limit + buffer)
      const data = query.state.data;
      return data?.status === 'processing' ? 3000 : false
    },
    staleTime: 0, // Always refetch
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: (failureCount, error) => {
      // Stop retrying if order failed permanently
      if (error.message?.includes('error')) return false
      return failureCount < 3
    },
  })
}

export const useDownloadLink = () => {
  return useMutation({
    mutationFn: ({ 
      taskId, 
      responseType = 'any' 
    }: { 
      taskId: string; 
      responseType?: 'any' | 'gdrive' | 'mydrivelink' | 'asia' 
    }) => nehtwClient.getDownloadLink(taskId, responseType),
    onError: (error) => {
      console.error('Failed to get download link:', error)
    },
  })
}

// New hooks for enhanced functionality
export const useStockSites = () => {
  return useQuery({
    queryKey: ['stockSites'],
    queryFn: () => nehtwClient.getStockSites(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

export const useUserBalance = () => {
  return useQuery({
    queryKey: ['userBalance'],
    queryFn: () => nehtwClient.getBalance(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}
