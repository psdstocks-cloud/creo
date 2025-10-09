import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nehtwClient } from '@/lib/nehtw-client'

export const useStockInfo = (site: string, id: string, url?: string) => {
  return useQuery({
    queryKey: ['stockInfo', site, id, url],
    queryFn: () => nehtwClient.getStockInfo(site, id, url),
    enabled: !!(site && id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ site, id, url }: { site: string; id: string; url?: string }) =>
      nehtwClient.createOrder(site, id, url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export const useOrderStatus = (taskId: string, enabled = true) => {
  return useQuery({
    queryKey: ['orderStatus', taskId],
    queryFn: () => nehtwClient.getOrderStatus(taskId),
    enabled: enabled && !!taskId,
    refetchInterval: (query) => 
      query.state.data?.status === 'processing' ? 2000 : false, // Poll every 2s if processing
    staleTime: 0, // Always refetch
  })
}

export const useDownloadLink = () => {
  return useMutation({
    mutationFn: ({ taskId, responseType = 'any' }: { taskId: string; responseType?: 'any' | 'gdrive' | 'mydrivelink' | 'asia' }) =>
      nehtwClient.getDownloadLink(taskId, responseType),
  })
}

// Additional hooks for compatibility
export const useStockSites = () => {
  return useQuery({
    queryKey: ['stockSites'],
    queryFn: () => Promise.resolve({
      'shutterstock': { active: true, price: 0.5 },
      'getty': { active: true, price: 0.75 },
      'unsplash': { active: true, price: 0.25 },
      'pexels': { active: true, price: 0.3 },
    }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useUserBalance = () => {
  return useQuery({
    queryKey: ['userBalance'],
    queryFn: () => nehtwClient.getBalance(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}