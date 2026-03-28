const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
    page.on('response', response => {
        if (response.status() >= 400) {
            console.log('NETWORK ERROR:', response.status(), response.url());
        }
    });

    console.log('Navigating to Live App...');
    await page.goto('https://api-health-monitor-lemon.vercel.app/');

    console.log('Clicking Sign In...');
    await page.click('text="Sign In"');

    await page.waitForTimeout(2000);
    console.log('Current URL after Sign In click:', page.url());

    if (page.url().includes('auth')) {
        console.log('Successfully reached AuthPage.');
        console.log('Does the page contain the Create Account text?', await page.locator('text="Create your account"').isVisible() || await page.locator('text="Welcome back"').isVisible());
    } else {
        console.log('Failed to reach AuthPage. Current URL:', page.url());
        console.log('HTML Snapshot:', await page.content());
    }

    await browser.close();
})();
