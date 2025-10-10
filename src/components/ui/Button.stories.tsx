import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { 
  SparklesIcon, 
  PhotoIcon, 
  CpuChipIcon, 
  CreditCardIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    asChild: {
      control: { type: 'boolean' },
      description: 'Whether to render as a child component',
    },
    children: {
      control: { type: 'text' },
      description: 'The content of the button',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <SparklesIcon className="h-4 w-4" />
      </Button>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button leftIcon={<SparklesIcon className="h-4 w-4" />}>
        AI Generation
      </Button>
      <Button variant="outline" leftIcon={<PhotoIcon className="h-4 w-4" />}>
        Stock Media
      </Button>
      <Button variant="secondary" leftIcon={<CpuChipIcon className="h-4 w-4" />}>
        Technology
      </Button>
      <Button variant="ghost" leftIcon={<CreditCardIcon className="h-4 w-4" />}>
        Billing
      </Button>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  ),
}

export const AsChild: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button asChild>
        <a href="#test">Link Button</a>
      </Button>
      <Button variant="outline" asChild>
        <div>Div Button</div>
      </Button>
    </div>
  ),
}

export const Interactive: Story = {
  args: {
    children: 'Click me',
    onClick: () => alert('Button clicked!'),
  },
}

export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}

export const FullWidth: Story = {
  render: () => (
    <div className="w-64">
      <Button className="w-full">Full Width Button</Button>
    </div>
  ),
}

export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </div>
  ),
}

export const FeatureButtons: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button size="lg" leftIcon={<SparklesIcon className="h-5 w-5" />}>
        Start AI Generation
      </Button>
      <Button variant="outline" size="lg" leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}>
        Browse Stock Media
      </Button>
      <Button variant="secondary" leftIcon={<ClipboardDocumentListIcon className="h-4 w-4" />}>
        View Orders
      </Button>
      <Button variant="ghost" leftIcon={<CreditCardIcon className="h-4 w-4" />}>
        Manage Billing
      </Button>
    </div>
  ),
}
