'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { useToastHelpers } from '@/components/ui/Toast'
import { 
  KeyIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  PlusIcon, 
  TrashIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface APIKey {
  id: string
  name: string
  key: string
  lastUsed?: string
  createdAt: string
  isActive: boolean
  permissions: string[]
}

export function APIKeyManager() {
  const { user } = useAuth()
  const { success, error: showError } = useToastHelpers()
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Mock API keys - in real app, this would come from API
  useEffect(() => {
    const mockKeys: APIKey[] = [
      {
        id: '1',
        name: 'Development Key',
        key: 'creo_dev_1234567890abcdef',
        lastUsed: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        isActive: true,
        permissions: ['read', 'write']
      },
      {
        id: '2',
        name: 'Production Key',
        key: 'creo_prod_fedcba0987654321',
        lastUsed: '2024-01-14T15:45:00Z',
        createdAt: '2024-01-05T00:00:00Z',
        isActive: true,
        permissions: ['read']
      }
    ]
    setApiKeys(mockKeys)
  }, [])

  const generateAPIKey = () => {
    const prefix = 'creo_'
    const randomPart = Math.random().toString(36).substring(2, 18)
    return `${prefix}${randomPart}`
  }

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyName.trim()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newKey: APIKey = {
        id: Date.now().toString(),
        name: newKeyName,
        key: generateAPIKey(),
        createdAt: new Date().toISOString(),
        isActive: true,
        permissions: ['read', 'write']
      }

      setApiKeys(prev => [newKey, ...prev])
      setNewKeyName('')
      setShowCreateForm(false)
      success('API Key Created', 'Your new API key has been generated successfully.')
    } catch (err) {
      showError('Creation Failed', 'Failed to create API key. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setApiKeys(prev => prev.filter(key => key.id !== keyId))
      success('API Key Deleted', 'The API key has been successfully deleted.')
    } catch (err) {
      showError('Deletion Failed', 'Failed to delete API key. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(keyId)) {
        newSet.delete(keyId)
      } else {
        newSet.add(keyId)
      }
      return newSet
    })
  }

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(key)
      success('Copied', 'API key copied to clipboard')
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      showError('Copy Failed', 'Failed to copy API key to clipboard')
    }
  }

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '•'.repeat(key.length - 12) + key.substring(key.length - 4)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Manage your API keys for programmatic access to Creo services
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Key
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Create New Key Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-gray-50 rounded-lg border"
            >
              <form onSubmit={handleCreateKey} className="space-y-4">
                <div>
                  <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Key Name
                  </label>
                  <input
                    id="keyName"
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., My App Integration"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false)
                      setNewKeyName('')
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !newKeyName.trim()}
                  >
                    {isLoading ? 'Creating...' : 'Create Key'}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API Keys List */}
        <div className="space-y-4">
          {apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <KeyIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
              <p className="text-gray-500 mb-4">
                Create your first API key to start using Creo's API
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Your First Key
              </Button>
            </div>
          ) : (
            apiKeys.map((apiKey) => (
              <motion.div
                key={apiKey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{apiKey.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        apiKey.isActive 
                          ? 'text-green-600 bg-green-100' 
                          : 'text-red-600 bg-red-100'
                      }`}>
                        {apiKey.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created: {formatDate(apiKey.createdAt)}</span>
                      {apiKey.lastUsed && (
                        <span>Last used: {formatDate(apiKey.lastUsed)}</span>
                      )}
                    </div>

                    {/* API Key Display */}
                    <div className="mt-3 flex items-center space-x-2">
                      <code className="px-3 py-1 bg-gray-100 rounded text-sm font-mono">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <button
                        onClick={() => handleToggleVisibility(apiKey.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title={visibleKeys.has(apiKey.id) ? 'Hide key' : 'Show key'}
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeSlashIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopyKey(apiKey.key)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Copy key"
                      >
                        {copiedKey === apiKey.key ? (
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        ) : (
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Permissions */}
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Permissions: </span>
                      {apiKey.permissions.map((permission, index) => (
                        <span
                          key={permission}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteKey(apiKey.id)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* API Usage Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">API Usage Guidelines</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Keep your API keys secure and never share them publicly</li>
                <li>• Each key has a rate limit of 1000 requests per hour</li>
                <li>• Keys are tied to your account and inherit your permissions</li>
                <li>• Delete unused keys to maintain security</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
