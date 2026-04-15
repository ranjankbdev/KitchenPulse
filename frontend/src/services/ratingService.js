import axiosInstance from '../config/axiosInstance.js';

const rateItemAPI = async (rateData) => {
  const { data } = await axiosInstance.post('/rating', rateData);
  return data;
}

export { rateItemAPI };