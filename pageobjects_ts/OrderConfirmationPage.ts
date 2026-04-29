import { Page, Locator } from "@playwright/test";

export class OrderConfirmationPage {
  readonly successMessage: Locator;
  private readonly orderIdLocator: Locator;
  private readonly myOrdersBtn: Locator;

  constructor(private readonly page: Page) {
    this.successMessage = page.locator(".hero-primary");
    this.orderIdLocator = page.locator(".em-spacer-1 .ng-star-inserted");
    this.myOrdersBtn = page.locator('button[routerlink*="myorders"]');
  }

  async getOrderId(): Promise<string> {
    return ((await this.orderIdLocator.textContent()) ?? "").trim();
  }

  async goToMyOrders(): Promise<void> {
    await this.myOrdersBtn.click();
  }
}
