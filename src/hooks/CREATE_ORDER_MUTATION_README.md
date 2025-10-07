# Create Order React Query Mutation Hook

A comprehensive React Query mutation hook for creating orders with site ID and stock ID, featuring robust error handling, validation, and optimistic updates.

## Features

- 🛡️ **Robust Error Handling**: Comprehensive error handling with retry logic
- ✅ **Input Validation**: Client-side validation before API calls
- 🔄 **Optimistic Updates**: Immediate UI updates with rollback on failure
- 📦 **Batch Operations**: Support for creating multiple orders at once
- 🎯 **TypeScript Support**: Full type safety with detailed interfaces
- ⚡ **Performance Optimized**: Smart caching and background updates
- 🔧 **Configurable**: Flexible options for different use cases

## Installation

```bash
npm install @tanstack/react-query axios
```

## Basic Usage

```typescript
import { useCreateOrder } from './hooks/useCreateOrderMutation';

function OrderComponent() {
  const createOrderMutation = useCreateOrder({
    onSuccess: (data) => {
      console.log('Order created:', data);
    },
    onError: (error) => {
      console.error('Order creation failed:', error);
    },
  });

  const handleCreateOrder = async () => {
    try {
      const result = await createOrderMutation.mutateAsync({
        siteId: 'site-123',
        stockId: 'stock-456',
        quantity: 1,
        paymentMethod: 'credit_card',
      });
      console.log('Order created successfully:', result);
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  return (
    <button
      onClick={handleCreateOrder}
      disabled={createOrderMutation.isPending}
    >
      {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
    </button>
  );
}
```

## API Reference

### `useCreateOrder`

Main hook for creating individual orders.

```typescript
const createOrderMutation = useCreateOrder(options?: CreateOrderOptions);
```

#### Parameters

**CreateOrderRequest:**
- `siteId: string` - Site identifier (required)
- `stockId: string` - Stock item identifier (required)
- `quantity?: number` - Quantity to order (default: 1)
- `paymentMethod?: 'credit_card' | 'paypal' | 'stripe' | 'bank_transfer' | 'crypto'` - Payment method
- `billingAddress?: BillingAddress` - Billing address information
- `shippingAddress?: ShippingAddress` - Shipping address information
- `notes?: string` - Additional notes
- `metadata?: Record<string, unknown>` - Custom metadata
- `discountCode?: string` - Discount code
- `priority?: 'low' | 'normal' | 'high' | 'urgent'` - Order priority
- `expectedDeliveryDate?: string` - Expected delivery date
- `customFields?: Record<string, string>` - Custom fields

**CreateOrderOptions:**
- `onSuccess?: (data: CreateOrderResponse) => void` - Success callback
- `onError?: (error: CreateOrderError) => void` - Error callback
- `onSettled?: (data, error) => void` - Settled callback
- `retry?: boolean | number` - Retry configuration
- `retryDelay?: number | ((attemptIndex: number) => number)` - Retry delay
- `timeout?: number` - Request timeout
- `validateBeforeSubmit?: boolean` - Enable validation

#### Returns

- `mutate: (variables: CreateOrderRequest) => void` - Trigger mutation
- `mutateAsync: (variables: CreateOrderRequest) => Promise<CreateOrderResponse>` - Async mutation
- `isPending: boolean` - Loading state
- `isSuccess: boolean` - Success state
- `isError: boolean` - Error state
- `error: CreateOrderError | null` - Error object
- `data: CreateOrderResponse | undefined` - Response data
- `reset: () => void` - Reset mutation state

### `useCreateBatchOrder`

Hook for creating multiple orders in a single request.

```typescript
const batchOrderMutation = useCreateBatchOrder(options?: CreateOrderOptions);
```

#### Usage

```typescript
const batchOrderMutation = useCreateBatchOrder();

const handleBatchOrder = async () => {
  const orders = [
    { siteId: 'site-1', stockId: 'stock-1', quantity: 1 },
    { siteId: 'site-1', stockId: 'stock-2', quantity: 2 },
    { siteId: 'site-1', stockId: 'stock-3', quantity: 1 },
  ];
  
  try {
    const results = await batchOrderMutation.mutateAsync(orders);
    console.log('Batch orders created:', results);
  } catch (error) {
    console.error('Batch order creation failed:', error);
  }
};
```

### `useCreateOrderOptimistic`

Hook with optimistic updates for immediate UI feedback.

```typescript
const optimisticOrderMutation = useCreateOrderOptimistic(options?: CreateOrderOptions);
```

#### Usage

```typescript
const optimisticOrderMutation = useCreateOrderOptimistic({
  onSuccess: (data) => {
    console.log('Order created:', data);
  },
  onError: (error) => {
    console.error('Order creation failed:', error);
    // Optimistic update will be rolled back automatically
  },
});

const handleCreateOrder = async () => {
  await optimisticOrderMutation.mutateAsync({
    siteId: 'site-123',
    stockId: 'stock-456',
    quantity: 1,
  });
};
```

## Data Types

### `CreateOrderRequest`

```typescript
interface CreateOrderRequest {
  siteId: string;
  stockId: string;
  quantity?: number;
  paymentMethod?: 'credit_card' | 'paypal' | 'stripe' | 'bank_transfer' | 'crypto';
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone?: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone?: string;
  };
  notes?: string;
  metadata?: Record<string, unknown>;
  discountCode?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  expectedDeliveryDate?: string;
  customFields?: Record<string, string>;
}
```

### `CreateOrderResponse`

```typescript
interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  taskId: string;
  status: 'pending' | 'processing' | 'ready' | 'error' | 'cancelled';
  totalAmount: number;
  currency: string;
  paymentUrl?: string;
  requiresPayment: boolean;
  estimatedProcessingTime?: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    stockId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    currency: string;
  }>;
  billing: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
  };
  tracking?: {
    trackingNumber: string;
    carrier: string;
    estimatedDelivery: string;
  };
}
```

### `CreateOrderError`

```typescript
interface CreateOrderError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  field?: string;
  statusCode?: number;
  retryable?: boolean;
}
```

## Error Handling

### Error Codes

- `VALIDATION_ERROR` - Client-side validation failed
- `NETWORK_ERROR` - Network connectivity issues
- `HTTP_400` - Bad request (invalid data)
- `HTTP_401` - Authentication required
- `HTTP_403` - Access denied
- `HTTP_404` - Stock item not found
- `HTTP_409` - Order conflict
- `HTTP_422` - Invalid data format
- `HTTP_429` - Rate limit exceeded
- `HTTP_500` - Server error
- `UNKNOWN_ERROR` - Unexpected error

### Error Handling Example

```typescript
const createOrderMutation = useCreateOrder({
  onError: (error) => {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        showToast('Please check your input', 'error');
        break;
      case 'NETWORK_ERROR':
        showToast('Network error. Please check your connection.', 'error');
        break;
      case 'HTTP_404':
        showToast('Stock item not found.', 'error');
        break;
      case 'HTTP_429':
        showToast('Too many requests. Please wait.', 'warning');
        break;
      default:
        showToast('Order creation failed. Please try again.', 'error');
    }
  },
});
```

## Advanced Usage

### Custom Validation

```typescript
const createOrderMutation = useCreateOrder({
  onMutate: async (variables) => {
    // Custom validation before mutation
    if (variables.quantity > 100) {
      throw new Error('Quantity cannot exceed 100');
    }
  },
});
```

### Retry Configuration

```typescript
const createOrderMutation = useCreateOrder({
  retry: (failureCount, error) => {
    // Don't retry on client errors
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      return false;
    }
    // Retry up to 3 times for server errors
    return failureCount < 3;
  },
  retryDelay: (attemptIndex) => {
    // Exponential backoff with jitter
    const baseDelay = 1000;
    const delay = baseDelay * Math.pow(2, attemptIndex);
    const jitter = Math.random() * 1000;
    return Math.min(delay + jitter, 30000);
  },
});
```

### Optimistic Updates

```typescript
const optimisticOrderMutation = useCreateOrderOptimistic({
  onMutate: async (newOrder) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['orders'] });
    
    // Snapshot previous value
    const previousOrders = queryClient.getQueryData(['orders']);
    
    // Optimistically update cache
    const optimisticOrder = {
      ...newOrder,
      orderId: `temp-${Date.now()}`,
      status: 'pending',
    };
    
    queryClient.setQueryData(['orders'], (old: any) => {
      return [optimisticOrder, ...(old || [])];
    });
    
    return { previousOrders };
  },
  onError: (error, variables, context) => {
    // Rollback optimistic update
    if (context?.previousOrders) {
      queryClient.setQueryData(['orders'], context.previousOrders);
    }
  },
});
```

### Batch Order Processing

```typescript
const batchOrderMutation = useCreateBatchOrder({
  onSuccess: (data) => {
    // Handle successful batch creation
    data.forEach((order, index) => {
      console.log(`Order ${index + 1} created:`, order.orderId);
    });
  },
  onError: (error) => {
    // Handle batch creation failure
    console.error('Batch order creation failed:', error);
  },
});

const handleBatchOrder = async () => {
  const orders = [
    { siteId: 'site-1', stockId: 'stock-1', quantity: 1 },
    { siteId: 'site-1', stockId: 'stock-2', quantity: 2 },
  ];
  
  try {
    const results = await batchOrderMutation.mutateAsync(orders);
    // Handle results
  } catch (error) {
    // Handle error
  }
};
```

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://api.stockmedia.com/v1
NEXT_PUBLIC_API_KEY=your_api_key_here
```

### API Client Configuration

The hook uses a configured Axios instance with:
- 30-second timeout
- Automatic retry logic
- Error handling
- Request/response interceptors
- Authentication headers

## Performance Optimizations

### Caching Strategy

- **Order Data**: 5-minute stale time, 30-minute cache time
- **Order Status**: 30-second stale time with background updates
- **Order History**: 5-minute stale time, 1-hour cache time

### Memory Management

- Automatic cleanup of unused queries
- Background garbage collection
- Optimized re-renders with React Query's built-in optimizations

## Best Practices

1. **Use optimistic updates**: Provide immediate feedback for better UX
2. **Handle errors gracefully**: Show user-friendly error messages
3. **Validate input**: Use client-side validation before API calls
4. **Implement retry logic**: Handle transient failures automatically
5. **Clean up resources**: Cancel ongoing requests when components unmount
6. **Use proper loading states**: Show appropriate UI feedback
7. **Implement error boundaries**: Catch and handle errors gracefully

## Examples

### Complete Order Form

```typescript
function OrderForm() {
  const [formData, setFormData] = useState({
    siteId: '',
    stockId: '',
    quantity: 1,
    paymentMethod: 'credit_card',
  });
  
  const createOrderMutation = useCreateOrder({
    onSuccess: (data) => {
      console.log('Order created:', data);
      // Reset form or redirect
    },
    onError: (error) => {
      console.error('Order creation failed:', error);
    },
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createOrderMutation.mutateAsync(formData);
    } catch (error) {
      // Error is handled by onError callback
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.siteId}
        onChange={(e) => setFormData(prev => ({ ...prev, siteId: e.target.value }))}
        placeholder="Site ID"
        required
      />
      <input
        value={formData.stockId}
        onChange={(e) => setFormData(prev => ({ ...prev, stockId: e.target.value }))}
        placeholder="Stock ID"
        required
      />
      <input
        type="number"
        value={formData.quantity}
        onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
        min="1"
      />
      <select
        value={formData.paymentMethod}
        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
      >
        <option value="credit_card">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="stripe">Stripe</option>
      </select>
      
      <button type="submit" disabled={createOrderMutation.isPending}>
        {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
      </button>
      
      {createOrderMutation.error && (
        <div className="error">
          {createOrderMutation.error.message}
        </div>
      )}
    </form>
  );
}
```

### Order with Optimistic Updates

```typescript
function OptimisticOrderForm() {
  const queryClient = useQueryClient();
  
  const optimisticOrderMutation = useCreateOrderOptimistic({
    onSuccess: (data) => {
      // Update the orders list with real data
      queryClient.setQueryData(['orders'], (old: any) => {
        return old.map((order: any) => 
          order.orderId.startsWith('temp-') ? data : order
        );
      });
    },
  });
  
  const handleCreateOrder = async (orderData) => {
    await optimisticOrderMutation.mutateAsync(orderData);
  };
  
  return (
    <div>
      {/* Form components */}
      <button onClick={() => handleCreateOrder(orderData)}>
        Create Order
      </button>
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **Mutation not running**: Check if required fields are provided
2. **Validation errors**: Ensure all required fields are filled
3. **Network errors**: Check internet connection and API endpoint
4. **Rate limiting**: Implement proper retry logic with backoff
5. **Authentication errors**: Verify API key configuration

### Debug Mode

Enable debug mode to see mutation states:

```typescript
const createOrderMutation = useCreateOrder({
  onMutate: (variables) => console.log('Mutation starting:', variables),
  onSuccess: (data) => console.log('Mutation successful:', data),
  onError: (error) => console.error('Mutation failed:', error),
  onSettled: (data, error) => console.log('Mutation settled:', { data, error }),
});
```

## Support

For issues or questions:

1. Check the React Query documentation
2. Review error messages in the browser console
3. Verify API configuration and endpoints
4. Check network connectivity and API limits
5. Review validation rules and required fields
