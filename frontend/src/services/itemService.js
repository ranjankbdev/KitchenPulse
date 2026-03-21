import axiosInstance from '../config/axiosInstance';

const deleteItemByIdAPI = async (itemId) => {
  const { data } = await axiosInstance.delete(`/item/${itemId}`, { withCredentials: true });
  return data;
};

const createItemAPI = async (itemData) => {
  const { data } = await axiosInstance.post('/item', itemData, { withCredentials: true });
  return data;
};

const getItemByIdAPI = async (itemId) => {
  const { data } = await axiosInstance.get(`/item/${itemId}`, { withCredentials: true });
  return data;
};

const updateItemAPI = async (itemId, itemData) => {
  const { data } = await axiosInstance.patch(`/item/${itemId}`, itemData, {
    withCredentials: true,
  });
  return data;
};

export { deleteItemByIdAPI, createItemAPI, getItemByIdAPI, updateItemAPI };
