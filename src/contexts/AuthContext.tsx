'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthUser, AuthState } from '../types/auth';
import AuthButton from '../components/AuthButton';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ data: unknown; error: unknown }>;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
  signOut: () => Promise<{ error: unknown }>;
  signInWithProvider: (provider: 'google' | 'facebook' | 'github' | 'twitter') => Promise<{ data: unknown; error: unknown }>;
  resetPassword: (email: string) => Promise<{ data: unknown; error: unknown }>;
  updatePassword: (password: string) => Promise<{ data: unknown; error: unknown }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase!.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
        setUser(session?.user || null);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);

      // Handle different auth events
      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in:', session?.user);
          break;
        case 'SIGNED_OUT':
          console.log('User signed out');
          break;
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed');
          break;
        case 'PASSWORD_RECOVERY':
          console.log('Password recovery initiated');
          break;
        case 'USER_UPDATED':
          console.log('User updated:', session?.user);
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return { error: new Error('Supabase not initialized') };
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'facebook' | 'github' | 'twitter') => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not initialized') };
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    redirectTo?: string;
    requireAuth?: boolean;
  } = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    const { redirectTo = '/auth/signin', requireAuth = true } = options;

    useEffect(() => {
      if (!loading && requireAuth && !user) {
        // In a real app, you'd redirect here
        console.log('User not authenticated, redirecting to:', redirectTo);
      }
    }, [user, loading, requireAuth, redirectTo]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primaryOrange"></div>
        </div>
      );
    }

    if (requireAuth && !user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please sign in to access this page.
            </p>
            <AuthButton variant="primary" />
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
