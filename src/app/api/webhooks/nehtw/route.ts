import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import webhookHandler from '../../../../lib/webhook-handler';
import { NehtwWebhookEvent } from '../../../../types/webhooks';

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    // 1. Validate request method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // 2. Get headers
    const headersList = headers();
    const eventName = headersList.get('x-neh-event_name');
    const eventStatus = headersList.get('x-neh-status');
    const extraInfo = headersList.get('x-neh-extra');
    const requestId = headersList.get('x-neh-request_id');
    const timestamp = headersList.get('x-neh-timestamp');

    // 3. Validate required headers
    if (!eventName || !eventStatus) {
      return NextResponse.json(
        { error: 'Missing required headers: x-neh-event_name, x-neh-status' },
        { status: 400 }
      );
    }

    // 4. Get request body
    const body = await request.text();

    // 5. Validate webhook signature
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!webhookHandler.validateSignature(Object.fromEntries(headersList.entries()), body)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // 6. Validate IP address
    if (!webhookHandler.validateIPAddress(clientIP)) {
      return NextResponse.json(
        { error: 'Unauthorized IP address' },
        { status: 403 }
      );
    }

    // 7. Create webhook event object
    const webhookEvent: NehtwWebhookEvent = {
      eventName,
      eventStatus,
      extraInfo: extraInfo || undefined,
      timestamp: timestamp || new Date().toISOString(),
      requestId: requestId || undefined,
    };

    // 8. Log webhook receipt
    console.log('Received nehtw webhook:', {
      eventName,
      eventStatus,
      extraInfo,
      timestamp: webhookEvent.timestamp,
      requestId: webhookEvent.requestId,
      body: body ? JSON.parse(body) : null,
    });

    // 9. Process webhook event
    const result = await webhookHandler.processEvent(webhookEvent);
    if (!result.success) {
      console.error('Webhook processing failed:', result.error);
      return NextResponse.json(
        { error: 'Webhook processing failed', details: result.error },
        { status: 500 }
      );
    }

    // 10. Return success response
    return NextResponse.json(
      { 
        received: true, 
        eventName, 
        eventStatus,
        timestamp: webhookEvent.timestamp,
        requestId: webhookEvent.requestId 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification)
export async function GET() {
  try {
    const headersList = headers();
    const eventName = headersList.get('x-neh-event_name');
    const eventStatus = headersList.get('x-neh-status');
    const extraInfo = headersList.get('x-neh-extra');

    // Log webhook verification
    console.log('Webhook verification:', { eventName, eventStatus, extraInfo });

    return NextResponse.json(
      { 
        verified: true, 
        eventName, 
        eventStatus,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Webhook verification error:', error);
    
    return NextResponse.json(
      { 
        error: 'Verification failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
