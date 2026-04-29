import { test, expect } from '@playwright/test';


test('@Web Popup validation', async ({ page }) => {

    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    // await page.goto('https://google.com');
    // await page.goBack();
    // await page.goForward();

    await test.step('Validate hide and show functionality', async () => {
        await expect(page.locator("#displayed-text")).toBeVisible();
        await page.locator('#displayed-text').screenshot({ path: 'screenshot1.png' });
        await page.locator("#hide-textbox").click();
        await page.screenshot({ path: 'screenshot.png' });
        await expect(page.locator("#displayed-text")).toBeHidden();
        
    })

    await test.step('Validate popup elements', async () => {
        page.on('dialog', dialog => dialog.accept());
        await page.locator("#confirmbtn").click();
    })

    await test.step('Validate hoover elements', async () => {
        await page.locator("#mousehover").hover();
        
    })

    await test.step('Validate iframe elements', async () => {
        const framesPage = page.frameLocator("#courses-iframe");
        await framesPage.locator("li a[href='lifetime-access']:visible").click();
        const textCheck = await framesPage.locator(".text h2").textContent();
        console.log(textCheck.split(" ")[1]);

        
    })
    
})

// test('Visual', async ({ page }) => {

//     await page.goto('https://www.google.com/');
//     expect(await page.screenshot()).toMatchSnapshot('rediff.png');
    
// })

