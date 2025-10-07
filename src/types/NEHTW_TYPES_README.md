# Nehtw API TypeScript Interfaces

Comprehensive TypeScript interfaces for all nehtw API responses, requests, and data structures.

## 📁 File Structure

```
src/types/nehtw.ts - Main type definitions
src/lib/nehtw-client.ts - Updated to use these types
```

## 🎯 Core Interfaces

### Base Response Types
- `NehtwBaseResponse<T>` - Standard API response wrapper
- `NehtwErrorResponse` - Error response structure
- `NehtwAPIError` - API error details

### Stock Media Interfaces
- `StockInfo` - Complete stock media information
- `StockSearchParams` - Search parameters
- `StockSearchResponse` - Search results with facets

### Order Management
- `OrderRequest` - Order creation parameters
- `OrderResponse` - Order details and status
- `OrderStatus` - Order status tracking

### Download Management
- `DownloadLink` - Download link with metadata
- `DownloadRequest` - Download request parameters

### AI Generation
- `AIGenerationRequest` - AI generation parameters
- `AIGenerationJob` - AI job status and progress
- `AIGenerationResult` - Generated images and metadata
- `AIGeneratedImage` - Individual generated image

### Account & User
- `AccountBalance` - User credits and balance
- `UserProfile` - User profile information

### Stock Sites
- `StockSite` - Supported stock site information
- `StockSitesResponse` - Available stock sites

## 🔧 Usage Examples

### Basic Search
```typescript
import { StockSearchParams, StockSearchResponse } from '@/types/nehtw';

const searchParams: StockSearchParams = {
  query: 'business meeting',
  type: 'image',
  limit: 20,
  sort: 'relevance'
};

const results: StockSearchResponse = await nehtwClient.search(searchParams);
```

### Order Creation
```typescript
import { OrderRequest, OrderResponse } from '@/types/nehtw';

const orderData: OrderRequest = {
  site_id: 'shutterstock',
  stock_id: '12345',
  metadata: {
    project_name: 'Marketing Campaign',
    client_name: 'Acme Corp'
  }
};

const order: OrderResponse = await nehtwClient.createOrder(orderData);
```

### AI Generation
```typescript
import { AIGenerationRequest, AIGenerationJob } from '@/types/nehtw';

const aiRequest: AIGenerationRequest = {
  prompt: 'sunset over mountains',
  style: 'photorealistic',
  size: '1024x1024',
  count: 1,
  quality: 'high'
};

const job: AIGenerationJob = await nehtwClient.generateAI(aiRequest);
```

### Account Balance
```typescript
import { AccountBalance } from '@/types/nehtw';

const balance: AccountBalance = await nehtwClient.getCredits();
console.log(`Balance: ${balance.balance} ${balance.currency}`);
console.log(`Credits: ${balance.credits}`);
```

## 🎨 Type Features

### Union Types
```typescript
type OrderStatusType = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
type StockType = 'image' | 'video' | 'audio' | 'vector' | 'document';
type LicenseType = 'royalty_free' | 'rights_managed' | 'editorial' | 'creative_commons';
```

### Optional Fields
All interfaces use proper optional fields with `?` for fields that may not be present:
```typescript
interface StockInfo {
  id: string;           // Required
  title: string;        // Required
  description?: string; // Optional
  preview_url?: string; // Optional
}
```

### Nested Objects
Complex nested structures for comprehensive data:
```typescript
interface StockInfo {
  pricing: {
    credits: number;
    currency: string;
    price: number;
    discount?: number;
  };
  metadata: {
    color_palette?: string[];
    dominant_colors?: string[];
    orientation?: 'landscape' | 'portrait' | 'square';
  };
}
```

## 🔍 Type Safety Features

### Strict Typing
- All fields are properly typed with specific types
- No `any` types used
- Union types for status fields
- Generic types for reusable patterns

### Error Handling
```typescript
interface NehtwAPIError {
  code: string;
  message: string;
  details?: unknown;
  status_code: number;
  timestamp: string;
  request_id?: string;
}
```

### Validation Support
```typescript
interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}
```

## 🚀 Advanced Usage

### Response Wrapper Types
```typescript
type NehtwStockInfoResponse = NehtwBaseResponse<StockInfo>;
type NehtwOrderResponse = NehtwBaseResponse<OrderResponse>;
type NehtwAIGenerationResponse = NehtwBaseResponse<AIGenerationResponse>;
```

### Utility Types
```typescript
type OrderStatusType = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
type AIGenerationStatusType = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
type DownloadStatusType = 'active' | 'expired' | 'used' | 'revoked';
```

## 📊 Interface Categories

### 1. Stock Media (StockInfo, StockSearchParams, StockSearchResponse)
- Complete stock media information
- Search parameters and filters
- Search results with facets and metadata

### 2. Order Management (OrderRequest, OrderResponse, OrderStatus)
- Order creation and tracking
- Status monitoring
- Error handling

### 3. Download Management (DownloadLink, DownloadRequest)
- Download link generation
- Security and expiration handling
- File metadata

### 4. AI Generation (AIGenerationRequest, AIGenerationJob, AIGenerationResult)
- AI generation parameters
- Job status tracking
- Generated content management

### 5. Account Management (AccountBalance, UserProfile)
- User account information
- Credits and balance tracking
- Usage statistics

### 6. Stock Sites (StockSite, StockSitesResponse)
- Supported stock sites
- Site capabilities and features
- Pricing information

## 🔧 Integration with nehtw-client

The nehtw-client.ts has been updated to use these comprehensive types:

```typescript
import {
  StockSearchParams,
  StockSearchResponse,
  OrderRequest,
  OrderResponse,
  AIGenerationRequest,
  AIGenerationJob,
  AccountBalance
} from '../types/nehtw';

// All methods now use proper typing
async search(params: StockSearchParams): Promise<StockSearchResponse>
async createOrder(orderData: OrderRequest): Promise<OrderResponse>
async generateAI(request: AIGenerationRequest): Promise<AIGenerationResponse>
```

## 🎯 Benefits

1. **Type Safety**: Full TypeScript support with strict typing
2. **IntelliSense**: Complete autocomplete and documentation
3. **Error Prevention**: Catch type errors at compile time
4. **Documentation**: Self-documenting code with clear interfaces
5. **Maintainability**: Easy to update and extend
6. **Consistency**: Standardized data structures across the app

## 📝 Best Practices

1. **Import Specific Types**: Import only what you need
2. **Use Union Types**: Leverage union types for status fields
3. **Handle Optional Fields**: Always check for optional fields
4. **Type Assertions**: Use proper type assertions when needed
5. **Error Handling**: Use typed error interfaces for proper error handling

## 🔄 Migration from Old Interfaces

The old interfaces in nehtw-client.ts have been replaced with these comprehensive types:

- `NehtwSearchParams` → `StockSearchParams`
- `NehtwSearchResponse` → `StockSearchResponse`
- `NehtwOrderRequest` → `OrderRequest`
- `NehtwOrderResponse` → `OrderResponse`
- `NehtwDownloadLink` → `DownloadLink`

All existing code will continue to work, but now with enhanced type safety and comprehensive data structures.
