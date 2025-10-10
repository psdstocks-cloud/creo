'use client'

import { ReactNode } from 'react'

interface EnhancedClientLayoutProps {
  children: ReactNode
}

export function EnhancedClientLayout({ children }: EnhancedClientLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}