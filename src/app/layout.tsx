import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Suspense } from 'react'
import { AuthProvider } from '@/components/auth/AuthProvider';
import { UserProvider } from '@/contexts/UserContext';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ToastProvider } from '@/components/ui/Toast';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Creo - AI-Powered Stock Media Platform',
  description: 'A comprehensive SaaS platform for stock media search, AI image generation, and content management with modern glassmorphism design.',
  keywords: ['stock media', 'AI generation', 'glassmorphism', 'SaaS', 'creative assets'],
  authors: [{ name: 'Creo Team' }],
  creator: 'Creo',
  publisher: 'Creo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Creo - AI-Powered Stock Media Platform',
    description: 'Search and download stock media from multiple sources with AI-powered generation',
    url: 'https://creo-wine.vercel.app',
    siteName: 'Creo',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creo - AI-Powered Stock Media Platform',
    description: 'Search and download stock media from multiple sources with AI-powered generation',
  },
}

// Loading fallback component
function GlobalLoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
      <p className="text-gray-600 text-sm">Loading Creo...</p>
    </div>
  )
}

// Error fallback component
const GlobalErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-8 max-w-md text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 text-sm mb-6">
          {error.message || 'An unexpected error occurred while loading the application.'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`
          ${inter.className} 
          min-h-screen 
          bg-gradient-to-br 
          from-gray-50 
          to-purple-50 
          antialiased 
          overflow-x-hidden
        `}
        suppressHydrationWarning
      >
        {/* Browser extension cleanup script */}
        <Script
          id="extension-cleanup"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const cleanupBrowserExtensions = () => {
                  const extensionSelectors = [
                    '[data-lastpass-icon-root]',
                    '[data-1password-icon-root]',
                    '[data-bitwarden-icon-root]',
                    '[data-dashlane-icon-root]',
                    'div[style*="position:relative"][style*="height:0px"][style*="width:0px"]',
                    'div[style*="position: absolute"][style*="height: 0px"][style*="width: 0px"]'
                  ];
                  
                  extensionSelectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                      if (el.parentNode) {
                        el.parentNode.removeChild(el);
                      }
                    });
                  });
                };
                
                cleanupBrowserExtensions();
                
                const observer = new MutationObserver((mutations) => {
                  let shouldCleanup = false;
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                      mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                          const element = node;
                          if (element.matches && (
                            element.matches('[data-lastpass-icon-root]') ||
                            element.matches('[data-1password-icon-root]') ||
                            element.matches('[data-bitwarden-icon-root]') ||
                            element.matches('[data-dashlane-icon-root]') ||
                            element.matches('div[style*="position:relative"][style*="height:0px"][style*="width:0px"]') ||
                            element.matches('div[style*="position: absolute"][style*="height: 0px"][style*="width: 0px"]')
                          )) {
                            shouldCleanup = true;
                          }
                        }
                      });
                    }
                  });
                  
                  if (shouldCleanup) {
                    cleanupBrowserExtensions();
                  }
                });
                
                observer.observe(document.body, {
                  childList: true,
                  subtree: true
                });
              })();
            `
          }}
        />
        
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-orange-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        
        {/* Main content wrapper with loading fallback */}
        <Suspense fallback={<GlobalLoadingFallback />}>
          <div id="main-content" className="relative min-h-screen">
            <QueryProvider>
              <AuthProvider>
                <UserProvider>
                  <ToastProvider>
                    {children}
                  </ToastProvider>
                </UserProvider>
              </AuthProvider>
            </QueryProvider>
          </div>
        </Suspense>
      </body>
    </html>
  )
}