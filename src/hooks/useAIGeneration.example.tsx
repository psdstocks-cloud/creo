/**
 * AI Generation Hooks Usage Examples
 * 
 * Simple examples showing how to use the AI generation hooks
 */

import React, { useState } from 'react';
import {
  useCreateAIJob,
} from './useAIGeneration';

// ============================================================================
// Example 1: Basic AI Job Creation
// ============================================================================

export function BasicAIGenerationExample() {
  const [prompt, setPrompt] = useState('a beautiful sunset over mountains');
  const createJob = useCreateAIJob();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      const jobId = await createJob.mutateAsync(prompt);
      console.log('AI job created:', jobId);
    } catch (error) {
      console.error('Failed to create AI job:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">AI Image Generation</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prompt
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your image prompt..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryOrange"
          />
        </div>
        
        <button
          type="submit"
          disabled={createJob.isPending}
          className="w-full bg-primaryOrange text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:opacity-50"
        >
          {createJob.isPending ? 'Creating...' : 'Generate Image'}
        </button>
      </form>
      
      {createJob.isError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {createJob.error?.message || 'Failed to create AI job'}
        </div>
      )}
    </div>
  );
}

export default BasicAIGenerationExample;