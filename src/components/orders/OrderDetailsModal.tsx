'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ClockIcon, CheckCircleIcon, XCircleIcon, CloudArrowDownIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui'
import { motion } from 'framer-motion'

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: {
    id: string
    type: 'stock' | 'ai'
    status: 'processing' | 'completed' | 'failed'
    createdAt: string
    cost: number
    metadata: any
    files?: Array<{
      name: string
      url: string
      size: string
      type: string
    }>
  }
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      case 'processing':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Order Details
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Order Header */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Order #{order.id}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Type & Cost */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p className="text-sm text-gray-900 capitalize">{order.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Cost</label>
                      <p className="text-sm text-gray-900">${order.cost.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Order Metadata */}
                  {order.metadata && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Details</label>
                      <div className="mt-1 text-sm text-gray-900">
                        {order.type === 'stock' && order.metadata.site && (
                          <p>Source: {order.metadata.site}</p>
                        )}
                        {order.type === 'ai' && order.metadata.prompt && (
                          <div>
                            <p className="font-medium">Prompt:</p>
                            <p className="text-gray-600 italic">"{order.metadata.prompt}"</p>
                          </div>
                        )}
                        {order.metadata.settings && (
                          <div className="mt-2">
                            <p className="font-medium">Settings:</p>
                            <div className="text-gray-600">
                              {Object.entries(order.metadata.settings).map(([key, value]) => (
                                <p key={key} className="text-sm">
                                  {key}: {String(value)}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Files */}
                  {order.files && order.files.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Files</label>
                      <div className="mt-2 space-y-2">
                        {order.files.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <CloudArrowDownIcon className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {file.type} • {formatFileSize(parseInt(file.size))}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(file.url, '_blank')}
                            >
                              Download
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Processing Status */}
                  {order.status === 'processing' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Processing in progress</p>
                          <p className="text-sm text-yellow-700">
                            Your order is being processed. You'll be notified when it's ready.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Status */}
                  {order.status === 'failed' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-red-800">Processing failed</p>
                          <p className="text-sm text-red-700">
                            There was an error processing your order. Please contact support.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  {order.status === 'completed' && order.files && order.files.length > 0 && (
                    <Button
                      onClick={() => {
                        // Download all files
                        order.files?.forEach(file => {
                          const link = document.createElement('a')
                          link.href = file.url
                          link.download = file.name
                          link.click()
                        })
                      }}
                    >
                      Download All
                    </Button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
