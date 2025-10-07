// Webhook event types for nehtw API integration

export interface NehtwWebhookEvent {
  eventName: string;
  eventStatus: string;
  extraInfo?: string;
  timestamp: string;
  requestId?: string;
  userId?: string;
  orderId?: string;
  taskId?: string;
  jobId?: string;
  downloadId?: string;
  metadata?: Record<string, unknown>;
}

export interface NehtwWebhookHeaders {
  'x-neh-event_name': string;
  'x-neh-status': string;
  'x-neh-extra'?: string;
  'x-neh-request_id'?: string;
  'x-neh-timestamp'?: string;
  'x-neh-user_id'?: string;
  'x-neh-order_id'?: string;
  'x-neh-task_id'?: string;
  'x-neh-job_id'?: string;
  'x-neh-download_id'?: string;
  'x-neh-signature'?: string;
}

// Order-related webhook events
export interface OrderWebhookEvent extends NehtwWebhookEvent {
  orderId: string;
  userId: string;
  orderData?: {
    totalAmount: number;
    currency: string;
    items: Array<{
      mediaId: string;
      quantity: number;
      price: number;
    }>;
    paymentMethod: string;
    paymentStatus: string;
  };
}

// Download-related webhook events
export interface DownloadWebhookEvent extends NehtwWebhookEvent {
  downloadId: string;
  orderId: string;
  userId: string;
  downloadData?: {
    fileName: string;
    fileSize: number;
    downloadUrl: string;
    expiresAt: string;
    maxDownloads: number;
    currentDownloads: number;
  };
}

// AI generation webhook events
export interface AIGenerationWebhookEvent extends NehtwWebhookEvent {
  jobId: string;
  userId: string;
  generationData?: {
    prompt: string;
    model: string;
    quality: string;
    dimensions: {
      width: number;
      height: number;
    };
    result?: {
      imageUrl: string;
      thumbnailUrl: string;
      fileSize: number;
    };
  };
}

// User account webhook events
export interface UserWebhookEvent extends NehtwWebhookEvent {
  userId: string;
  userData?: {
    credits: number;
    subscription: {
      plan: string;
      status: string;
      expiresAt: string;
    };
    profile: {
      email: string;
      name: string;
    };
  };
}

// System webhook events
export interface SystemWebhookEvent extends NehtwWebhookEvent {
  systemData?: {
    maintenance: {
      startTime: string;
      endTime: string;
      message: string;
    };
    error: {
      code: string;
      message: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
    };
  };
}

// Webhook event types
export type WebhookEventType = 
  | 'order.completed'
  | 'order.failed'
  | 'order.processing'
  | 'order.cancelled'
  | 'order.refunded'
  | 'download.ready'
  | 'download.expired'
  | 'download.failed'
  | 'ai.completed'
  | 'ai.failed'
  | 'ai.processing'
  | 'user.credits_updated'
  | 'user.subscription_updated'
  | 'user.subscription_expired'
  | 'user.subscription_cancelled'
  | 'system.maintenance'
  | 'system.error'
  | 'system.recovery';

// Webhook event statuses
export type WebhookEventStatus = 
  | 'success'
  | 'failed'
  | 'processing'
  | 'pending'
  | 'cancelled'
  | 'expired'
  | 'refunded';

// Webhook handler function type
export type WebhookHandler<T extends NehtwWebhookEvent = NehtwWebhookEvent> = (
  event: T
) => Promise<void>;

// Webhook validation result
export interface WebhookValidationResult {
  isValid: boolean;
  error?: string;
  event?: NehtwWebhookEvent;
}

// Webhook processing result
export interface WebhookProcessingResult {
  success: boolean;
  error?: string;
  processedAt: string;
  eventName: string;
  eventStatus: string;
}

// Webhook configuration
export interface WebhookConfig {
  secret?: string;
  allowedIPs?: string[];
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

// Webhook event handler registry
export interface WebhookHandlerRegistry {
  [eventName: string]: WebhookHandler;
}

// Webhook middleware function type
export type WebhookMiddleware = (
  event: NehtwWebhookEvent,
  next: () => Promise<void>
) => Promise<void>;

// Webhook error types
export interface WebhookError extends Error {
  code: string;
  statusCode: number;
  eventName?: string;
  eventStatus?: string;
}

// Webhook retry configuration
export interface WebhookRetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

// Webhook logging configuration
export interface WebhookLoggingConfig {
  enabled: boolean;
  level: 'debug' | 'info' | 'warn' | 'error';
  includeBody: boolean;
  includeHeaders: boolean;
}

// Webhook security configuration
export interface WebhookSecurityConfig {
  signatureValidation: boolean;
  ipWhitelist: string[];
  rateLimiting: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number;
  };
}

// Webhook response types
export interface WebhookResponse {
  received: boolean;
  eventName: string;
  eventStatus: string;
  timestamp: string;
  requestId?: string;
  error?: string;
}

// Webhook event data extractors
export interface WebhookDataExtractors {
  extractOrderData: (event: NehtwWebhookEvent) => OrderWebhookEvent | null;
  extractDownloadData: (event: NehtwWebhookEvent) => DownloadWebhookEvent | null;
  extractAIGenerationData: (event: NehtwWebhookEvent) => AIGenerationWebhookEvent | null;
  extractUserData: (event: NehtwWebhookEvent) => UserWebhookEvent | null;
  extractSystemData: (event: NehtwWebhookEvent) => SystemWebhookEvent | null;
}

// Webhook event filters
export interface WebhookEventFilters {
  allowedEvents: WebhookEventType[];
  blockedEvents: WebhookEventType[];
  allowedStatuses: WebhookEventStatus[];
  blockedStatuses: WebhookEventStatus[];
}

// Webhook event transformer
export type WebhookEventTransformer<T extends NehtwWebhookEvent> = (
  event: NehtwWebhookEvent
) => T;

// Webhook event validator
export type WebhookEventValidator<T extends NehtwWebhookEvent> = (
  event: T
) => boolean;

// Webhook event processor
export interface WebhookEventProcessor<T extends NehtwWebhookEvent> {
  validate: WebhookEventValidator<T>;
  transform: WebhookEventTransformer<T>;
  process: WebhookHandler<T>;
}

// Webhook event queue configuration
export interface WebhookEventQueueConfig {
  enabled: boolean;
  maxSize: number;
  processingInterval: number;
  batchSize: number;
}

// Webhook event storage configuration
export interface WebhookEventStorageConfig {
  enabled: boolean;
  retentionDays: number;
  includeBody: boolean;
  includeHeaders: boolean;
}

// Webhook event notification configuration
export interface WebhookEventNotificationConfig {
  enabled: boolean;
  channels: ('email' | 'sms' | 'push' | 'webhook')[];
  templates: Record<string, string>;
  recipients: string[];
}

// Webhook event analytics configuration
export interface WebhookEventAnalyticsConfig {
  enabled: boolean;
  trackMetrics: boolean;
  trackErrors: boolean;
  trackPerformance: boolean;
}

// Webhook event monitoring configuration
export interface WebhookEventMonitoringConfig {
  enabled: boolean;
  healthCheckInterval: number;
  alertThresholds: {
    errorRate: number;
    responseTime: number;
    queueSize: number;
  };
  alertChannels: string[];
}

// Webhook event configuration
export interface WebhookEventConfig {
  validation: WebhookConfig;
  retry: WebhookRetryConfig;
  logging: WebhookLoggingConfig;
  security: WebhookSecurityConfig;
  filters: WebhookEventFilters;
  queue: WebhookEventQueueConfig;
  storage: WebhookEventStorageConfig;
  notifications: WebhookEventNotificationConfig;
  analytics: WebhookEventAnalyticsConfig;
  monitoring: WebhookEventMonitoringConfig;
}
