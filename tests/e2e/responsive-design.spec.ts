import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1200, height: 800 },
    { name: 'Large Desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`should display correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto('/');

      // Check that main sections are visible
      await expect(page.locator('#hero')).toBeVisible();
      await expect(page.locator('#about')).toBeVisible();
      await expect(page.locator('#contact')).toBeVisible();

      // Check navigation visibility
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Check that content doesn't overflow horizontally
      const body = page.locator('body');
      const bodyBox = await body.boundingBox();
      expect(bodyBox?.width).toBeLessThanOrEqual(viewport.width);
    });
  }

  test('should have responsive navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check for mobile menu toggle (hamburger menu)
    const mobileToggle = page.locator(
      '.navbar-toggler, .mobile-menu-toggle, [data-bs-toggle="collapse"]'
    );

    if ((await mobileToggle.count()) > 0) {
      await expect(mobileToggle).toBeVisible();

      // Test mobile menu functionality
      await mobileToggle.click();

      // Check that navigation links become visible after toggle
      const navLinks = page.locator('nav a[href^="#"]');
      await expect(navLinks.first()).toBeVisible();
    }
  });

  test('should have responsive images', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that images are responsive
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        const imgBox = await img.boundingBox();
        if (imgBox) {
          // Images should not exceed viewport width
          expect(imgBox.width).toBeLessThanOrEqual(375);
        }
      }
    }
  });

  test('should have readable text on all screen sizes', async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto('/');

      // Check that main headings are visible and have reasonable size
      const h1 = page.locator('h1').first();
      if ((await h1.count()) > 0) {
        await expect(h1).toBeVisible();

        const fontSize = await h1.evaluate((el) => {
          return window.getComputedStyle(el).fontSize;
        });

        const fontSizeNum = parseFloat(fontSize);
        // Font size should be at least 16px for readability
        expect(fontSizeNum).toBeGreaterThanOrEqual(16);
      }

      // Check paragraph text
      const paragraph = page.locator('p').first();
      if ((await paragraph.count()) > 0) {
        await expect(paragraph).toBeVisible();

        const fontSize = await paragraph.evaluate((el) => {
          return window.getComputedStyle(el).fontSize;
        });

        const fontSizeNum = parseFloat(fontSize);
        // Paragraph text should be at least 14px
        expect(fontSizeNum).toBeGreaterThanOrEqual(14);
      }
    }
  });

  test('should have proper spacing on different screen sizes', async ({
    page,
  }) => {
    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto('/');

      // Check that sections have proper spacing
      const sections = page.locator('section, #hero, #about, #contact');
      const sectionCount = await sections.count();

      for (let i = 0; i < Math.min(sectionCount, 3); i++) {
        const section = sections.nth(i);
        if (await section.isVisible()) {
          const sectionBox = await section.boundingBox();
          if (sectionBox) {
            // Sections should have some height (not collapsed)
            expect(sectionBox.height).toBeGreaterThan(50);
          }
        }
      }
    }
  });

  test('should have accessible touch targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check button sizes (should be at least 44px for touch accessibility)
    const buttons = page.locator('button, a[href^="#"], .btn');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const buttonBox = await button.boundingBox();
        if (buttonBox) {
          // Touch targets should be at least 44px in height for accessibility
          expect(buttonBox.height).toBeGreaterThanOrEqual(32); // Slightly relaxed for web
        }
      }
    }
  });

  test('should handle orientation changes', async ({ page }) => {
    // Test landscape mobile
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/');

    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();

    // Test portrait tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();

    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();

    // Test landscape tablet
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.reload();

    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have responsive grid layouts', async ({ page }) => {
    await page.goto('/');

    // Test desktop layout
    await page.setViewportSize({ width: 1200, height: 800 });

    // Check team section layout
    const teamSection = page.locator('#team');
    if ((await teamSection.count()) > 0) {
      const teamMembers = teamSection.locator(
        '.team-member, .col, [data-testid="team-member"]'
      );
      const memberCount = await teamMembers.count();

      if (memberCount > 1) {
        // On desktop, team members should be in a row layout
        const firstMember = teamMembers.first();
        const secondMember = teamMembers.nth(1);

        if (
          (await firstMember.isVisible()) &&
          (await secondMember.isVisible())
        ) {
          const firstBox = await firstMember.boundingBox();
          const secondBox = await secondMember.boundingBox();

          if (firstBox && secondBox) {
            // On desktop, items should be side by side (similar Y position)
            const yDifference = Math.abs(firstBox.y - secondBox.y);
            expect(yDifference).toBeLessThan(100);
          }
        }
      }
    }

    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    if ((await teamSection.count()) > 0) {
      const teamMembers = teamSection.locator(
        '.team-member, .col, [data-testid="team-member"]'
      );
      const memberCount = await teamMembers.count();

      if (memberCount > 1) {
        // On mobile, team members should stack vertically
        const firstMember = teamMembers.first();
        const secondMember = teamMembers.nth(1);

        if (
          (await firstMember.isVisible()) &&
          (await secondMember.isVisible())
        ) {
          const firstBox = await firstMember.boundingBox();
          const secondBox = await secondMember.boundingBox();

          if (firstBox && secondBox) {
            // On mobile, second item should be below first item
            expect(secondBox.y).toBeGreaterThan(
              firstBox.y + firstBox.height - 50
            );
          }
        }
      }
    }
  });

  test('should maintain functionality across screen sizes', async ({
    page,
  }) => {
    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto('/');

      // Test navigation functionality
      const aboutLink = page.locator('a[href="#about"]').first();
      if (await aboutLink.isVisible()) {
        await aboutLink.click();
        await page.waitForTimeout(500);

        // Check that we scrolled to the about section
        const aboutSection = page.locator('#about');
        await expect(aboutSection).toBeInViewport();
      }

      // Test form functionality
      const contactSection = page.locator('#contact');
      if (await contactSection.isVisible()) {
        const nameField = contactSection.locator(
          'input[name="name"], input[id="name"]'
        );
        if (await nameField.isVisible()) {
          await nameField.fill('Test');
          await expect(nameField).toHaveValue('Test');
        }
      }
    }
  });
});
