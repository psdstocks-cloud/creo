'use client';

import PricingRollbackInfo from './PricingRollbackInfo';

export default function PricingRollbackInfoExample() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Pricing Rollback Info Component Examples
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Explore different variants and configurations of the pricing rollback info component
        </p>
      </div>

      {/* Default Variant */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Default Variant
        </h2>
        <PricingRollbackInfo />
      </div>

      {/* Compact Variant */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Compact Variant
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PricingRollbackInfo variant="compact" />
          <PricingRollbackInfo variant="compact" showIcon={false} />
        </div>
      </div>

      {/* Detailed Variant */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Detailed Variant
        </h2>
        <PricingRollbackInfo variant="detailed" />
      </div>

      {/* Without Timeline */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Without Timeline
        </h2>
        <PricingRollbackInfo showTimeline={false} />
      </div>

      {/* Without Icon */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Without Icon
        </h2>
        <PricingRollbackInfo showIcon={false} />
      </div>

      {/* Custom Styling */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Custom Styling
        </h2>
        <PricingRollbackInfo
          className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-8 rounded-3xl"
          cardClassName="border-2 border-primaryOrange/20 shadow-2xl"
        />
      </div>

      {/* Inline Usage */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Inline Usage
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Subscription Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Manage your subscription and understand how your points are handled when payments are due.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Active subscription</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Payment due in 5 days</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">150 unused points</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <PricingRollbackInfo variant="compact" />
          </div>
        </div>
      </div>

      {/* Usage Code Example */}
      <div className="glass-card p-8 rounded-2xl">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Usage Examples
        </h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Basic Usage
            </h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import PricingRollbackInfo from &apos;./PricingRollbackInfo&apos;;

function MyComponent() {
  return &lt;PricingRollbackInfo /&gt;;
}`}</code>
            </pre>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Variants
            </h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`// Default variant
<PricingRollbackInfo />

// Compact variant
<PricingRollbackInfo variant="compact" />

// Detailed variant
<PricingRollbackInfo variant="detailed" />`}</code>
            </pre>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Custom Configuration
            </h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`&lt;PricingRollbackInfo
  variant=&quot;default&quot;
  showIcon=&#123;true&#125;
  showTimeline=&#123;true&#125;
  className=&quot;custom-container&quot;
  cardClassName=&quot;custom-card&quot;
/&gt;`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Props Documentation */}
      <div className="glass-card p-8 rounded-2xl">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Props Documentation
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Prop</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Default</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">variant</td>
                <td className="py-3 px-4">&apos;default&apos; \| &apos;compact&apos; \| &apos;detailed&apos;</td>
                <td className="py-3 px-4">&apos;default&apos;</td>
                <td className="py-3 px-4">Display variant of the component</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">showIcon</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4">Show the info icon</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">showTimeline</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4">Show the timeline steps</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">className</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">&apos;&apos;</td>
                <td className="py-3 px-4">Additional CSS classes for container</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">cardClassName</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">&apos;&apos;</td>
                <td className="py-3 px-4">Additional CSS classes for card</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
