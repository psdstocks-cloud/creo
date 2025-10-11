# Responsive Design System

## Overview

The Creo platform implements a comprehensive responsive design system that ensures perfect user experience across all devices - mobile phones, tablets, and desktops. This system is built on modern CSS Grid, Flexbox, and Tailwind CSS utilities.

## Breakpoints

```typescript
const breakpoints = {
  xs: '320px',   // Extra small devices (phones)
  sm: '640px',   // Small devices (large phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (desktops)
  xl: '1280px',  // Extra large devices (large desktops)
  '2xl': '1536px', // 2X large devices (larger desktops)
}
```

## Device Types

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px+

## Core Components

### 1. Responsive Hooks

#### `useResponsive()`
Main hook for detecting screen size and device type.

```typescript
const { isMobile, isTablet, isDesktop, width, height } = useResponsive();
```

#### `useResponsiveNavigation()`
Specialized hook for navigation components.

```typescript
const { getNavHeight, shouldShowMobileMenu } = useResponsiveNavigation();
```

#### `useResponsiveForm()`
Hook for form components with mobile optimizations.

```typescript
const { getInputHeight, getInputFontSize } = useResponsiveForm();
```

### 2. Layout Components

#### ResponsiveContainer
Main container with responsive padding and max-width.

```tsx
<ResponsiveContainer maxWidth="desktop" padding="lg">
  <YourContent />
</ResponsiveContainer>
```

#### ResponsiveGrid
Grid system with responsive columns.

```tsx
<ResponsiveGrid 
  cols={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap="md"
>
  <GridItem />
  <GridItem />
  <GridItem />
</ResponsiveGrid>
```

#### ResponsiveFlex
Flexbox with responsive direction.

```tsx
<ResponsiveFlex 
  direction="col" 
  responsive={true}
  justify="between"
  align="center"
>
  <Item1 />
  <Item2 />
</ResponsiveFlex>
```

### 3. Navigation Components

#### ResponsiveNavigation
Complete navigation with mobile menu.

```tsx
<ResponsiveNavigation
  items={menuItems}
  logo={<Logo />}
  actions={<Actions />}
  variant="glass"
  sticky={true}
/>
```

### 4. Form Components

#### ResponsiveForm
Form with responsive layout.

```tsx
<ResponsiveForm layout="vertical" spacing="md">
  <ResponsiveInput label="Email" type="email" />
  <ResponsiveButton type="submit">Submit</ResponsiveButton>
</ResponsiveForm>
```

#### ResponsiveInput
Input with mobile optimizations.

```tsx
<ResponsiveInput
  label="Email"
  type="email"
  placeholder="Enter your email"
  required
/>
```

### 5. Card Components

#### ResponsiveCard
Card with responsive padding and styling.

```tsx
<ResponsiveCard variant="glass" padding="lg" hover={true}>
  <ResponsiveCardHeader title="Card Title" />
  <ResponsiveCardContent>
    Card content
  </ResponsiveCardContent>
</ResponsiveCard>
```

### 6. Typography Components

#### ResponsiveHeading
Responsive headings with proper sizing.

```tsx
<ResponsiveHeading level={1} color="primary" align="center">
  Main Title
</ResponsiveHeading>
```

#### ResponsiveText
Responsive text with variants.

```tsx
<ResponsiveText variant="body" color="secondary">
  Body text content
</ResponsiveText>
```

### 7. Image Components

#### ResponsiveImage
Optimized images with responsive sizing.

```tsx
<ResponsiveImage
  src="/image.jpg"
  alt="Description"
  width={400}
  height={300}
  priority={true}
/>
```

#### ResponsiveImageGallery
Image gallery with responsive grid.

```tsx
<ResponsiveImageGallery
  images={imageArray}
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
  lightbox={true}
/>
```

### 8. Modal Components

#### ResponsiveModal
Modal with responsive sizing.

```tsx
<ResponsiveModal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"
  size="md"
>
  Modal content
</ResponsiveModal>
```

#### ResponsiveDrawer
Mobile-first drawer component.

```tsx
<ResponsiveDrawer
  isOpen={isOpen}
  onClose={onClose}
  position="right"
  size="md"
>
  Drawer content
</ResponsiveDrawer>
```

## Mobile Optimizations

### Touch Targets
- Minimum 44px touch targets for all interactive elements
- Proper spacing between touch targets
- Optimized button sizes for mobile

### Typography
- 16px minimum font size to prevent zoom on iOS
- Responsive font scaling
- Proper line heights for readability

### Navigation
- Hamburger menu for mobile
- Touch-friendly navigation
- Swipe gestures support

### Forms
- Large input fields (48px height)
- Proper keyboard types
- Form validation with mobile-friendly messages

## Tablet Optimizations

### Layout
- Two-column layouts where appropriate
- Optimized for both portrait and landscape
- Touch and mouse interaction support

### Navigation
- Collapsible navigation
- Touch-friendly menu items
- Proper spacing for tablet use

## Desktop Optimizations

### Layout
- Multi-column layouts
- Hover states and interactions
- Keyboard navigation support

### Navigation
- Full horizontal navigation
- Dropdown menus
- Keyboard shortcuts

## Performance Considerations

### Image Optimization
- Responsive image sizing
- WebP format support
- Lazy loading implementation
- Blur placeholders

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy components

### Caching
- Service worker implementation
- Static asset caching
- API response caching

## Accessibility Features

### Keyboard Navigation
- Tab order management
- Focus indicators
- Keyboard shortcuts
- Skip links

### Screen Reader Support
- ARIA labels and descriptions
- Semantic HTML structure
- Live regions for dynamic content
- Proper heading hierarchy

### Visual Accessibility
- High contrast mode support
- Reduced motion preferences
- Color contrast compliance (WCAG AA)
- Scalable text

## Testing Strategy

### Device Testing
- Real device testing on iOS and Android
- Browser testing across Chrome, Safari, Firefox, Edge
- Responsive design testing tools

### Automated Testing
- Visual regression testing with Playwright
- Accessibility testing with axe-core
- Performance testing with Lighthouse

### Manual Testing
- User testing on different devices
- Accessibility testing with screen readers
- Performance testing on slow connections

## Implementation Guidelines

### 1. Mobile-First Approach
Always start with mobile design and enhance for larger screens.

```css
/* Mobile first */
.component {
  /* Mobile styles */
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}
```

### 2. Progressive Enhancement
Start with basic functionality and enhance with advanced features.

### 3. Performance First
Optimize for performance on all devices, especially mobile.

### 4. Accessibility First
Ensure all components are accessible by default.

## Best Practices

### 1. Use Semantic HTML
```tsx
<nav role="navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>
```

### 2. Implement Proper Focus Management
```tsx
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    onClose();
  }
};
```

### 3. Use Responsive Images
```tsx
<ResponsiveImage
  src="/image.jpg"
  alt="Description"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 4. Test on Real Devices
Always test on actual devices, not just browser dev tools.

### 5. Consider Network Conditions
Optimize for slow connections and offline scenarios.

## Common Patterns

### 1. Responsive Grid
```tsx
<ResponsiveGrid 
  cols={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap="md"
>
  {items.map(item => <Card key={item.id} {...item} />)}
</ResponsiveGrid>
```

### 2. Responsive Navigation
```tsx
<ResponsiveNavigation
  items={menuItems}
  logo={<Logo />}
  actions={<UserMenu />}
  variant="glass"
/>
```

### 3. Responsive Forms
```tsx
<ResponsiveForm layout="vertical" spacing="md">
  <ResponsiveFieldGroup columns={{ mobile: 1, tablet: 2 }}>
    <ResponsiveInput label="First Name" />
    <ResponsiveInput label="Last Name" />
  </ResponsiveFieldGroup>
  <ResponsiveButton type="submit">Submit</ResponsiveButton>
</ResponsiveForm>
```

### 4. Responsive Cards
```tsx
<ResponsiveGridCard 
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap="md"
>
  {cards.map(card => (
    <ResponsiveCard key={card.id} variant="glass" hover>
      <ResponsiveCardContent>
        {card.content}
      </ResponsiveCardContent>
    </ResponsiveCard>
  ))}
</ResponsiveGridCard>
```

## Troubleshooting

### Common Issues

1. **Mobile zoom on input focus**
   - Solution: Use 16px minimum font size

2. **Touch targets too small**
   - Solution: Minimum 44px touch targets

3. **Layout breaks on small screens**
   - Solution: Use responsive utilities and proper breakpoints

4. **Images not loading on mobile**
   - Solution: Use ResponsiveImage component with proper sizing

5. **Navigation not accessible**
   - Solution: Use ResponsiveNavigation with proper ARIA labels

### Debug Tools

1. **Browser Dev Tools**
   - Responsive design mode
   - Device emulation
   - Network throttling

2. **Accessibility Tools**
   - axe DevTools
   - WAVE
   - Lighthouse accessibility audit

3. **Performance Tools**
   - Lighthouse
   - WebPageTest
   - Chrome DevTools Performance

## Future Enhancements

### Planned Features
- Container queries support
- Advanced grid layouts
- More animation options
- Enhanced accessibility features
- Performance optimizations

### Experimental Features
- CSS Grid subgrid
- Container queries
- CSS logical properties
- Advanced color schemes

## Resources

### Documentation
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev Responsive Design](https://web.dev/responsive-web-design-basics/)

### Tools
- [Responsive Design Testing](https://responsivedesignchecker.com/)
- [BrowserStack](https://www.browserstack.com/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Best Practices
- [Google Web Fundamentals](https://developers.google.com/web/fundamentals)
- [A List Apart](https://alistapart.com/topic/responsive-design)
- [Smashing Magazine](https://www.smashingmagazine.com/category/responsive-design/)
