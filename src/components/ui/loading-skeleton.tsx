import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  children?: React.ReactNode
}

export const LoadingSkeleton = ({ className, children, ...props }: LoadingSkeletonProps & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const DashboardLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg">
            <LoadingSkeleton className="h-4 w-20 mb-2" />
            <LoadingSkeleton className="h-8 w-16 mb-2" />
            <LoadingSkeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      <div className="p-6 border rounded-lg">
        <LoadingSkeleton className="h-6 w-32 mb-4" />
        <LoadingSkeleton className="h-4 w-48 mb-6" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-3/4" />
          <LoadingSkeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  )
}
