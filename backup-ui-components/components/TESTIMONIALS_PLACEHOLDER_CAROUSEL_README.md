# Testimonials Placeholder Carousel Component

A React TypeScript carousel component with Framer Motion animations that displays anonymized testimonial cards with placeholder content, supporting bilingual text and RTL layout for Arabic.

## 🎯 Features

- **Framer Motion Animations** - Smooth transitions and micro-interactions
- **Anonymized Testimonials** - Placeholder content with initials and locations
- **Bilingual Support** - English and Arabic with RTL layout compatibility
- **Glassmorphism Design** - Beautiful backdrop blur effects with brand colors
- **Auto-play Functionality** - Configurable automatic rotation
- **Interactive Controls** - Navigation arrows, dots, and play/pause
- **Responsive Design** - Works on all screen sizes
- **TypeScript** - Full type safety
- **Accessibility** - ARIA labels and keyboard navigation

## 🚀 Quick Start

```tsx
import TestimonialsPlaceholderCarousel from './TestimonialsPlaceholderCarousel';

function MyComponent() {
  return <TestimonialsPlaceholderCarousel />;
}
```

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoPlay` | `boolean` | `true` | Enable automatic carousel rotation |
| `autoPlayInterval` | `number` | `5000` | Interval between slides in milliseconds |
| `showDots` | `boolean` | `true` | Show dot navigation indicators |
| `showArrows` | `boolean` | `true` | Show previous/next arrow buttons |
| `showPauseButton` | `boolean` | `true` | Show play/pause control button |
| `className` | `string` | `''` | Additional CSS classes for container |
| `cardClassName` | `string` | `''` | Additional CSS classes for testimonial cards |
| `maxCards` | `number` | `5` | Maximum number of testimonial cards to show |

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
- Proper arrow and layout positioning
- RTL-compatible animations
- Correct text alignment

## 🌐 Internationalization

### English Content
```json
{
  "TestimonialsPlaceholder": {
    "title": "What Our Users Say",
    "subtitle": "Real stories from creators who trust Creo for their creative needs",
    "testimonial1Name": "Sarah M.",
    "testimonial1City": "Cairo",
    "testimonial1Country": "Egypt",
    "testimonial1Content": "Creo has completely transformed my workflow...",
    "testimonial1Highlight": "Saved 70% on stock image costs"
  }
}
```

### Arabic Content
```json
{
  "TestimonialsPlaceholder": {
    "title": "ماذا يقول مستخدمونا",
    "subtitle": "قصص حقيقية من المبدعين الذين يثقون في كريو لاحتياجاتهم الإبداعية",
    "testimonial1Name": "سارة م.",
    "testimonial1City": "القاهرة",
    "testimonial1Country": "مصر",
    "testimonial1Content": "كريو غيرت سير عملي بالكامل...",
    "testimonial1Highlight": "وفرت 70% من تكاليف صور الأسهم"
  }
}
```

## 📝 Usage Examples

### Basic Usage
```tsx
<TestimonialsPlaceholderCarousel />
```

### Custom Configuration
```tsx
<TestimonialsPlaceholderCarousel
  autoPlay={true}
  autoPlayInterval={4000}
  showDots={true}
  showArrows={true}
  showPauseButton={true}
  maxCards={4}
/>
```

### Manual Control
```tsx
<TestimonialsPlaceholderCarousel
  autoPlay={false}
  showPauseButton={false}
  showArrows={true}
  showDots={true}
/>
```

### Custom Styling
```tsx
<TestimonialsPlaceholderCarousel
  className="custom-carousel-container"
  cardClassName="custom-testimonial-card"
/>
```

### Limited Testimonials
```tsx
<TestimonialsPlaceholderCarousel
  maxCards={3}
  autoPlayInterval={3000}
/>
```

## 🎭 Animation Features

### Framer Motion Variants
- **Card Variants**: Enter, center, and exit animations
- **Slide Variants**: Smooth horizontal transitions
- **Star Rating**: Staggered star appearance
- **Quote Icon**: Rotating entrance animation
- **Progress Bar**: Linear progress indicator

### Animation Timing
- **Enter Animation**: 0.3s spring transition
- **Exit Animation**: 0.2s opacity fade
- **Scale Animation**: 0.3s scale transition
- **Star Stagger**: 0.1s delay between stars

## 🎨 Visual Components

### Testimonial Card Structure
```tsx
<div className="glass-card p-8 rounded-2xl">
  {/* Quote Icon */}
  <div className="quote-icon">
    <svg>...</svg>
  </div>
  
  {/* Testimonial Content */}
  <blockquote>"{content}"</blockquote>
  
  {/* Highlight Badge */}
  <div className="highlight-badge">
    {highlight}
  </div>
  
  {/* Author Info */}
  <div className="author-info">
    <div className="avatar">{name.charAt(0)}</div>
    <div className="details">
      <h4>{name}</h4>
      <p>{city}, {country}</p>
      <div className="stars">{renderStars(rating)}</div>
    </div>
  </div>
</div>
```

### Navigation Controls
- **Arrow Buttons**: Previous/Next navigation
- **Dot Indicators**: Direct slide navigation
- **Play/Pause Button**: Auto-play control
- **Progress Bar**: Visual progress indicator

## 🔧 Customization

### CSS Custom Properties
```css
.testimonials-carousel {
  --primary-orange: #F97316;
  --deep-purple: #6366F1;
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --animation-duration: 0.3s;
}
```

### Custom Styling
```tsx
<TestimonialsPlaceholderCarousel
  className="my-custom-carousel"
  cardClassName="my-custom-card"
/>
```

```css
.my-custom-carousel {
  /* Custom container styles */
  border-radius: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.my-custom-card {
  /* Custom card styles */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

## 📱 Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Touch-friendly controls
- Larger touch targets
- Simplified navigation

### Tablet (768px - 1024px)
- Centered layout
- Medium-sized controls
- Balanced spacing
- Full feature set

### Desktop (> 1024px)
- Full feature layout
- Hover effects
- Detailed animations
- Complete navigation

## 🧪 Testing

### Unit Tests
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TestimonialsPlaceholderCarousel from './TestimonialsPlaceholderCarousel';

test('renders testimonials carousel', () => {
  render(<TestimonialsPlaceholderCarousel />);
  expect(screen.getByText('What Our Users Say')).toBeInTheDocument();
});

test('navigates to next slide', () => {
  render(<TestimonialsPlaceholderCarousel autoPlay={false} />);
  const nextButton = screen.getByLabelText('Next testimonial');
  fireEvent.click(nextButton);
  // Assert navigation occurred
});
```

### Integration Tests
```tsx
test('auto-play functionality', async () => {
  render(<TestimonialsPlaceholderCarousel autoPlayInterval={1000} />);
  
  // Wait for auto-play to trigger
  await waitFor(() => {
    // Assert slide change occurred
  }, { timeout: 2000 });
});
```

## 🚨 Error Handling

The component handles various scenarios:

- **No Testimonials**: Shows empty state message
- **Single Testimonial**: Hides navigation controls
- **Animation Errors**: Graceful fallback to static display
- **RTL Detection**: Automatic layout adjustment

## 🔄 State Management

### Internal State
- `currentIndex`: Current slide index
- `isPlaying`: Auto-play state
- `isRTL`: RTL layout detection
- `testimonials`: Testimonial data array

### Navigation Functions
- `goToNext()`: Navigate to next slide
- `goToPrevious()`: Navigate to previous slide
- `goToSlide(index)`: Navigate to specific slide
- `togglePlayPause()`: Toggle auto-play state

## 🎯 Performance

### Optimizations
- `useCallback` for event handlers
- Efficient re-renders with Framer Motion
- Memoized testimonial data
- Optimized animation variants

### Bundle Size
- Component: ~8KB gzipped
- Framer Motion: ~15KB gzipped (shared dependency)
- Total: ~23KB gzipped

## 🔗 Dependencies

### Required
- `react` - React library
- `framer-motion` - Animation library
- `next-intl` - Internationalization

### Optional
- `tailwindcss` - Styling (recommended)
- `@types/react` - TypeScript types

## 📄 TypeScript Types

### TestimonialCard Interface
```typescript
interface TestimonialCard {
  id: string;
  name: string;
  city: string;
  country: string;
  rating: number;
  content: string;
  highlight: string;
  avatar: string;
}
```

### Component Props Interface
```typescript
interface TestimonialsPlaceholderCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  showPauseButton?: boolean;
  className?: string;
  cardClassName?: string;
  maxCards?: number;
}
```

## 🎨 Animation Variants

### Card Variants
```typescript
const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
  }),
};
```

### Slide Variants
```typescript
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};
```

## 🔄 Version History

- **v1.0.0** - Initial release with basic carousel functionality
- **v1.1.0** - Added Framer Motion animations
- **v1.2.0** - Added RTL support and Arabic translations
- **v1.3.0** - Added glassmorphism design and brand colors
- **v1.4.0** - Added auto-play controls and progress indicator
- **v1.5.0** - Added accessibility features and performance optimizations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

If you encounter any issues:

1. Check the examples in `TestimonialsPlaceholderCarouselExample.tsx`
2. Review the props documentation
3. Check the console for error messages
4. Open an issue in the repository

## 📄 License

This component is part of the Creo project and is licensed under the MIT License.
