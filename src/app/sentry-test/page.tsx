'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function SentryTestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testErrorReporting = () => {
    try {
      addResult('Testing error reporting...');
      throw new Error('This is a test error for Sentry');
    } catch (error) {
      addResult('Error caught and sent to Sentry');
      Sentry.captureException(error);
    }
  };

  const testMessageReporting = () => {
    addResult('Testing message reporting...');
    Sentry.captureMessage('Test message from Sentry test page', 'info');
    addResult('Message sent to Sentry');
  };

  const testPerformanceMonitoring = () => {
    addResult('Testing performance monitoring...');
    const transaction = Sentry.startSpan({
      name: 'Test Transaction',
      op: 'test',
    }, () => {
      // Simulate some work
      return new Promise(resolve => {
        setTimeout(() => {
          addResult('Performance transaction completed');
          resolve(true);
        }, 1000);
      });
    });
  };

  const testUserContext = () => {
    addResult('Testing user context...');
    Sentry.setUser({
      id: 'test-user-123',
      email: 'test@creo.com',
      username: 'testuser',
    });
    addResult('User context set');
  };

  const testTags = () => {
    addResult('Testing tags...');
    Sentry.setTag('test', 'sentry-integration');
    Sentry.setTag('environment', process.env.NODE_ENV);
    addResult('Tags set');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 rounded-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🐛 Sentry Integration Test
          </h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Sentry Functionality</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testErrorReporting}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Test Error Reporting
              </button>
              
              <button
                onClick={testMessageReporting}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Test Message Reporting
              </button>
              
              <button
                onClick={testPerformanceMonitoring}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Test Performance Monitoring
              </button>
              
              <button
                onClick={testUserContext}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Test User Context
              </button>
              
              <button
                onClick={testTags}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Test Tags
              </button>
              
              <button
                onClick={clearResults}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Configuration Status</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>DSN:</strong> {process.env.NEXT_PUBLIC_SENTRY_DSN ? '✅ Configured' : '❌ Missing'}
                </div>
                <div>
                  <strong>Organization:</strong> {process.env.SENTRY_ORG || 'Not set'}
                </div>
                <div>
                  <strong>Project:</strong> {process.env.SENTRY_PROJECT || 'Not set'}
                </div>
                <div>
                  <strong>Auth Token:</strong> {process.env.SENTRY_AUTH_TOKEN ? '✅ Configured' : '❌ Missing'}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <div className="text-gray-500">No tests run yet. Click a test button above.</div>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="mb-1">{result}</div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📊 Check Your Sentry Dashboard</h3>
            <p className="text-blue-800 text-sm">
              After running tests, check your Sentry dashboard at{' '}
              <a 
                href="https://sentry.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                sentry.io
              </a>{' '}
              to see the captured errors, messages, and performance data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
