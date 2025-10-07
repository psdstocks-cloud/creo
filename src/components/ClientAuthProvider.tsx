'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';

interface ClientAuthProviderProps {
  children: ReactNode;
}

export default function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
