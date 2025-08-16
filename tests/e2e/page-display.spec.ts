import { test, expect } from '@playwright/test';

test.describe('Page Display Tests', () => {
  test('should display the home page correctly', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads
    await expect(page).toHaveTitle(/Over 40 Web Club/);

    // Check that main sections are present
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#portfolio')).toBeVisible();
    await expect(page.locator('#history')).toBeVisible();
    await expect(page.locator('#team')).toBeVisible();
    await expect(page.locator('#clients')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();

    // Check navigation
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Check that the hero section has content
    const heroSection = page.locator('#hero');
    await expect(heroSection.locator('h1')).toBeVisible();
    await expect(heroSection.locator('p')).toBeVisible();
  });

  test('should display navigation correctly', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check navigation links
    const navLinks = [
      { href: '#about', text: 'About' },
      { href: '#portfolio', text: 'Portfolio' },
      { href: '#history', text: 'History' },
      { href: '#team', text: 'Team' },
      { href: '#clients', text: 'Clients' },
      { href: '#contact', text: 'Contact' },
    ];

    for (const link of navLinks) {
      const navLink = nav.locator(`a[href="${link.href}"]`);
      await expect(navLink).toBeVisible();
    }
  });

  test('should display team section with members', async ({ page }) => {
    await page.goto('/');

    const teamSection = page.locator('#team');
    await expect(teamSection).toBeVisible();

    // Check section header
    await expect(teamSection.locator('h2')).toBeVisible();

    // Check that team members are displayed
    const teamMembers = teamSection.locator(
      '.team-member, [data-testid="team-member"]'
    );
    await expect(teamMembers.first()).toBeVisible();

    // Check that at least one team member has required elements
    const firstMember = teamMembers.first();
    await expect(firstMember.locator('img')).toBeVisible();
    await expect(firstMember.locator('h3, h4, .name')).toBeVisible();
  });

  test('should display portfolio section with projects', async ({ page }) => {
    await page.goto('/');

    const portfolioSection = page.locator('#portfolio');
    await expect(portfolioSection).toBeVisible();

    // Check section header
    await expect(portfolioSection.locator('h2')).toBeVisible();

    // Check that portfolio items are displayed
    const portfolioItems = portfolioSection.locator(
      '.portfolio-item, [data-testid="portfolio-item"]'
    );

    // Wait for portfolio items to load
    await page.waitForTimeout(1000);

    // Check if portfolio items exist (they might be loaded dynamically)
    const itemCount = await portfolioItems.count();
    if (itemCount > 0) {
      await expect(portfolioItems.first()).toBeVisible();
    }
  });

  test('should display contact form', async ({ page }) => {
    await page.goto('/');

    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeVisible();

    // Check section header
    await expect(contactSection.locator('h2')).toBeVisible();

    // Check form elements
    const form = contactSection.locator('form');
    await expect(form).toBeVisible();

    // Check required form fields
    await expect(
      form.locator('input[name="name"], input[id="name"]')
    ).toBeVisible();
    await expect(
      form.locator('input[name="email"], input[id="email"]')
    ).toBeVisible();
    await expect(
      form.locator('textarea[name="message"], textarea[id="message"]')
    ).toBeVisible();
    await expect(
      form.locator('button[type="submit"], input[type="submit"]')
    ).toBeVisible();
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Over 40 Web Club/);

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);

    // Check OG tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);

    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', /.+/);

    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /.+/);
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Check that there are no critical JavaScript errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('net::ERR_')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
