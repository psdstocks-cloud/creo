'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Temporarily disable components that require auth for testing
// import AuthTest from "../components/AuthTest";
// import NehtwAPIExampleSimple from "../components/NehtwAPIExampleSimple";
// import MockPaymentComponent from "../components/MockPaymentComponent";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Creo - Test Deployment
          </h1>
          <p className="text-primaryOrange-200 text-lg">
            Basic deployment test without authentication
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-white text-lg mb-4">
            This is a basic test to verify Vercel deployment is working.
          </p>
          <div className="space-x-4">
            <a href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Go to Dashboard
            </a>
            <a href="/orders" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Go to Orders
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}