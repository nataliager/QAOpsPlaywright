import { test as base } from "@playwright/test";

interface OrderTestData {
  username: string;
  password: string;
  productName: string;
}

interface CustomFixtures {
  testDataForOrder: OrderTestData;
}

export const customTest = base.extend<CustomFixtures>({
  testDataForOrder: async ({}, use) => {
    await use({
      username: "marie.valencia@example.com",
      password: "Password123@",
      productName: "ZARA COAT 3",
    });
  },
});
