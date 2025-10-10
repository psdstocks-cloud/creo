import { SparklesIcon } from '@heroicons/react/24/outline'

export function AIGenerationSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-orange-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Form Skeleton */}
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8 border border-white/20">
          <div className="space-y-6">
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <div className="h-12 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AIGenerationProgressIndicator({ 
  progress, 
  status,
  estimatedTime 
}: { 
  progress: number
  status: string
  estimatedTime?: string
}) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center space-x-3 mb-4">
        <div className="animate-spin">
          <SparklesIcon className="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Generating your image...</h3>
          <p className="text-sm text-gray-600">{status}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {estimatedTime && (
          <p className="text-xs text-gray-500 text-center">
            Estimated time remaining: {estimatedTime}
          </p>
        )}
      </div>
    </div>
  )
}

