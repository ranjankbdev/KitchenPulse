import axiosInstance from '../config/axiosInstance.js';

const createOrderAPI = async (orderData) => {
  const { data } = await axiosInstance.post('/order', orderData, { withCredentials: true });
  return data;
};

const getOrdersAPI = async () => {
  const { data } = await axiosInstance.get('/order', { withCredentials: true });
  return data;
};

const updateShopOrderStatusAPI = async (orderId, shopId, status) => {
  const { data } = await axiosInstance.patch(
    `/order/${orderId}/shop/${shopId}/status`,
    { status },
    { withCredentials: true }
  );
  return data;
};

const getDeliveryAssignmentsAPI = async () => {
  const { data } = await axiosInstance.get('/order/assignments');
  return data;
};

const acceptDeliveryAssignmentAPI = async (assignmentId) => {
  const { data } = await axiosInstance.patch(`/order/assignments/${assignmentId}/accept`);
  return data;
};

export {
  createOrderAPI,
  getOrdersAPI,
  updateShopOrderStatusAPI,
  getDeliveryAssignmentsAPI,
  acceptDeliveryAssignmentAPI,
};
