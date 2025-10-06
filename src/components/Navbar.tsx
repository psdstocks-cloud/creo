'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface NavbarProps {
  locale: string;
  onLocaleChange: (locale: string) => void;
}

export default function Navbar({ locale, onLocaleChange }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('Navbar');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageChange = (newLocale: string) => {
    onLocaleChange(newLocale);
    setIsMenuOpen(false);
  };

  const isRTL = locale === 'ar';

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 ${
        isRTL ? 'rtl' : 'ltr'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white">
              {t('logo')}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 rtl:space-x-reverse">
              <a
                href="#home"
                className="text-white hover:text-primaryOrange px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {t('home')}
              </a>
              <a
                href="#about"
                className="text-white hover:text-primaryOrange px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {t('about')}
              </a>
              <a
                href="#services"
                className="text-white hover:text-primaryOrange px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {t('services')}
              </a>
              <a
                href="#contact"
                className="text-white hover:text-primaryOrange px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {t('contact')}
              </a>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => handleLanguageChange(locale === 'en' ? 'ar' : 'en')}
                className="flex items-center space-x-2 rtl:space-x-reverse text-white hover:text-primaryOrange transition-colors duration-200"
              >
                <span className="text-sm font-medium">
                  {locale === 'en' ? 'العربية' : 'English'}
                </span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
              </button>
            </div>

            {/* Login Button */}
            <button className="bg-primaryOrange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl">
              {t('login')}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-primaryOrange inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200"
            >
              <span className="sr-only">{t('openMenu')}</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-glassWhite/50 backdrop-blur-glass rounded-lg mt-2">
              <a
                href="#home"
                className="text-white hover:text-primaryOrange block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home')}
              </a>
              <a
                href="#about"
                className="text-white hover:text-primaryOrange block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('about')}
              </a>
              <a
                href="#services"
                className="text-white hover:text-primaryOrange block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('services')}
              </a>
              <a
                href="#contact"
                className="text-white hover:text-primaryOrange block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('contact')}
              </a>
              
              {/* Mobile Language Switcher */}
              <div className="px-3 py-2">
                <button
                  onClick={() => handleLanguageChange(locale === 'en' ? 'ar' : 'en')}
                  className="flex items-center space-x-2 rtl:space-x-reverse text-white hover:text-primaryOrange transition-colors duration-200"
                >
                  <span className="text-base font-medium">
                    {locale === 'en' ? 'العربية' : 'English'}
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile Login Button */}
              <div className="px-3 py-2">
                <button className="w-full bg-primaryOrange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl">
                  {t('login')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
