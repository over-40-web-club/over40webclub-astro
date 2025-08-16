import { getCollection, type CollectionEntry } from 'astro:content';

// Type definitions for content collections
export type SectionEntry = CollectionEntry<'sections'>;
export type NavigationEntry = CollectionEntry<'navigation'>;
export type HeroEntry = CollectionEntry<'hero'>;
export type FooterEntry = CollectionEntry<'footer'>;

// Helper functions to get content collections
export async function getSections() {
  const sections = await getCollection('sections');
  return sections
    .filter((section) => section.data.published !== false)
    .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
}

export async function getSection(slug: string) {
  const sections = await getCollection('sections');
  return sections.find((section) => section.slug === slug);
}

export async function getNavigation() {
  const navigation = await getCollection('navigation');
  return navigation.find((nav) => nav.slug === 'main');
}

export async function getHero() {
  const hero = await getCollection('hero');
  return hero.find((h) => h.slug === 'main');
}

export async function getFooter() {
  const footer = await getCollection('footer');
  return footer.find((f) => f.slug === 'main');
}

// Helper function to get published sections by category or type
export async function getSectionsByType(type?: string) {
  const sections = await getSections();
  if (!type) return sections;

  return sections.filter((section) => {
    // You can add logic here to filter by type if needed
    return true;
  });
}

// Helper function to get section data with fallbacks
export function getSectionData(section: SectionEntry) {
  return {
    title: section.data.title || section.data.header || '',
    anchor: section.data.anchor || section.slug,
    header: section.data.header || '',
    subheader: section.data.subheader || '',
    services: section.data.services || [],
    portfolios: section.data.portfolios || [],
    timeline: section.data.timeline || [],
    clients: section.data.clients || [],
    telephone: section.data.telephone || '',
    email: section.data.email || '',
    content: section.data.content || '',
    order: section.data.order || 0,
    published: section.data.published !== false,
  };
}
