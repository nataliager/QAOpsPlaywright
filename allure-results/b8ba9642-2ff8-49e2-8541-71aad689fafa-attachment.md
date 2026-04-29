# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: NetworkTest.spec.js >> Place order
- Location: tests/NetworkTest.spec.js:16:5

# Error details

```
Test timeout of 40000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 40000ms exceeded.
=========================== logs ===========================
waiting for response "https://rahulshettyacademy.com/api/ecom/order/get…"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e5]:
    - generic [ref=e7]:
      - link "Automation Automation Practice":
        - /url: ""
        - generic [ref=e8] [cursor=pointer]:
          - heading "Automation" [level=3] [ref=e9]
          - paragraph [ref=e10]: Automation Practice
    - text: 
    - link "Get Shortlisted by Recruiters - Take QA Skill Assessments on TechSmartHire" [ref=e11] [cursor=pointer]:
      - /url: https://techsmarthire.com/
    - list [ref=e12]:
      - listitem [ref=e13] [cursor=pointer]:
        - button " HOME" [ref=e14]:
          - generic [ref=e15]: 
          - text: HOME
      - listitem
      - listitem [ref=e16] [cursor=pointer]:
        - button " ORDERS" [ref=e17]:
          - generic [ref=e18]: 
          - text: ORDERS
      - listitem [ref=e19] [cursor=pointer]:
        - button " Cart" [ref=e20]:
          - generic [ref=e21]: 
          - text: Cart
      - listitem [ref=e22] [cursor=pointer]:
        - button "Sign Out" [ref=e23]:
          - generic [ref=e24]: 
          - text: Sign Out
  - generic [ref=e26]:
    - text: You have No Orders to show at this time.
    - text: Please Visit Back Us
  - generic [ref=e28]:
    - button "Go Back to Shop" [ref=e29] [cursor=pointer]
    - button "Go Back to Cart" [ref=e30] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect, request } from '@playwright/test';
  2  | import { APIUtils } from '../utils/ApiUtils';
  3  | 
  4  | const loginPayload = {userEmail: "marie.valencia@example.com", userPassword: "Password123@"};
  5  | const orderPayload = {orders: [{country: "Colombia", productOrderedId: "6960eae1c941646b7a8b3ed3"}]};
  6  | const fakePayLoadOrders = { data: [], message: "No Orders" };
  7  | let response;
  8  | let apiContext;
  9  | 
  10 | test.beforeAll(async () => {
  11 |     apiContext = await request.newContext();
  12 |     const apiUtils = new APIUtils(apiContext, loginPayload);
  13 |     response = await apiUtils.createOrder(orderPayload);
  14 | });
  15 | 
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
  29 |         await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
  30 |             async route => {
  31 |                 route.fulfill({
  32 |                     status: 200,
  33 |                     contentType: 'application/json',
  34 |                     body: JSON.stringify(fakePayLoadOrders),
  35 |                 });
  36 |             }
  37 |         )
  38 |        
  39 |         await page.locator('button[routerlink*="myorders"]').click();
> 40 |         await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
     |                    ^ Error: page.waitForResponse: Test timeout of 40000ms exceeded.
  41 | 
  42 |         console.log(await page.locator(".mt-4").textContent());
  43 | 
  44 |        
  45 | 
  46 |        
  47 |         
  48 |     })
  49 | 
  50 | });
  51 | 
  52 | 
  53 | 
  54 | 
  55 | 
  56 | 
```