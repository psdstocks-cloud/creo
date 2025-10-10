'use client'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// Responsive Grid Component
export const ResponsiveGrid = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    cols?: {
      default?: number
      sm?: number
      md?: number
      lg?: number
      xl?: number
      '2xl'?: number
    }
    gap?: number
    minItemWidth?: string
  }
>(({ 
  cols = { default: 1, sm: 2, md: 3, lg: 4, xl: 5 }, 
  gap = 4, 
  minItemWidth,
  className,
  children,
  ...props 
}, ref) => {
  const gridClasses = cn(
    'grid',
    `gap-${gap}`,
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`,
    className
  )

  const style = minItemWidth ? {
    gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`
  } : undefined

  return (
    <div 
      ref={ref}
      className={gridClasses}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
})
ResponsiveGrid.displayName = "ResponsiveGrid"

// Responsive Stack Component
export const ResponsiveStack = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    direction?: {
      default?: 'row' | 'col'
      sm?: 'row' | 'col'
      md?: 'row' | 'col'
      lg?: 'row' | 'col'
    }
    spacing?: number
    align?: 'start' | 'center' | 'end' | 'stretch'
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  }
>(({ 
  direction = { default: 'col', md: 'row' },
  spacing = 4,
  align = 'start',
  justify = 'start',
  className,
  children,
  ...props 
}, ref) => {
  const stackClasses = cn(
    'flex',
    // Direction
    direction.default === 'row' ? 'flex-row' : 'flex-col',
    direction.sm === 'row' ? 'sm:flex-row' : direction.sm === 'col' ? 'sm:flex-col' : '',
    direction.md === 'row' ? 'md:flex-row' : direction.md === 'col' ? 'md:flex-col' : '',
    direction.lg === 'row' ? 'lg:flex-row' : direction.lg === 'col' ? 'lg:flex-col' : '',
    // Spacing
    direction.default === 'row' ? `space-x-${spacing}` : `space-y-${spacing}`,
    // Alignment
    align === 'start' ? 'items-start' :
    align === 'center' ? 'items-center' :
    align === 'end' ? 'items-end' :
    align === 'stretch' ? 'items-stretch' : '',
    // Justify
    justify === 'start' ? 'justify-start' :
    justify === 'center' ? 'justify-center' :
    justify === 'end' ? 'justify-end' :
    justify === 'between' ? 'justify-between' :
    justify === 'around' ? 'justify-around' :
    justify === 'evenly' ? 'justify-evenly' : '',
    className
  )

  return (
    <div 
      ref={ref}
      className={stackClasses}
      {...props}
    >
      {children}
    </div>
  )
})
ResponsiveStack.displayName = "ResponsiveStack"

// Container with max-width and responsive padding
export const Container = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
    padding?: boolean
  }
>(({ 
  maxWidth = '7xl', 
  padding = true, 
  className,
  children,
  ...props 
}, ref) => {
  const containerClasses = cn(
    'w-full mx-auto',
    maxWidth === 'sm' ? 'max-w-sm' :
    maxWidth === 'md' ? 'max-w-md' :
    maxWidth === 'lg' ? 'max-w-lg' :
    maxWidth === 'xl' ? 'max-w-xl' :
    maxWidth === '2xl' ? 'max-w-2xl' :
    maxWidth === '7xl' ? 'max-w-7xl' :
    maxWidth === 'full' ? 'max-w-full' : 'max-w-7xl',
    padding && 'px-4 sm:px-6 lg:px-8',
    className
  )

  return (
    <div 
      ref={ref}
      className={containerClasses}
      {...props}
    >
      {children}
    </div>
  )
})
Container.displayName = "Container"
