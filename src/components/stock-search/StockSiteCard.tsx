'use client'

import { Card, CardContent, LoadingSkeleton } from '@/components/ui'

interface StockSite {
  id: string
  name: string
  active: boolean
  icon?: string
}

interface StockSitesGridProps {
  sites: Record<string, StockSite>
}

export function StockSitesGrid({ sites }: StockSitesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(sites).map(([key, site]) => (
        <Card key={key} className="p-4">
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${site.active ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="font-medium">{site.name}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function StockSitesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-4">
          <CardContent>
            <LoadingSkeleton lines={2} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}