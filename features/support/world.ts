import { setWorldConstructor, World } from "@cucumber/cucumber";
import { Browser, Page } from "@playwright/test";
import { POManager } from "../../pageobjects_ts";

export class CustomWorld extends World {
  browser!: Browser;
  page!: Page;
  po!: POManager;
  orderId!: string;
}

setWorldConstructor(CustomWorld);
