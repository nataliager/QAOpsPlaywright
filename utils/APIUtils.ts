import { APIRequestContext } from "@playwright/test";

interface LoginPayload {
  userEmail: string;
  userPassword: string;
}

interface OrderPayload {
  orders: Array<{
    country: string;
    productOrderedId: string;
  }>;
}

interface OrderResponse {
  token: string;
  orderId: string;
}

interface LoginResponseBody {
  token: string;
}

interface CreateOrderResponseBody {
  orders: string[];
}

export class APIUtils {
  constructor(
    private readonly apiContext: APIRequestContext,
    private readonly loginPayload: LoginPayload
  ) {}

  async getToken(): Promise<string> {
    const loginResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      { data: this.loginPayload }
    );
    const { token } = (await loginResponse.json()) as LoginResponseBody;
    console.log("Token:", token);
    return token;
  }

  async createOrder(orderPayload: OrderPayload): Promise<OrderResponse> {
    const token = await this.getToken();
    const orderResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      {
        data: orderPayload,
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const orderResponseBody = (await orderResponse.json()) as CreateOrderResponseBody;
    console.log(orderResponseBody);
    return {
      token,
      orderId: orderResponseBody.orders[0],
    };
  }
}
