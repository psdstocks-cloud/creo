# Pricing Rollback Info Component

A reusable React TypeScript component that displays information about the points rollback policy, featuring unused points automatically rolling over if users pay within 3 days after the payment due date, otherwise points reset. Styled with Tailwind CSS using brand orange gradient headings and glassmorphism card backgrounds with bilingual support and RTL layout compatibility.

## 🎯 Features

- **Multiple Variants** - Default, compact, and detailed display options
- **Bilingual Support** - English and Arabic with RTL layout compatibility
- **Glassmorphism Design** - Beautiful backdrop blur effects with brand colors
- **Interactive Timeline** - Visual step-by-step process explanation
- **Brand Color Integration** - Orange gradient headings and accents
- **Responsive Design** - Works on all screen sizes
- **TypeScript** - Full type safety
- **Accessibility** - Proper semantic markup and ARIA labels

## 🚀 Quick Start

```tsx
import PricingRollbackInfo from './PricingRollbackInfo';

function MyComponent() {
  return <PricingRollbackInfo />;
}
```

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'compact' \| 'detailed'` | `'default'` | Display variant of the component |
| `showIcon` | `boolean` | `true` | Show the info icon |
| `showTimeline` | `boolean` | `true` | Show the timeline steps |
| `className` | `string` | `''` | Additional CSS classes for container |
| `cardClassName` | `string` | `''` | Additional CSS classes for card |

## 🎨 Variants

### Default Variant
- Full information display
- Timeline with 3 steps
- Policy details and warnings
- Glassmorphism card design

### Compact Variant
- Condensed information
- Perfect for sidebars or small spaces
- Optional icon display
- Minimal footprint

### Detailed Variant
- Comprehensive information
- Two-column layout
- Full policy explanation
- Warning notices
- Complete timeline

## 🌐 Internationalization

### English Content
```json
{
  "PricingRollback": {
    "title": "Points Rollback Policy",
    "subtitle": "Understand how your unused points are handled when payments are due",
    "policyDescription": "We understand that sometimes you might miss a payment deadline. That's why we offer a 3-day grace period for unused points to roll over to your next billing cycle, ensuring you don't lose your investment.",
    "keyPoint1": "3-day grace period after payment due date",
    "keyPoint2": "Unused points automatically roll over if payment is made within grace period",
    "keyPoint3": "Points reset to zero if payment is not made within 3 days"
  }
}
```

### Arabic Content
```json
{
  "PricingRollback": {
    "title": "سياسة استرداد النقاط",
    "subtitle": "تعرف على كيفية التعامل مع نقاطك غير المستخدمة عند استحقاق المدفوعات",
    "policyDescription": "نفهم أنك قد تفوت موعد دفع أحياناً. لهذا نقدم فترة سماح لمدة 3 أيام لانتقال النقاط غير المستخدمة إلى دورة الفوترة التالية، مما يضمن عدم فقدان استثمارك.",
    "keyPoint1": "فترة سماح 3 أيام بعد تاريخ استحقاق الدفع",
    "keyPoint2": "النقاط غير المستخدمة تنتقل تلقائياً إذا تم الدفع خلال فترة السماح",
    "keyPoint3": "النقاط تعود إلى الصفر إذا لم يتم الدفع خلال 3 أيام"
  }
}
```

## 📝 Usage Examples

### Basic Usage
```tsx
<PricingRollbackInfo />
```

### Compact Variant
```tsx
<PricingRollbackInfo variant="compact" />
```

### Detailed Variant
```tsx
<PricingRollbackInfo variant="detailed" />
```

### Without Icon
```tsx
<PricingRollbackInfo showIcon={false} />
```

### Without Timeline
```tsx
<PricingRollbackInfo showTimeline={false} />
```

### Custom Styling
```tsx
<PricingRollbackInfo
  className="custom-container"
  cardClassName="custom-card"
/>
```

### Inline Usage
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">
    {/* Main content */}
  </div>
  <div>
    <PricingRollbackInfo variant="compact" />
  </div>
</div>
```

## 🎨 Design Features

### Glassmorphism Styling
- Semi-transparent backgrounds with backdrop blur
- Subtle borders and shadows
- Orange and purple brand color gradients
- Smooth hover and focus effects

### Brand Colors
- **Primary Orange**: `#F97316` - Main brand color for headings
- **Deep Purple**: `#6366F1` - Secondary brand color
- **Gradient Combinations**: Orange to orange-600, purple to purple-600

### RTL Support
- Automatic RTL detection from document direction
- Proper text alignment and spacing
- RTL-compatible icon positioning
- Correct layout flow

## 🔧 Component Structure

### Default Variant Structure
```tsx
<div className="glass-card p-6 rounded-2xl">
  {/* Header with icon and title */}
  <div className="flex items-start space-x-4">
    <div className="icon-container">
      <InfoIcon />
    </div>
    <div className="title-section">
      <h3>Points Rollback Policy</h3>
      <p>Subtitle</p>
    </div>
  </div>

  {/* Main content */}
  <div className="space-y-4">
    <div className="rollback-info">
      <h4>Points Roll Over</h4>
      <p>Description</p>
    </div>
    <div className="reset-info">
      <h4>Points Reset</h4>
      <p>Description</p>
    </div>
  </div>

  {/* Timeline */}
  <div className="timeline-section">
    <h4>How It Works</h4>
    <div className="timeline-steps">
      {/* Step 1: Payment Due Date */}
      {/* Step 2: 3-Day Grace Period */}
      {/* Step 3: Points Action */}
    </div>
  </div>

  {/* Footer note */}
  <div className="footer-note">
    <p>Policy applies to all subscription plans</p>
  </div>
</div>
```

### Compact Variant Structure
```tsx
<div className="glass-card p-4 rounded-xl">
  <div className="flex items-start space-x-3">
    <div className="icon-container">
      <InfoIcon />
    </div>
    <div className="content">
      <h3>Rollback Policy</h3>
      <p>Brief description</p>
    </div>
  </div>
</div>
```

### Detailed Variant Structure
```tsx
<div className="space-y-6">
  {/* Header section */}
  <div className="text-center">
    <h2>Points Rollback Policy</h2>
    <p>Detailed subtitle</p>
  </div>

  {/* Main info card */}
  <div className="glass-card p-8 rounded-2xl">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Policy information */}
      <div className="policy-section">
        <div className="policy-header">
          <InfoIcon />
          <h3>Rollback Policy</h3>
        </div>
        <p>Detailed policy description</p>
        
        {/* Key points */}
        <div className="key-points">
          <h4>Key Points</h4>
          <ul>
            <li>3-day grace period</li>
            <li>Automatic rollover</li>
            <li>Points reset</li>
          </ul>
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline-section">
        <h4>How It Works</h4>
        <div className="timeline-steps">
          {/* Timeline steps */}
        </div>
      </div>
    </div>
  </div>

  {/* Warning card */}
  <div className="warning-card">
    <WarningIcon />
    <h4>Important Notice</h4>
    <p>Warning description</p>
  </div>
</div>
```

## 🎭 Visual Components

### Icons
- **Info Icon**: Information display
- **Calendar Icon**: Payment due date
- **Clock Icon**: Grace period
- **Check Icon**: Points action
- **Warning Icon**: Important notices

### Color Coding
- **Green**: Completed steps
- **Orange**: Active/current steps
- **Gray**: Pending steps
- **Yellow**: Warning notices
- **Red**: Reset/reset actions

### Timeline Steps
1. **Payment Due Date** - Monthly payment due
2. **3-Day Grace Period** - Time to make payment
3. **Points Action** - Rollover or reset

## 📱 Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Stacked content
- Touch-friendly spacing
- Simplified timeline

### Tablet (768px - 1024px)
- Balanced layout
- Medium spacing
- Full feature set
- Optimized typography

### Desktop (> 1024px)
- Two-column layout (detailed variant)
- Full feature display
- Hover effects
- Complete information

## 🧪 Testing

### Unit Tests
```tsx
import { render, screen } from '@testing-library/react';
import PricingRollbackInfo from './PricingRollbackInfo';

test('renders pricing rollback info', () => {
  render(<PricingRollbackInfo />);
  expect(screen.getByText('Points Rollback Policy')).toBeInTheDocument();
});

test('renders compact variant', () => {
  render(<PricingRollbackInfo variant="compact" />);
  expect(screen.getByText('Rollback Policy')).toBeInTheDocument();
});

test('hides icon when showIcon is false', () => {
  render(<PricingRollbackInfo showIcon={false} />);
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});
```

### Integration Tests
```tsx
test('displays timeline when showTimeline is true', () => {
  render(<PricingRollbackInfo showTimeline={true} />);
  expect(screen.getByText('How It Works')).toBeInTheDocument();
});

test('hides timeline when showTimeline is false', () => {
  render(<PricingRollbackInfo showTimeline={false} />);
  expect(screen.queryByText('How It Works')).not.toBeInTheDocument();
});
```

## 🚨 Error Handling

The component handles various scenarios:

- **Missing Translations**: Graceful fallback to English
- **RTL Detection**: Automatic layout adjustment
- **Icon Rendering**: Fallback for missing icons
- **Content Loading**: Proper loading states

## 🔄 State Management

### Internal State
- `isRTL`: RTL layout detection
- `timelineSteps`: Timeline data array

### Props State
- `variant`: Display variant
- `showIcon`: Icon visibility
- `showTimeline`: Timeline visibility

## 🎯 Performance

### Optimizations
- `useEffect` for RTL detection
- Efficient re-renders
- Memoized timeline data
- Optimized icon rendering

### Bundle Size
- Component: ~3KB gzipped
- Dependencies: Minimal
- Total: ~3KB gzipped

## 🔗 Dependencies

### Required
- `react` - React library
- `next-intl` - Internationalization

### Optional
- `tailwindcss` - Styling (recommended)
- `@types/react` - TypeScript types

## 📄 TypeScript Types

### Component Props Interface
```typescript
interface PricingRollbackInfoProps {
  variant?: 'default' | 'compact' | 'detailed';
  showIcon?: boolean;
  showTimeline?: boolean;
  className?: string;
  cardClassName?: string;
}
```

### Timeline Step Interface
```typescript
interface TimelineStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: 'completed' | 'active' | 'pending';
}
```

## 🎨 Customization

### CSS Custom Properties
```css
.pricing-rollback-info {
  --primary-orange: #F97316;
  --deep-purple: #6366F1;
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}
```

### Custom Styling
```tsx
<PricingRollbackInfo
  className="my-custom-container"
  cardClassName="my-custom-card"
/>
```

```css
.my-custom-container {
  /* Custom container styles */
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.my-custom-card {
  /* Custom card styles */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

## 🔄 Version History

- **v1.0.0** - Initial release with basic functionality
- **v1.1.0** - Added multiple variants
- **v1.2.0** - Added RTL support and Arabic translations
- **v1.3.0** - Added glassmorphism design and brand colors
- **v1.4.0** - Added timeline and warning components
- **v1.5.0** - Added accessibility features and performance optimizations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

If you encounter any issues:

1. Check the examples in `PricingRollbackInfoExample.tsx`
2. Review the props documentation
3. Check the console for error messages
4. Open an issue in the repository

## 📄 License

This component is part of the Creo project and is licensed under the MIT License.
