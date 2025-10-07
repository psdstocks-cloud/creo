'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface FAQAccordionFriendlyProps {
  items?: FAQItem[];
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
  showCategories?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  className?: string;
  itemClassName?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
}

export default function FAQAccordionFriendly({
  items = [],
  allowMultiple = true,
  defaultOpenItems = [],
  showCategories = false,
  showSearch = true,
  showFilters = true,
  className = '',
  itemClassName = '',
  searchPlaceholder,
  noResultsText
}: FAQAccordionFriendlyProps) {
  const t = useTranslations('FAQFriendly');
  const [openItems, setOpenItems] = useState<string[]>(defaultOpenItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // Detect RTL layout
  useEffect(() => {
    const checkRTL = () => {
      // RTL detection logic can be added here if needed
    };
    
    checkRTL();
    window.addEventListener('resize', checkRTL);
    return () => window.removeEventListener('resize', checkRTL);
  }, []);

  // Default FAQ items if none provided
  const defaultFAQItems: FAQItem[] = [
    {
      id: 'account-creation',
      question: t('accountCreationQuestion'),
      answer: t('accountCreationAnswer'),
      category: 'account',
      isNew: false,
      isPopular: true
    },
    {
      id: 'switching-plans',
      question: t('switchingPlansQuestion'),
      answer: t('switchingPlansAnswer'),
      category: 'billing',
      isNew: false,
      isPopular: true
    },
    {
      id: 'payment-options',
      question: t('paymentOptionsQuestion'),
      answer: t('paymentOptionsAnswer'),
      category: 'billing',
      isNew: false,
      isPopular: false
    },
    {
      id: 'points-rollback',
      question: t('pointsRollbackQuestion'),
      answer: t('pointsRollbackAnswer'),
      category: 'billing',
      isNew: true,
      isPopular: false
    },
    {
      id: 'ai-image-generation',
      question: t('aiImageGenerationQuestion'),
      answer: t('aiImageGenerationAnswer'),
      category: 'features',
      isNew: true,
      isPopular: true
    },
    {
      id: 'credits-expiration',
      question: t('creditsExpirationQuestion'),
      answer: t('creditsExpirationAnswer'),
      category: 'billing',
      isNew: false,
      isPopular: false
    },
    {
      id: 'download-limits',
      question: t('downloadLimitsQuestion'),
      answer: t('downloadLimitsAnswer'),
      category: 'features',
      isNew: false,
      isPopular: false
    },
    {
      id: 'platform-support',
      question: t('platformSupportQuestion'),
      answer: t('platformSupportAnswer'),
      category: 'features',
      isNew: false,
      isPopular: true
    },
    {
      id: 'money-back-guarantee',
      question: t('moneyBackGuaranteeQuestion'),
      answer: t('moneyBackGuaranteeAnswer'),
      category: 'billing',
      isNew: false,
      isPopular: false
    },
    {
      id: 'team-collaboration',
      question: t('teamCollaborationQuestion'),
      answer: t('teamCollaborationAnswer'),
      category: 'features',
      isNew: true,
      isPopular: false
    }
  ];

  const faqItems = items.length > 0 ? items : defaultFAQItems;

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(faqItems.map(item => item.category).filter(Boolean)))];

  // Filter items based on search and category
  const filteredItems = faqItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Toggle item open/closed
  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setOpenItems(prev => 
        prev.includes(itemId) ? [] : [itemId]
      );
    }
  };

  // Check if item is open
  const isItemOpen = (itemId: string) => openItems.includes(itemId);

  // Render category badge
  const renderCategoryBadge = (category: string) => {
    const categoryLabels: Record<string, string> = {
      account: t('categoryAccount'),
      billing: t('categoryBilling'),
      features: t('categoryFeatures'),
      support: t('categorySupport')
    };

    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primaryOrange/10 text-primaryOrange rounded-full">
        {categoryLabels[category] || category}
      </span>
    );
  };

  // Render status badges
  const renderStatusBadges = (item: FAQItem) => (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      {item.isNew && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full">
          {t('newBadge')}
        </span>
      )}
      {item.isPopular && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-full">
          {t('popularBadge')}
        </span>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="glass-card p-6 rounded-2xl">
          <div className="space-y-4">
            {/* Search Bar */}
            {showSearch && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0 rtl:pr-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder || t('searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white rtl:pl-4 rtl:pr-10"
                />
              </div>
            )}

            {/* Category Filters */}
            {showFilters && categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category || 'all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-primaryOrange text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category === 'all' ? t('allCategories') : t(`category${(category || '').charAt(0).toUpperCase() + (category || '').slice(1)}`)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('noResultsTitle')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {noResultsText || t('noResultsDescription')}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`glass-card rounded-2xl overflow-hidden transition-all duration-200 ${
                isItemOpen(item.id) ? 'shadow-lg' : 'shadow-sm'
              } ${itemClassName}`}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-inset transition-all duration-200 hover:bg-white/5"
                aria-expanded={isItemOpen(item.id)}
                aria-controls={`faq-answer-${item.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4 rtl:pr-0 rtl:pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                        {item.question}
                      </h3>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse ml-4 rtl:ml-0 rtl:mr-4">
                        {item.category && renderCategoryBadge(item.category)}
                        {renderStatusBadges(item)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expand/Collapse Icon */}
                  <div className="flex-shrink-0">
                    <svg
                      className={`w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                        isItemOpen(item.id) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Answer Content */}
              <div
                id={`faq-answer-${item.id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isItemOpen(item.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="pt-4">
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer CTA */}
      <div className="glass-card p-8 rounded-2xl text-center bg-gradient-to-r from-primaryOrange/10 to-orange-600/10 border border-primaryOrange/20">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('ctaTitle')}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('ctaDescription')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-gradient-to-r from-primaryOrange to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:ring-offset-2 transition-all duration-200">
            {t('ctaButton1')}
          </button>
          <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200">
            {t('ctaButton2')}
          </button>
        </div>
      </div>
    </div>
  );
}
