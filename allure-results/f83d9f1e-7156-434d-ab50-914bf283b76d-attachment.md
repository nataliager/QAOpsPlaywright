# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: WebAPIPart1.spec.js >> Place order
- Location: tests/WebAPIPart1.spec.js:16:5

# Error details

```
TypeError: _ApiUtils.ApiUtils is not a constructor
```

# Test source

```ts
  1  | import { test, expect, request } from '@playwright/test';
  2  | import { ApiUtils } from '../utils/ApiUtils';
  3  | 
  4  | const loginPayload = {userEmail: "marie.valencia@example.com", userPassword: "Password123@"};
  5  | const orderPayload = {orders: [{country: "Colombia", productOrderedId: "6960eae1c941646b7a8b3ed3"}]};
  6  | let response;
  7  | let apiContext;
  8  | 
  9  | test.beforeAll(async () => {
  10 |     apiContext = await request.newContext();
> 11 |     const apiUtils = new ApiUtils(apiContext, loginPayload);
     |                      ^ TypeError: _ApiUtils.ApiUtils is not a constructor
  12 |     response = await apiUtils.createOrder(orderPayload);
  13 | });
  14 | 
  15 | //create order is successful, then we can validate the order details in UI
  16 | test('Place order', async ({page}) => {
  17 | 
  18 |     await test.step('Set token in local storage', async () => {
  19 |         await page.addInitScript(token => {
  20 |         window.localStorage.setItem('token', token);
  21 |     }, response.token);
  22 | 
  23 |     await page.goto('https://rahulshettyacademy.com/client/');
  24 | 
  25 |     })
  26 | 
  27 |     await test.step('Validate order details', async () => {
  28 |        
  29 |         await page.locator('button[routerlink*="myorders"]').click();
  30 | 
  31 |         const orderTable = page.locator('tbody');
  32 |         await orderTable.waitFor();
  33 | 
  34 |         const listeOrderIds = await page.locator("tr th[scope='row']").all();
  35 | 
  36 |         for (let i = 0; i < listeOrderIds.length; i++) {
  37 |             const orderIdText = await listeOrderIds[i].innerText();
  38 |             console.log('orderIdText:', orderIdText);
  39 |             if (response.orderId.includes(orderIdText)) {
  40 |                 const viewButton = page.locator("tr td button.btn-primary").nth(i);
  41 |                 await viewButton.click();
  42 |                 break;
  43 |             }
  44 |         }
  45 | 
  46 |         const orderIdDetails = await page.locator(".col-text").textContent();
  47 |         await page.pause();
  48 |         expect(response.orderId.includes(orderIdDetails.trim())).toBeTruthy();
  49 |         
  50 |     })
  51 | 
  52 | });
  53 | 
  54 | 
  55 | 
  56 | 
  57 | 
  58 | 
```