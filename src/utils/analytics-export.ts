'use client'
import { UserAnalytics } from '@/hooks/useAnalytics'

// ============================================================================
// Analytics Export Utilities
// ============================================================================

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json'
  timeRange: 'week' | 'month' | 'quarter' | 'year'
  includeCharts?: boolean
  includeRawData?: boolean
  customTitle?: string
}

export interface ExportResult {
  success: boolean
  url?: string
  filename: string
  error?: string
}

// ============================================================================
// PDF Export
// ============================================================================

export async function exportToPDF(
  analytics: UserAnalytics,
  options: ExportOptions
): Promise<ExportResult> {
  try {
    // Mock implementation - in a real app, you would use libraries like jsPDF or Puppeteer
    const pdfContent = generatePDFContent(analytics, options)
    
    // Create a mock PDF blob
    const blob = new Blob([pdfContent], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    
    return {
      success: true,
      url,
      filename: `analytics-report-${options.timeRange}-${new Date().toISOString().split('T')[0]}.pdf`
    }
  } catch (error) {
    return {
      success: false,
      filename: '',
      error: error instanceof Error ? error.message : 'Failed to generate PDF'
    }
  }
}

function generatePDFContent(analytics: UserAnalytics, options: ExportOptions): string {
  // Mock PDF content - in a real app, this would generate actual PDF
  const title = options.customTitle || `Analytics Report - ${options.timeRange}`
  const date = new Date().toLocaleDateString()
  
  return `
    PDF Report: ${title}
    Generated: ${date}
    Time Range: ${options.timeRange}
    
    Overview:
    - Total Orders: ${analytics.overview.totalOrders}
    - Completed Orders: ${analytics.overview.completedOrders}
    - Total Spent: $${analytics.overview.totalSpent.toFixed(2)}
    - Success Rate: ${analytics.overview.successRate.toFixed(1)}%
    
    Spending Analytics:
    - Total Spent: $${analytics.spending.totalSpent.toFixed(2)}
    - Average Spending: $${analytics.spending.averageSpending.toFixed(2)}
    - Stock Media: $${analytics.spending.spendingByType.stock.toFixed(2)}
    - AI Generation: $${analytics.spending.spendingByType.ai.toFixed(2)}
    
    Usage Analytics:
    - Total Sessions: ${analytics.usage.totalSessions}
    - Average Session Duration: ${analytics.usage.averageSessionDuration.toFixed(1)} minutes
    - Daily Active Users: ${analytics.usage.userEngagement.dailyActive}
    - Retention Rate: ${analytics.usage.userEngagement.retentionRate}%
    
    Performance Analytics:
    - Average Processing Time: ${analytics.performance.orderPerformance.averageProcessingTime} hours
    - Completion Rate: ${analytics.performance.orderPerformance.completionRate}%
    - Error Rate: ${analytics.performance.orderPerformance.errorRate}%
    - Customer Satisfaction: ${analytics.performance.orderPerformance.customerSatisfaction}/5
  `
}

// ============================================================================
// CSV Export
// ============================================================================

export async function exportToCSV(
  analytics: UserAnalytics,
  options: ExportOptions
): Promise<ExportResult> {
  try {
    const csvContent = generateCSVContent(analytics, options)
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    return {
      success: true,
      url,
      filename: `analytics-report-${options.timeRange}-${new Date().toISOString().split('T')[0]}.csv`
    }
  } catch (error) {
    return {
      success: false,
      filename: '',
      error: error instanceof Error ? error.message : 'Failed to generate CSV'
    }
  }
}

function generateCSVContent(analytics: UserAnalytics, options: ExportOptions): string {
  const rows = [
    ['Metric', 'Value', 'Category'],
    ['Total Orders', analytics.overview.totalOrders.toString(), 'Overview'],
    ['Completed Orders', analytics.overview.completedOrders.toString(), 'Overview'],
    ['Total Spent', `$${analytics.overview.totalSpent.toFixed(2)}`, 'Overview'],
    ['Success Rate', `${analytics.overview.successRate.toFixed(1)}%`, 'Overview'],
    ['Total Downloads', analytics.overview.totalDownloads.toString(), 'Overview'],
    ['Active Orders', analytics.overview.activeOrders.toString(), 'Overview'],
    ['Monthly Growth', `${analytics.overview.monthlyGrowth.toFixed(1)}%`, 'Overview'],
    ['', '', ''],
    ['Spending Analytics', '', ''],
    ['Total Spent', `$${analytics.spending.totalSpent.toFixed(2)}`, 'Spending'],
    ['Average Spending', `$${analytics.spending.averageSpending.toFixed(2)}`, 'Spending'],
    ['Stock Media Spending', `$${analytics.spending.spendingByType.stock.toFixed(2)}`, 'Spending'],
    ['AI Generation Spending', `$${analytics.spending.spendingByType.ai.toFixed(2)}`, 'Spending'],
    ['', '', ''],
    ['Usage Analytics', '', ''],
    ['Total Sessions', analytics.usage.totalSessions.toString(), 'Usage'],
    ['Average Session Duration', `${analytics.usage.averageSessionDuration.toFixed(1)} minutes`, 'Usage'],
    ['Daily Active Users', analytics.usage.userEngagement.dailyActive.toString(), 'Usage'],
    ['Weekly Active Users', analytics.usage.userEngagement.weeklyActive.toString(), 'Usage'],
    ['Monthly Active Users', analytics.usage.userEngagement.monthlyActive.toString(), 'Usage'],
    ['Retention Rate', `${analytics.usage.userEngagement.retentionRate}%`, 'Usage'],
    ['', '', ''],
    ['Performance Analytics', '', ''],
    ['Average Processing Time', `${analytics.performance.orderPerformance.averageProcessingTime} hours`, 'Performance'],
    ['Completion Rate', `${analytics.performance.orderPerformance.completionRate}%`, 'Performance'],
    ['Error Rate', `${analytics.performance.orderPerformance.errorRate}%`, 'Performance'],
    ['Customer Satisfaction', `${analytics.performance.orderPerformance.customerSatisfaction}/5`, 'Performance'],
    ['Average Response Time', `${analytics.performance.systemPerformance.averageResponseTime} seconds`, 'Performance'],
    ['Uptime', `${analytics.performance.systemPerformance.uptime}%`, 'Performance'],
    ['System Error Rate', `${analytics.performance.systemPerformance.errorRate}%`, 'Performance'],
    ['Throughput', `${analytics.performance.systemPerformance.throughput} req/h`, 'Performance'],
    ['Page Load Time', `${analytics.performance.userExperience.pageLoadTime} seconds`, 'Performance'],
    ['Navigation Efficiency', `${analytics.performance.userExperience.navigationEfficiency}%`, 'Performance'],
    ['Task Completion Rate', `${analytics.performance.userExperience.taskCompletionRate}%`, 'Performance'],
    ['User Satisfaction Score', `${analytics.performance.userExperience.userSatisfactionScore}/5`, 'Performance'],
    ['', '', ''],
    ['Business Metrics', '', ''],
    ['Conversion Rate', `${analytics.performance.businessMetrics.conversionRate}%`, 'Business'],
    ['Churn Rate', `${analytics.performance.businessMetrics.churnRate}%`, 'Business'],
    ['Lifetime Value', `$${analytics.performance.businessMetrics.lifetimeValue}`, 'Business'],
    ['Acquisition Cost', `$${analytics.performance.businessMetrics.acquisitionCost}`, 'Business'],
  ]

  return rows.map(row => row.join(',')).join('\n')
}

// ============================================================================
// JSON Export
// ============================================================================

export async function exportToJSON(
  analytics: UserAnalytics,
  options: ExportOptions
): Promise<ExportResult> {
  try {
    const jsonContent = generateJSONContent(analytics, options)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    return {
      success: true,
      url,
      filename: `analytics-report-${options.timeRange}-${new Date().toISOString().split('T')[0]}.json`
    }
  } catch (error) {
    return {
      success: false,
      filename: '',
      error: error instanceof Error ? error.message : 'Failed to generate JSON'
    }
  }
}

function generateJSONContent(analytics: UserAnalytics, options: ExportOptions): string {
  const exportData = {
    metadata: {
      title: options.customTitle || `Analytics Report - ${options.timeRange}`,
      generatedAt: new Date().toISOString(),
      timeRange: options.timeRange,
      includeCharts: options.includeCharts,
      includeRawData: options.includeRawData,
    },
    analytics: {
      overview: analytics.overview,
      spending: analytics.spending,
      usage: analytics.usage,
      trends: analytics.trends,
      performance: analytics.performance,
    },
    summary: {
      keyMetrics: {
        totalOrders: analytics.overview.totalOrders,
        totalSpent: analytics.overview.totalSpent,
        successRate: analytics.overview.successRate,
        averageOrderValue: analytics.overview.averageOrderValue,
      },
      insights: generateInsights(analytics),
      recommendations: generateRecommendations(analytics),
    }
  }

  return JSON.stringify(exportData, null, 2)
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateInsights(analytics: UserAnalytics): string[] {
  const insights: string[] = []
  
  // Success rate insights
  if (analytics.overview.successRate > 90) {
    insights.push('Excellent order completion rate indicates high system reliability')
  } else if (analytics.overview.successRate < 80) {
    insights.push('Order completion rate could be improved - consider investigating failed orders')
  }
  
  // Spending insights
  if (analytics.spending.spendingByType.ai > analytics.spending.spendingByType.stock) {
    insights.push('AI generation spending exceeds stock media - users prefer AI-generated content')
  } else {
    insights.push('Stock media spending exceeds AI generation - users prefer existing content')
  }
  
  // Usage insights
  if (analytics.usage.userEngagement.retentionRate > 80) {
    insights.push('High user retention rate indicates strong product-market fit')
  } else if (analytics.usage.userEngagement.retentionRate < 60) {
    insights.push('User retention could be improved - consider user onboarding enhancements')
  }
  
  // Performance insights
  if (analytics.performance.orderPerformance.averageProcessingTime < 2) {
    insights.push('Fast order processing indicates efficient system performance')
  } else if (analytics.performance.orderPerformance.averageProcessingTime > 5) {
    insights.push('Order processing time is high - consider system optimization')
  }
  
  return insights
}

function generateRecommendations(analytics: UserAnalytics): string[] {
  const recommendations: string[] = []
  
  // Success rate recommendations
  if (analytics.overview.successRate < 85) {
    recommendations.push('Implement better error handling and user feedback for failed orders')
  }
  
  // Spending recommendations
  if (analytics.spending.totalSpent > 1000) {
    recommendations.push('Consider implementing bulk purchase discounts for high-spending users')
  }
  
  // Usage recommendations
  if (analytics.usage.userEngagement.dailyActive < 10) {
    recommendations.push('Increase user engagement through notifications and personalized content')
  }
  
  // Performance recommendations
  if (analytics.performance.orderPerformance.averageProcessingTime > 3) {
    recommendations.push('Optimize order processing pipeline to reduce wait times')
  }
  
  // Business recommendations
  if (analytics.performance.businessMetrics.churnRate > 10) {
    recommendations.push('Implement customer retention strategies to reduce churn')
  }
  
  return recommendations
}

// ============================================================================
// Main Export Function
// ============================================================================

export async function exportAnalytics(
  analytics: UserAnalytics,
  options: ExportOptions
): Promise<ExportResult> {
  switch (options.format) {
    case 'pdf':
      return exportToPDF(analytics, options)
    case 'csv':
      return exportToCSV(analytics, options)
    case 'json':
      return exportToJSON(analytics, options)
    default:
      throw new Error(`Unsupported export format: ${options.format}`)
  }
}

// ============================================================================
// Download Helper
// ============================================================================

export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ============================================================================
// Export Hook
// ============================================================================

export function useAnalyticsExport() {
  const exportAnalyticsData = async (
    analytics: UserAnalytics,
    options: ExportOptions
  ): Promise<ExportResult> => {
    const result = await exportAnalytics(analytics, options)
    
    if (result.success && result.url) {
      downloadFile(result.url, result.filename)
    }
    
    return result
  }

  return { exportAnalyticsData }
}
