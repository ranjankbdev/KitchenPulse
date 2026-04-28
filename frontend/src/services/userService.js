import axiosInstance from '../config/axiosInstance.js';

const getUserAPI = async () => {
  const { data } = await axiosInstance.get('/user/me');
  return data;
};

const updateUserLocationAPI = async (locationData) => {
  const { data } = await axiosInstance.patch('/user/location', locationData);
  return data;
};

export { getUserAPI, updateUserLocationAPI };
