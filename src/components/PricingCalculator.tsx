'use client';

import { useState, useEffect } from 'react';
import {
  calculateTieredPricing,
  getPricingTier,
  PricingCalculationResult
} from '../utils/pricing';

interface PricingCalculatorProps {
  className?: string;
  initialPoints?: number;
  onPointsChange?: (points: number) => void;
  onCostChange?: (cost: number) => void;
}

export default function PricingCalculator({
  className = '',
  initialPoints = 50,
  onPointsChange,
  onCostChange
}: PricingCalculatorProps) {
  const [points, setPoints] = useState(initialPoints);
  const [result, setResult] = useState<PricingCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Calculate pricing when points change
  useEffect(() => {
    try {
      const calculation = calculateTieredPricing(points);
      setResult(calculation);
      setError(null);
      onPointsChange?.(points);
      onCostChange?.(calculation.totalCost);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  }, [points, onPointsChange, onCostChange]);

  const handlePointsChange = (newPoints: number) => {
    setPoints(Math.max(1, Math.min(500, newPoints)));
  };

  const quickSelectPoints = [10, 25, 50, 100, 150, 200, 300, 500];

  if (error) {
    return (
      <div className={`glass-card p-6 rounded-xl ${className}`}>
        <div className="text-center text-red-600">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card p-6 rounded-xl ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pricing Calculator
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Calculate the cost for your points using our tiered pricing system
        </p>
      </div>

      {/* Points Input */}
      <div className="mb-6">
        <label htmlFor="points-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Number of Points (1-500)
        </label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <input
            id="points-input"
            type="number"
            min="1"
            max="500"
            value={points}
            onChange={(e) => handlePointsChange(parseInt(e.target.value) || 1)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
          />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {points} points
          </div>
        </div>
      </div>

      {/* Quick Select Buttons */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quick Select:
        </p>
        <div className="flex flex-wrap gap-2">
          {quickSelectPoints.map((quickPoints) => (
            <button
              key={quickPoints}
              onClick={() => handlePointsChange(quickPoints)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                points === quickPoints
                  ? 'bg-primaryOrange text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {quickPoints}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Main Result */}
          <div className="bg-gradient-to-r from-primaryOrange/10 to-orange-600/10 p-4 rounded-lg border border-primaryOrange/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Cost
              </h3>
              <span className="text-2xl font-bold text-primaryOrange">
                ${result.totalCost.toFixed(2)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Points:</span>
                <span className="ml-2 font-medium">{result.totalPoints}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                <span className="ml-2 font-medium">${getPricingTier(points).ratePerPoint}/point</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Avg Cost:</span>
                <span className="ml-2 font-medium">${result.averageCostPerPoint.toFixed(3)}/point</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Savings:</span>
                <span className="ml-2 font-medium text-green-600">
                  ${result.totalSavings.toFixed(2)} ({result.savingsPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Tier Information */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Current Tier: {getPricingTier(points).description}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Range: {getPricingTier(points).minPoints}-{getPricingTier(points).maxPoints} points
            </p>
          </div>

          {/* Breakdown Toggle */}
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-primaryOrange hover:text-orange-600 transition-colors"
          >
            {showBreakdown ? 'Hide' : 'Show'} Detailed Breakdown
            <svg
              className={`ml-2 h-4 w-4 transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Detailed Breakdown */}
          {showBreakdown && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Tier Breakdown
              </h4>
              <div className="space-y-2 text-sm">
                {result.tierBreakdown.map((tier, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded ${
                      tier.isUsed
                        ? 'bg-primaryOrange/10 border border-primaryOrange/20'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex-1">
                      <span className="font-medium">{tier.tier.description}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        (${tier.tier.ratePerPoint}/point)
                      </span>
                    </div>
                    <div className="text-right">
                      {tier.isUsed ? (
                        <>
                          <div className="font-medium">{tier.pointsInTier} points</div>
                          <div className="text-primaryOrange">${tier.tierCost.toFixed(2)}</div>
                        </>
                      ) : (
                        <div className="text-gray-400">Not used</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button className="flex-1 bg-gradient-to-r from-primaryOrange to-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200">
              Purchase {points} Points
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Save for Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
