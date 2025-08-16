export interface SiteConfig {
  title: string;
  ogTitle: string;
  twitterTitle: string;
  description: string;
  ogDescription: string;
  twitterDescription: string;
  url: string;
  author: string;
  image: string;
  keywords: string[];
  trackingId: string;
  defaultLang: string;
  langTextMap: Record<string, string>;
  facebookAppId: string;
}

export const siteConfig: SiteConfig = {
  title: 'Over 40 Web Club',
  ogTitle: 'Over 40 Web Club',
  twitterTitle: 'Over 40 Web Club',
  description:
    'Web開発の勉強をしている40歳以上の方が、情報交換したり、助けあったり、交流を深めたりするためのオンラインコミュニティです。',
  ogDescription:
    'Web開発の勉強をしている40歳以上の方が、情報交換したり、助けあったり、交流を深めたりするためのオンラインコミュニティです。',
  twitterDescription:
    'Web開発の勉強をしている40歳以上の方が、情報交換したり、助けあったり、交流を深めたりするためのオンラインコミュニティです。',
  url: 'https://over40webclub.netlify.app/',
  author: 'Over 40 Web Club',
  image: 'https://over40webclub.netlify.app/images/seo.jpg',
  keywords: [
    'gatsby',
    'gatsbyjs',
    'landing page',
    'landing',
    'i18n',
    'eslint',
    'bootstrap',
    'startbootstrap-agency',
    'astro',
    'web development',
    'community',
    'over 40',
    'programming',
  ],
  trackingId: 'UA-119418003-5',
  defaultLang: 'ja',
  langTextMap: {
    ja: '日本語',
    en: 'English',
  },
  facebookAppId: '3764608810287628',
};

// Helper function to get site metadata
export function getSiteMetadata() {
  return {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    image: siteConfig.image,
    author: siteConfig.author,
    keywords: siteConfig.keywords.join(', '),
  };
}

// Helper function to get OG metadata
export function getOGMetadata() {
  return {
    title: siteConfig.ogTitle,
    description: siteConfig.ogDescription,
    url: siteConfig.url,
    image: siteConfig.image,
    type: 'website',
  };
}

// Helper function to get Twitter metadata
export function getTwitterMetadata() {
  return {
    title: siteConfig.twitterTitle,
    description: siteConfig.twitterDescription,
    image: siteConfig.image,
    card: 'summary_large_image',
  };
}
