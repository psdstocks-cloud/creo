import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from '@/components/layout/Navbar'
import { ClientProviders } from '@/components/ClientProviders'
import { DemoLogin } from '@/components/DemoLogin'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creo - Stock Media Platform",
  description: "AI-powered stock media platform with NEHTW integration",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <DemoLogin />
            <main>{children}</main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
