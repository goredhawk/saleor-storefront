import {
  ICheckoutAddress,
  ICheckoutModel,
  ICheckoutModelLine,
  IOrderModel,
  IPaymentModel,
} from "@sdk/repository";

import { INetworkManagerResponse } from "../types";

export interface ICheckoutNetworkManager {
  getCheckout: (
    checkoutToken: string | null
  ) => Promise<INetworkManagerResponse<ICheckoutModel>>;
  getRefreshedCheckoutLines: (
    checkoutlines: ICheckoutModelLine[] | null
  ) => Promise<INetworkManagerResponse<ICheckoutModelLine[]>>;
  createCheckout: (
    email: string,
    lines: Array<{ variantId: string; quantity: number }>,
    shippingAddress: ICheckoutAddress,
    billingAddress?: ICheckoutAddress
  ) => Promise<INetworkManagerResponse<ICheckoutModel>>;
  setCartItem: (
    checkout: ICheckoutModel
  ) => Promise<INetworkManagerResponse<ICheckoutModel>>;
  setBillingAddress: (
    billingAddress: ICheckoutAddress,
    checkoutId: string
  ) => Promise<INetworkManagerResponse<ICheckoutModel>>;
  setShippingAddress: (
    shippingAddress: ICheckoutAddress,
    email: string,
    checkoutId: string
  ) => Promise<INetworkManagerResponse<ICheckoutModel>>;
  setShippingMethod: (
    shippingMethodId: string,
    checkoutId: string
  ) => Promise<INetworkManagerResponse<ICheckoutModel>>;
  addPromoCode: (
    promoCode: string,
    checkoutId: string
  ) => Promise<INetworkManagerResponse<ICheckoutModel>>;
  removePromoCode: (
    promoCode: string,
    checkoutId: string
  ) => Promise<INetworkManagerResponse<ICheckoutModel>>;
  createPayment: (
    amount: number,
    checkoutId: string,
    paymentGateway: string,
    paymentToken: string,
    billingAddress: ICheckoutAddress
  ) => Promise<INetworkManagerResponse<IPaymentModel>>;
  completeCheckout: (
    checkoutId: string
  ) => Promise<INetworkManagerResponse<IOrderModel>>;
}