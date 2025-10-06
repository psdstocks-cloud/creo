/**
 * Tiered Pricing Calculation Utility
 * 
 * This utility provides comprehensive pricing calculation for Creo's tiered pricing system.
 * It calculates costs based on point tiers with different rates and provides detailed breakdowns.
 */

/**
 * Represents a pricing tier with its range and rate
 */
export interface PricingTier {
  /** The minimum number of points for this tier (inclusive) */
  minPoints: number;
  /** The maximum number of points for this tier (inclusive) */
  maxPoints: number;
  /** The price per point in this tier (in USD) */
  ratePerPoint: number;
  /** Human-readable description of the tier */
  description: string;
}

/**
 * Represents the calculation result for a specific tier
 */
export interface TierCalculation {
  /** The tier information */
  tier: PricingTier;
  /** Number of points in this tier */
  pointsInTier: number;
  /** Total cost for this tier */
  tierCost: number;
  /** Whether this tier was used in the calculation */
  isUsed: boolean;
}

/**
 * Represents the complete pricing calculation result
 */
export interface PricingCalculationResult {
  /** Total number of points requested */
  totalPoints: number;
  /** Total cost for all points */
  totalCost: number;
  /** Cost per point (average) */
  averageCostPerPoint: number;
  /** Detailed breakdown by tier */
  tierBreakdown: TierCalculation[];
  /** Total savings compared to highest tier rate */
  totalSavings: number;
  /** Percentage savings compared to highest tier rate */
  savingsPercentage: number;
}

/**
 * Creo's tiered pricing structure
 * Each tier has a different rate per point, encouraging bulk purchases
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    minPoints: 1,
    maxPoints: 10,
    ratePerPoint: 0.5,
    description: "Starter (1-10 points)"
  },
  {
    minPoints: 11,
    maxPoints: 20,
    ratePerPoint: 0.45,
    description: "Basic (11-20 points)"
  },
  {
    minPoints: 21,
    maxPoints: 49,
    ratePerPoint: 0.4,
    description: "Standard (21-49 points)"
  },
  {
    minPoints: 50,
    maxPoints: 89,
    ratePerPoint: 0.4,
    description: "Professional (50-89 points)"
  },
  {
    minPoints: 90,
    maxPoints: 100,
    ratePerPoint: 0.3,
    description: "Premium (90-100 points)"
  },
  {
    minPoints: 101,
    maxPoints: 200,
    ratePerPoint: 0.295,
    description: "Enterprise (101-200 points)"
  },
  {
    minPoints: 201,
    maxPoints: 400,
    ratePerPoint: 0.26,
    description: "Business (201-400 points)"
  },
  {
    minPoints: 401,
    maxPoints: 500,
    ratePerPoint: 0.24,
    description: "Corporate (401-500 points)"
  }
];

/**
 * Validates that the input points are within the allowed range
 * @param points - The number of points to validate
 * @throws {Error} If points are outside the valid range (1-500)
 */
function validatePoints(points: number): void {
  if (!Number.isInteger(points) || points < 1 || points > 500) {
    throw new Error('Points must be an integer between 1 and 500');
  }
}

/**
 * Finds the appropriate pricing tier for a given number of points
 * @param points - The number of points
 * @returns The pricing tier that applies to these points
 * @throws {Error} If no tier is found for the given points
 */
function findTierForPoints(points: number): PricingTier {
  const tier = PRICING_TIERS.find(t => points >= t.minPoints && points <= t.maxPoints);
  if (!tier) {
    throw new Error(`No pricing tier found for ${points} points`);
  }
  return tier;
}

/**
 * Calculates the cost for a specific tier given the total points
 * @param tier - The pricing tier
 * @param totalPoints - Total points requested
 * @returns TierCalculation object with cost breakdown
 */
function calculateTierCost(tier: PricingTier, totalPoints: number): TierCalculation {
  const pointsInTier = Math.min(totalPoints, tier.maxPoints) - Math.max(1, tier.minPoints) + 1;
  const actualPointsInTier = Math.min(pointsInTier, totalPoints - (tier.minPoints - 1));
  const tierCost = actualPointsInTier * tier.ratePerPoint;
  const isUsed = totalPoints >= tier.minPoints;

  return {
    tier,
    pointsInTier: isUsed ? actualPointsInTier : 0,
    tierCost: isUsed ? tierCost : 0,
    isUsed
  };
}

/**
 * Calculates tiered pricing for the given number of points
 * 
 * This function implements Creo's tiered pricing system where different ranges
 * of points have different rates. The pricing encourages bulk purchases by
 * offering better rates for larger quantities.
 * 
 * @param points - The number of points to calculate pricing for (1-500)
 * @returns Complete pricing calculation with breakdown by tier
 * 
 * @example
 * ```typescript
 * // Calculate pricing for 150 points
 * const result = calculateTieredPricing(150);
 * console.log(`Total cost: $${result.totalCost.toFixed(2)}`);
 * console.log(`Average cost per point: $${result.averageCostPerPoint.toFixed(3)}`);
 * 
 * // Display tier breakdown
 * result.tierBreakdown.forEach(tier => {
 *   if (tier.isUsed) {
 *     console.log(`${tier.tier.description}: ${tier.pointsInTier} points at $${tier.tier.ratePerPoint}/point = $${tier.tierCost.toFixed(2)}`);
 *   }
 * });
 * ```
 * 
 * @throws {Error} If points are outside the valid range (1-500) or not an integer
 * 
 * @since 1.0.0
 * @author Creo Development Team
 */
export function calculateTieredPricing(points: number): PricingCalculationResult {
  // Validate input
  validatePoints(points);

  // Find the appropriate tier for the total points
  const applicableTier = findTierForPoints(points);
  
  // Calculate tier breakdown
  const tierBreakdown: TierCalculation[] = PRICING_TIERS.map(tier => 
    calculateTierCost(tier, points)
  );

  // Calculate total cost using the applicable tier rate
  const totalCost = points * applicableTier.ratePerPoint;
  
  // Calculate average cost per point
  const averageCostPerPoint = totalCost / points;
  
  // Calculate savings compared to the highest tier rate (first tier)
  const highestTierRate = PRICING_TIERS[0].ratePerPoint;
  const costAtHighestRate = points * highestTierRate;
  const totalSavings = costAtHighestRate - totalCost;
  const savingsPercentage = (totalSavings / costAtHighestRate) * 100;

  return {
    totalPoints: points,
    totalCost,
    averageCostPerPoint,
    tierBreakdown,
    totalSavings,
    savingsPercentage
  };
}

/**
 * Formats the pricing calculation result for display
 * 
 * @param result - The pricing calculation result
 * @param currency - The currency symbol to use (default: '$')
 * @returns Formatted string representation of the pricing
 * 
 * @example
 * ```typescript
 * const result = calculateTieredPricing(150);
 * console.log(formatPricingResult(result));
 * // Output: "150 points = $44.25 (avg $0.295/point) - Save $30.75 (41.0%)"
 * ```
 */
export function formatPricingResult(
  result: PricingCalculationResult, 
  currency: string = '$'
): string {
  const { totalPoints, totalCost, averageCostPerPoint, totalSavings, savingsPercentage } = result;
  
  return `${totalPoints} points = ${currency}${totalCost.toFixed(2)} ` +
         `(avg ${currency}${averageCostPerPoint.toFixed(3)}/point) ` +
         `- Save ${currency}${totalSavings.toFixed(2)} (${savingsPercentage.toFixed(1)}%)`;
}

/**
 * Formats the tier breakdown for detailed display
 * 
 * @param result - The pricing calculation result
 * @param currency - The currency symbol to use (default: '$')
 * @returns Formatted string with tier-by-tier breakdown
 * 
 * @example
 * ```typescript
 * const result = calculateTieredPricing(150);
 * console.log(formatTierBreakdown(result));
 * ```
 */
export function formatTierBreakdown(
  result: PricingCalculationResult, 
  currency: string = '$'
): string {
  const lines: string[] = [];
  lines.push(`Tier Breakdown for ${result.totalPoints} points:`);
  lines.push('─'.repeat(50));
  
  result.tierBreakdown.forEach(tier => {
    if (tier.isUsed) {
      lines.push(
        `${tier.tier.description.padEnd(25)} ` +
        `${tier.pointsInTier.toString().padStart(3)} points ` +
        `@ ${currency}${tier.tier.ratePerPoint.toFixed(3)} ` +
        `= ${currency}${tier.tierCost.toFixed(2)}`
      );
    }
  });
  
  lines.push('─'.repeat(50));
  lines.push(`Total: ${result.totalPoints} points = ${currency}${result.totalCost.toFixed(2)}`);
  lines.push(`Average: ${currency}${result.averageCostPerPoint.toFixed(3)} per point`);
  lines.push(`Savings: ${currency}${result.totalSavings.toFixed(2)} (${result.savingsPercentage.toFixed(1)}%)`);
  
  return lines.join('\n');
}

/**
 * Gets the pricing tier information for a given number of points
 * 
 * @param points - The number of points
 * @returns The pricing tier that applies to these points
 * 
 * @example
 * ```typescript
 * const tier = getPricingTier(150);
 * console.log(tier.description); // "Enterprise (101-200 points)"
 * console.log(tier.ratePerPoint); // 0.295
 * ```
 */
export function getPricingTier(points: number): PricingTier {
  validatePoints(points);
  return findTierForPoints(points);
}

/**
 * Calculates the cost for a specific number of points at a specific tier rate
 * 
 * @param points - The number of points
 * @param tierIndex - The index of the tier in PRICING_TIERS array
 * @returns The cost for the points at the specified tier rate
 * 
 * @example
 * ```typescript
 * // Calculate cost for 50 points at the first tier rate (most expensive)
 * const cost = calculateCostAtTier(50, 0);
 * console.log(cost); // 25.00 (50 * 0.5)
 * ```
 */
export function calculateCostAtTier(points: number, tierIndex: number): number {
  validatePoints(points);
  
  if (tierIndex < 0 || tierIndex >= PRICING_TIERS.length) {
    throw new Error(`Invalid tier index: ${tierIndex}. Must be between 0 and ${PRICING_TIERS.length - 1}`);
  }
  
  const tier = PRICING_TIERS[tierIndex];
  return points * tier.ratePerPoint;
}

/**
 * Finds the most cost-effective tier for a given number of points
 * 
 * @param points - The number of points
 * @returns The tier that provides the best rate for the given points
 * 
 * @example
 * ```typescript
 * const bestTier = findBestTier(150);
 * console.log(bestTier.description); // "Enterprise (101-200 points)"
 * ```
 */
export function findBestTier(points: number): PricingTier {
  validatePoints(points);
  return findTierForPoints(points);
}

/**
 * Compares pricing across different point quantities
 * 
 * @param pointQuantities - Array of point quantities to compare
 * @returns Array of pricing results for each quantity
 * 
 * @example
 * ```typescript
 * const comparison = comparePricing([10, 50, 100, 200]);
 * comparison.forEach(result => {
 *   console.log(`${result.totalPoints} points: ${formatPricingResult(result)}`);
 * });
 * ```
 */
export function comparePricing(pointQuantities: number[]): PricingCalculationResult[] {
  return pointQuantities.map(points => calculateTieredPricing(points));
}
