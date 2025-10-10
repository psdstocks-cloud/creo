'use client'

import { Card, CardContent, LoadingSkeleton } from '@/components/ui'

interface BatchSearchResultsProps {
  results: any[]
  loading?: boolean
}

export function BatchSearchResults({ results, loading }: BatchSearchResultsProps) {
  if (loading) {
    return <BatchSearchResultsSkeleton />
  }

  return (
    <div className="space-y-4">
      {results.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No results found</p>
          </CardContent>
        </Card>
      ) : (
        results.map((result, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Result {index + 1}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

export function BatchSearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <LoadingSkeleton lines={2} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}