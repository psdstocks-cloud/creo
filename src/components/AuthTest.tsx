'use client';

import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function AuthTest() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          setMessage(`Sign up error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } else {
          setMessage('Check your email for verification link!');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setMessage(`Sign in error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } else {
          setMessage('Successfully signed in!');
        }
      }
    } catch (error: unknown) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        setMessage(`Sign out error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } else {
        setMessage('Successfully signed out!');
      }
    } catch (error: unknown) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 glass-card rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Authentication Test
      </h2>

      {user ? (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Welcome, {user.email}!
            </h3>
            <p className="text-primaryOrange-200 text-sm">
              User ID: {user.id}
            </p>
          </div>
          
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryOrange text-gray-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-primaryOrange text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full px-4 py-2 border border-gray-300 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </form>
      )}

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          message.includes('error') || message.includes('Error') 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
