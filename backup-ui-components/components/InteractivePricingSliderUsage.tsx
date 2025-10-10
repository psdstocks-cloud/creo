'use client';

import InteractivePricingSlider from './InteractivePricingSlider';

/**
 * Simple usage example of the InteractivePricingSlider component
 * This shows the most common use cases
 */
export default function InteractivePricingSliderUsage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Pricing Calculator
      </h1>
      
      <InteractivePricingSlider
        initialPoints={100}
        onPointsChange={(points) => {
          console.log('Points selected:', points);
        }}
        onCostChange={(cost) => {
          console.log('Total cost:', cost);
        }}
      />
    </div>
  );
}
