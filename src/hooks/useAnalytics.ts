'use client'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useUser } from '@/contexts/UserContext'
import { useUserOrders } from './useOrderManagement'

// ============================================================================
// Enhanced Analytics Interfaces
// ============================================================================

export interface UserAnalytics {
  overview: AnalyticsOverview
  spending: SpendingAnalytics
  usage: UsageAnalytics
  trends: TrendAnalytics
  performance: PerformanceAnalytics
}

export interface AnalyticsOverview {
  totalOrders: number
  completedOrders: number
  totalSpent: number
  averageOrderValue: number
  successRate: number
  totalDownloads: number
  activeOrders: number
  monthlyGrowth: number
}

export interface SpendingAnalytics {
  totalSpent: number
  averageSpending: number
  spendingByType: {
    stock: number
    ai: number
  }
  spendingByMonth: Array<{
    month: string
    amount: number
    orders: number
  }>
  topSpendingCategories: Array<{
    category: string
    amount: number
    percentage: number
  }>
  spendingTrends: {
    weekly: number[]
    monthly: number[]
    quarterly: number[]
  }
  budgetInsights: {
    projectedSpending: number
    budgetRecommendation: number
    savingsOpportunities: string[]
  }
}

export interface UsageAnalytics {
  totalSessions: number
  averageSessionDuration: number
  mostUsedFeatures: Array<{
    feature: string
    usage: number
    percentage: number
  }>
  usageByTimeOfDay: Array<{
    hour: number
    usage: number
  }>
  usageByDayOfWeek: Array<{
    day: string
    usage: number
  }>
  featureAdoption: {
    stockSearch: number
    aiGeneration: number
    orderManagement: number
    analytics: number
  }
  userEngagement: {
    dailyActive: number
    weeklyActive: number
    monthlyActive: number
    retentionRate: number
  }
}

export interface TrendAnalytics {
  orderTrends: {
    daily: Array<{ date: string; count: number; value: number }>
    weekly: Array<{ week: string; count: number; value: number }>
    monthly: Array<{ month: string; count: number; value: number }>
  }
  spendingTrends: {
    daily: Array<{ date: string; amount: number }>
    weekly: Array<{ week: string; amount: number }>
    monthly: Array<{ month: string; amount: number }>
  }
  growthMetrics: {
    orderGrowth: number
    spendingGrowth: number
    userGrowth: number
    revenueGrowth: number
  }
  seasonalPatterns: {
    peakHours: number[]
    peakDays: string[]
    seasonalTrends: Array<{
      season: string
      factor: number
      description: string
    }>
  }
}

export interface PerformanceAnalytics {
  orderPerformance: {
    averageProcessingTime: number
    completionRate: number
    errorRate: number
    customerSatisfaction: number
  }
  systemPerformance: {
    averageResponseTime: number
    uptime: number
    errorRate: number
    throughput: number
  }
  userExperience: {
    pageLoadTime: number
    navigationEfficiency: number
    taskCompletionRate: number
    userSatisfactionScore: number
  }
  businessMetrics: {
    conversionRate: number
    churnRate: number
    lifetimeValue: number
    acquisitionCost: number
  }
}

// ============================================================================
// Enhanced Analytics Hooks
// ============================================================================

export const useUserAnalytics = (timeRange: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
  const { user } = useUser()
  
  return useQuery({
    queryKey: ['user-analytics', user?.id, timeRange],
    queryFn: async (): Promise<UserAnalytics> => {
      if (!user) throw new Error('User not authenticated')
      
      // Get raw data
      const orders = await getUserOrders(user.id, timeRange)
      const downloads = await getUserDownloads(user.id, timeRange)
      const sessions = await getUserSessions(user.id, timeRange)
      
      // Process analytics
      const overview = calculateOverview(orders, downloads)
      const spending = calculateSpendingAnalytics(orders, timeRange)
      const usage = calculateUsageAnalytics(orders, sessions)
      const trends = calculateTrendAnalytics(orders, timeRange)
      const performance = calculatePerformanceAnalytics(orders)
      
      return { overview, spending, usage, trends, performance }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Enhanced analytics hooks for specific metrics
export const useSpendingAnalytics = (timeRange: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
  const { user } = useUser()
  
  return useQuery({
    queryKey: ['spending-analytics', user?.id, timeRange],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      
      const orders = await getUserOrders(user.id, timeRange)
      return calculateSpendingAnalytics(orders, timeRange)
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })
}

export const useUsageAnalytics = (timeRange: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
  const { user } = useUser()
  
  return useQuery({
    queryKey: ['usage-analytics', user?.id, timeRange],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      
      const orders = await getUserOrders(user.id, timeRange)
      const sessions = await getUserSessions(user.id, timeRange)
      return calculateUsageAnalytics(orders, sessions)
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })
}

export const useTrendAnalytics = (timeRange: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
  const { user } = useUser()
  
  return useQuery({
    queryKey: ['trend-analytics', user?.id, timeRange],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      
      const orders = await getUserOrders(user.id, timeRange)
      return calculateTrendAnalytics(orders, timeRange)
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })
}

export const usePerformanceAnalytics = () => {
  const { user } = useUser()
  
  return useQuery({
    queryKey: ['performance-analytics', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      
      const orders = await getUserOrders(user.id, 'month')
      return calculatePerformanceAnalytics(orders)
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Export analytics mutation
export const useExportAnalytics = () => {
  return useMutation({
    mutationFn: async ({ 
      format, 
      timeRange, 
      includeCharts = false 
    }: { 
      format: 'pdf' | 'csv' | 'json'
      timeRange: 'week' | 'month' | 'quarter' | 'year'
      includeCharts?: boolean
    }) => {
      const analytics = await generateAnalyticsReport(timeRange, includeCharts)
      return downloadAnalyticsReport(analytics, format)
    },
  })
}

// ============================================================================
// Helper Functions
// ============================================================================

async function getUserOrders(userId: string, timeRange: string) {
  // Mock implementation - replace with actual API call
  const orders = JSON.parse(localStorage.getItem(`user_orders_${userId}`) || '[]')
  const startDate = getStartDateForRange(timeRange)
  return orders.filter((order: any) => new Date(order.createdAt) >= startDate)
}

async function getUserDownloads(userId: string, timeRange: string) {
  // Mock implementation - replace with actual API call
  const downloads = JSON.parse(localStorage.getItem(`user_downloads_${userId}`) || '[]')
  const startDate = getStartDateForRange(timeRange)
  return downloads.filter((download: any) => new Date(download.downloadedAt) >= startDate)
}

async function getUserSessions(userId: string, timeRange: string) {
  // Mock implementation - replace with actual API call
  const sessions = JSON.parse(localStorage.getItem(`user_sessions_${userId}`) || '[]')
  const startDate = getStartDateForRange(timeRange)
  return sessions.filter((session: any) => new Date(session.startedAt) >= startDate)
}

function calculateOverview(orders: any[], downloads: any[]): AnalyticsOverview {
  const totalOrders = orders.length
  const completedOrders = orders.filter(o => o.status === 'completed').length
  const totalSpent = orders.reduce((sum, order) => sum + (order.cost || 0), 0)
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
  const successRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
  const totalDownloads = downloads.length
  const activeOrders = orders.filter(o => o.status === 'processing').length
  
  // Calculate monthly growth (mock implementation)
  const monthlyGrowth = Math.random() * 20 - 10 // -10% to +10%
  
  return {
    totalOrders,
    completedOrders,
    totalSpent,
    averageOrderValue,
    successRate,
    totalDownloads,
    activeOrders,
    monthlyGrowth
  }
}

function calculateSpendingAnalytics(orders: any[], timeRange: string): SpendingAnalytics {
  const totalSpent = orders.reduce((sum, order) => sum + (order.cost || 0), 0)
  const averageSpending = orders.length > 0 ? totalSpent / orders.length : 0
  
  const spendingByType = {
    stock: orders.filter(o => o.type === 'stock').reduce((sum, order) => sum + (order.cost || 0), 0),
    ai: orders.filter(o => o.type === 'ai').reduce((sum, order) => sum + (order.cost || 0), 0)
  }
  
  // Mock monthly spending data
  const spendingByMonth = generateMonthlySpendingData(orders, timeRange)
  
  const topSpendingCategories = [
    { category: 'Stock Media', amount: spendingByType.stock, percentage: (spendingByType.stock / totalSpent) * 100 },
    { category: 'AI Generation', amount: spendingByType.ai, percentage: (spendingByType.ai / totalSpent) * 100 }
  ]
  
  const spendingTrends = {
    weekly: generateWeeklyTrends(orders),
    monthly: generateMonthlyTrends(orders),
    quarterly: generateQuarterlyTrends(orders)
  }
  
  const budgetInsights = {
    projectedSpending: totalSpent * 1.2, // 20% increase projection
    budgetRecommendation: totalSpent * 1.1, // 10% increase recommendation
    savingsOpportunities: [
      'Consider bulk purchases for better rates',
      'Use AI generation for cost-effective content',
      'Plan orders to avoid rush fees'
    ]
  }
  
  return {
    totalSpent,
    averageSpending,
    spendingByType,
    spendingByMonth,
    topSpendingCategories,
    spendingTrends,
    budgetInsights
  }
}

function calculateUsageAnalytics(orders: any[], sessions: any[]): UsageAnalytics {
  const totalSessions = sessions.length
  const averageSessionDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0) / totalSessions || 0
  
  const mostUsedFeatures = [
    { feature: 'Stock Search', usage: orders.filter(o => o.type === 'stock').length, percentage: 60 },
    { feature: 'AI Generation', usage: orders.filter(o => o.type === 'ai').length, percentage: 40 }
  ]
  
  const usageByTimeOfDay = generateHourlyUsageData(sessions)
  const usageByDayOfWeek = generateDailyUsageData(sessions)
  
  const featureAdoption = {
    stockSearch: 85,
    aiGeneration: 70,
    orderManagement: 90,
    analytics: 45
  }
  
  const userEngagement = {
    dailyActive: Math.floor(totalSessions * 0.3),
    weeklyActive: Math.floor(totalSessions * 0.7),
    monthlyActive: totalSessions,
    retentionRate: 85
  }
  
  return {
    totalSessions,
    averageSessionDuration,
    mostUsedFeatures,
    usageByTimeOfDay,
    usageByDayOfWeek,
    featureAdoption,
    userEngagement
  }
}

function calculateTrendAnalytics(orders: any[], timeRange: string): TrendAnalytics {
  const orderTrends = {
    daily: generateDailyTrends(orders),
    weekly: generateWeeklyTrends(orders),
    monthly: generateMonthlyTrends(orders)
  }
  
  const spendingTrends = {
    daily: generateDailySpendingTrends(orders),
    weekly: generateWeeklySpendingTrends(orders),
    monthly: generateMonthlySpendingTrends(orders)
  }
  
  const growthMetrics = {
    orderGrowth: Math.random() * 30 - 10, // -10% to +20%
    spendingGrowth: Math.random() * 25 - 5, // -5% to +20%
    userGrowth: Math.random() * 40, // 0% to +40%
    revenueGrowth: Math.random() * 35 - 5 // -5% to +30%
  }
  
  const seasonalPatterns = {
    peakHours: [9, 10, 11, 14, 15, 16],
    peakDays: ['Tuesday', 'Wednesday', 'Thursday'],
    seasonalTrends: [
      { season: 'Spring', factor: 1.1, description: 'Increased creative activity' },
      { season: 'Summer', factor: 0.9, description: 'Seasonal slowdown' },
      { season: 'Fall', factor: 1.2, description: 'Back-to-school boost' },
      { season: 'Winter', factor: 1.0, description: 'Steady usage' }
    ]
  }
  
  return {
    orderTrends,
    spendingTrends,
    growthMetrics,
    seasonalPatterns
  }
}

function calculatePerformanceAnalytics(orders: any[]): PerformanceAnalytics {
  const orderPerformance = {
    averageProcessingTime: 2.5, // hours
    completionRate: 95,
    errorRate: 2,
    customerSatisfaction: 4.7
  }
  
  const systemPerformance = {
    averageResponseTime: 1.2, // seconds
    uptime: 99.9,
    errorRate: 0.1,
    throughput: 1000 // requests per hour
  }
  
  const userExperience = {
    pageLoadTime: 1.8, // seconds
    navigationEfficiency: 85,
    taskCompletionRate: 92,
    userSatisfactionScore: 4.6
  }
  
  const businessMetrics = {
    conversionRate: 15,
    churnRate: 5,
    lifetimeValue: 250,
    acquisitionCost: 45
  }
  
  return {
    orderPerformance,
    systemPerformance,
    userExperience,
    businessMetrics
  }
}

// ============================================================================
// Data Generation Helpers
// ============================================================================

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

function generateMonthlySpendingData(orders: any[], timeRange: string) {
  const months = []
  const startDate = getStartDateForRange(timeRange)
  const endDate = new Date()
  
  for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
    const month = d.toISOString().slice(0, 7)
    const monthOrders = orders.filter(order => 
      new Date(order.createdAt).toISOString().slice(0, 7) === month
    )
    months.push({
      month,
      amount: monthOrders.reduce((sum, order) => sum + (order.cost || 0), 0),
      orders: monthOrders.length
    })
  }
  
  return months
}

function generateWeeklyTrends(orders: any[]) {
  // Mock implementation
  return Array.from({ length: 12 }, (_, i) => ({
    week: `Week ${i + 1}`,
    count: Math.floor(Math.random() * 10) + 1,
    value: Math.floor(Math.random() * 500) + 100
  }))
}

function generateMonthlyTrends(orders: any[]) {
  // Mock implementation
  return Array.from({ length: 6 }, (_, i) => ({
    month: `Month ${i + 1}`,
    count: Math.floor(Math.random() * 20) + 5,
    value: Math.floor(Math.random() * 1000) + 200
  }))
}

function generateQuarterlyTrends(orders: any[]) {
  // Mock implementation
  return Array.from({ length: 4 }, (_, i) => ({
    quarter: `Q${i + 1}`,
    count: Math.floor(Math.random() * 50) + 10,
    value: Math.floor(Math.random() * 2000) + 500
  }))
}

function generateHourlyUsageData(sessions: any[]) {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    usage: Math.floor(Math.random() * 20) + 1
  }))
}

function generateDailyUsageData(sessions: any[]) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return days.map(day => ({
    day,
    usage: Math.floor(Math.random() * 30) + 5
  }))
}

function generateDailyTrends(orders: any[]) {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    count: Math.floor(Math.random() * 5) + 1,
    value: Math.floor(Math.random() * 200) + 50
  }))
}

function generateDailySpendingTrends(orders: any[]) {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    amount: Math.floor(Math.random() * 100) + 10
  }))
}

function generateWeeklySpendingTrends(orders: any[]) {
  return Array.from({ length: 12 }, (_, i) => ({
    week: `Week ${i + 1}`,
    amount: Math.floor(Math.random() * 500) + 100
  }))
}

function generateMonthlySpendingTrends(orders: any[]) {
  return Array.from({ length: 6 }, (_, i) => ({
    month: `Month ${i + 1}`,
    amount: Math.floor(Math.random() * 1000) + 200
  }))
}

async function generateAnalyticsReport(timeRange: string, includeCharts: boolean) {
  // Mock implementation - replace with actual report generation
  return {
    timeRange,
    generatedAt: new Date().toISOString(),
    includeCharts,
    data: {
      overview: {},
      spending: {},
      usage: {},
      trends: {},
      performance: {}
    }
  }
}

function downloadAnalyticsReport(analytics: any, format: string) {
  // Mock implementation - replace with actual download logic
  const blob = new Blob([JSON.stringify(analytics, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.${format}`
  a.click()
  URL.revokeObjectURL(url)
}

