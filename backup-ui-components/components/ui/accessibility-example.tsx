'use client'
import { useState } from 'react'
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage,
  StatusBadge,
  LoadingSpinner,
  SkipLink,
  Dialog,
  Button
} from './accessibility'
import { 
  Input, 
  PasswordInput, 
  Textarea, 
  Select, 
  Checkbox, 
  RadioGroup, 
  RadioOption 
} from './form-inputs'
import { ResponsiveGrid, ResponsiveStack, Container } from './responsive-grid'
import { useKeyboardNavigation, useFocusManagement } from '@/hooks/useKeyboardNavigation'

// Comprehensive Accessibility Example Component
export function AccessibilityExample() {
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    message: '',
    country: '',
    newsletter: false,
    plan: 'basic'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Focus management
  const { saveFocus, restoreFocus, trapFocus } = useFocusManagement()

  // Keyboard navigation
  useKeyboardNavigation({
    onEscape: () => setShowDialog(false),
    onEnter: () => console.log('Form submitted'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form validation logic here
    console.log('Form submitted:', formData)
  }

  const openDialog = () => {
    saveFocus()
    setShowDialog(true)
  }

  const closeDialog = () => {
    setShowDialog(false)
    restoreFocus()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <SkipLink href="#main-content" />
      
      <Container maxWidth="7xl" className="space-y-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-gradient mb-4">
            Accessibility & Experience Polish
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive accessibility components with Creo branding
          </p>
        </header>

        {/* Status Badges Demo */}
        <section className="glass-card p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Status Badges</h2>
          <div className="flex flex-wrap gap-4">
            <StatusBadge status="success">Success</StatusBadge>
            <StatusBadge status="error">Error</StatusBadge>
            <StatusBadge status="warning">Warning</StatusBadge>
            <StatusBadge status="info">Info</StatusBadge>
            <StatusBadge status="processing">Processing</StatusBadge>
          </div>
        </section>

        {/* Loading States Demo */}
        <section className="glass-card p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Loading States</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-gray-600">Small</span>
            </div>
            <div className="flex items-center gap-2">
              <LoadingSpinner size="md" />
              <span className="text-sm text-gray-600">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <LoadingSpinner size="lg" />
              <span className="text-sm text-gray-600">Large</span>
            </div>
          </div>
        </section>

        {/* Form Components Demo */}
        <section className="glass-card p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Form Components</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <FormField name="email">
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                    helperText="We'll never share your email"
                  />
                </FormControl>
                <FormMessage>{errors.email}</FormMessage>
              </FormItem>
            </FormField>

            {/* Password Input */}
            <FormField name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={errors.password}
                    helperText="Must be at least 8 characters"
                  />
                </FormControl>
                <FormMessage>{errors.password}</FormMessage>
              </FormItem>
            </FormField>

            {/* Textarea */}
            <FormField name="message">
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    error={errors.message}
                    helperText="Tell us about your project"
                    showCharCount
                    maxLength={500}
                  />
                </FormControl>
                <FormMessage>{errors.message}</FormMessage>
              </FormItem>
            </FormField>

            {/* Select */}
            <FormField name="country">
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    error={errors.country}
                    placeholder="Select your country"
                  >
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                    <option value="uk">United Kingdom</option>
                    <option value="de">Germany</option>
                    <option value="fr">France</option>
                  </Select>
                </FormControl>
                <FormMessage>{errors.country}</FormMessage>
              </FormItem>
            </FormField>

            {/* Checkbox */}
            <FormField name="newsletter">
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={formData.newsletter}
                    onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                    label="Subscribe to newsletter"
                    helperText="Get updates about new features and products"
                    error={errors.newsletter}
                  />
                </FormControl>
                <FormMessage>{errors.newsletter}</FormMessage>
              </FormItem>
            </FormField>

            {/* Radio Group */}
            <FormField name="plan">
              <FormItem>
                <FormLabel>Choose a Plan</FormLabel>
                <FormControl>
                  <RadioGroup
                    name="plan"
                    value={formData.plan}
                    onChange={(value) => setFormData({ ...formData, plan: value })}
                    error={errors.plan}
                    helperText="Select the plan that best fits your needs"
                  >
                    <RadioOption
                      value="basic"
                      label="Basic Plan"
                      description="Perfect for individuals"
                    />
                    <RadioOption
                      value="pro"
                      label="Pro Plan"
                      description="Great for small teams"
                    />
                    <RadioOption
                      value="enterprise"
                      label="Enterprise Plan"
                      description="For large organizations"
                    />
                  </RadioGroup>
                </FormControl>
                <FormMessage>{errors.plan}</FormMessage>
              </FormItem>
            </FormField>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" variant="primary" size="lg">
                Submit Form
              </Button>
              <Button type="button" variant="secondary" onClick={openDialog}>
                Open Dialog
              </Button>
            </div>
          </form>
        </section>

        {/* Responsive Grid Demo */}
        <section className="glass-card p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Responsive Grid</h2>
          <ResponsiveGrid
            cols={{ default: 1, sm: 2, md: 3, lg: 4 }}
            gap={4}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <h3 className="font-semibold text-gray-900">Item {i + 1}</h3>
                <p className="text-sm text-gray-600">Responsive grid item</p>
              </div>
            ))}
          </ResponsiveGrid>
        </section>

        {/* Responsive Stack Demo */}
        <section className="glass-card p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Responsive Stack</h2>
          <ResponsiveStack
            direction={{ default: 'col', md: 'row' }}
            spacing={4}
            align="center"
            justify="between"
          >
            <div className="glass-card p-4 flex-1">
              <h3 className="font-semibold text-gray-900">Stack Item 1</h3>
              <p className="text-sm text-gray-600">Responsive stack item</p>
            </div>
            <div className="glass-card p-4 flex-1">
              <h3 className="font-semibold text-gray-900">Stack Item 2</h3>
              <p className="text-sm text-gray-600">Responsive stack item</p>
            </div>
            <div className="glass-card p-4 flex-1">
              <h3 className="font-semibold text-gray-900">Stack Item 3</h3>
              <p className="text-sm text-gray-600">Responsive stack item</p>
            </div>
          </ResponsiveStack>
        </section>
      </Container>

      {/* Accessible Dialog */}
      <Dialog
        open={showDialog}
        onClose={closeDialog}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <div className="space-y-4">
          <h2 id="dialog-title" className="text-xl font-semibold text-gray-900">
            Accessible Dialog
          </h2>
          <p id="dialog-description" className="text-gray-600">
            This is an accessible dialog with proper ARIA attributes and focus management.
          </p>
          <div className="flex gap-4">
            <Button variant="primary" onClick={closeDialog}>
              Confirm
            </Button>
            <Button variant="secondary" onClick={closeDialog}>
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
