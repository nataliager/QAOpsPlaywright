class MyOrdersPage {
    constructor(page) {
        this.page = page;
        this.orderTable = page.locator('tbody');
        this.orderIds = page.locator("tr th[scope='row']");
    }

    async waitForLoad() {
        await this.orderTable.waitFor();
    }

    async viewOrder(orderId) {
        const rows = await this.orderIds.all();
        for (let i = 0; i < rows.length; i++) {
            const text = await rows[i].innerText();
            if (orderId.includes(text)) {
                await this.page.locator("tr td button.btn-primary").nth(i).click();
                break;
            }
        }
    }

    async getOrderDetailId() {
        return (await this.page.locator('.col-text').textContent()).trim();
    }
}

export { MyOrdersPage };
