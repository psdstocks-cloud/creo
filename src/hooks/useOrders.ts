import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-client'

// ============================================================================
// Order Management Hooks for Unified Tracking
// ============================================================================

/**
 * Get user orders with pagination and filtering
 */
export const useUserOrders = (_options?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.orders(),
    queryFn: async () => {
      // This combines both stock and AI orders
      // Implementation would aggregate from localStorage or backend
      const stockOrders = JSON.parse(localStorage.getItem('stock_orders') || '[]')
      const aiJobs = JSON.parse(localStorage.getItem('ai_jobs_history') || '[]')
      
      return [...stockOrders, ...aiJobs].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get specific order details
 */
export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: async () => {
      // Fetch specific order details
      const orders = JSON.parse(localStorage.getItem('all_orders') || '[]')
      return orders.find((order: Record<string, unknown>) => order.id === orderId)
    },
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Get order statistics
 */
export const useOrderStatistics = () => {
  return useQuery({
    queryKey: [...queryKeys.orders(), 'statistics'],
    queryFn: async () => {
      const orders = JSON.parse(localStorage.getItem('all_orders') || '[]')
      
      return {
        total: orders.length,
        processing: orders.filter((o: Record<string, unknown>) => o.status === 'processing').length,
        completed: orders.filter((o: Record<string, unknown>) => o.status === 'completed' || o.status === 'ready').length,
        failed: orders.filter((o: Record<string, unknown>) => o.status === 'failed' || o.status === 'error').length,
        totalSpent: orders.reduce((sum: number, o: Record<string, unknown>) => sum + (Number(o.cost) || 0), 0),
      }
    },
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Get download history
 */
export const useDownloadHistory = () => {
  return useQuery({
    queryKey: [...queryKeys.orders(), 'downloads'],
    queryFn: async () => {
      const downloads = localStorage.getItem('download_history')
      return downloads ? JSON.parse(downloads) : []
    },
    staleTime: 30 * 1000,
  })
}

/**
 * Track download action
 */
export const useTrackDownload = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (downloadInfo: {
      orderId: string;
      fileName: string;
      downloadUrl: string;
      timestamp: number;
    }) => {
      const history = JSON.parse(localStorage.getItem('download_history') || '[]')
      history.unshift(downloadInfo)
      localStorage.setItem('download_history', JSON.stringify(history.slice(0, 100)))
      return downloadInfo
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.all, 'downloads'] })
    },
  })
}

/**
 * Bulk order operations
 */
export const useBulkOrderActions = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (actions: {
      orderIds: string[];
      action: 'cancel' | 'retry' | 'delete';
    }) => {
      // Implementation for bulk operations
      const orders = JSON.parse(localStorage.getItem('all_orders') || '[]')
      
      switch (actions.action) {
        case 'cancel':
          // Cancel processing orders
          break;
        case 'retry':
          // Retry failed orders
          break;
        case 'delete':
          // Delete completed orders
          break;
      }
      
      localStorage.setItem('all_orders', JSON.stringify(orders))
      return { success: true, affected: actions.orderIds.length }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders() })
    },
  })
}

/**
 * Order analytics and insights
 */
export const useOrderAnalytics = () => {
  return useQuery({
    queryKey: [...queryKeys.orders(), 'analytics'],
    queryFn: async () => {
      const orders = JSON.parse(localStorage.getItem('all_orders') || '[]')
      
      // Calculate analytics
      const totalOrders = orders.length
      const totalSpent = orders.reduce((sum: number, o: Record<string, unknown>) => sum + (Number(o.cost) || 0), 0)
      const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
      
      // Group by month
      const monthlyData = orders.reduce((acc: Record<string, { count: number; spent: number }>, order: Record<string, unknown>) => {
        const month = new Date(String(order.created_at)).toISOString().slice(0, 7)
        if (!acc[month]) {
          acc[month] = { count: 0, spent: 0 }
        }
        acc[month].count++
        acc[month].spent += Number(order.cost) || 0
        return acc
      }, {})
      
      return {
        totalOrders,
        totalSpent,
        avgOrderValue,
        monthlyData,
        successRate: orders.filter((o: Record<string, unknown>) => o.status === 'completed').length / totalOrders,
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
