'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { 
  signUpSchema, 
  signInSchema, 
  resetPasswordSchema, 
  updatePasswordSchema,
  getErrorMessage,
  getFieldError 
} from '../lib/validation';
import { auth } from '../lib/supabase';
import { AUTH_PROVIDERS } from '../types/auth';
import { 
  SignUpFormData, 
  SignInFormData, 
  ResetPasswordFormData, 
  UpdatePasswordFormData,
  AuthError 
} from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'reset' | 'update';
  onSuccess?: (user: any) => void;
  className?: string;
}

type AuthMode = 'signin' | 'signup' | 'reset' | 'update';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'signin',
  onSuccess,
  className = '' 
}: AuthModalProps) {
  const t = useTranslations('Auth');
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [locale, setLocale] = useState<'en' | 'ar'>('en');

  // Form setup
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      acceptTerms: false,
    },
  });

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const updateForm = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Detect locale from document direction
  useEffect(() => {
    const isRTL = document.documentElement.dir === 'rtl';
    setLocale(isRTL ? 'ar' : 'en');
  }, []);

  // Reset forms when mode changes
  useEffect(() => {
    setError(null);
    setSuccess(null);
    signUpForm.reset();
    signInForm.reset();
    resetForm.reset();
    updateForm.reset();
  }, [mode]);

  // Handle form submissions
  const handleSignUp = async (data: SignUpFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error } = await auth.signUp(
        data.email,
        data.password,
        { full_name: data.fullName }
      );

      if (error) {
        setError({
          message: getErrorMessage(error, locale),
          code: error.message,
        });
      } else {
        setSuccess(t('accountCreatedMessage'));
        setMode('signin');
        onSuccess?.(result.user);
      }
    } catch (err: any) {
      setError({
        message: getErrorMessage(err, locale),
        code: 'unknown',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (data: SignInFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error } = await auth.signIn(data.email, data.password);

      if (error) {
        setError({
          message: getErrorMessage(error, locale),
          code: error.message,
        });
      } else {
        setSuccess(t('signInSuccessMessage'));
        onSuccess?.(result.user);
        onClose();
      }
    } catch (err: any) {
      setError({
        message: getErrorMessage(err, locale),
        code: 'unknown',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await auth.resetPassword(data.email);

      if (error) {
        setError({
          message: getErrorMessage(error, locale),
          code: error.message,
        });
      } else {
        setSuccess(t('checkEmailMessage'));
        setMode('signin');
      }
    } catch (err: any) {
      setError({
        message: getErrorMessage(err, locale),
        code: 'unknown',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (data: UpdatePasswordFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await auth.updatePassword(data.password);

      if (error) {
        setError({
          message: getErrorMessage(error, locale),
          code: error.message,
        });
      } else {
        setSuccess(t('passwordUpdatedMessage'));
        setMode('signin');
      }
    } catch (err: any) {
      setError({
        message: getErrorMessage(err, locale),
        code: 'unknown',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'facebook' | 'github' | 'twitter') => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await auth.signInWithProvider(provider);

      if (error) {
        setError({
          message: getErrorMessage(error, locale),
          code: error.message,
        });
      }
    } catch (err: any) {
      setError({
        message: getErrorMessage(err, locale),
        code: 'unknown',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin': return t('signInTitle');
      case 'signup': return t('signUpTitle');
      case 'reset': return t('resetPasswordTitle');
      case 'update': return t('updatePasswordTitle');
      default: return t('signInTitle');
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signin': return t('signInSubtitle');
      case 'signup': return t('signUpSubtitle');
      case 'reset': return t('resetPasswordSubtitle');
      case 'update': return t('updatePasswordSubtitle');
      default: return t('signInSubtitle');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md ${className}`}>
        <div className="glass-card p-8 rounded-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {getTitle()}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {getSubtitle()}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="mr-3">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setSuccess(null)}
                    className="text-green-400 hover:text-green-600"
                  >
                    <span className="sr-only">{t('close')}</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="mr-3">
                  <p className="text-sm text-red-800">{error.message}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <span className="sr-only">{t('close')}</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Social Login Buttons */}
          {mode === 'signin' || mode === 'signup' ? (
            <div className="space-y-3 mb-6">
              {AUTH_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleSocialSignIn(provider.id)}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    viewBox="0 0 24 24"
                    fill={provider.color}
                  >
                    <path d={provider.icon} />
                  </svg>
                  {mode === 'signin' ? t(`signInWith${provider.name}`) : t(`signInWith${provider.name}`)}
                </button>
              ))}
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('orDivider')}</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Forms */}
          {mode === 'signin' && (
            <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
              <div>
                <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('emailLabel')}
                </label>
                <input
                  id="signin-email"
                  type="email"
                  {...signInForm.register('email')}
                  placeholder={t('emailPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                />
                {signInForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(signInForm.formState.errors, 'email', locale)}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('passwordLabel')}
                </label>
                <input
                  id="signin-password"
                  type="password"
                  {...signInForm.register('password')}
                  placeholder={t('passwordPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                />
                {signInForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(signInForm.formState.errors, 'password', locale)}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    {...signInForm.register('rememberMe')}
                    className="h-4 w-4 text-primaryOrange focus:ring-primaryOrange border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-700 dark:text-gray-300">
                    {t('rememberMe')}
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-sm text-primaryOrange hover:text-orange-600"
                >
                  {t('forgotPassword')}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primaryOrange to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryOrange disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? t('loading') : t('signInButton')}
              </button>

              <div className="text-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {t('dontHaveAccount')}{' '}
                </span>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-sm font-medium text-primaryOrange hover:text-orange-600"
                >
                  {t('signUpLink')}
                </button>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
              <div>
                <label htmlFor="signup-fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('fullNameLabel')}
                </label>
                <input
                  id="signup-fullname"
                  type="text"
                  {...signUpForm.register('fullName')}
                  placeholder={t('fullNamePlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                />
                {signUpForm.formState.errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(signUpForm.formState.errors, 'fullName', locale)}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('emailLabel')}
                </label>
                <input
                  id="signup-email"
                  type="email"
                  {...signUpForm.register('email')}
                  placeholder={t('emailPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                />
                {signUpForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(signUpForm.formState.errors, 'email', locale)}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('passwordLabel')}
                </label>
                <input
                  id="signup-password"
                  type="password"
                  {...signUpForm.register('password')}
                  placeholder={t('passwordPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                />
                {signUpForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(signUpForm.formState.errors, 'password', locale)}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('confirmPasswordLabel')}
                </label>
                <input
                  id="signup-confirm-password"
                  type="password"
                  {...signUpForm.register('confirmPassword')}
                  placeholder={t('confirmPasswordPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                />
                {signUpForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(signUpForm.formState.errors, 'confirmPassword', locale)}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="accept-terms"
                  type="checkbox"
                  {...signUpForm.register('acceptTerms')}
                  className="h-4 w-4 text-primaryOrange focus:ring-primaryOrange border-gray-300 rounded"
                />
                <label htmlFor="accept-terms" className="mr-2 block text-sm text-gray-700 dark:text-gray-300">
                  {t('acceptTerms')}
                </label>
              </div>
              {signUpForm.formState.errors.acceptTerms && (
                <p className="text-sm text-red-600">
                  {getFieldError(signUpForm.formState.errors, 'acceptTerms', locale)}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primaryOrange to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryOrange disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? t('loading') : t('signUpButton')}
              </button>

              <div className="text-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {t('alreadyHaveAccount')}{' '}
                </span>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-sm font-medium text-primaryOrange hover:text-orange-600"
                >
                  {t('signInLink')}
                </button>
              </div>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('emailLabel')}
                </label>
                <input
                  id="reset-email"
                  type="email"
                  {...resetForm.register('email')}
                  placeholder={t('emailPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                />
                {resetForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(resetForm.formState.errors, 'email', locale)}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primaryOrange to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryOrange disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? t('loading') : t('resetPasswordButton')}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-sm font-medium text-primaryOrange hover:text-orange-600"
                >
                  {t('backToSignIn')}
                </button>
              </div>
            </form>
          )}

          {mode === 'update' && (
            <form onSubmit={updateForm.handleSubmit(handleUpdatePassword)} className="space-y-4">
              <div>
                <label htmlFor="update-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('passwordLabel')}
                </label>
                <input
                  id="update-password"
                  type="password"
                  {...updateForm.register('password')}
                  placeholder={t('passwordPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                />
                {updateForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(updateForm.formState.errors, 'password', locale)}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="update-confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('confirmPasswordLabel')}
                </label>
                <input
                  id="update-confirm-password"
                  type="password"
                  {...updateForm.register('confirmPassword')}
                  placeholder={t('confirmPasswordPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange focus:border-transparent"
                />
                {updateForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(updateForm.formState.errors, 'confirmPassword', locale)}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primaryOrange to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryOrange disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? t('loading') : t('updatePasswordButton')}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-sm font-medium text-primaryOrange hover:text-orange-600"
                >
                  {t('backToSignIn')}
                </button>
              </div>
            </form>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <span className="sr-only">{t('close')}</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
