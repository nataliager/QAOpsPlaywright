import { Page, Locator } from "@playwright/test";

export class ProductsPage {
  private readonly cardTitles: Locator;
  private readonly products: Locator;
  private readonly cartBtn: Locator;

  constructor(page: Page) {
    this.cardTitles = page.locator(".card-body b");
    this.products = page.locator(".card-body");
    this.cartBtn = page.locator('[routerlink*="cart"]');
  }

  async waitForLoad(): Promise<void> {
    await this.cardTitles.first().waitFor();
  }

  async getAllTitles(): Promise<string[]> {
    return this.cardTitles.allTextContents();
  }

  async addProductToCart(productName: string): Promise<void> {
    const count = await this.products.count();
    for (let i = 0; i < count; i++) {
      const title = await this.products.nth(i).locator("b").textContent();
      if (title === productName) {
        await this.products.nth(i).locator("text= Add To Cart").click();
        break;
      }
    }
  }

  async goToCart(): Promise<void> {
    await this.cartBtn.click();
  }
}
