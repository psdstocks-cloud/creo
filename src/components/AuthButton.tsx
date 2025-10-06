'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import AuthModal from './AuthModal';

interface AuthButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  initialMode?: 'signin' | 'signup';
  onSuccess?: (user: any) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function AuthButton({
  variant = 'primary',
  size = 'md',
  initialMode = 'signin',
  onSuccess,
  className = '',
  children,
}: AuthButtonProps) {
  const t = useTranslations('Auth');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const variantClasses = {
      primary: 'bg-gradient-to-r from-primaryOrange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-sm focus:ring-primaryOrange',
      secondary: 'bg-glassWhite backdrop-blur-glass border border-white/20 text-gray-700 dark:text-gray-300 hover:bg-white/20 focus:ring-primaryOrange',
      outline: 'border border-primaryOrange text-primaryOrange hover:bg-primaryOrange hover:text-white focus:ring-primaryOrange',
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  const getButtonText = () => {
    if (children) return children;
    return initialMode === 'signin' ? t('signInButton') : t('signUpButton');
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={getButtonClasses()}
      >
        {getButtonText()}
      </button>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialMode={initialMode}
        onSuccess={onSuccess}
      />
    </>
  );
}
