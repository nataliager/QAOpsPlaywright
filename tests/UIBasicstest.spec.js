import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test('@Web Browser Context Playwright Test', async ({browser}) => {

    //chrome - plugins/ cookies
    const context = await browser.newContext();
    const page = await context.newPage();
    // page.route('**/*.{jpg,jpeg,png,gif,svg}', route => route.abort());
    page.on('request', request => console.log(`Request: ${request.url()}`));
    page.on('response', response => console.log(`Response: ${response.url()} - ${response.status()}`));
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());

    //Locators
    const userName = page.locator('#username');
    const password = page.locator('#password');
    const signInBtn = page.locator('#signInBtn');
    const errorMsg = page.locator('[style*="block"]');
    const cardTitles = page.locator('.card-body a');

    //css, xpath
    await userName.fill('rahulshetty');
    await password.fill('Learning@830$3mK2');
    await signInBtn.click();
    console.log(await errorMsg.textContent());
    await expect(errorMsg).toContainText('Incorrect');

    //type - fill
    await userName.fill('');
    await userName.fill('rahulshettyacademy');
    await signInBtn.click();

    console.log(await cardTitles.first().textContent());
    console.log(await cardTitles.nth(1).textContent());
    //await expect(cardTitles).toHaveText('Iphone X');


    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);

});

test('@Web UI Controls', async ({page}) => {

    // await page.goto('https://google.com/');
    // //get title - assertion
    // console.log(await page.title());
    // await expect(page).toHaveTitle('Google');
    
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    //Locators
    const password = page.locator('#password');
    const signInBtn = page.locator('#signInBtn');
    const dropdown = page.locator('select.form-control');
    const radioBtns = page.locator('.radiotextsty');
    const confirmPopup = page.locator('#okayBtn');
    const acceptTerms = page.locator('#terms');
    const blinkLink = page.locator('[href*="documents-request"]');

    // await userName.fill('rahulshettyacademy');
    // await password.fill('Learning@830$3mK2');
    await dropdown.selectOption('consult');
    await radioBtns.last().check();
    await radioBtns.last().isChecked();
    await confirmPopup.click();
    console.log(await radioBtns.last().check());
    await expect(radioBtns.last()).toBeChecked();

    await acceptTerms.check();
    await expect(acceptTerms).toBeChecked();
    await acceptTerms.uncheck();
    await expect(acceptTerms).not.toBeChecked();

    await expect(blinkLink).toHaveAttribute('class', 'blinkingText');

    // Assertion
    // await page.pause(); // to see the dropdown selection


});

test('@Web Child Window Handling', async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const blinkLink = page.locator('[href*="documents-request"]');


    const [newPage] = await Promise.all([
        context.waitForEvent('page'), //listen for any new page opened 
        blinkLink.click(), //new page opens
    ]);

    const redText = await newPage.locator('.red').textContent();
    const arrayText = redText.split('@')
    const domain = arrayText[1].split(' ')[0];
    console.log(domain);

    await userName.fill(domain);
    //wait page.pause();
    console.log(await userName.inputValue());

});


