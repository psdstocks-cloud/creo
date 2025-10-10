import type { Meta, StoryObj } from '@storybook/react'
import { ToastProvider, useToast } from './Toast'
import { Button } from './Button'
import { useState } from 'react'

const meta: Meta<typeof ToastProvider> = {
  title: 'UI/Toast',
  component: ToastProvider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A toast notification system with multiple variants and actions.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

const ToastDemo = () => {
  const { addToast } = useToast()
  const [toastId, setToastId] = useState<string | null>(null)

  const showSuccessToast = () => {
    addToast({
      title: 'Success!',
      description: 'Your action was completed successfully.',
      variant: 'success',
    })
  }

  const showErrorToast = () => {
    addToast({
      title: 'Error',
      description: 'Something went wrong. Please try again.',
      variant: 'error',
    })
  }

  const showWarningToast = () => {
    addToast({
      title: 'Warning',
      description: 'Please review your input before proceeding.',
      variant: 'warning',
    })
  }

  const showInfoToast = () => {
    addToast({
      title: 'Information',
      description: 'Here is some useful information for you.',
      variant: 'info',
    })
  }

  const showToastWithAction = () => {
    addToast({
      title: 'New Update Available',
      description: 'A new version of the app is available.',
      variant: 'info',
      action: {
        label: 'Update Now',
        onClick: () => alert('Update initiated!'),
      },
    })
  }

  const showPersistentToast = () => {
    const id = addToast({
      title: 'Persistent Toast',
      description: 'This toast will not auto-dismiss.',
      variant: 'info',
      duration: 0, // 0 means no auto-dismiss
    action: {
      label: 'Dismiss',
      onClick: () => {
        // In a real app, you'd call removeToast(id)
        console.log('Toast dismissed')
      },
    }})
    setToastId(id)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={showSuccessToast} className="bg-green-600 hover:bg-green-700">
          Success Toast
        </Button>
        <Button onClick={showErrorToast} className="bg-red-600 hover:bg-red-700">
          Error Toast
        </Button>
        <Button onClick={showWarningToast} className="bg-yellow-600 hover:bg-yellow-700">
          Warning Toast
        </Button>
        <Button onClick={showInfoToast} className="bg-blue-600 hover:bg-blue-700">
          Info Toast
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={showToastWithAction} variant="outline">
          Toast with Action
        </Button>
        <Button onClick={showPersistentToast} variant="outline">
          Persistent Toast
        </Button>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <ToastDemo />,
}

export const Variants: Story = {
  render: () => {
    const { addToast } = useToast()
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => addToast({
              title: 'Success',
              description: 'Operation completed successfully',
              variant: 'success'
            })}
            className="bg-green-600 hover:bg-green-700"
          >
            Success
          </Button>
          <Button 
            onClick={() => addToast({
              title: 'Error',
              description: 'Something went wrong',
              variant: 'error'
            })}
            className="bg-red-600 hover:bg-red-700"
          >
            Error
          </Button>
          <Button 
            onClick={() => addToast({
              title: 'Warning',
              description: 'Please check your input',
              variant: 'warning'
            })}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Warning
          </Button>
          <Button 
            onClick={() => addToast({
              title: 'Info',
              description: 'Here is some information',
              variant: 'info'
            })}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Info
          </Button>
        </div>
      </div>
    )
  },
}

export const WithActions: Story = {
  render: () => {
    const { addToast } = useToast()
    
    return (
      <div className="space-y-4">
        <Button 
          onClick={() => addToast({
            title: 'Download Complete',
            description: 'Your file has been downloaded successfully',
            variant: 'success',
            action: {
              label: 'Open Folder',
              onClick: () => alert('Opening folder...')
            }
          })}
        >
          Toast with Action
        </Button>
        <Button 
          onClick={() => addToast({
            title: 'Storage Almost Full',
            description: 'You are using 90% of your storage quota',
            variant: 'warning',
            action: {
              label: 'Upgrade Plan',
              onClick: () => alert('Redirecting to upgrade...')
            }
          })}
          variant="outline"
        >
          Toast with Upgrade Action
        </Button>
      </div>
    )
  },
}

export const Persistent: Story = {
  render: () => {
    const { addToast } = useToast()
    
    return (
      <div className="space-y-4">
        <Button 
          onClick={() => addToast({
            title: 'Important Notice',
            description: 'This is a persistent toast that requires manual dismissal',
            variant: 'info',
            duration: 0, // No auto-dismiss
            action: {
              label: 'Dismiss',
              onClick: () => console.log('Dismissed')
            }
          })}
        >
          Show Persistent Toast
        </Button>
      </div>
    )
  },
}

export const MultipleToasts: Story = {
  render: () => {
    const { addToast } = useToast()
    
    const showMultiple = () => {
      addToast({
        title: 'First Toast',
        description: 'This is the first notification',
        variant: 'info'
      })
      
      setTimeout(() => {
        addToast({
          title: 'Second Toast',
          description: 'This is the second notification',
          variant: 'success'
        })
      }, 500)
      
      setTimeout(() => {
        addToast({
          title: 'Third Toast',
          description: 'This is the third notification',
          variant: 'warning'
        })
      }, 1000)
    }
    
    return (
      <div className="space-y-4">
        <Button onClick={showMultiple}>
          Show Multiple Toasts
        </Button>
      </div>
    )
  },
}

export const LongContent: Story = {
  render: () => {
    const { addToast } = useToast()
    
    return (
      <div className="space-y-4">
        <Button 
          onClick={() => addToast({
            title: 'Complex Operation Completed',
            description: 'Your AI image generation request has been processed successfully. The generated images are now available in your downloads section. You can access them anytime from your dashboard.',
            variant: 'success',
            action: {
              label: 'View Downloads',
              onClick: () => alert('Opening downloads...')
            }
          })}
        >
          Show Long Content Toast
        </Button>
      </div>
    )
  },
}

export const CustomDuration: Story = {
  render: () => {
    const { addToast } = useToast()
    
    return (
      <div className="space-y-4">
        <Button 
          onClick={() => addToast({
            title: 'Quick Toast',
            description: 'This toast will disappear in 2 seconds',
            variant: 'info',
            duration: 2000
          })}
        >
          Quick Toast (2s)
        </Button>
        <Button 
          onClick={() => addToast({
            title: 'Slow Toast',
            description: 'This toast will stay for 10 seconds',
            variant: 'warning',
            duration: 10000
          })}
          variant="outline"
        >
          Slow Toast (10s)
        </Button>
      </div>
    )
  },
}
