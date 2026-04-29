import { Before, After, AfterStep, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";
import { POManager } from "../../pageobjects_ts";
import { CustomWorld } from "./world";

setDefaultTimeout(100 * 1000);

Before({ tags: "@Web" }, async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: true });
  const context = await this.browser.newContext();
  this.page = await context.newPage();
  this.po = new POManager(this.page);
  await this.po.loginPage.goto();
});

AfterStep({ tags: "@Web" }, async function (this: CustomWorld, { result }) {
  if (result?.status === "FAILED") {
    const screenshot = await this.page.screenshot();
    this.attach(screenshot, "image/png");
  }
});

After({ tags: "@Web" }, async function (this: CustomWorld) {
  await this.browser?.close();
});
