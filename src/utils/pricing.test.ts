/**
 * Test file for tiered pricing calculation utility
 * 
 * This file demonstrates the usage of the pricing utility functions
 * with various test cases and examples.
 */

import {
  calculateTieredPricing,
  formatPricingResult,
  formatTierBreakdown,
  getPricingTier,
  calculateCostAtTier,
  findBestTier,
  comparePricing,
  PRICING_TIERS
} from './pricing';

/**
 * Test cases for the pricing utility
 */
export function runPricingTests(): void {
  console.log('🧪 Running Tiered Pricing Tests\n');
  
  // Test case 1: Small quantity (5 points)
  console.log('📊 Test Case 1: Small Quantity (5 points)');
  console.log('─'.repeat(50));
  try {
    const result1 = calculateTieredPricing(5);
    console.log(formatPricingResult(result1));
    console.log(formatTierBreakdown(result1));
  } catch (error) {
    console.error('Error:', error);
  }
  console.log('\n');

  // Test case 2: Medium quantity (75 points)
  console.log('📊 Test Case 2: Medium Quantity (75 points)');
  console.log('─'.repeat(50));
  try {
    const result2 = calculateTieredPricing(75);
    console.log(formatPricingResult(result2));
    console.log(formatTierBreakdown(result2));
  } catch (error) {
    console.error('Error:', error);
  }
  console.log('\n');

  // Test case 3: Large quantity (250 points)
  console.log('📊 Test Case 3: Large Quantity (250 points)');
  console.log('─'.repeat(50));
  try {
    const result3 = calculateTieredPricing(250);
    console.log(formatPricingResult(result3));
    console.log(formatTierBreakdown(result3));
  } catch (error) {
    console.error('Error:', error);
  }
  console.log('\n');

  // Test case 4: Maximum quantity (500 points)
  console.log('📊 Test Case 4: Maximum Quantity (500 points)');
  console.log('─'.repeat(50));
  try {
    const result4 = calculateTieredPricing(500);
    console.log(formatPricingResult(result4));
    console.log(formatTierBreakdown(result4));
  } catch (error) {
    console.error('Error:', error);
  }
  console.log('\n');

  // Test case 5: Edge cases
  console.log('📊 Test Case 5: Edge Cases');
  console.log('─'.repeat(50));
  
  const edgeCases = [1, 10, 11, 20, 21, 49, 50, 89, 90, 100, 101, 200, 201, 400, 401, 500];
  
  edgeCases.forEach(points => {
    try {
      const result = calculateTieredPricing(points);
      const tier = getPricingTier(points);
      console.log(`${points.toString().padStart(3)} points: ${tier.description.padEnd(25)} ${formatPricingResult(result)}`);
    } catch (error) {
      console.error(`Error for ${points} points:`, error);
    }
  });
  console.log('\n');

  // Test case 6: Invalid inputs
  console.log('📊 Test Case 6: Invalid Inputs');
  console.log('─'.repeat(50));
  
  const invalidInputs = [0, -1, 501, 1.5, NaN, Infinity];
  
  invalidInputs.forEach(points => {
    try {
      calculateTieredPricing(points);
      console.log(`❌ ${points} should have thrown an error`);
    } catch (error) {
      console.log(`✅ ${points} correctly threw error: ${error.message}`);
    }
  });
  console.log('\n');

  // Test case 7: Cost comparison across tiers
  console.log('📊 Test Case 7: Cost Comparison Across Tiers');
  console.log('─'.repeat(50));
  
  const testPoints = 100;
  console.log(`Cost comparison for ${testPoints} points at different tier rates:`);
  
  PRICING_TIERS.forEach((tier, index) => {
    const cost = calculateCostAtTier(testPoints, index);
    console.log(`${tier.description.padEnd(25)} @ $${tier.ratePerPoint.toFixed(3)} = $${cost.toFixed(2)}`);
  });
  console.log('\n');

  // Test case 8: Bulk comparison
  console.log('📊 Test Case 8: Bulk Comparison');
  console.log('─'.repeat(50));
  
  const quantities = [10, 25, 50, 100, 150, 250, 400, 500];
  const comparison = comparePricing(quantities);
  
  console.log('Quantity | Tier Description        | Total Cost | Avg/Point | Savings');
  console.log('─'.repeat(70));
  
  comparison.forEach(result => {
    const tier = getPricingTier(result.totalPoints);
    console.log(
      `${result.totalPoints.toString().padStart(8)} | ` +
      `${tier.description.padEnd(23)} | ` +
      `$${result.totalCost.toFixed(2).padStart(9)} | ` +
      `$${result.averageCostPerPoint.toFixed(3).padStart(8)} | ` +
      `${result.savingsPercentage.toFixed(1)}%`
    );
  });
  console.log('\n');
}

/**
 * Interactive pricing calculator
 * 
 * @param points - Number of points to calculate pricing for
 */
export function interactivePricingCalculator(points: number): void {
  console.log(`\n💰 Interactive Pricing Calculator for ${points} points`);
  console.log('═'.repeat(60));
  
  try {
    const result = calculateTieredPricing(points);
    const tier = getPricingTier(points);
    
    console.log(`\n📋 Summary:`);
    console.log(`   Points: ${result.totalPoints}`);
    console.log(`   Tier: ${tier.description}`);
    console.log(`   Rate: $${tier.ratePerPoint} per point`);
    console.log(`   Total Cost: $${result.totalCost.toFixed(2)}`);
    console.log(`   Average Cost: $${result.averageCostPerPoint.toFixed(3)} per point`);
    console.log(`   Savings: $${result.totalSavings.toFixed(2)} (${result.savingsPercentage.toFixed(1)}%)`);
    
    console.log(`\n📊 Detailed Breakdown:`);
    console.log(formatTierBreakdown(result));
    
    console.log(`\n💡 Recommendations:`);
    if (result.savingsPercentage > 0) {
      console.log(`   • You're saving ${result.savingsPercentage.toFixed(1)}% compared to the highest rate`);
    }
    
    if (points < 50) {
      console.log(`   • Consider buying 50+ points for better rates (as low as $0.40/point)`);
    } else if (points < 100) {
      console.log(`   • Consider buying 100+ points for even better rates (as low as $0.30/point)`);
    } else if (points < 200) {
      console.log(`   • Consider buying 200+ points for maximum savings (as low as $0.26/point)`);
    } else if (points < 400) {
      console.log(`   • Consider buying 400+ points for the best rates (as low as $0.24/point)`);
    } else {
      console.log(`   • You're already getting the best possible rate!`);
    }
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

/**
 * Performance benchmark for pricing calculations
 */
export function benchmarkPricingPerformance(): void {
  console.log('\n⚡ Performance Benchmark');
  console.log('─'.repeat(50));
  
  const iterations = 10000;
  const testPoints = [1, 50, 100, 250, 500];
  
  testPoints.forEach(points => {
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      calculateTieredPricing(points);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / iterations;
    
    console.log(`${points.toString().padStart(3)} points: ${avgTime.toFixed(4)}ms per calculation (${iterations} iterations)`);
  });
}

// Export the test runner
const pricingTests = {
  runPricingTests,
  interactivePricingCalculator,
  benchmarkPricingPerformance
};

export default pricingTests;
