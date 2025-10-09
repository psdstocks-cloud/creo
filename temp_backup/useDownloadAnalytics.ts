'use client'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useUser } from '@/contexts/UserContext'

// ============================================================================
// Download Analytics Interfaces
// ============================================================================

export interface DownloadAnalytics {
  overview: DownloadOverview
  usage: DownloadUsage
  trends: DownloadTrends
  performance: DownloadPerformance
}

export interface DownloadOverview {
  totalFiles: number
  totalDownloads: number
  totalSize: number
  averageFileSize: number
  mostDownloadedFile: string
  recentDownloads: number
  storageUsed: number
  storageLimit: number
}

export interface DownloadUsage {
  downloadsByDay: Array<{
    date: string
    count: number
    size: number
  }>
  downloadsByType: {
    image: number
    video: number
    document: number
  }
  downloadsByOrderType: {
    stock: number
    ai: number
  }
  topDownloadedFiles: Array<{
    id: string
    name: string
    downloadCount: number
    lastDownloaded: string
  }>
  userBehavior: {
    averageDownloadsPerSession: number
    peakDownloadHours: number[]
    downloadFrequency: 'daily' | 'weekly' | 'monthly'
  }
}

export interface DownloadTrends {
  dailyTrends: Array<{
    date: string
    downloads: number
    size: number
  }>
  weeklyTrends: Array<{
    week: string
    downloads: number
    size: number
  }>
  monthlyTrends: Array<{
    month: string
    downloads: number
    size: number
  }>
  growthMetrics: {
    downloadGrowth: number
    sizeGrowth: number
    userGrowth: number
  }
}

export interface DownloadPerformance {
  downloadSpeed: {
    averageSpeed: number
    fastestDownload: number
    slowestDownload: number
  }
  successRate: {
    successfulDownloads: number
    failedDownloads: number
    retryRate: number
  }
  userExperience: {
    averageDownloadTime: number
    userSatisfaction: number
    errorRate: number
  }
}

// ============================================================================
// Download Analytics Hooks
// ============================================================================

export const useDownloadAnalytics = (timeRange: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
  const { user } = useUser()
  
  return useQuery({
    queryKey: ['download-analytics', user?.id, timeRange],
    queryFn: async (): Promise<DownloadAnalytics> => {
      if (!user) throw new Error('User not authenticated')
      
      // Get download data from localStorage (mock implementation)
      const downloads = getDownloadHistory(user.id, timeRange)
      const files = getFileHistory(user.id, timeRange)
      
      // Process analytics
      const overview = calculateDownloadOverview(downloads, files)
      const usage = calculateDownloadUsage(downloads, files, timeRange)
      const trends = calculateDownloadTrends(downloads, timeRange)
      const performance = calculateDownloadPerformance(downloads)
      
      return { overview, usage, trends, performance }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useDownloadInsights = () => {
  const { user } = useUser()
  
  return useQuery({
    queryKey: ['download-insights', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      
      const downloads = getDownloadHistory(user.id, 'month')
      return generateDownloadInsights(downloads)
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useDownloadRecommendations = () => {
  const { user } = useUser()
  
  return useQuery({
    queryKey: ['download-recommendations', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      
      const downloads = getDownloadHistory(user.id, 'month')
      const files = getFileHistory(user.id, 'month')
      return generateDownloadRecommendations(downloads, files)
    },
    enabled: !!user,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

export const useDownloadExport = () => {
  return useMutation({
    mutationFn: async ({ 
      format, 
      timeRange, 
      includeFiles = false 
    }: { 
      format: 'csv' | 'json'
      timeRange: 'week' | 'month' | 'quarter' | 'year'
      includeFiles?: boolean
    }) => {
      const analytics = await generateDownloadReport(timeRange, includeFiles)
      return downloadAnalyticsReport(analytics, format)
    },
  })
}

// ============================================================================
// Helper Functions
// ============================================================================

function getDownloadHistory(userId: string, timeRange: string) {
  try {
    const downloads = JSON.parse(localStorage.getItem(`download_history_${userId}`) || '[]')
    const startDate = getStartDateForRange(timeRange)
    return downloads.filter((download: any) => new Date(download.downloadedAt) >= startDate)
  } catch {
    return []
  }
}

function getFileHistory(userId: string, timeRange: string) {
  try {
    const files = JSON.parse(localStorage.getItem(`file_history_${userId}`) || '[]')
    const startDate = getStartDateForRange(timeRange)
    return files.filter((file: any) => new Date(file.createdAt) >= startDate)
  } catch {
    return []
  }
}

function getStartDateForRange(timeRange: string): Date {
  const now = new Date()
  switch (timeRange) {
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case 'quarter':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    case 'year':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}

function calculateDownloadOverview(downloads: any[], files: any[]): DownloadOverview {
  const totalFiles = files.length
  const totalDownloads = downloads.length
  const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0)
  const averageFileSize = totalFiles > 0 ? totalSize / totalFiles : 0
  
  // Find most downloaded file
  const downloadCounts = downloads.reduce((acc, download) => {
    acc[download.fileId] = (acc[download.fileId] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const mostDownloadedFileId = Object.entries(downloadCounts).reduce((max, [id, count]) => 
    count > (downloadCounts[max] || 0) ? id : max, ''
  )
  
  const mostDownloadedFile = files.find(f => f.id === mostDownloadedFileId)?.name || 'Unknown'
  
  const recentDownloads = downloads.filter(d => {
    const downloadDate = new Date(d.downloadedAt)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return downloadDate >= weekAgo
  }).length
  
  const storageUsed = totalSize
  const storageLimit = 10 * 1024 * 1024 * 1024 // 10GB mock limit
  
  return {
    totalFiles,
    totalDownloads,
    totalSize,
    averageFileSize,
    mostDownloadedFile,
    recentDownloads,
    storageUsed,
    storageLimit
  }
}

function calculateDownloadUsage(downloads: any[], files: any[], timeRange: string): DownloadUsage {
  // Downloads by day
  const downloadsByDay = generateDailyDownloadData(downloads, timeRange)
  
  // Downloads by type
  const downloadsByType = {
    image: downloads.filter(d => d.type === 'image').length,
    video: downloads.filter(d => d.type === 'video').length,
    document: downloads.filter(d => d.type === 'document').length,
  }
  
  // Downloads by order type
  const downloadsByOrderType = {
    stock: downloads.filter(d => d.orderType === 'stock').length,
    ai: downloads.filter(d => d.orderType === 'ai').length,
  }
  
  // Top downloaded files
  const downloadCounts = downloads.reduce((acc, download) => {
    const file = files.find(f => f.id === download.fileId)
    if (file) {
      if (!acc[file.id]) {
        acc[file.id] = { file, count: 0, lastDownloaded: download.downloadedAt }
      }
      acc[file.id].count++
      if (new Date(download.downloadedAt) > new Date(acc[file.id].lastDownloaded)) {
        acc[file.id].lastDownloaded = download.downloadedAt
      }
    }
    return acc
  }, {} as Record<string, any>)
  
  const topDownloadedFiles = Object.values(downloadCounts)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10)
    .map((item: any) => ({
      id: item.file.id,
      name: item.file.name,
      downloadCount: item.count,
      lastDownloaded: item.lastDownloaded
    }))
  
  // User behavior
  const userBehavior = {
    averageDownloadsPerSession: downloads.length / Math.max(1, new Set(downloads.map(d => d.sessionId)).size),
    peakDownloadHours: generatePeakHours(downloads),
    downloadFrequency: determineDownloadFrequency(downloads)
  }
  
  return {
    downloadsByDay,
    downloadsByType,
    downloadsByOrderType,
    topDownloadedFiles,
    userBehavior
  }
}

function calculateDownloadTrends(downloads: any[], timeRange: string): DownloadTrends {
  const dailyTrends = generateDailyTrends(downloads, timeRange)
  const weeklyTrends = generateWeeklyTrends(downloads, timeRange)
  const monthlyTrends = generateMonthlyTrends(downloads, timeRange)
  
  const growthMetrics = {
    downloadGrowth: calculateGrowthRate(dailyTrends.map(d => d.downloads)),
    sizeGrowth: calculateGrowthRate(dailyTrends.map(d => d.size)),
    userGrowth: 0 // Mock value
  }
  
  return {
    dailyTrends,
    weeklyTrends,
    monthlyTrends,
    growthMetrics
  }
}

function calculateDownloadPerformance(downloads: any[]): DownloadPerformance {
  const successfulDownloads = downloads.filter(d => d.status === 'success').length
  const failedDownloads = downloads.filter(d => d.status === 'failed').length
  const totalDownloads = downloads.length
  
  const downloadSpeed = {
    averageSpeed: downloads.reduce((sum, d) => sum + (d.speed || 0), 0) / totalDownloads || 0,
    fastestDownload: Math.max(...downloads.map(d => d.speed || 0)),
    slowestDownload: Math.min(...downloads.map(d => d.speed || 0))
  }
  
  const successRate = {
    successfulDownloads,
    failedDownloads,
    retryRate: downloads.filter(d => d.retryCount > 0).length / totalDownloads || 0
  }
  
  const userExperience = {
    averageDownloadTime: downloads.reduce((sum, d) => sum + (d.duration || 0), 0) / totalDownloads || 0,
    userSatisfaction: 4.5, // Mock value
    errorRate: failedDownloads / totalDownloads || 0
  }
  
  return {
    downloadSpeed,
    successRate,
    userExperience
  }
}

function generateDownloadInsights(downloads: any[]): string[] {
  const insights: string[] = []
  
  // Download frequency insights
  const dailyDownloads = downloads.filter(d => {
    const downloadDate = new Date(d.downloadedAt)
    const today = new Date()
    return downloadDate.toDateString() === today.toDateString()
  }).length
  
  if (dailyDownloads > 10) {
    insights.push('High daily download activity - consider bulk download features')
  } else if (dailyDownloads < 2) {
    insights.push('Low download activity - explore new content types')
  }
  
  // File type preferences
  const typeCounts = downloads.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const mostDownloadedType = Object.entries(typeCounts).reduce((max, [type, count]) => 
    count > (typeCounts[max] || 0) ? type : max, ''
  )
  
  insights.push(`Most downloaded content type: ${mostDownloadedType}`)
  
  // Time-based insights
  const hourCounts = downloads.reduce((acc, d) => {
    const hour = new Date(d.downloadedAt).getHours()
    acc[hour] = (acc[hour] || 0) + 1
    return acc
  }, {} as Record<number, number>)
  
  const peakHour = Object.entries(hourCounts).reduce((max, [hour, count]) => 
    count > (hourCounts[parseInt(max)] || 0) ? hour : max, '0'
  )
  
  insights.push(`Peak download time: ${peakHour}:00`)
  
  return insights
}

function generateDownloadRecommendations(downloads: any[], files: any[]): string[] {
  const recommendations: string[] = []
  
  // Storage recommendations
  const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0)
  const storageLimit = 10 * 1024 * 1024 * 1024 // 10GB
  
  if (totalSize > storageLimit * 0.8) {
    recommendations.push('Consider cleaning up old files to free up storage space')
  }
  
  // Download pattern recommendations
  const recentDownloads = downloads.filter(d => {
    const downloadDate = new Date(d.downloadedAt)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return downloadDate >= weekAgo
  })
  
  if (recentDownloads.length === 0) {
    recommendations.push('No recent downloads - explore new content or check for updates')
  }
  
  // File organization recommendations
  const uniqueFiles = new Set(downloads.map(d => d.fileId)).size
  if (uniqueFiles < downloads.length * 0.5) {
    recommendations.push('Consider organizing files into folders for better management')
  }
  
  return recommendations
}

// Data generation helpers
function generateDailyDownloadData(downloads: any[], timeRange: string) {
  const days = []
  const startDate = getStartDateForRange(timeRange)
  const endDate = new Date()
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    const dayDownloads = downloads.filter(download => 
      download.downloadedAt.startsWith(dateStr)
    )
    
    days.push({
      date: dateStr,
      count: dayDownloads.length,
      size: dayDownloads.reduce((sum, download) => sum + (download.size || 0), 0)
    })
  }
  
  return days
}

function generateDailyTrends(downloads: any[], timeRange: string) {
  return generateDailyDownloadData(downloads, timeRange).map(day => ({
    date: day.date,
    downloads: day.count,
    size: day.size
  }))
}

function generateWeeklyTrends(downloads: any[], timeRange: string) {
  // Mock implementation
  return Array.from({ length: 4 }, (_, i) => ({
    week: `Week ${i + 1}`,
    downloads: Math.floor(Math.random() * 20) + 5,
    size: Math.floor(Math.random() * 1000000) + 100000
  }))
}

function generateMonthlyTrends(downloads: any[], timeRange: string) {
  // Mock implementation
  return Array.from({ length: 6 }, (_, i) => ({
    month: `Month ${i + 1}`,
    downloads: Math.floor(Math.random() * 50) + 10,
    size: Math.floor(Math.random() * 5000000) + 500000
  }))
}

function generatePeakHours(downloads: any[]): number[] {
  const hourCounts = downloads.reduce((acc, d) => {
    const hour = new Date(d.downloadedAt).getHours()
    acc[hour] = (acc[hour] || 0) + 1
    return acc
  }, {} as Record<number, number>)
  
  return Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => parseInt(hour))
}

function determineDownloadFrequency(downloads: any[]): 'daily' | 'weekly' | 'monthly' {
  const dailyCount = downloads.filter(d => {
    const downloadDate = new Date(d.downloadedAt)
    const today = new Date()
    return downloadDate.toDateString() === today.toDateString()
  }).length
  
  if (dailyCount > 0) return 'daily'
  
  const weeklyCount = downloads.filter(d => {
    const downloadDate = new Date(d.downloadedAt)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return downloadDate >= weekAgo
  }).length
  
  if (weeklyCount > 0) return 'weekly'
  
  return 'monthly'
}

function calculateGrowthRate(values: number[]): number {
  if (values.length < 2) return 0
  
  const first = values[0]
  const last = values[values.length - 1]
  
  if (first === 0) return last > 0 ? 100 : 0
  
  return ((last - first) / first) * 100
}

async function generateDownloadReport(timeRange: string, includeFiles: boolean) {
  // Mock implementation
  return {
    timeRange,
    generatedAt: new Date().toISOString(),
    includeFiles,
    data: {}
  }
}

function downloadAnalyticsReport(analytics: any, format: string) {
  const blob = new Blob([JSON.stringify(analytics, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `download-analytics-${new Date().toISOString().split('T')[0]}.${format}`
  a.click()
  URL.revokeObjectURL(url)
}
