'use client';

import React, { useState } from 'react';
import { useResponsiveForm } from '@/hooks/useResponsive';
import { useTranslations } from 'next-intl';

interface ResponsiveFormProps {
  children: React.ReactNode;
  className?: string;
  layout?: 'vertical' | 'horizontal' | 'grid';
  spacing?: 'sm' | 'md' | 'lg';
  onSubmit?: (e: React.FormEvent) => void;
}

export const ResponsiveForm: React.FC<ResponsiveFormProps> = ({
  children,
  className = '',
  layout = 'vertical',
  spacing = 'md',
  onSubmit,
}) => {
  const { getFormLayout } = useResponsiveForm();

  // Get form layout classes
  const getFormClasses = () => {
    const baseClasses = ['w-full'];
    
    if (layout === 'horizontal') {
      baseClasses.push(getFormLayout());
    } else if (layout === 'grid') {
      baseClasses.push('grid grid-cols-1 sm:grid-cols-2 gap-4');
    } else {
      baseClasses.push('flex flex-col space-y-4');
    }

    // Add spacing
    if (spacing === 'sm') baseClasses.push('space-y-2');
    if (spacing === 'md') baseClasses.push('space-y-4');
    if (spacing === 'lg') baseClasses.push('space-y-6');

    return baseClasses.join(' ');
  };

  return (
    <form className={`${getFormClasses()} ${className}`} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

// Responsive Input Component
interface ResponsiveInputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  id?: string;
  name?: string;
}

export const ResponsiveInput: React.FC<ResponsiveInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  className = '',
  label,
  error,
  required = false,
  disabled = false,
  autoComplete,
  id,
  name,
}) => {
  const { getInputHeight, getInputFontSize } = useResponsiveForm();

  const inputClasses = [
    'w-full',
    'px-3',
    'py-2',
    'border',
    'border-gray-300',
    'rounded-lg',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-orange-500',
    'focus:border-orange-500',
    'transition-colors',
    'duration-200',
    'disabled:bg-gray-100',
    'disabled:cursor-not-allowed',
    className,
  ].join(' ');

  const inputStyle = {
    height: getInputHeight(),
    fontSize: getInputFontSize(),
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        className={inputClasses}
        style={inputStyle}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

// Responsive Textarea Component
interface ResponsiveTextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  className?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  id?: string;
  name?: string;
}

export const ResponsiveTextarea: React.FC<ResponsiveTextareaProps> = ({
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  className = '',
  label,
  error,
  required = false,
  disabled = false,
  rows = 4,
  id,
  name,
}) => {
  const { getInputFontSize } = useResponsiveForm();

  const textareaClasses = [
    'w-full',
    'px-3',
    'py-2',
    'border',
    'border-gray-300',
    'rounded-lg',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-orange-500',
    'focus:border-orange-500',
    'transition-colors',
    'duration-200',
    'disabled:bg-gray-100',
    'disabled:cursor-not-allowed',
    'resize-vertical',
    className,
  ].join(' ');

  const textareaStyle = {
    fontSize: getInputFontSize(),
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        className={textareaClasses}
        style={textareaStyle}
        required={required}
        disabled={disabled}
        rows={rows}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

// Responsive Select Component
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ResponsiveSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  className?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
  name?: string;
}

export const ResponsiveSelect: React.FC<ResponsiveSelectProps> = ({
  options,
  value,
  onChange,
  onBlur,
  onFocus,
  className = '',
  label,
  error,
  required = false,
  disabled = false,
  placeholder,
  id,
  name,
}) => {
  const { getInputHeight, getInputFontSize } = useResponsiveForm();

  const selectClasses = [
    'w-full',
    'px-3',
    'py-2',
    'border',
    'border-gray-300',
    'rounded-lg',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-orange-500',
    'focus:border-orange-500',
    'transition-colors',
    'duration-200',
    'disabled:bg-gray-100',
    'disabled:cursor-not-allowed',
    'appearance-none',
    'bg-white',
    'bg-no-repeat',
    'bg-right',
    'bg-[length:16px_16px]',
    'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")]',
    className,
  ].join(' ');

  const selectStyle = {
    height: getInputHeight(),
    fontSize: getInputFontSize(),
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        className={selectClasses}
        style={selectStyle}
        required={required}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

// Responsive Button Component
interface ResponsiveButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
  icon,
  iconPosition = 'left',
}) => {
  const { isMobile } = useResponsive();

  // Get button classes
  const getButtonClasses = () => {
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'rounded-lg',
      'transition-all',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
    ];

    // Size classes
    if (size === 'sm') {
      baseClasses.push('px-3', 'py-1.5', 'text-sm');
    } else if (size === 'lg') {
      baseClasses.push('px-6', 'py-3', 'text-lg');
    } else {
      baseClasses.push('px-4', 'py-2', 'text-base');
    }

    // Variant classes
    if (variant === 'primary') {
      baseClasses.push('bg-orange-600', 'text-white', 'hover:bg-orange-700', 'focus:ring-orange-500');
    } else if (variant === 'secondary') {
      baseClasses.push('bg-gray-600', 'text-white', 'hover:bg-gray-700', 'focus:ring-gray-500');
    } else if (variant === 'outline') {
      baseClasses.push('border', 'border-gray-300', 'text-gray-700', 'hover:bg-gray-50', 'focus:ring-gray-500');
    } else if (variant === 'ghost') {
      baseClasses.push('text-gray-700', 'hover:bg-gray-100', 'focus:ring-gray-500');
    } else if (variant === 'danger') {
      baseClasses.push('bg-red-600', 'text-white', 'hover:bg-red-700', 'focus:ring-red-500');
    }

    // Full width
    if (fullWidth) {
      baseClasses.push('w-full');
    }

    // Mobile optimizations
    if (isMobile) {
      baseClasses.push('min-h-[44px]'); // Minimum touch target
    }

    return baseClasses.join(' ');
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${getButtonClasses()} ${className}`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

// Responsive Field Group Component
interface ResponsiveFieldGroupProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  spacing?: 'sm' | 'md' | 'lg';
}

export const ResponsiveFieldGroup: React.FC<ResponsiveFieldGroupProps> = ({
  children,
  className = '',
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  spacing = 'md',
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getGridClasses = () => {
    const baseClasses = ['grid', 'gap-4'];
    
    // Responsive columns
    if (isMobile) {
      baseClasses.push(`grid-cols-${columns.mobile}`);
    } else if (isTablet) {
      baseClasses.push(`sm:grid-cols-${columns.tablet}`);
    } else {
      baseClasses.push(`md:grid-cols-${columns.desktop}`);
    }

    // Spacing
    if (spacing === 'sm') baseClasses.push('gap-2');
    if (spacing === 'md') baseClasses.push('gap-4');
    if (spacing === 'lg') baseClasses.push('gap-6');

    return baseClasses.join(' ');
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveForm;
