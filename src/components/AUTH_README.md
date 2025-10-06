# Authentication Components for Creo

This directory contains comprehensive authentication components built with Supabase Auth, React Hook Form, and Zod validation, supporting both English and Arabic with RTL layout.

## 🚀 Features

- **Email & Password Authentication** - Sign up, sign in, password reset
- **Social Login** - Google, Facebook, GitHub, Twitter
- **Form Validation** - Client-side validation with Zod schemas
- **Bilingual Support** - English and Arabic with RTL layout
- **Glassmorphism Design** - Beautiful UI with Tailwind CSS
- **TypeScript** - Full type safety throughout
- **Error Handling** - Comprehensive error states and messages
- **Loading States** - Smooth loading indicators
- **Responsive Design** - Works on all screen sizes

## 📁 Files Structure

```
src/
├── components/
│   ├── AuthModal.tsx          # Main authentication modal
│   ├── AuthButton.tsx         # Simple auth button component
│   ├── AuthExample.tsx        # Complete usage example
│   ├── AuthUsage.tsx          # Simple usage examples
│   └── AUTH_README.md         # This file
├── contexts/
│   └── AuthContext.tsx        # Authentication context provider
├── lib/
│   ├── supabase.ts           # Supabase client configuration
│   └── validation.ts         # Form validation schemas
└── types/
    └── auth.ts               # Authentication types
```

## 🛠 Setup Instructions

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared react-hook-form @hookform/resolvers zod
```

### 2. Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and anon key
3. Enable authentication providers in Authentication > Settings
4. Configure OAuth providers (Google, Facebook, etc.) if needed

### 4. Wrap Your App with AuthProvider

```tsx
// app/layout.tsx or pages/_app.tsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

## 🎯 Usage Examples

### Basic AuthButton

```tsx
import AuthButton from '@/components/AuthButton';

function MyComponent() {
  return (
    <div>
      <AuthButton initialMode="signin" />
      <AuthButton initialMode="signup" />
    </div>
  );
}
```

### Custom Styling

```tsx
<AuthButton 
  variant="primary"
  size="lg"
  className="w-full"
  initialMode="signin"
>
  Sign In
</AuthButton>
```

### With Success Callback

```tsx
<AuthButton 
  initialMode="signin"
  onSuccess={(user) => {
    console.log('User signed in:', user);
    // Redirect or update UI
  }}
/>
```

### Using Auth Context

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <AuthButton initialMode="signin" />
      )}
    </div>
  );
}
```

### Direct Modal Usage

```tsx
import { useState } from 'react';
import AuthModal from '@/components/AuthModal';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Open Auth Modal
      </button>
      
      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialMode="signin"
        onSuccess={(user) => {
          console.log('User authenticated:', user);
          setShowModal(false);
        }}
      />
    </div>
  );
}
```

## 🎨 Styling Customization

### Button Variants

- `primary` - Orange gradient (default)
- `secondary` - Glassmorphism style
- `outline` - Transparent with border

### Button Sizes

- `sm` - Small (px-3 py-1.5)
- `md` - Medium (px-4 py-2) - default
- `lg` - Large (px-6 py-3)

### Custom Classes

```tsx
<AuthButton 
  className="bg-blue-500 hover:bg-blue-600 rounded-full"
  initialMode="signin"
>
  Custom Button
</AuthButton>
```

## 🌐 Internationalization

The components support English and Arabic with automatic RTL detection:

```tsx
// The components automatically detect RTL from document.dir
// or you can manually set the locale in validation.ts
```

### Adding New Languages

1. Add translations to `locales/[lang].json`
2. Update the `getErrorMessage` function in `validation.ts`
3. Add locale detection logic in `AuthModal.tsx`

## 🔧 Form Validation

The components use Zod schemas for validation:

- **Email**: Valid email format required
- **Password**: Minimum 8 characters, must include uppercase, lowercase, and number
- **Confirm Password**: Must match password
- **Full Name**: Minimum 2 characters (optional for sign up)
- **Terms**: Must be accepted for sign up

### Custom Validation

```tsx
// Modify validation.ts to add custom rules
export const customSignUpSchema = signUpSchema.extend({
  customField: z.string().min(1, 'Custom field is required'),
});
```

## 🚨 Error Handling

The components handle various error scenarios:

- **Network errors** - Connection issues
- **Validation errors** - Form validation failures
- **Auth errors** - Supabase authentication errors
- **Rate limiting** - Too many requests
- **Email confirmation** - Unconfirmed email addresses

### Error Message Customization

```tsx
// Modify getErrorMessage in validation.ts
const errorMessages = {
  'Custom Error': {
    en: 'Custom error message in English',
    ar: 'رسالة خطأ مخصصة بالعربية',
  },
};
```

## 🔐 Security Features

- **Password Requirements** - Strong password enforcement
- **Email Validation** - Proper email format checking
- **CSRF Protection** - Built into Supabase
- **Secure Tokens** - JWT tokens with expiration
- **HTTPS Only** - Secure transmission (in production)

## 📱 Responsive Design

The components are fully responsive:

- **Mobile** - Stacked layout, touch-friendly buttons
- **Tablet** - Optimized spacing and sizing
- **Desktop** - Full feature layout with proper spacing

## 🧪 Testing

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import AuthButton from '@/components/AuthButton';

test('renders sign in button', () => {
  render(<AuthButton initialMode="signin" />);
  expect(screen.getByText('Sign In')).toBeInTheDocument();
});
```

### Integration Tests

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthModal from '@/components/AuthModal';

test('handles sign in form submission', async () => {
  render(<AuthModal isOpen={true} onClose={jest.fn()} />);
  
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'password123' }
  });
  fireEvent.click(screen.getByText('Sign In'));
  
  await waitFor(() => {
    // Assert expected behavior
  });
});
```

## 🚀 Deployment

### Environment Variables

Make sure to set these in your deployment platform:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
```

### Supabase Configuration

1. Update your Supabase project settings
2. Configure allowed redirect URLs
3. Set up OAuth providers for production
4. Enable email templates for production

## 📚 API Reference

### AuthButton Props

```tsx
interface AuthButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  initialMode?: 'signin' | 'signup';
  onSuccess?: (user: any) => void;
  className?: string;
  children?: React.ReactNode;
}
```

### AuthModal Props

```tsx
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'reset' | 'update';
  onSuccess?: (user: any) => void;
  className?: string;
}
```

### AuthContext

```tsx
interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  signInWithProvider: (provider: string) => Promise<{ data: any; error: any }>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  updatePassword: (password: string) => Promise<{ data: any; error: any }>;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review the [React Hook Form docs](https://react-hook-form.com/)
3. Check the [Zod validation docs](https://zod.dev/)
4. Open an issue in the repository

## 🔄 Updates

- **v1.0.0** - Initial release with basic auth functionality
- **v1.1.0** - Added social login support
- **v1.2.0** - Added bilingual support and RTL layout
- **v1.3.0** - Added form validation and error handling
- **v1.4.0** - Added glassmorphism design and responsive layout
