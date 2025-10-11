import React, { forwardRef, useId, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface AccessibleFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

export const AccessibleForm = forwardRef<HTMLFormElement, AccessibleFormProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn('space-y-4', className)}
        role="form"
        {...props}
      >
        {children}
      </form>
    )
  }
)

AccessibleForm.displayName = 'AccessibleForm'

interface AccessibleFieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend: string
  children: React.ReactNode
  required?: boolean
}

export const AccessibleFieldset = forwardRef<HTMLFieldSetElement, AccessibleFieldsetProps>(
  ({ className, legend, children, required = false, ...props }, ref) => {
    const legendId = useId()

    return (
      <fieldset
        ref={ref}
        className={cn('space-y-2', className)}
        aria-required={required}
        {...props}
      >
        <legend id={legendId} className="text-sm font-medium text-gray-700">
          {legend}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </legend>
        <div role="group" aria-labelledby={legendId}>
          {children}
        </div>
      </fieldset>
    )
  }
)

AccessibleFieldset.displayName = 'AccessibleFieldset'

interface AccessibleLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  required?: boolean
  error?: string
  helpText?: string
}

export const AccessibleLabel = forwardRef<HTMLLabelElement, AccessibleLabelProps>(
  ({ className, children, required = false, error, helpText, ...props }, ref) => {
    const labelId = useId()
    const helpTextId = useId()
    const errorId = useId()

    return (
      <label
        ref={ref}
        id={labelId}
        className={cn(
          'block text-sm font-medium text-gray-700',
          error && 'text-red-700',
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
        {helpText && (
          <span id={helpTextId} className="block text-xs text-gray-500 mt-1">
            {helpText}
          </span>
        )}
        {error && (
          <span id={errorId} className="block text-xs text-red-600 mt-1" role="alert">
            {error}
          </span>
        )}
      </label>
    )
  }
)

AccessibleLabel.displayName = 'AccessibleLabel'

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  required?: boolean
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ className, label, error, helpText, required = false, id, ...props }, ref) => {
    const inputId = useId()
    const helpTextId = useId()
    const errorId = useId()
    const finalId = id || inputId

    return (
      <div className="space-y-1">
        {label && (
          <AccessibleLabel htmlFor={finalId} required={required} error={error} helpText={helpText}>
            {label}
          </AccessibleLabel>
        )}
        <input
          ref={ref}
          id={finalId}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
            'disabled:bg-gray-50 disabled:text-gray-500',
            error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(
            helpText && helpTextId,
            error && errorId
          )}
          required={required}
          {...props}
        />
      </div>
    )
  }
)

AccessibleInput.displayName = 'AccessibleInput'

interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helpText?: string
  required?: boolean
}

export const AccessibleTextarea = forwardRef<HTMLTextAreaElement, AccessibleTextareaProps>(
  ({ className, label, error, helpText, required = false, id, ...props }, ref) => {
    const textareaId = useId()
    const helpTextId = useId()
    const errorId = useId()
    const finalId = id || textareaId

    return (
      <div className="space-y-1">
        {label && (
          <AccessibleLabel htmlFor={finalId} required={required} error={error} helpText={helpText}>
            {label}
          </AccessibleLabel>
        )}
        <textarea
          ref={ref}
          id={finalId}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
            'disabled:bg-gray-50 disabled:text-gray-500',
            error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(
            helpText && helpTextId,
            error && errorId
          )}
          required={required}
          {...props}
        />
      </div>
    )
  }
)

AccessibleTextarea.displayName = 'AccessibleTextarea'

interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helpText?: string
  required?: boolean
  options: Array<{ value: string; label: string; disabled?: boolean }>
  placeholder?: string
}

export const AccessibleSelect = forwardRef<HTMLSelectElement, AccessibleSelectProps>(
  ({ className, label, error, helpText, required = false, id, options, placeholder, ...props }, ref) => {
    const selectId = useId()
    const helpTextId = useId()
    const errorId = useId()
    const finalId = id || selectId

    return (
      <div className="space-y-1">
        {label && (
          <AccessibleLabel htmlFor={finalId} required={required} error={error} helpText={helpText}>
            {label}
          </AccessibleLabel>
        )}
        <select
          ref={ref}
          id={finalId}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
            'disabled:bg-gray-50 disabled:text-gray-500',
            error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(
            helpText && helpTextId,
            error && errorId
          )}
          required={required}
          {...props}
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
      </div>
    )
  }
)

AccessibleSelect.displayName = 'AccessibleSelect'

interface AccessibleCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  required?: boolean
}

export const AccessibleCheckbox = forwardRef<HTMLInputElement, AccessibleCheckboxProps>(
  ({ className, label, error, helpText, required = false, id, ...props }, ref) => {
    const checkboxId = useId()
    const helpTextId = useId()
    const errorId = useId()
    const finalId = id || checkboxId

    return (
      <div className="space-y-1">
        <div className="flex items-start">
          <input
            ref={ref}
            id={finalId}
            type="checkbox"
            className={cn(
              'h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded',
              'disabled:bg-gray-50 disabled:text-gray-500',
              error && 'border-red-300 focus:ring-red-500',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={cn(
              helpText && helpTextId,
              error && errorId
            )}
            required={required}
            {...props}
          />
          {label && (
            <AccessibleLabel htmlFor={finalId} required={required} error={error} helpText={helpText} className="ml-2">
              {label}
            </AccessibleLabel>
          )}
        </div>
      </div>
    )
  }
)

AccessibleCheckbox.displayName = 'AccessibleCheckbox'

interface AccessibleRadioGroupProps {
  name: string
  label?: string
  error?: string
  helpText?: string
  required?: boolean
  options: Array<{ value: string; label: string; disabled?: boolean }>
  value?: string
  onChange?: (value: string) => void
}

export const AccessibleRadioGroup = forwardRef<HTMLDivElement, AccessibleRadioGroupProps>(
  ({ name, label, error, helpText, required = false, options, value, onChange, ...props }, ref) => {
    const groupId = useId()
    const helpTextId = useId()
    const errorId = useId()

    return (
      <div ref={ref} className="space-y-2" role="radiogroup" aria-labelledby={label ? groupId : undefined} {...props}>
        {label && (
          <div id={groupId} className="text-sm font-medium text-gray-700">
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </div>
        )}
        {helpText && (
          <div id={helpTextId} className="text-xs text-gray-500">
            {helpText}
          </div>
        )}
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={`${groupId}-${option.value}`}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange?.(option.value)}
                disabled={option.disabled}
                className={cn(
                  'h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300',
                  'disabled:bg-gray-50 disabled:text-gray-500',
                  error && 'border-red-300 focus:ring-red-500'
                )}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={cn(
                  helpText && helpTextId,
                  error && errorId
                )}
                required={required}
              />
              <label
                htmlFor={`${groupId}-${option.value}`}
                className="ml-2 text-sm text-gray-700"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {error && (
          <div id={errorId} className="text-xs text-red-600" role="alert">
            {error}
          </div>
        )}
      </div>
    )
  }
)

AccessibleRadioGroup.displayName = 'AccessibleRadioGroup'
