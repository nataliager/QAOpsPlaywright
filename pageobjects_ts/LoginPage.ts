import { Page, Locator } from "@playwright/test";

export class LoginPage {
  private readonly userEmail: Locator;
  private readonly password: Locator;
  private readonly loginBtn: Locator;

  constructor(private readonly page: Page) {
    this.userEmail = page.locator("#userEmail");
    this.password = page.locator("#userPassword");
    this.loginBtn = page.locator("#login");
  }

  async goto(): Promise<void> {
    await this.page.goto("https://rahulshettyacademy.com/client/#/auth/login");
  }

  async login(email: string, password: string): Promise<void> {
    await this.userEmail.fill(email);
    await this.password.fill(password);
    await this.loginBtn.click();
    await this.page.waitForLoadState("networkidle");
  }
}
