import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    let logs = [];
    page.on('console', msg => logs.push(`CONSOLE ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', error => logs.push(`PAGEERROR: ${error.message}`));

    console.log('Navigating to Live App...');
    await page.goto('https://api-health-monitor-lemon.vercel.app/auth');

    console.log('Switching to Sign Up...');
    await page.click('text="Sign up free"');

    // Make a random email
    const randomEmail = `testuser_${Math.floor(Math.random() * 100000)}@pulseapi.com`;
    console.log(`Using email: ${randomEmail}`);

    await page.fill('input[placeholder="John Doe"]', 'Test User');
    await page.fill('input[placeholder="you@company.com"]', randomEmail);
    await page.fill('input[placeholder="••••••••"]', 'password123');

    console.log('Clicking Create Account...');
    await page.click('button:has-text("Create Account")');

    // Wait for network idle or navigation
    await page.waitForTimeout(5000);
    console.log('Current URL after signup attempt:', page.url());

    if (page.url().includes('dashboard')) {
        console.log('Successfully reached Dashboard!');
    } else {
        console.log('Failed to reach Dashboard. Ended up at:', page.url());
        console.log('Checking for on-screen errors...');
        const errorMsg = page.locator('.status-critical-bg'); // check if there's an error UI
        if (await errorMsg.count() > 0) {
            console.log('UI Error Message:', await errorMsg.innerText());
        }
    }

    console.log('--- BROWSER LOGS ---');
    logs.forEach(l => console.log(l));

    await browser.close();
})();
