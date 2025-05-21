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

//TODO Delete this after integration with backend
/**
 * Simulate creating an order (for development)
 * @param orderRequest - The order request to submit
 * @returns A promise that resolves to a simulated order response
 */
export const simulateCreateOrder = async (
  orderRequest: CreateOrderRequest
): Promise<{ success: boolean; orderId: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful response
  return {
    success: true,
    orderId: `order-${Date.now()}`
  };
}; 