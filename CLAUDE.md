# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start local development server at localhost:4321
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Preview build locally before deploying
- `npm run type-check` - Run TypeScript type checking with Astro
- `npm run verify-deployment` - Verify environment variables and deployment configuration

### Testing Commands
- `npm run test` - Run Vitest tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:e2e:ui` - Run Playwright tests with UI
- `npm run test:all` - Run both unit and e2e tests

### Performance & Analysis
- `npm run build:analyze` - Build with analysis (same as build)
- `npm run perf:audit` - Run performance audit after build
- `npm run lighthouse` - Instructions for running Lighthouse manually

## Project Architecture

### Core Structure
This is an Astro 5.x static site with TypeScript, migrated from Gatsby. The architecture follows Astro's component-based approach with strict separation of concerns.

### Key Directories
- `src/components/` - Reusable Astro components organized by type:
  - `ui/` - Basic UI components (Button, Card, Icon, etc.)
  - `sections/` - Page sections (Hero, About, Team, etc.)
  - `layout/` - Layout components (Navbar, Footer)
- `src/content/` - Content Collections with TypeScript schemas for type-safe content
- `src/utils/` - Utility functions with comprehensive test coverage
- `src/layouts/` - Page layout templates
- `src/styles/` - SCSS files with Bootstrap 5.2 integration

### Content Management
- **Content Collections**: Structured content in `src/content/` with Zod schemas defined in `config.ts`
- **Airtable Integration**: Team member data fetched from Airtable API with fallback data
- **Markdown Content**: Section content managed as markdown files in content collections

### External Dependencies
- **Airtable API**: Team data integration with error handling and fallback
- **Bootstrap 5.2.0**: SCSS integration with custom variable overrides
- **Environment Variables**: Required: `AIRTABLE_API_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_NAME`, `SITE_URL`

### Performance Features
- Astro's built-in optimizations with static site generation
- Image optimization configured for Airtable domains
- CSS/JS minification with Terser
- Manual chunk splitting for vendor dependencies
- Bootstrap SCSS variables pre-imported globally

### Testing Setup
- **Unit Tests**: Vitest with jsdom for component and utility testing
- **E2E Tests**: Playwright for end-to-end testing
- **Type Safety**: TypeScript with Astro's type checking

### Deployment Configuration
- **Target**: Netlify (configured in astro.config.mjs)
- **Build Verification**: `scripts/verify-deployment.js` validates environment setup
- **Environment Setup**: Use `npm run verify-deployment` before deploying

### Development Notes
- All components use TypeScript for type safety
- Content is validated using Zod schemas in content collections
- Airtable integration includes comprehensive error handling with fallback data
- SCSS preprocessing configured with Bootstrap integration
- Performance monitoring and SEO components included