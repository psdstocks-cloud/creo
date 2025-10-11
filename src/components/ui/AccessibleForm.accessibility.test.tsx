import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/test-utils/accessibility'
import {
  AccessibleForm,
  AccessibleFieldset,
  AccessibleLabel,
  AccessibleInput,
  AccessibleTextarea,
  AccessibleSelect,
  AccessibleCheckbox,
  AccessibleRadioGroup,
} from './AccessibleForm'

describe('AccessibleForm Components', () => {
  describe('AccessibleForm', () => {
    it('should be accessible', async () => {
      const { container } = render(
        <AccessibleForm>
          <AccessibleInput label="Name" />
          <AccessibleInput label="Email" type="email" />
        </AccessibleForm>
      )
      await testA11y(container)
    })

    it('should support keyboard navigation', () => {
      const { container } = render(
        <AccessibleForm>
          <AccessibleInput label="Name" />
          <AccessibleInput label="Email" type="email" />
        </AccessibleForm>
      )
      testKeyboardNavigation(container)
    })

    it('should have proper focus management', () => {
      const { container } = render(
        <AccessibleForm>
          <AccessibleInput label="Name" />
          <AccessibleInput label="Email" type="email" />
        </AccessibleForm>
      )
      testFocusManagement(container)
    })

    it('should announce form state changes to screen readers', () => {
      const { container } = render(
        <AccessibleForm>
          <AccessibleInput label="Name" />
          <AccessibleInput label="Email" type="email" />
        </AccessibleForm>
      )
      testScreenReader(container)
    })
  })

  describe('AccessibleFieldset', () => {
    it('should be accessible', async () => {
      const { container } = render(
        <AccessibleFieldset legend="Personal Information">
          <AccessibleInput label="Name" />
          <AccessibleInput label="Email" type="email" />
        </AccessibleFieldset>
      )
      await testA11y(container)
    })

    it('should have proper ARIA attributes', () => {
      render(
        <AccessibleFieldset legend="Personal Information" required>
          <AccessibleInput label="Name" />
        </AccessibleFieldset>
      )
      
      const fieldset = screen.getByRole('group')
      expect(fieldset).toHaveAttribute('aria-required', 'true')
    })

    it('should have proper legend association', () => {
      render(
        <AccessibleFieldset legend="Personal Information">
          <AccessibleInput label="Name" />
        </AccessibleFieldset>
      )
      
      const fieldset = screen.getByRole('group')
      const legend = screen.getByText('Personal Information')
      
      expect(fieldset).toHaveAttribute('aria-labelledby', legend.id)
    })
  })

  describe('AccessibleLabel', () => {
    it('should be accessible', async () => {
      const { container } = render(
        <AccessibleLabel htmlFor="test-input">Test Label</AccessibleLabel>
      )
      await testA11y(container)
    })

    it('should have proper association with input', () => {
      render(
        <div>
          <AccessibleLabel htmlFor="test-input">Test Label</AccessibleLabel>
          <input id="test-input" />
        </div>
      )
      
      const label = screen.getByText('Test Label')
      const input = screen.getByRole('textbox')
      
      expect(label).toHaveAttribute('for', 'test-input')
      expect(input).toHaveAttribute('id', 'test-input')
    })

    it('should show required indicator', () => {
      render(<AccessibleLabel required>Test Label</AccessibleLabel>)
      
      const requiredIndicator = screen.getByText('*')
      expect(requiredIndicator).toHaveAttribute('aria-label', 'required')
    })

    it('should show error state', () => {
      render(<AccessibleLabel error="This field is required">Test Label</AccessibleLabel>)
      
      const error = screen.getByText('This field is required')
      expect(error).toHaveAttribute('role', 'alert')
    })

    it('should show help text', () => {
      render(<AccessibleLabel helpText="Enter your full name">Test Label</AccessibleLabel>)
      
      const helpText = screen.getByText('Enter your full name')
      expect(helpText).toBeInTheDocument()
    })
  })

  describe('AccessibleInput', () => {
    it('should be accessible', async () => {
      const { container } = render(<AccessibleInput label="Name" />)
      await testA11y(container)
    })

    it('should support keyboard navigation', () => {
      const { container } = render(<AccessibleInput label="Name" />)
      testKeyboardNavigation(container)
    })

    it('should have proper ARIA attributes', () => {
      render(<AccessibleInput label="Name" required error="This field is required" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('required')
    })

    it('should have proper error association', () => {
      render(<AccessibleInput label="Name" error="This field is required" />)
      
      const input = screen.getByRole('textbox')
      const error = screen.getByText('This field is required')
      
      expect(input).toHaveAttribute('aria-describedby', error.id)
    })

    it('should have proper help text association', () => {
      render(<AccessibleInput label="Name" helpText="Enter your full name" />)
      
      const input = screen.getByRole('textbox')
      const helpText = screen.getByText('Enter your full name')
      
      expect(input).toHaveAttribute('aria-describedby', helpText.id)
    })

    it('should support different input types', () => {
      render(<AccessibleInput label="Email" type="email" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('should handle disabled state', () => {
      render(<AccessibleInput label="Name" disabled />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })
  })

  describe('AccessibleTextarea', () => {
    it('should be accessible', async () => {
      const { container } = render(<AccessibleTextarea label="Message" />)
      await testA11y(container)
    })

    it('should support keyboard navigation', () => {
      const { container } = render(<AccessibleTextarea label="Message" />)
      testKeyboardNavigation(container)
    })

    it('should have proper ARIA attributes', () => {
      render(<AccessibleTextarea label="Message" required error="This field is required" />)
      
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
      expect(textarea).toHaveAttribute('required')
    })

    it('should handle multiline input', () => {
      render(<AccessibleTextarea label="Message" rows={4} />)
      
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '4')
    })
  })

  describe('AccessibleSelect', () => {
    it('should be accessible', async () => {
      const { container } = render(
        <AccessibleSelect
          label="Country"
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
            { value: 'mx', label: 'Mexico' },
          ]}
        />
      )
      await testA11y(container)
    })

    it('should support keyboard navigation', () => {
      const { container } = render(
        <AccessibleSelect
          label="Country"
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
          ]}
        />
      )
      testKeyboardNavigation(container)
    })

    it('should have proper ARIA attributes', () => {
      render(
        <AccessibleSelect
          label="Country"
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
          ]}
          required
          error="Please select a country"
        />
      )
      
      const select = screen.getByRole('combobox')
      expect(select).toHaveAttribute('aria-invalid', 'true')
      expect(select).toHaveAttribute('required')
    })

    it('should handle option selection', () => {
      const handleChange = jest.fn()
      render(
        <AccessibleSelect
          label="Country"
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
          ]}
          onChange={handleChange}
        />
      )
      
      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'us' } })
      
      expect(handleChange).toHaveBeenCalled()
    })

    it('should handle disabled options', () => {
      render(
        <AccessibleSelect
          label="Country"
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada', disabled: true },
          ]}
        />
      )
      
      const select = screen.getByRole('combobox')
      const options = select.querySelectorAll('option')
      
      expect(options[1]).toHaveAttribute('disabled')
    })
  })

  describe('AccessibleCheckbox', () => {
    it('should be accessible', async () => {
      const { container } = render(<AccessibleCheckbox label="I agree to the terms" />)
      await testA11y(container)
    })

    it('should support keyboard navigation', () => {
      const { container } = render(<AccessibleCheckbox label="I agree to the terms" />)
      testKeyboardNavigation(container)
    })

    it('should have proper ARIA attributes', () => {
      render(<AccessibleCheckbox label="I agree to the terms" required error="You must agree" />)
      
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-invalid', 'true')
      expect(checkbox).toHaveAttribute('required')
    })

    it('should handle checked state', () => {
      render(<AccessibleCheckbox label="I agree to the terms" defaultChecked />)
      
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })

    it('should handle indeterminate state', () => {
      render(<AccessibleCheckbox label="Select all" indeterminate />)
      
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    })
  })

  describe('AccessibleRadioGroup', () => {
    it('should be accessible', async () => {
      const { container } = render(
        <AccessibleRadioGroup
          name="size"
          label="Size"
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
          ]}
        />
      )
      await testA11y(container)
    })

    it('should support keyboard navigation', () => {
      const { container } = render(
        <AccessibleRadioGroup
          name="size"
          label="Size"
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
          ]}
        />
      )
      testKeyboardNavigation(container)
    })

    it('should have proper ARIA attributes', () => {
      render(
        <AccessibleRadioGroup
          name="size"
          label="Size"
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
          ]}
          required
          error="Please select a size"
        />
      )
      
      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toHaveAttribute('aria-labelledby')
    })

    it('should handle radio selection', () => {
      const handleChange = jest.fn()
      render(
        <AccessibleRadioGroup
          name="size"
          label="Size"
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
          ]}
          onChange={handleChange}
        />
      )
      
      const smallRadio = screen.getByLabelText('Small')
      fireEvent.click(smallRadio)
      
      expect(handleChange).toHaveBeenCalledWith('small')
    })

    it('should handle disabled options', () => {
      render(
        <AccessibleRadioGroup
          name="size"
          label="Size"
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium', disabled: true },
          ]}
        />
      )
      
      const mediumRadio = screen.getByLabelText('Medium')
      expect(mediumRadio).toBeDisabled()
    })
  })

  describe('Form Validation', () => {
    it('should announce validation errors to screen readers', async () => {
      render(
        <AccessibleForm>
          <AccessibleInput label="Name" error="This field is required" />
        </AccessibleForm>
      )
      
      const input = screen.getByRole('textbox')
      const error = screen.getByText('This field is required')
      
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(error).toHaveAttribute('role', 'alert')
    })

    it('should handle multiple validation errors', () => {
      render(
        <AccessibleForm>
          <AccessibleInput label="Name" error="Name is required" />
          <AccessibleInput label="Email" error="Email is invalid" />
        </AccessibleForm>
      )
      
      const nameError = screen.getByText('Name is required')
      const emailError = screen.getByText('Email is invalid')
      
      expect(nameError).toHaveAttribute('role', 'alert')
      expect(emailError).toHaveAttribute('role', 'alert')
    })

    it('should handle form submission with validation', async () => {
      const handleSubmit = jest.fn()
      render(
        <AccessibleForm onSubmit={handleSubmit}>
          <AccessibleInput label="Name" required />
          <AccessibleInput label="Email" type="email" required />
        </AccessibleForm>
      )
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled()
      })
    })
  })

  describe('Form Accessibility Features', () => {
    it('should have proper color contrast', () => {
      const { container } = render(
        <AccessibleForm>
          <AccessibleInput label="Name" />
          <AccessibleInput label="Email" type="email" />
        </AccessibleForm>
      )
      testColorContrast(container)
    })

    it('should support screen reader navigation', () => {
      const { container } = render(
        <AccessibleForm>
          <AccessibleInput label="Name" />
          <AccessibleInput label="Email" type="email" />
        </AccessibleForm>
      )
      testScreenReader(container)
    })

    it('should handle focus management in complex forms', () => {
      const { container } = render(
        <AccessibleForm>
          <AccessibleFieldset legend="Personal Information">
            <AccessibleInput label="First Name" />
            <AccessibleInput label="Last Name" />
          </AccessibleFieldset>
          <AccessibleFieldset legend="Contact Information">
            <AccessibleInput label="Email" type="email" />
            <AccessibleInput label="Phone" type="tel" />
          </AccessibleFieldset>
        </AccessibleForm>
      )
      testFocusManagement(container)
    })
  })
})
