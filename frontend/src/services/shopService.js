import axiosInstance from '../config/axiosInstance.js';

// Get logged-in vendor shop
const getMyShopAPI = async () => {
  const { data } = await axiosInstance.get('/shop/me');
  return data;
};

// Create new shop
const createShopAPI = async (shopData) => {
  const { data } = await axiosInstance.post('/shop', shopData);
  return data;
};

// Update existing shop
const updateShopAPI = async (shopData) => {
  const { data } = await axiosInstance.patch('/shop', shopData);
  return data;
};

// get shop by city
const getShopsByCityAPI = async (city) => {
  const { data } = await axiosInstance.get(`/shop/city/${city}`);
  return data;
};

const getShopByIdAPI = async (shopId) => {
  const { data } = await axiosInstance.get(`/shop/${shopId}`);
  return data;
};

export { getMyShopAPI, createShopAPI, updateShopAPI, getShopsByCityAPI, getShopByIdAPI };
