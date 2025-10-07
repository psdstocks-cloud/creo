import React, { useState } from 'react';
import InteractivePricingSlider from './InteractivePricingSlider';

const InteractivePricingSliderExample: React.FC = () => {
  const [points, setPoints] = useState<number>(50);
  const [cost, setCost] = useState<number>(0);

  const handlePointsChange = (newPoints: number) => {
    setPoints(newPoints);
    console.log('Points changed:', newPoints);
  };

  const handleCostChange = (newCost: number) => {
    setCost(newCost);
    console.log('Cost changed:', newCost);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Interactive Pricing Slider Demo</h2>
      <InteractivePricingSlider
        initialPoints={points}
        onPointsChange={handlePointsChange}
        onCostChange={handleCostChange}
      />
      <p className="mt-4">
        Selected Points: {points}, Estimated Cost: ${cost.toFixed(2)}
      </p>
    </div>
  );
};

export default InteractivePricingSliderExample;