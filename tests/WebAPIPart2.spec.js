import { test, expect } from '@playwright/test';

let webContext;

test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const userEmail = page.locator('#userEmail');
    const password = page.locator('#userPassword');
    const loginBtn = page.locator('#login');
    const cardTitles = page.locator('.card-body b');

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await userEmail.fill('marie.valencia@example.com');
    await password.fill('Password123@');
    await loginBtn.click();
    await cardTitles.first().waitFor();

    await context.storageState({ path: 'state.json' });
    webContext = await browser.newContext({ storageState: 'state.json' });

});

test('Browser Context Playwright Test', async () => {

    const page = await webContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client/');

    //Locators
    const products = page.locator('.card-body');
    const cardTitles = page.locator('.card-body b');
    const productName = 'ZARA COAT 3';
    const cartBtn = page.locator('[routerlink*="cart"]'); 
    const productNameInCart = page.locator(`h3:has-text("${productName}")`);

    await test.step('Get card titles', async () => {
        const allTitles = await cardTitles.allTextContents();
        console.log(`All card titles: ${allTitles}`);
    });

    await test.step('Add product to cart', async () => {
        const productCount = await products.count();
        console.log(`Total products: ${productCount}`);

        for(let i = 0; i < productCount; i++) {
            if (await products.nth(i).locator('b').textContent() === productName) {
                //add to cart
                await products.nth(i).locator('text= Add To Cart').click();
                break;
            }
        }
    })

    await test.step('Validate product in cart', async () => {
        await cartBtn.click();
        await page.locator("div li").first().waitFor();
        expect(await productNameInCart.isVisible()).toBeTruthy();
       
    })

    await test.step('Go to checkout', async () => {
        await page.locator("li[class='totalRow'] button[type='button']").click();
    
    })

    await test.step('Fill payment details', async () => {
        await page.locator('input[type="text"]').first().fill('1234 5678 9012 3456');
        await page.locator('.ddl').first().selectOption('12');
        await page.locator('.ddl').last().selectOption('16');
        await page.locator('input[type="text"]').nth(1).fill('123');
        await page.locator('input[type="text"]').nth(2).fill('Marie Valencia');
        await page.locator('input[type="text"]').nth(3).fill('cuoupon');
    })

    await test.step('Fill shipping information', async () => {

        await page.locator('[placeholder*="Country"]').pressSequentially("ind", { delay: 150 });
        const dropdownOptions = page.locator('.ta-results');
        await dropdownOptions.waitFor();
        const optionsCount = await dropdownOptions.locator('button').count();

        for(let i = 0; i < optionsCount; i++) {
            const text = await dropdownOptions.locator('button').nth(i).textContent();
            if(text.trim() === 'India') {
                await dropdownOptions.locator('button').nth(i).click();
                break;
            }
        }
    })

    await test.step('Expect email in shipping information', async () => {
        expect(page.locator('.user__name input[type="text"]').first()).toHaveValue('marie.valencia@example.com');
    })

    await test.step('Place holder', async () => {
        await page.locator('.action__submit').click();
    })

    await test.step('Validate successful message', async () => {
        await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');
        
    })

    await test.step('Validate order details', async () => {
        const orderId = (await page.locator('.em-spacer-1 .ng-star-inserted').textContent()).trim();
        console.log('orderId:', orderId);
        await page.locator('button[routerlink*="myorders"]').click();

        const orderTable = page.locator('tbody');
        await orderTable.waitFor();

        const listeOrderIds = await page.locator("tr th[scope='row']").all();
        for (let i = 0; i < listeOrderIds.length; i++) {
            const orderIdText = await listeOrderIds[i].innerText();
            console.log('orderIdText:', orderIdText);
            if (orderId.includes(orderIdText)) {
                const viewButton = page.locator("tr td button.btn-primary").nth(i);
                await viewButton.click();
                break;
            }
        }

        const orderIdDetails = await page.locator(".col-text").textContent();
        expect(orderId.includes(orderIdDetails.trim())).toBeTruthy();
        
    })
    
    
    
    
    
    
    
    
    


});
