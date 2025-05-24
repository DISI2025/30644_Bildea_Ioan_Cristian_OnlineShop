import { CartItem } from "../store/slices/cart-slice";
import { CreateOrderRequest, CreateOrderItemRequest } from "../types/transfer";

/**
 * Transform cart items to CreateOrderRequest format
 * @param cartItems - Array of cart items
 * @param buyerId - ID of the buyer
 * @returns CreateOrderRequest object
 */
export const transformCartToOrderRequest = (
  cartItems: CartItem[],
  buyerId: string
): CreateOrderRequest => {
  const orderItems: CreateOrderItemRequest[] = cartItems.map(cartItem => ({
    quantity: cartItem.quantity,
    productId: cartItem.product.id
  }));

  return {
    buyerId,
    items: orderItems
  };
};