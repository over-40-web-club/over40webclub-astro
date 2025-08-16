/**
 * Dynamic SEO utilities for generating page-specific meta data
 */

import { siteConfig } from '../config/site';
import type { SEOData } from './seo';

/**
 * Generate SEO data for the home page
 */
export function getHomePageSEO(): SEOData {
  return {
    title: 'ホーム',
    description: siteConfig.description,
    type: 'website',
    tags: ['web development', 'community', 'over 40', 'programming', 'japan'],
  };
}

/**
 * Generate SEO data for the about section
 */
export function getAboutSEO(): SEOData {
  return {
    title: 'About - サービス紹介',
    description:
      '40歳以上のWeb開発者向けコミュニティ「Over 40 Web Club」のサービス内容をご紹介します。学習支援、情報交換、ネットワーキングの機会を提供しています。',
    type: 'website',
    tags: ['about', 'services', 'web development', 'community', 'learning'],
  };
}

/**
 * Generate SEO data for the portfolio section
 */
export function getPortfolioSEO(): SEOData {
  return {
    title: 'Portfolio - 実績紹介',
    description:
      'Over 40 Web Clubメンバーの実績とプロジェクトをご紹介します。多様な経験を持つメンバーの作品をご覧ください。',
    type: 'website',
    tags: ['portfolio', 'projects', 'showcase', 'web development', 'members'],
  };
}

/**
 * Generate SEO data for the history section
 */
export function getHistorySEO(): SEOData {
  return {
    title: 'History - 沿革',
    description:
      'Over 40 Web Clubの歴史と成長の軌跡をご紹介します。コミュニティの発展と主要なマイルストーンをご覧ください。',
    type: 'website',
    tags: ['history', 'timeline', 'milestones', 'community growth'],
  };
}

/**
 * Generate SEO data for the team section
 */
export function getTeamSEO(): SEOData {
  return {
    title: 'Team - チームメンバー',
    description:
      'Over 40 Web Clubの多様で経験豊富なチームメンバーをご紹介します。それぞれの専門分野と経験をご覧ください。',
    type: 'website',
    tags: ['team', 'members', 'profiles', 'expertise', 'experience'],
  };
}

/**
 * Generate SEO data for the clients section
 */
export function getClientsSEO(): SEOData {
  return {
    title: 'Clients - クライアント紹介',
    description:
      'Over 40 Web Clubが協力してきたクライアント企業をご紹介します。多様な業界での実績をご覧ください。',
    type: 'website',
    tags: ['clients', 'partnerships', 'collaborations', 'business'],
  };
}

/**
 * Generate SEO data for the contact section
 */
export function getContactSEO(): SEOData {
  return {
    title: 'Contact - お問い合わせ',
    description:
      'Over 40 Web Clubへのお問い合わせはこちらから。コミュニティ参加、協業、その他のご相談をお待ちしています。',
    type: 'website',
    tags: ['contact', 'inquiry', 'join', 'collaboration', 'support'],
  };
}

/**
 * Generate breadcrumbs for different sections
 */
export function generateSectionBreadcrumbs(
  sectionName: string
): Array<{ name: string; url: string }> {
  const breadcrumbs = [{ name: 'ホーム', url: siteConfig.url }];

  switch (sectionName.toLowerCase()) {
    case 'about':
      breadcrumbs.push({
        name: 'サービス紹介',
        url: `${siteConfig.url}#about`,
      });
      break;
    case 'portfolio':
      breadcrumbs.push({
        name: '実績紹介',
        url: `${siteConfig.url}#portfolio`,
      });
      break;
    case 'history':
      breadcrumbs.push({ name: '沿革', url: `${siteConfig.url}#history` });
      break;
    case 'team':
      breadcrumbs.push({
        name: 'チームメンバー',
        url: `${siteConfig.url}#team`,
      });
      break;
    case 'clients':
      breadcrumbs.push({
        name: 'クライアント',
        url: `${siteConfig.url}#clients`,
      });
      break;
    case 'contact':
      breadcrumbs.push({
        name: 'お問い合わせ',
        url: `${siteConfig.url}#contact`,
      });
      break;
  }

  return breadcrumbs;
}

/**
 * Generate FAQ data for common questions
 */
export function getCommonFAQs(): Array<{ question: string; answer: string }> {
  return [
    {
      question: 'Over 40 Web Clubとは何ですか？',
      answer:
        '40歳以上のWeb開発者向けのオンラインコミュニティです。情報交換、学習支援、ネットワーキングの機会を提供しています。',
    },
    {
      question: '参加するにはどうすればよいですか？',
      answer:
        '利用規約に記載の運営者までお問い合わせいただくか、SNSでフォローしてください。参加方法について詳しくご案内いたします。',
    },
    {
      question: '初心者でも参加できますか？',
      answer:
        'はい、経験レベルに関係なく参加できます。メンバー同士で助け合い、学習をサポートする環境を提供しています。',
    },
    {
      question: 'どのような技術を扱っていますか？',
      answer:
        'JavaScript、TypeScript、React、Vue.js、Node.js、Python、PHP、データベース設計など、Web開発に関する幅広い技術を扱っています。',
    },
    {
      question: '活動頻度はどの程度ですか？',
      answer:
        'オンラインでの情報交換は日常的に行われており、定期的な勉強会やイベントも開催しています。',
    },
  ];
}

/**
 * Generate page-specific structured data
 */
export function getPageSpecificSchema(pageName: string) {
  const baseUrl = siteConfig.url;

  switch (pageName.toLowerCase()) {
    case 'home':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: siteConfig.title,
        description: siteConfig.description,
        url: baseUrl,
        mainEntity: {
          '@type': 'Organization',
          name: siteConfig.title,
          description: siteConfig.description,
          url: baseUrl,
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'ホーム',
              item: baseUrl,
            },
          ],
        },
      };

    case 'contact':
      return {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'お問い合わせ - Over 40 Web Club',
        description: 'Over 40 Web Clubへのお問い合わせページ',
        url: `${baseUrl}#contact`,
        mainEntity: {
          '@type': 'Organization',
          name: siteConfig.title,
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: ['Japanese'],
          },
        },
      };

    default:
      return null;
  }
}
