# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: NetworkTest2.spec.js >> @QW Security test request intercept
- Location: tests/NetworkTest2.spec.js:12:5

# Error details

```
Test timeout of 40000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 40000ms exceeded.
Call log:
  - waiting for locator('.card-body b').first() to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e7]: Ecom
      - generic [ref=e9]:
        - link " dummywebsite@rahulshettyacademy.com" [ref=e11] [cursor=pointer]:
          - /url: emailto:dummywebsite@rahulshettyacademy.com
          - generic [ref=e12]: 
          - text: dummywebsite@rahulshettyacademy.com
        - generic [ref=e13]:
          - link "" [ref=e14] [cursor=pointer]:
            - /url: "#"
            - generic [ref=e15]: 
          - link "" [ref=e16] [cursor=pointer]:
            - /url: "#"
            - generic [ref=e17]: 
          - link "" [ref=e18] [cursor=pointer]:
            - /url: "#"
            - generic [ref=e19]: 
          - link "" [ref=e20] [cursor=pointer]:
            - /url: "#"
            - generic [ref=e21]: 
  - generic [ref=e22]:
    - generic [ref=e23]:
      - heading "We Make Your Shopping Simple" [level=3]
      - heading "Practice Website for Rahul Shetty Academy Students" [level=1] [ref=e24]:
        - text: Practice Website for
        - emphasis [ref=e25]: Rahul Shetty Academy
        - text: Students
      - link "Register" [ref=e26] [cursor=pointer]:
        - /url: "#/auth/register"
    - generic [ref=e28]:
      - paragraph [ref=e29]:
        - generic [ref=e30]: Register to sign in with your personal account
      - generic [ref=e31]:
        - heading "Log in" [level=1] [ref=e32]
        - generic [ref=e33]:
          - generic [ref=e34]:
            - generic [ref=e35]: Email
            - textbox "email@example.com" [ref=e36]: anshika@gmail.com
          - generic [ref=e37]:
            - generic [ref=e38]: Password
            - textbox "enter your passsword" [ref=e39]: Iamking@000
          - button "Login" [active] [ref=e40] [cursor=pointer]
        - link "Forgot password?" [ref=e41] [cursor=pointer]:
          - /url: "#/auth/password-new"
        - paragraph [ref=e42] [cursor=pointer]: Don't have an account? Register here
  - generic [ref=e43]:
    - heading "Why People Choose Us?" [level=1] [ref=e46]
    - generic [ref=e47]:
      - generic [ref=e48]:
        - generic [ref=e50]: 
        - generic [ref=e51]:
          - heading "3546540" [level=1]
          - paragraph [ref=e52]: Successfull Orders
      - generic [ref=e53]:
        - generic [ref=e55]: 
        - generic [ref=e56]:
          - heading "37653" [level=1]
          - paragraph [ref=e57]: Customers
      - generic [ref=e58]:
        - generic [ref=e60]: 
        - generic [ref=e61]:
          - heading "3243" [level=1]
          - paragraph [ref=e62]: Sellers
    - generic [ref=e63]:
      - generic [ref=e64]:
        - generic [ref=e66]: 
        - generic [ref=e67]:
          - heading "4500+" [level=1]
          - paragraph [ref=e68]: Daily Orders
      - generic [ref=e69]:
        - generic [ref=e71]: 
        - generic [ref=e72]:
          - heading "500+" [level=1]
          - paragraph [ref=e73]: Daily New Customer Joining
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const BASE_URL = 'https://rahulshettyacademy.com';
  4  | 
  5  | const credentials = {
  6  |     email: 'anshika@gmail.com',
  7  |     password: 'Iamking@000',
  8  | };
  9  | 
  10 | const unauthorizedOrderId = '621661f884b053f6765465b6';
  11 | 
  12 | test('@QW Security test request intercept', async ({ page }) => {
  13 | 
  14 |     await test.step('Login', async () => {
  15 |         await page.goto(`${BASE_URL}/client`);
  16 |         await page.locator('#userEmail').fill(credentials.email);
  17 |         await page.locator('#userPassword').fill(credentials.password);
  18 |         await page.locator("[value='Login']").click();
  19 |         await page.waitForLoadState('networkidle');
> 20 |         await page.locator('.card-body b').first().waitFor();
     |                                                    ^ Error: locator.waitFor: Test timeout of 40000ms exceeded.
  21 |     });
  22 | 
  23 |     await test.step('Intercept order detail request with unauthorized ID', async () => {
  24 |         await page.route(
  25 |             `${BASE_URL}/api/ecom/order/get-orders-details?id=*`,
  26 |             route => route.continue({
  27 |                 url: `${BASE_URL}/api/ecom/order/get-orders-details?id=${unauthorizedOrderId}`,
  28 |             })
  29 |         );
  30 |     });
  31 | 
  32 |     await test.step('Navigate to orders and click View', async () => {
  33 |         await page.locator("button[routerlink*='myorders']").click();
  34 |         await page.locator("button:has-text('View')").first().click();
  35 |     });
  36 | 
  37 |     await test.step('Validate unauthorized access message', async () => {
  38 |         await expect(page.locator('p').last()).toHaveText('You are not authorize to view this order');
  39 |     });
  40 | 
  41 | });
  42 | 
```