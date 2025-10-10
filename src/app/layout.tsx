import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/components/auth/AuthProvider';
import { UserProvider } from '@/contexts/UserContext';
import { EnhancedClientLayout } from '@/components/layout/EnhancedClientLayout';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ToastProvider } from '@/components/ui/Toast';

// Fonts are handled by Tailwind CSS

export const metadata: Metadata = {
  title: 'Creo - AI-Powered Stock Media Platform',
  description: 'Generate AI images and search stock media with our comprehensive platform',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
        <QueryProvider>
          <AuthProvider>
            <UserProvider>
              <ToastProvider>
                <EnhancedClientLayout>
                  {children}
                </EnhancedClientLayout>
              </ToastProvider>
            </UserProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
