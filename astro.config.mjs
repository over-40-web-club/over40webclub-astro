// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://over40webclub.com',
  output: 'static',
  // Enhanced image optimization configuration
  image: {
    domains: ['over40webclub.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.airtable.com',
      },
    ],
  },
  // Performance optimizations
  vite: {
    build: {
      cssMinify: true,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['bootstrap'],
          },
        },
      },
    },
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
