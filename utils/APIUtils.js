class APIUtils {

    constructor(apiContext,loginPayload){
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async getToken(){
        const loginResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {data: this.loginPayload});
        const loginResponseBody = await loginResponse.json();
        const token = loginResponseBody.token;
        console.log('Token:', token);

        return token;
        
    }

    async createOrder(orderPayload){

        let response = {};
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order',{
            data: orderPayload,
            headers: {
                'Authorization': response.token,
                'Content-Type': 'application/json'
            }
        })

        const orderResponseBody = await orderResponse.json();
        console.log(orderResponseBody);
        const orderId = orderResponseBody.orders[0];
        response.orderId = orderId;

        return response;
    }

}

export { APIUtils };