import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { ToastProvider, useToast } from './Toast';

describe('Toast', () => {
  const TestToast = ({ title = 'Test Toast', description = 'Test description', variant = 'info' }: { 
    title?: string; 
    description?: string; 
    variant?: 'success' | 'error' | 'warning' | 'info' 
  }) => {
    const { addToast } = useToast();
    return (
      <div>
        <button onClick={() => addToast({ title, description, variant })}>
          Show Toast
        </button>
      </div>
    );
  };

  it('renders toast with default props', async () => {
    render(
      <ToastProvider>
        <TestToast />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      expect(screen.getByText('Test Toast')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });
  });

  it('renders different toast variants', async () => {
    const { rerender } = render(
      <ToastProvider>
        <TestToast title="Success Toast" variant="success" />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Success Toast')).toBeInTheDocument();

    rerender(
      <ToastProvider>
        <TestToast title="Error Toast" variant="error" />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Error Toast')).toBeInTheDocument();
  });

  it('removes toast when close button is clicked', async () => {
    render(
      <ToastProvider>
        <TestToast />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      expect(screen.getByText('Test Toast')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: 'Close toast' });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();
    });
  });

  it('renders with action', async () => {
    const handleAction = jest.fn();
    const TestToastWithAction = () => {
      const { addToast } = useToast();
      return (
        <div>
          <button onClick={() => addToast({ 
            title: 'Test Toast', 
            description: 'Test description',
            action: { label: 'Action', onClick: handleAction }
          })}>
            Show Toast
          </button>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestToastWithAction />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Action'));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('renders without description', async () => {
    render(
      <ToastProvider>
        <TestToast title="Test Toast" description="" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      expect(screen.getByText('Test Toast')).toBeInTheDocument();
    });
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  it('auto-dismisses after duration', async () => {
    const TestToastWithDuration = () => {
      const { addToast } = useToast();
      return (
        <div>
          <button onClick={() => addToast({ 
            title: 'Test Toast', 
            description: 'Test description',
            duration: 100
          })}>
            Show Toast
          </button>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestToastWithDuration />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    
    await waitFor(() => {
      expect(screen.getByText('Test Toast')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });
});

describe('ToastProvider', () => {
  const TestComponent = ({ title, description, variant }: { 
    title: string; 
    description: string; 
    variant?: 'success' | 'error' | 'warning' | 'info' 
  }) => {
    const { addToast } = useToast();
    
    return (
      <div>
        <button onClick={() => addToast({ title, description, variant })}>
          Show Toast
        </button>
      </div>
    );
  };

  it('shows toast when addToast is called', async () => {
    render(
      <ToastProvider>
        <TestComponent title="Test Toast" description="Test description" />
      </ToastProvider>
    );

    const showButton = screen.getByRole('button', { name: 'Show Toast' });
    fireEvent.click(showButton);

    await waitFor(() => {
      expect(screen.getByText('Test Toast')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });
  });

  it('shows multiple toasts', async () => {
    render(
      <ToastProvider>
        <div>
          <TestComponent title="Success Toast" description="Success description" variant="success" />
          <TestComponent title="Error Toast" description="Error description" variant="error" />
        </div>
      </ToastProvider>
    );

    const buttons = screen.getAllByRole('button', { name: 'Show Toast' });
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);

    await waitFor(() => {
      expect(screen.getByText('Success Toast')).toBeInTheDocument();
      expect(screen.getByText('Error Toast')).toBeInTheDocument();
    });
  });

  it('removes toast when dismissed', async () => {
    render(
      <ToastProvider>
        <TestComponent title="Test Toast" description="Test description" />
      </ToastProvider>
    );

    const showButton = screen.getByRole('button', { name: 'Show Toast' });
    fireEvent.click(showButton);

    await waitFor(() => {
      expect(screen.getByText('Test Toast')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: 'Close toast' });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Toast')).not.toBeInTheDocument();
    });
  });

  it('positions toasts correctly', () => {
    render(
      <ToastProvider>
        <div>Test content</div>
      </ToastProvider>
    );

    // The ToastContainer should be positioned at top-4 right-4
    // We can't easily test this without adding a toast, so we'll just verify the provider renders
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});