'use client';

import { useState } from 'react';
import PricingTable from './PricingTable';
import CreoNavbar from './CreoNavbar';

export default function PricingTableExample() {
  const [locale, setLocale] = useState('en');

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  const handlePlanSelect = (planType: 'pay-per-download' | 'professional') => {
    console.log(`Selected plan: ${planType}`);
    // Add your plan selection logic here
    if (planType === 'pay-per-download') {
      // Redirect to pay-per-download flow
      console.log('Redirecting to pay-per-download...');
    } else {
      // Redirect to professional plan flow
      console.log('Redirecting to professional plan...');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepPurple via-primaryOrange to-deepPurple">
      <CreoNavbar 
        locale={locale} 
        onLocaleChange={handleLocaleChange} 
      />
      
      {/* Main content with some spacing for the fixed navbar */}
      <div className="pt-24">
        <PricingTable
          locale={locale}
          onPlanSelect={handlePlanSelect}
        />
      </div>
    </div>
  );
}
