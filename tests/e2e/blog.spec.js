import { test, expect } from '@playwright/test';

test.describe('Engineer Blog', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');
  });

  test('should load home page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Moses Omondi/);
    await expect(page.locator('h1')).toContainText('Moses Omondi');
  });

  test('should have working navigation', async ({ page }) => {
    // Check that navigation links exist
    const homeLink = page.locator('nav a[href*="index.html"]');
    const blogLink = page.locator('nav a[href*="blog.html"]');

    await expect(homeLink).toBeVisible();
    await expect(blogLink).toBeVisible();

    // Test navigation to blog page
    await Promise.all([
      page.waitForNavigation({ timeout: 10000 }),
      blogLink.click(),
    ]);
    await expect(page).toHaveURL(/blog\.html/);
  });

  test('should have working theme toggle', async ({ page }) => {
    const themeToggle = page.locator('.theme-toggle');
    await expect(themeToggle).toBeVisible();

    // Get initial theme
    const initialTheme = await page.evaluate(() =>
      document.body.getAttribute('data-theme')
    );

    // Click theme toggle
    await themeToggle.click();

    // Wait for theme to change
    await page.waitForTimeout(100);

    // Verify theme changed
    const newTheme = await page.evaluate(() =>
      document.body.getAttribute('data-theme')
    );
    expect(newTheme).not.toBe(initialTheme);
  });

  test('should display terminal animation', async ({ page }) => {
    const terminal = page.locator('.terminal-window');
    await expect(terminal).toBeVisible();

    const terminalBody = page.locator('.terminal-body');
    await expect(terminalBody).toBeVisible();

    // Check for terminal prompt (use first() to handle multiple matches)
    const prompt = page.locator('.terminal-prompt').first();
    await expect(prompt).toBeVisible();
  });

  test('should display hobbies section', async ({ page }) => {
    const hobbiesSection = page.locator('.hobbies');
    await expect(hobbiesSection).toBeVisible();

    // Wait for section to be shown (might be animated)
    await page.waitForTimeout(2000);

    const hobbyTags = page.locator('.hobby-tag');
    await expect(hobbyTags.first()).toBeVisible();
  });

  test('should display contact section', async ({ page }) => {
    const contactSection = page.locator('.contact');
    await expect(contactSection).toBeVisible();

    // Wait for section to be shown (might be animated)
    await page.waitForTimeout(2000);

    const contactLinks = page.locator('.contact a');
    await expect(contactLinks.first()).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that content is still visible and properly laid out
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.nav')).toBeVisible();
    await expect(page.locator('.terminal-window')).toBeVisible();

    // Check that navigation is accessible on mobile
    const nav = page.locator('.nav');
    await expect(nav).toBeVisible();
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check for essential meta tags
    const title = page.locator('title');
    await expect(title).toHaveCount(1);

    const description = page.locator('meta[name="description"]');
    const viewport = page.locator('meta[name="viewport"]');
    const charset = page.locator('meta[charset]');

    await expect(description).toHaveCount(1);
    await expect(viewport).toHaveCount(1);
    await expect(charset).toHaveCount(1);
  });
});

test.describe('Blog Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog.html');
  });

  test('should load blog page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog.*Moses Omondi/);
    await expect(page.locator('h1')).toContainText(/Blog|Posts/);
  });

  test('should display blog posts', async ({ page }) => {
    // Check for blog posts container (use first() to handle multiple matches)
    const postsContainer = page
      .locator('.blog-posts, .posts-container, [class*="post"]')
      .first();
    await expect(postsContainer).toBeVisible();
  });

  test('should have working back navigation', async ({ page }) => {
    const backLink = page.locator('a[href*="index.html"]');
    await expect(backLink).toBeVisible();

    await backLink.click();
    await expect(page).toHaveURL(/index\.html|\/$/);
  });
});

test.describe('Blog Post Pages', () => {
  test('should load individual blog post', async ({ page }) => {
    // Try to navigate to a blog post (assuming one exists)
    await page.goto('/blog.html');

    // Look for blog post links
    const postLink = page.locator('a[href*="/blog/"]').first();

    if ((await postLink.count()) > 0) {
      await postLink.click();

      // Should be on a blog post page
      await expect(
        page.locator('.blog-content, .post-content, article')
      ).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();

      // Should have back link
      const backLink = page.locator('a[href*="blog.html"]');
      await expect(backLink).toBeVisible();
    }
  });
});

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds (increased for CI/local dev environments)
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for any async operations

    // Filter out common non-critical errors
    const criticalErrors = consoleErrors.filter(
      error => !error.includes('favicon.ico') && !error.includes('livereload')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(1); // Should have exactly one h1
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('should have proper link text', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a');
    const linkCount = await links.count();

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');

      // Links should have meaningful text, aria-label, or title
      const hasAccessibleText =
        (text && text.trim().length > 0) || ariaLabel || title;
      expect(hasAccessibleText).toBeTruthy();
    }
  });
});
