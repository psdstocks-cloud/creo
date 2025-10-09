import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nehtwClient } from '@/lib/nehtw-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/components/auth/AuthProvider'
import { useToastHelpers } from '@/components/ui/Toast'
import { StockInfo, OrderRequest, OrderStatus, DownloadLink, StockSitesResponse, AccountBalance } from '@/types/nehtw'

// Get available stock sites
export const useStockSites = () => {
  const { user } = useAuth()
  
  return useQuery<StockSitesResponse, Error>({
    queryKey: queryKeys.stockSites(),
    queryFn: () => nehtwClient.getStockSites(),
    enabled: !!user, // Only fetch if user is authenticated
    staleTime: 10 * 60 * 1000, // 10 minutes - sites don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  })
}

// Get specific stock information
export const useStockInfo = (site: string, id: string, url?: string) => {
  const { user } = useAuth()
  
  return useQuery<StockInfo, Error>({
    queryKey: queryKeys.stockInfo(site, id, url),
    queryFn: () => nehtwClient.getStockInfo(site, id, url),
    enabled: !!(user && site && id), // Only run if we have required params
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes cache
  })
}

// Create stock order mutation
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToastHelpers()
  
  return useMutation<string, Error, OrderRequest>({
    mutationFn: (orderRequest) => nehtwClient.createOrder(orderRequest),
    onSuccess: (taskId) => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders() })
      
      // Pre-populate order status cache
      queryClient.setQueryData(queryKeys.orderStatus(taskId), {
        success: true,
        status: 'processing'
      })
      
      // Show success toast
      success('Order Created', `Your order ${taskId} is being processed.`)
    },
    onError: (error) => {
      showError('Order Failed', error.message || 'Failed to create order')
    },
  })
}

// Poll order status with real-time updates
export const useOrderStatus = (taskId: string, enabled = true) => {
  return useQuery<OrderStatus, Error>({
    queryKey: queryKeys.orderStatus(taskId),
    queryFn: () => nehtwClient.getOrderStatus(taskId),
    enabled: enabled && !!taskId,
    refetchInterval: (data) => {
      // Poll every 3 seconds if processing (respects 2s rate limit + buffer)
      return data?.status === 'processing' ? 3000 : false
    },
    staleTime: 0, // Always refetch for live status
    gcTime: 5 * 60 * 1000, // 5 minutes cache
  })
}

// Generate download links
export const useDownloadLink = () => {
  const { success, error: showError } = useToastHelpers()
  
  return useMutation<DownloadLink, Error, { taskId: string; responseType?: 'any' | 'gdrive' | 'mydrivelink' | 'asia' }>({
    mutationFn: ({ taskId, responseType = 'any' }) =>
      nehtwClient.getDownloadLink(taskId, responseType),
    onSuccess: (data) => {
      if (data.downloadLink) {
        success('Download Ready', 'Your download link has been generated.')
      }
    },
    onError: (error) => {
      showError('Download Failed', error.message || 'Failed to generate download link')
    },
  })
}

// Get user balance with auto-refresh
export const useUserBalance = () => {
  const { user } = useAuth()
  
  return useQuery<AccountBalance, Error>({
    queryKey: queryKeys.userBalance(),
    queryFn: () => nehtwClient.getBalance(),
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Refresh every minute
  })
}