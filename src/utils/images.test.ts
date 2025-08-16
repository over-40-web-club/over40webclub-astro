import { describe, it, expect } from 'vitest';
import {
  getImagePath,
  getImageAlt,
  isExternalImage,
  getImageAttributes,
  getDefaultImageSize,
  generateSrcSet,
  shouldPreloadImage,
  getOptimalQuality,
} from './images';

describe('Image Utilities', () => {
  describe('getImagePath', () => {
    it('should prepend /images/ to relative paths', () => {
      expect(getImagePath('portfolio/01-thumbnail.jpg')).toBe(
        '/images/portfolio/01-thumbnail.jpg'
      );
      expect(getImagePath('team/member1.jpg')).toBe('/images/team/member1.jpg');
    });

    it('should handle paths with leading slash', () => {
      expect(getImagePath('/portfolio/01-thumbnail.jpg')).toBe(
        '/images/portfolio/01-thumbnail.jpg'
      );
    });

    it('should handle empty paths', () => {
      expect(getImagePath('')).toBe('/images/');
    });
  });

  describe('getImageAlt', () => {
    it('should return fallback when provided', () => {
      expect(getImageAlt('any-path.jpg', 'Custom Alt Text')).toBe(
        'Custom Alt Text'
      );
    });

    it('should generate alt from filename when no fallback', () => {
      expect(getImageAlt('portfolio/project-name.jpg')).toBe('Project Name');
      expect(getImageAlt('team/john-doe.jpg')).toBe('John Doe');
    });

    it('should handle filenames with underscores and dashes', () => {
      expect(getImageAlt('images/test_image-file.jpg')).toBe('Test Image File');
    });

    it('should handle paths without filename', () => {
      expect(getImageAlt('folder/')).toBe('');
    });

    it('should handle paths without extension', () => {
      expect(getImageAlt('folder/filename')).toBe('Filename');
    });
  });

  describe('isExternalImage', () => {
    it('should return true for HTTP URLs', () => {
      expect(isExternalImage('http://example.com/image.jpg')).toBe(true);
      expect(isExternalImage('https://example.com/image.jpg')).toBe(true);
    });

    it('should return true for absolute paths', () => {
      expect(isExternalImage('/absolute/path/image.jpg')).toBe(true);
    });

    it('should return false for relative paths', () => {
      expect(isExternalImage('relative/path/image.jpg')).toBe(false);
      expect(isExternalImage('image.jpg')).toBe(false);
    });
  });

  describe('getImageAttributes', () => {
    it('should return correct attributes for external images', () => {
      const attrs = getImageAttributes(
        'https://example.com/image.jpg',
        'Test Alt',
        800,
        600
      );

      expect(attrs).toEqual({
        src: 'https://example.com/image.jpg',
        alt: 'Test Alt',
        width: 800,
        height: 600,
        loading: 'lazy',
        decoding: 'async',
      });
    });

    it('should return correct attributes for local images', () => {
      const attrs = getImageAttributes('portfolio/project.jpg', '', 400, 300);

      expect(attrs).toEqual({
        src: '/images/portfolio/project.jpg',
        alt: 'Project',
        width: 400,
        height: 300,
        loading: 'lazy',
        decoding: 'async',
      });
    });

    it('should work without width and height', () => {
      const attrs = getImageAttributes('test.jpg', 'Test Image');

      expect(attrs).toEqual({
        src: '/images/test.jpg',
        alt: 'Test Image',
        loading: 'lazy',
        decoding: 'async',
      });
      expect(attrs).not.toHaveProperty('width');
      expect(attrs).not.toHaveProperty('height');
    });

    it('should generate alt text when not provided', () => {
      const attrs = getImageAttributes('team/john-doe.jpg');

      expect(attrs.alt).toBe('John Doe');
    });
  });

  describe('getDefaultImageSize', () => {
    it('should return correct size for portfolio thumbnails', () => {
      expect(getDefaultImageSize('portfolio/01-thumbnail.jpg')).toEqual({
        width: 400,
        height: 300,
      });
    });

    it('should return correct size for portfolio full images', () => {
      expect(getDefaultImageSize('portfolio/01-full.jpg')).toEqual({
        width: 800,
        height: 600,
      });
    });

    it('should return correct size for team images', () => {
      expect(getDefaultImageSize('team/member1.jpg')).toEqual({
        width: 200,
        height: 200,
      });
    });

    it('should return correct size for history images', () => {
      expect(getDefaultImageSize('history/event1.jpg')).toEqual({
        width: 300,
        height: 200,
      });
    });

    it('should return correct size for logos', () => {
      expect(getDefaultImageSize('logos/company-logo.png')).toEqual({
        width: 150,
        height: 100,
      });
    });

    it('should return correct size for header backgrounds', () => {
      expect(getDefaultImageSize('header-bg.jpg')).toEqual({
        width: 1920,
        height: 1080,
      });
    });

    it('should return default size for unknown image types', () => {
      expect(getDefaultImageSize('unknown/image.jpg')).toEqual({
        width: 400,
        height: 300,
      });
    });

    it('should be case insensitive', () => {
      expect(getDefaultImageSize('PORTFOLIO/THUMBNAIL.JPG')).toEqual({
        width: 400,
        height: 300,
      });
    });
  });

  describe('generateSrcSet', () => {
    it('should return correct sizes for large images (>=800px)', () => {
      const result = generateSrcSet(800);
      expect(result).toBe(
        '(max-width: 576px) 100vw, (max-width: 768px) 90vw, (max-width: 992px) 80vw, 70vw'
      );
    });

    it('should return correct sizes for medium images (>=400px)', () => {
      const result = generateSrcSet(400);
      expect(result).toBe(
        '(max-width: 576px) 90vw, (max-width: 768px) 45vw, (max-width: 992px) 30vw, 25vw'
      );
    });

    it('should return correct sizes for small images (>=200px)', () => {
      const result = generateSrcSet(200);
      expect(result).toBe(
        '(max-width: 576px) 50vw, (max-width: 768px) 33vw, (max-width: 992px) 25vw, 20vw'
      );
    });

    it('should return correct sizes for very small images (<200px)', () => {
      const result = generateSrcSet(100);
      expect(result).toBe(
        '(max-width: 576px) 30vw, (max-width: 768px) 20vw, 15vw'
      );
    });
  });

  describe('shouldPreloadImage', () => {
    it('should return true for header background images', () => {
      expect(shouldPreloadImage('header-bg.jpg')).toBe(true);
      expect(shouldPreloadImage('images/header-bg.png')).toBe(true);
    });

    it('should return true for hero images', () => {
      expect(shouldPreloadImage('hero-banner.jpg')).toBe(true);
      expect(shouldPreloadImage('images/hero-image.png')).toBe(true);
    });

    it('should return true for logo images', () => {
      expect(shouldPreloadImage('logo.png')).toBe(true);
      expect(shouldPreloadImage('company-logo.svg')).toBe(true);
    });

    it('should return false for other images', () => {
      expect(shouldPreloadImage('portfolio/project1.jpg')).toBe(false);
      expect(shouldPreloadImage('team/member1.jpg')).toBe(false);
      expect(shouldPreloadImage('background.jpg')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(shouldPreloadImage('HEADER-BG.JPG')).toBe(true);
      expect(shouldPreloadImage('HERO.PNG')).toBe(true);
      expect(shouldPreloadImage('LOGO.SVG')).toBe(true);
    });
  });

  describe('getOptimalQuality', () => {
    it('should increase quality for team and portfolio images', () => {
      expect(getOptimalQuality('team/member1.jpg', 80)).toBe(85);
      expect(getOptimalQuality('portfolio/project1.jpg', 80)).toBe(85);
    });

    it('should not exceed maximum quality of 95', () => {
      expect(getOptimalQuality('team/member1.jpg', 92)).toBe(95);
      expect(getOptimalQuality('portfolio/project1.jpg', 95)).toBe(95);
    });

    it('should decrease quality for logos and icons', () => {
      expect(getOptimalQuality('logo.png', 80)).toBe(70);
      expect(getOptimalQuality('icon.svg', 80)).toBe(70);
    });

    it('should not go below minimum quality of 70', () => {
      expect(getOptimalQuality('logo.png', 75)).toBe(70);
      expect(getOptimalQuality('icon.svg', 70)).toBe(70);
    });

    it('should return default quality for other images', () => {
      expect(getOptimalQuality('background.jpg', 80)).toBe(80);
      expect(getOptimalQuality('header-bg.jpg', 85)).toBe(85);
    });

    it('should use default quality when not specified', () => {
      expect(getOptimalQuality('team/member1.jpg')).toBe(90); // 85 + 5
      expect(getOptimalQuality('logo.png')).toBe(75); // 85 - 10
      expect(getOptimalQuality('background.jpg')).toBe(85); // default
    });

    it('should be case insensitive', () => {
      expect(getOptimalQuality('TEAM/MEMBER1.JPG', 80)).toBe(85);
      expect(getOptimalQuality('LOGO.PNG', 80)).toBe(70);
    });
  });
});
