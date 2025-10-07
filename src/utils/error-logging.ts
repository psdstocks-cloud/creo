/**
 * Error Logging and Monitoring
 * 
 * Comprehensive error tracking, performance metrics collection,
 * and user feedback collection system.
 */

import { AxiosError } from 'axios';

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface ErrorLog {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info' | 'debug';
  category: 'api' | 'ui' | 'network' | 'auth' | 'validation' | 'unknown';
  message: string;
  stack?: string;
  context: Record<string, unknown>;
  userId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
  component?: string;
  action?: string;
}

export interface PerformanceMetric {
  id: string;
  timestamp: Date;
  name: string;
  duration: number;
  category: 'api' | 'render' | 'navigation' | 'user_interaction';
  metadata: Record<string, unknown>;
  userId?: string;
  sessionId: string;
}

export interface UserFeedback {
  id: string;
  timestamp: Date;
  type: 'bug_report' | 'feature_request' | 'general_feedback' | 'rating';
  rating?: number;
  message: string;
  category?: string;
  userId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
  attachments?: string[];
}

export interface ErrorAnalytics {
  totalErrors: number;
  errorsByCategory: Record<string, number>;
  errorsByLevel: Record<string, number>;
  errorRate: number;
  topErrors: Array<{
    message: string;
    count: number;
    lastOccurred: Date;
  }>;
  errorTrend: Array<{
    date: string;
    count: number;
  }>;
}

export interface PerformanceAnalytics {
  averageResponseTime: number;
  slowestOperations: Array<{
    name: string;
    averageDuration: number;
    count: number;
  }>;
  performanceTrend: Array<{
    date: string;
    averageDuration: number;
  }>;
}

// ============================================================================
// Error Logger
// ============================================================================

export class ErrorLogger {
  private logs: ErrorLog[] = [];
  private sessionId: string;
  private maxLogs: number = 1000;

  constructor() {
    this.sessionId = this.generateSessionId();
    if (typeof window !== 'undefined') {
      this.setupGlobalErrorHandlers();
    }
  }

  /**
   * Log an error
   */
  logError(
    error: Error | AxiosError | unknown,
    context: Record<string, unknown> = {},
    category: ErrorLog['category'] = 'unknown',
    level: ErrorLog['level'] = 'error'
  ): string {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date(),
      level,
      category,
      message: this.extractErrorMessage(error),
      stack: this.extractErrorStack(error),
      context: {
        ...context,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        timestamp: Date.now()
      },
      sessionId: this.sessionId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    this.logs.push(errorLog);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Send to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(errorLog);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorLog);
    }

    return errorLog.id;
  }

  /**
   * Log API errors specifically
   */
  logApiError(
    error: AxiosError,
    endpoint: string,
    method: string,
    requestData?: unknown
  ): string {
    return this.logError(error, {
      endpoint,
      method,
      requestData,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data
    }, 'api');
  }

  /**
   * Log UI errors
   */
  logUIError(
    error: Error,
    component: string,
    action?: string
  ): string {
    return this.logError(error, {
      component,
      action
    }, 'ui');
  }

  /**
   * Log network errors
   */
  logNetworkError(
    error: Error,
    url: string,
    method: string
  ): string {
    return this.logError(error, {
      url,
      method,
      networkStatus: navigator.onLine ? 'online' : 'offline'
    }, 'network');
  }

  /**
   * Log authentication errors
   */
  logAuthError(
    error: Error,
    action: string,
    userId?: string
  ): string {
    return this.logError(error, {
      action,
      userId
    }, 'auth');
  }

  /**
   * Get all error logs
   */
  getErrorLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * Get error analytics
   */
  getErrorAnalytics(): ErrorAnalytics {
    const totalErrors = this.logs.length;
    const errorsByCategory: Record<string, number> = {};
    const errorsByLevel: Record<string, number> = {};
    const errorCounts: Record<string, { count: number; lastOccurred: Date }> = {};

    this.logs.forEach(log => {
      errorsByCategory[log.category] = (errorsByCategory[log.category] || 0) + 1;
      errorsByLevel[log.level] = (errorsByLevel[log.level] || 0) + 1;

      const key = log.message;
      if (errorCounts[key]) {
        errorCounts[key].count++;
        if (log.timestamp > errorCounts[key].lastOccurred) {
          errorCounts[key].lastOccurred = log.timestamp;
        }
      } else {
        errorCounts[key] = {
          count: 1,
          lastOccurred: log.timestamp
        };
      }
    });

    const topErrors = Object.entries(errorCounts)
      .map(([message, data]) => ({
        message,
        count: data.count,
        lastOccurred: data.lastOccurred
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Generate error trend (last 7 days)
    const errorTrend = this.generateErrorTrend();

    return {
      totalErrors,
      errorsByCategory,
      errorsByLevel,
      errorRate: totalErrors / (Date.now() - this.logs[0]?.timestamp.getTime() || 1) * 1000 * 60 * 60, // errors per hour
      topErrors,
      errorTrend
    };
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  // Private methods
  private setupGlobalErrorHandlers(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }, 'ui');
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(event.reason, {
        type: 'unhandled_promise_rejection'
      }, 'unknown');
    });
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (error instanceof AxiosError) {
      return error.message || 'Network request failed';
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Unknown error occurred';
  }

  private extractErrorStack(error: unknown): string | undefined {
    if (error instanceof Error) {
      return error.stack;
    }
    return undefined;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sendToExternalService(log: ErrorLog): void {
    // In a real application, you would send this to your error tracking service
    // like Sentry, LogRocket, Bugsnag, etc.
    console.log('Sending error to external service:', log);
  }

  private generateErrorTrend(): Array<{ date: string; count: number }> {
    const trend: Array<{ date: string; count: number }> = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = this.logs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate.toISOString().split('T')[0] === dateStr;
      }).length;
      
      trend.push({ date: dateStr, count });
    }
    
    return trend;
  }
}

// ============================================================================
// Performance Monitor
// ============================================================================

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private sessionId: string;
  private maxMetrics: number = 1000;

  constructor() {
    this.sessionId = this.generateSessionId();
    if (typeof window !== 'undefined') {
      this.setupPerformanceObservers();
    }
  }

  /**
   * Start timing a performance metric
   */
  startTiming(name: string, category: PerformanceMetric['category'] = 'user_interaction'): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      this.recordMetric({
        id: this.generateId(),
        timestamp: new Date(),
        name,
        duration: endTime - startTime,
        category,
        metadata: {},
        sessionId: this.sessionId
      });
    };
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow operations
    if (metric.duration > 1000) { // 1 second
      console.warn(`Slow operation detected: ${metric.name} took ${metric.duration.toFixed(2)}ms`);
    }
  }

  /**
   * Get performance analytics
   */
  getPerformanceAnalytics(): PerformanceAnalytics {
    if (this.metrics.length === 0) {
      return {
        averageResponseTime: 0,
        slowestOperations: [],
        performanceTrend: []
      };
    }

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const averageResponseTime = totalDuration / this.metrics.length;

    // Group by operation name
    const operationGroups: Record<string, PerformanceMetric[]> = {};
    this.metrics.forEach(metric => {
      if (!operationGroups[metric.name]) {
        operationGroups[metric.name] = [];
      }
      operationGroups[metric.name].push(metric);
    });

    const slowestOperations = Object.entries(operationGroups)
      .map(([name, metrics]) => ({
        name,
        averageDuration: metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length,
        count: metrics.length
      }))
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, 10);

    const performanceTrend = this.generatePerformanceTrend();

    return {
      averageResponseTime,
      slowestOperations,
      performanceTrend
    };
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  // Private methods
  private setupPerformanceObservers(): void {
    // Observe navigation timing
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.recordMetric({
            id: this.generateId(),
            timestamp: new Date(),
            name: 'page_load',
            duration: navigation.loadEventEnd - navigation.loadEventStart,
            category: 'navigation',
            metadata: {
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              firstPaint: navigation.loadEventEnd - navigation.fetchStart
            },
            sessionId: this.sessionId
          });
        }
      });
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generatePerformanceTrend(): Array<{ date: string; averageDuration: number }> {
    const trend: Array<{ date: string; averageDuration: number }> = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMetrics = this.metrics.filter(metric => {
        const metricDate = new Date(metric.timestamp);
        return metricDate.toISOString().split('T')[0] === dateStr;
      });
      
      const averageDuration = dayMetrics.length > 0 
        ? dayMetrics.reduce((sum, m) => sum + m.duration, 0) / dayMetrics.length
        : 0;
      
      trend.push({ date: dateStr, averageDuration });
    }
    
    return trend;
  }
}

// ============================================================================
// User Feedback Collector
// ============================================================================

export class UserFeedbackCollector {
  private feedback: UserFeedback[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Collect user feedback
   */
  collectFeedback(
    type: UserFeedback['type'],
    message: string,
    rating?: number,
    category?: string,
    attachments?: string[]
  ): string {
    const feedback: UserFeedback = {
      id: this.generateId(),
      timestamp: new Date(),
      type,
      rating,
      message,
      category,
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      attachments
    };

    this.feedback.push(feedback);

    // Send to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(feedback);
    }

    return feedback.id;
  }

  /**
   * Get all feedback
   */
  getFeedback(): UserFeedback[] {
    return [...this.feedback];
  }

  /**
   * Get feedback analytics
   */
  getFeedbackAnalytics(): {
    totalFeedback: number;
    averageRating: number;
    feedbackByType: Record<string, number>;
    recentFeedback: UserFeedback[];
  } {
    const totalFeedback = this.feedback.length;
    const ratings = this.feedback.filter(f => f.rating).map(f => f.rating!);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
      : 0;

    const feedbackByType: Record<string, number> = {};
    this.feedback.forEach(f => {
      feedbackByType[f.type] = (feedbackByType[f.type] || 0) + 1;
    });

    const recentFeedback = this.feedback
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalFeedback,
      averageRating,
      feedbackByType,
      recentFeedback
    };
  }

  // Private methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentUserId(): string | undefined {
    // In a real application, you would get this from your auth context
    return undefined;
  }

  private sendToExternalService(feedback: UserFeedback): void {
    // In a real application, you would send this to your feedback service
    console.log('Sending feedback to external service:', feedback);
  }
}

// ============================================================================
// Monitoring Dashboard
// ============================================================================

export class MonitoringDashboard {
  private errorLogger: ErrorLogger;
  private performanceMonitor: PerformanceMonitor;
  private feedbackCollector: UserFeedbackCollector;

  constructor() {
    this.errorLogger = new ErrorLogger();
    this.performanceMonitor = new PerformanceMonitor();
    this.feedbackCollector = new UserFeedbackCollector();
  }

  /**
   * Get comprehensive monitoring data
   */
  getMonitoringData(): {
    errors: ErrorAnalytics;
    performance: PerformanceAnalytics;
    feedback: ReturnType<UserFeedbackCollector['getFeedbackAnalytics']>;
    summary: {
      totalErrors: number;
      averageResponseTime: number;
      totalFeedback: number;
      systemHealth: 'healthy' | 'warning' | 'critical';
    };
  } {
    const errors = this.errorLogger.getErrorAnalytics();
    const performance = this.performanceMonitor.getPerformanceAnalytics();
    const feedback = this.feedbackCollector.getFeedbackAnalytics();

    // Determine system health
    let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (errors.errorRate > 10 || performance.averageResponseTime > 5000) {
      systemHealth = 'critical';
    } else if (errors.errorRate > 5 || performance.averageResponseTime > 2000) {
      systemHealth = 'warning';
    }

    return {
      errors,
      performance,
      feedback,
      summary: {
        totalErrors: errors.totalErrors,
        averageResponseTime: performance.averageResponseTime,
        totalFeedback: feedback.totalFeedback,
        systemHealth
      }
    };
  }

  /**
   * Get error logger instance
   */
  getErrorLogger(): ErrorLogger {
    return this.errorLogger;
  }

  /**
   * Get performance monitor instance
   */
  getPerformanceMonitor(): PerformanceMonitor {
    return this.performanceMonitor;
  }

  /**
   * Get feedback collector instance
   */
  getFeedbackCollector(): UserFeedbackCollector {
    return this.feedbackCollector;
  }
}

// ============================================================================
// Export utilities
// ============================================================================

export const createErrorLogger = () => new ErrorLogger();
export const createPerformanceMonitor = () => new PerformanceMonitor();
export const createFeedbackCollector = () => new UserFeedbackCollector();
export const createMonitoringDashboard = () => new MonitoringDashboard();

// Global instances for easy access
export const globalErrorLogger = new ErrorLogger();
export const globalPerformanceMonitor = new PerformanceMonitor();
export const globalFeedbackCollector = new UserFeedbackCollector();
export const globalMonitoringDashboard = new MonitoringDashboard();
