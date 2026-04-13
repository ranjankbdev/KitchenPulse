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

// get shop by city
const getShopsByCityAPI = async (city) => {
  const { data } = await axiosInstance.get(`/shop/city/${city}`, { withCredentials: true });
  return data;
};

const getShopByIdAPI = async (shopId) => {
  const { data } = await axiosInstance.get(`/shop/${shopId}`);
  return data;
};

export { getMyShopAPI, createShopAPI, updateShopAPI, getShopsByCityAPI, getShopByIdAPI };
