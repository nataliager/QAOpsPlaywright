import { Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { ProductsPage } from "./ProductsPage";
import { CartPage } from "./CartPage";
import { CheckoutPage } from "./CheckoutPage";
import { OrderConfirmationPage } from "./OrderConfirmationPage";
import { MyOrdersPage } from "./MyOrdersPage";

export class POManager {
  readonly loginPage: LoginPage;
  readonly productsPage: ProductsPage;
  readonly cartPage: CartPage;
  readonly checkoutPage: CheckoutPage;
  readonly confirmationPage: OrderConfirmationPage;
  readonly myOrdersPage: MyOrdersPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.productsPage = new ProductsPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutPage = new CheckoutPage(page);
    this.confirmationPage = new OrderConfirmationPage(page);
    this.myOrdersPage = new MyOrdersPage(page);
  }
}
