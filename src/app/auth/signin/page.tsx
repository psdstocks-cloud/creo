'use client'
import { useAuth } from '@/components/auth/AuthProvider'
import { DemoLogin } from '@/components/auth/DemoLogin'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { FormField } from '@/components/ui/FormField'
import { BrandButton } from '@/components/ui/BrandButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  SparklesIcon, 
  PhotoIcon, 
  CpuChipIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

function SignInContent() {
  const { signIn, loading, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<{email:string, password:string}>()

  async function onSubmit(data: {email:string, password:string}) {
    setError(null)
    const { error } = await signIn(data)
    if (error) {
      setError(error.message)
    } else {
      router.push(redirectTo)
    }
  }
  
  if (user) { 
    router.push(redirectTo)
    return null 
  }

  const features = [
    {
      icon: <PhotoIcon className="h-5 w-5" />,
      title: "Stock Media",
      description: "Millions of high-quality assets"
    },
    {
      icon: <CpuChipIcon className="h-5 w-5" />,
      title: "AI Generation",
      description: "Create with advanced AI tools"
    },
    {
      icon: <SparklesIcon className="h-5 w-5" />,
      title: "Smart Workflow",
      description: "Streamlined creative process"
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
                Welcome back to Creo
              </h1>
              <p className="text-xl text-orange-100 mb-8">
                Continue creating amazing content with our powerful tools and AI capabilities.
              </p>
              
              {/* Features */}
              <div className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-orange-100 text-xs">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">10M+</div>
                  <div className="text-orange-200 text-sm">Stock Assets</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-orange-200 text-sm">Happy Users</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-orange-300/20 rounded-full blur-lg"></div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 lg:px-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sign in to your account
              </h2>
              <p className="text-gray-600">
                Welcome back! Please enter your details.
              </p>
            </div>

            <GlassCard variant="solid" padding="lg" className="shadow-xl">
              {/* Demo Login */}
              <DemoLogin />
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" role="form" aria-label="Sign in form">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert" aria-live="polite">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email */}
                <FormField
                  label="Email address"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...register('email', { required: 'Email is required' })}
                  error={errors.email?.message}
                  disabled={loading}
                />

                {/* Password */}
                <FormField
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register('password', { required: 'Password is required' })}
                  error={errors.password?.message}
                  disabled={loading}
                />

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link
                      href="/auth/forgot-password"
                      className="font-medium text-orange-600 hover:text-purple-600 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <BrandButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                  icon={<ArrowRightIcon className="h-5 w-5" />}
                  iconPosition="right"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </BrandButton>
              </form>
              
              {/* Sign Up Link */}
              <div className="mt-6 text-center text-sm">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="font-semibold text-orange-600 hover:text-purple-600 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}