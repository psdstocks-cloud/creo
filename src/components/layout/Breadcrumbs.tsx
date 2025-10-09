'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

export function Breadcrumbs() {
  const pathname = usePathname()
  
  // Don't show breadcrumbs on homepage or auth pages
  if (pathname === '/' || pathname.startsWith('/auth/')) {
    return null
  }

  const pathSegments = pathname.split('/').filter(segment => segment)
  
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    return { label, href, isLast: index === pathSegments.length - 1 }
  })

  return (
    <nav className="bg-white/40 backdrop-blur-sm border-b border-gray-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 py-3">
          <Link
            href="/"
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <HomeIcon className="h-4 w-4" />
          </Link>
          
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              {crumb.isLast ? (
                <span className="text-sm font-medium text-gray-900">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
