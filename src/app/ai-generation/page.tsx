/**
 * AI Generation Page
 * 
 * Page showcasing the comprehensive AIGenerationInterface component
 * with all features including prompt input, style selection, and image gallery.
 */

'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the AIGenerationInterface component to avoid SSR issues
const AIGenerationInterface = dynamic(() => import('../../components/AIGenerationInterface'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading AI generation interface...</p>
      </div>
    </div>
  )
});

const AIGenerationPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading AI generation interface...</p>
        </div>
      </div>
    }>
      <AIGenerationInterface />
    </Suspense>
  );
};

export default AIGenerationPage;