class LoginPage {
    constructor(page) {
        this.page = page;
        this.userEmail = page.locator('#userEmail');
        this.password = page.locator('#userPassword');
        this.loginBtn = page.locator('#login');
    }

    async goto() {
        await this.page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    }

    async login(email, password) {
        await this.userEmail.fill(email);
        await this.password.fill(password);
        await this.loginBtn.click();
        await this.page.waitForLoadState('networkidle');
    }
}

export { LoginPage };
