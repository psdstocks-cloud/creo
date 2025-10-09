import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nehtwClient } from '@/lib/nehtw-client'
import { useUser } from '@/contexts/UserContext'
import { useToastHelpers } from '@/components/ui/Toast'

// Unified Order Types
export interface UnifiedOrder {
  id: string
  type: 'stock' | 'ai'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  title: string
  description: string
  cost: number
  createdAt: string
  updatedAt: string
  completedAt?: string
  progress?: number
  
  // Stock-specific fields
  stockSite?: string
  stockId?: string
  stockUrl?: string
  
  // AI-specific fields
  prompt?: string
  aiJobId?: string
  aiStyle?: string
  aiQuality?: string
  
  // Files and downloads
  files?: OrderFile[]
  downloadLinks?: DownloadLink[]
  
  // Metadata
  metadata?: Record<string, unknown>
}

export interface OrderFile {
  id: string
  name: string
  url: string
  thumbnailUrl?: string
  size?: number
  type: 'image' | 'video' | 'document'
  format: string
  downloadCount: number
  lastDownloaded?: string
}

export interface DownloadLink {
  id: string
  url: string
  expiresAt: string
  type: 'direct' | 'gdrive' | 'dropbox'
  isActive: boolean
}

// Get all user orders with unified format
export const useUserOrders = (filters?: {
  type?: 'stock' | 'ai'
  status?: string
  dateRange?: { start: string; end: string }
  search?: string
}) => {
  const { user } = useUser()
  
  return useQuery({
    queryKey: ['user-orders', user?.id, filters],
    queryFn: async () => {
      if (!user) return []
      
      // Get orders from localStorage and API
      const localOrders: UnifiedOrder[] = await getLocalOrders(user.id)
      const apiOrders: UnifiedOrder[] = await fetchAPIOrders()
      
      // Combine and format orders
      let allOrders: UnifiedOrder[] = localOrders.concat(apiOrders)
      
      // Apply filters
      if (filters?.type) {
        allOrders = allOrders.filter(order => order.type === filters.type)
      }
      
      if (filters?.status) {
        allOrders = allOrders.filter(order => order.status === filters.status)
      }
      
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase()
        allOrders = allOrders.filter(order => 
          order.title.toLowerCase().includes(searchTerm) ||
          order.description.toLowerCase().includes(searchTerm) ||
          (order.prompt && order.prompt.toLowerCase().includes(searchTerm))
        )
      }
      
      if (filters?.dateRange) {
        allOrders = allOrders.filter(order => {
          const orderDate = new Date(order.createdAt)
          return orderDate >= new Date(filters.dateRange!.start) && 
                 orderDate <= new Date(filters.dateRange!.end)
        })
      }
      
      // Sort by creation date (newest first)
      return allOrders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get detailed order information
export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: ['order-details', orderId],
    queryFn: async () => {
      const order = await getOrderById(orderId)
      if (!order) throw new Error('Order not found')
      
      // Fetch real-time status if processing
      if (order.status === 'processing') {
        if (order.type === 'stock') {
          const stockStatus = await nehtwClient.getOrderStatus(orderId)
          order.status = stockStatus.status
          order.progress = (stockStatus as { progress?: number }).progress || 0
        } else if (order.type === 'ai') {
          const aiResult = await nehtwClient.getAIResult(orderId)
          order.status = aiResult.status === 'completed' ? 'completed' : 'processing'
          order.progress = aiResult.progress || 0
          order.files = aiResult.result?.images?.map(formatAIFile) || []
        }
      }
      
      return order
    },
    enabled: !!orderId,
    refetchInterval: (query: { state: { data?: UnifiedOrder } }) => {
      // Poll every 3 seconds if processing
      return query.state.data?.status === 'processing' ? 3000 : false
    },
  })
}

// Generate download links
export const useGenerateDownloadLink = () => {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToastHelpers()
  
  return useMutation({
    mutationFn: async ({ orderId, fileId, type = 'direct' }: {
      orderId: string
      fileId: string
      type?: 'direct' | 'gdrive' | 'dropbox'
    }) => {
      const order = await getOrderById(orderId)
      if (!order) throw new Error('Order not found')
      
      let downloadLink: string
      
      if (order.type === 'stock') {
        const result = await nehtwClient.getDownloadLink(orderId, type as 'any' | 'gdrive' | 'mydrivelink' | 'asia')
        downloadLink = result.url
      } else if (order.type === 'ai') {
        const file = order.files?.find(f => f.id === fileId)
        if (!file) throw new Error('File not found')
        downloadLink = file.url
      } else {
        throw new Error('Invalid order type')
      }
      
      // Track download
      await trackDownload(orderId, fileId)
      
      return { downloadLink, orderId, fileId }
    },
    onSuccess: (data) => {
      // Invalidate order details to refresh download count
      queryClient.invalidateQueries({ 
        queryKey: ['order-details', data.orderId] 
      })
      
      success('Download Link Generated', 'Your download link is ready.')
    },
    onError: (error) => {
      showError('Download Failed', error.message || 'Failed to generate download link')
    },
  })
}

// Cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient()
  const { success, error: showError } = useToastHelpers()
  
  return useMutation({
    mutationFn: async (orderId: string) => {
      // In a real app, this would call the API to cancel
      // For now, just update local storage
      await cancelOrderById(orderId)
      return orderId
    },
    onSuccess: (orderId) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['user-orders'] })
      queryClient.invalidateQueries({ queryKey: ['order-details', orderId] })
      
      success('Order Cancelled', 'Your order has been cancelled successfully.')
    },
    onError: (error) => {
      showError('Cancel Failed', error.message || 'Failed to cancel order')
    },
  })
}

// Get order analytics
export const useOrderAnalytics = () => {
  const { user } = useUser()
  
  return useQuery({
    queryKey: ['order-analytics', user?.id],
    queryFn: async () => {
      if (!user) return null
      
      const localOrders = await getLocalOrders(user.id)
      const apiOrders = await fetchAPIOrders()
      const orders = localOrders.concat(apiOrders)
      const downloads = getDownloadAnalytics()
      
      // Calculate analytics
      const totalOrders = orders.length
      const completedOrders = orders.filter(o => o.status === 'completed').length
      const processingOrders = orders.filter(o => o.status === 'processing').length
      const totalSpent = orders.reduce((sum, order) => sum + order.cost, 0)
      
      // Monthly breakdown
      const monthlyData = getMonthlyBreakdown(orders)
      
      // Type breakdown
      const typeBreakdown = {
        stock: orders.filter(o => o.type === 'stock').length,
        ai: orders.filter(o => o.type === 'ai').length,
      }
      
      // Status breakdown
      const statusBreakdown = {
        completed: orders.filter(o => o.status === 'completed').length,
        processing: orders.filter(o => o.status === 'processing').length,
        failed: orders.filter(o => o.status === 'failed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
      }
      
      return {
        totalOrders,
        completedOrders,
        processingOrders,
        totalSpent,
        monthlyData,
        typeBreakdown,
        statusBreakdown,
        downloads,
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Helper functions
async function getLocalOrders(userId: string): Promise<UnifiedOrder[]> {
  try {
    // Get stock orders
    const stockOrders = JSON.parse(localStorage.getItem(`stock_orders_${userId}`) || '[]')
    // Get AI orders  
    const aiOrders = JSON.parse(localStorage.getItem(`ai_jobs_${userId}`) || '[]')
    
    const formattedStockOrders: UnifiedOrder[] = stockOrders.map((order: {
      taskId?: string
      id?: string
      status?: string
      site?: string
      mediaId?: string
      cost?: number
      createdAt: string
      updatedAt?: string
      originalUrl?: string
      files?: OrderFile[]
    }) => ({
      id: order.taskId || order.id,
      type: 'stock' as const,
      status: order.status || 'processing',
      title: `Stock Media from ${order.site}`,
      description: `Media ID: ${order.mediaId}`,
      cost: order.cost || 0,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt || order.createdAt,
      stockSite: order.site,
      stockId: order.mediaId,
      stockUrl: order.originalUrl,
      files: order.files || [],
    }))
    
    const formattedAIOrders: UnifiedOrder[] = aiOrders.map((job: {
      id: string
      status?: string
      prompt?: string
      cost?: number
      createdAt: string
      updatedAt?: string
      settings?: { style?: string; quality?: string }
      files?: OrderFile[]
    }) => ({
      id: job.id,
      type: 'ai' as const,
      status: job.status === 'completed' ? 'completed' : 'processing',
      title: `AI Generated: ${job.prompt?.substring(0, 50)}...`,
      description: job.prompt || 'AI Image Generation',
      cost: job.cost || 0.1,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt || job.createdAt,
      prompt: job.prompt,
      aiJobId: job.id,
      aiStyle: job.settings?.style,
      aiQuality: job.settings?.quality,
      files: job.files || [],
    }))
    
    return [...formattedStockOrders, ...formattedAIOrders]
  } catch (error) {
    console.error('Failed to get local orders:', error)
    return []
  }
}

const fetchAPIOrders = async (): Promise<UnifiedOrder[]> => {
  // In a real app, this would fetch from your backend API
  // that aggregates orders from various sources
  return []
}

async function getOrderById(_orderId: string): Promise<UnifiedOrder | null> {
  // Implementation would fetch order details from storage/API
  return null
}

async function trackDownload(orderId: string, fileId: string): Promise<void> {
  // Track download analytics
  const downloadEvent = {
    orderId,
    fileId,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  }
  
  // Save to analytics storage
  const downloads = JSON.parse(localStorage.getItem('download_analytics') || '[]')
  downloads.push(downloadEvent)
  localStorage.setItem('download_analytics', JSON.stringify(downloads.slice(-1000))) // Keep last 1000
}

async function cancelOrderById(_orderId: string): Promise<void> {
  // Implementation would cancel order via API
  // For now, just update local storage status
}

function formatAIFile(file: {
  id?: string
  filename?: string
  download?: string
  url?: string
  thumb_lg?: string
  thumb_sm?: string
  size?: number
}): OrderFile {
  return {
    id: file.id || Math.random().toString(),
    name: file.filename || `ai-generated-${Date.now()}.jpg`,
    url: file.download || file.url || '',
    thumbnailUrl: file.thumb_lg || file.thumb_sm,
    size: file.size,
    type: 'image',
    format: 'jpg',
    downloadCount: 0,
  }
}

function getDownloadAnalytics() {
  try {
    const downloads = JSON.parse(localStorage.getItem('download_analytics') || '[]')
    return {
      totalDownloads: downloads.length,
      recentDownloads: downloads.slice(-10),
      downloadsByDay: getDownloadsByDay(downloads),
    }
  } catch (error) {
    console.error('Failed to get download analytics:', error)
    return { totalDownloads: 0, recentDownloads: [], downloadsByDay: [] }
  }
}

function getDownloadsByDay(downloads: Array<{ timestamp: string }>) {
  const dayMap = new Map()
  
  downloads.forEach(download => {
    const day = new Date(download.timestamp).toDateString()
    dayMap.set(day, (dayMap.get(day) || 0) + 1)
  })
  
  return Array.from(dayMap.entries()).map(([day, count]) => ({ day, count }))
}

function getMonthlyBreakdown(orders: UnifiedOrder[]) {
  const monthMap = new Map()
  
  orders.forEach(order => {
    const month = new Date(order.createdAt).toISOString().slice(0, 7) // YYYY-MM
    if (!monthMap.has(month)) {
      monthMap.set(month, { orders: 0, spent: 0 })
    }
    const data = monthMap.get(month)
    data.orders += 1
    data.spent += order.cost
  })
  
  return Array.from(monthMap.entries()).map(([month, data]) => ({ month, ...data }))
}
