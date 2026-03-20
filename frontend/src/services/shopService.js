import axiosInstance from '../config/axiosInstance';

// Get logged-in vendor shop
const getMyShopAPI = async () => {
  const { data } = await axiosInstance.get('/shop/me', { withCredentials: true });
  return data;
};

export { getMyShopAPI };
