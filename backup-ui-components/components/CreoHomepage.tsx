'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface CreoHomepageProps {
  locale: string;
  onLocaleChange: (locale: string) => void;
}

export default function CreoHomepage({ locale, onLocaleChange }: CreoHomepageProps) {
  const t = useTranslations('CreoHomepage');
  const isRTL = locale === 'ar';

  return (
    <div 
      className={`min-h-screen relative overflow-hidden ${
        isRTL ? 'rtl' : 'ltr'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background with Russian doll layering */}
      <div className="absolute inset-0 bg-gradient-to-br from-deepPurple via-primaryOrange to-deepPurple"></div>
      
      {/* First layer - Large background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-glassWhite/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primaryOrange/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-deepPurple/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Second layer - Medium orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-glassWhite/15 rounded-full mix-blend-multiply filter blur-2xl animate-float"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-primaryOrange/25 rounded-full mix-blend-multiply filter blur-2xl animate-float animation-delay-2000"></div>
      </div>

      {/* Third layer - Small accent orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-primaryOrange/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-3000"></div>
      </div>

      {/* Language Switcher - Fixed position */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => onLocaleChange(locale === 'en' ? 'ar' : 'en')}
          className="glass-card px-4 py-2 text-white hover:text-primaryOrange transition-colors duration-200 flex items-center gap-2"
        >
          <span className="text-sm font-medium">
            {locale === 'en' ? 'العربية' : 'English'}
          </span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Russian doll layered content containers */}
            <div className="glass-card p-8 md:p-12 mb-8 relative">
              {/* Inner glass layer */}
              <div className="glass-card p-6 md:p-8 relative">
                {/* Innermost content layer */}
                <div className="glass-card p-4 md:p-6">
                  {/* Main Headline */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
                    <span className="block">
                      {t('headline')}
                    </span>
                    <span className="block bg-gradient-to-r from-primaryOrange via-yellow-400 to-primaryOrange bg-clip-text text-transparent mt-4">
                      {t('headlineHighlight')}
                    </span>
                  </h1>

                  {/* Subheadline */}
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 max-w-5xl mx-auto leading-relaxed">
                    {t('subheadline')}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
                    {/* Primary CTA - Orange Gradient */}
                    <button className="group relative px-8 py-4 bg-gradient-to-r from-primaryOrange to-orange-500 hover:from-orange-500 hover:to-primaryOrange text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg min-w-[280px]">
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {t('primaryCTA')}
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

                    {/* Secondary CTA - Transparent */}
                    <button className="group px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white/60 text-white font-semibold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/10 backdrop-blur-sm min-w-[280px]">
                      <span className="flex items-center justify-center gap-3">
                        {t('secondaryCTA')}
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
                </div>
              </div>
            </div>

            {/* Social Proof Bar */}
            <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primaryOrange rounded-full animate-pulse"></div>
                  <span className="text-white/90 font-semibold text-lg">
                    {t('socialProof1')}
                  </span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-white/30"></div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primaryOrange rounded-full animate-pulse animation-delay-1000"></div>
                  <span className="text-white/90 font-semibold text-lg">
                    {t('socialProof2')}
                  </span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-white/30"></div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primaryOrange rounded-full animate-pulse animation-delay-2000"></div>
                  <span className="text-white/90 font-semibold text-lg">
                    {t('socialProof3')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview Section */}
        <section className="px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-primaryOrange to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('feature1Title')}</h3>
                <p className="text-white/80">{t('feature1Desc')}</p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-primaryOrange to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('feature2Title')}</h3>
                <p className="text-white/80">{t('feature2Desc')}</p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-primaryOrange to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('feature3Title')}</h3>
                <p className="text-white/80">{t('feature3Desc')}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
