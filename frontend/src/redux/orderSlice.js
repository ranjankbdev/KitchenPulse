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
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;

      const order = state.myOrders.find((o) => o._id === orderId);
      if (order) {
        const shopOrder = order.shopOrders.find(
          (so) => String(so.shop) === String(shopId) || String(so.shop?._id) === String(shopId)
        );
        if (shopOrder) {
          shopOrder.status = status;
        }
      }
    },
  },
});

export const { addMyOrder, setMyOrders, updateOrderStatus } = orderSlice.actions;

export default orderSlice.reducer;
