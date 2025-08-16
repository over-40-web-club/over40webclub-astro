import { describe, it, expect } from 'vitest';
import {
  getIconClass,
  isValidIconName,
  getAvailableIcons,
  iconCategories,
  getIconsByCategory,
  getIconCategory,
  isBrandIcon,
  isSolidIcon,
  isLegacyIcon,
  convertLegacyIconName,
} from './icons.js';

describe('Icon System', () => {
  describe('getIconClass', () => {
    it('should return correct FontAwesome class for solid icons', () => {
      expect(getIconClass('phone')).toBe('fas fa-phone');
      expect(getIconClass('envelope')).toBe('fas fa-envelope');
      expect(getIconClass('plus')).toBe('fas fa-plus');
    });

    it('should return correct FontAwesome class for brand icons', () => {
      expect(getIconClass('twitter')).toBe('fab fa-twitter');
      expect(getIconClass('github')).toBe('fab fa-github');
      expect(getIconClass('linkedin')).toBe('fab fa-linkedin-in');
    });

    it('should return correct FontAwesome class for legacy icon names', () => {
      expect(getIconClass('PhoneIcon')).toBe('fas fa-phone');
      expect(getIconClass('TwitterIcon')).toBe('fab fa-twitter');
      expect(getIconClass('BarsIcon')).toBe('fas fa-bars');
    });

    it('should return fallback class for unknown icons', () => {
      expect(getIconClass('unknown-icon')).toBe('fas fa-unknown-icon');
    });
  });

  describe('isValidIconName', () => {
    it('should return true for valid icon names', () => {
      expect(isValidIconName('phone')).toBe(true);
      expect(isValidIconName('twitter')).toBe(true);
      expect(isValidIconName('PhoneIcon')).toBe(true);
    });

    it('should return false for invalid icon names', () => {
      expect(isValidIconName('invalid-icon')).toBe(false);
      expect(isValidIconName('')).toBe(false);
    });
  });

  describe('getAvailableIcons', () => {
    it('should return an array of all available icons', () => {
      const icons = getAvailableIcons();
      expect(Array.isArray(icons)).toBe(true);
      expect(icons.length).toBeGreaterThan(0);
      expect(icons).toContain('phone');
      expect(icons).toContain('twitter');
      expect(icons).toContain('PhoneIcon');
    });
  });

  describe('iconCategories', () => {
    it('should have solid icons category', () => {
      expect(iconCategories.solid).toContain('phone');
      expect(iconCategories.solid).toContain('envelope');
      expect(iconCategories.solid).toContain('bars');
    });

    it('should have brand icons category', () => {
      expect(iconCategories.brand).toContain('twitter');
      expect(iconCategories.brand).toContain('github');
      expect(iconCategories.brand).toContain('linkedin');
    });

    it('should have legacy icons category', () => {
      expect(iconCategories.legacy).toContain('PhoneIcon');
      expect(iconCategories.legacy).toContain('TwitterIcon');
      expect(iconCategories.legacy).toContain('BarsIcon');
    });
  });

  describe('Icon mapping completeness', () => {
    it('should have all original SystemIcons mapped', () => {
      const originalIcons = [
        'PhoneIcon',
        'EnvelopIcon',
        'PlusIcon',
        'BarsIcon',
        'CloseIcon',
        'LanguageIcon',
        'ShoppingCartIcon',
        'LaptopIcon',
        'LockIcon',
        'HomepageIcon',
        'TwitterIcon',
        'FacebookIcon',
        'LinkedinIcon',
        'GithubIcon',
        'MediumIcon',
        'InstagramIcon',
        'YoutubeIcon',
      ];

      originalIcons.forEach((icon) => {
        expect(isValidIconName(icon)).toBe(true);
        expect(getIconClass(icon)).not.toBe(`fas fa-${icon}`); // Should not use fallback
      });
    });

    it('should have modern icon names mapped', () => {
      const modernIcons = [
        'phone',
        'envelope',
        'plus',
        'bars',
        'times',
        'globe',
        'shopping-cart',
        'laptop',
        'lock',
        'twitter',
        'facebook',
        'linkedin',
        'github',
        'medium',
        'instagram',
        'youtube',
      ];

      modernIcons.forEach((icon) => {
        expect(isValidIconName(icon)).toBe(true);
      });
    });
  });

  describe('Icon utility functions', () => {
    it('should correctly identify brand icons', () => {
      expect(isBrandIcon('twitter')).toBe(true);
      expect(isBrandIcon('github')).toBe(true);
      expect(isBrandIcon('phone')).toBe(false);
      expect(isBrandIcon('envelope')).toBe(false);
    });

    it('should correctly identify solid icons', () => {
      expect(isSolidIcon('phone')).toBe(true);
      expect(isSolidIcon('envelope')).toBe(true);
      expect(isSolidIcon('twitter')).toBe(false);
      expect(isSolidIcon('github')).toBe(false);
    });

    it('should correctly identify legacy icons', () => {
      expect(isLegacyIcon('PhoneIcon')).toBe(true);
      expect(isLegacyIcon('TwitterIcon')).toBe(true);
      expect(isLegacyIcon('phone')).toBe(false);
      expect(isLegacyIcon('twitter')).toBe(false);
    });

    it('should get correct icon category', () => {
      expect(getIconCategory('phone')).toBe('solid');
      expect(getIconCategory('twitter')).toBe('brand');
      expect(getIconCategory('PhoneIcon')).toBe('legacy');
      expect(getIconCategory('nonexistent')).toBe(null);
    });

    it('should convert legacy icon names to modern equivalents', () => {
      expect(convertLegacyIconName('PhoneIcon')).toBe('phone');
      expect(convertLegacyIconName('TwitterIcon')).toBe('twitter');
      expect(convertLegacyIconName('ShoppingCartIcon')).toBe('shopping-cart');
      expect(convertLegacyIconName('phone')).toBe('phone'); // No conversion needed
    });

    it('should get icons by category', () => {
      const solidIcons = getIconsByCategory('solid');
      expect(solidIcons).toContain('phone');
      expect(solidIcons).toContain('envelope');
      expect(solidIcons).not.toContain('twitter');

      const brandIcons = getIconsByCategory('brand');
      expect(brandIcons).toContain('twitter');
      expect(brandIcons).toContain('github');
      expect(brandIcons).not.toContain('phone');

      const legacyIcons = getIconsByCategory('legacy');
      expect(legacyIcons).toContain('PhoneIcon');
      expect(legacyIcons).toContain('TwitterIcon');
      expect(legacyIcons).not.toContain('phone');
    });
  });
});
