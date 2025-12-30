/**
 * SEO utilities for generating structured data and meta tags
 */

import { siteConfig } from '../config/site';

export interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

/**
 * Generate Organization structured data (JSON-LD)
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/images/logo.png`,
      width: 512,
      height: 512,
    },
    image: {
      '@type': 'ImageObject',
      url: siteConfig.image,
    },
    sameAs: [
      'https://twitter.com/over40webclub',
      'https://github.com/over40webclub',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Japanese'],
    },
    foundingDate: '2018',
    knowsAbout: [
      'Web Development',
      'Programming',
      'JavaScript',
      'TypeScript',
      'React',
      'Astro',
      'Community Building',
    ],
  };
}

/**
 * Generate WebSite structured data (JSON-LD)
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: 'ja-JP',
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      '@type': 'Organization',
      name: siteConfig.author,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Article structured data (JSON-LD) for blog posts or articles
 */
export function generateArticleSchema(data: SEOData) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title || siteConfig.title,
    description: data.description || siteConfig.description,
    image: data.image || siteConfig.image,
    url: data.url || siteConfig.url,
    datePublished: data.publishedTime || new Date().toISOString(),
    dateModified: data.modifiedTime || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: data.author || siteConfig.author,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.author,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url || siteConfig.url,
    },
    inLanguage: 'ja-JP',
  };

  // Add keywords if tags are provided
  if (data.tags && data.tags.length > 0) {
    return {
      ...baseSchema,
      keywords: data.tags.join(', '),
    };
  }

  return baseSchema;
}

/**
 * Generate BreadcrumbList structured data (JSON-LD)
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Generate FAQ structured data (JSON-LD)
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate complete structured data for a page
 */
export function generatePageSchema(data: SEOData = {}) {
  const schemas: any[] = [generateOrganizationSchema(), generateWebSiteSchema()];

  // Add article schema if it's an article type
  if (data.type === 'article') {
    schemas.push(generateArticleSchema(data));
  }

  return schemas;
}

/**
 * Generate meta tags for SEO
 */
export function generateMetaTags(data: SEOData = {}) {
  const title = data.title
    ? `${data.title} | ${siteConfig.title}`
    : siteConfig.title;
  const description = data.description || siteConfig.description;
  const image = data.image || siteConfig.image;
  const url = data.url || siteConfig.url;
  const type = data.type || 'website';

  return {
    title,
    description,
    image,
    url,
    type,
    // Additional meta tags
    keywords: siteConfig.keywords.join(', '),
    author: siteConfig.author,
    robots: 'index, follow',
    // Open Graph
    ogTitle: data.title || siteConfig.ogTitle,
    ogDescription: data.description || siteConfig.ogDescription,
    ogImage: image,
    ogUrl: url,
    ogType: type,
    ogSiteName: siteConfig.title,
    ogLocale: 'ja_JP',
    // Twitter
    twitterCard: 'summary_large_image',
    twitterTitle: data.title || siteConfig.twitterTitle,
    twitterDescription: data.description || siteConfig.twitterDescription,
    twitterImage: image,
    twitterSite: '@over40webclub',
    twitterCreator: '@over40webclub',
  };
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(
  pathname: string,
  baseUrl: string = siteConfig.url
): string {
  return new URL(pathname, baseUrl).toString();
}

/**
 * Generate robots meta content
 */
export function generateRobotsContent(
  options: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
  } = {}
): string {
  const {
    index = true,
    follow = true,
    noarchive = false,
    nosnippet = false,
    noimageindex = false,
  } = options;

  const directives = [];

  directives.push(index ? 'index' : 'noindex');
  directives.push(follow ? 'follow' : 'nofollow');

  if (noarchive) directives.push('noarchive');
  if (nosnippet) directives.push('nosnippet');
  if (noimageindex) directives.push('noimageindex');

  return directives.join(', ');
}
