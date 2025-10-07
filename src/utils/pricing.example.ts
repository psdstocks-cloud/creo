/**
 * Simple usage examples for the tiered pricing utility
 * 
 * This file shows how to use the pricing utility in real-world scenarios
 */

import {
  calculateTieredPricing,
  formatPricingResult,
  formatTierBreakdown,
  getPricingTier,
  comparePricing
} from './pricing';

/**
 * Example 1: Basic pricing calculation
 */
export function basicPricingExample(): void {
  console.log('📝 Example 1: Basic Pricing Calculation');
  console.log('─'.repeat(50));
  
  // Calculate pricing for 150 points
  const points = 150;
  const result = calculateTieredPricing(points);
  
  console.log(`For ${points} points:`);
  console.log(`Total cost: $${result.totalCost.toFixed(2)}`);
  console.log(`Average cost per point: $${result.averageCostPerPoint.toFixed(3)}`);
  console.log(`You save: $${result.totalSavings.toFixed(2)} (${result.savingsPercentage.toFixed(1)}%)`);
  console.log();
}

/**
 * Example 2: Detailed tier breakdown
 */
export function detailedBreakdownExample(): void {
  console.log('📝 Example 2: Detailed Tier Breakdown');
  console.log('─'.repeat(50));
  
  const points = 250;
  const result = calculateTieredPricing(points);
  
  console.log(formatTierBreakdown(result));
  console.log();
}

/**
 * Example 3: Comparing different quantities
 */
export function comparisonExample(): void {
  console.log('📝 Example 3: Comparing Different Quantities');
  console.log('─'.repeat(50));
  
  const quantities = [10, 50, 100, 200, 500];
  const results = comparePricing(quantities);
  
  console.log('Quantity | Total Cost | Avg/Point | Savings %');
  console.log('─'.repeat(45));
  
  results.forEach(result => {
    console.log(
      `${result.totalPoints.toString().padStart(8)} | ` +
      `$${result.totalCost.toFixed(2).padStart(9)} | ` +
      `$${result.averageCostPerPoint.toFixed(3).padStart(8)} | ` +
      `${result.savingsPercentage.toFixed(1)}%`
    );
  });
  console.log();
}

/**
 * Example 4: Finding the best tier for a quantity
 */
export function bestTierExample(): void {
  console.log('📝 Example 4: Finding the Best Tier');
  console.log('─'.repeat(50));
  
  const points = 75;
  const tier = getPricingTier(points);
  
  console.log(`For ${points} points:`);
  console.log(`Best tier: ${tier.description}`);
  console.log(`Rate: $${tier.ratePerPoint} per point`);
  console.log(`Range: ${tier.minPoints}-${tier.maxPoints} points`);
  console.log();
}

/**
 * Example 5: Formatted output
 */
export function formattedOutputExample(): void {
  console.log('📝 Example 5: Formatted Output');
  console.log('─'.repeat(50));
  
  const points = 300;
  const result = calculateTieredPricing(points);
  
  console.log('Standard format:');
  console.log(formatPricingResult(result));
  console.log();
  
  console.log('With Euro currency:');
  console.log(formatPricingResult(result, '€'));
  console.log();
  
  console.log('Detailed breakdown:');
  console.log(formatTierBreakdown(result));
  console.log();
}

/**
 * Example 6: Error handling
 */
export function errorHandlingExample(): void {
  console.log('📝 Example 6: Error Handling');
  console.log('─'.repeat(50));
  
  const invalidInputs = [0, -5, 501, 1.5];
  
  invalidInputs.forEach(points => {
    try {
      calculateTieredPricing(points);
      console.log(`❌ ${points} should have thrown an error`);
    } catch (error) {
      console.log(`✅ ${points} correctly threw error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  console.log();
}

/**
 * Example 7: Real-world pricing scenarios
 */
export function realWorldScenarios(): void {
  console.log('📝 Example 7: Real-World Pricing Scenarios');
  console.log('─'.repeat(50));
  
  const scenarios = [
    { name: 'Small Project', points: 15, description: 'Logo design project' },
    { name: 'Medium Project', points: 75, description: 'Website design project' },
    { name: 'Large Project', points: 200, description: 'Complete branding project' },
    { name: 'Enterprise', points: 450, description: 'Multi-brand campaign' }
  ];
  
  scenarios.forEach(scenario => {
    const result = calculateTieredPricing(scenario.points);
    const tier = getPricingTier(scenario.points);
    
    console.log(`${scenario.name} (${scenario.description}):`);
    console.log(`  Points: ${scenario.points}`);
    console.log(`  Tier: ${tier.description}`);
    console.log(`  Cost: $${result.totalCost.toFixed(2)}`);
    console.log(`  Rate: $${tier.ratePerPoint}/point`);
    console.log(`  Savings: ${result.savingsPercentage.toFixed(1)}%`);
    console.log();
  });
}

/**
 * Run all examples
 */
export function runAllExamples(): void {
  console.log('🚀 Tiered Pricing Utility Examples');
  console.log('═'.repeat(60));
  console.log();
  
  basicPricingExample();
  detailedBreakdownExample();
  comparisonExample();
  bestTierExample();
  formattedOutputExample();
  errorHandlingExample();
  realWorldScenarios();
  
  console.log('✅ All examples completed!');
}

// Export individual examples
const pricingExample = {
  basicPricingExample,
  detailedBreakdownExample,
  comparisonExample,
  bestTierExample,
  formattedOutputExample,
  errorHandlingExample,
  realWorldScenarios,
  runAllExamples
};

export default pricingExample;
