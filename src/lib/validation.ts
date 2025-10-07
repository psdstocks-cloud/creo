import { z } from 'zod';

// Sign up validation schema
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Sign in validation schema
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

// Reset password validation schema
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

// Update password validation schema
export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Error message mapping for different languages
export const getErrorMessage = (error: unknown, locale: 'en' | 'ar' = 'en'): string => {
  const errorMessages: Record<string, { en: string; ar: string }> = {
    'Invalid login credentials': {
      en: 'Invalid email or password',
      ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    },
    'Email not confirmed': {
      en: 'Please check your email and click the confirmation link',
      ar: 'يرجى التحقق من بريدك الإلكتروني والنقر على رابط التأكيد',
    },
    'User already registered': {
      en: 'An account with this email already exists',
      ar: 'يوجد حساب بهذا البريد الإلكتروني بالفعل',
    },
    'Password should be at least 6 characters': {
      en: 'Password must be at least 6 characters',
      ar: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    },
    'Invalid email': {
      en: 'Please enter a valid email address',
      ar: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    },
    'Signup is disabled': {
      en: 'New account registration is currently disabled',
      ar: 'تسجيل الحسابات الجديدة معطل حالياً',
    },
    'Email rate limit exceeded': {
      en: 'Too many requests. Please try again later',
      ar: 'طلبات كثيرة جداً. يرجى المحاولة لاحقاً',
    },
    'Network error': {
      en: 'Network error. Please check your connection',
      ar: 'خطأ في الشبكة. يرجى التحقق من اتصالك',
    },
  };

  const errorObj = error as { message?: string; code?: string };
  const message = errorMessages[errorObj.message || ''] || errorMessages[errorObj.code || ''] || {
    en: errorObj.message || 'An error occurred',
    ar: errorObj.message || 'حدث خطأ',
  };

  return typeof message === 'string' ? message : message[locale];
};

// Form field error mapping
export const getFieldError = (errors: unknown, field: string, locale: 'en' | 'ar' = 'en'): string | undefined => {
  const errorsObj = errors as Record<string, unknown>;
  const error = errorsObj[field];
  if (!error) return undefined;

  const errorMessages: Record<string, { en: string; ar: string }> = {
    'required': {
      en: 'This field is required',
      ar: 'هذا الحقل مطلوب',
    },
    'email': {
      en: 'Please enter a valid email address',
      ar: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    },
    'min': {
      en: `Minimum length is ${(error as { min?: number }).min || 0} characters`,
      ar: `الحد الأدنى للطول هو ${(error as { min?: number }).min || 0} أحرف`,
    },
    'max': {
      en: `Maximum length is ${(error as { max?: number }).max || 0} characters`,
      ar: `الحد الأقصى للطول هو ${(error as { max?: number }).max || 0} أحرف`,
    },
  };

  const errorObj = error as { type?: string; message?: string };
  const message = errorMessages[errorObj.type || ''] || {
    en: errorObj.message || 'Invalid input',
    ar: errorObj.message || 'إدخال غير صحيح',
  };

  return typeof message === 'string' ? message : message[locale];
};
