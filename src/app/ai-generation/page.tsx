'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useCreateAIJob, useAIResult, useAIAction, useAIJobHistory } from '@/hooks/useAIGeneration'
import { useUserBalance } from '@/hooks/useStockMedia'
import { 
  SparklesIcon, 
  PhotoIcon, 
  ArrowPathIcon,
  ArrowUpIcon,
  CloudArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useToastHelpers } from '@/components/ui/Toast'

interface GenerationSettings {
  style: string
  quality: 'standard' | 'high'
  size: '1024x1024' | '1792x1024' | '1024x1792'
}

export default function AIGenerationPage() {
  const { user } = useAuth()
  const { error: showError } = useToastHelpers()
  const [prompt, setPrompt] = useState('')
  const [settings, setSettings] = useState<GenerationSettings>({
    style: 'realistic',
    quality: 'standard',
    size: '1024x1024'
  })
  const [activeJobs, setActiveJobs] = useState<string[]>([])

  // API Hooks
  const { data: userBalance } = useUserBalance()
  const { data: jobHistory } = useAIJobHistory()
  const createJobMutation = useCreateAIJob()
  const aiActionMutation = useAIAction()

  // Handle job creation
  const handleCreateJob = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      showError('Missing Prompt', 'Please enter a description for your image')
      return
    }

    if (userBalance && userBalance.balance < 1) {
      showError('Insufficient Credits', 'You need at least 1 credit to generate an image')
      return
    }

    try {
      const result = await createJobMutation.mutateAsync({ prompt, settings })
      setActiveJobs(prev => [...prev, result])
      
      // Save to job history
      const newJob = {
        id: result,
        prompt,
        settings,
        createdAt: new Date().toISOString(),
        status: 'processing'
      }
      
      if (user) {
        const existingJobs = JSON.parse(localStorage.getItem(`ai_jobs_${user.id}`) || '[]')
        localStorage.setItem(`ai_jobs_${user.id}`, JSON.stringify([newJob, ...existingJobs]))
      }
      
    } catch (error) {
      console.error('Failed to create AI job:', error)
    }
  }, [prompt, settings, createJobMutation, userBalance, user, showError])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-orange-100">
        <div className="text-center">
          <SparklesIcon className="mx-auto h-12 w-12 text-purple-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Authentication Required</h3>
          <p className="mt-1 text-sm text-gray-500">Please sign in to generate AI images.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-orange-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            AI Image Generation
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Create stunning images with AI-powered generation
          </p>
          {userBalance && (
            <p className="mt-1 text-sm text-gray-500">
              Balance: <span className="font-semibold text-orange-600">${userBalance.balance.toFixed(2)}</span>
            </p>
          )}
        </div>

        {/* Generation Form */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8 border border-white/20">
          <form onSubmit={handleCreateJob} className="space-y-6">
            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your image
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  placeholder="A beautiful sunset over mountains, digital art style, highly detailed..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 resize-none"
                  disabled={createJobMutation.isPending}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {prompt.length}/500
                </div>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Style Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                <select
                  value={settings.style}
                  onChange={(e) => setSettings(prev => ({ ...prev, style: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                >
                  <option value="realistic">Realistic</option>
                  <option value="artistic">Artistic</option>
                  <option value="cartoon">Cartoon</option>
                  <option value="anime">Anime</option>
                  <option value="digital-art">Digital Art</option>
                </select>
              </div>

              {/* Quality Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                <select
                  value={settings.quality}
                  onChange={(e) => setSettings(prev => ({ ...prev, quality: e.target.value as 'standard' | 'high' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                >
                  <option value="standard">Standard (1x cost)</option>
                  <option value="high">High Quality (1.5x cost)</option>
                </select>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <select
                  value={settings.size}
                  onChange={(e) => setSettings(prev => ({ ...prev, size: e.target.value as '1024x1024' | '1792x1024' | '1024x1792' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                >
                  <option value="1024x1024">Square (1024×1024)</option>
                  <option value="1792x1024">Landscape (1792×1024)</option>
                  <option value="1024x1792">Portrait (1024×1792)</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={createJobMutation.isPending || !prompt.trim()}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                {createJobMutation.isPending ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
          </form>
        </div>

        {/* Active Jobs Grid */}
        {activeJobs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Generations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeJobs.map((jobId) => (
                <AIJobCard 
                  key={jobId} 
                  jobId={jobId}
                  aiActionMutation={aiActionMutation}
                />
              ))}
            </div>
          </div>
        )}

        {/* Job History */}
        {jobHistory && jobHistory.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Generations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobHistory.slice(0, 6).map((job: { id: string; prompt: string; settings: GenerationSettings; createdAt: string; status: string }) => (
                <JobHistoryCard 
                  key={job.id} 
                  job={job}
                  onViewClick={() => console.log('View job:', job.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeJobs.length === 0 && (!jobHistory || jobHistory.length === 0) && (
          <div className="text-center py-12">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No generations yet</h3>
            <p className="text-gray-500">Create your first AI-generated image above!</p>
          </div>
        )}
      </div>
    </div>
  )
}

// AI Job Card Component with real-time updates
function AIJobCard({ jobId, aiActionMutation }: {
  jobId: string
  aiActionMutation: ReturnType<typeof useAIAction>
}) {
  const { data: jobResult, isLoading } = useAIResult(jobId, true)
  
  if (isLoading || !jobResult) {
    return <AIJobSkeleton />
  }

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/20">
      {/* Status Header */}
      <div className="p-4 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate">{(jobResult as { prompt?: string }).prompt || 'AI Generation'}</h3>
          <StatusBadge status={(jobResult as { status?: string }).status || 'processing'} />
        </div>
        
        {/* Progress Bar */}
        {(jobResult as { status?: string }).status === 'processing' && (
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Processing...</span>
              <span>{(jobResult as { percentage_complete?: number }).percentage_complete || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(jobResult as { percentage_complete?: number }).percentage_complete || 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Grid */}
      {(jobResult as { files?: Array<{ thumb_lg?: string; thumb_sm?: string; download: string }> }).files && (jobResult as { files?: Array<{ thumb_lg?: string; thumb_sm?: string; download: string }> }).files!.length > 0 && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2">
            {(jobResult as { files?: Array<{ thumb_lg?: string; thumb_sm?: string; download: string }> }).files!.map((file: { thumb_lg?: string; thumb_sm?: string; download: string }, index: number) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={file.thumb_lg || file.thumb_sm || '/placeholder-image.png'}
                    alt={`Generated image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                
                {/* Action Buttons Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                  <button
                    onClick={() => aiActionMutation.mutate({ jobId, action: 'vary', index, varyType: 'subtle' })}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title="Create variations"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => aiActionMutation.mutate({ jobId, action: 'upscale', index })}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    title="Upscale image"
                  >
                    <ArrowUpIcon className="h-4 w-4" />
                  </button>
                  <a
                    href={file.download}
                    download
                    className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    title="Download image"
                  >
                    <CloudArrowDownIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    processing: { icon: ClockIcon, color: 'text-blue-600 bg-blue-100', label: 'Processing' },
    completed: { icon: CheckCircleIcon, color: 'text-green-600 bg-green-100', label: 'Completed' },
    failed: { icon: ExclamationCircleIcon, color: 'text-red-600 bg-red-100', label: 'Failed' },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.processing
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </span>
  )
}

// Job History Card Component
function JobHistoryCard({ job, onViewClick }: { 
  job: { id: string; prompt: string; settings: GenerationSettings; createdAt: string; status: string }
  onViewClick: () => void 
}) {
  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-gray-900 text-sm truncate">{job.prompt}</h4>
        <StatusBadge status={job.status} />
      </div>
      
      <div className="text-xs text-gray-500 mb-2">
        {new Date(job.createdAt).toLocaleDateString()} • {job.settings.style} • {job.settings.quality}
      </div>
      
      <button
        onClick={onViewClick}
        className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium"
      >
        View Results →
      </button>
    </div>
  )
}

// AI Job Skeleton Component
function AIJobSkeleton() {
  return (
    <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/20 animate-pulse">
      <div className="p-4 border-b border-gray-200/50">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
}