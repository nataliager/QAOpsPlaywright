import { test, expect, request } from '@playwright/test';
import { APIUtils } from '../utils/apiutils';

const loginPayload = {userEmail: "marie.valencia@example.com", userPassword: "Password123@"};
const orderPayload = {orders: [{country: "Colombia", productOrderedId: "6960eae1c941646b7a8b3ed3"}]};
const fakePayLoadOrders = { data: [], message: "No Orders" };
let response;
let apiContext;

test.beforeAll(async () => {
    apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
});

test('Place order', async ({page}) => {

    await test.step('Set token in local storage', async () => {
        await page.addInitScript(token => {
        window.localStorage.setItem('token', token);
    }, response.token);

    await page.goto('https://rahulshettyacademy.com/client/');

    })

    await test.step('Validate order details', async () => {

        await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
            async route => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(fakePayLoadOrders),
                });
            }
        )
       
        await page.locator('button[routerlink*="myorders"]').click();
        await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");

        console.log(await page.locator(".mt-4").textContent());

       

       
        
    })

});





