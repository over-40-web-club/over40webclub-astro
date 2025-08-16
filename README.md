# Over 40 Web Club - Astro Site

This is the Astro migration of the Over 40 Web Club website, originally built with Gatsby.

## 🚀 Project Structure

```text
astro-site/
├── public/
│   ├── images/              # Image assets
│   └── favicon.svg
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # Basic UI components
│   │   ├── sections/       # Page sections
│   │   └── layout/         # Layout components
│   ├── layouts/            # Page layouts
│   ├── pages/              # Page files (routing)
│   ├── content/            # Markdown content
│   │   ├── sections/       # Section content
│   │   └── config.ts       # Content configuration
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   └── config/             # Site configuration
├── astro.config.mjs        # Astro configuration
├── package.json
├── tsconfig.json
└── vitest.config.ts        # Test configuration
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command              | Action                                           |
| :------------------- | :----------------------------------------------- |
| `npm install`        | Installs dependencies                            |
| `npm run dev`        | Starts local dev server at `localhost:4321`      |
| `npm run build`      | Build your production site to `./dist/`          |
| `npm run preview`    | Preview your build locally, before deploying     |
| `npm run test`       | Run tests once                                   |
| `npm run test:watch` | Run tests in watch mode                          |
| `npm run type-check` | Run TypeScript type checking                     |
| `npm run astro ...`  | Run CLI commands like `astro add`, `astro check` |

## 🛠️ Tech Stack

- **Framework**: Astro 5.x
- **Language**: TypeScript
- **Styling**: SCSS + Bootstrap 5.2.0
- **Testing**: Vitest + jsdom
- **Content**: Markdown with Content Collections
- **External Data**: Airtable API integration

## 🎨 Features

- Static site generation with Astro
- TypeScript for type safety
- SCSS with Bootstrap integration
- Content Collections for Markdown management
- Airtable integration for team data
- Responsive design
- SEO optimization
- Performance optimization

## 🌐 Deployment

This site is configured for deployment on Netlify with:

- Automatic builds from Git
- Environment variables for Airtable API
- Form handling with Netlify Forms
- Security headers and performance optimization
- Automatic redirects and error handling

### Quick Deployment Setup

1. **Connect to Netlify**: Link your Git repository to Netlify
2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18
3. **Set Environment Variables** (see `DEPLOYMENT.md` for details):
   - `AIRTABLE_API_TOKEN`
   - `AIRTABLE_BASE_ID`
   - `AIRTABLE_TABLE_NAME`
   - `SITE_URL`
4. **Deploy**: Netlify will automatically build and deploy

### Verification

Test your deployment configuration:

```bash
npm run verify-deployment
```

For detailed deployment instructions, see `DEPLOYMENT.md`.

## 📝 Content Management

Content is managed through:

- Markdown files in `src/content/sections/`
- Airtable for team member data
- Static assets in `public/images/`

## 🔧 Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Start development server: `npm run dev`
5. Open `http://localhost:4321` in your browser

## 🧪 Testing

Run tests with:

```bash
npm run test          # Run once
npm run test:watch    # Watch mode
```

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.2/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
