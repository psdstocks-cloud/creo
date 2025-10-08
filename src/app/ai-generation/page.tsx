'use client'

import { useState } from 'react'
import { useCreateAIJob, useAIResult } from '@/hooks/useAIGeneration'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AIGenerationPage() {
  const [prompt, setPrompt] = useState('')
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  
  const createAIJob = useCreateAIJob()
  const { data: aiResult, isLoading: isPolling } = useAIResult(currentJobId || '', !!currentJobId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    try {
      const jobId = await createAIJob.mutateAsync(prompt)
      setCurrentJobId(jobId)
    } catch (error) {
      console.error('Failed to create AI job:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Image Generation</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your image prompt..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryOrange"
          />
          <button
            type="submit"
            disabled={createAIJob.isPending}
            className="bg-primaryOrange text-white px-6 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50"
          >
            {createAIJob.isPending ? 'Creating...' : 'Generate'}
          </button>
        </div>
      </form>

      {currentJobId && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Generation Status</h2>
          {isPolling ? (
            <p>Checking status...</p>
          ) : aiResult ? (
            <div>
              <p>Status: {aiResult.status}</p>
              <p>Progress: {aiResult.percentage_complete}%</p>
              {aiResult.files && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {aiResult.files.map((file, index) => (
                    <div key={index} className="border rounded p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={file.thumb_lg} alt={`Result ${index + 1}`} className="w-full h-auto" />
                      <button
                        onClick={() => window.open(file.download, '_blank')}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
