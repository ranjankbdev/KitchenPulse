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
      const cartItem = action.payload;
      const existingItem = state.cartItems.find((i) => i._id === cartItem._id);
      if (existingItem) {
        existingItem.quantity = cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      state.totalAmount = calculateTotalAmount(state.cartItems);
    },
  },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
