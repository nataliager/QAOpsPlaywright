import { Page, Locator } from "@playwright/test";

export class CartPage {
  private readonly checkoutBtn: Locator;

  constructor(private readonly page: Page) {
    this.checkoutBtn = page.locator("li[class='totalRow'] button[type='button']");
  }

  async waitForLoad(): Promise<void> {
    await this.page.locator("div li").first().waitFor();
  }

  async isProductVisible(productName: string): Promise<boolean> {
    return this.page.locator(`h3:has-text("${productName}")`).isVisible();
  }

  async checkout(): Promise<void> {
    await this.checkoutBtn.click();
  }
}
