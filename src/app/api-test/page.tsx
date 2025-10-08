'use client'

import { useState } from 'react'
import { 
  runBasicTests, 
  runComprehensiveTests, 
  testCustomEndpoint,
  logTestResults,
  exportTestResults,
  checkAPIConfiguration,
  type TestSuite
} from '@/utils/api-testing'
import { BrandButton } from '@/components/ui/BrandButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { 
  PlayIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function APITestPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<TestSuite | null>(null)
  const [customEndpoint, setCustomEndpoint] = useState('stocksites')
  const [customParams, setCustomParams] = useState('{"site": "shutterstock", "id": "12345"}')

  // Only render in development mode
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Development Only</h3>
          <p className="mt-1 text-sm text-gray-500">This page is only available in development mode.</p>
        </div>
      </div>
    )
  }

  const handleRunBasicTests = async () => {
    setIsRunning(true)
    setCurrentTest('Running basic API tests...')
    
    try {
      const results = await runBasicTests()
      setTestResults(results)
      logTestResults(results)
    } catch (error) {
      console.error('Test execution failed:', error)
    } finally {
      setIsRunning(false)
      setCurrentTest(null)
    }
  }

  const handleRunComprehensiveTests = async () => {
    setIsRunning(true)
    setCurrentTest('Running comprehensive API tests...')
    
    try {
      const results = await runComprehensiveTests()
      setTestResults(results)
      logTestResults(results)
    } catch (error) {
      console.error('Test execution failed:', error)
    } finally {
      setIsRunning(false)
      setCurrentTest(null)
    }
  }

  const handleRunCustomTest = async () => {
    setIsRunning(true)
    setCurrentTest(`Testing custom endpoint: ${customEndpoint}`)
    
    try {
      let params = {}
      try {
        params = JSON.parse(customParams)
      } catch {
        console.warn('Invalid JSON parameters, using empty object')
      }
      
      const result = await testCustomEndpoint(customEndpoint, params)
      const mockSuite: TestSuite = {
        name: 'Custom Endpoint Test',
        tests: [result],
        totalDuration: result.duration,
        successCount: result.success ? 1 : 0,
        failureCount: result.success ? 0 : 1
      }
      setTestResults(mockSuite)
      logTestResults(mockSuite)
    } catch (error) {
      console.error('Custom test execution failed:', error)
    } finally {
      setIsRunning(false)
      setCurrentTest(null)
    }
  }

  const handleExportResults = () => {
    if (!testResults) return
    
    const data = exportTestResults(testResults)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nehtw-api-test-results-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const configCheck = checkAPIConfiguration()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧪 NEHTW API Testing Suite
          </h1>
          <p className="text-xl text-white/80">
            Development-only API testing and debugging tools
          </p>
        </div>

        {/* Configuration Check */}
        <GlassCard variant="light" intensity="medium" className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Configuration Status</h2>
          {configCheck.configured ? (
            <div className="flex items-center text-green-400">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              <span>API configuration is properly set up</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center text-red-400 mb-2">
                <XCircleIcon className="h-5 w-5 mr-2" />
                <span>Configuration issues detected:</span>
              </div>
              <ul className="list-disc list-inside text-red-300 ml-4">
                {configCheck.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </GlassCard>

        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard variant="orange" intensity="medium" className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Tests</h3>
            <p className="text-white/70 mb-4 text-sm">
              Test core API endpoints: health check, stock sites, user balance, and stock info.
            </p>
            <BrandButton
              onClick={handleRunBasicTests}
              disabled={isRunning || !configCheck.configured}
              variant="primary"
              className="w-full"
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              Run Basic Tests
            </BrandButton>
          </GlassCard>

          <GlassCard variant="purple" intensity="medium" className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Comprehensive Tests</h3>
            <p className="text-white/70 mb-4 text-sm">
              Test all endpoints including rate limiting and AI generation.
            </p>
            <BrandButton
              onClick={handleRunComprehensiveTests}
              disabled={isRunning || !configCheck.configured}
              variant="secondary"
              className="w-full"
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              Run All Tests
            </BrandButton>
          </GlassCard>

          <GlassCard variant="light" intensity="medium" className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Custom Test</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-white mb-1">Endpoint</label>
                <select
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                >
                  <option value="stocksites">Stock Sites</option>
                  <option value="stockinfo">Stock Info</option>
                  <option value="userbalance">User Balance</option>
                  <option value="aigeneration">AI Generation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Parameters (JSON)</label>
                <textarea
                  value={customParams}
                  onChange={(e) => setCustomParams(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white text-sm"
                  placeholder='{"site": "shutterstock", "id": "12345"}'
                />
              </div>
              <BrandButton
                onClick={handleRunCustomTest}
                disabled={isRunning || !configCheck.configured}
                variant="glass"
                className="w-full"
              >
                <PlayIcon className="h-4 w-4 mr-2" />
                Test Custom
              </BrandButton>
            </div>
          </GlassCard>
        </div>

        {/* Current Test Status */}
        {isRunning && (
          <GlassCard variant="light" intensity="strong" className="p-6 mb-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-4"></div>
              <span className="text-white text-lg">{currentTest}</span>
            </div>
          </GlassCard>
        )}

        {/* Test Results */}
        {testResults && (
          <GlassCard variant="light" intensity="strong" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Test Results</h2>
              <BrandButton
                onClick={handleExportResults}
                variant="secondary"
                size="sm"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export Results
              </BrandButton>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{testResults.totalDuration}ms</div>
                <div className="text-white/70 text-sm">Total Duration</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{testResults.successCount}</div>
                <div className="text-white/70 text-sm">Passed</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{testResults.failureCount}</div>
                <div className="text-white/70 text-sm">Failed</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {((testResults.successCount / testResults.tests.length) * 100).toFixed(1)}%
                </div>
                <div className="text-white/70 text-sm">Success Rate</div>
              </div>
            </div>

            {/* Individual Test Results */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white mb-4">Individual Test Results</h3>
              {testResults.tests.map((test, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {test.success ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-400 mr-3" />
                      )}
                      <div>
                        <div className="text-white font-medium">{test.endpoint}</div>
                        <div className="text-white/60 text-sm">
                          {test.duration}ms • {new Date(test.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    {test.error && (
                      <div className="text-red-400 text-sm max-w-md text-right">
                        {test.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Warning */}
        <div className="mt-8 text-center">
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-yellow-200 text-sm">
              <strong>Warning:</strong> This page makes real API calls to NEHTW. 
              Use responsibly and respect rate limits. This page is only available in development mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
