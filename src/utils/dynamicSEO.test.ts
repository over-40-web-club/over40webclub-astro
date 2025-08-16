import { describe, it, expect } from 'vitest';
import {
  getHomePageSEO,
  getAboutSEO,
  getPortfolioSEO,
  getHistorySEO,
  getTeamSEO,
  getClientsSEO,
  getContactSEO,
  generateSectionBreadcrumbs,
  getCommonFAQs,
  getPageSpecificSchema,
} from './dynamicSEO';

describe('Dynamic SEO Utilities', () => {
  describe('Page SEO Data Generators', () => {
    it('should generate home page SEO data', () => {
      const seo = getHomePageSEO();

      expect(seo.title).toBe('ホーム');
      expect(seo.type).toBe('website');
      expect(seo.tags).toContain('web development');
      expect(seo.tags).toContain('community');
      expect(seo.description).toContain('Web開発の勉強をしている40歳以上の方');
    });

    it('should generate about page SEO data', () => {
      const seo = getAboutSEO();

      expect(seo.title).toBe('About - サービス紹介');
      expect(seo.type).toBe('website');
      expect(seo.tags).toContain('about');
      expect(seo.tags).toContain('services');
      expect(seo.description).toContain('サービス内容をご紹介');
    });

    it('should generate portfolio page SEO data', () => {
      const seo = getPortfolioSEO();

      expect(seo.title).toBe('Portfolio - 実績紹介');
      expect(seo.type).toBe('website');
      expect(seo.tags).toContain('portfolio');
      expect(seo.tags).toContain('projects');
      expect(seo.description).toContain('実績とプロジェクト');
    });

    it('should generate history page SEO data', () => {
      const seo = getHistorySEO();

      expect(seo.title).toBe('History - 沿革');
      expect(seo.type).toBe('website');
      expect(seo.tags).toContain('history');
      expect(seo.tags).toContain('timeline');
      expect(seo.description).toContain('歴史と成長の軌跡');
    });

    it('should generate team page SEO data', () => {
      const seo = getTeamSEO();

      expect(seo.title).toBe('Team - チームメンバー');
      expect(seo.type).toBe('website');
      expect(seo.tags).toContain('team');
      expect(seo.tags).toContain('members');
      expect(seo.description).toContain('チームメンバーをご紹介');
    });

    it('should generate clients page SEO data', () => {
      const seo = getClientsSEO();

      expect(seo.title).toBe('Clients - クライアント紹介');
      expect(seo.type).toBe('website');
      expect(seo.tags).toContain('clients');
      expect(seo.tags).toContain('partnerships');
      expect(seo.description).toContain('クライアント企業をご紹介');
    });

    it('should generate contact page SEO data', () => {
      const seo = getContactSEO();

      expect(seo.title).toBe('Contact - お問い合わせ');
      expect(seo.type).toBe('website');
      expect(seo.tags).toContain('contact');
      expect(seo.tags).toContain('inquiry');
      expect(seo.description).toContain('お問い合わせはこちらから');
    });
  });

  describe('generateSectionBreadcrumbs', () => {
    it('should generate breadcrumbs for about section', () => {
      const breadcrumbs = generateSectionBreadcrumbs('about');

      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0]).toEqual({
        name: 'ホーム',
        url: 'https://over40webclub.netlify.app/',
      });
      expect(breadcrumbs[1]).toEqual({
        name: 'サービス紹介',
        url: 'https://over40webclub.netlify.app/#about',
      });
    });

    it('should generate breadcrumbs for portfolio section', () => {
      const breadcrumbs = generateSectionBreadcrumbs('portfolio');

      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[1].name).toBe('実績紹介');
      expect(breadcrumbs[1].url).toBe(
        'https://over40webclub.netlify.app/#portfolio'
      );
    });

    it('should generate breadcrumbs for team section', () => {
      const breadcrumbs = generateSectionBreadcrumbs('team');

      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[1].name).toBe('チームメンバー');
      expect(breadcrumbs[1].url).toBe(
        'https://over40webclub.netlify.app/#team'
      );
    });

    it('should generate breadcrumbs for contact section', () => {
      const breadcrumbs = generateSectionBreadcrumbs('contact');

      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[1].name).toBe('お問い合わせ');
      expect(breadcrumbs[1].url).toBe(
        'https://over40webclub.netlify.app/#contact'
      );
    });

    it('should handle case insensitive section names', () => {
      const breadcrumbs = generateSectionBreadcrumbs('ABOUT');

      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[1].name).toBe('サービス紹介');
    });

    it('should return only home breadcrumb for unknown section', () => {
      const breadcrumbs = generateSectionBreadcrumbs('unknown');

      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs[0].name).toBe('ホーム');
    });
  });

  describe('getCommonFAQs', () => {
    it('should return array of FAQ objects', () => {
      const faqs = getCommonFAQs();

      expect(Array.isArray(faqs)).toBe(true);
      expect(faqs.length).toBeGreaterThan(0);

      faqs.forEach((faq) => {
        expect(faq).toHaveProperty('question');
        expect(faq).toHaveProperty('answer');
        expect(typeof faq.question).toBe('string');
        expect(typeof faq.answer).toBe('string');
        expect(faq.question.length).toBeGreaterThan(0);
        expect(faq.answer.length).toBeGreaterThan(0);
      });
    });

    it('should include relevant questions about the community', () => {
      const faqs = getCommonFAQs();
      const questions = faqs.map((faq) => faq.question);

      expect(questions.some((q) => q.includes('Over 40 Web Club'))).toBe(true);
      expect(questions.some((q) => q.includes('参加'))).toBe(true);
      expect(questions.some((q) => q.includes('初心者'))).toBe(true);
    });
  });

  describe('getPageSpecificSchema', () => {
    it('should generate home page schema', () => {
      const schema = getPageSpecificSchema('home');

      expect(schema).not.toBeNull();
      expect(schema!['@context']).toBe('https://schema.org');
      expect(schema!['@type']).toBe('WebPage');
      expect(schema!.name).toBe('Over 40 Web Club');
      expect(schema!.mainEntity).toHaveProperty('@type', 'Organization');
      expect(schema!.breadcrumb).toHaveProperty('@type', 'BreadcrumbList');
    });

    it('should generate contact page schema', () => {
      const schema = getPageSpecificSchema('contact');

      expect(schema).not.toBeNull();
      expect(schema!['@context']).toBe('https://schema.org');
      expect(schema!['@type']).toBe('ContactPage');
      expect(schema!.name).toContain('お問い合わせ');
      expect(schema!.mainEntity).toHaveProperty('contactPoint');
    });

    it('should return null for unknown page', () => {
      const schema = getPageSpecificSchema('unknown');

      expect(schema).toBeNull();
    });

    it('should handle case insensitive page names', () => {
      const schema = getPageSpecificSchema('HOME');

      expect(schema).not.toBeNull();
      expect(schema!['@type']).toBe('WebPage');
    });
  });
});
