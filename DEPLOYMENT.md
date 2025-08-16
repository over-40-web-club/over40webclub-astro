# Deployment Guide

## Netlify Deployment Setup

### Environment Variables

The following environment variables need to be configured in the Netlify dashboard:

#### Required Variables

1. **AIRTABLE_API_TOKEN**

   - Description: API token for accessing Airtable data
   - Source: Airtable Account Settings > Developer Hub > Personal Access Tokens
   - Example: `patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

2. **AIRTABLE_BASE_ID**

   - Description: Base ID for the team members table
   - Source: Airtable base URL (e.g., `https://airtable.com/appXXXXXXXXXXXXXX/`)
   - Example: `appXXXXXXXXXXXXXX`

3. **AIRTABLE_TABLE_NAME**

   - Description: Name of the table containing team member data
   - Default: `Team`
   - Example: `Team`

4. **SITE_URL**
   - Description: Canonical URL of the site
   - Example: `https://over40web.club`

### Build Configuration

The site is configured to:

- Use Node.js 18
- Run `npm run build` as the build command
- Publish from the `dist` directory
- Enable Netlify Forms for contact form processing

### Setting Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Click **Add a variable** for each required variable
4. Set the **Key** and **Value** for each environment variable
5. Click **Save**

### Build Commands

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18

### Forms Configuration

The contact form is configured to work with Netlify Forms:

- Form processing is enabled in `netlify.toml`
- The contact form includes the required `data-netlify="true"` attribute
- Form submissions will appear in the Netlify dashboard under **Forms**

### Redirects

The following redirects are configured:

- `https://over40webclub.netlify.app/*` → `https://over40web.club/:splat` (301)
- 404 errors redirect to `/404.html`

### Security Headers

The following security headers are automatically applied:

- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Performance Optimization

- Static assets are cached for 1 year
- HTML files are cached for 1 hour
- CSS and JS are bundled and minified
- Pretty URLs are enabled

## Local Development

1. Copy `.env.example` to `.env`
2. Fill in the required environment variables
3. Run `npm install`
4. Run `npm run dev`

## Testing Deployment

Before deploying to production:

1. **Test build locally**:

   ```bash
   npm run build
   npm run preview
   ```

2. **Verify environment variables**:

   - Check that team data loads correctly
   - Verify contact form functionality
   - Test all page routes

3. **Performance check**:
   ```bash
   npm run perf:audit
   ```

## Troubleshooting

### Build Failures

1. **Airtable connection issues**:

   - Verify `AIRTABLE_API_TOKEN` is correct
   - Check `AIRTABLE_BASE_ID` format
   - Ensure table name matches `AIRTABLE_TABLE_NAME`

2. **Missing environment variables**:

   - Check Netlify dashboard environment variables
   - Verify variable names match exactly
   - Ensure no trailing spaces in values

3. **Build timeout**:
   - Check for infinite loops in data fetching
   - Verify all imports are correct
   - Review build logs for specific errors

### Runtime Issues

1. **Forms not working**:

   - Verify `data-netlify="true"` attribute is present
   - Check Netlify Forms dashboard for submissions
   - Ensure form action points to correct endpoint

2. **Missing team data**:
   - Check Airtable API permissions
   - Verify base and table IDs
   - Review network requests in browser dev tools
