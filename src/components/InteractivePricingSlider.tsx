import React, { useState, useEffect } from 'react';

export interface InteractivePricingSliderProps {
  initialPoints?: number;
  onPointsChange?: (points: number) => void;
  onCostChange?: (cost: number) => void;
}

const InteractivePricingSlider: React.FC<InteractivePricingSliderProps> = ({
  initialPoints = 1,
  onPointsChange,
  onCostChange,
}) => {
  const [points, setPoints] = useState<number>(initialPoints);
  const [price, setPrice] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tiered pricing calculation function example
  const calculatePrice = (points: number): number => {
    if (points <= 10) return points * 0.5;
    if (points <= 20) return 10 * 0.5 + (points - 10) * 0.45;
    if (points <= 89) return 10 * 0.5 + 10 * 0.45 + (points - 20) * 0.4;
    if (points <= 100) return 10 * 0.5 + 10 * 0.45 + 69 * 0.4 + (points - 89) * 0.3;
    if (points <= 200) return 10 * 0.5 + 10 * 0.45 + 69 * 0.4 + 11 * 0.3 + (points - 100) * 0.295;
    if (points <= 400) return 10 * 0.5 + 10 * 0.45 + 69 * 0.4 + 11 * 0.3 + 100 * 0.295 + (points - 200) * 0.26;
    return 10 * 0.5 + 10 * 0.45 + 69 * 0.4 + 11 * 0.3 + 100 * 0.295 + 200 * 0.26 + (points - 400) * 0.24;
  };

  useEffect(() => {
    if (points < 1 || points > 500) {
      setErrorMessage('Points must be between 1 and 500.');
      setPrice(0);
      if (onCostChange) {
        onCostChange(0);
      }
      return;
    }
    const calculatedPrice = calculatePrice(points);
    setPrice(calculatedPrice);
    setErrorMessage(null);
    if (onCostChange) {
      onCostChange(calculatedPrice);
    }
  }, [points, onCostChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = Number(e.target.value);
    setPoints(p);
    if (onPointsChange) {
      onPointsChange(p);
    }
  };

  return (
    <div className="interactive-pricing-slider bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
      <label htmlFor="points-slider" className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">
        Select Points: {points}
      </label>
      <input
        id="points-slider"
        type="range"
        min={1}
        max={500}
        value={points}
        onChange={handleSliderChange}
        className="w-full mb-4 accent-orange-500"
      />
      <div className="price-display text-xl font-bold text-orange-600 dark:text-orange-400">
        Total Price: ${price.toFixed(2)}
      </div>

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V7a1 1 0 10-2 0v4a1 1 0 002 0v-2h1a1 1 0 000-2h-1z" />
            </svg>
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractivePricingSlider;