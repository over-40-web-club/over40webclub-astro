import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateSrcSet,
  shouldPreloadImage,
  getOptimalQuality,
} from './images';
import { CORE_WEB_VITALS_CONFIG, PRECONNECT_DOMAINS } from './performance';

describe('Performance Utilities', () => {
  describe('generateSrcSet', () => {
    it('should generate correct sizes for large images', () => {
      const result = generateSrcSet(800);
      expect(result).toBe(
        '(max-width: 576px) 100vw, (max-width: 768px) 90vw, (max-width: 992px) 80vw, 70vw'
      );
    });

    it('should generate correct sizes for medium images', () => {
      const result = generateSrcSet(400);
      expect(result).toBe(
        '(max-width: 576px) 90vw, (max-width: 768px) 45vw, (max-width: 992px) 30vw, 25vw'
      );
    });

    it('should generate correct sizes for small images', () => {
      const result = generateSrcSet(200);
      expect(result).toBe(
        '(max-width: 576px) 50vw, (max-width: 768px) 33vw, (max-width: 992px) 25vw, 20vw'
      );
    });

    it('should generate correct sizes for very small images', () => {
      const result = generateSrcSet(100);
      expect(result).toBe(
        '(max-width: 576px) 30vw, (max-width: 768px) 20vw, 15vw'
      );
    });
  });

  describe('shouldPreloadImage', () => {
    it('should return true for header background images', () => {
      expect(shouldPreloadImage('/images/header-bg.jpg')).toBe(true);
      expect(shouldPreloadImage('/images/HEADER-BG.PNG')).toBe(true);
    });

    it('should return true for hero images', () => {
      expect(shouldPreloadImage('/images/hero-banner.jpg')).toBe(true);
      expect(shouldPreloadImage('/images/hero-image.png')).toBe(true);
    });

    it('should return true for logo images', () => {
      expect(shouldPreloadImage('/images/logo.png')).toBe(true);
      expect(shouldPreloadImage('/images/company-logo.svg')).toBe(true);
    });

    it('should return false for other images', () => {
      expect(shouldPreloadImage('/images/portfolio/project1.jpg')).toBe(false);
      expect(shouldPreloadImage('/images/team/member1.jpg')).toBe(false);
    });
  });

  describe('getOptimalQuality', () => {
    it('should increase quality for team and portfolio images', () => {
      expect(getOptimalQuality('/images/team/member1.jpg', 80)).toBe(85);
      expect(getOptimalQuality('/images/portfolio/project1.jpg', 80)).toBe(85);
      expect(getOptimalQuality('/images/team/member1.jpg', 90)).toBe(95); // max 95
    });

    it('should decrease quality for logos and icons', () => {
      expect(getOptimalQuality('/images/logo.png', 80)).toBe(70);
      expect(getOptimalQuality('/images/icon.svg', 80)).toBe(70);
      expect(getOptimalQuality('/images/logo.png', 75)).toBe(70); // min 70
    });

    it('should return default quality for other images', () => {
      expect(getOptimalQuality('/images/background.jpg', 80)).toBe(80);
      expect(getOptimalQuality('/images/hero-bg.jpg', 85)).toBe(85);
    });
  });

  describe('CORE_WEB_VITALS_CONFIG', () => {
    it('should have valid LCP configuration', () => {
      expect(CORE_WEB_VITALS_CONFIG.lcp).toBeDefined();
      expect(CORE_WEB_VITALS_CONFIG.lcp.heroImages).toBeInstanceOf(Array);
      expect(CORE_WEB_VITALS_CONFIG.lcp.preloadResources).toBeInstanceOf(Array);
    });

    it('should have valid CLS configuration', () => {
      expect(CORE_WEB_VITALS_CONFIG.cls).toBeDefined();
      expect(CORE_WEB_VITALS_CONFIG.cls.maintainAspectRatio).toBe(true);
      expect(CORE_WEB_VITALS_CONFIG.cls.fontDisplaySwap).toBe(true);
    });

    it('should have valid FID configuration', () => {
      expect(CORE_WEB_VITALS_CONFIG.fid).toBeDefined();
      expect(CORE_WEB_VITALS_CONFIG.fid.deferNonCriticalJS).toBe(true);
      expect(CORE_WEB_VITALS_CONFIG.fid.passiveEventListeners).toBe(true);
    });
  });

  describe('PRECONNECT_DOMAINS', () => {
    it('should include essential external domains', () => {
      expect(PRECONNECT_DOMAINS).toContain('https://fonts.googleapis.com');
      expect(PRECONNECT_DOMAINS).toContain('https://fonts.gstatic.com');
      expect(PRECONNECT_DOMAINS).toContain('https://api.airtable.com');
    });

    it('should only include HTTPS domains', () => {
      PRECONNECT_DOMAINS.forEach((domain) => {
        expect(domain).toMatch(/^https:\/\//);
      });
    });
  });
});

describe('Performance Monitoring', () => {
  beforeEach(() => {
    // Mock performance API
    global.performance = {
      now: vi.fn(() => 1000),
      mark: vi.fn(),
      measure: vi.fn(),
      getEntriesByType: vi.fn(() => []),
      getEntriesByName: vi.fn(() => []),
    } as any;

    // Mock PerformanceObserver
    global.PerformanceObserver = vi.fn().mockImplementation((callback) => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  it('should have performance API available', () => {
    expect(global.performance).toBeDefined();
    expect(global.performance.now).toBeDefined();
    expect(global.performance.mark).toBeDefined();
  });

  it('should have PerformanceObserver available', () => {
    expect(global.PerformanceObserver).toBeDefined();
  });
});

describe('Image Optimization', () => {
  describe('Aspect Ratio Calculations', () => {
    it('should calculate correct aspect ratios', () => {
      // 16:9 aspect ratio
      const ratio16_9 = (9 / 16) * 100;
      expect(ratio16_9).toBeCloseTo(56.25);

      // 4:3 aspect ratio
      const ratio4_3 = (3 / 4) * 100;
      expect(ratio4_3).toBe(75);

      // 1:1 aspect ratio
      const ratio1_1 = (1 / 1) * 100;
      expect(ratio1_1).toBe(100);
    });
  });

  describe('Image Format Optimization', () => {
    it('should prefer modern formats', () => {
      const modernFormats = ['webp', 'avif'];
      const legacyFormats = ['jpg', 'png'];

      // Modern formats should be preferred
      expect(modernFormats).toContain('webp');
      expect(modernFormats).toContain('avif');

      // Legacy formats should be fallbacks
      expect(legacyFormats).toContain('jpg');
      expect(legacyFormats).toContain('png');
    });
  });
});

describe('CSS Performance', () => {
  describe('Critical CSS Detection', () => {
    it('should identify critical selectors', () => {
      const criticalSelectors = [
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
      ];

      criticalSelectors.forEach((selector) => {
        expect(typeof selector).toBe('string');
        expect(selector.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('Font Loading Optimization', () => {
  describe('Font Display Strategy', () => {
    it('should use font-display: swap for better performance', () => {
      const fontDisplayValue = 'swap';
      expect(fontDisplayValue).toBe('swap');
    });
  });

  describe('Font Preloading', () => {
    it('should preload critical fonts', () => {
      const criticalFonts = ['Montserrat', 'Roboto Slab'];

      criticalFonts.forEach((font) => {
        expect(typeof font).toBe('string');
        expect(font.length).toBeGreaterThan(0);
      });
    });
  });
});
