import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ToastProvider } from '@/components/ui/Toast';

// Fonts are handled by Tailwind CSS

export const metadata: Metadata = {
  title: 'Creo - Stock Media Platform',
  description: 'AI-powered stock media platform with NEHTW integration',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main>{children}</main>
              </div>
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
