import { describe, it, expect } from 'vitest';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generatePageSchema,
  generateMetaTags,
  generateCanonicalUrl,
  generateRobotsContent,
  type SEOData,
} from './seo';

describe('SEO Utilities', () => {
  describe('generateOrganizationSchema', () => {
    it('should generate valid Organization schema', () => {
      const schema = generateOrganizationSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe('Over 40 Web Club');
      expect(schema.url).toBe('https://over40webclub.netlify.app/');
      expect(schema.logo).toHaveProperty('@type', 'ImageObject');
      expect(schema.sameAs).toBeInstanceOf(Array);
      expect(schema.sameAs.length).toBeGreaterThan(0);
    });
  });

  describe('generateWebSiteSchema', () => {
    it('should generate valid WebSite schema', () => {
      const schema = generateWebSiteSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema.name).toBe('Over 40 Web Club');
      expect(schema.inLanguage).toBe('ja-JP');
      expect(schema.potentialAction).toHaveProperty('@type', 'SearchAction');
    });
  });

  describe('generateArticleSchema', () => {
    it('should generate valid Article schema', () => {
      const data: SEOData = {
        title: 'Test Article',
        description: 'Test description',
        url: 'https://example.com/article',
        publishedTime: '2023-01-01T00:00:00Z',
        modifiedTime: '2023-01-02T00:00:00Z',
        author: 'Test Author',
        tags: ['test', 'article'],
      };

      const schema = generateArticleSchema(data) as any;

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Article');
      expect(schema.headline).toBe('Test Article');
      expect(schema.description).toBe('Test description');
      expect(schema.datePublished).toBe('2023-01-01T00:00:00Z');
      expect(schema.dateModified).toBe('2023-01-02T00:00:00Z');
      expect(schema.keywords).toBe('test, article');
      expect(schema.author).toHaveProperty('@type', 'Organization');
    });

    it('should handle missing optional fields', () => {
      const data: SEOData = {
        title: 'Test Article',
      };

      const schema = generateArticleSchema(data);

      expect(schema.headline).toBe('Test Article');
      expect(schema.description).toBe(
        'Web開発の勉強をしている40歳以上の方が、情報交換したり、助けあったり、交流を深めたりするためのオンラインコミュニティです。'
      );
      expect(schema).not.toHaveProperty('keywords');
    });
  });

  describe('generateBreadcrumbSchema', () => {
    it('should generate valid BreadcrumbList schema', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Category', url: 'https://example.com/category' },
        { name: 'Article', url: 'https://example.com/category/article' },
      ];

      const schema = generateBreadcrumbSchema(breadcrumbs);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://example.com',
      });
    });
  });

  describe('generateFAQSchema', () => {
    it('should generate valid FAQPage schema', () => {
      const faqs = [
        { question: 'What is this?', answer: 'This is a test.' },
        { question: 'How does it work?', answer: 'It works well.' },
      ];

      const schema = generateFAQSchema(faqs);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(2);
      expect(schema.mainEntity[0]).toEqual({
        '@type': 'Question',
        name: 'What is this?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'This is a test.',
        },
      });
    });
  });

  describe('generatePageSchema', () => {
    it('should generate basic page schemas', () => {
      const schemas = generatePageSchema();

      expect(schemas).toHaveLength(2);
      expect(schemas[0]['@type']).toBe('Organization');
      expect(schemas[1]['@type']).toBe('WebSite');
    });

    it('should include Article schema for article type', () => {
      const data: SEOData = {
        type: 'article',
        title: 'Test Article',
      };

      const schemas = generatePageSchema(data);

      expect(schemas).toHaveLength(3);
      expect(schemas[2]['@type']).toBe('Article');
    });
  });

  describe('generateMetaTags', () => {
    it('should generate complete meta tags', () => {
      const data: SEOData = {
        title: 'Test Page',
        description: 'Test description',
        image: 'https://example.com/image.jpg',
        url: 'https://example.com/test',
        type: 'article',
      };

      const metaTags = generateMetaTags(data);

      expect(metaTags.title).toBe('Test Page | Over 40 Web Club');
      expect(metaTags.description).toBe('Test description');
      expect(metaTags.image).toBe('https://example.com/image.jpg');
      expect(metaTags.url).toBe('https://example.com/test');
      expect(metaTags.type).toBe('article');
      expect(metaTags.ogTitle).toBe('Test Page');
      expect(metaTags.twitterCard).toBe('summary_large_image');
    });

    it('should use defaults when no data provided', () => {
      const metaTags = generateMetaTags();

      expect(metaTags.title).toBe('Over 40 Web Club');
      expect(metaTags.description).toContain(
        'Web開発の勉強をしている40歳以上の方'
      );
      expect(metaTags.type).toBe('website');
    });
  });

  describe('generateCanonicalUrl', () => {
    it('should generate correct canonical URL', () => {
      const url = generateCanonicalUrl('/test-page', 'https://example.com');
      expect(url).toBe('https://example.com/test-page');
    });

    it('should use default base URL', () => {
      const url = generateCanonicalUrl('/test-page');
      expect(url).toBe('https://over40webclub.netlify.app/test-page');
    });

    it('should handle root path', () => {
      const url = generateCanonicalUrl('/', 'https://example.com');
      expect(url).toBe('https://example.com/');
    });
  });

  describe('generateRobotsContent', () => {
    it('should generate default robots content', () => {
      const robots = generateRobotsContent();
      expect(robots).toBe('index, follow');
    });

    it('should handle noindex and nofollow', () => {
      const robots = generateRobotsContent({ index: false, follow: false });
      expect(robots).toBe('noindex, nofollow');
    });

    it('should include additional directives', () => {
      const robots = generateRobotsContent({
        index: true,
        follow: true,
        noarchive: true,
        nosnippet: true,
        noimageindex: true,
      });
      expect(robots).toBe('index, follow, noarchive, nosnippet, noimageindex');
    });

    it('should handle mixed directives', () => {
      const robots = generateRobotsContent({
        index: false,
        follow: true,
        noarchive: true,
      });
      expect(robots).toBe('noindex, follow, noarchive');
    });
  });
});
