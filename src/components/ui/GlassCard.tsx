'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'light' | 'dark' | 'orange' | 'purple'
  intensity?: 'subtle' | 'medium' | 'strong'
  hover?: boolean
  glow?: boolean
}

export function GlassCard({ 
  children, 
  className, 
  variant = 'light',
  intensity = 'medium',
  hover = false,
  glow = false
}: GlassCardProps) {
  const baseClasses = "backdrop-blur-glass border border-white/20 rounded-xl"
  
  const variantClasses = {
    light: "bg-glass-white shadow-glass",
    dark: "bg-glass-black shadow-glass",
    orange: "bg-glass-orange shadow-glow-orange",
    purple: "bg-glass-purple shadow-glow-purple"
  }
  
  const intensityClasses = {
    subtle: "bg-opacity-5",
    medium: "bg-opacity-10", 
    strong: "bg-opacity-20"
  }
  
  const hoverClasses = hover ? "hover:bg-opacity-20 hover:shadow-glow-orange-strong transition-all duration-300" : ""
  const glowClasses = glow ? "animate-glow-pulse" : ""

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        intensityClasses[intensity],
        hoverClasses,
        glowClasses,
        className
      )}
    >
      {children}
    </div>
  )
}
