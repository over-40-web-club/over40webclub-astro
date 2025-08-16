import { test, expect } from '@playwright/test';

test.describe('Form Submission Tests', () => {
  test('should display contact form with all required fields', async ({
    page,
  }) => {
    await page.goto('/');

    // Navigate to contact section
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeVisible();

    const form = contactSection.locator('form');
    await expect(form).toBeVisible();

    // Check that all required form fields are present
    const nameField = form.locator('input[name="name"], input[id="name"]');
    const emailField = form.locator('input[name="email"], input[id="email"]');
    const messageField = form.locator(
      'textarea[name="message"], textarea[id="message"]'
    );
    const submitButton = form.locator(
      'button[type="submit"], input[type="submit"]'
    );

    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
    await expect(messageField).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Check field attributes
    await expect(emailField).toHaveAttribute('type', 'email');
    await expect(nameField).toHaveAttribute('required', '');
    await expect(emailField).toHaveAttribute('required', '');
    await expect(messageField).toHaveAttribute('required', '');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/');

    const contactSection = page.locator('#contact');
    const form = contactSection.locator('form');
    const submitButton = form.locator(
      'button[type="submit"], input[type="submit"]'
    );

    // Try to submit empty form
    await submitButton.click();

    // Check that browser validation prevents submission
    // This will vary by browser, but we can check that we're still on the same page
    await expect(page.url()).toContain('localhost:4321');

    // Check that form is still visible (not submitted)
    await expect(form).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/');

    const contactSection = page.locator('#contact');
    const form = contactSection.locator('form');

    const nameField = form.locator('input[name="name"], input[id="name"]');
    const emailField = form.locator('input[name="email"], input[id="email"]');
    const messageField = form.locator(
      'textarea[name="message"], textarea[id="message"]'
    );
    const submitButton = form.locator(
      'button[type="submit"], input[type="submit"]'
    );

    // Fill form with invalid email
    await nameField.fill('Test User');
    await emailField.fill('invalid-email');
    await messageField.fill('This is a test message');

    await submitButton.click();

    // Check that browser validation prevents submission due to invalid email
    await expect(page.url()).toContain('localhost:4321');
    await expect(form).toBeVisible();
  });

  test('should accept valid form data', async ({ page }) => {
    await page.goto('/');

    const contactSection = page.locator('#contact');
    const form = contactSection.locator('form');

    const nameField = form.locator('input[name="name"], input[id="name"]');
    const emailField = form.locator('input[name="email"], input[id="email"]');
    const messageField = form.locator(
      'textarea[name="message"], textarea[id="message"]'
    );
    const submitButton = form.locator(
      'button[type="submit"], input[type="submit"]'
    );

    // Fill form with valid data
    await nameField.fill('Test User');
    await emailField.fill('test@example.com');
    await messageField.fill('This is a test message for the contact form.');

    // Check that fields are filled correctly
    await expect(nameField).toHaveValue('Test User');
    await expect(emailField).toHaveValue('test@example.com');
    await expect(messageField).toHaveValue(
      'This is a test message for the contact form.'
    );

    // Note: We don't actually submit the form in tests to avoid sending real data
    // In a real test environment, you would mock the form submission endpoint
  });

  test('should have proper form attributes for Netlify Forms', async ({
    page,
  }) => {
    await page.goto('/');

    const contactSection = page.locator('#contact');
    const form = contactSection.locator('form');

    // Check Netlify Forms attributes
    await expect(form).toHaveAttribute('data-netlify', 'true');

    // Check form method and action
    const method = await form.getAttribute('method');
    expect(method?.toLowerCase()).toBe('post');
  });

  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/');

    const contactSection = page.locator('#contact');
    const form = contactSection.locator('form');

    // Check that form fields have associated labels
    const nameField = form.locator('input[name="name"], input[id="name"]');
    const emailField = form.locator('input[name="email"], input[id="email"]');
    const messageField = form.locator(
      'textarea[name="message"], textarea[id="message"]'
    );

    // Check for labels (either by for attribute or aria-label)
    const nameLabel = form.locator('label[for="name"]');
    const emailLabel = form.locator('label[for="email"]');
    const messageLabel = form.locator('label[for="message"]');

    // At least one of these should be true for each field
    const nameHasLabel =
      (await nameLabel.count()) > 0 ||
      (await nameField.getAttribute('aria-label')) !== null;
    const emailHasLabel =
      (await emailLabel.count()) > 0 ||
      (await emailField.getAttribute('aria-label')) !== null;
    const messageHasLabel =
      (await messageLabel.count()) > 0 ||
      (await messageField.getAttribute('aria-label')) !== null;

    expect(nameHasLabel).toBe(true);
    expect(emailHasLabel).toBe(true);
    expect(messageHasLabel).toBe(true);
  });

  test('should handle form field focus and blur events', async ({ page }) => {
    await page.goto('/');

    const contactSection = page.locator('#contact');
    const form = contactSection.locator('form');

    const nameField = form.locator('input[name="name"], input[id="name"]');
    const emailField = form.locator('input[name="email"], input[id="email"]');

    // Test focus events
    await nameField.focus();
    await expect(nameField).toBeFocused();

    await emailField.focus();
    await expect(emailField).toBeFocused();
    await expect(nameField).not.toBeFocused();

    // Test that fields can receive input
    await nameField.fill('Test');
    await expect(nameField).toHaveValue('Test');
  });

  test('should maintain form state during navigation', async ({ page }) => {
    await page.goto('/');

    const contactSection = page.locator('#contact');
    const form = contactSection.locator('form');

    const nameField = form.locator('input[name="name"], input[id="name"]');
    const emailField = form.locator('input[name="email"], input[id="email"]');

    // Fill some fields
    await nameField.fill('Test User');
    await emailField.fill('test@example.com');

    // Navigate to another section and back
    await page.locator('a[href="#about"]').click();
    await page.waitForTimeout(500);
    await page.locator('a[href="#contact"]').click();
    await page.waitForTimeout(500);

    // Check that form values are maintained (for single-page navigation)
    await expect(nameField).toHaveValue('Test User');
    await expect(emailField).toHaveValue('test@example.com');
  });
});
