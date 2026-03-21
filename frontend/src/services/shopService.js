import axiosInstance from '../config/axiosInstance';

// Get logged-in vendor shop
const getMyShopAPI = async () => {
  const { data } = await axiosInstance.get('/shop/me', { withCredentials: true });
  return data;
};

// Create new shop
const createShopAPI = async (shopData) => {
  const { data } = await axiosInstance.post('/shop', shopData, { withCredentials: true });
  return data;
};

// Update existing shop
const updateShopAPI = async (shopData) => {
  const { data } = await axiosInstance.patch('/shop', shopData, { withCredentials: true });
  return data;
};

export { getMyShopAPI, createShopAPI, updateShopAPI };
