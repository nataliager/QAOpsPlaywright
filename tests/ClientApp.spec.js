import { test, expect } from '@playwright/test';

test.skip('Browser Context Playwright Test', async ({page}) => {

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    console.log(`Page title: ${await page.title()}`);

    //Locators
    const registerLink = page.locator('.text-reset');
    const firstName = page.locator('#firstName');
    const lastName = page.locator('#lastName');
    const userEmail = page.locator('#userEmail');
    const phoneNumber = page.locator('#userMobile');
    const ocupation = page.locator('.custom-select.ng-untouched.ng-pristine.ng-valid');
    const genderRadioBtns = page.locator('input[type="radio"]');
    const password = page.locator('#userPassword');
    const confirmPassword = page.locator('#confirmPassword');
    const acceptTerms = page.locator('input[type="checkbox"]');
    const redirectToLogin = page.locator('.btn.btn-primary');
    const loginBtn = page.locator('#login');
    const products = page.locator('.card-body');
    const cardTitles = page.locator('.card-body b');
    const productName = 'ZARA COAT 3';
    const cartBtn = page.locator('[routerlink*="cart"]'); 
    const productNameInCart = page.locator(`h3:has-text("${productName}")`);

    await test.step('Register', async () => {
        // await registerLink.click();
        // await firstName.fill('Marie');
        // await lastName.fill('Valencia');
        // await userEmail.fill('marie.valencia@example.com');
        // await phoneNumber.fill('1234567890');
        // await ocupation.selectOption('Student');
        // await genderRadioBtns.last().check();
        // await password.fill('Password123@');
        // await confirmPassword.fill('Password123@');
        // await acceptTerms.check();
        // await loginBtn.click();
        // await redirectToLogin.click();
    });

    await test.step('Login', async () => {
        await userEmail.fill('marie.valencia@example.com');
        await password.fill('Password123@');
        await loginBtn.click();
        await cardTitles.first().waitFor();
    });

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
