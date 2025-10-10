'use client'
import { motion } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export interface StockSiteCardProps {
  name: string
  active: boolean
  price: number
  displayName?: string
  logo?: string
  description?: string
  className?: string
}

// Stock site logos and display names mapping
const STOCK_SITE_INFO = {
  shutterstock: {
    displayName: 'Shutterstock',
    logo: '/icons/shutterstock.svg',
    description: 'Premium stock photos and vectors',
    color: 'from-red-500 to-red-600'
  },
  istockphoto: {
    displayName: 'iStock',
    logo: '/icons/istock.svg', 
    description: 'Quality stock photos and illustrations',
    color: 'from-green-500 to-green-600'
  },
  adobestock: {
    displayName: 'Adobe Stock',
    logo: '/icons/adobe.svg',
    description: 'Creative assets from Adobe',
    color: 'from-blue-500 to-purple-600'
  },
  dreamstime: {
    displayName: 'Dreamstime',
    logo: '/icons/dreamstime.svg',
    description: 'Royalty-free stock photography',
    color: 'from-orange-500 to-pink-500'
  },
  alamy: {
    displayName: 'Alamy',
    logo: '/icons/alamy.svg',
    description: 'Diverse stock photo collection',
    color: 'from-teal-500 to-cyan-600'
  },
  freepik: {
    displayName: 'Freepik',
    logo: '/icons/freepik.svg',
    description: 'Free and premium graphic resources',
    color: 'from-indigo-500 to-purple-600'
  },
  unsplash: {
    displayName: 'Unsplash',
    logo: '/icons/unsplash.svg',
    description: 'Beautiful free photography',
    color: 'from-gray-700 to-gray-900'
  },
  pexels: {
    displayName: 'Pexels',
    logo: '/icons/pexels.svg',
    description: 'Free stock photos and videos',
    color: 'from-green-400 to-blue-500'
  },
  pixabay: {
    displayName: 'Pixabay',
    logo: '/icons/pixabay.svg',
    description: 'Free images for commercial use',
    color: 'from-yellow-400 to-orange-500'
  },
  gettyimages: {
    displayName: 'Getty Images',
    logo: '/icons/getty.svg',
    description: 'Premium editorial and creative content',
    color: 'from-black to-gray-800'
  }
}

export function StockSiteCard({
  name,
  active,
  price,
  displayName,
  logo,
  description,
  className = ''
}: StockSiteCardProps) {
  const siteInfo = STOCK_SITE_INFO[name as keyof typeof STOCK_SITE_INFO]
  const finalDisplayName = displayName || siteInfo?.displayName || name
  const finalLogo = logo || siteInfo?.logo
  const finalDescription = description || siteInfo?.description
  const gradientColor = siteInfo?.color || 'from-gray-400 to-gray-600'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`
        relative overflow-hidden rounded-xl border border-white/20 
        bg-white/60 backdrop-blur-md shadow-lg
        transition-all duration-300
        ${active 
          ? 'shadow-orange-500/20 ring-1 ring-orange-500/30' 
          : 'opacity-75 grayscale'
        }
        ${className}
      `}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-5`} />
      
      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          {/* Logo and Name */}
          <div className="flex items-center space-x-3">
            {finalLogo ? (
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={finalLogo}
                  alt={`${finalDisplayName} logo`}
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
            ) : (
              <div className={`
                w-8 h-8 flex-shrink-0 rounded-lg 
                bg-gradient-to-br ${gradientColor}
                flex items-center justify-center
              `}>
                <span className="text-white font-bold text-sm">
                  {finalDisplayName.charAt(0)}
                </span>
              </div>
            )}
            
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                {finalDisplayName}
              </h3>
              {finalDescription && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {finalDescription}
                </p>
              )}
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex-shrink-0">
            {active ? (
              <div className="flex items-center text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span className="text-xs font-medium ml-1 hidden sm:inline">
                  Active
                </span>
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <XCircleIcon className="h-4 w-4" />
                <span className="text-xs font-medium ml-1 hidden sm:inline">
                  Off
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              ${price.toFixed(price < 1 ? 2 : 1)}
            </div>
            <div className="text-xs text-gray-500">per credit</div>
          </div>
          
          {/* Usage indicator (could show recent usage) */}
          <div className="text-xs text-gray-400">
            {/* Could add usage stats here */}
          </div>
        </div>

        {/* Inactive Overlay */}
        {!active && (
          <div className="absolute inset-0 bg-gray-500/20 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
            <div className="bg-red-500/90 text-white px-2 py-1 rounded-md text-xs font-medium">
              Inactive
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Grid container component for better layout
export function StockSitesGrid({ 
  sites,
  className = ''
}: { 
  sites: Record<string, any>
  className?: string 
}) {
  if (!sites || Object.keys(sites).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No stock sites available</p>
      </div>
    )
  }

  return (
    <div className={`
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 
      gap-4 ${className}
    `}>
      {Object.entries(sites).map(([siteName, config]) => (
        <StockSiteCard
          key={siteName}
          name={siteName}
          active={config.active}
          price={config.price}
        />
      ))}
    </div>
  )
}

// Loading skeleton for stock site cards
export function StockSiteCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur-md p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
          <div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-1" />
            <div className="h-3 bg-gray-200 rounded w-32" />
          </div>
        </div>
        <div className="w-4 h-4 bg-gray-200 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="h-5 bg-gray-200 rounded w-12 mb-1" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export function StockSitesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {Array.from({ length: 8 }, (_, i) => (
        <StockSiteCardSkeleton key={i} />
      ))}
    </div>
  )
}
