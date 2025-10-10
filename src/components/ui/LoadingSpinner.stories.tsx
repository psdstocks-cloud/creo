import type { Meta, StoryObj } from '@storybook/react'
import { LoadingSpinner } from './LoadingSpinner'

const meta: Meta<typeof LoadingSpinner> = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable loading spinner component with different sizes and colors.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'The size of the spinner',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'white', 'gray'],
      description: 'The color of the spinner',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center space-x-8">
      <div className="text-center">
        <LoadingSpinner size="sm" />
        <p className="mt-2 text-sm text-gray-600">Small</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="md" />
        <p className="mt-2 text-sm text-gray-600">Medium</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-2 text-sm text-gray-600">Large</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-2 text-sm text-gray-600">Extra Large</p>
      </div>
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex items-center space-x-8">
      <div className="text-center">
        <LoadingSpinner color="primary" />
        <p className="mt-2 text-sm text-gray-600">Primary</p>
      </div>
      <div className="text-center">
        <LoadingSpinner color="secondary" />
        <p className="mt-2 text-sm text-gray-600">Secondary</p>
      </div>
      <div className="text-center bg-gray-800 p-4 rounded">
        <LoadingSpinner color="white" />
        <p className="mt-2 text-sm text-white">White</p>
      </div>
      <div className="text-center">
        <LoadingSpinner color="gray" />
        <p className="mt-2 text-sm text-gray-600">Gray</p>
      </div>
    </div>
  ),
}

export const WithText: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
      <div className="flex items-center space-x-3">
        <LoadingSpinner size="md" />
        <span className="text-base text-gray-700">Processing your request</span>
      </div>
      <div className="flex items-center space-x-3">
        <LoadingSpinner size="lg" />
        <span className="text-lg text-gray-800">Generating AI images</span>
      </div>
    </div>
  ),
}

export const InButtons: Story = {
  render: () => (
    <div className="space-y-4">
      <button 
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        disabled
      >
        <LoadingSpinner size="sm" color="white" />
        <span className="ml-2">Loading...</span>
      </button>
      
      <button 
        className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        disabled
      >
        <LoadingSpinner size="md" color="white" />
        <span className="ml-3">Processing...</span>
      </button>
      
      <button 
        className="inline-flex items-center px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
        disabled
      >
        <LoadingSpinner size="lg" color="white" />
        <span className="ml-4 text-lg">Generating...</span>
      </button>
    </div>
  ),
}

export const InCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <LoadingSpinner size="lg" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Loading Content</h3>
        <p className="mt-2 text-sm text-gray-600">Please wait while we load your data</p>
      </div>
      
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-md p-6 text-center">
        <LoadingSpinner size="lg" color="primary" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">AI Generation</h3>
        <p className="mt-2 text-sm text-gray-600">Creating your custom images</p>
      </div>
    </div>
  ),
}

export const FullScreen: Story = {
  render: () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center">
        <LoadingSpinner size="xl" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">Processing</h3>
        <p className="mt-2 text-gray-600">Please wait while we process your request</p>
      </div>
    </div>
  ),
}

export const CustomSizes: Story = {
  render: () => (
    <div className="flex items-center space-x-8">
      <div className="text-center">
        <LoadingSpinner size="sm" className="w-4 h-4" />
        <p className="mt-2 text-sm text-gray-600">Custom Small</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="md" className="w-8 h-8" />
        <p className="mt-2 text-sm text-gray-600">Custom Medium</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="lg" className="w-12 h-12" />
        <p className="mt-2 text-sm text-gray-600">Custom Large</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="xl" className="w-16 h-16" />
        <p className="mt-2 text-sm text-gray-600">Custom Extra Large</p>
      </div>
    </div>
  ),
}

export const Animated: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-lg font-medium text-gray-900">Default Animation</p>
      </div>
      
      <div className="text-center">
        <LoadingSpinner size="lg" className="animate-pulse" />
        <p className="mt-4 text-lg font-medium text-gray-900">Pulse Animation</p>
      </div>
      
      <div className="text-center">
        <LoadingSpinner size="lg" className="animate-bounce" />
        <p className="mt-4 text-lg font-medium text-gray-900">Bounce Animation</p>
      </div>
    </div>
  ),
}
