// Site configuration types
export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  image: string;
  author: string;
}

// Re-export team member types from content.ts
export type { TeamMember } from './content.js';

// Content types
export interface SectionContent {
  title: string;
  order: number;
  published: boolean;
}
