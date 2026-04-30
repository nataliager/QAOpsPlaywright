const { defineConfig } = require('@playwright/test');
const { createAzurePlaywrightConfig, ServiceOS } = require('@azure/playwright');
const { DefaultAzureCredential, ClientSecretCredential } = require('@azure/identity');
const config = require('./playwright.config');

const credential = process.env.AZURE_CLIENT_ID
  ? new ClientSecretCredential(process.env.AZURE_TENANT_ID, process.env.AZURE_CLIENT_ID, process.env.AZURE_CLIENT_SECRET)
  : new DefaultAzureCredential();

module.exports = defineConfig(
  config,
  createAzurePlaywrightConfig(config, {
    exposeNetwork: '<loopback>',
    connectTimeout: 3 * 60 * 1000,
    os: ServiceOS.LINUX,
    credential,
  }),
  {
    reporter: [
      ["html", { open: "never" }],
      ["@azure/playwright/reporter"],
    ],
  }
);
