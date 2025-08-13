# DogNote Design System

## Overview

The DogNote Design System is a comprehensive, centralized styling framework built with world-class UI/UX principles. It provides consistent colors, typography, spacing, and component styling across the entire application.

## Key Features

- **Centralized Theme Configuration**: All design tokens are defined in `/src/styles/theme.ts`
- **Primary Color Based on Logo**: Uses indigo-600 (`#4f46e5`) as the primary brand color
- **Semantic Color Palette**: Success, warning, error, and info colors for different states
- **Typography Scale**: Consistent font sizes and line heights
- **Spacing System**: 4px-based grid system for consistent spacing
- **Component Variants**: Standardized styling for all UI components
- **Tailwind Integration**: Seamless integration with Tailwind CSS

## Color Palette

### Primary Colors (Brand)
Based on the indigo-600 color from the DogNote logo:
- `primary-50` to `primary-950`: Full range of primary brand colors
- Main brand color: `primary-600` (#4f46e5)

### Semantic Colors
- **Success**: Green tones for positive actions and states
- **Warning**: Amber tones for caution and alerts
- **Error**: Red tones for errors and destructive actions
- **Info**: Blue tones for informational content

### Neutral Colors
Warm-tinted grays that harmonize with the primary color palette.

## Typography

### Font Families
- **Sans**: Inter, system-ui, sans-serif
- **Mono**: JetBrains Mono, Menlo, Monaco, monospace

### Font Scale
- `xs` (12px) to `6xl` (60px)
- Each size includes optimized line height
- Consistent scaling ratio for visual hierarchy

### Font Weights
- Light (300) to Extrabold (800)
- Semantic naming for easy usage

## Spacing System

Based on a 4px grid system:
- `0.5` (2px) to `96` (384px)
- Consistent increments for visual rhythm
- Responsive scaling capabilities

## Component Design Tokens

### Buttons
- **Heights**: 28px (xs) to 48px (xl)
- **Padding**: Proportional to size
- **Border Radius**: Configurable per size
- **Variants**: Primary, secondary, outline, ghost, destructive, success, warning

### Inputs
- **Heights**: 32px (sm) to 48px (lg)
- **Variants**: Default, filled, underlined, error
- **Consistent focus states and transitions

### Cards
- **Padding**: 16px (sm) to 32px (lg)
- **Border Radius**: 8px (lg) to 24px (3xl)
- **Shadow**: Subtle to prominent elevation

## Usage

### Importing the Theme
```typescript
import { theme } from '@/styles/theme';
import { variants, animations } from '@/lib/theme-utils';
```

### Using Colors in Components
```typescript
// Using theme utilities
const buttonClass = variants.button.primary;

// Direct theme access
const primaryColor = theme.colors.primary[600];
```

### Tailwind Classes
The theme is integrated with Tailwind CSS, so you can use:
```html
<div className="bg-primary-600 text-white">
<button className="text-primary-700 hover:text-primary-800">
```

## File Structure

```
src/
├── styles/
│   └── theme.ts              # Main theme configuration
├── lib/
│   └── theme-utils.ts        # Theme utility functions
├── components/ui/
│   ├── Button.tsx           # Updated to use design system
│   ├── Input.tsx            # Updated to use design system
│   └── ...                  # Other components
└── app/
    └── design-system/
        └── page.tsx         # Design system showcase
```

## Design Principles

### 1. Consistency
All components follow the same design patterns, color schemes, and spacing rules for a unified user experience.

### 2. Accessibility
- Colors meet WCAG contrast requirements
- Components support keyboard navigation
- Screen reader compatibility

### 3. Responsive Design
- Mobile-first approach
- Consistent behavior across device sizes
- Touch-friendly interaction areas

### 4. Performance
- Optimized CSS output
- Minimal runtime overhead
- Efficient animations and transitions

### 5. Maintainability
- Centralized configuration
- Easy to update and extend
- Clear naming conventions

### 6. User-Focused
- Designed specifically for dog owners
- Intuitive interactions
- Clear visual hierarchy

## Best Practices

### Color Usage
- Use semantic colors for their intended purpose
- Maintain sufficient contrast ratios
- Consider color blindness accessibility

### Typography
- Use the font scale consistently
- Maintain proper line height ratios
- Consider reading distance and context

### Spacing
- Follow the 4px grid system
- Use consistent spacing patterns
- Consider visual rhythm and breathing room

### Component Development
- Always use theme values instead of hardcoded styles
- Follow the established variant patterns
- Ensure responsive behavior

## Migration Guide

### From Hardcoded Styles
1. Replace hardcoded colors with theme colors
2. Use spacing scale instead of arbitrary values
3. Apply consistent typography scale
4. Use component variants for styling

### Example Migration
```typescript
// Before
className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2"

// After
className={variants.button.primary}
```

## Future Enhancements

- Dark mode support
- Additional component variants
- Animation system expansion
- Theme customization tools
- Design token documentation generator

## Contributing

When adding new components or modifying existing ones:
1. Use the centralized theme system
2. Follow established naming conventions
3. Ensure accessibility compliance
4. Test across different screen sizes
5. Update documentation as needed

---

For questions or suggestions about the design system, please refer to the component showcase at `/design-system` or consult the theme configuration files.
