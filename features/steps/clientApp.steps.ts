import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";

Given("the user navigates to the login page", async function (this: CustomWorld) {
  await this.po.loginPage.goto();
});

When(
  "the user logs in with {string} and {string}",
  async function (this: CustomWorld, userEmail: string, password: string) {
    await this.po.loginPage.login(userEmail, password);
  }
);

Then("the products page should be loaded", async function (this: CustomWorld) {
  await this.po.productsPage.waitForLoad();
});

When(
  "the user adds {string} to the cart",
  async function (this: CustomWorld, productName: string) {
    const allTitles = await this.po.productsPage.getAllTitles();
    console.log(`All card titles: ${allTitles}`);
    await this.po.productsPage.addProductToCart(productName);
  }
);

When("the user goes to the cart", async function (this: CustomWorld) {
  await this.po.productsPage.goToCart();
  await this.po.cartPage.waitForLoad();
});

Then(
  "the product {string} should be visible in the cart",
  async function (this: CustomWorld, productName: string) {
    expect(await this.po.cartPage.isProductVisible(productName)).toBeTruthy();
  }
);

When("the user proceeds to checkout", async function (this: CustomWorld) {
  await this.po.cartPage.checkout();
});

When(
  "the user fills payment details with card {string}, month {string}, year {string}, cvv {string}, name {string} and coupon {string}",
  async function (
    this: CustomWorld,
    cardNumber: string,
    month: string,
    year: string,
    cvv: string,
    name: string,
    coupon: string
  ) {
    await this.po.checkoutPage.fillPaymentDetails({ cardNumber, month, year, cvv, name, coupon });
  }
);

When(
  "the user selects country {string}",
  async function (this: CustomWorld, country: string) {
    await this.po.checkoutPage.selectCountry(country);
  }
);

When("the user places the order", async function (this: CustomWorld) {
  await this.po.checkoutPage.placeOrder();
});

Then(
  "a success message {string} should be displayed",
  async function (this: CustomWorld, message: string) {
    await expect(this.po.confirmationPage.successMessage).toHaveText(` ${message} `);
    this.orderId = await this.po.confirmationPage.getOrderId();
    console.log("orderId:", this.orderId);
  }
);

Then("the order should appear in My Orders", async function (this: CustomWorld) {
  await this.po.confirmationPage.goToMyOrders();
  await this.po.myOrdersPage.waitForLoad();
  await this.po.myOrdersPage.viewOrder(this.orderId);

  const orderDetailId = await this.po.myOrdersPage.getOrderDetailId();
  expect(this.orderId.includes(orderDetailId)).toBeTruthy();
});
