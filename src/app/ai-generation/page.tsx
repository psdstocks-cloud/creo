'use client'

import { useState, useCallback } from 'react'
import { useCreateAIJob, useAIResult, useAIAction } from '@/hooks/useAIGeneration'
import { useAuth } from '@/components/auth/AuthProvider'
import { SparklesIcon, ArrowPathIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AIGenerationPage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [activeJobs, setActiveJobs] = useState<string[]>([])

  const createJobMutation = useCreateAIJob()
  const aiActionMutation = useAIAction()

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      alert('Please enter a prompt')
      return
    }

      try {
        const response = await createJobMutation.mutateAsync(prompt.trim())
        setActiveJobs(prev => [...prev, response.job_id])
        setPrompt('')
      } catch (error) {
      console.error('Failed to create AI job:', error)
      alert('Failed to create AI job. Please try again.')
    }
  }, [prompt, createJobMutation])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Authentication Required</h3>
          <p className="mt-1 text-sm text-gray-500">Please sign in to use AI generation.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Image Generation</h1>
          <p className="mt-2 text-lg text-gray-600">
            Create stunning images with AI-powered generation
          </p>
        </div>

        {/* Generation Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={createJobMutation.isPending || !prompt.trim()}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                {createJobMutation.isPending ? 'Creating...' : 'Generate Image'}
              </button>
            </div>
          </form>
        </div>

        {/* Active Jobs */}
        {activeJobs.length > 0 && (
          <div className="space-y-6">
            {activeJobs.map((jobId) => (
              <AIJobCard 
                key={jobId} 
                jobId={jobId}
                aiActionMutation={aiActionMutation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// AI Job Card Component
function AIJobCard({ 
  jobId, 
  aiActionMutation 
}: { 
  jobId: string
  aiActionMutation: ReturnType<typeof useAIAction>
}) {
  const { data: aiResult, isLoading } = useAIResult(jobId)

  const handleAction = useCallback(async (action: 'vary' | 'upscale', index: number, varyType?: 'subtle' | 'strong') => {
    try {
      const newJobId = await aiActionMutation.mutateAsync({ jobId, action, index, varyType })
      console.log('New job created:', newJobId)
    } catch (error) {
      console.error('Failed to perform action:', error)
      alert('Failed to perform action. Please try again.')
    }
  }, [jobId, aiActionMutation])

  const handleDownload = useCallback((downloadUrl: string) => {
    window.open(downloadUrl, '_blank')
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!aiResult) return null

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Job: {jobId}</h3>
            <p className="text-sm text-gray-600">{aiResult.prompt}</p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              aiResult.status === 'completed' ? 'bg-green-100 text-green-800' :
              aiResult.status === 'processing' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {aiResult.status}
            </span>
            {aiResult.status === 'processing' && (
              <p className="text-sm text-gray-500 mt-1">{aiResult.percentage_complete}%</p>
            )}
            <p className="text-sm text-gray-500 mt-1">Cost: ${aiResult.cost}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {aiResult.status === 'processing' && (
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${aiResult.percentage_complete}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Generated Images */}
        {aiResult.files && aiResult.files.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiResult.files.map((file, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={file.thumb_lg}
                    alt={`Generated image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                
                <div className="p-3 space-y-2">
                  <button
                    onClick={() => handleDownload(file.download)}
                    className="w-full text-sm bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                  >
                    Download
                  </button>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleAction('vary', index, 'subtle')}
                      disabled={aiActionMutation.isPending}
                      className="flex-1 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      <ArrowPathIcon className="h-3 w-3 inline mr-1" />
                      Vary (Subtle)
                    </button>
                    <button
                      onClick={() => handleAction('vary', index, 'strong')}
                      disabled={aiActionMutation.isPending}
                      className="flex-1 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      <ArrowPathIcon className="h-3 w-3 inline mr-1" />
                      Vary (Strong)
                    </button>
                    <button
                      onClick={() => handleAction('upscale', index)}
                      disabled={aiActionMutation.isPending}
                      className="flex-1 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      <MagnifyingGlassPlusIcon className="h-3 w-3 inline mr-1" />
                      Upscale
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
