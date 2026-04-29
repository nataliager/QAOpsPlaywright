import { test, expect, request } from '@playwright/test';
import { ApiUtils } from '../utils/ApiUtils';

const loginPayload = {userEmail: "marie.valencia@example.com", userPassword: "Password123@"};
const orderPayload = {orders: [{country: "Colombia", productOrderedId: "6960eae1c941646b7a8b3ed3"}]};
let response;
let apiContext;

test.beforeAll(async () => {
    apiContext = await request.newContext();
    const apiUtils = new ApiUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
});

//create order is successful, then we can validate the order details in UI
test('Place order', async ({page}) => {

    await test.step('Set token in local storage', async () => {
        await page.addInitScript(token => {
        window.localStorage.setItem('token', token);
    }, response.token);

    await page.goto('https://rahulshettyacademy.com/client/');

    })

    await test.step('Validate order details', async () => {
       
        await page.locator('button[routerlink*="myorders"]').click();

        const orderTable = page.locator('tbody');
        await orderTable.waitFor();

        const listeOrderIds = await page.locator("tr th[scope='row']").all();

        for (let i = 0; i < listeOrderIds.length; i++) {
            const orderIdText = await listeOrderIds[i].innerText();
            console.log('orderIdText:', orderIdText);
            if (response.orderId.includes(orderIdText)) {
                const viewButton = page.locator("tr td button.btn-primary").nth(i);
                await viewButton.click();
                break;
            }
        }

        const orderIdDetails = await page.locator(".col-text").textContent();
        await page.pause();
        expect(response.orderId.includes(orderIdDetails.trim())).toBeTruthy();
        
    })

});





