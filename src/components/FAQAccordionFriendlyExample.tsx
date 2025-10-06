'use client';

import FAQAccordionFriendly from './FAQAccordionFriendly';

export default function FAQAccordionFriendlyExample() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          FAQ Accordion Friendly Component Examples
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Explore different configurations and features of the friendly FAQ accordion component
        </p>
      </div>

      {/* Default Configuration */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Default Configuration
        </h2>
        <FAQAccordionFriendly />
      </div>

      {/* Without Search */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Without Search
        </h2>
        <FAQAccordionFriendly showSearch={false} />
      </div>

      {/* Without Categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Without Categories
        </h2>
        <FAQAccordionFriendly showFilters={false} />
      </div>

      {/* Single Item Expansion */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Single Item Expansion
        </h2>
        <FAQAccordionFriendly allowMultiple={false} />
      </div>

      {/* Custom FAQ Items */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Custom FAQ Items
        </h2>
        <FAQAccordionFriendly
          items={[
            {
              id: 'custom-1',
              question: 'What makes Creo different from other stock media platforms?',
              answer: 'Great question! Unlike other platforms that limit you to one source, Creo gives you access to over 20 premium stock media platforms with just one subscription. Plus, we offer AI image generation, background removal tools, and localized pricing for the Middle East. It\'s like having a universal key to the world\'s best creative content!',
              category: 'features',
              isPopular: true
            },
            {
              id: 'custom-2',
              question: 'How do I get started with Creo?',
              answer: 'Getting started is super easy! Just sign up for a free account (no credit card required), choose your plan, and start downloading amazing content. We\'ll even give you 2 free credits to try it out! Our friendly onboarding process will guide you through everything step by step.',
              category: 'account',
              isNew: true
            },
            {
              id: 'custom-3',
              question: 'Is there a mobile app for Creo?',
              answer: 'Yes! We have a beautiful mobile app available for both iOS and Android. You can browse, search, and download content on the go. The app syncs perfectly with your desktop account, so you can access your downloads from anywhere. It\'s perfect for when inspiration strikes while you\'re out and about!',
              category: 'features',
              isPopular: false
            }
          ]}
        />
      </div>

      {/* Custom Styling */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Custom Styling
        </h2>
        <FAQAccordionFriendly
          className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 p-8 rounded-3xl"
          itemClassName="border-2 border-primaryOrange/20 shadow-2xl"
        />
      </div>

      {/* Pre-opened Items */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Pre-opened Items
        </h2>
        <FAQAccordionFriendly
          defaultOpenItems={['account-creation', 'ai-image-generation']}
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
              <code>{`import FAQAccordionFriendly from &apos;./FAQAccordionFriendly&apos;;

function MyComponent() {
  return &lt;FAQAccordionFriendly /&gt;;
}`}</code>
            </pre>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Custom Configuration
            </h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`&lt;FAQAccordionFriendly
  allowMultiple=&#123;true&#125;
  defaultOpenItems=&#123;[&apos;account-creation&apos;]&#125;
  showSearch=&#123;true&#125;
  showFilters=&#123;true&#125;
  showCategories=&#123;true&#125;
  className=&quot;custom-container&quot;
  itemClassName=&quot;custom-item&quot;
/&gt;`}</code>
            </pre>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Custom FAQ Items
            </h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`const customFAQs = [
  {
    id: 'custom-1',
    question: 'Your custom question?',
    answer: 'Your custom answer with friendly tone!',
    category: 'features',
    isNew: true,
    isPopular: false
  }
];

<FAQAccordionFriendly items={customFAQs} />`}</code>
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
                <td className="py-3 px-4 font-mono text-primaryOrange">items</td>
                <td className="py-3 px-4">FAQItem[]</td>
                <td className="py-3 px-4">[]</td>
                <td className="py-3 px-4">Custom FAQ items array</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">allowMultiple</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4">Allow multiple items to be open</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">defaultOpenItems</td>
                <td className="py-3 px-4">string[]</td>
                <td className="py-3 px-4">[]</td>
                <td className="py-3 px-4">Items to open by default</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">showCategories</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4">Show category badges</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">showSearch</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4">Show search functionality</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">showFilters</td>
                <td className="py-3 px-4">boolean</td>
                <td className="py-3 px-4">true</td>
                <td className="py-3 px-4">Show category filters</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">className</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">&apos;&apos;</td>
                <td className="py-3 px-4">Additional CSS classes for container</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primaryOrange">itemClassName</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">&apos;&apos;</td>
                <td className="py-3 px-4">Additional CSS classes for items</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Item Interface */}
      <div className="glass-card p-8 rounded-2xl">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          FAQ Item Interface
        </h3>
        
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`interface FAQItem {
  id: string;                    // Unique identifier
  question: string;              // FAQ question
  answer: string;                // FAQ answer
  category?: string;             // Optional category
  isNew?: boolean;               // Show "New" badge
  isPopular?: boolean;           // Show "Popular" badge
}`}</code>
        </pre>
      </div>

      {/* Features Overview */}
      <div className="glass-card p-8 rounded-2xl">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Features Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Core Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Friendly, conversational tone</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Bilingual support (English/Arabic)</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>RTL layout compatibility</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Search functionality</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Category filtering</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Advanced Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Glassmorphism styling</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Status badges (New, Popular)</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Accessibility features</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Responsive design</span>
              </li>
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Customizable styling</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
