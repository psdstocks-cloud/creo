'use client';

import { useState } from 'react';
import InteractivePricingSlider from './InteractivePricingSlider';

export default function InteractivePricingSliderExample() {
  const [selectedPoints, setSelectedPoints] = useState(50);
  const [totalCost, setTotalCost] = useState(0);

  const handlePointsChange = (points: number) => {
    setSelectedPoints(points);
    console.log('Points changed:', points);
  };

  const handleCostChange = (cost: number) => {
    setTotalCost(cost);
    console.log('Cost changed:', cost);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Interactive Pricing Slider Examples
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Explore different configurations of the interactive pricing slider component
        </p>
      </div>

      {/* Basic Example */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Basic Example
        </h2>
        <InteractivePricingSlider
          initialPoints={50}
          onPointsChange={handlePointsChange}
          onCostChange={handleCostChange}
        />
      </div>

      {/* Custom Range Example */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Custom Range (50-300 points)
        </h2>
        <InteractivePricingSlider
          initialPoints={100}
          minPoints={50}
          maxPoints={300}
          onPointsChange={handlePointsChange}
          onCostChange={handleCostChange}
        />
      </div>

      {/* Without Tier Info */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Simplified View (No Tier Info)
        </h2>
        <InteractivePricingSlider
          initialPoints={75}
          showTierInfo={false}
          onPointsChange={handlePointsChange}
          onCostChange={handleCostChange}
        />
      </div>

      {/* Without Savings Info */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Without Savings Display
        </h2>
        <InteractivePricingSlider
          initialPoints={200}
          showSavings={false}
          onPointsChange={handlePointsChange}
          onCostChange={handleCostChange}
        />
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Disabled State
        </h2>
        <InteractivePricingSlider
          initialPoints={150}
          disabled={true}
          onPointsChange={handlePointsChange}
          onCostChange={handleCostChange}
        />
      </div>

      {/* Compact Version */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Compact Version
        </h2>
        <div className="max-w-md">
          <InteractivePricingSlider
            initialPoints={25}
            showTierInfo={false}
            showSavings={false}
            onPointsChange={handlePointsChange}
            onCostChange={handleCostChange}
            className="p-4"
          />
        </div>
      </div>

      {/* Current State Display */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current State
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Selected Points:</span>
            <span className="ml-2 font-medium text-primaryOrange">{selectedPoints}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Total Cost:</span>
            <span className="ml-2 font-medium text-primaryOrange">${totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Usage Code Example */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Usage Example
        </h3>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`import InteractivePricingSlider from './InteractivePricingSlider';

function MyComponent() {
  const [points, setPoints] = useState(50);
  const [cost, setCost] = useState(0);

  return (
    <InteractivePricingSlider
      initialPoints={50}
      minPoints={1}
      maxPoints={500}
      onPointsChange={setPoints}
      onCostChange={setCost}
      showTierInfo={true}
      showSavings={true}
      disabled={false}
    />
  );
}`}</code>
        </pre>
      </div>
    </div>
  );
}
