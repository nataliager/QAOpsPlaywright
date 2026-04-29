import { LoginPage, ProductsPage, CartPage, CheckoutPage, OrderConfirmationPage, MyOrdersPage } from './index';

class POManager {
    constructor(page) {
        this.loginPage = new LoginPage(page);
        this.productsPage = new ProductsPage(page);
        this.cartPage = new CartPage(page);
        this.checkoutPage = new CheckoutPage(page);
        this.confirmationPage = new OrderConfirmationPage(page);
        this.myOrdersPage = new MyOrdersPage(page);
    }
}

export { POManager };
