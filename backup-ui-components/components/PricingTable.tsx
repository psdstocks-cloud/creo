'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PricingTableProps {
  locale: string;
  onPlanSelect?: (planType: 'pay-per-download' | 'professional') => void;
  className?: string;
}

export default function PricingTable({ locale, onPlanSelect, className = '' }: PricingTableProps) {
  const [selectedPlan, setSelectedPlan] = useState<'pay-per-download' | 'professional' | null>(null);
  const t = useTranslations('PricingTable');
  const isRTL = locale === 'ar';

  const handlePlanSelect = (planType: 'pay-per-download' | 'professional') => {
    setSelectedPlan(planType);
    onPlanSelect?.(planType);
  };

  // Geometric minimal icons
  const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const DownloadIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const ProfessionalIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const StarIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  const plans = [
    {
      id: 'pay-per-download',
      name: t('payPerDownloadName'),
      description: t('payPerDownloadDesc'),
      price: '15',
      currency: 'EGP',
      period: t('perDownload'),
      icon: DownloadIcon,
      features: [
        t('feature1'),
        t('feature2'),
        t('feature3'),
        t('feature4'),
        t('feature5'),
      ],
      ctaText: t('startDownloading'),
      popular: false,
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      id: 'professional',
      name: t('professionalName'),
      description: t('professionalDesc'),
      price: '599',
      currency: 'EGP',
      period: t('perMonth'),
      icon: ProfessionalIcon,
      features: [
        t('proFeature1'),
        t('proFeature2'),
        t('proFeature3'),
        t('proFeature4'),
        t('proFeature5'),
        t('proFeature6'),
      ],
      ctaText: t('startFreeTrial'),
      popular: true,
      gradient: 'from-primaryOrange to-orange-500',
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

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <div
                key={plan.id}
                className={`relative glass-card p-8 rounded-3xl transition-all duration-300 transform hover:scale-105 ${
                  isSelected ? 'ring-2 ring-primaryOrange ring-opacity-50' : ''
                } ${plan.popular ? 'lg:scale-105' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primaryOrange to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <StarIcon />
                      {t('mostPopular')}
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
                    <IconComponent />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-white/70 text-lg">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-2 rtl:gap-2">
                    <span className="text-5xl md:text-6xl font-bold text-white">
                      {plan.price}
                    </span>
                    <div className="text-left rtl:text-right">
                      <span className="text-2xl font-semibold text-white">
                        {plan.currency}
                      </span>
                      <div className="text-white/70 text-lg">
                        {plan.period}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 rtl:gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-primaryOrange to-orange-500 rounded-full flex items-center justify-center mt-0.5">
                          <CheckIcon />
                        </div>
                        <span className="text-white/90 text-lg">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelect(plan.id as 'pay-per-download' | 'professional')}
                  className={`w-full group relative px-8 py-4 bg-gradient-to-r ${plan.gradient} hover:from-orange-500 hover:to-primaryOrange text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {plan.ctaText}
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
                  <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                </button>

                {/* Additional Info */}
                {plan.id === 'pay-per-download' && (
                  <div className="mt-4 text-center">
                    <p className="text-white/60 text-sm">
                      {t('payPerDownloadNote')}
                    </p>
                  </div>
                )}

                {plan.id === 'professional' && (
                  <div className="mt-4 text-center">
                    <p className="text-white/60 text-sm">
                      {t('professionalNote')}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="glass-card p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t('bottomTitle')}
            </h3>
            <p className="text-white/80 text-lg mb-6">
              {t('bottomDescription')}
            </p>
            <button className="bg-gradient-to-r from-primaryOrange to-orange-500 hover:from-orange-500 hover:to-primaryOrange text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg">
              {t('contactUs')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
