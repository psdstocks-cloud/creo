'use client';

import { useTranslations } from 'next-intl';

interface ReusableHeroProps {
  locale: string;
  headlineKey: string;
  subheadlineKey: string;
  primaryButtonKey: string;
  secondaryButtonKey: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
  showSocialProof?: boolean;
  socialProofItems?: {
    key1: string;
    key2: string;
    key3: string;
  };
}

export default function ReusableHero({
  locale,
  headlineKey,
  subheadlineKey,
  primaryButtonKey,
  secondaryButtonKey,
  onPrimaryClick,
  onSecondaryClick,
  className = '',
  showSocialProof = false,
  socialProofItems
}: ReusableHeroProps) {
  const t = useTranslations('ReusableHero');
  const isRTL = locale === 'ar';

  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20 ${className} ${
        isRTL ? 'rtl' : 'ltr'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-deepPurple via-primaryOrange to-deepPurple opacity-90"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-glassWhite/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primaryOrange/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-deepPurple/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="max-w-4xl mx-auto">
          {/* Glassmorphic Card Background */}
          <div className="glass-card p-8 md:p-12 lg:p-16 relative">
            {/* Inner glass layer for depth */}
            <div className="glass-card p-6 md:p-8 lg:p-10 relative">
              {/* Innermost content layer */}
              <div className="glass-card p-4 md:p-6 lg:p-8 text-center">
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
                  <span className="block">
                    {t(headlineKey)}
                  </span>
                  <span className="block bg-gradient-to-r from-primaryOrange via-yellow-400 to-primaryOrange bg-clip-text text-transparent mt-4">
                    {t(`${headlineKey}Highlight`)}
                  </span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                  {t(subheadlineKey)}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
                  {/* Primary Button - Orange Gradient */}
                  <button 
                    onClick={onPrimaryClick}
                    className="group relative px-8 py-4 bg-gradient-to-r from-primaryOrange to-orange-500 hover:from-orange-500 hover:to-primaryOrange text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg min-w-[280px]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {t(primaryButtonKey)}
                      <svg 
                        className={`w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 ${
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
                    <div className="absolute inset-0 bg-gradient-to-r from-primaryOrange to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </button>

                  {/* Secondary Button - Transparent */}
                  <button 
                    onClick={onSecondaryClick}
                    className="group px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white/60 text-white font-semibold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/10 backdrop-blur-sm min-w-[280px]"
                  >
                    <span className="flex items-center justify-center gap-3">
                      {t(secondaryButtonKey)}
                      <svg 
                        className={`w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 ${
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

                {/* Social Proof Bar - Optional */}
                {showSocialProof && socialProofItems && (
                  <div className="glass-card p-4 md:p-6 max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primaryOrange rounded-full animate-pulse"></div>
                        <span className="text-white/90 font-semibold text-base md:text-lg">
                          {t(socialProofItems.key1)}
                        </span>
                      </div>
                      <div className="hidden sm:block w-px h-6 bg-white/30"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primaryOrange rounded-full animate-pulse animation-delay-1000"></div>
                        <span className="text-white/90 font-semibold text-base md:text-lg">
                          {t(socialProofItems.key2)}
                        </span>
                      </div>
                      <div className="hidden sm:block w-px h-6 bg-white/30"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primaryOrange rounded-full animate-pulse animation-delay-2000"></div>
                        <span className="text-white/90 font-semibold text-base md:text-lg">
                          {t(socialProofItems.key3)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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
