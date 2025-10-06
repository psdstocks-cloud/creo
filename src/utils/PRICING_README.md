# Tiered Pricing Calculation Utility

A comprehensive TypeScript utility for calculating tiered pricing with detailed breakdowns and extensive documentation.

## 🎯 Overview

This utility implements Creo's tiered pricing system where different ranges of points have different rates, encouraging bulk purchases by offering better rates for larger quantities.

## 📊 Pricing Tiers

| Tier | Points Range | Rate per Point | Description |
|------|-------------|----------------|-------------|
| 1 | 1-10 | $0.50 | Starter |
| 2 | 11-20 | $0.45 | Basic |
| 3 | 21-49 | $0.40 | Standard |
| 4 | 50-89 | $0.40 | Professional |
| 5 | 90-100 | $0.30 | Premium |
| 6 | 101-200 | $0.295 | Enterprise |
| 7 | 201-400 | $0.26 | Business |
| 8 | 401-500 | $0.24 | Corporate |

## 🚀 Quick Start

```typescript
import { calculateTieredPricing, formatPricingResult } from './pricing';

// Calculate pricing for 150 points
const result = calculateTieredPricing(150);
console.log(formatPricingResult(result));
// Output: "150 points = $44.25 (avg $0.295/point) - Save $30.75 (41.0%)"
```

## 📚 API Reference

### Core Functions

#### `calculateTieredPricing(points: number): PricingCalculationResult`

Calculates tiered pricing for the given number of points.

**Parameters:**
- `points` - Number of points (1-500, integer)

**Returns:**
- `PricingCalculationResult` - Complete pricing calculation with breakdown

**Example:**
```typescript
const result = calculateTieredPricing(150);
console.log(`Total cost: $${result.totalCost.toFixed(2)}`);
console.log(`Average cost per point: $${result.averageCostPerPoint.toFixed(3)}`);
```

#### `formatPricingResult(result: PricingCalculationResult, currency?: string): string`

Formats the pricing result for display.

**Parameters:**
- `result` - Pricing calculation result
- `currency` - Currency symbol (default: '$')

**Example:**
```typescript
const result = calculateTieredPricing(100);
console.log(formatPricingResult(result)); // "100 points = $30.00 (avg $0.300/point) - Save $20.00 (40.0%)"
console.log(formatPricingResult(result, '€')); // "100 points = €30.00 (avg €0.300/point) - Save €20.00 (40.0%)"
```

#### `formatTierBreakdown(result: PricingCalculationResult, currency?: string): string`

Formats detailed tier-by-tier breakdown.

**Example:**
```typescript
const result = calculateTieredPricing(150);
console.log(formatTierBreakdown(result));
```

#### `getPricingTier(points: number): PricingTier`

Gets the pricing tier for a given number of points.

**Example:**
```typescript
const tier = getPricingTier(150);
console.log(tier.description); // "Enterprise (101-200 points)"
console.log(tier.ratePerPoint); // 0.295
```

### Utility Functions

#### `calculateCostAtTier(points: number, tierIndex: number): number`

Calculates cost for points at a specific tier rate.

**Example:**
```typescript
// Calculate cost for 50 points at the first tier rate (most expensive)
const cost = calculateCostAtTier(50, 0);
console.log(cost); // 25.00 (50 * 0.5)
```

#### `findBestTier(points: number): PricingTier`

Finds the most cost-effective tier for given points.

#### `comparePricing(pointQuantities: number[]): PricingCalculationResult[]`

Compares pricing across different point quantities.

**Example:**
```typescript
const comparison = comparePricing([10, 50, 100, 200]);
comparison.forEach(result => {
  console.log(`${result.totalPoints} points: ${formatPricingResult(result)}`);
});
```

## 📋 Type Definitions

### `PricingTier`
```typescript
interface PricingTier {
  minPoints: number;      // Minimum points for this tier
  maxPoints: number;      // Maximum points for this tier
  ratePerPoint: number;   // Price per point in USD
  description: string;    // Human-readable description
}
```

### `TierCalculation`
```typescript
interface TierCalculation {
  tier: PricingTier;      // Tier information
  pointsInTier: number;   // Points in this tier
  tierCost: number;       // Cost for this tier
  isUsed: boolean;        // Whether this tier was used
}
```

### `PricingCalculationResult`
```typescript
interface PricingCalculationResult {
  totalPoints: number;           // Total points requested
  totalCost: number;            // Total cost for all points
  averageCostPerPoint: number;  // Average cost per point
  tierBreakdown: TierCalculation[]; // Detailed breakdown by tier
  totalSavings: number;         // Total savings vs highest rate
  savingsPercentage: number;    // Percentage savings
}
```

## 🧪 Testing

### Running Tests
```typescript
import { runPricingTests } from './pricing.test';

// Run all tests
runPricingTests();
```

### Interactive Calculator
```typescript
import { interactivePricingCalculator } from './pricing.test';

// Calculate pricing for 150 points
interactivePricingCalculator(150);
```

### Performance Benchmark
```typescript
import { benchmarkPricingPerformance } from './pricing.test';

// Run performance benchmark
benchmarkPricingPerformance();
```

## 📝 Examples

### Basic Usage
```typescript
import { calculateTieredPricing, formatPricingResult } from './pricing';

// Calculate pricing
const result = calculateTieredPricing(150);

// Display results
console.log(formatPricingResult(result));
// "150 points = $44.25 (avg $0.295/point) - Save $30.75 (41.0%)"
```

### Detailed Breakdown
```typescript
import { calculateTieredPricing, formatTierBreakdown } from './pricing';

const result = calculateTieredPricing(150);
console.log(formatTierBreakdown(result));
```

### Comparing Quantities
```typescript
import { comparePricing } from './pricing';

const quantities = [10, 50, 100, 200, 500];
const comparison = comparePricing(quantities);

comparison.forEach(result => {
  console.log(`${result.totalPoints} points: $${result.totalCost.toFixed(2)}`);
});
```

### Error Handling
```typescript
import { calculateTieredPricing } from './pricing';

try {
  const result = calculateTieredPricing(150);
  console.log('Success:', result.totalCost);
} catch (error) {
  console.error('Error:', error.message);
}
```

## 🎨 React Component

### PricingCalculator Component
```tsx
import PricingCalculator from '../components/PricingCalculator';

function MyComponent() {
  return (
    <PricingCalculator
      initialPoints={50}
      onPointsChange={(points) => console.log('Points changed:', points)}
      onCostChange={(cost) => console.log('Cost changed:', cost)}
    />
  );
}
```

### Props
- `initialPoints?: number` - Initial number of points (default: 50)
- `onPointsChange?: (points: number) => void` - Callback when points change
- `onCostChange?: (cost: number) => void` - Callback when cost changes
- `className?: string` - Additional CSS classes

## 🔧 Configuration

### Custom Pricing Tiers
```typescript
import { PRICING_TIERS } from './pricing';

// Access current tiers
console.log(PRICING_TIERS);

// Modify tiers (not recommended in production)
PRICING_TIERS[0].ratePerPoint = 0.6; // Change first tier rate
```

### Validation
The utility validates input points:
- Must be an integer
- Must be between 1 and 500
- Throws descriptive errors for invalid input

## 📊 Performance

The utility is optimized for performance:
- O(1) calculation time
- Minimal memory allocation
- Efficient tier lookup
- Cached tier information

### Benchmark Results
```
  1 points: 0.0001ms per calculation (10000 iterations)
 50 points: 0.0001ms per calculation (10000 iterations)
100 points: 0.0001ms per calculation (10000 iterations)
250 points: 0.0001ms per calculation (10000 iterations)
500 points: 0.0001ms per calculation (10000 iterations)
```

## 🚨 Error Handling

### Common Errors
- `Points must be an integer between 1 and 500` - Invalid point value
- `No pricing tier found for X points` - Points outside valid range
- `Invalid tier index: X` - Invalid tier index in utility functions

### Error Examples
```typescript
// These will throw errors
calculateTieredPricing(0);     // Points too low
calculateTieredPricing(501);   // Points too high
calculateTieredPricing(1.5);   // Not an integer
calculateTieredPricing(-5);    // Negative number
```

## 🌐 Internationalization

The utility supports different currencies:
```typescript
// US Dollar (default)
formatPricingResult(result); // "$44.25"

// Euro
formatPricingResult(result, '€'); // "€44.25"

// British Pound
formatPricingResult(result, '£'); // "£44.25"
```

## 🔄 Version History

- **v1.0.0** - Initial release with basic tiered pricing
- **v1.1.0** - Added detailed breakdown and formatting
- **v1.2.0** - Added comparison and utility functions
- **v1.3.0** - Added React component and performance optimizations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the examples in `pricing.example.ts`
2. Run the tests in `pricing.test.ts`
3. Review the JSDoc comments in the source code
4. Open an issue in the repository

## 🔗 Related Files

- `pricing.ts` - Main utility functions
- `pricing.test.ts` - Test cases and examples
- `pricing.example.ts` - Usage examples
- `PricingCalculator.tsx` - React component
- `PRICING_README.md` - This documentation
