class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.cardNumber = page.locator('input[type="text"]').first();
        this.expiryMonth = page.locator('.ddl').first();
        this.expiryYear = page.locator('.ddl').last();
        this.cvv = page.locator('input[type="text"]').nth(1);
        this.nameOnCard = page.locator('input[type="text"]').nth(2);
        this.coupon = page.locator('input[type="text"]').nth(3);
        this.countryInput = page.locator('[placeholder*="Country"]');
        this.countryDropdown = page.locator('.ta-results');
        this.emailField = page.locator('.user__name input[type="text"]').first();
        this.placeOrderBtn = page.locator('.action__submit');
    }

    async fillPaymentDetails({ cardNumber, month, year, cvv, name, coupon }) {
        await this.cardNumber.fill(cardNumber);
        await this.expiryMonth.selectOption(month);
        await this.expiryYear.selectOption(year);
        await this.cvv.fill(cvv);
        await this.nameOnCard.fill(name);
        await this.coupon.fill(coupon);
    }

    async selectCountry(countryName) {
        await this.countryInput.pressSequentially(countryName.slice(0, 3).toLowerCase(), { delay: 150 });
        await this.countryDropdown.waitFor();
        const buttons = this.countryDropdown.locator('button');
        const count = await buttons.count();
        for (let i = 0; i < count; i++) {
            const text = await buttons.nth(i).textContent();
            if (text.trim() === countryName) {
                await buttons.nth(i).click();
                break;
            }
        }
    }

    async placeOrder() {
        await this.placeOrderBtn.click();
    }
}

export { CheckoutPage };
