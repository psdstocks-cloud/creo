'use client';

import { useState } from 'react';
import Navbar from './Navbar';

export default function NavbarExample() {
  const [locale, setLocale] = useState('en');

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    // Here you would typically update the document direction and language
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepPurple to-primaryOrange">
      <Navbar locale={locale} onLocaleChange={handleLocaleChange} />
      
      {/* Main content with some spacing for the fixed navbar */}
      <div className="pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {locale === 'ar' ? 'مرحباً بك في كريو' : 'Welcome to Creo'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {locale === 'ar' 
              ? 'منصة تصميم متقدمة مع دعم كامل للغة العربية' 
              : 'Advanced design platform with full Arabic language support'
            }
          </p>
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              {locale === 'ar' ? 'مميزات المنصة' : 'Platform Features'}
            </h2>
            <ul className="text-left space-y-2">
              <li>• {locale === 'ar' ? 'دعم RTL كامل' : 'Full RTL Support'}</li>
              <li>• {locale === 'ar' ? 'تصميم متجاوب' : 'Responsive Design'}</li>
              <li>• {locale === 'ar' ? 'تأثيرات زجاجية جميلة' : 'Beautiful Glass Effects'}</li>
              <li>• {locale === 'ar' ? 'دعم متعدد اللغات' : 'Multi-language Support'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
