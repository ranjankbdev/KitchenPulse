import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice.js';
import vendorSlice from './vendorSlice.js';
import cartSlice from './cartSlice.js';
import orderSlice from './orderSlice.js';

const store = configureStore({
  reducer: {
    user: userSlice,
    vendor: vendorSlice,
    cart: cartSlice,
    order: orderSlice,
  },
  devTools: false,
});

export default store;
