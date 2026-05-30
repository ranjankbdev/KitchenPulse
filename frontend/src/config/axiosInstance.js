import axios from 'axios';
import { API_URL } from './config.js';
import formatApiError from '../utils/formatApiError.js';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    throw formatApiError(error);
  }
);

export default axiosInstance;
