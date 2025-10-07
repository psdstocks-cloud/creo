/**
 * Nehtw API Client Usage Examples
 * 
 * This file demonstrates how to use the NehtwAPIClient for various operations
 * including search, orders, downloads, and AI generation.
 */

import { 
  nehtwClient, 
  NehtwAPIClient,
  NehtwTimeoutError,
  NehtwNetworkError,
  NehtwAuthError
} from './nehtw-client';
import { OrderRequest } from '../types/nehtw';

// Example 1: Basic Search
export async function searchStockMedia(query: string) {
  try {
    console.log(`🔍 Searching for: "${query}"`);
    
    const results = await nehtwClient.search({
      query,
      page: 1,
      limit: 20,
      type: 'image',
      sort: 'relevance'
    });

    console.log(`✅ Found ${results.total} results`);
    return results;
  } catch (error) {
    console.error('❌ Search failed:', error);
    throw error;
  }
}

// Example 2: Create Order with Error Handling
export async function createStockOrder(siteId: string, stockId: string) {
  try {
    console.log(`📦 Creating order for stock ID: ${stockId}`);
    
    const orderData: OrderRequest = {
      site_id: siteId,
      stock_id: stockId,
      user_id: 'user-123', // Optional
      metadata: {
        project: 'Creo Platform',
        source: 'web-app'
      }
    };

    const order = await nehtwClient.createOrder(orderData);
    console.log(`✅ Order created: ${order.order_id}`);
    return order;
  } catch (error) {
    if (error instanceof NehtwAuthError) {
      console.error('🔐 Authentication failed - check your API key');
    } else if (error instanceof NehtwTimeoutError) {
      console.error('⏰ Request timed out - try again later');
    } else if (error instanceof NehtwNetworkError) {
      console.error('🌐 Network error - check your connection');
    } else {
      console.error('❌ Order creation failed:', error);
    }
    throw error;
  }
}

// Example 3: Poll Order Status
export async function waitForOrderCompletion(orderId: string, maxAttempts: number = 30) {
  console.log(`⏳ Waiting for order ${orderId} to complete...`);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const order = await nehtwClient.getOrderStatus(orderId);
      
      console.log(`📊 Order status: ${order.status} (attempt ${attempt}/${maxAttempts})`);
      
      if (order.status === 'completed') {
        console.log('✅ Order completed successfully!');
        return order;
      } else if (order.status === 'failed') {
        throw new Error('Order processing failed');
      }
      
      // Wait 2 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Error checking order status (attempt ${attempt}):`, error);
      if (attempt === maxAttempts) {
        throw error;
      }
    }
  }
  
  throw new Error('Order did not complete within the expected time');
}

// Example 4: Download File
export async function downloadStockFile(orderId: string) {
  try {
    console.log(`📥 Getting download link for order: ${orderId}`);
    
    const downloadLink = await nehtwClient.getDownloadLink(orderId);
    
    if (downloadLink.status === 'active') {
      console.log(`✅ Download link ready: ${downloadLink.filename}`);
      console.log(`📏 File size: ${downloadLink.size} bytes`);
      console.log(`⏰ Expires at: ${downloadLink.expires_at}`);
      return downloadLink;
    } else {
      throw new Error(`Download link is ${downloadLink.status}`);
    }
  } catch (error) {
    console.error('❌ Failed to get download link:', error);
    throw error;
  }
}

// Example 5: AI Image Generation
export async function generateAIImage(prompt: string) {
  try {
    console.log(`🎨 Generating AI image: "${prompt}"`);
    
    const job = await nehtwClient.generateAI({
      prompt,
      style: 'photorealistic',
      size: '1024x1024',
      count: 1
    });
    
    console.log(`✅ AI generation job started: ${job.job_id}`);
    console.log(`⏱️ Estimated time: ${job.estimated_time || 'Unknown'} seconds`);
    
    return job;
  } catch (error) {
    console.error('❌ AI generation failed:', error);
    throw error;
  }
}

// Example 6: Poll AI Generation Status
export async function waitForAIGeneration(jobId: string, maxAttempts: number = 60) {
  console.log(`🎨 Waiting for AI generation ${jobId} to complete...`);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const status = await nehtwClient.getAIJobStatus(jobId);
      
      console.log(`📊 AI job status: ${status.status} (${status.progress || 0}%)`);
      
      if (status.status === 'completed' && status.result) {
        console.log('✅ AI generation completed!');
        console.log(`🖼️ Generated ${status.result.images.length} images`);
        return status;
      } else if (status.status === 'failed') {
        throw new Error(`AI generation failed: ${status.error}`);
      }
      
      // Wait 5 seconds before next check (AI generation takes longer)
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(`❌ Error checking AI job status (attempt ${attempt}):`, error);
      if (attempt === maxAttempts) {
        throw error;
      }
    }
  }
  
  throw new Error('AI generation did not complete within the expected time');
}

// Example 7: Check Credits Balance
export async function checkCredits() {
  try {
    console.log('💰 Checking credits balance...');
    
    const credits = await nehtwClient.getCredits();
    
    console.log(`✅ Credits balance: ${credits.balance} ${credits.currency}`);
    return credits;
  } catch (error) {
    console.error('❌ Failed to check credits:', error);
    throw error;
  }
}

// Example 8: Health Check
export async function checkAPIHealth() {
  try {
    console.log('🏥 Checking API health...');
    
    const health = await nehtwClient.healthCheck();
    
    console.log(`✅ API status: ${health.status}`);
    console.log(`⏰ Timestamp: ${health.timestamp}`);
    return health;
  } catch (error) {
    console.error('❌ API health check failed:', error);
    throw error;
  }
}

// Example 9: Complete Workflow - Search, Order, Download
export async function completeStockMediaWorkflow(searchQuery: string) {
  try {
    console.log('🚀 Starting complete stock media workflow...');
    
    // Step 1: Search for media
    const searchResults = await searchStockMedia(searchQuery);
    
    if (searchResults.results.length === 0) {
      throw new Error('No results found for the search query');
    }
    
    const firstResult = searchResults.results[0];
    console.log(`📋 Selected: ${firstResult.title}`);
    
    // Step 2: Create order
    const order = await createStockOrder('shutterstock', firstResult.id);
    
    // Step 3: Wait for completion
    const completedOrder = await waitForOrderCompletion(order.order_id);
    
    // Step 4: Get download link
    const downloadLink = await downloadStockFile(completedOrder.order_id);
    
    console.log('🎉 Complete workflow finished successfully!');
    return {
      searchResults,
      order: completedOrder,
      downloadLink
    };
  } catch (error) {
    console.error('❌ Workflow failed:', error);
    throw error;
  }
}

// Example 10: Custom Client Configuration
export function createCustomNehtwClient() {
  const customClient = new NehtwAPIClient(
    'https://nehtw.com/api', // base URL
    'your-api-key', // API key
    {
      maxAttempts: 5, // More retry attempts
      baseDelay: 1000, // Faster initial retry
      maxDelay: 5000, // Shorter max delay
      backoffMultiplier: 1.5 // Gentler backoff
    },
    true // Enable debug mode
  );
  
  return customClient;
}

// Example 11: Error Handling Best Practices
export async function robustAPIExample() {
  try {
    // Enable debug mode for detailed logging
    nehtwClient.setDebugMode(true);
    
    // Check API health first
    await checkAPIHealth();
    
    // Check credits before proceeding
    const credits = await checkCredits();
    if (credits.balance < 10) {
      console.warn('⚠️ Low credits balance, consider topping up');
    }
    
    // Perform search with error handling
    const results = await searchStockMedia('business meeting');
    
    if (results.results.length > 0) {
      // Process first result
      const selectedItem = results.results[0];
      console.log(`Selected item: ${selectedItem.title}`);
      
      // Create order with retry logic
      const order = await createStockOrder('shutterstock', selectedItem.id);
      
      // Wait for completion with timeout handling
      const completedOrder = await waitForOrderCompletion(order.order_id, 20); // 20 attempts max
      
      // Get download link
      const downloadLink = await downloadStockFile(completedOrder.order_id);
      
      return {
        success: true,
        downloadLink,
        order: completedOrder
      };
    } else {
      return {
        success: false,
        message: 'No results found'
      };
    }
  } catch (error) {
    // Comprehensive error handling
    if (error instanceof NehtwAuthError) {
      console.error('🔐 Authentication error - check API key');
      return { success: false, error: 'Authentication failed' };
    } else if (error instanceof NehtwTimeoutError) {
      console.error('⏰ Timeout error - request took too long');
      return { success: false, error: 'Request timeout' };
    } else if (error instanceof NehtwNetworkError) {
      console.error('🌐 Network error - check connection');
      return { success: false, error: 'Network error' };
    } else {
      console.error('❌ Unexpected error:', error);
      return { success: false, error: 'Unknown error occurred' };
    }
  }
}

// Export all examples for easy importing
export const nehtwExamples = {
  searchStockMedia,
  createStockOrder,
  waitForOrderCompletion,
  downloadStockFile,
  generateAIImage,
  waitForAIGeneration,
  checkCredits,
  checkAPIHealth,
  completeStockMediaWorkflow,
  createCustomNehtwClient,
  robustAPIExample
};
