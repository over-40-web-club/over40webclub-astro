import { defineCollection, z } from 'astro:content';

// Schema for service items in the About section
const serviceSchema = z.object({
  iconName: z.string(),
  header: z.string(),
  content: z.string(),
});

// Schema for portfolio items
const portfolioItemSchema = z.object({
  imageFileName: z.string(),
  imageFileNameDetail: z.string().optional(),
  header: z.string(),
  subheader: z.string().optional(),
  content: z.string(),
  extraInfo: z.array(z.string()).optional(),
});

// Schema for history/timeline items
const historyItemSchema = z.object({
  imageFileName: z.string().optional(),
  header: z.string().optional(),
  subheader: z.string().optional(),
  content: z.string().optional(),
  imageContent: z.string().optional(),
});

// Schema for client items
const clientSchema = z.object({
  imageFileName: z.string(),
  href: z.string().optional(),
});

// Main sections collection
const sectionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    order: z.number().optional(),
    published: z.boolean().default(true),
    // About section specific fields
    anchor: z.string().optional(),
    header: z.string().optional(),
    subheader: z.string().optional(),
    services: z.array(serviceSchema).optional(),
    // Portfolio section specific fields
    portfolios: z.array(portfolioItemSchema).optional(),
    // History section specific fields
    timeline: z.array(historyItemSchema).optional(),
    // Clients section specific fields
    clients: z.array(clientSchema).optional(),
    // Contact section specific fields
    telephone: z.string().optional(),
    email: z.string().optional(),
    // Team section specific fields
    content: z.string().optional(),
  }),
});

// Navigation collection
const navigationCollection = defineCollection({
  type: 'content',
  schema: z.object({
    brand: z.string(),
    menuText: z.string(),
  }),
});

// Hero/Top section collection
const heroCollection = defineCollection({
  type: 'content',
  schema: z.object({
    header: z.string(),
    subheader: z.string(),
    imageFileName: z.string(),
    jumpToAnchor: z.string(),
    jumpToAnchorText: z.string(),
    announcement: z.string().optional(),
  }),
});

// Team member collection
const teamCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().optional(),
    order: z.number().optional(),
    social: z
      .object({
        homepage: z.string().optional(),
        twitter: z.string().optional(),
        facebook: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        medium: z.string().optional(),
        instagram: z.string().optional(),
        youtube: z.string().optional(),
      })
      .optional(),
  }),
});

// Footer collection
const footerCollection = defineCollection({
  type: 'content',
  schema: z.object({
    copyright: z.string().optional(),
    social: z
      .object({
        twitter: z.string().optional(),
        facebook: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        medium: z.string().optional(),
        instagram: z.string().optional(),
        youtube: z.string().optional(),
        homepage: z.string().optional(),
      })
      .optional(),
    privacyText: z.string().optional(),
    privacyHref: z.string().optional(),
    termsText: z.string().optional(),
    termsHref: z.string().optional(),
  }),
});

export const collections = {
  sections: sectionsCollection,
  navigation: navigationCollection,
  hero: heroCollection,
  footer: footerCollection,
  team: teamCollection,
};
