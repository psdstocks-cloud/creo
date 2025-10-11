'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useKeyboardNavigation, useFocusTrap } from '@/hooks/useKeyboardNavigation'

interface NavigationItem {
  href: string
  label: string
  icon?: React.ReactNode
  badge?: string
  children?: NavigationItem[]
}

interface AccessibleNavigationProps {
  items: NavigationItem[]
  className?: string
  orientation?: 'horizontal' | 'vertical'
  showLabels?: boolean
  collapsed?: boolean
  onToggle?: () => void
}

export function AccessibleNavigation({
  items,
  className,
  orientation = 'horizontal',
  showLabels = true,
  collapsed = false,
  onToggle,
}: AccessibleNavigationProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const { containerRef } = useKeyboardNavigation()

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, item: NavigationItem) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (item.children) {
          toggleExpanded(item.href)
        } else {
          // Navigate to the link
          const link = event.currentTarget.querySelector('a')
          if (link) {
            link.click()
          }
        }
        break
      case 'ArrowDown':
        if (orientation === 'horizontal' && item.children) {
          event.preventDefault()
          setExpandedItems(prev => new Set(prev).add(item.href))
        }
        break
      case 'ArrowUp':
        if (orientation === 'horizontal' && item.children) {
          event.preventDefault()
          setExpandedItems(prev => {
            const newSet = new Set(prev)
            newSet.delete(item.href)
            return newSet
          })
        }
        break
      case 'Escape':
        setExpandedItems(new Set())
        setActiveItem(null)
        break
    }
  }

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(href)) {
        newSet.delete(href)
      } else {
        newSet.add(href)
      }
      return newSet
    })
  }

  const isExpanded = (href: string) => expandedItems.has(href)
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <nav
      ref={navRef}
      className={cn(
        'navigation',
        orientation === 'horizontal' ? 'flex space-x-1' : 'space-y-1',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {items.map((item) => (
        <NavigationItem
          key={item.href}
          item={item}
          isActive={isActive(item.href)}
          isExpanded={isExpanded(item.href)}
          showLabels={showLabels}
          collapsed={collapsed}
          onKeyDown={(e) => handleKeyDown(e, item)}
          onToggle={() => toggleExpanded(item.href)}
        />
      ))}
    </nav>
  )
}

interface NavigationItemProps {
  item: NavigationItem
  isActive: boolean
  isExpanded: boolean
  showLabels: boolean
  collapsed: boolean
  onKeyDown: (event: React.KeyboardEvent) => void
  onToggle: () => void
}

function NavigationItem({
  item,
  isActive,
  isExpanded,
  showLabels,
  collapsed,
  onKeyDown,
  onToggle,
}: NavigationItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const itemRef = useRef<HTMLLIElement>(null)
  const focusTrapRef = useFocusTrap(isExpanded && item.children)

  const hasChildren = item.children && item.children.length > 0

  return (
    <li
      ref={itemRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
          isActive
            ? 'bg-orange-100 text-orange-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
          collapsed && 'justify-center'
        )}
        role="menuitem"
        tabIndex={0}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-haspopup={hasChildren ? 'menu' : undefined}
        aria-current={isActive ? 'page' : undefined}
        onKeyDown={onKeyDown}
        onClick={hasChildren ? onToggle : undefined}
      >
        {item.icon && (
          <span className={cn('flex-shrink-0', showLabels && !collapsed && 'mr-2')} aria-hidden="true">
            {item.icon}
          </span>
        )}
        
        {showLabels && !collapsed && (
          <span className="flex-1">{item.label}</span>
        )}
        
        {item.badge && (
          <span
            className={cn(
              'ml-2 px-2 py-1 text-xs font-medium rounded-full',
              'bg-orange-100 text-orange-800',
              collapsed && 'absolute -top-1 -right-1'
            )}
            aria-label={`${item.badge} notifications`}
          >
            {item.badge}
          </span>
        )}
        
        {hasChildren && (
          <svg
            className={cn(
              'ml-2 h-4 w-4 transition-transform',
              isExpanded && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}

        {/* Tooltip for collapsed state */}
        {collapsed && (
          <div
            className={cn(
              'absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded shadow-lg',
              'opacity-0 pointer-events-none transition-opacity duration-200',
              isHovered && 'opacity-100 pointer-events-auto'
            )}
            role="tooltip"
          >
            {item.label}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        )}
      </div>

      {/* Submenu */}
      {hasChildren && (isExpanded || isHovered) && (
        <ul
          ref={focusTrapRef}
          className={cn(
            'absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200',
            'focus:outline-none',
            collapsed ? 'left-full ml-2' : 'left-0'
          )}
          role="menu"
          aria-label={`${item.label} submenu`}
        >
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className={cn(
                  'flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset'
                )}
                role="menuitem"
              >
                {child.icon && (
                  <span className="mr-3 flex-shrink-0" aria-hidden="true">
                    {child.icon}
                  </span>
                )}
                <span className="flex-1">{child.label}</span>
                {child.badge && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                    {child.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Direct link for items without children */}
      {!hasChildren && (
        <Link
          href={item.href}
          className={cn(
            'absolute inset-0 rounded-md',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
          )}
          aria-label={collapsed ? item.label : undefined}
        >
          <span className="sr-only">{item.label}</span>
        </Link>
      )}
    </li>
  )
}

// Breadcrumb navigation component
interface BreadcrumbItem {
  href: string
  label: string
  current?: boolean
}

interface AccessibleBreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  separator?: React.ReactNode
}

export function AccessibleBreadcrumbs({
  items,
  className,
  separator = '>',
}: AccessibleBreadcrumbsProps) {
  return (
    <nav
      className={cn('flex', className)}
      aria-label="Breadcrumb"
      role="navigation"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                {separator}
              </span>
            )}
            {item.current ? (
              <span
                className="text-gray-500"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Skip links component
export function SkipLinks() {
  const links = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#search', label: 'Skip to search' },
  ]

  return (
    <div className="sr-only focus-within:not-sr-only">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-orange-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
