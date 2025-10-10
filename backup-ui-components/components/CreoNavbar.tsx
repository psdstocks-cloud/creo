'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface CreoNavbarProps {
  locale: string;
  onLocaleChange: (locale: string) => void;
  className?: string;
}

export default function CreoNavbar({ locale, onLocaleChange, className = '' }: CreoNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('CreoNavbar');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageChange = (newLocale: string) => {
    onLocaleChange(newLocale);
    setIsMenuOpen(false);
  };

  const isRTL = locale === 'ar';

  // Geometric minimal icons
  const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const HowItWorksIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );

  const PricingIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );

  const PlatformsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  const FAQIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const LoginIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  );

  const TrialIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );

  const LanguageIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  );

  const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const menuItems = [
    { key: 'home', icon: HomeIcon, href: '#home' },
    { key: 'howItWorks', icon: HowItWorksIcon, href: '#how-it-works' },
    { key: 'pricing', icon: PricingIcon, href: '#pricing' },
    { key: 'platforms', icon: PlatformsIcon, href: '#platforms' },
    { key: 'faq', icon: FAQIcon, href: '#faq' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 ${className} ${
        isRTL ? 'rtl' : 'ltr'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-r from-primaryOrange to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                {t('logo')}
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-1 rtl:space-x-reverse">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    className="group flex items-center space-x-2 rtl:space-x-reverse text-white hover:text-primaryOrange px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
                  >
                    <IconComponent />
                    <span>{t(item.key)}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => handleLanguageChange(locale === 'en' ? 'ar' : 'en')}
                className="group flex items-center space-x-2 rtl:space-x-reverse text-white hover:text-primaryOrange transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <LanguageIcon />
                <span className="text-sm font-medium">
                  {locale === 'en' ? 'العربية' : 'English'}
                </span>
              </button>
            </div>

            {/* Login Button */}
            <button className="group flex items-center space-x-2 rtl:space-x-reverse text-white hover:text-primaryOrange px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10">
              <LoginIcon />
              <span>{t('login')}</span>
            </button>

            {/* Start Free Trial Button */}
            <button className="bg-gradient-to-r from-primaryOrange to-orange-500 hover:from-orange-500 hover:to-primaryOrange text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2 rtl:space-x-reverse">
              <TrialIcon />
              <span>{t('startTrial')}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-primaryOrange inline-flex items-center justify-center p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
            >
              <span className="sr-only">{t('openMenu')}</span>
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-glassWhite/50 backdrop-blur-glass rounded-lg mt-2">
              {/* Mobile Menu Items */}
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    className="group flex items-center space-x-3 rtl:space-x-reverse text-white hover:text-primaryOrange block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent />
                    <span>{t(item.key)}</span>
                  </a>
                );
              })}
              
              {/* Mobile Language Switcher */}
              <div className="px-3 py-2">
                <button
                  onClick={() => handleLanguageChange(locale === 'en' ? 'ar' : 'en')}
                  className="group flex items-center space-x-3 rtl:space-x-reverse text-white hover:text-primaryOrange transition-all duration-200 w-full"
                >
                  <LanguageIcon />
                  <span className="text-base font-medium">
                    {locale === 'en' ? 'العربية' : 'English'}
                  </span>
                </button>
              </div>

              {/* Mobile Login Button */}
              <div className="px-3 py-2">
                <button className="group flex items-center space-x-3 rtl:space-x-reverse text-white hover:text-primaryOrange transition-all duration-200 w-full">
                  <LoginIcon />
                  <span className="text-base font-medium">{t('login')}</span>
                </button>
              </div>

              {/* Mobile Start Free Trial Button */}
              <div className="px-3 py-2">
                <button className="w-full bg-gradient-to-r from-primaryOrange to-orange-500 hover:from-orange-500 hover:to-primaryOrange text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <TrialIcon />
                  <span>{t('startTrial')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
