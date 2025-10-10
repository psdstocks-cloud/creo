'use client';

import { useState } from 'react';
import CreoNavbar from './CreoNavbar';
import ReusableHero from './ReusableHero';

export default function CreoNavbarExample() {
  const [locale, setLocale] = useState('en');

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen">
      <CreoNavbar 
        locale={locale} 
        onLocaleChange={handleLocaleChange} 
      />
      
      {/* Main content with some spacing for the fixed navbar */}
      <div className="pt-24">
        <ReusableHero
          locale={locale}
          headlineKey="creoHeadline"
          subheadlineKey="creoSubheadline"
          primaryButtonKey="creoPrimaryButton"
          secondaryButtonKey="creoSecondaryButton"
          showSocialProof={true}
          socialProofItems={{
            key1: 'socialProof1',
            key2: 'socialProof2',
            key3: 'socialProof3'
          }}
          onPrimaryClick={() => console.log('Start Free Trial clicked!')}
          onSecondaryClick={() => console.log('See How Much You\'ll Save clicked!')}
        />
      </div>
    </div>
  );
}
