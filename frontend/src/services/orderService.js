import axiosInstance from '../config/axiosInstance.js';

const createOrderAPI = async (orderData) => {
  const { data } = await axiosInstance.post('/order', orderData, { withCredentials: true });
  return data;
};

const getOrdersAPI = async () => {
  const { data } = await axiosInstance.get('/order', { withCredentials: true });
  return data;
};

const updateShopOrderStatusAPI = async (orderId, shopId, status) => {
  const { data } = await axiosInstance.patch(
    `/order/${orderId}/shop/${shopId}/status`,
    { status },
    { withCredentials: true }
  );
  return data;
};

export { createOrderAPI, getOrdersAPI, updateShopOrderStatusAPI };
