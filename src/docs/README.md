# Creo Documentation

Welcome to the comprehensive documentation for the Creo stock media platform. This documentation covers all aspects of the application, from setup and configuration to advanced usage patterns.

## 📚 Documentation Overview

### Quick Start
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [First Steps](#first-steps)

### Core Documentation
- [NEHTW API Integration Guide](./NEHTW_INTEGRATION.md) - Complete API integration guide
- [Component Usage Guide](./COMPONENTS.md) - All UI components and their usage
- [Hooks Documentation](./HOOKS.md) - Custom React hooks reference

### Architecture
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Design System](#design-system)

### Development
- [Development Setup](#development-setup)
- [Testing Guide](#testing-guide)
- [Deployment Guide](#deployment-guide)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/creo.git
cd creo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Environment Setup

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NEHTW API Configuration
NEXT_PUBLIC_NEHTW_API_KEY=your_nehtw_api_key
NEXT_PUBLIC_NEHTW_BASE_URL=https://nehtw.com/api

# Optional: Custom settings
NEXT_PUBLIC_NEHTW_TIMEOUT=30000
NEXT_PUBLIC_NEHTW_RETRIES=3
```

### First Steps

1. **Configure Authentication**: Set up Supabase authentication
2. **Configure API**: Add your NEHTW API credentials
3. **Start Development**: Run `npm run dev`
4. **Visit Application**: Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── monitoring/        # Monitoring dashboard
│   ├── ai-generation/     # AI generation interface
│   ├── orders/           # Order management
│   └── stock-search/     # Stock media search
├── components/            # Reusable UI components
│   ├── AuthModal.tsx     # Authentication modal
│   ├── Navbar.tsx        # Navigation component
│   ├── Hero.tsx          # Hero section
│   ├── PricingTable.tsx  # Pricing table
│   └── ...               # Other components
├── hooks/                # Custom React hooks
│   ├── useStockMediaIntegration.ts
│   ├── useAIGeneration.ts
│   └── ...
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client
│   ├── nehtw-client.ts   # NEHTW API client
│   └── query-client.ts   # React Query client
├── types/                # TypeScript type definitions
│   ├── auth.ts          # Authentication types
│   ├── nehtw.ts         # NEHTW API types
│   └── ...
├── utils/                # Utility functions
│   ├── api-testing.ts    # API testing utilities
│   ├── error-logging.ts  # Error handling
│   └── ...
└── docs/                 # Documentation
    ├── NEHTW_INTEGRATION.md
    ├── COMPONENTS.md
    └── HOOKS.md
```

## Technology Stack

### Frontend
- **Next.js 15** - React framework with app router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Query** - Data fetching and caching

### Backend & APIs
- **Supabase** - Authentication and database
- **NEHTW API** - Stock media and AI generation
- **Next.js API Routes** - Server-side API endpoints

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **React Query DevTools** - Development debugging
- **TypeScript** - Static type checking

## Design System

### Colors
```css
:root {
  --primary-orange: #F97316;
  --deep-purple: #6366F1;
  --glass-white: rgba(255, 255, 255, 0.1);
  --glass-blur: 16px;
}
```

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Code**: JetBrains Mono

### Components
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG 2.1 AA compliant
- **RTL Support**: Right-to-left layout for Arabic

## Development Setup

### Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check
```

### Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Integration

### NEHTW API

The application integrates with the NEHTW API for:
- Stock media search and download
- AI image generation
- Order management
- User account management

See [NEHTW Integration Guide](./NEHTW_INTEGRATION.md) for detailed setup and usage.

### Supabase Authentication

User authentication is handled by Supabase:
- Email/password authentication
- Social login (Google, Facebook, GitHub, Twitter)
- Password reset functionality
- User session management

## Component Library

### Authentication Components
- `AuthModal` - Complete authentication modal
- `AuthButton` - Simple authentication button
- `ClientAuthProvider` - Authentication context provider

### UI Components
- `Navbar` - Responsive navigation
- `Hero` - Hero section with CTAs
- `PricingTable` - Pricing plans display
- `FAQAccordion` - FAQ with search and filtering

### Business Components
- `StockMediaSearch` - Media search interface
- `OrderManagement` - Order tracking and management
- `AIGenerationInterface` - AI image generation
- `MonitoringDashboard` - System monitoring

See [Component Usage Guide](./COMPONENTS.md) for detailed documentation.

## Custom Hooks

### Stock Media Hooks
- `useStockMediaSearch` - Search stock media
- `useStockInfo` - Get media details
- `useCreateOrder` - Create download orders
- `useOrderStatus` - Track order progress
- `useDownloadLink` - Generate download links

### AI Generation Hooks
- `useCreateAIJob` - Create AI generation jobs
- `useAIJobStatus` - Track generation progress
- `useAIActions` - Perform image actions
- `useAccountBalance` - Get user account info

### Utility Hooks
- `useAuth` - Authentication state
- `useDebounce` - Debounce values
- `useLocalStorage` - Local storage management

See [Hooks Documentation](./HOOKS.md) for detailed usage.

## Error Handling

### Global Error Handling
- Error boundaries for component errors
- API error classification and handling
- User-friendly error messages
- Error logging and monitoring

### Error Types
- **API Errors**: Server response errors
- **Network Errors**: Connection issues
- **Validation Errors**: Form validation failures
- **Authentication Errors**: Auth-related issues

## Performance Optimization

### React Query Optimization
- Intelligent caching strategies
- Background refetching
- Request deduplication
- Optimistic updates

### Component Optimization
- React.memo for expensive components
- useMemo and useCallback for re-render optimization
- Virtual scrolling for large lists
- Lazy loading for code splitting

### Bundle Optimization
- Dynamic imports for code splitting
- Tree shaking for unused code
- Image optimization with Next.js
- Asset preloading

## Testing Guide

### Unit Testing
```typescript
import { render, screen } from '@testing-library/react';
import { AuthModal } from '../components/AuthModal';

test('renders sign in form by default', () => {
  render(<AuthModal isOpen={true} onClose={() => {}} />);
  expect(screen.getByText('Sign In')).toBeInTheDocument();
});
```

### Integration Testing
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useStockMediaSearch } from '../hooks/useStockMediaIntegration';

test('should search for media', async () => {
  const { result } = renderHook(() => useStockMediaSearch());
  
  act(() => {
    result.current.search({ query: 'nature', site: 'shutterstock' });
  });
  
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
});
```

### E2E Testing
```typescript
import { test, expect } from '@playwright/test';

test('user can search and download media', async ({ page }) => {
  await page.goto('/stock-search');
  await page.fill('[data-testid="search-input"]', 'nature');
  await page.click('[data-testid="search-button"]');
  await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
});
```

## Deployment Guide

### Environment Variables

Set the following environment variables in your deployment platform:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_NEHTW_API_KEY=your_nehtw_key
NEXT_PUBLIC_NEHTW_BASE_URL=https://nehtw.com/api
```

### Build Configuration

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['example.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
```

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_NEHTW_API_KEY
```

#### Netlify
```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables in Netlify dashboard
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Monitoring and Analytics

### Built-in Monitoring
- Real-time system health monitoring
- API performance tracking
- Error logging and analytics
- User feedback collection

### Access Monitoring Dashboard
Visit `/monitoring` to access the comprehensive monitoring dashboard with:
- System health metrics
- API performance analytics
- Error tracking and trends
- User feedback insights

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

#### API Connection Issues
- Verify environment variables are set correctly
- Check API key permissions
- Ensure network connectivity
- Review API rate limits

#### Authentication Issues
- Verify Supabase configuration
- Check authentication providers setup
- Review user permissions
- Clear browser storage

### Debug Mode

Enable debug mode for detailed logging:

```env
NODE_ENV=development
DEBUG=true
```

### Support

For additional support:
- Check the [GitHub Issues](https://github.com/your-org/creo/issues)
- Review the [FAQ Section](./COMPONENTS.md#faq)
- Contact the development team

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests
- Document new features
- Follow the existing code style

### Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add appropriate labels
4. Request review from maintainers
5. Address feedback and merge

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### Version 1.0.0
- Initial release
- Complete NEHTW API integration
- Authentication system
- Stock media search and download
- AI image generation
- Order management system
- Monitoring dashboard
- Comprehensive documentation

---

For more detailed information, refer to the specific documentation files:
- [NEHTW Integration Guide](./NEHTW_INTEGRATION.md)
- [Component Usage Guide](./COMPONENTS.md)
- [Hooks Documentation](./HOOKS.md)
