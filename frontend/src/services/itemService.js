import axiosInstance from '../config/axiosInstance';

const deleteItemByIdAPI = async (itemId) => {
  const { data } = await axiosInstance.delete(`/item/${itemId}`, { withCredentials: true });
  return data;
};

export { deleteItemByIdAPI };
