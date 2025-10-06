'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { calculateTieredPricing, getPricingTier, formatPricingResult } from '../utils/pricing';

interface InteractivePricingSliderProps {
  initialPoints?: number;
  minPoints?: number;
  maxPoints?: number;
  step?: number;
  onPointsChange?: (points: number) => void;
  onCostChange?: (cost: number) => void;
  showTierInfo?: boolean;
  showSavings?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function InteractivePricingSlider({
  initialPoints = 50,
  minPoints = 1,
  maxPoints = 500,
  step = 1,
  onPointsChange,
  onCostChange,
  showTierInfo = true,
  showSavings = true,
  className = '',
  disabled = false
}: InteractivePricingSliderProps) {
  const t = useTranslations('PricingSlider');
  const [points, setPoints] = useState(initialPoints);
  const [isRTL, setIsRTL] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Detect RTL layout
  useEffect(() => {
    const checkRTL = () => {
      setIsRTL(document.documentElement.dir === 'rtl');
    };
    
    checkRTL();
    window.addEventListener('resize', checkRTL);
    return () => window.removeEventListener('resize', checkRTL);
  }, []);

  // Calculate pricing when points change
  const calculatePricing = useCallback((newPoints: number) => {
    try {
      const calculation = calculateTieredPricing(newPoints);
      setResult(calculation);
      setError(null);
      onPointsChange?.(newPoints);
      onCostChange?.(calculation.totalCost);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  }, [onPointsChange, onCostChange]);

  // Handle points change
  const handlePointsChange = useCallback((newPoints: number) => {
    const clampedPoints = Math.max(minPoints, Math.min(maxPoints, newPoints));
    setPoints(clampedPoints);
    calculatePricing(clampedPoints);
  }, [minPoints, maxPoints, calculatePricing]);

  // Handle slider change
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPoints = parseInt(event.target.value);
    handlePointsChange(newPoints);
  };

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPoints = parseInt(event.target.value) || minPoints;
    handlePointsChange(newPoints);
  };

  // Handle input blur (ensure valid value)
  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newPoints = parseInt(event.target.value) || minPoints;
    const clampedPoints = Math.max(minPoints, Math.min(maxPoints, newPoints));
    setPoints(clampedPoints);
    calculatePricing(clampedPoints);
  };

  // Calculate initial pricing
  useEffect(() => {
    calculatePricing(initialPoints);
  }, [initialPoints, calculatePricing]);

  // Quick select presets
  const quickSelectPresets = [10, 25, 50, 100, 150, 200, 300, 500].filter(
    preset => preset >= minPoints && preset <= maxPoints
  );

  // Get tier information
  const tier = result ? getPricingTier(points) : null;

  return (
    <div className={`glass-card p-6 rounded-2xl ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t('title')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t('subtitle')}
        </p>
      </div>

      {/* Error Display */}
      {error !== null && error !== '' && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V7a1 1 0 10-2 0v4a1 1 0 002 0v-2h1a1 1 0 000-2h-1z" />
            </svg>
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Points Input and Slider Container */}
      <div className="mb-6">
        {/* Numeric Input */}
        <div className="mb-4">
          <label htmlFor="points-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('pointsLabel')}
          </label>
          <div className="relative">
            <input
              id="points-input"
              type="number"
              min={minPoints}
              max={maxPoints}
              step={step}
              value={points}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              disabled={disabled}
              className={`w-full px-4 py-3 text-lg font-semibold text-center border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:border-transparent transition-all duration-200 ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primaryOrange/50'
              }`}
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 rtl:right-auto rtl:left-0 rtl:pl-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('pointsUnit')}
              </span>
            </div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="mb-4">
          <label htmlFor="points-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('sliderLabel')}
          </label>
          <div className="relative">
            <input
              id="points-slider"
              type="range"
              min={minPoints}
              max={maxPoints}
              step={step}
              value={points}
              onChange={handleSliderChange}
              disabled={disabled}
              className={`w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                background: `linear-gradient(to ${isRTL ? 'left' : 'right'}, #F97316 0%, #F97316 ${((points - minPoints) / (maxPoints - minPoints)) * 100}%, #E5E7EB ${((points - minPoints) / (maxPoints - minPoints)) * 100}%, #E5E7EB 100%)`
              }}
            />
            {/* Slider Thumb Styling */}
            <style jsx>{`
              .slider::-webkit-slider-thumb {
                appearance: none;
                height: 24px;
                width: 24px;
                border-radius: 50%;
                background: #F97316;
                cursor: pointer;
                border: 3px solid white;
                box-shadow: 0 4px 8px rgba(249, 115, 22, 0.3);
                transition: all 0.2s ease;
              }
              .slider::-webkit-slider-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 12px rgba(249, 115, 22, 0.4);
              }
              .slider::-moz-range-thumb {
                height: 24px;
                width: 24px;
                border-radius: 50%;
                background: #F97316;
                cursor: pointer;
                border: 3px solid white;
                box-shadow: 0 4px 8px rgba(249, 115, 22, 0.3);
                transition: all 0.2s ease;
              }
              .slider::-moz-range-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 12px rgba(249, 115, 22, 0.4);
              }
            `}</style>
          </div>
          
          {/* Slider Labels */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>{minPoints}</span>
            <span className="font-medium text-primaryOrange">{points}</span>
            <span>{maxPoints}</span>
          </div>
        </div>

        {/* Quick Select Presets */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('quickSelect')}
          </p>
          <div className="flex flex-wrap gap-2">
            {quickSelectPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePointsChange(preset)}
                disabled={disabled}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                  points === preset
                    ? 'bg-primaryOrange text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Results */}
      {result && (
        <div className="space-y-4">
          {/* Main Cost Display */}
          <div className="bg-gradient-to-r from-primaryOrange/10 to-orange-600/10 p-6 rounded-xl border border-primaryOrange/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-primaryOrange mb-2">
                ${result.totalCost.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {t('totalCost')} • {result.averageCostPerPoint.toFixed(3)} {t('perPoint')}
              </div>
            </div>
          </div>

          {/* Tier Information */}
          {showTierInfo && tier && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {tier.description}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tier.minPoints}-{tier.maxPoints} {t('points')} • ${tier.ratePerPoint} {t('perPoint')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-primaryOrange">
                    ${tier.ratePerPoint}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t('perPoint')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Savings Information */}
          {showSavings && result.savingsPercentage > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-semibold text-green-800 dark:text-green-200">
                    {t('savings')}: ${result.totalSavings.toFixed(2)}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-300">
                    {result.savingsPercentage.toFixed(1)}% {t('comparedToHighestRate')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button
              disabled={disabled}
              className="flex-1 bg-gradient-to-r from-primaryOrange to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('purchaseButton')} {points} {t('points')}
            </button>
            <button
              disabled={disabled}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('saveForLater')}
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {!result && error === null && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOrange"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">{t('calculating')}</span>
        </div>
      )}
    </div>
  );
}
