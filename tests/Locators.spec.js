import { test,expect } from '@playwright/test';


test('Playwright Special locators', async ({ page }) => {
    
    await page.goto('https://rahulshettyacademy.com/angularpractice/');

    await test.step('Get elements by label', async () => {
        await page.getByLabel("Check me out if you Love IceCreams!").check();
        await page.getByLabel("Employed").click();
        await page.getByLabel("Gender").selectOption("Male");
        
    })

    await test.step('Get elements by placeholder', async () => {
        await page.getByPlaceholder("Password").fill("12345678");
        
    })

    await test.step('Get elements by role', async () => {
        await page.getByRole("button", { name: "Submit" }).click();
        await page.getByRole("link", { name: "Shop" }).click();

    })

    await test.step('Get elements by text', async () => {
        //await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    })

    await test.step('Chaining methods', async () => {
        await page.locator('app-card').filter({ hasText: 'Nokia Edge' }).getByRole('button').click();
        
    })
    
    
    
    
    

   


    
})
