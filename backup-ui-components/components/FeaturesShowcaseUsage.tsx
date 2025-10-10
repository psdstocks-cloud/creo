'use client';

import { useState } from 'react';
import FeaturesShowcase from './FeaturesShowcase';

export default function FeaturesShowcaseUsage() {
  const [locale, setLocale] = useState('en');

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepPurple via-primaryOrange to-deepPurple">
      {/* Language Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => handleLocaleChange(locale === 'en' ? 'ar' : 'en')}
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

      <FeaturesShowcase
        locale={locale}
      />
    </div>
  );
}
