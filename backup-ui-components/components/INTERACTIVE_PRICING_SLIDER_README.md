# Interactive Pricing Slider Component

A React functional component with TypeScript that provides an interactive range slider for point selection (1-500) with real-time pricing calculation using the tiered pricing utility.

## 🎯 Features

- **Interactive Range Slider** - Smooth slider for 1-500 points selection
- **Numeric Input Sync** - Input box synchronized with slider
- **Real-time Pricing** - Live calculation using tiered pricing utility
- **Bilingual Support** - English and Arabic with RTL layout
- **Glassmorphism Design** - Beautiful UI with backdrop blur effects
- **Quick Select Presets** - Common point values for easy selection
- **Tier Information** - Display current pricing tier details
- **Savings Display** - Show savings compared to highest rate
- **Responsive Design** - Works on all screen sizes
- **TypeScript** - Full type safety

## 🚀 Quick Start

```tsx
import InteractivePricingSlider from './InteractivePricingSlider';

function MyComponent() {
  return (
    <InteractivePricingSlider
      initialPoints={100}
      onPointsChange={(points) => console.log('Points:', points)}
      onCostChange={(cost) => console.log('Cost:', cost)}
    />
  );
}
```

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialPoints` | `number` | `50` | Initial number of points |
| `minPoints` | `number` | `1` | Minimum selectable points |
| `maxPoints` | `number` | `500` | Maximum selectable points |
| `step` | `number` | `1` | Step size for slider/input |
| `onPointsChange` | `(points: number) => void` | `undefined` | Callback when points change |
| `onCostChange` | `(cost: number) => void` | `undefined` | Callback when cost changes |
| `showTierInfo` | `boolean` | `true` | Show tier information |
| `showSavings` | `boolean` | `true` | Show savings information |
| `className` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disable the component |

## 🎨 Styling

### Glassmorphism Design
The component uses glassmorphism effects with:
- `glass-card` utility class for backdrop blur
- Semi-transparent backgrounds
- Subtle borders and shadows
- Orange brand color highlights

### RTL Support
- Automatic RTL detection from `document.documentElement.dir`
- Proper layout adjustments for Arabic
- RTL-compatible slider and input positioning

### Responsive Design
- Mobile-first approach
- Touch-friendly slider controls
- Adaptive button layouts
- Flexible grid systems

## 🌐 Internationalization

### English Translations
```json
{
  "PricingSlider": {
    "title": "Interactive Pricing Calculator",
    "subtitle": "Adjust the slider or enter points to see real-time pricing with our tiered system",
    "pointsLabel": "Number of Points",
    "pointsUnit": "points",
    "sliderLabel": "Select Points",
    "quickSelect": "Quick Select",
    "totalCost": "Total Cost",
    "perPoint": "per point",
    "points": "points",
    "savings": "You Save",
    "comparedToHighestRate": "compared to highest rate",
    "purchaseButton": "Purchase",
    "saveForLater": "Save for Later",
    "calculating": "Calculating pricing..."
  }
}
```

### Arabic Translations
```json
{
  "PricingSlider": {
    "title": "حاسبة الأسعار التفاعلية",
    "subtitle": "اضبط المنزلق أو أدخل النقاط لرؤية التسعير الفوري مع نظامنا المتدرج",
    "pointsLabel": "عدد النقاط",
    "pointsUnit": "نقطة",
    "sliderLabel": "اختر النقاط",
    "quickSelect": "اختيار سريع",
    "totalCost": "التكلفة الإجمالية",
    "perPoint": "لكل نقطة",
    "points": "نقاط",
    "savings": "توفيرك",
    "comparedToHighestRate": "مقارنة بأعلى سعر",
    "purchaseButton": "شراء",
    "saveForLater": "حفظ لاحقاً",
    "calculating": "جاري حساب التسعير..."
  }
}
```

## 📝 Usage Examples

### Basic Usage
```tsx
<InteractivePricingSlider
  initialPoints={100}
  onPointsChange={(points) => setSelectedPoints(points)}
  onCostChange={(cost) => setTotalCost(cost)}
/>
```

### Custom Range
```tsx
<InteractivePricingSlider
  initialPoints={50}
  minPoints={25}
  maxPoints={200}
  step={5}
  onPointsChange={handlePointsChange}
/>
```

### Simplified View
```tsx
<InteractivePricingSlider
  initialPoints={75}
  showTierInfo={false}
  showSavings={false}
  onPointsChange={handlePointsChange}
/>
```

### Disabled State
```tsx
<InteractivePricingSlider
  initialPoints={150}
  disabled={true}
  onPointsChange={handlePointsChange}
/>
```

### With Custom Styling
```tsx
<InteractivePricingSlider
  initialPoints={200}
  className="custom-pricing-slider"
  onPointsChange={handlePointsChange}
/>
```

## 🔧 Integration with Pricing Utility

The component automatically integrates with the tiered pricing utility:

```tsx
import { calculateTieredPricing, getPricingTier } from '../utils/pricing';

// The component uses these functions internally:
const result = calculateTieredPricing(points);
const tier = getPricingTier(points);
```

## 🎨 Customization

### CSS Custom Properties
You can customize the component using CSS custom properties:

```css
.interactive-pricing-slider {
  --primary-color: #F97316;
  --primary-hover: #EA580C;
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}
```

### Custom Styling
```tsx
<InteractivePricingSlider
  className="my-custom-slider"
  // ... other props
/>
```

```css
.my-custom-slider {
  /* Custom styles */
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

## 📱 Responsive Behavior

### Mobile (< 768px)
- Stacked layout for inputs
- Larger touch targets
- Simplified quick select buttons
- Full-width action buttons

### Tablet (768px - 1024px)
- Side-by-side input layout
- Medium-sized touch targets
- Grid layout for quick select
- Flexible button arrangement

### Desktop (> 1024px)
- Full feature layout
- Hover effects
- Detailed information display
- Side-by-side action buttons

## 🧪 Testing

### Unit Tests
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import InteractivePricingSlider from './InteractivePricingSlider';

test('renders pricing slider', () => {
  render(<InteractivePricingSlider initialPoints={100} />);
  expect(screen.getByText('Interactive Pricing Calculator')).toBeInTheDocument();
});

test('updates points on slider change', () => {
  const onPointsChange = jest.fn();
  render(
    <InteractivePricingSlider
      initialPoints={100}
      onPointsChange={onPointsChange}
    />
  );
  
  const slider = screen.getByRole('slider');
  fireEvent.change(slider, { target: { value: '150' } });
  
  expect(onPointsChange).toHaveBeenCalledWith(150);
});
```

### Integration Tests
```tsx
test('calculates pricing correctly', async () => {
  const onCostChange = jest.fn();
  render(
    <InteractivePricingSlider
      initialPoints={100}
      onCostChange={onCostChange}
    />
  );
  
  await waitFor(() => {
    expect(onCostChange).toHaveBeenCalledWith(expect.any(Number));
  });
});
```

## 🚨 Error Handling

The component handles various error scenarios:

- **Invalid Points**: Shows error message for out-of-range values
- **Calculation Errors**: Displays error state with retry option
- **Network Issues**: Graceful degradation for API failures
- **Validation Errors**: Clear error messages for invalid input

## 🔄 State Management

### Internal State
- `points`: Current selected points
- `isRTL`: RTL layout detection
- `result`: Pricing calculation result
- `error`: Error state

### External State
- `onPointsChange`: Notifies parent of points changes
- `onCostChange`: Notifies parent of cost changes

## 🎯 Performance

### Optimizations
- `useCallback` for event handlers
- Debounced input changes
- Memoized calculations
- Efficient re-renders

### Bundle Size
- Lightweight component (~5KB gzipped)
- No external dependencies
- Tree-shakeable imports

## 🔗 Dependencies

### Required
- `react` - React library
- `next-intl` - Internationalization
- `../utils/pricing` - Tiered pricing utility

### Optional
- `tailwindcss` - Styling (recommended)
- `@types/react` - TypeScript types

## 📄 License

This component is part of the Creo project and is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

If you encounter any issues:

1. Check the examples in `InteractivePricingSliderExample.tsx`
2. Review the props documentation
3. Check the console for error messages
4. Open an issue in the repository

## 🔄 Version History

- **v1.0.0** - Initial release with basic functionality
- **v1.1.0** - Added RTL support and Arabic translations
- **v1.2.0** - Added glassmorphism design and improved UX
- **v1.3.0** - Added quick select presets and tier information
- **v1.4.0** - Added savings display and performance optimizations
