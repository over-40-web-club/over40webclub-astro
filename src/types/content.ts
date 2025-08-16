// Content collection types
export interface ServiceItem {
  iconName: string;
  header: string;
  content: string;
}

export interface PortfolioItem {
  title: string;
  subtitle?: string;
  image: string;
  category: string;
  url?: string;
}

export interface HistoryItem {
  date: string;
  title: string;
  content: string;
  image?: string;
}

export interface ClientItem {
  name: string;
  logo: string;
  url?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface QuickLink {
  text: string;
  url: string;
}

// Section data interface
export interface SectionData {
  title?: string;
  anchor?: string;
  header?: string;
  subheader?: string;
  order?: number;
  published?: boolean;
  services?: ServiceItem[];
  portfolio?: PortfolioItem[];
  timeline?: HistoryItem[];
  clients?: ClientItem[];
  address?: string;
  phone?: string;
  email?: string;
}

// Navigation data interface
export interface NavigationData {
  brand: string;
  menuText: string;
}

// Hero data interface
export interface HeroData {
  header: string;
  subheader: string;
  imageFileName: string;
  jumpToAnchor: string;
  jumpToAnchorText: string;
}

// Footer data interface
export interface FooterData {
  copyright?: string;
  socialLinks?: SocialLink[];
  quickLinks?: QuickLink[];
}

// Team member interface (for Airtable integration)
export interface TeamMember {
  id: string;
  name: string;
  bio: string;
  image: string;
  imageAlt: string;
  social: {
    homepage?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
    medium?: string;
    instagram?: string;
    youtube?: string;
  };
}

// Raw Airtable team member data structure
export interface AirtableTeamMember {
  id: string;
  fields: {
    Name: string;
    Bio: string;
    'Homepage URL'?: string;
    'Twitter username'?: string;
    'GitHub username'?: string;
    'Instagram username'?: string;
    'YouTube URL'?: string;
    Photo?: Array<{
      id: string;
      url: string;
      filename: string;
      size: number;
      type: string;
      thumbnails?: {
        small?: { url: string; width: number; height: number };
        large?: { url: string; width: number; height: number };
        full?: { url: string; width: number; height: number };
      };
    }>;
    Order?: number;
  };
}
