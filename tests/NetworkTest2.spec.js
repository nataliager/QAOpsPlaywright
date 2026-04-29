import { test, expect } from '@playwright/test';

const BASE_URL = 'https://rahulshettyacademy.com';

const credentials = {
    email: 'anshika@gmail.com',
    password: 'Iamking@000',
};

const unauthorizedOrderId = '621661f884b053f6765465b6';

test('@QW Security test request intercept', async ({ page }) => {

    await test.step('Login', async () => {
        await page.goto(`${BASE_URL}/client`);
        await page.locator('#userEmail').fill(credentials.email);
        await page.locator('#userPassword').fill(credentials.password);
        await page.locator("[value='Login']").click();
        await page.waitForLoadState('networkidle');
        await page.locator('.card-body b').first().waitFor();
    });

    await test.step('Intercept order detail request with unauthorized ID', async () => {
        await page.route(
            `${BASE_URL}/api/ecom/order/get-orders-details?id=*`,
            route => route.continue({
                url: `${BASE_URL}/api/ecom/order/get-orders-details?id=${unauthorizedOrderId}`,
            })
        );
    });

    await test.step('Navigate to orders and click View', async () => {
        await page.locator("button[routerlink*='myorders']").click();
        await page.locator("button:has-text('View')").first().click();
    });

    await test.step('Validate unauthorized access message', async () => {
        await expect(page.locator('p').last()).toHaveText('You are not authorize to view this order');
    });

});
