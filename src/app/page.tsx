'use client'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { useAuth } from '@/components/auth/AuthProvider'
import { HomePageSEO } from '@/components/seo/SEOHead'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/JsonLd'
import { 
  SparklesIcon, 
  PhotoIcon, 
  CpuChipIcon, 
  CreditCardIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner h-12 w-12 border-4 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  // FAQ data for structured data
  const faqData = [
    {
      question: "What is Creo?",
      answer: "Creo is an AI-powered stock media platform that allows you to search millions of high-quality stock photos, videos, and graphics, plus generate custom images using artificial intelligence."
    },
    {
      question: "How does AI image generation work?",
      answer: "Our AI image generation uses advanced machine learning models to create custom images from text descriptions. Simply describe what you want, and our AI will generate unique, high-quality images for your projects."
    },
    {
      question: "What types of stock media are available?",
      answer: "We provide access to millions of stock photos, videos, and graphics across various categories including business, technology, lifestyle, nature, and more. All content is high-quality and suitable for commercial use."
    },
    {
      question: "How does the credit system work?",
      answer: "Creo uses a simple credit-based system. You purchase credits and use them to download stock media or generate AI images. Each download or generation costs a certain number of credits, with transparent pricing."
    },
    {
      question: "Can I use the images for commercial purposes?",
      answer: "Yes! All stock media and AI-generated images from Creo can be used for commercial purposes, including marketing, advertising, and business projects."
    }
  ]

  return (
    <>
      <HomePageSEO />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://creo.vercel.app' }
      ]} />
      <FAQJsonLd faqs={faqData} />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-brand opacity-5" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-display mb-6">
            <span className="text-gradient-brand">Creo</span>
          </h1>
          <p className="text-xl text-body mb-8 max-w-2xl mx-auto">
            AI-Powered Stock Media Platform with Advanced Generation Capabilities
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" leftIcon={<SparklesIcon className="w-5 h-5" />}>
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/stock-search">
                  <Button variant="outline" size="lg" leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}>
                    Search Stock Media
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup">
                  <Button size="lg" leftIcon={<SparklesIcon className="w-5 h-5" />}>
                    Get Started
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-heading mb-4">
              Everything you need for creative content
            </h2>
            <p className="text-lg text-body max-w-2xl mx-auto">
              Powerful tools and AI capabilities to streamline your creative workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card variant="glass" hover className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <PhotoIcon className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Stock Media</CardTitle>
                <CardDescription>
                  Access millions of high-quality stock images, videos, and audio files
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="glass" hover className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CpuChipIcon className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>AI Generation</CardTitle>
                <CardDescription>
                  Create unique content with our advanced AI image generation system
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="glass" hover className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CreditCardIcon className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Easy Payments</CardTitle>
                <CardDescription>
                  Simple credit-based system with transparent pricing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="glass" hover className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>
                  Track downloads and AI generation jobs in one place
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card variant="glass" className="text-center">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold text-heading mb-4">
                Ready to Transform Your Creative Workflow?
              </h2>
              <p className="text-lg text-body mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are already using Creo to streamline their content creation process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <>
                    <Link href="/ai-generation">
                      <Button size="lg" leftIcon={<SparklesIcon className="w-5 h-5" />}>
                        Start AI Generation
                      </Button>
                    </Link>
                    <Link href="/orders">
                      <Button variant="outline" size="lg" leftIcon={<ClipboardDocumentListIcon className="w-5 h-5" />}>
                        View Orders
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signup">
                      <Button size="lg" leftIcon={<SparklesIcon className="w-5 h-5" />}>
                        Get Started Free
                      </Button>
                    </Link>
                    <Link href="/stock-search">
                      <Button variant="outline" size="lg" leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}>
                        Browse Stock Media
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      </div>
    </>
  )
}