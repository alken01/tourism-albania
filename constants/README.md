# Global Styles System

This document explains how to use the new global styles system to maintain consistent styling across the Tourism Albania app.

## Overview

The global styles system provides:

- **Consistent colors** for light and dark themes
- **Standardized spacing** values
- **Typography scales** for text sizing
- **Pre-built component styles** for common UI patterns
- **Helper functions** for theme-aware styling

## Files Structure

```
constants/
├── GlobalStyles.ts    # Main styles definitions
└── Colors.ts         # Legacy colors (kept for reference)

hooks/
└── useThemedStyles.ts # Hook for accessing themed styles
```

## Basic Usage

### 1. Import the Hook

```typescript
import { useThemedStyles } from '@/hooks/useThemedStyles';

export default function MyComponent() {
  const { GlobalStyles, themedStyles, colors } = useThemedStyles();
  
  // Your component code here
}
```

### 2. Apply Styles

```typescript
// Use global styles for common patterns
<View style={GlobalStyles.container}>
  <Text style={[GlobalStyles.headerTitle, themedStyles.text]}>
    My Title
  </Text>
</View>

// Use colors for dynamic styling
<ActivityIndicator color={colors.primary} />
```

## Available Style Categories

### Container Styles

- `GlobalStyles.container` - Basic flex container
- `GlobalStyles.contentContainer` - Container with padding
- `GlobalStyles.centerContainer` - Centered content
- `GlobalStyles.headerContainer` - Page header wrapper
- `GlobalStyles.sectionContainer` - Section wrapper

### Text Styles

- `GlobalStyles.headerTitle` - Main page titles
- `GlobalStyles.headerSubtitle` - Page subtitles
- `GlobalStyles.sectionTitle` - Section headings
- `GlobalStyles.title` - General titles
- `GlobalStyles.subtitle` - General subtitles
- `GlobalStyles.body` - Body text
- `GlobalStyles.caption` - Small captions

### Layout Styles

- `GlobalStyles.grid` - Flex grid container
- `GlobalStyles.gridItem` - 48% width grid item
- `GlobalStyles.gridItemThird` - 32% width grid item
- `GlobalStyles.row` - Horizontal flex row
- `GlobalStyles.rowBetween` - Space between row
- `GlobalStyles.column` - Vertical flex column

### Interactive Styles

- `GlobalStyles.button` - Base button style
- `GlobalStyles.filterContainer` - Filter wrapper
- `GlobalStyles.filterItem` - Filter item style
- `GlobalStyles.input` - Text input style

### State Styles

- `GlobalStyles.loadingContainer` - Loading state wrapper
- `GlobalStyles.errorContainer` - Error state wrapper
- `GlobalStyles.emptyContainer` - Empty state wrapper

## Themed Styles

Use `themedStyles` for styles that change based on light/dark theme:

```typescript
const { themedStyles } = useThemedStyles();

// Background colors
themedStyles.background
themedStyles.backgroundSecondary

// Text colors
themedStyles.text
themedStyles.textSecondary
themedStyles.textMuted

// Interactive elements
themedStyles.buttonPrimary
themedStyles.filterItem
themedStyles.filterItemActive

// Cards and borders
themedStyles.card
themedStyles.input
```

## Design Tokens

### Colors

Access theme-aware colors through the `colors` object:

```typescript
const { colors } = useThemedStyles();

// Primary colors
colors.primary        // Main brand color
colors.primaryDark    // Darker variant
colors.primaryLight   // Lighter variant

// Status colors
colors.success
colors.error
colors.warning
colors.info

// UI colors
colors.background
colors.text
colors.border
```

### Spacing

Use consistent spacing values:

```typescript
import { Spacing } from '@/constants/GlobalStyles';

const customStyle = {
  padding: Spacing.lg,      // 16px
  marginTop: Spacing.xl,    // 20px
  gap: Spacing.md,          // 12px
}
```

Available spacing values:

- `Spacing.xs` (4px)
- `Spacing.sm` (8px)
- `Spacing.md` (12px)
- `Spacing.lg` (16px)
- `Spacing.xl` (20px)
- `Spacing.xxl` (24px)
- `Spacing.xxxl` (32px)
- `Spacing.huge` (40px)

### Typography

Use consistent font sizes and weights:

```typescript
import { Typography } from '@/constants/GlobalStyles';

const textStyle = {
  fontSize: Typography.sizes.lg,        // 18px
  fontWeight: Typography.weights.bold,  // '700'
  lineHeight: Typography.sizes.lg * Typography.lineHeights.normal,
}
```

### Border Radius

Use consistent border radius values:

```typescript
import { BorderRadius } from '@/constants/GlobalStyles';

const cardStyle = {
  borderRadius: BorderRadius.lg,  // 12px
}
```

## Best Practices

### 1. Always Use the Hook

```typescript
// ✅ Good
const { GlobalStyles, themedStyles, colors } = useThemedStyles();

// ❌ Avoid
import { GlobalStyles } from '@/constants/GlobalStyles';
```

### 2. Combine Global and Themed Styles

```typescript
// ✅ Good - Combines layout + theme
<Text style={[GlobalStyles.headerTitle, themedStyles.text]}>
  Title
</Text>

// ❌ Avoid - Missing theme support
<Text style={GlobalStyles.headerTitle}>
  Title
</Text>
```

### 3. Use Design Tokens

```typescript
// ✅ Good - Uses design tokens
const customStyle = {
  padding: Spacing.lg,
  fontSize: Typography.sizes.md,
  borderRadius: BorderRadius.md,
}

// ❌ Avoid - Magic numbers
const customStyle = {
  padding: 16,
  fontSize: 16,
  borderRadius: 8,
}
```

### 4. Theme-Aware Components

```typescript
// ✅ Good - Adapts to theme
<ActivityIndicator color={colors.primary} />

// ❌ Avoid - Hard-coded colors
<ActivityIndicator color="#4CAF50" />
```

## Migration Guide

When converting existing components:

1. **Remove local StyleSheet.create()**
2. **Import useThemedStyles hook**
3. **Replace custom styles with global equivalents**
4. **Use themed colors for dynamic values**
5. **Test in both light and dark themes**

### Example Migration

```typescript
// Before
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});

// After
const { GlobalStyles, themedStyles } = useThemedStyles();

// Use in JSX:
<View style={[GlobalStyles.contentContainer, themedStyles.background]}>
  <Text style={[GlobalStyles.title, themedStyles.text]}>
    Title
  </Text>
</View>
```

## Extending the System

To add new global styles:

1. **Add to GlobalStyles.ts** for layout/structural styles
2. **Add to createThemedStyles()** for theme-dependent styles  
3. **Update design tokens** (colors, spacing, etc.) as needed
4. **Document new styles** in this README

This system ensures consistent, maintainable, and theme-aware styling across the entire app.
