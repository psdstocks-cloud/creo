'use client';

import { BrandButton } from '@/components/ui/BrandButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { SparklesIcon, PhotoIcon, CpuChipIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/components/auth/AuthProvider'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-brand opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="animate-fade-in">
            <h1 className="text-6xl font-bold text-white mb-6 font-display">
              <span className="bg-gradient-brand bg-clip-text text-transparent">
                Creo
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              AI-Powered Stock Media Platform with Advanced Generation Capabilities
            </p>
          </div>
          
          <div className="animate-slide-up space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <BrandButton 
                    variant="primary" 
                    size="lg" 
                    glow={true}
                    className="mr-4"
                  >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Go to Dashboard
                  </BrandButton>
                </Link>
                <Link href="/stock-search">
                  <BrandButton 
                    variant="glass" 
                    size="lg"
                  >
                    Search Stock Media
                  </BrandButton>
                </Link>
              </>
                   ) : (
                     <>
                       <Link href="/auth/signup">
                         <BrandButton 
                           variant="primary" 
                           size="lg" 
                           glow={true}
                           className="mr-4"
                         >
                           <SparklesIcon className="w-5 h-5 mr-2" />
                           Get Started
                         </BrandButton>
                       </Link>
                       <Link href="/auth/signin">
                         <BrandButton 
                           variant="glass" 
                           size="lg"
                         >
                           Sign In
                         </BrandButton>
                       </Link>
                     </>
                   )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <GlassCard variant="orange" intensity="medium" hover={true} className="p-6 text-center">
            <PhotoIcon className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Stock Media</h3>
            <p className="text-white/70">Access millions of high-quality stock images, videos, and audio files</p>
          </GlassCard>

          <GlassCard variant="purple" intensity="medium" hover={true} className="p-6 text-center">
            <CpuChipIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">AI Generation</h3>
            <p className="text-white/70">Create unique content with our advanced AI image generation system</p>
          </GlassCard>

          <GlassCard variant="light" intensity="medium" hover={true} className="p-6 text-center">
            <CreditCardIcon className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Easy Payments</h3>
            <p className="text-white/70">Simple credit-based system with transparent pricing</p>
          </GlassCard>

          <GlassCard variant="orange" intensity="medium" hover={true} className="p-6 text-center">
            <SparklesIcon className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Advanced Tools</h3>
            <p className="text-white/70">Professional editing and enhancement tools for all your content</p>
          </GlassCard>
        </div>

        {/* CTA Section */}
        <GlassCard variant="light" intensity="strong" className="p-8 text-center animate-scale-in">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Creative Workflow?
          </h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Join thousands of creators who are already using Creo to streamline their content creation process.
          </p>
          <div className="space-x-4">
            {user ? (
              <>
                <Link href="/ai-generation">
                  <BrandButton 
                    variant="primary" 
                    size="lg" 
                    glow={true}
                  >
                    Start AI Generation
                  </BrandButton>
                </Link>
                <Link href="/orders">
                  <BrandButton 
                    variant="secondary" 
                    size="lg"
                  >
                    View Orders
                  </BrandButton>
                </Link>
              </>
                   ) : (
                     <>
                       <Link href="/auth/signup">
                         <BrandButton 
                           variant="primary" 
                           size="lg" 
                           glow={true}
                         >
                           Get Started Free
                         </BrandButton>
                       </Link>
                       <Link href="/stock-search">
                         <BrandButton 
                           variant="secondary" 
                           size="lg"
                         >
                           Browse Stock Media
                         </BrandButton>
                       </Link>
                     </>
                   )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}