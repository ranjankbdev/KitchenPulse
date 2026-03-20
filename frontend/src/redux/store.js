import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice.js';
import vendorSlice from './vendorSlice.js';

const store = configureStore({
  reducer: {
    user: userSlice,
    vendor: vendorSlice,
  },
});

export default store;
