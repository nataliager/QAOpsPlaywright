import { Page, Locator } from "@playwright/test";

export class MyOrdersPage {
  private readonly orderTable: Locator;
  private readonly orderIds: Locator;

  constructor(private readonly page: Page) {
    this.orderTable = page.locator("tbody");
    this.orderIds = page.locator("tr th[scope='row']");
  }

  async waitForLoad(): Promise<void> {
    await this.orderTable.waitFor();
  }

  async viewOrder(orderId: string): Promise<void> {
    const rows = await this.orderIds.all();
    for (let i = 0; i < rows.length; i++) {
      const text = await rows[i].innerText();
      if (orderId.includes(text)) {
        await this.page.locator("tr td button.btn-primary").nth(i).click();
        break;
      }
    }
  }

  async getOrderDetailId(): Promise<string> {
    return ((await this.page.locator(".col-text").textContent()) ?? "").trim();
  }
}
