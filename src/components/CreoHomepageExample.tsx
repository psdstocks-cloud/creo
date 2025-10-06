'use client';

import { useState } from 'react';
import CreoHomepage from './CreoHomepage';

export default function CreoHomepageExample() {
  const [locale, setLocale] = useState('en');

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    // Update document direction and language
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <CreoHomepage locale={locale} onLocaleChange={handleLocaleChange} />
  );
}
