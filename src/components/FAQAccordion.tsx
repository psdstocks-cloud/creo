'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface FAQAccordionProps {
  locale: string;
  className?: string;
}

interface FAQItem {
  id: string;
  questionKey: string;
  answerKey: string;
  category?: string;
}

export default function FAQAccordion({ locale, className = '' }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const t = useTranslations('FAQAccordion');
  const isRTL = locale === 'ar';

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleItem(itemId);
    }
  };

  // FAQ data
  const faqItems: FAQItem[] = [
    {
      id: 'account-creation',
      questionKey: 'accountCreationQuestion',
      answerKey: 'accountCreationAnswer',
      category: 'account'
    },
    {
      id: 'credits-expiration',
      questionKey: 'creditsExpirationQuestion',
      answerKey: 'creditsExpirationAnswer',
      category: 'credits'
    },
    {
      id: 'payment-methods',
      questionKey: 'paymentMethodsQuestion',
      answerKey: 'paymentMethodsAnswer',
      category: 'payment'
    },
    {
      id: 'subscription-extensions',
      questionKey: 'subscriptionExtensionsQuestion',
      answerKey: 'subscriptionExtensionsAnswer',
      category: 'subscription'
    },
    {
      id: 'ai-usage',
      questionKey: 'aiUsageQuestion',
      answerKey: 'aiUsageAnswer',
      category: 'features'
    },
    {
      id: 'money-back-guarantee',
      questionKey: 'moneyBackGuaranteeQuestion',
      answerKey: 'moneyBackGuaranteeAnswer',
      category: 'refund'
    },
    {
      id: 'download-limits',
      questionKey: 'downloadLimitsQuestion',
      answerKey: 'downloadLimitsAnswer',
      category: 'usage'
    },
    {
      id: 'platform-support',
      questionKey: 'platformSupportQuestion',
      answerKey: 'platformSupportAnswer',
      category: 'platforms'
    }
  ];

  // Icons
  const ChevronDownIcon = () => (
    <svg 
      className={`w-5 h-5 transition-transform duration-300 ${
        isRTL ? 'rtl:rotate-180' : ''
      }`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const QuestionIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <section 
      className={`py-20 px-4 ${className} ${
        isRTL ? 'rtl' : 'ltr'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t('title')}
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openItems.has(item.id);
            
            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Question Button */}
                <button
                  className="w-full px-6 py-6 text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-opacity-50 rounded-2xl transition-all duration-200"
                  onClick={() => toggleItem(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  id={`faq-question-${item.id}`}
                >
                  <div className="flex items-center justify-between gap-4 rtl:gap-4">
                    <div className="flex items-center gap-4 rtl:gap-4 flex-1">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-primaryOrange to-orange-500 rounded-xl flex items-center justify-center">
                        <QuestionIcon />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-primaryOrange transition-colors duration-200">
                        {t(item.questionKey)}
                      </h3>
                    </div>
                    <div className={`flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}>
                      <ChevronDownIcon />
                    </div>
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  id={`faq-answer-${item.id}`}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                  aria-labelledby={`faq-question-${item.id}`}
                  role="region"
                >
                  <div className="px-6 pb-6">
                    <div className="border-t border-white/20 pt-4">
                      <div className="prose prose-invert max-w-none">
                        <p className="text-white/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                          {t(item.answerKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="glass-card p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t('ctaTitle')}
            </h3>
            <p className="text-white/80 text-lg mb-6">
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
