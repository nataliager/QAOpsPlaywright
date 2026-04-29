class OrderConfirmationPage {
    constructor(page) {
        this.page = page;
        this.successMessage = page.locator('.hero-primary');
        this.orderIdLocator = page.locator('.em-spacer-1 .ng-star-inserted');
        this.myOrdersBtn = page.locator('button[routerlink*="myorders"]');
    }

    async getOrderId() {
        return (await this.orderIdLocator.textContent()).trim();
    }

    async goToMyOrders() {
        await this.myOrdersBtn.click();
    }
}

export { OrderConfirmationPage };
