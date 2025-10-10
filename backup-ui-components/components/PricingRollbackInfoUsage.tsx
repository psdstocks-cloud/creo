'use client';

import PricingRollbackInfo from './PricingRollbackInfo';

/**
 * Simple usage example of the PricingRollbackInfo component
 * This shows the most common use cases
 */
export default function PricingRollbackInfoUsage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Points Rollback Policy
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Learn about how your unused points are handled when payments are due
        </p>
      </div>

      <PricingRollbackInfo />
    </div>
  );
}
