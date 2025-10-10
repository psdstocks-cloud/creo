'use client';

import { useTranslations } from 'next-intl';

interface HeroProps {
  locale: string;
}

export default function Hero({ locale }: HeroProps) {
  const t = useTranslations('Hero');
  const isRTL = locale === 'ar';

  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
        isRTL ? 'rtl' : 'ltr'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-deepPurple via-primaryOrange to-deepPurple opacity-90"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-glassWhite rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primaryOrange rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-deepPurple rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block">
              {t('headline')}
            </span>
            <span className="block bg-gradient-to-r from-primaryOrange to-yellow-400 bg-clip-text text-transparent mt-2">
              {t('headlineHighlight')}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('subheadline')}
          </p>

          {/* Buttons Container */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
            {/* Primary Button - Orange Gradient */}
            <button className="group relative px-8 py-4 bg-gradient-to-r from-primaryOrange to-orange-500 hover:from-orange-500 hover:to-primaryOrange text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg min-w-[200px]">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t('primaryButton')}
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${
                    isRTL ? 'rtl:rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} 
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primaryOrange to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </button>

            {/* Secondary Button - Transparent */}
            <button className="group px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white/60 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-white/10 backdrop-blur-sm min-w-[200px]">
              <span className="flex items-center justify-center gap-2">
                {t('secondaryButton')}
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${
                    isRTL ? 'rtl:rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} 
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* Features/Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-primaryOrange mb-2">
                {t('stat1Number')}
              </div>
              <div className="text-white/80 text-sm">
                {t('stat1Label')}
              </div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-primaryOrange mb-2">
                {t('stat2Number')}
              </div>
              <div className="text-white/80 text-sm">
                {t('stat2Label')}
              </div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-primaryOrange mb-2">
                {t('stat3Number')}
              </div>
              <div className="text-white/80 text-sm">
                {t('stat3Label')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
