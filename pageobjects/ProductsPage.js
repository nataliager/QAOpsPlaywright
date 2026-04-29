class ProductsPage {
    constructor(page) {
        this.page = page;
        this.cardTitles = page.locator('.card-body b');
        this.products = page.locator('.card-body');
        this.cartBtn = page.locator('[routerlink*="cart"]');
    }

    async waitForLoad() {
        await this.cardTitles.first().waitFor();
    }

    async getAllTitles() {
        return this.cardTitles.allTextContents();
    }

    async addProductToCart(productName) {
        const count = await this.products.count();
        for (let i = 0; i < count; i++) {
            const title = await this.products.nth(i).locator('b').textContent();
            if (title === productName) {
                await this.products.nth(i).locator('text= Add To Cart').click();
                break;
            }
        }
    }

    async goToCart() {
        await this.cartBtn.click();
    }
}

export { ProductsPage };
