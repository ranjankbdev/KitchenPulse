import axiosInstance from '../config/axiosInstance.js';

const createOrderAPI = async (orderData) => {
  const { data } = await axiosInstance.post('/order', orderData, { withCredentials: true });
  return data;
};

export { createOrderAPI };
