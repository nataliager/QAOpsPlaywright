class CartPage {
    constructor(page) {
        this.page = page;
        this.checkoutBtn = page.locator("li[class='totalRow'] button[type='button']");
    }

    async waitForLoad() {
        await this.page.locator("div li").first().waitFor();
    }

    async isProductVisible(productName) {
        return this.page.locator(`h3:has-text("${productName}")`).isVisible();
    }

    async checkout() {
        await this.checkoutBtn.click();
    }
}

export { CartPage };
