'use client';

import AuthButton from './AuthButton';

/**
 * Simple usage examples of the AuthButton component
 * This shows how to integrate authentication into your app
 */
export default function AuthUsage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Auth Usage Examples</h1>

      {/* Basic Usage */}
      <div className="glass-card p-6 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <div className="flex gap-4">
          <AuthButton initialMode="signin" />
          <AuthButton initialMode="signup" />
        </div>
      </div>

      {/* Different Variants */}
      <div className="glass-card p-6 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Different Variants</h2>
        <div className="flex flex-wrap gap-4">
          <AuthButton variant="primary" initialMode="signin">Primary Sign In</AuthButton>
          <AuthButton variant="secondary" initialMode="signin">Secondary Sign In</AuthButton>
          <AuthButton variant="outline" initialMode="signin">Outline Sign In</AuthButton>
        </div>
      </div>

      {/* Different Sizes */}
      <div className="glass-card p-6 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Different Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <AuthButton size="sm" initialMode="signin">Small</AuthButton>
          <AuthButton size="md" initialMode="signin">Medium</AuthButton>
          <AuthButton size="lg" initialMode="signin">Large</AuthButton>
        </div>
      </div>

      {/* Custom Styling */}
      <div className="glass-card p-6 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Custom Styling</h2>
        <div className="flex flex-wrap gap-4">
          <AuthButton 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            initialMode="signin"
          >
            Custom Gradient
          </AuthButton>
          <AuthButton 
            className="rounded-full px-8"
            initialMode="signup"
          >
            Rounded Button
          </AuthButton>
        </div>
      </div>

      {/* With Success Callback */}
      <div className="glass-card p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">With Success Callback</h2>
        <AuthButton 
          initialMode="signin"
          onSuccess={(user) => {
            console.log('User signed in:', user);
            alert('Welcome! You have been signed in successfully.');
          }}
        >
          Sign In with Callback
        </AuthButton>
      </div>
    </div>
  );
}
