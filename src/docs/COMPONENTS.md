# Component Usage Guide

This guide covers all the reusable components in the Creo application, their APIs, usage examples, styling options, and accessibility features.

## Table of Contents

- [Authentication Components](#authentication-components)
- [UI Components](#ui-components)
- [Business Components](#business-components)
- [Layout Components](#layout-components)
- [Styling Customization](#styling-customization)
- [Accessibility Features](#accessibility-features)

## Authentication Components

### AuthModal

A comprehensive authentication modal with sign up, sign in, and password reset functionality.

#### API

```typescript
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'reset' | 'update';
  onSuccess?: (user: unknown) => void;
  className?: string;
}
```

#### Usage Example

```typescript
import AuthModal from '../components/AuthModal';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsAuthModalOpen(true)}>
        Sign In
      </button>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signin"
        onSuccess={(user) => {
          console.log('User signed in:', user);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}
```

#### Features

- **Multiple Modes**: Sign in, sign up, password reset, password update
- **Form Validation**: Built-in validation with error messages
- **Social Login**: Support for Google, Facebook, GitHub, Twitter
- **RTL Support**: Automatic right-to-left layout for Arabic
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### AuthButton

A simple authentication button component with different variants.

#### API

```typescript
interface AuthButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}
```

#### Usage Example

```typescript
import AuthButton from '../components/AuthButton';

function Header() {
  return (
    <header>
      <AuthButton 
        variant="primary" 
        size="md"
        onClick={() => console.log('Auth clicked')}
      />
    </header>
  );
}
```

## UI Components

### Navbar

A responsive navigation bar with language switching and authentication.

#### API

```typescript
interface NavbarProps {
  logo?: React.ReactNode;
  menuItems?: MenuItem[];
  showLanguageToggle?: boolean;
  showAuthButton?: boolean;
  className?: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}
```

#### Usage Example

```typescript
import Navbar from '../components/Navbar';

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
];

function Layout() {
  return (
    <div>
      <Navbar 
        menuItems={menuItems}
        showLanguageToggle={true}
        showAuthButton={true}
      />
      <main>{/* Your content */}</main>
    </div>
  );
}
```

### Hero

A hero section component with customizable content and call-to-action buttons.

#### API

```typescript
interface HeroProps {
  headline: string;
  subheadline: string;
  primaryButton?: {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  backgroundImage?: string;
  className?: string;
}
```

#### Usage Example

```typescript
import Hero from '../components/Hero';

function HomePage() {
  return (
    <Hero
      headline="Access Premium Stock Media"
      subheadline="Download high-quality images, videos, and audio from multiple sources"
      primaryButton={{
        text: "Start Free Trial",
        onClick: () => console.log('Start trial'),
        variant: "primary"
      }}
      secondaryButton={{
        text: "Learn More",
        onClick: () => console.log('Learn more'),
        variant: "secondary"
      }}
    />
  );
}
```

### PricingTable

A pricing table component with glassmorphism styling and multiple plans.

#### API

```typescript
interface PricingTableProps {
  plans: {
    name: string;
    price: string;
    period: string;
    features: string[];
    buttonText: string;
    buttonVariant: 'primary' | 'secondary';
    popular?: boolean;
  }[];
  className?: string;
}
```

#### Usage Example

```typescript
import PricingTable from '../components/PricingTable';

const plans = [
  {
    name: "Pay Per Download",
    price: "15",
    period: "EGP/download",
    features: [
      "Access to all stock media",
      "High-quality downloads",
      "Commercial license included"
    ],
    buttonText: "Get Started",
    buttonVariant: "primary" as const
  },
  {
    name: "Professional Plan",
    price: "599",
    period: "EGP/month",
    features: [
      "Unlimited downloads",
      "Priority support",
      "Advanced search filters",
      "Bulk download tools"
    ],
    buttonText: "Choose Plan",
    buttonVariant: "primary" as const,
    popular: true
  }
];

function PricingPage() {
  return <PricingTable plans={plans} />;
}
```

## Business Components

### StockMediaSearch

A comprehensive stock media search component with filtering and results display.

#### API

```typescript
interface StockMediaSearchProps {
  onSearch?: (query: string, site: string) => void;
  onItemSelect?: (item: StockMediaItem) => void;
  className?: string;
  showFilters?: boolean;
  showSiteSelector?: boolean;
}

interface StockMediaItem {
  id: string;
  title: string;
  thumbnail: string;
  cost: number;
  filesize: string;
  site: string;
}
```

#### Usage Example

```typescript
import StockMediaSearch from '../components/StockMediaSearch';

function SearchPage() {
  const handleSearch = (query: string, site: string) => {
    console.log('Searching for:', query, 'on', site);
  };

  const handleItemSelect = (item: StockMediaItem) => {
    console.log('Selected item:', item);
  };

  return (
    <StockMediaSearch
      onSearch={handleSearch}
      onItemSelect={handleItemSelect}
      showFilters={true}
      showSiteSelector={true}
    />
  );
}
```

### OrderManagement

A comprehensive order management component with real-time updates.

#### API

```typescript
interface OrderManagementProps {
  orders?: Order[];
  onOrderUpdate?: (orderId: string, updates: Partial<Order>) => void;
  onOrderCancel?: (orderId: string) => void;
  onDownload?: (orderId: string) => void;
  className?: string;
}

interface Order {
  id: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  progress: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Usage Example

```typescript
import OrderManagement from '../components/OrderManagement';

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const handleOrderUpdate = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    ));
  };

  return (
    <OrderManagement
      orders={orders}
      onOrderUpdate={handleOrderUpdate}
      onOrderCancel={(id) => console.log('Cancel order:', id)}
      onDownload={(id) => console.log('Download order:', id)}
    />
  );
}
```

### AIGenerationInterface

An AI image generation interface with prompt input and result display.

#### API

```typescript
interface AIGenerationInterfaceProps {
  onGenerate?: (prompt: string, options: GenerationOptions) => void;
  onDownload?: (imageId: string) => void;
  className?: string;
}

interface GenerationOptions {
  style: 'realistic' | 'artistic' | 'abstract' | 'minimalist';
  quality: 'standard' | 'high' | 'premium' | 'ultra';
  count: number;
}
```

#### Usage Example

```typescript
import AIGenerationInterface from '../components/AIGenerationInterface';

function AIPage() {
  const handleGenerate = (prompt: string, options: GenerationOptions) => {
    console.log('Generating with prompt:', prompt, 'options:', options);
  };

  return (
    <AIGenerationInterface
      onGenerate={handleGenerate}
      onDownload={(imageId) => console.log('Download image:', imageId)}
    />
  );
}
```

## Layout Components

### Dashboard

A comprehensive dashboard with quick stats, activity feed, and navigation.

#### API

```typescript
interface DashboardProps {
  user?: User;
  stats?: DashboardStats;
  recentActivity?: Activity[];
  className?: string;
}

interface DashboardStats {
  totalDownloads: number;
  activeOrders: number;
  creditsRemaining: number;
  monthlyUsage: number;
}
```

#### Usage Example

```typescript
import Dashboard from '../components/Dashboard';

function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  return (
    <Dashboard
      user={user}
      stats={stats}
      recentActivity={[]}
    />
  );
}
```

## Styling Customization

### CSS Custom Properties

All components use CSS custom properties for easy theming:

```css
:root {
  --primary-orange: #F97316;
  --deep-purple: #6366F1;
  --glass-white: rgba(255, 255, 255, 0.1);
  --glass-blur: 16px;
  --border-radius: 0.75rem;
  --shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
```

### Tailwind Classes

Components use Tailwind CSS with custom utilities:

```typescript
// Glassmorphism effect
className="glass-card"

// Brand colors
className="bg-primaryOrange-500 text-white"
className="bg-deepPurple-500 text-white"

// Responsive design
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Custom Styling

Override component styles using className prop:

```typescript
<AuthModal 
  className="custom-auth-modal"
  // ... other props
/>

// In your CSS
.custom-auth-modal {
  --primary-orange: #your-color;
  --deep-purple: #your-color;
}
```

## Accessibility Features

### Keyboard Navigation

All interactive components support keyboard navigation:

```typescript
// Tab navigation
<button 
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</button>
```

### ARIA Labels

Components include proper ARIA labels for screen readers:

```typescript
<button
  aria-label="Close authentication modal"
  aria-expanded={isOpen}
  aria-controls="auth-modal"
>
  Close
</button>
```

### Focus Management

Modal components manage focus properly:

```typescript
// Focus trap in modals
useEffect(() => {
  if (isOpen) {
    const firstFocusable = modalRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }
}, [isOpen]);
```

### Screen Reader Support

All components include screen reader support:

```typescript
<div
  role="dialog"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  aria-modal="true"
>
  <h2 id="modal-title">Authentication</h2>
  <p id="modal-description">Sign in to your account</p>
</div>
```

## Component Composition

### Higher-Order Components

Create composed components for common patterns:

```typescript
// WithAuth HOC
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    
    if (loading) return <LoadingSpinner />;
    if (!user) return <LoginPrompt />;
    
    return <Component {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

### Render Props Pattern

Use render props for flexible component composition:

```typescript
interface DataProviderProps {
  children: (data: any, loading: boolean, error: any) => React.ReactNode;
}

function DataProvider({ children }: DataProviderProps) {
  const { data, loading, error } = useQuery();
  return <>{children(data, loading, error)}</>;
}

// Usage
<DataProvider>
  {(data, loading, error) => (
    loading ? <Spinner /> : 
    error ? <ErrorMessage error={error} /> : 
    <DataDisplay data={data} />
  )}
</DataProvider>
```

## Performance Optimization

### Lazy Loading

Use dynamic imports for code splitting:

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

### Memoization

Optimize re-renders with React.memo:

```typescript
const ExpensiveComponent = React.memo(({ data }: { data: any }) => {
  return <div>{/* Expensive rendering */}</div>;
});
```

### Virtual Scrolling

For large lists, implement virtual scrolling:

```typescript
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }: { items: any[] }) {
  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      {items[index]}
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </List>
  );
}
```

## Testing Components

### Unit Testing

Test components with React Testing Library:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import AuthModal from '../components/AuthModal';

test('opens sign in form by default', () => {
  render(
    <AuthModal 
      isOpen={true} 
      onClose={() => {}} 
    />
  );
  
  expect(screen.getByText('Sign In')).toBeInTheDocument();
});
```

### Integration Testing

Test component interactions:

```typescript
test('switches between sign in and sign up', () => {
  render(<AuthModal isOpen={true} onClose={() => {}} />);
  
  fireEvent.click(screen.getByText('Need an account? Sign Up'));
  expect(screen.getByText('Sign Up')).toBeInTheDocument();
});
```

## Best Practices

### 1. Component Design

- Keep components focused on a single responsibility
- Use TypeScript for type safety
- Provide sensible defaults
- Make components composable

### 2. Props Interface

- Use descriptive prop names
- Provide JSDoc comments
- Use union types for variants
- Make optional props truly optional

### 3. Error Handling

- Provide error boundaries
- Handle loading states
- Show meaningful error messages
- Implement retry mechanisms

### 4. Accessibility

- Use semantic HTML
- Provide ARIA labels
- Support keyboard navigation
- Test with screen readers

For more examples and advanced usage patterns, refer to the individual component files in the `src/components` directory.
