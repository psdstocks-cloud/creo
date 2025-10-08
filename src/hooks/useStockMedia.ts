import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nehtwClient } from '@/lib/nehtw-client-new'

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
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === 'processing' ? 2000 : false; // Poll every 2s if processing
    },
    staleTime: 0, // Always refetch
  })
}

export const useDownloadLink = (taskId: string) => {
  return useMutation({
    mutationFn: (responseType: 'any' | 'gdrive' | 'mydrivelink' | 'asia' = 'any') =>
      nehtwClient.getDownloadLink(taskId, responseType),
  })
}
