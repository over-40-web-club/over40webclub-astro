import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  FONT_CONFIGS,
  generateGoogleFontsUrl,
  getFontStack,
  detectFontLoad,
  initFontLoading,
} from './fonts';

// Mock document and window
const mockDocumentFonts = {
  load: vi.fn(),
};

const mockDocumentElement = {
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
  },
};

beforeEach(() => {
  // Reset mocks
  vi.clearAllMocks();

  // Mock document
  Object.defineProperty(document, 'fonts', {
    value: mockDocumentFonts,
    writable: true,
  });

  Object.defineProperty(document, 'documentElement', {
    value: mockDocumentElement,
    writable: true,
  });

  // Mock setTimeout
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Font Utilities', () => {
  describe('FONT_CONFIGS', () => {
    it('should have correct font configurations', () => {
      expect(FONT_CONFIGS).toHaveLength(3);

      const montserrat = FONT_CONFIGS.find((f) => f.family === 'Montserrat');
      expect(montserrat).toBeDefined();
      expect(montserrat!.weights).toEqual([300, 400, 500, 600, 700, 800]);
      expect(montserrat!.styles).toEqual(['normal', 'italic']);
      expect(montserrat!.display).toBe('swap');

      const robotoSlab = FONT_CONFIGS.find((f) => f.family === 'Roboto Slab');
      expect(robotoSlab).toBeDefined();
      expect(robotoSlab!.weights).toEqual([300, 400, 500, 600, 700, 800]);
      expect(robotoSlab!.styles).toEqual(['normal']);

      const kaushanScript = FONT_CONFIGS.find(
        (f) => f.family === 'Kaushan Script'
      );
      expect(kaushanScript).toBeDefined();
      expect(kaushanScript!.weights).toEqual([400]);
      expect(kaushanScript!.styles).toEqual(['normal']);
    });
  });

  describe('generateGoogleFontsUrl', () => {
    it('should generate correct URL for default fonts', () => {
      const url = generateGoogleFontsUrl();

      expect(url).toContain('https://fonts.googleapis.com/css2?');
      expect(url).toContain('family=Montserrat:ital,wght@');
      expect(url).toContain('family=Roboto+Slab:wght@');
      expect(url).toContain('family=Kaushan+Script:wght@');
      expect(url).toContain('&display=swap');
    });

    it('should handle fonts with italic styles correctly', () => {
      const configs = [
        {
          family: 'Test Font',
          weights: [400, 700],
          styles: ['normal', 'italic'],
          display: 'swap',
        },
      ];

      const url = generateGoogleFontsUrl(configs);

      expect(url).toContain('Test+Font:ital,wght@0,400;1,400;0,700;1,700');
    });

    it('should handle fonts without italic styles correctly', () => {
      const configs = [
        {
          family: 'Test Font',
          weights: [400, 700],
          styles: ['normal'],
          display: 'swap',
        },
      ];

      const url = generateGoogleFontsUrl(configs);

      expect(url).toContain('Test+Font:wght@400;700');
    });

    it('should encode font names with spaces', () => {
      const configs = [
        {
          family: 'Font With Spaces',
          weights: [400],
          styles: ['normal'],
          display: 'swap',
        },
      ];

      const url = generateGoogleFontsUrl(configs);

      expect(url).toContain('Font+With+Spaces');
    });
  });

  describe('getFontStack', () => {
    it('should return correct font stack with fallbacks', () => {
      const stack = getFontStack('Montserrat');

      expect(stack).toBe(
        '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
      );
    });

    it('should handle font names with quotes', () => {
      const stack = getFontStack('Roboto Slab');

      expect(stack).toContain('"Roboto Slab"');
      expect(stack).toContain('-apple-system');
      expect(stack).toContain('sans-serif');
    });
  });

  describe('detectFontLoad', () => {
    it('should resolve when fonts are loaded successfully', async () => {
      mockDocumentFonts.load.mockResolvedValue(undefined);

      const promise = detectFontLoad();

      await expect(promise).resolves.toBeUndefined();
      expect(mockDocumentFonts.load).toHaveBeenCalledWith('400 1em Montserrat');
      expect(mockDocumentFonts.load).toHaveBeenCalledWith(
        '400 1em "Roboto Slab"'
      );
      expect(mockDocumentFonts.load).toHaveBeenCalledWith(
        '400 1em "Kaushan Script"'
      );
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
        'fonts-loaded'
      );
      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith(
        'fonts-loading'
      );
    });

    it('should handle font loading failure with timeout', async () => {
      mockDocumentFonts.load.mockRejectedValue(new Error('Font load failed'));

      const promise = detectFontLoad();

      // Fast-forward timers to trigger the timeout
      await vi.advanceTimersByTimeAsync(3000);

      await promise;

      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
        'fonts-loaded'
      );
      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith(
        'fonts-loading'
      );
    });

    it('should use fallback when Font Loading API is not available', async () => {
      // Create a new document-like object without fonts API
      const mockDoc = {
        documentElement: mockDocumentElement,
      };

      // Temporarily replace document
      const originalDocument = global.document;
      global.document = mockDoc as any;

      const promise = detectFontLoad();

      // Fast-forward timers to trigger the fallback timeout
      await vi.advanceTimersByTimeAsync(1000);

      await promise;

      // Restore original document
      global.document = originalDocument;

      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
        'fonts-loaded'
      );
      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith(
        'fonts-loading'
      );
    });
  });

  describe('initFontLoading', () => {
    it('should add loading class and start font detection', () => {
      mockDocumentFonts.load.mockResolvedValue(undefined);

      initFontLoading();

      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
        'fonts-loading'
      );
      expect(mockDocumentFonts.load).toHaveBeenCalled();
    });
  });
});
