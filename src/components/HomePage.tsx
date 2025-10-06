'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';

export default function HomePage() {
  const [locale, setLocale] = useState('en');

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    // Update document direction and language
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen">
      <Navbar locale={locale} onLocaleChange={handleLocaleChange} />
      <Hero locale={locale} />
    </div>
  );
}
