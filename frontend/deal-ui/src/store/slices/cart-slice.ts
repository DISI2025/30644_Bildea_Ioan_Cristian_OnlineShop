import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { Product } from '../../types/entities';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
  return {
    totalItems,
    totalPrice,
  };
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      
      // Check if product already exists in cart
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // If product exists, update quantity
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // If product doesn't exist, add to cart
        state.items.push({ product, quantity });
      }
      
      // Calculate totals
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    updateCartItemQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      
      // Find the item in the cart
      const itemIndex = state.items.findIndex(item => item.product.id === productId);
      
      if (itemIndex >= 0) {
        // Update quantity
        state.items[itemIndex].quantity = quantity;
        
        // Calculate totals
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      
      // Remove item from cart
      state.items = state.items.filter(item => item.product.id !== productId);
      
      // Calculate totals
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    clearCart: (state) => {
      // Reset cart to initial state
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

// Export actions
export const { addToCart, updateCartItemQuantity, removeFromCart, clearCart } = cartSlice.actions;

// Export selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotalItems = (state: RootState) => state.cart.totalItems;
export const selectCartTotalPrice = (state: RootState) => state.cart.totalPrice;
export const selectCartItemByProductId = (productId: string) => (state: RootState) =>
  state.cart.items.find(item => item.product.id === productId);

export default cartSlice.reducer; 