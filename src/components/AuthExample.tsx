'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslations } from 'next-intl';
import AuthButton from './AuthButton';
import AuthModal from './AuthModal';

export default function AuthExample() {
  const t = useTranslations('Auth');
  const { user, session, loading, signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOrange"></div>
        <span className="ml-2 text-gray-600">{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Authentication Example</h1>

      <div className="glass-card p-8 rounded-2xl mb-8">
        <h2 className="text-2xl font-semibold mb-6">Current Auth State</h2>
        
        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Signed In</h3>
              <div className="text-sm text-green-700">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                {user.user_metadata?.full_name && (
                  <p><strong>Full Name:</strong> {user.user_metadata.full_name}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Not Signed In</h3>
              <p className="text-sm text-gray-600">
                Please sign in to access your account and start using Creo.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <AuthButton variant="primary" initialMode="signin" />
              <AuthButton variant="secondary" initialMode="signup" />
              <AuthButton variant="outline" initialMode="signin" />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sign In Examples */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Sign In Examples</h3>
          <div className="space-y-3">
            <AuthButton 
              variant="primary" 
              size="lg" 
              initialMode="signin"
              className="w-full"
            >
              Sign In with Email
            </AuthButton>
            <AuthButton 
              variant="secondary" 
              size="md" 
              initialMode="signin"
              className="w-full"
            >
              Sign In (Secondary)
            </AuthButton>
            <AuthButton 
              variant="outline" 
              size="sm" 
              initialMode="signin"
              className="w-full"
            >
              Sign In (Outline)
            </AuthButton>
          </div>
        </div>

        {/* Sign Up Examples */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Sign Up Examples</h3>
          <div className="space-y-3">
            <AuthButton 
              variant="primary" 
              size="lg" 
              initialMode="signup"
              className="w-full"
            >
              Create Account
            </AuthButton>
            <AuthButton 
              variant="secondary" 
              size="md" 
              initialMode="signup"
              className="w-full"
            >
              Sign Up (Secondary)
            </AuthButton>
            <AuthButton 
              variant="outline" 
              size="sm" 
              initialMode="signup"
              className="w-full"
            >
              Sign Up (Outline)
            </AuthButton>
          </div>
        </div>
      </div>

      {/* Session Information */}
      {session && (
        <div className="glass-card p-6 rounded-xl mt-6">
          <h3 className="text-xl font-semibold mb-4">Session Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm text-gray-700">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Auth Modal for Password Update */}
      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialMode="update"
        onSuccess={() => {
          setShowModal(false);
          console.log('Password updated successfully');
        }}
      />
    </div>
  );
}
