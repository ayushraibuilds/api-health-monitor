import { test, expect } from '@playwright/test';

test.describe('PulseAPI Core Flows', () => {
    test('landing page loads correctly', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('text=Your APIs Cost Money')).toBeVisible();
        await expect(page.locator('text=Start Monitoring')).toBeVisible();
    });

    test('can navigate to auth page', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(page.locator('h2')).toHaveText('Welcome to PulseAPI');
    });

    // Note: Full e2e tests involving Supabase auth are tricky without a dedicated staging environment, 
    // but the demo functionality can be tested if the backend supports random account creation.
});
