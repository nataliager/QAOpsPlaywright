import { test, expect } from "@playwright/test";
import { POManager } from "../pageobjects_ts";
import testData from "../utils/placeorderTestData.json";

interface OrderTestData {
  username: string;
  password: string;
  productName: string;
}

for (const { username: userEmail, password, productName } of testData as OrderTestData[]) {

  test(`@Web Client App login with jsonData - ${userEmail}`, async ({ page }) => {
    const po = new POManager(page);
    const { loginPage, productsPage, cartPage, checkoutPage, confirmationPage, myOrdersPage } = po;

    await test.step("Login", async () => {
      await loginPage.goto();
      await loginPage.login(userEmail, password);
      await productsPage.waitForLoad();
    });

    await test.step("Get card titles", async () => {
      const allTitles = await productsPage.getAllTitles();
      console.log(`All card titles: ${allTitles}`);
    });

    await test.step("Add product to cart", async () => {
      await productsPage.addProductToCart(productName);
    });

    await test.step("Validate product in cart", async () => {
      await productsPage.goToCart();
      await cartPage.waitForLoad();
      expect(await cartPage.isProductVisible(productName)).toBeTruthy();
    });

    await test.step("Go to checkout", async () => {
      await cartPage.checkout();
    });

    await test.step("Fill payment details", async () => {
      await checkoutPage.fillPaymentDetails({
        cardNumber: "1234 5678 9012 3456",
        month: "12",
        year: "16",
        cvv: "123",
        name: "Marie Valencia",
        coupon: "cuoupon",
      });
    });

    await test.step("Fill shipping information", async () => {
      await checkoutPage.selectCountry("India");
    });

    await test.step("Place order", async () => {
      await checkoutPage.placeOrder();
    });

    await test.step("Validate successful message", async () => {
      await expect(confirmationPage.successMessage).toHaveText(" Thankyou for the order. ");
    });

    await test.step("Validate order details", async () => {
      const orderId = await confirmationPage.getOrderId();
      console.log("orderId:", orderId);
      await confirmationPage.goToMyOrders();

      await myOrdersPage.waitForLoad();
      await myOrdersPage.viewOrder(orderId);

      const orderDetailId = await myOrdersPage.getOrderDetailId();
      expect(orderId.includes(orderDetailId)).toBeTruthy();
    });
  });

}
