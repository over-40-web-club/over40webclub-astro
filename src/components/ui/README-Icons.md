# Icon System Documentation

This document describes the icon system implementation for the Over 40 Web Club Astro site, migrated from the original Gatsby SystemIcons.jsx.

## Overview

The icon system provides a unified way to use FontAwesome icons throughout the application with:

- Type-safe icon names
- Backward compatibility with legacy icon names
- Multiple icon components for different use cases
- Comprehensive utility functions

## Components

### Icon.astro

The base icon component that renders FontAwesome icons using CSS classes.

```astro
---
import Icon from '../components/ui/Icon.astro';
---

<!-- Basic usage -->
<Icon name="phone" />

<!-- With size -->
<Icon name="envelope" size="1.5rem" />

<!-- With custom class -->
<Icon name="github" class="text-primary" />

<!-- Inverse (white) icon -->
<Icon name="twitter" inverse />

<!-- With aria-label for accessibility -->
<Icon name="bars" aria-label="Menu" />
```

**Props:**

- `name` (required): Icon name (IconName | string)
- `class`: Additional CSS classes
- `size`: Icon size (string | number) - defaults to '1em'
- `inverse`: Boolean for white/inverse icon
- `aria-label`: Accessibility label

### SocialIcon.astro

Specialized component for social media icons with automatic URL generation.

```astro
---
import SocialIcon from '../components/ui/SocialIcon.astro';
---

<!-- With username (auto-generates URL) -->
<SocialIcon platform="twitter" username="shijukarakun" />

<!-- With custom URL -->
<SocialIcon platform="homepage" url="https://example.com" />

<!-- With custom class -->
<SocialIcon platform="github" username="example" class="custom-social" />
```

**Props:**

- `platform` (required): Social platform name
- `username`: Username for auto URL generation
- `url`: Custom URL (overrides username)
- `class`: Additional CSS classes

**Supported platforms:**

- twitter, facebook, linkedin, github, medium, instagram, youtube, homepage

### CircleIcon.astro

Icon displayed in a circular background, perfect for service items or feature highlights.

```astro
---
import CircleIcon from '../components/ui/CircleIcon.astro';
---

<!-- Basic circle icon -->
<CircleIcon iconName="shopping-cart" />

<!-- With custom size -->
<CircleIcon iconName="laptop" size="3rem" />

<!-- As a link -->
<CircleIcon iconName="lock" href="/security" />
```

**Props:**

- `iconName` (required): Icon name
- `size`: Icon size - defaults to '4x'
- `class`: Additional CSS classes
- `href`: Optional link URL
- `aria-label`: Accessibility label

### IconText.astro

Combines an icon with text, useful for buttons or labels.

```astro
---
import IconText from '../components/ui/IconText.astro';
---

<!-- Icon with text -->
<IconText iconName="phone" text="Call Us" />

<!-- With custom spacing -->
<IconText iconName="envelope" text="Email" gap="1rem" />

<!-- With custom icon size -->
<IconText iconName="paper-plane" text="Send" iconSize="1.2rem" />
```

**Props:**

- `iconName` (required): Icon name
- `text` (required): Text to display
- `class`: Additional CSS classes
- `iconSize`: Icon size - defaults to '1em'
- `gap`: Space between icon and text - defaults to '0.5rem'

### IconShowcase.astro

Development/documentation component to display all available icons.

```astro
---
import IconShowcase from '../components/ui/IconShowcase.astro';
---

<!-- Show all icons -->
<IconShowcase />

<!-- Show only solid icons -->
<IconShowcase category="solid" />

<!-- Without labels -->
<IconShowcase showLabels={false} />

<!-- Custom size -->
<IconShowcase size="2rem" />
```

## Icon Names

### Modern Icon Names (Recommended)

Use these modern, semantic names for new development:

**Solid Icons:**

- `phone`, `envelope`, `plus`, `bars`, `times`, `globe`
- `shopping-cart`, `laptop`, `lock`, `paper-plane`

**Brand Icons:**

- `twitter`, `facebook`, `linkedin`, `github`, `medium`
- `instagram`, `youtube`, `fort-awesome`

### Legacy Icon Names (Backward Compatibility)

These names are supported for backward compatibility with the original Gatsby implementation:

- `PhoneIcon` → `phone`
- `EnvelopIcon` → `envelope`
- `PlusIcon` → `plus`
- `BarsIcon` → `bars`
- `CloseIcon` → `times`
- `LanguageIcon` → `globe`
- `ShoppingCartIcon` → `shopping-cart`
- `LaptopIcon` → `laptop`
- `LockIcon` → `lock`
- `HomepageIcon` → `globe`
- `TwitterIcon` → `twitter`
- `FacebookIcon` → `facebook`
- `LinkedinIcon` → `linkedin`
- `GithubIcon` → `github`
- `MediumIcon` → `medium`
- `InstagramIcon` → `instagram`
- `YoutubeIcon` → `youtube`

## Utility Functions

The icon system provides several utility functions for advanced use cases:

```typescript
import {
  getIconClass,
  isValidIconName,
  getAvailableIcons,
  getIconsByCategory,
  getIconCategory,
  isBrandIcon,
  isSolidIcon,
  isLegacyIcon,
  convertLegacyIconName,
} from '../utils/icons.js';

// Get FontAwesome CSS class
const cssClass = getIconClass('phone'); // 'fas fa-phone'

// Validate icon name
const isValid = isValidIconName('twitter'); // true

// Get all available icons
const allIcons = getAvailableIcons(); // ['phone', 'twitter', ...]

// Get icons by category
const solidIcons = getIconsByCategory('solid'); // ['phone', 'envelope', ...]
const brandIcons = getIconsByCategory('brand'); // ['twitter', 'github', ...]
const legacyIcons = getIconsByCategory('legacy'); // ['PhoneIcon', 'TwitterIcon', ...]

// Check icon category
const category = getIconCategory('phone'); // 'solid'

// Check icon type
const isBrand = isBrandIcon('twitter'); // true
const isSolid = isSolidIcon('phone'); // true
const isLegacy = isLegacyIcon('PhoneIcon'); // true

// Convert legacy names
const modernName = convertLegacyIconName('PhoneIcon'); // 'phone'
```

## FontAwesome Integration

The system uses FontAwesome 6.4.0 loaded via CDN in the BaseLayout:

```html
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>
```

Icons are rendered using CSS classes rather than SVG imports for:

- Smaller bundle size
- Better caching
- Simpler implementation
- Consistent with Astro's static-first approach

## Migration from Gatsby

The original Gatsby implementation used:

- `@fortawesome/react-fontawesome` package
- Individual icon imports from `@fortawesome/free-solid-svg-icons` and `@fortawesome/free-brands-svg-icons`
- `makeFAIcon` utility to create React components

The new Astro implementation:

- Uses FontAwesome CSS classes instead of React components
- Provides the same icon names for backward compatibility
- Adds modern, semantic icon names
- Includes comprehensive utility functions
- Maintains the same visual appearance

## Testing

The icon system includes comprehensive tests covering:

- Icon class generation
- Icon name validation
- Category functions
- Legacy name conversion
- Utility functions

Run tests with:

```bash
npm test -- src/utils/icons.test.ts
```

## Development

To test the icon system during development:

1. Visit `/icons-test` page to see all icons in action
2. Use the `IconShowcase` component to display available icons
3. Run tests to ensure new icons are properly configured

## Adding New Icons

To add new icons:

1. Add the icon name to the appropriate category in `iconCategories`
2. Add the mapping in `iconMap` with the correct FontAwesome class
3. Update the `IconName` type union
4. Add tests for the new icon
5. Update this documentation

Example:

```typescript
// In icons.ts
export type IconName =
  // ... existing names
  'new-icon';

const iconMap: Record<string, string> = {
  // ... existing mappings
  'new-icon': 'fas fa-new-icon',
};

export const iconCategories = {
  solid: [
    // ... existing icons
    'new-icon',
  ] as const,
  // ...
};
```
