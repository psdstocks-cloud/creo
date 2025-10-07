/**
 * AI Generation Interface Page
 * 
 * A dedicated page showcasing the AIGenerationInterface component
 * with proper internationalization and RTL support.
 */

'use client';

import dynamic from 'next/dynamic';

// Dynamically import the component to prevent SSR issues
const AIGenerationInterface = dynamic(() => import('../../components/AIGenerationInterface'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
      <div className="glass-card p-8 rounded-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryOrange-500 mx-auto mb-4"></div>
        <p className="text-white">Loading AI Generation Interface...</p>
      </div>
    </div>
  )
});

export default function AIGenerationPage() {
  return <AIGenerationInterface />;
}
