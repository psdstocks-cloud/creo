'use client';

import { useTranslations } from 'next-intl';

interface FeaturesShowcaseProps {
  locale: string;
  className?: string;
}

export default function FeaturesShowcase({ locale, className = '' }: FeaturesShowcaseProps) {
  const t = useTranslations('FeaturesShowcase');
  const isRTL = locale === 'ar';

  // Geometric minimal icons for each feature
  const MultiSourceIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  const AIImageIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  const BackgroundRemovalIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const DownloadHistoryIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const LocalPricingIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const FlexiblePaymentIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );

  const features = [
    {
      id: 'multiSource',
      icon: MultiSourceIcon,
      titleKey: 'multiSourceTitle',
      descriptionKey: 'multiSourceDesc',
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      id: 'aiImage',
      icon: AIImageIcon,
      titleKey: 'aiImageTitle',
      descriptionKey: 'aiImageDesc',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      id: 'backgroundRemoval',
      icon: BackgroundRemovalIcon,
      titleKey: 'backgroundRemovalTitle',
      descriptionKey: 'backgroundRemovalDesc',
      gradient: 'from-pink-500 to-red-600',
    },
    {
      id: 'downloadHistory',
      icon: DownloadHistoryIcon,
      titleKey: 'downloadHistoryTitle',
      descriptionKey: 'downloadHistoryDesc',
      gradient: 'from-red-500 to-orange-600',
    },
    {
      id: 'localPricing',
      icon: LocalPricingIcon,
      titleKey: 'localPricingTitle',
      descriptionKey: 'localPricingDesc',
      gradient: 'from-orange-500 to-yellow-600',
    },
    {
      id: 'flexiblePayment',
      icon: FlexiblePaymentIcon,
      titleKey: 'flexiblePaymentTitle',
      descriptionKey: 'flexiblePaymentDesc',
      gradient: 'from-yellow-500 to-green-600',
    },
  ];

  return (
    <section 
      className={`py-20 px-4 ${className} ${
        isRTL ? 'rtl' : 'ltr'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t('title')}
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <div
                key={feature.id}
                className="group glass-card p-8 rounded-3xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Feature Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent />
                </div>

                {/* Feature Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-primaryOrange transition-colors duration-300">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed">
                    {t(feature.descriptionKey)}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primaryOrange/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('ctaTitle')}
            </h3>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              {t('ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-primaryOrange to-orange-500 hover:from-orange-500 hover:to-primaryOrange text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg min-w-[200px]">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {t('ctaButton1')}
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
                <div className="absolute inset-0 bg-gradient-to-r from-primaryOrange to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </button>

              <button className="group px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white/60 text-white font-semibold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/10 backdrop-blur-sm min-w-[200px]">
                <span className="flex items-center justify-center gap-3">
                  {t('ctaButton2')}
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
          </div>
        </div>
      </div>
    </section>
  );
}
