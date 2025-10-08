# 🎨 Creo - AI-Powered Stock Media Platform

A comprehensive SaaS platform for stock media search, AI image generation, and content management with modern glassmorphism design and advanced UX features.

## ✨ Features

### 🎯 Core Functionality
- **Stock Media Search** - Search and download from multiple stock sites
- **AI Image Generation** - Create unique images with AI-powered generation
- **Order Management** - Track downloads and AI generation jobs
- **Credit System** - Flexible payment system with virtual payments
- **User Authentication** - Secure authentication with Supabase

### 🎨 Design System
- **Glassmorphism UI** - Modern glass-effect components
- **Orange/Purple Theme** - Professional brand colors
- **Responsive Design** - Mobile-first approach
- **Smooth Animations** - Framer Motion integration
- **Accessibility** - WCAG compliant components

### 🚀 Technical Features
- **Next.js 15** - Latest React framework with App Router
- **TypeScript** - Full type safety
- **TanStack Query** - Advanced data fetching and caching
- **Supabase SSR** - Server-side authentication
- **NEHTW API** - Stock media integration
- **Error Boundaries** - Comprehensive error handling
- **Toast Notifications** - User feedback system
- **Skeleton Loading** - Enhanced UX during loading

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Heroicons** for icons

### Backend & APIs
- **Supabase** for authentication and database
- **NEHTW API** for stock media
- **Vercel** for deployment
- **Stripe** for payments (optional)

### Development Tools
- **ESLint** for code quality
- **Prettier** for code formatting
- **React Query DevTools** for debugging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- NEHTW API access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/creo.git
   cd creo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📋 Environment Setup

### Required Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NEHTW API
NEXT_PUBLIC_NEHTW_API_KEY=your_nehtw_api_key
NEXT_PUBLIC_NEHTW_BASE_URL=https://nehtw.com/api

# Virtual Payments (Development)
NEXT_PUBLIC_VIRTUAL_PAYMENTS=true
NEXT_PUBLIC_PAYMENT_SUCCESS_RATE=0.9
```

### Optional Variables
```env
# Stripe (for real payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── billing/           # Payment pages
│   └── ...
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── payments/         # Payment components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## 🎨 Design System

### Color Palette
- **Primary Orange**: `#f97316`
- **Primary Purple**: `#7c3aed`
- **Glass Effects**: Semi-transparent overlays
- **Gradients**: Orange to purple transitions

### Components
- **GlassCard** - Glassmorphism container
- **BrandButton** - Branded button component
- **BrandInput** - Styled input component
- **Skeleton** - Loading state component
- **Toast** - Notification system

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Quality
- **TypeScript** - Strict mode enabled
- **ESLint** - Configured for Next.js
- **Prettier** - Code formatting
- **Husky** - Git hooks (optional)

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect to Vercel**
   ```bash
   vercel login
   vercel link
   ```

2. **Set environment variables**
   - Go to Vercel dashboard
   - Add all required environment variables

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment
```bash
# Build the application
npm run build

# Deploy to your preferred platform
# (Netlify, AWS, etc.)
```

## 📊 Monitoring & Analytics

### Recommended Tools
- **Vercel Analytics** - Performance monitoring
- **Sentry** - Error tracking
- **Supabase Dashboard** - Database monitoring
- **Google Analytics** - User analytics

## 🔐 Security

### Authentication
- **Supabase Auth** - Secure authentication
- **JWT Tokens** - Stateless authentication
- **Row Level Security** - Database security

### API Security
- **Rate Limiting** - Prevent abuse
- **CORS Configuration** - Cross-origin security
- **Environment Variables** - Secure configuration

## 🧪 Testing

### Manual Testing
1. **Authentication Flow**
   - Sign up/Sign in
   - Password reset
   - Session management

2. **Stock Media Search**
   - Search functionality
   - Order creation
   - Download process

3. **AI Generation**
   - Job creation
   - Progress tracking
   - Result download

4. **Payment System**
   - Virtual payments
   - Credit management
   - Order history

## 📈 Performance

### Optimization Features
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Automatic bundle splitting
- **Caching** - TanStack Query caching
- **Lazy Loading** - Component lazy loading

### Performance Metrics
- **Core Web Vitals** - Optimized for Google metrics
- **Bundle Size** - Minimized JavaScript bundles
- **Loading Times** - Fast initial page load

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests if applicable**
5. **Submit a pull request**

### Code Standards
- **TypeScript** - Use strict typing
- **ESLint** - Follow linting rules
- **Prettier** - Consistent formatting
- **Conventional Commits** - Clear commit messages

## 📚 Documentation

### Additional Resources
- [Environment Setup Guide](./ENVIRONMENT_SETUP.md)
- [API Documentation](./src/docs/)
- [Component Library](./src/components/)
- [Type Definitions](./src/types/)

## 🆘 Support

### Getting Help
- **Documentation** - Check the docs first
- **Issues** - Create GitHub issues
- **Discussions** - Use GitHub discussions
- **Email** - Contact the development team

### Common Issues
- **Build Errors** - Check environment variables
- **API Errors** - Verify API keys
- **Authentication** - Check Supabase configuration
- **Deployment** - Check Vercel configuration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Supabase Team** - Excellent backend platform
- **Tailwind CSS** - Beautiful utility-first CSS
- **Vercel** - Seamless deployment platform

---

**Built with ❤️ by the Creo Team**