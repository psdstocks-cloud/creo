# FAQ Accordion Friendly Component

An accessible React TypeScript accordion FAQ component with glassmorphism styling for Creo, featuring a friendly conversational tone, comprehensive search and filtering capabilities, and full bilingual support with RTL layout compatibility.

## 🎯 Features

- **Friendly Conversational Tone** - Warm, approachable language that makes users feel comfortable
- **Bilingual Support** - English and Arabic with RTL layout compatibility
- **Advanced Search** - Real-time search through questions and answers
- **Category Filtering** - Filter FAQs by categories (Account, Billing, Features, Support)
- **Status Badges** - "New" and "Popular" badges for important content
- **Glassmorphism Design** - Beautiful backdrop blur effects with brand colors
- **Accessibility** - Full ARIA support, keyboard navigation, and screen reader compatibility
- **Responsive Design** - Works perfectly on all screen sizes
- **TypeScript** - Full type safety and IntelliSense support
- **Customizable** - Flexible configuration options and styling

## 🚀 Quick Start

```tsx
import FAQAccordionFriendly from './FAQAccordionFriendly';

function MyComponent() {
  return <FAQAccordionFriendly />;
}
```

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `FAQItem[]` | `[]` | Custom FAQ items array |
| `allowMultiple` | `boolean` | `true` | Allow multiple items to be open |
| `defaultOpenItems` | `string[]` | `[]` | Items to open by default |
| `showCategories` | `boolean` | `true` | Show category badges |
| `showSearch` | `boolean` | `true` | Show search functionality |
| `showFilters` | `boolean` | `true` | Show category filters |
| `className` | `string` | `''` | Additional CSS classes for container |
| `itemClassName` | `string` | `''` | Additional CSS classes for items |
| `searchPlaceholder` | `string` | `undefined` | Custom search placeholder |
| `noResultsText` | `string` | `undefined` | Custom no results text |

## 🎨 FAQ Item Interface

```typescript
interface FAQItem {
  id: string;                    // Unique identifier
  question: string;              // FAQ question
  answer: string;                // FAQ answer
  category?: string;             // Optional category
  isNew?: boolean;               // Show "New" badge
  isPopular?: boolean;           // Show "Popular" badge
}
```

## 🌐 Internationalization

### English Content
```json
{
  "FAQFriendly": {
    "title": "Frequently Asked Questions",
    "subtitle": "Got questions? We've got answers! Find everything you need to know about Creo in our friendly FAQ section.",
    "searchPlaceholder": "Search questions...",
    "allCategories": "All Categories",
    "categoryAccount": "Account",
    "categoryBilling": "Billing",
    "categoryFeatures": "Features",
    "categorySupport": "Support",
    "newBadge": "New",
    "popularBadge": "Popular",
    "ctaTitle": "Still have questions?",
    "ctaDescription": "Can't find what you're looking for? Our friendly support team is here to help!",
    "ctaButton1": "Contact Support",
    "ctaButton2": "Browse Help Center"
  }
}
```

### Arabic Content
```json
{
  "FAQFriendly": {
    "title": "الأسئلة الشائعة",
    "subtitle": "لديك أسئلة؟ لدينا إجابات! اعثر على كل ما تحتاج لمعرفته حول كريو في قسم الأسئلة الشائعة الودود.",
    "searchPlaceholder": "ابحث في الأسئلة...",
    "allCategories": "جميع الفئات",
    "categoryAccount": "الحساب",
    "categoryBilling": "الفوترة",
    "categoryFeatures": "الميزات",
    "categorySupport": "الدعم",
    "newBadge": "جديد",
    "popularBadge": "شائع",
    "ctaTitle": "لا تزال لديك أسئلة؟",
    "ctaDescription": "لا تجد ما تبحث عنه؟ فريق الدعم الودود لدينا هنا لمساعدتك!",
    "ctaButton1": "اتصل بالدعم",
    "ctaButton2": "تصفح مركز المساعدة"
  }
}
```

## 📝 Usage Examples

### Basic Usage
```tsx
<FAQAccordionFriendly />
```

### Custom Configuration
```tsx
<FAQAccordionFriendly
  allowMultiple={true}
  defaultOpenItems={['account-creation']}
  showSearch={true}
  showFilters={true}
  showCategories={true}
  className="custom-container"
  itemClassName="custom-item"
/>
```

### Custom FAQ Items
```tsx
const customFAQs = [
  {
    id: 'custom-1',
    question: 'What makes Creo different?',
    answer: 'Creo gives you access to over 20 premium stock media platforms with just one subscription!',
    category: 'features',
    isNew: true,
    isPopular: false
  }
];

<FAQAccordionFriendly items={customFAQs} />
```

### Single Item Expansion
```tsx
<FAQAccordionFriendly allowMultiple={false} />
```

### Without Search
```tsx
<FAQAccordionFriendly showSearch={false} />
```

### Without Categories
```tsx
<FAQAccordionFriendly showFilters={false} />
```

### Pre-opened Items
```tsx
<FAQAccordionFriendly
  defaultOpenItems={['account-creation', 'ai-image-generation']}
/>
```

## 🎨 Design Features

### Glassmorphism Styling
- Semi-transparent backgrounds with backdrop blur
- Subtle borders and shadows
- Orange and purple brand color gradients
- Smooth hover and focus effects

### Brand Colors
- **Primary Orange**: `#F97316` - Main brand color
- **Deep Purple**: `#6366F1` - Secondary brand color
- **Gradient Combinations**: Orange to orange-600, purple to purple-600

### RTL Support
- Automatic RTL detection from document direction
- Proper text alignment and spacing
- RTL-compatible icon positioning
- Correct layout flow

### Status Badges
- **New Badge**: Green background for new content
- **Popular Badge**: Blue background for popular content
- **Category Badges**: Orange background for categories

## 🔧 Component Structure

### Main Container
```tsx
<div className="space-y-6">
  {/* Header */}
  <div className="text-center">
    <h2>Frequently Asked Questions</h2>
    <p>Subtitle</p>
  </div>

  {/* Search and Filters */}
  <div className="glass-card p-6 rounded-2xl">
    {/* Search Bar */}
    <div className="relative">
      <input type="text" placeholder="Search questions..." />
    </div>
    
    {/* Category Filters */}
    <div className="flex flex-wrap gap-2">
      {/* Filter buttons */}
    </div>
  </div>

  {/* FAQ Items */}
  <div className="space-y-4">
    {/* FAQ Items */}
  </div>

  {/* Footer CTA */}
  <div className="glass-card p-8 rounded-2xl">
    {/* CTA content */}
  </div>
</div>
```

### FAQ Item Structure
```tsx
<div className="glass-card rounded-2xl overflow-hidden">
  {/* Question Header */}
  <button className="w-full px-6 py-4 text-left">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3>Question</h3>
        <div className="badges">
          {/* Category and status badges */}
        </div>
      </div>
      <div className="expand-icon">
        {/* Expand/collapse icon */}
      </div>
    </div>
  </button>

  {/* Answer Content */}
  <div className="answer-content">
    <div className="px-6 pb-4">
      <p>Answer</p>
    </div>
  </div>
</div>
```

## 🎭 Visual Components

### Icons
- **Search Icon**: Magnifying glass for search
- **Expand Icon**: Chevron down for expand/collapse
- **Category Icons**: Visual indicators for categories

### Color Coding
- **Green**: New content badges
- **Blue**: Popular content badges
- **Orange**: Category badges and primary actions
- **Gray**: Default text and inactive states

### Categories
- **Account**: User account related questions
- **Billing**: Payment and subscription questions
- **Features**: Platform features and functionality
- **Support**: Help and support questions

## 📱 Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Stacked search and filters
- Touch-friendly spacing
- Simplified badges

### Tablet (768px - 1024px)
- Balanced layout
- Medium spacing
- Full feature set
- Optimized typography

### Desktop (> 1024px)
- Full feature display
- Hover effects
- Complete information
- Optimal spacing

## 🧪 Testing

### Unit Tests
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import FAQAccordionFriendly from './FAQAccordionFriendly';

test('renders FAQ accordion', () => {
  render(<FAQAccordionFriendly />);
  expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
});

test('toggles FAQ item', () => {
  render(<FAQAccordionFriendly />);
  const button = screen.getByText('How do I create a Creo account?');
  fireEvent.click(button);
  expect(screen.getByText(/Creating your Creo account is super easy/)).toBeInTheDocument();
});

test('filters by category', () => {
  render(<FAQAccordionFriendly />);
  const billingButton = screen.getByText('Billing');
  fireEvent.click(billingButton);
  // Check that only billing items are shown
});
```

### Integration Tests
```tsx
test('search functionality works', () => {
  render(<FAQAccordionFriendly />);
  const searchInput = screen.getByPlaceholderText('Search questions...');
  fireEvent.change(searchInput, { target: { value: 'account' } });
  // Check that only matching items are shown
});

test('RTL layout works correctly', () => {
  document.documentElement.dir = 'rtl';
  render(<FAQAccordionFriendly />);
  // Check RTL-specific styling and layout
});
```

## 🚨 Error Handling

The component handles various scenarios:

- **Missing Translations**: Graceful fallback to English
- **RTL Detection**: Automatic layout adjustment
- **Search Errors**: Proper error states
- **Content Loading**: Loading states for dynamic content

## 🔄 State Management

### Internal State
- `openItems`: Array of open item IDs
- `searchQuery`: Current search term
- `selectedCategory`: Currently selected category
- `isRTL`: RTL layout detection

### Props State
- `items`: FAQ items array
- `allowMultiple`: Multiple expansion setting
- `defaultOpenItems`: Initially open items

## 🎯 Performance

### Optimizations
- `useEffect` for RTL detection
- Efficient re-renders
- Memoized filtered items
- Optimized search functionality

### Bundle Size
- Component: ~5KB gzipped
- Dependencies: Minimal
- Total: ~5KB gzipped

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
interface FAQAccordionFriendlyProps {
  items?: FAQItem[];
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
  showCategories?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  className?: string;
  itemClassName?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
}
```

### FAQ Item Interface
```typescript
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isNew?: boolean;
  isPopular?: boolean;
}
```

## 🎨 Customization

### CSS Custom Properties
```css
.faq-accordion-friendly {
  --primary-orange: #F97316;
  --deep-purple: #6366F1;
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}
```

### Custom Styling
```tsx
<FAQAccordionFriendly
  className="my-custom-container"
  itemClassName="my-custom-item"
/>
```

```css
.my-custom-container {
  /* Custom container styles */
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.my-custom-item {
  /* Custom item styles */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

## 🔄 Version History

- **v1.0.0** - Initial release with basic functionality
- **v1.1.0** - Added search and filtering
- **v1.2.0** - Added RTL support and Arabic translations
- **v1.3.0** - Added glassmorphism design and brand colors
- **v1.4.0** - Added status badges and categories
- **v1.5.0** - Added accessibility features and performance optimizations
- **v1.6.0** - Added friendly conversational tone and enhanced UX

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

If you encounter any issues:

1. Check the examples in `FAQAccordionFriendlyExample.tsx`
2. Review the props documentation
3. Check the console for error messages
4. Open an issue in the repository

## 📄 License

This component is part of the Creo project and is licensed under the MIT License.

## 🌟 Key Features Summary

- **Friendly Tone**: Warm, conversational language that makes users feel comfortable
- **Bilingual Support**: Full English and Arabic support with RTL layout
- **Advanced Search**: Real-time search through questions and answers
- **Category Filtering**: Filter by Account, Billing, Features, Support
- **Status Badges**: "New" and "Popular" badges for important content
- **Glassmorphism Design**: Beautiful backdrop blur effects
- **Accessibility**: Full ARIA support and keyboard navigation
- **Responsive**: Works perfectly on all screen sizes
- **TypeScript**: Full type safety and IntelliSense
- **Customizable**: Flexible configuration and styling options

The FAQ Accordion Friendly component provides an excellent user experience with its warm, approachable tone and comprehensive functionality, making it perfect for helping users find answers to their questions about Creo!
