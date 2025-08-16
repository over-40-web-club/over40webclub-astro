/**
 * Font loading utilities for optimized font display
 */

export interface FontConfig {
  family: string;
  weights: number[];
  styles?: string[];
  display?: string;
}

export const FONT_CONFIGS: FontConfig[] = [
  {
    family: 'Montserrat',
    weights: [300, 400, 500, 600, 700, 800],
    styles: ['normal', 'italic'],
    display: 'swap',
  },
  {
    family: 'Roboto Slab',
    weights: [300, 400, 500, 600, 700, 800],
    styles: ['normal'],
    display: 'swap',
  },
  {
    family: 'Kaushan Script',
    weights: [400],
    styles: ['normal'],
    display: 'swap',
  },
];

/**
 * Generate Google Fonts URL with optimized parameters
 */
export function generateGoogleFontsUrl(
  configs: FontConfig[] = FONT_CONFIGS
): string {
  const families = configs.map((config) => {
    const { family, weights, styles = ['normal'] } = config;
    const encodedFamily = family.replace(/\s+/g, '+');

    if (styles.includes('italic') && styles.includes('normal')) {
      const weightSpecs = weights.flatMap((weight) => [
        `0,${weight}`,
        `1,${weight}`,
      ]);
      return `${encodedFamily}:ital,wght@${weightSpecs.join(';')}`;
    } else {
      return `${encodedFamily}:wght@${weights.join(';')}`;
    }
  });

  return `https://fonts.googleapis.com/css2?${families
    .map((f) => `family=${f}`)
    .join('&')}&display=swap`;
}

/**
 * Get font fallback stack
 */
export function getFontStack(primaryFont: string): string {
  const fallbacks = [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"',
  ];

  return `"${primaryFont}", ${fallbacks.join(', ')}`;
}

/**
 * Font loading detection
 */
export function detectFontLoad(): Promise<void> {
  return new Promise((resolve) => {
    if ('fonts' in document) {
      Promise.all([
        document.fonts.load('400 1em Montserrat'),
        document.fonts.load('400 1em "Roboto Slab"'),
        document.fonts.load('400 1em "Kaushan Script"'),
      ])
        .then(() => {
          document.documentElement.classList.add('fonts-loaded');
          document.documentElement.classList.remove('fonts-loading');
          resolve();
        })
        .catch(() => {
          // Fallback if font loading fails
          setTimeout(() => {
            document.documentElement.classList.add('fonts-loaded');
            document.documentElement.classList.remove('fonts-loading');
            resolve();
          }, 3000);
        });
    } else {
      // Fallback for browsers without Font Loading API
      setTimeout(() => {
        document.documentElement.classList.add('fonts-loaded');
        document.documentElement.classList.remove('fonts-loading');
        resolve();
      }, 1000);
    }
  });
}

/**
 * Initialize font loading optimization
 */
export function initFontLoading(): void {
  // Add loading class initially
  document.documentElement.classList.add('fonts-loading');

  // Detect when fonts are loaded
  detectFontLoad();
}
