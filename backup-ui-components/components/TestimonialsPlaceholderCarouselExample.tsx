'use client';

import TestimonialsPlaceholderCarousel from './TestimonialsPlaceholderCarousel';

export default function TestimonialsPlaceholderCarouselExample() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Testimonials Placeholder Carousel Examples
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Explore different configurations of the testimonials carousel component
        </p>
      </div>

      {/* Basic Example */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Basic Example (Auto-play enabled)
        </h2>
        <TestimonialsPlaceholderCarousel />
      </div>

      {/* Manual Control Example */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Manual Control (Auto-play disabled)
        </h2>
        <TestimonialsPlaceholderCarousel
          autoPlay={false}
          showPauseButton={false}
        />
      </div>

      {/* Minimal Example */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Minimal Example (No arrows, no pause button)
        </h2>
        <TestimonialsPlaceholderCarousel
          showArrows={false}
          showPauseButton={false}
          showDots={true}
        />
      </div>

      {/* Limited Testimonials */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Limited Testimonials (3 cards)
        </h2>
        <TestimonialsPlaceholderCarousel
          maxCards={3}
          autoPlayInterval={3000}
        />
      </div>

      {/* Custom Styling */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Custom Styling
        </h2>
        <TestimonialsPlaceholderCarousel
          className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-8 rounded-3xl"
          cardClassName="border-2 border-primaryOrange/20 shadow-2xl"
        />
      </div>

      {/* Fast Auto-play */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Fast Auto-play (2 seconds)
        </h2>
        <TestimonialsPlaceholderCarousel
          autoPlayInterval={2000}
        />
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
              <code>{`import TestimonialsPlaceholderCarousel from &apos;./TestimonialsPlaceholderCarousel&apos;;

function MyComponent() {
  return &lt;TestimonialsPlaceholderCarousel /&gt;;
}`}</code>
            </pre>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Custom Configuration
            </h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`&lt;TestimonialsPlaceholderCarousel
  autoPlay=&#123;true&#125;
  autoPlayInterval=&#123;4000&#125;
  showDots=&#123;true&#125;
  showArrows=&#123;true&#125;
  showPauseButton=&#123;true&#125;
  maxCards=&#123;4&#125;
  className=&quot;custom-carousel&quot;
  cardClassName=&quot;custom-card&quot;
/&gt;`}</code>
            </pre>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Manual Control
            </h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`<TestimonialsPlaceholderCarousel
  autoPlay={false}
  showPauseButton={false}
  showArrows={true}
  showDots={true}
/>`}</code>
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
                <td className="py-3 px-4 font-mono text-primaryOrange">autoPlay</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4">Enable automatic carousel rotation</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">autoPlayInterval</td>
                <td className="py-3 px-4">number</td>
                <td className="py-3 px-4">5000</td>
                <td className="py-3 px-4">Interval between slides in milliseconds</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">showDots</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4">Show dot navigation indicators</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">showArrows</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4">Show previous/next arrow buttons</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">showPauseButton</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4">Show play/pause control button</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">maxCards</td>
                <td className="py-3 px-4">number</td>
                <td className="py-3 px-4">5</td>
                <td className="py-3 px-4">Maximum number of testimonial cards to show</td>
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
                <td className="py-3 px-4">Additional CSS classes for testimonial cards</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
