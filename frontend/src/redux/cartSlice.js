import { createSlice } from '@reduxjs/toolkit';

const calculateTotalAmount = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    totalAmount: 0,
  },

  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find((i) => i._id === item._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }
      state.totalAmount = calculateTotalAmount(state.cartItems);
    },

    increaseCartItem: (state, action) => {
      const item = state.cartItems.find((i) => i._id === action.payload);
      if (item) {
        item.quantity += 1;
        state.totalAmount = calculateTotalAmount(state.cartItems);
      }
    },

    decreaseCartItem: (state, action) => {
      const item = state.cartItems.find((i) => i._id === action.payload);
      if (!item) return;
      if (item.quantity === 1) {
        state.cartItems = state.cartItems.filter((i) => i._id !== action.payload);
      } else {
        item.quantity -= 1;
      }
      state.totalAmount = calculateTotalAmount(state.cartItems);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i._id !== action.payload);
      state.totalAmount = calculateTotalAmount(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, increaseCartItem, decreaseCartItem, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
