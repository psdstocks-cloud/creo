'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/components/auth/AuthProvider'
import { useToastHelpers } from '@/components/ui/Toast'
import { FormField, PasswordStrength } from '@/components/ui/FormField'
import { BrandButton } from '@/components/ui/BrandButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  SparklesIcon, 
  PhotoIcon, 
  CpuChipIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, loading, user } = useAuth()
  const { success, error: showError } = useToastHelpers()
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<{
    email: string, password: string, confirm: string
  }>()

  // For live password confirmation
  const password = watch('password')

  // Redirect if already logged in
  if (user) {
    router.push('/dashboard')
    return null
  }

  const onSubmit = async (data: { email: string, password: string, confirm: string }) => {
    setSubmitting(true)
    
    // Client-side validation
    if (data.password !== data.confirm) {
      showError('Error', 'Passwords do not match.')
      setSubmitting(false)
      return
    }
    
    if (data.password.length < 8) {
      showError('Error', 'Password must be at least 8 characters.')
      setSubmitting(false)
      return
    }

    try {
      const { error } = await signUp({ email: data.email, password: data.password })
      
      if (!error) {
        success('Account created!', 'Check your email to verify and log in.')
        // Auto-redirect to sign-in after a delay
        setTimeout(() => router.push('/auth/signin'), 2000)
      } else {
        showError('Signup Error', error.message)
      }
    } catch {
      showError('Error', 'An unexpected error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const features = [
    {
      icon: <PhotoIcon className="h-6 w-6" />,
      title: "Stock Media Search",
      description: "Access millions of high-quality images and videos"
    },
    {
      icon: <CpuChipIcon className="h-6 w-6" />,
      title: "AI Generation",
      description: "Create custom content with advanced AI tools"
    },
    {
      icon: <SparklesIcon className="h-6 w-6" />,
      title: "Smart Workflow",
      description: "Streamline your creative process with intelligent tools"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Creative Director",
      content: "Creo has revolutionized our content creation workflow. The AI features are incredible!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Freelance Designer",
      content: "The stock media search is lightning fast and the quality is outstanding.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left Side - Hero Visual */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
            <div className="max-w-md">
              <h1 className="text-4xl font-bold mb-6">
                Join thousands of creators building amazing content
              </h1>
              <p className="text-xl text-orange-100 mb-8">
                Access the world's largest collection of stock media and AI-powered generation tools.
              </p>
              
              {/* Features */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-orange-100 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonials */}
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm mb-2">"{testimonial.content}"</p>
                    <div className="text-xs text-orange-200">
                      <span className="font-semibold">{testimonial.name}</span> • {testimonial.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-orange-300/20 rounded-full blur-lg"></div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 lg:px-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600">
                Join Creo to access stock media & AI generation
              </p>
            </div>

            <GlassCard variant="solid" padding="lg" className="shadow-xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
                {/* Email */}
                <FormField
                  label="Email"
                  type="email"
                  placeholder="you@email.com"
                  autoFocus
                  autoComplete="email"
                  {...register('email', { 
                    required: 'Email is required', 
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  error={errors.email?.message}
                  disabled={submitting || loading}
                />
                
                {/* Password */}
                <FormField
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  {...register('password', { 
                    required: 'Password is required', 
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  error={errors.password?.message}
                  disabled={submitting || loading}
                />
                
                {/* Password Strength */}
                {password && <PasswordStrength password={password} />}
                
                {/* Confirm Password */}
                <FormField
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat your password"
                  {...register('confirm', { 
                    required: 'Please confirm your password', 
                    validate: (value) => value === password || "Passwords do not match"
                  })}
                  error={errors.confirm?.message}
                  disabled={submitting || loading}
                />
                
                {/* Submit Button */}
                <BrandButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={submitting || loading}
                  disabled={submitting || loading}
                >
                  {submitting || loading ? 'Creating Account...' : 'Create Account'}
                </BrandButton>
              </form>
              
              {/* Sign In Link */}
              <div className="mt-6 text-center text-sm">
                Already have an account?{' '}
                <Link
                  href="/auth/signin"
                  className="font-semibold text-orange-600 hover:text-purple-600 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </GlassCard>
            
            {/* Terms and Privacy */}
            <div className="text-xs text-center text-gray-500 mt-6">
              By signing up, you agree to the{' '}
              <Link href="/terms" className="underline hover:text-gray-700 transition-colors">
                Terms of Service
              </Link>{' '}
              &{' '}
              <Link href="/privacy" className="underline hover:text-gray-700 transition-colors">
                Privacy Policy
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
