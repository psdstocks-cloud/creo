import crypto from 'crypto';
import { 
  NehtwWebhookEvent, 
  WebhookHandler, 
  WebhookHandlerRegistry,
  WebhookValidationResult,
  WebhookProcessingResult,
  WebhookConfig,
  WebhookError,
  WebhookEventType,
  WebhookEventStatus,
  OrderWebhookEvent,
  DownloadWebhookEvent,
  AIGenerationWebhookEvent,
  UserWebhookEvent,
  SystemWebhookEvent
} from '../types/webhooks';

// Webhook handler class
export class WebhookHandler {
  private handlers: WebhookHandlerRegistry = {};
  private config: WebhookConfig;
  private retryQueue: NehtwWebhookEvent[] = [];
  private isProcessing = false;

  constructor(config: WebhookConfig = {}) {
    this.config = {
      secret: process.env.NEHTW_WEBHOOK_SECRET,
      allowedIPs: process.env.NEHTW_WEBHOOK_IPS?.split(',') || [],
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  // Register event handler
  registerHandler(eventName: string, handler: WebhookHandler): void {
    this.handlers[eventName] = handler;
    console.log(`Registered webhook handler for event: ${eventName}`);
  }

  // Unregister event handler
  unregisterHandler(eventName: string): void {
    delete this.handlers[eventName];
    console.log(`Unregistered webhook handler for event: ${eventName}`);
  }

  // Validate webhook signature
  validateSignature(headers: Record<string, string>, body: string): boolean {
    if (!this.config.secret) {
      console.warn('Webhook secret not configured, skipping signature validation');
      return true;
    }

    const signature = headers['x-neh-signature'];
    if (!signature) {
      console.error('Missing webhook signature');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.config.secret)
      .update(body)
      .digest('hex');

    const isValid = signature === expectedSignature;
    if (!isValid) {
      console.error('Invalid webhook signature');
    }

    return isValid;
  }

  // Validate IP address
  validateIPAddress(clientIP: string): boolean {
    if (!this.config.allowedIPs || this.config.allowedIPs.length === 0) {
      console.warn('No IP whitelist configured, skipping IP validation');
      return true;
    }

    const isAllowed = this.config.allowedIPs.includes(clientIP);
    if (!isAllowed) {
      console.error(`Unauthorized IP address: ${clientIP}`);
    }

    return isAllowed;
  }

  // Validate webhook event
  validateEvent(event: NehtwWebhookEvent): WebhookValidationResult {
    try {
      // Check required fields
      if (!event.eventName) {
        return {
          isValid: false,
          error: 'Missing event name',
        };
      }

      if (!event.eventStatus) {
        return {
          isValid: false,
          error: 'Missing event status',
        };
      }

      if (!event.timestamp) {
        return {
          isValid: false,
          error: 'Missing timestamp',
        };
      }

      // Validate event name format
      if (!/^[a-z]+\.[a-z_]+$/.test(event.eventName)) {
        return {
          isValid: false,
          error: 'Invalid event name format',
        };
      }

      // Validate event status
      const validStatuses: WebhookEventStatus[] = [
        'success', 'failed', 'processing', 'pending', 'cancelled', 'expired', 'refunded'
      ];
      if (!validStatuses.includes(event.eventStatus as WebhookEventStatus)) {
        return {
          isValid: false,
          error: 'Invalid event status',
        };
      }

      // Validate timestamp format
      const timestamp = new Date(event.timestamp);
      if (isNaN(timestamp.getTime())) {
        return {
          isValid: false,
          error: 'Invalid timestamp format',
        };
      }

      return {
        isValid: true,
        event,
      };

    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown validation error',
      };
    }
  }

  // Process webhook event
  async processEvent(event: NehtwWebhookEvent): Promise<WebhookProcessingResult> {
    const startTime = Date.now();
    
    try {
      // Validate event
      const validation = this.validateEvent(event);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Event validation failed');
      }

      // Get handler
      const handler = this.handlers[event.eventName];
      if (!handler) {
        console.warn(`No handler found for event: ${event.eventName}`);
        return {
          success: true,
          processedAt: new Date().toISOString(),
          eventName: event.eventName,
          eventStatus: event.eventStatus,
        };
      }

      // Process event with timeout
      await Promise.race([
        handler(event),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Handler timeout')), this.config.timeout)
        ),
      ]);

      const processingTime = Date.now() - startTime;
      console.log(`Successfully processed webhook event: ${event.eventName} in ${processingTime}ms`);

      return {
        success: true,
        processedAt: new Date().toISOString(),
        eventName: event.eventName,
        eventStatus: event.eventStatus,
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`Error processing webhook event ${event.eventName}:`, error);

      // Add to retry queue if retry attempts available
      if (this.config.retryAttempts && this.config.retryAttempts > 0) {
        this.addToRetryQueue(event);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processedAt: new Date().toISOString(),
        eventName: event.eventName,
        eventStatus: event.eventStatus,
      };
    }
  }

  // Add event to retry queue
  private addToRetryQueue(event: NehtwWebhookEvent): void {
    this.retryQueue.push(event);
    console.log(`Added event to retry queue: ${event.eventName}`);
  }

  // Process retry queue
  async processRetryQueue(): Promise<void> {
    if (this.isProcessing || this.retryQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    console.log(`Processing retry queue with ${this.retryQueue.length} events`);

    try {
      const events = [...this.retryQueue];
      this.retryQueue = [];

      for (const event of events) {
        try {
          await this.processEvent(event);
          console.log(`Successfully retried event: ${event.eventName}`);
        } catch (error) {
          console.error(`Failed to retry event ${event.eventName}:`, error);
          // Re-add to queue if still has retry attempts
          if (event.retryAttempts === undefined) {
            event.retryAttempts = 1;
          } else {
            event.retryAttempts++;
          }

          if (event.retryAttempts < (this.config.retryAttempts || 3)) {
            this.retryQueue.push(event);
          } else {
            console.error(`Max retry attempts reached for event: ${event.eventName}`);
          }
        }

        // Add delay between retries
        if (this.config.retryDelay) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  // Start retry queue processor
  startRetryProcessor(): void {
    setInterval(() => {
      this.processRetryQueue();
    }, 5000); // Process every 5 seconds
  }

  // Stop retry queue processor
  stopRetryProcessor(): void {
    // Implementation would depend on how you want to handle stopping
    console.log('Retry processor stopped');
  }

  // Get handler statistics
  getStats(): {
    totalHandlers: number;
    registeredEvents: string[];
    retryQueueSize: number;
    isProcessing: boolean;
  } {
    return {
      totalHandlers: Object.keys(this.handlers).length,
      registeredEvents: Object.keys(this.handlers),
      retryQueueSize: this.retryQueue.length,
      isProcessing: this.isProcessing,
    };
  }
}

// Create webhook handler instance
export const webhookHandler = new WebhookHandler({
  secret: process.env.NEHTW_WEBHOOK_SECRET,
  allowedIPs: process.env.NEHTW_WEBHOOK_IPS?.split(',') || [],
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
});

// Register default handlers
webhookHandler.registerHandler('order.completed', async (event: NehtwWebhookEvent) => {
  console.log('Order completed:', event);
  // TODO: Update order status in database
  // TODO: Send notification to user
  // TODO: Generate download links
});

webhookHandler.registerHandler('order.failed', async (event: NehtwWebhookEvent) => {
  console.log('Order failed:', event);
  // TODO: Update order status in database
  // TODO: Send failure notification to user
  // TODO: Process refund if needed
});

webhookHandler.registerHandler('order.processing', async (event: NehtwWebhookEvent) => {
  console.log('Order processing:', event);
  // TODO: Update order status in database
  // TODO: Send progress notification to user
});

webhookHandler.registerHandler('download.ready', async (event: NehtwWebhookEvent) => {
  console.log('Download ready:', event);
  // TODO: Update download status in database
  // TODO: Send download notification to user
  // TODO: Generate download links
});

webhookHandler.registerHandler('download.expired', async (event: NehtwWebhookEvent) => {
  console.log('Download expired:', event);
  // TODO: Update download status in database
  // TODO: Send expiration notification to user
});

webhookHandler.registerHandler('ai.completed', async (event: NehtwWebhookEvent) => {
  console.log('AI generation completed:', event);
  // TODO: Update AI job status in database
  // TODO: Send completion notification to user
  // TODO: Generate download links for AI images
});

webhookHandler.registerHandler('ai.failed', async (event: NehtwWebhookEvent) => {
  console.log('AI generation failed:', event);
  // TODO: Update AI job status in database
  // TODO: Send failure notification to user
});

webhookHandler.registerHandler('user.credits_updated', async (event: NehtwWebhookEvent) => {
  console.log('User credits updated:', event);
  // TODO: Update user credits in database
  // TODO: Send credits notification to user
});

webhookHandler.registerHandler('user.subscription_updated', async (event: NehtwWebhookEvent) => {
  console.log('User subscription updated:', event);
  // TODO: Update user subscription in database
  // TODO: Send subscription notification to user
});

webhookHandler.registerHandler('system.maintenance', async (event: NehtwWebhookEvent) => {
  console.log('System maintenance:', event);
  // TODO: Send maintenance notification to users
  // TODO: Update system status
});

webhookHandler.registerHandler('system.error', async (event: NehtwWebhookEvent) => {
  console.log('System error:', event);
  // TODO: Log system error
  // TODO: Send error notification to admins
});

// Start retry processor
webhookHandler.startRetryProcessor();

// Export webhook handler instance
export default webhookHandler;
