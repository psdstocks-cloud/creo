'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface PricingRollbackInfoProps {
  variant?: 'default' | 'compact' | 'detailed';
  showIcon?: boolean;
  showTimeline?: boolean;
  className?: string;
  cardClassName?: string;
}

export default function PricingRollbackInfo({
  variant = 'default',
  showIcon = true,
  showTimeline = true,
  className = '',
  cardClassName = ''
}: PricingRollbackInfoProps) {
  const t = useTranslations('PricingRollback');


  // Timeline data
  const timelineSteps = [
    {
      id: 1,
      title: t('step1Title'),
      description: t('step1Description'),
      icon: 'calendar',
      status: 'completed'
    },
    {
      id: 2,
      title: t('step2Title'),
      description: t('step2Description'),
      icon: 'clock',
      status: 'active'
    },
    {
      id: 3,
      title: t('step3Title'),
      description: t('step3Description'),
      icon: 'check',
      status: 'pending'
    }
  ];

  // Render icon based on type
  const renderIcon = (iconType: string, className: string = '') => {
    const iconClass = `w-6 h-6 ${className}`;
    
    switch (iconType) {
      case 'calendar':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'check':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'info':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`glass-card p-4 rounded-xl ${cardClassName} ${className}`}>
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          {showIcon && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primaryOrange to-orange-600 rounded-full flex items-center justify-center">
                {renderIcon('info', 'w-4 h-4 text-white')}
              </div>
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {t('compactTitle')}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {t('compactDescription')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant
  if (variant === 'detailed') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primaryOrange to-orange-600 bg-clip-text text-transparent mb-4">
            {t('detailedTitle')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('detailedSubtitle')}
          </p>
        </div>

        {/* Main Info Card */}
        <div className={`glass-card p-8 rounded-2xl ${cardClassName}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Policy Information */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-primaryOrange to-orange-600 rounded-xl flex items-center justify-center">
                    {renderIcon('info', 'w-6 h-6 text-white')}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('policyTitle')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t('policyDescription')}
                  </p>
                </div>
              </div>

              {/* Key Points */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('keyPointsTitle')}
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="flex-shrink-0 w-2 h-2 bg-primaryOrange rounded-full mt-2"></div>
                    <span className="text-gray-600 dark:text-gray-300">{t('keyPoint1')}</span>
                  </li>
                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="flex-shrink-0 w-2 h-2 bg-primaryOrange rounded-full mt-2"></div>
                    <span className="text-gray-600 dark:text-gray-300">{t('keyPoint2')}</span>
                  </li>
                  <li className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="flex-shrink-0 w-2 h-2 bg-primaryOrange rounded-full mt-2"></div>
                    <span className="text-gray-600 dark:text-gray-300">{t('keyPoint3')}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Timeline */}
            {showTimeline && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('timelineTitle')}
                </h4>
                <div className="space-y-4">
                  {timelineSteps.map((step) => (
                    <div key={step.id} className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'completed' 
                          ? 'bg-green-500' 
                          : step.status === 'active'
                          ? 'bg-primaryOrange'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        {renderIcon(step.icon, 'w-4 h-4 text-white')}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 dark:text-white">
                          {step.title}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Warning Card */}
        <div className="glass-card p-6 rounded-xl border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="flex-shrink-0">
              {renderIcon('warning', 'w-6 h-6 text-yellow-600')}
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                {t('warningTitle')}
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {t('warningDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`glass-card p-6 rounded-2xl ${cardClassName} ${className}`}>
      {/* Header */}
      <div className="flex items-start space-x-4 rtl:space-x-reverse mb-6">
        {showIcon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-r from-primaryOrange to-orange-600 rounded-xl flex items-center justify-center">
              {renderIcon('info', 'w-6 h-6 text-white')}
            </div>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primaryOrange to-orange-600 bg-clip-text text-transparent mb-2">
            {t('title')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-primaryOrange/10 to-orange-600/10 p-4 rounded-lg border border-primaryOrange/20">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            {t('rollbackTitle')}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('rollbackDescription')}
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
            {t('resetTitle')}
          </h4>
          <p className="text-sm text-red-700 dark:text-red-300">
            {t('resetDescription')}
          </p>
        </div>
      </div>

      {/* Timeline */}
      {showTimeline && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            {t('timelineTitle')}
          </h4>
          <div className="space-y-4">
            {timelineSteps.map((step) => (
              <div key={step.id} className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  step.status === 'completed' 
                    ? 'bg-green-500' 
                    : step.status === 'active'
                    ? 'bg-primaryOrange'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {renderIcon(step.icon, 'w-4 h-4 text-white')}
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {t('footerNote')}
        </p>
      </div>
    </div>
  );
}
