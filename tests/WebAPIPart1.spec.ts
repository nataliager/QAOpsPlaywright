import { test, expect, request, APIRequestContext } from "@playwright/test";
import { APIUtils } from "../utils/APIUtils";

const loginPayload = { userEmail: "marie.valencia@example.com", userPassword: "Password123@" };
const orderPayload = { orders: [{ country: "Colombia", productOrderedId: "6960eae1c941646b7a8b3ed3" }] };

let response: { token: string; orderId: string };
let apiContext: APIRequestContext;

test.beforeAll(async () => {
  apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});

test("Place order", async ({ page }) => {

  await test.step("Set token in local storage", async () => {
    await page.addInitScript((token: string) => {
      window.localStorage.setItem("token", token);
    }, response.token);
    await page.goto("https://rahulshettyacademy.com/client/");
  });

  await test.step("Validate order details", async () => {
    await page.locator('button[routerlink*="myorders"]').click();
    await page.locator("tbody").waitFor();

    const orderIds = await page.locator("tr th[scope='row']").all();
    for (let i = 0; i < orderIds.length; i++) {
      const orderIdText = await orderIds[i].innerText();
      console.log("orderIdText:", orderIdText);
      if (response.orderId.includes(orderIdText)) {
        await page.locator("tr td button.btn-primary").nth(i).click();
        break;
      }
    }

    const orderIdDetails = await page.locator(".col-text").textContent();
    await page.pause();
    expect(response.orderId.includes(orderIdDetails!.trim())).toBeTruthy();
  });

});
