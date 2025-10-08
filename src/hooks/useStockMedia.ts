import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nehtwClient } from '@/lib/nehtw-api-client'
import { queryKeys } from '@/lib/query-client'

export const useStockInfo = (site: string, id: string, url?: string) => {
  return useQuery({
    queryKey: queryKeys.stockInfo(site, id, url),
    queryFn: () => nehtwClient.getStockInfo(site, id, url),
    enabled: !!(site && id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ site, id, url }: { site: string; id: string; url?: string }) =>
      nehtwClient.createStockOrder(site, id, url),
    onSuccess: (data) => {
      const taskId = data.task_id
      // Invalidate orders list and start polling for status
      queryClient.invalidateQueries({ queryKey: queryKeys.orders() })
      
      // Pre-populate the order status cache
      queryClient.setQueryData(queryKeys.orderStatus(taskId), {
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
    queryKey: queryKeys.orderStatus(taskId),
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

// Enhanced hooks for NEHTW API integration
export const useStockSites = () => {
  return useQuery({
    queryKey: queryKeys.stockSites(),
    queryFn: () => nehtwClient.getStockSites(),
    staleTime: 10 * 60 * 1000, // 10 minutes - sites don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  })
}

export const useUserBalance = () => {
  return useQuery({
    queryKey: queryKeys.userBalance(),
    queryFn: () => nehtwClient.getUserBalance(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}
