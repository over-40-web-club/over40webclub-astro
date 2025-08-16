/**
 * Performance optimization configuration
 * Core Web Vitals and loading performance settings
 */

export const performanceConfig = {
  // Core Web Vitals thresholds
  coreWebVitals: {
    lcp: {
      good: 2500, // milliseconds
      needsImprovement: 4000,
    },
    fid: {
      good: 100, // milliseconds
      needsImprovement: 300,
    },
    cls: {
      good: 0.1, // score
      needsImprovement: 0.25,
    },
    fcp: {
      good: 1800, // milliseconds
      needsImprovement: 3000,
    },
    ttfb: {
      good: 800, // milliseconds
      needsImprovement: 1800,
    },
  },

  // Image optimization settings
  images: {
    formats: ['webp', 'avif', 'jpg', 'png'],
    quality: {
      default: 85,
      photos: 90,
      icons: 75,
      thumbnails: 80,
    },
    sizes: {
      hero: [1920, 1280, 768, 480],
      portfolio: [800, 600, 400, 300],
      team: [400, 300, 200],
      logos: [200, 150, 100],
    },
    lazyLoading: {
      rootMargin: '50px 0px',
      threshold: 0.01,
    },
  },

  // Font optimization settings
  fonts: {
    preload: ['Montserrat-400', 'Montserrat-700', 'Roboto-Slab-400'],
    display: 'swap',
    fallbacks: {
      Montserrat: 'system-ui, -apple-system, sans-serif',
      'Roboto Slab': 'Georgia, serif',
      'Kaushan Script': 'cursive',
    },
  },

  // CSS optimization settings
  css: {
    critical: {
      selectors: [
        'body',
        'html',
        '.hero',
        '.navbar',
        '.btn-primary',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        '.container',
        '.row',
        '.col',
      ],
      inlineThreshold: 14000, // bytes
    },
    purge: {
      enabled: true,
      safelist: [
        'show',
        'active',
        'fade',
        'modal',
        'tooltip',
        'popover',
        /^btn-/,
        /^text-/,
        /^bg-/,
      ],
    },
  },

  // JavaScript optimization settings
  javascript: {
    minify: true,
    treeshake: true,
    splitting: {
      vendor: ['bootstrap'],
      components: true,
    },
    defer: ['bootstrap.bundle.min.js', 'analytics.js'],
  },

  // Resource hints and preloading
  resourceHints: {
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://api.airtable.com',
    ],
    dnsPrefetch: ['https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net'],
    preload: {
      fonts: [
        '/fonts/montserrat-v25-latin-regular.woff2',
        '/fonts/roboto-slab-v24-latin-regular.woff2',
      ],
      images: ['/images/hero-bg.jpg', '/images/logo.png'],
    },
  },

  // Caching strategies
  caching: {
    static: {
      maxAge: 31536000, // 1 year
      immutable: true,
    },
    html: {
      maxAge: 3600, // 1 hour
      staleWhileRevalidate: 86400, // 1 day
    },
    api: {
      maxAge: 300, // 5 minutes
      staleWhileRevalidate: 3600, // 1 hour
    },
  },

  // Performance budgets
  budgets: {
    javascript: {
      initial: 100, // KB
      total: 200, // KB
    },
    css: {
      initial: 50, // KB
      total: 100, // KB
    },
    images: {
      total: 1000, // KB
    },
    fonts: {
      total: 100, // KB
    },
  },

  // Monitoring and analytics
  monitoring: {
    enabled: true,
    sampleRate: 0.1, // 10% of users
    endpoints: {
      webVitals: '/api/web-vitals',
      errors: '/api/errors',
      performance: '/api/performance',
    },
  },

  // Development settings
  development: {
    enableSourceMaps: true,
    enableHMR: true,
    bundleAnalyzer: false,
  },

  // Production optimizations
  production: {
    minifyHTML: true,
    minifyCSS: true,
    minifyJS: true,
    optimizeImages: true,
    generateSitemap: true,
    enableCompression: true,
    enableCaching: true,
  },
};

export default performanceConfig;
