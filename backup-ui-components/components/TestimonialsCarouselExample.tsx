'use client';

import { useState } from 'react';
import TestimonialsCarousel from './TestimonialsCarousel';
import CreoNavbar from './CreoNavbar';

export default function TestimonialsCarouselExample() {
  const [locale, setLocale] = useState('en');

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepPurple via-primaryOrange to-deepPurple">
      <CreoNavbar 
        locale={locale} 
        onLocaleChange={handleLocaleChange} 
      />
      
      {/* Main content with some spacing for the fixed navbar */}
      <div className="pt-24">
        <TestimonialsCarousel
          locale={locale}
          autoPlay={true}
          autoPlayInterval={6000}
        />
      </div>
    </div>
  );
}
