import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    myOrders: [],
  },

  reducers: {
    addMyOrder: (state, action) => {
      state.myOrders.unshift(action.payload);
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },
  },
});

export const { addMyOrder, setMyOrders } = orderSlice.actions;

export default orderSlice.reducer;
