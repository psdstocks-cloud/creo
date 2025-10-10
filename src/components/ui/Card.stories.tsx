import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { 
  SparklesIcon, 
  PhotoIcon, 
  CpuChipIcon, 
  CreditCardIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component with header, content, and footer sections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'glass', 'outline'],
      description: 'The visual style variant of the card',
    },
    hover: {
      control: { type: 'boolean' },
      description: 'Whether the card has hover effects',
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
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content. It can contain any React elements.</p>
      </CardContent>
    </Card>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>Standard card variant</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is a default card with standard styling.</p>
        </CardContent>
      </Card>
      
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Glass Card</CardTitle>
          <CardDescription>Glassmorphism effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has a glassmorphism effect with backdrop blur.</p>
        </CardContent>
      </Card>
      
      <Card variant="outline">
        <CardHeader>
          <CardTitle>Outline Card</CardTitle>
          <CardDescription>Outlined border variant</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card has a prominent border outline.</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const WithHover: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card hover>
        <CardHeader>
          <CardTitle>Hover Card</CardTitle>
          <CardDescription>This card has hover effects</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Hover over this card to see the effect.</p>
        </CardContent>
      </Card>
      
      <Card variant="glass" hover>
        <CardHeader>
          <CardTitle>Glass Hover Card</CardTitle>
          <CardDescription>Glassmorphism with hover</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card combines glassmorphism with hover effects.</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const FeatureCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card variant="glass" hover className="text-center">
        <CardHeader>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <PhotoIcon className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle>Stock Media</CardTitle>
          <CardDescription>
            Access millions of high-quality stock images, videos, and audio files
          </CardDescription>
        </CardHeader>
      </Card>

      <Card variant="glass" hover className="text-center">
        <CardHeader>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CpuChipIcon className="w-6 h-6 text-purple-600" />
          </div>
          <CardTitle>AI Generation</CardTitle>
          <CardDescription>
            Create unique content with our advanced AI image generation system
          </CardDescription>
        </CardHeader>
      </Card>

      <Card variant="glass" hover className="text-center">
        <CardHeader>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CreditCardIcon className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle>Easy Payments</CardTitle>
          <CardDescription>
            Simple credit-based system with transparent pricing
          </CardDescription>
        </CardHeader>
      </Card>

      <Card variant="glass" hover className="text-center">
        <CardHeader>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            Track downloads and AI generation jobs in one place
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
}

export const WithActions: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Action Card</CardTitle>
          <CardDescription>Card with action buttons</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card includes action buttons in the content area.</p>
        </CardContent>
        <div className="px-6 pb-6">
          <div className="flex gap-2">
            <Button size="sm">Primary</Button>
            <Button variant="outline" size="sm">Secondary</Button>
          </div>
        </div>
      </Card>
      
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Feature Card</CardTitle>
          <CardDescription>Card with feature content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-4 w-4 text-blue-600" />
              <span className="text-sm">AI-powered generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <PhotoIcon className="h-4 w-4 text-green-600" />
              <span className="text-sm">High-quality stock media</span>
            </div>
            <div className="flex items-center space-x-2">
              <MagnifyingGlassIcon className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Advanced search</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
}

export const Statistics: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <ClipboardDocumentListIcon className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$12,450</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCardIcon className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">892</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <SparklesIcon className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
}

export const Empty: Story = {
  render: () => (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <PhotoIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
        <p className="text-gray-500 mb-4">This is an empty card state.</p>
        <Button>Get Started</Button>
      </CardContent>
    </Card>
  ),
}
