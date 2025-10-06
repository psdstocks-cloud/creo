'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '../contexts/AuthContext';
import AuthButton from './AuthButton';

interface CreoNavbarWithAuthProps {
  className?: string;
}

export default function CreoNavbarWithAuth({ className = '' }: CreoNavbarWithAuthProps) {
  const t = useTranslations('CreoNavbar');
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`glass-card backdrop-blur-glass ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primaryOrange to-orange-600 bg-clip-text text-transparent">
              {t('logo')}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 rtl:space-x-reverse">
              <a
                href="#home"
                className="text-gray-700 dark:text-gray-300 hover:text-primaryOrange px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t('home')}
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 dark:text-gray-300 hover:text-primaryOrange px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t('howItWorks')}
              </a>
              <a
                href="#pricing"
                className="text-gray-700 dark:text-gray-300 hover:text-primaryOrange px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t('pricing')}
              </a>
              <a
                href="#platforms"
                className="text-gray-700 dark:text-gray-300 hover:text-primaryOrange px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t('platforms')}
              </a>
              <a
                href="#faq"
                className="text-gray-700 dark:text-gray-300 hover:text-primaryOrange px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t('faq')}
              </a>
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primaryOrange"></div>
            ) : user ? (
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-8 h-8 bg-gradient-to-r from-primaryOrange to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </div>
                <AuthButton 
                  variant="outline" 
                  size="sm"
                  onSuccess={() => {
                    // Handle sign out or other actions
                    console.log('User action completed');
                  }}
                >
                  Dashboard
                </AuthButton>
              </div>
            ) : (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <AuthButton 
                  variant="outline" 
                  size="sm" 
                  initialMode="signin"
                >
                  {t('login')}
                </AuthButton>
                <AuthButton 
                  variant="primary" 
                  size="sm" 
                  initialMode="signup"
                >
                  {t('startTrial')}
                </AuthButton>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-primaryOrange inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primaryOrange"
              aria-expanded="false"
            >
              <span className="sr-only">{t('openMenu')}</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/10 backdrop-blur-sm rounded-lg mx-4 mb-4">
            <a
              href="#home"
              className="text-gray-700 dark:text-gray-300 hover:text-primaryOrange block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              {t('home')}
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 dark:text-gray-300 hover:text-primaryOrange block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              {t('howItWorks')}
            </a>
            <a
              href="#pricing"
              className="text-gray-700 dark:text-gray-300 hover:text-primaryOrange block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              {t('pricing')}
            </a>
            <a
              href="#platforms"
              className="text-gray-700 dark:text-gray-300 hover:text-primaryOrange block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              {t('platforms')}
            </a>
            <a
              href="#faq"
              className="text-gray-700 dark:text-gray-300 hover:text-primaryOrange block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              {t('faq')}
            </a>
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {loading ? (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primaryOrange"></div>
                </div>
              ) : user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse px-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-primaryOrange to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="px-3">
                    <AuthButton 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                    >
                      Dashboard
                    </AuthButton>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 px-3">
                  <AuthButton 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    initialMode="signin"
                  >
                    {t('login')}
                  </AuthButton>
                  <AuthButton 
                    variant="primary" 
                    size="sm"
                    className="w-full"
                    initialMode="signup"
                  >
                    {t('startTrial')}
                  </AuthButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
