import { Checkout } from "@sdk/fragments/types/Checkout";
import { SaleorAPI } from "@sdk/index";
import { ICheckoutModel } from "@sdk/repository";

import { ICheckoutNetworkManager } from "./types";

export class CheckoutNetworkManager implements ICheckoutNetworkManager {
  private api: SaleorAPI;

  constructor(api: SaleorAPI) {
    this.api = api;
  }

  getCheckout = async (checkoutToken: string | null) => {
    let checkout: Checkout | null;
    try {
      checkout = await new Promise((resolve, reject) => {
        if (this.api.isLoggedIn()) {
          this.api.getUserCheckout(null, {
            onError: error => {
              reject(error);
            },
            onUpdate: data => {
              resolve(data);
            },
          });
        } else if (checkoutToken) {
          this.api.getCheckoutDetails(
            {
              token: checkoutToken,
            },
            {
              onError: error => {
                reject(error);
              },
              onUpdate: data => {
                resolve(data);
              },
            }
          );
        } else {
          resolve(null);
        }
      });

      if (checkout) {
        const { id, email, shippingAddress, billingAddress, lines } = checkout;
        return {
          data: {
            billingAddress,
            email,
            id,
            lines: lines
              ?.filter(item => item?.quantity && item.variant.id)
              .map(item => {
                const itemVariant = item?.variant;

                return {
                  id: item!.id,
                  quantity: item!.quantity,
                  totalPrice: item?.totalPrice,
                  variant: {
                    id: itemVariant!.id,
                    name: itemVariant?.name,
                    pricing: itemVariant?.pricing,
                    product: itemVariant?.product,
                    stockQuantity: itemVariant?.stockQuantity,
                  },
                };
              }),
            shippingAddress,
          },
          errors: null,
        };
      } else {
        return {
          data: null,
          errors: null,
        };
      }
    } catch (errors) {
      return {
        data: null,
        errors,
      };
    }
  };

  createCheckout = async (
    email: string,
    shippingAddress: object,
    billingAddress: object,
    lines: Array<{ variantId: string; quantity: number }>
  ) => {
    const { data } = await this.api.setCreateCheckout({
      checkoutInput: {
        billingAddress,
        email,
        lines,
        shippingAddress,
      },
    });

    if (data?.errors && data.errors.length) {
      return {
        data: null,
        errors: data?.errors,
      };
    }

    if (data?.checkout) {
      const {
        id,
        email,
        shippingAddress,
        billingAddress,
        lines,
      } = data?.checkout;

      return {
        data: {
          billingAddress,
          email,
          id,
          lines: lines
            ?.filter(item => item?.quantity && item.variant.id)
            .map(item => {
              const itemVariant = item?.variant;

              return {
                id: item!.id,
                quantity: item!.quantity,
                totalPrice: item?.totalPrice,
                variant: {
                  id: itemVariant!.id,
                  name: itemVariant?.name,
                  pricing: itemVariant?.pricing,
                  product: itemVariant?.product,
                  stockQuantity: itemVariant?.stockQuantity,
                },
              };
            }),
          shippingAddress,
        },
        errors: null,
      };
    } else {
      return { data: null, errors: null };
    }
  };

  setCartItem = async (checkout: ICheckoutModel) => {
    const checkoutId = checkout.id;
    const lines = checkout.lines;

    if (checkoutId && lines) {
      const alteredLines = lines.map(line => ({
        quantity: line.quantity,
        variantId: line.variant.id,
      }));

      const { data } = await this.api.setCheckoutLine({
        checkoutId,
        lines: alteredLines,
      });

      if (data?.errors && data.errors.length) {
        return {
          data: null,
          errors: data.errors,
        };
      }

      if (data?.checkout) {
        const {
          id,
          email,
          shippingAddress,
          billingAddress,
          lines,
        } = data?.checkout;

        return {
          data: {
            billingAddress,
            email,
            id,
            lines: lines
              ?.filter(item => item?.quantity && item.variant.id)
              .map(item => {
                const itemVariant = item?.variant;

                return {
                  id: item!.id,
                  quantity: item!.quantity,
                  totalPrice: item?.totalPrice,
                  variant: {
                    id: itemVariant!.id,
                    name: itemVariant?.name,
                    pricing: itemVariant?.pricing,
                    product: itemVariant?.product,
                    stockQuantity: itemVariant?.stockQuantity,
                  },
                };
              }),
            shippingAddress,
          },
          errors: null,
        };
      }
    }
    return { data: null, errors: null };
  };

  setBillingAddress = async () => ({ data: null, errors: null });
  setShippingAddress = async () => ({ data: null, errors: null });
  setShippingAsBillingAddress = async () => ({ data: null, errors: null });
}