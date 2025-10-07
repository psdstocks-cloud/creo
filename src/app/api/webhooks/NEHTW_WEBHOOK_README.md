# Nehtw Webhook Receiver API

A comprehensive webhook receiver implementation for the nehtw API integration, featuring robust event handling, security validation, and error recovery.

## Features

- 🔐 **Security Validation**: Signature verification and IP whitelisting
- 🔄 **Event Processing**: Comprehensive event handling with retry logic
- 📊 **Error Recovery**: Automatic retry with exponential backoff
- 🛡️ **Rate Limiting**: Built-in rate limiting and timeout handling
- 📝 **Logging**: Comprehensive logging and monitoring
- 🎯 **Type Safety**: Full TypeScript support with detailed interfaces
- ⚡ **Performance**: Efficient processing with background retry queue

## API Endpoint

```
POST /api/webhooks/nehtw
GET /api/webhooks/nehtw (for verification)
```

## Webhook Headers

The webhook receiver expects the following headers from nehtw:

- `x-neh-event_name`: The event type (e.g., 'order.completed', 'download.ready')
- `x-neh-status`: The event status (e.g., 'success', 'failed', 'processing')
- `x-neh-extra`: Additional information (optional)
- `x-neh-request_id`: Unique request identifier (optional)
- `x-neh-timestamp`: Event timestamp (optional)
- `x-neh-user_id`: User ID (optional)
- `x-neh-order_id`: Order ID (optional)
- `x-neh-task_id`: Task ID (optional)
- `x-neh-job_id`: Job ID (optional)
- `x-neh-download_id`: Download ID (optional)
- `x-neh-signature`: Webhook signature for validation (optional)

## Supported Events

### Order Events
- `order.completed` - Order has been completed successfully
- `order.failed` - Order has failed
- `order.processing` - Order is being processed
- `order.cancelled` - Order has been cancelled
- `order.refunded` - Order has been refunded

### Download Events
- `download.ready` - Download is ready for user
- `download.expired` - Download has expired
- `download.failed` - Download has failed

### AI Generation Events
- `ai.completed` - AI generation job completed
- `ai.failed` - AI generation job failed
- `ai.processing` - AI generation job is processing

### User Events
- `user.credits_updated` - User credits have been updated
- `user.subscription_updated` - User subscription has been updated
- `user.subscription_expired` - User subscription has expired
- `user.subscription_cancelled` - User subscription has been cancelled

### System Events
- `system.maintenance` - System maintenance notification
- `system.error` - System error notification
- `system.recovery` - System recovery notification

## Configuration

### Environment Variables

```env
# Webhook security
NEHTW_WEBHOOK_SECRET=your_webhook_secret_here
NEHTW_WEBHOOK_IPS=192.168.1.1,10.0.0.1

# Optional configuration
NEHTW_WEBHOOK_TIMEOUT=30000
NEHTW_WEBHOOK_RETRY_ATTEMPTS=3
NEHTW_WEBHOOK_RETRY_DELAY=1000
```

### Webhook Handler Configuration

```typescript
import webhookHandler from '../lib/webhook-handler';

// Configure webhook handler
webhookHandler.configure({
  secret: process.env.NEHTW_WEBHOOK_SECRET,
  allowedIPs: process.env.NEHTW_WEBHOOK_IPS?.split(',') || [],
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
});
```

## Usage Examples

### Basic Webhook Processing

```typescript
// The webhook receiver automatically processes events
// No additional code needed for basic functionality
```

### Custom Event Handlers

```typescript
import webhookHandler from '../lib/webhook-handler';

// Register custom event handler
webhookHandler.registerHandler('order.completed', async (event) => {
  console.log('Order completed:', event);
  
  // Update order status in database
  await updateOrderStatus(event.orderId, 'completed');
  
  // Send notification to user
  await sendNotification(event.userId, 'Order completed successfully');
  
  // Generate download links
  await generateDownloadLinks(event.orderId);
});

// Register error handler
webhookHandler.registerHandler('order.failed', async (event) => {
  console.log('Order failed:', event);
  
  // Update order status in database
  await updateOrderStatus(event.orderId, 'failed');
  
  // Send failure notification to user
  await sendNotification(event.userId, 'Order failed. Please try again.');
  
  // Process refund if needed
  if (event.extraInfo?.includes('refund')) {
    await processRefund(event.orderId);
  }
});
```

### Advanced Event Processing

```typescript
// AI generation completion handler
webhookHandler.registerHandler('ai.completed', async (event) => {
  console.log('AI generation completed:', event);
  
  // Update AI job status
  await updateAIJobStatus(event.jobId, 'completed');
  
  // Generate download links for AI images
  const downloadLinks = await generateAIDownloadLinks(event.jobId);
  
  // Send completion notification
  await sendNotification(event.userId, 'AI generation completed!');
  
  // Update user credits if applicable
  if (event.extraInfo?.includes('credits_used')) {
    await updateUserCredits(event.userId, -1);
  }
});

// Download ready handler
webhookHandler.registerHandler('download.ready', async (event) => {
  console.log('Download ready:', event);
  
  // Update download status
  await updateDownloadStatus(event.downloadId, 'ready');
  
  // Send download notification
  await sendNotification(event.userId, 'Your download is ready!');
  
  // Track download metrics
  await trackDownloadMetrics(event.downloadId, event.userId);
});
```

## Security Features

### Signature Validation

The webhook receiver validates the webhook signature to ensure authenticity:

```typescript
// Signature validation is automatic
// Configure NEHTW_WEBHOOK_SECRET in environment variables
```

### IP Whitelisting

Restrict webhook access to specific IP addresses:

```typescript
// Configure allowed IPs in environment variables
NEHTW_WEBHOOK_IPS=192.168.1.1,10.0.0.1,203.0.113.1
```

### Rate Limiting

Built-in rate limiting to prevent abuse:

```typescript
// Rate limiting is configured automatically
// Adjust limits in webhook handler configuration
```

## Error Handling

### Automatic Retry

Failed webhook events are automatically retried:

```typescript
// Retry configuration
const config = {
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 30000,
};
```

### Error Logging

Comprehensive error logging for debugging:

```typescript
// Errors are automatically logged
// Check console logs for detailed error information
```

### Dead Letter Queue

Failed events after max retries are logged for manual processing:

```typescript
// Failed events are logged with full context
// Implement dead letter queue processing as needed
```

## Monitoring and Analytics

### Webhook Statistics

Get webhook processing statistics:

```typescript
import webhookHandler from '../lib/webhook-handler';

// Get handler statistics
const stats = webhookHandler.getStats();
console.log('Webhook stats:', stats);
// {
//   totalHandlers: 10,
//   registeredEvents: ['order.completed', 'download.ready', ...],
//   retryQueueSize: 0,
//   isProcessing: false
// }
```

### Event Tracking

Track webhook events for analytics:

```typescript
// Events are automatically tracked
// Implement custom analytics as needed
```

## Testing

### Local Testing

Test webhook endpoints locally:

```bash
# Test webhook endpoint
curl -X POST http://localhost:3000/api/webhooks/nehtw \
  -H "Content-Type: application/json" \
  -H "x-neh-event_name: order.completed" \
  -H "x-neh-status: success" \
  -H "x-neh-order_id: order-123" \
  -H "x-neh-user_id: user-456" \
  -d '{"test": "data"}'
```

### Webhook Verification

Verify webhook endpoint:

```bash
# Verify webhook endpoint
curl -X GET http://localhost:3000/api/webhooks/nehtw \
  -H "x-neh-event_name: test" \
  -H "x-neh-status: success"
```

## Deployment

### Environment Setup

1. Set environment variables:
```env
NEHTW_WEBHOOK_SECRET=your_secret_here
NEHTW_WEBHOOK_IPS=allowed_ip_addresses
```

2. Deploy to your hosting platform:
```bash
# Deploy to Vercel
vercel deploy

# Deploy to Netlify
netlify deploy --prod

# Deploy to AWS
aws s3 sync . s3://your-bucket
```

### Webhook URL Configuration

Configure the webhook URL in nehtw dashboard:
```
https://yourdomain.com/api/webhooks/nehtw
```

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check if webhook URL is correctly configured
   - Verify environment variables are set
   - Check server logs for errors

2. **Signature validation failures**
   - Verify `NEHTW_WEBHOOK_SECRET` is correct
   - Check if nehtw is sending the signature header
   - Ensure signature format matches expected format

3. **IP validation failures**
   - Verify `NEHTW_WEBHOOK_IPS` includes nehtw IP addresses
   - Check if IP addresses are correctly formatted
   - Ensure no extra spaces or characters

4. **Event processing failures**
   - Check event handler implementations
   - Verify database connections
   - Check for timeout issues

### Debug Mode

Enable debug logging:

```typescript
// Set debug environment variable
DEBUG=webhook:*

// Or enable in code
process.env.DEBUG = 'webhook:*';
```

### Health Check

Check webhook endpoint health:

```bash
# Health check
curl -X GET http://localhost:3000/api/webhooks/nehtw/health
```

## Best Practices

1. **Always validate webhook signatures**
2. **Implement IP whitelisting for security**
3. **Use retry logic for failed events**
4. **Log all webhook events for debugging**
5. **Implement rate limiting to prevent abuse**
6. **Use environment variables for configuration**
7. **Test webhook endpoints thoroughly**
8. **Monitor webhook processing performance**
9. **Implement dead letter queue for failed events**
10. **Use TypeScript for type safety**

## Support

For issues or questions:

1. Check the webhook logs for error details
2. Verify environment variable configuration
3. Test webhook endpoint manually
4. Check nehtw documentation for webhook format
5. Contact support if issues persist

## Examples

### Complete Webhook Implementation

```typescript
// src/app/api/webhooks/nehtw/route.ts
import { NextRequest, NextResponse } from 'next/server';
import webhookHandler from '../../../lib/webhook-handler';

export async function POST(request: NextRequest) {
  try {
    // Validate and process webhook
    const result = await webhookHandler.processEvent(event);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Processing failed' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Custom Event Handler

```typescript
// src/lib/webhook-handlers.ts
import webhookHandler from './webhook-handler';

// Order completion handler
webhookHandler.registerHandler('order.completed', async (event) => {
  // Update order status
  await updateOrderStatus(event.orderId, 'completed');
  
  // Send notification
  await sendNotification(event.userId, 'Order completed!');
  
  // Generate download links
  await generateDownloadLinks(event.orderId);
});

// Download ready handler
webhookHandler.registerHandler('download.ready', async (event) => {
  // Update download status
  await updateDownloadStatus(event.downloadId, 'ready');
  
  // Send download notification
  await sendNotification(event.userId, 'Download ready!');
});
```

This webhook implementation provides a robust, secure, and scalable solution for handling nehtw webhook events with comprehensive error handling and monitoring capabilities.
