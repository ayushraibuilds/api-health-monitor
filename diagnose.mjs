import { chromium } from 'playwright';

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

    console.log('Clicking "Live Demo" button...');
    await page.click('text="Live Demo"');

    console.log('Waiting for login and redirect...');
    await page.waitForTimeout(5000);
    console.log('Current URL after Live Demo click:', page.url());

    if (page.url().includes('dashboard')) {
        console.log('Successfully reached Dashboard!');
    } else {
        console.log('Failed to reach Dashboard. Ended up at:', page.url());
    }

    await browser.close();
})();
