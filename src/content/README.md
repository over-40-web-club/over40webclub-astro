# Content Collections

This directory contains the content collections for the Over 40 Web Club Astro site.

## Collections

### Sections (`sections/`)

Main content sections for the website (About, Portfolio, History, etc.)

**Schema:**

- `title` (optional): Section title
- `anchor` (optional): Anchor ID for navigation
- `header` (optional): Section header text
- `subheader` (optional): Section subheader text
- `order` (optional): Display order
- `published` (default: true): Whether to show the section
- `services` (optional): Array of service items for About section
- `portfolio` (optional): Array of portfolio items
- `timeline` (optional): Array of history/timeline items
- `clients` (optional): Array of client items

### Navigation (`navigation/`)

Navigation bar content

**Schema:**

- `brand`: Brand text/logo
- `menuText`: Menu button text

### Hero (`hero/`)

Hero/top section content

**Schema:**

- `header`: Main header text
- `subheader`: Subheader text
- `imageFileName`: Background image filename
- `jumpToAnchor`: Target anchor for CTA button
- `jumpToAnchorText`: CTA button text

### Footer (`footer/`)

Footer content

**Schema:**

- `copyright` (optional): Copyright text
- `socialLinks` (optional): Array of social media links
- `quickLinks` (optional): Array of quick navigation links

## Usage

Import and use the content collections in your Astro components:

```typescript
import { getCollection } from 'astro:content';
import {
  getSections,
  getNavigation,
  getHero,
  getFooter,
} from '../utils/content';

// Get all sections
const sections = await getSections();

// Get specific content
const navigation = await getNavigation();
const hero = await getHero();
const footer = await getFooter();
```

## File Structure

```
src/content/
├── config.ts          # Content collection definitions
├── sections/           # Main content sections
│   └── about.md
├── navigation/         # Navigation content
│   └── main.md
├── hero/              # Hero section content
│   └── main.md
└── footer/            # Footer content
    └── main.md
```
