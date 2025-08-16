/**
 * Icon system utilities for FontAwesome icons
 * Migrated from the original SystemIcons.jsx
 */

// Define all available icon names as a union type for better type safety
export type IconName =
  // Solid icons
  | 'phone'
  | 'envelope'
  | 'plus'
  | 'bars'
  | 'times'
  | 'globe'
  | 'shopping-cart'
  | 'laptop'
  | 'lock'
  | 'paper-plane'
  | 'homepage'
  // Brand icons
  | 'twitter'
  | 'facebook'
  | 'linkedin'
  | 'github'
  | 'medium'
  | 'instagram'
  | 'youtube'
  | 'fort-awesome'
  // Legacy icon names for backward compatibility
  | 'PhoneIcon'
  | 'EnvelopIcon'
  | 'PlusIcon'
  | 'BarsIcon'
  | 'CloseIcon'
  | 'LanguageIcon'
  | 'ShoppingCartIcon'
  | 'LaptopIcon'
  | 'LockIcon'
  | 'HomepageIcon'
  | 'TwitterIcon'
  | 'FacebookIcon'
  | 'LinkedinIcon'
  | 'GithubIcon'
  | 'MediumIcon'
  | 'InstagramIcon'
  | 'YoutubeIcon';

// Map icon names to FontAwesome classes
const iconMap: Record<string, string> = {
  // Solid icons (fas)
  phone: 'fas fa-phone',
  envelope: 'fas fa-envelope',
  plus: 'fas fa-plus',
  bars: 'fas fa-bars',
  times: 'fas fa-times',
  globe: 'fas fa-globe',
  'shopping-cart': 'fas fa-shopping-cart',
  laptop: 'fas fa-laptop',
  lock: 'fas fa-lock',
  'paper-plane': 'fas fa-paper-plane',
  homepage: 'fas fa-home',

  // Brand icons (fab)
  twitter: 'fab fa-twitter',
  facebook: 'fab fa-facebook-f',
  linkedin: 'fab fa-linkedin-in',
  github: 'fab fa-github',
  medium: 'fab fa-medium-m',
  instagram: 'fab fa-instagram',
  youtube: 'fab fa-youtube',
  'fort-awesome': 'fab fa-fort-awesome',

  // Legacy icon names for backward compatibility
  PhoneIcon: 'fas fa-phone',
  EnvelopIcon: 'fas fa-envelope',
  PlusIcon: 'fas fa-plus',
  BarsIcon: 'fas fa-bars',
  CloseIcon: 'fas fa-times',
  LanguageIcon: 'fas fa-globe',
  ShoppingCartIcon: 'fas fa-shopping-cart',
  LaptopIcon: 'fas fa-laptop',
  LockIcon: 'fas fa-lock',
  HomepageIcon: 'fas fa-globe',
  TwitterIcon: 'fab fa-twitter',
  FacebookIcon: 'fab fa-facebook-f',
  LinkedinIcon: 'fab fa-linkedin-in',
  GithubIcon: 'fab fa-github',
  MediumIcon: 'fab fa-medium-m',
  InstagramIcon: 'fab fa-instagram',
  YoutubeIcon: 'fab fa-youtube',
};

/**
 * Get the FontAwesome CSS class for an icon name
 * @param name - The icon name
 * @returns The FontAwesome CSS class string
 */
export function getIconClass(name: IconName | string): string {
  const mappedClass = iconMap[name];
  if (mappedClass) {
    return mappedClass;
  }

  // Fallback: assume it's a solid icon if not found in the map
  return `fas fa-${name}`;
}

/**
 * Check if an icon name is valid
 * @param name - The icon name to check
 * @returns True if the icon name is valid
 */
export function isValidIconName(name: string): name is IconName {
  return name in iconMap;
}

/**
 * Get all available icon names
 * @returns Array of all available icon names
 */
export function getAvailableIcons(): IconName[] {
  return Object.keys(iconMap) as IconName[];
}

/**
 * Icon categories for better organization
 */
export const iconCategories = {
  solid: [
    'phone',
    'envelope',
    'plus',
    'bars',
    'times',
    'globe',
    'shopping-cart',
    'laptop',
    'lock',
    'paper-plane',
    'homepage',
  ] as const,
  brand: [
    'twitter',
    'facebook',
    'linkedin',
    'github',
    'medium',
    'instagram',
    'youtube',
    'fort-awesome',
  ] as const,
  legacy: [
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
  ] as const,
} as const;

/**
 * Get icons by category
 * @param category - The category to get icons for
 * @returns Array of icon names in the specified category
 */
export function getIconsByCategory(
  category: keyof typeof iconCategories
): readonly string[] {
  return iconCategories[category];
}

/**
 * Get the category of an icon
 * @param iconName - The icon name to check
 * @returns The category the icon belongs to, or null if not found
 */
export function getIconCategory(
  iconName: string
): keyof typeof iconCategories | null {
  for (const [category, icons] of Object.entries(iconCategories)) {
    if (icons.includes(iconName as any)) {
      return category as keyof typeof iconCategories;
    }
  }
  return null;
}

/**
 * Check if an icon is a brand icon
 * @param iconName - The icon name to check
 * @returns True if the icon is a brand icon
 */
export function isBrandIcon(iconName: string): boolean {
  return iconCategories.brand.includes(iconName as any);
}

/**
 * Check if an icon is a solid icon
 * @param iconName - The icon name to check
 * @returns True if the icon is a solid icon
 */
export function isSolidIcon(iconName: string): boolean {
  return iconCategories.solid.includes(iconName as any);
}

/**
 * Check if an icon is a legacy icon name
 * @param iconName - The icon name to check
 * @returns True if the icon is a legacy icon name
 */
export function isLegacyIcon(iconName: string): boolean {
  return iconCategories.legacy.includes(iconName as any);
}

/**
 * Convert legacy icon name to modern equivalent
 * @param legacyName - The legacy icon name
 * @returns The modern icon name, or the original name if no conversion is needed
 */
export function convertLegacyIconName(legacyName: string): string {
  const legacyToModernMap: Record<string, string> = {
    PhoneIcon: 'phone',
    EnvelopIcon: 'envelope',
    PlusIcon: 'plus',
    BarsIcon: 'bars',
    CloseIcon: 'times',
    LanguageIcon: 'globe',
    ShoppingCartIcon: 'shopping-cart',
    LaptopIcon: 'laptop',
    LockIcon: 'lock',
    HomepageIcon: 'globe',
    TwitterIcon: 'twitter',
    FacebookIcon: 'facebook',
    LinkedinIcon: 'linkedin',
    GithubIcon: 'github',
    MediumIcon: 'medium',
    InstagramIcon: 'instagram',
    YoutubeIcon: 'youtube',
  };

  return legacyToModernMap[legacyName] || legacyName;
}
