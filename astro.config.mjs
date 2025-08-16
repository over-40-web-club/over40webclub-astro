// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://over40webclub.netlify.app',
  output: 'static',
  // Enhanced image optimization configuration
  image: {
    domains: ['over40webclub.netlify.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.airtable.com',
      },
    ],
  },
  // Performance optimizations enabled through build configuration
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "bootstrap/scss/functions"; @import "bootstrap/scss/variables"; @import "bootstrap/scss/mixins";`,
        },
      },
    },
  },
  // SEO and meta configuration
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
