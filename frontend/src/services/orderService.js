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

const getActiveDeliveryAssignmentAPI = async () => {
  const { data } = await axiosInstance.get(`/order/active`);
  return data;
};

const getOrderByIdAPI = async (orderId) => {
  const { data } = await axiosInstance.get(`/order/${orderId}`, { orderId });
  return data;
};

const sendDeliveryOtpAPI = async (orderId, shopOrderId) => {
  const { data } = await axiosInstance.post(
    `/order/${orderId}/shop-orders/${shopOrderId}/delivery-otp`
  );
  return data;
};

const verifyDeliveryOtpAPI = async (orderId, shopOrderId, otp) => {
  const { data } = await axiosInstance.post(
    `/order/${orderId}/shop-orders/${shopOrderId}/verify-delivery-otp`,
    { otp }
  );
  return data;
};

export {
  createOrderAPI,
  getOrdersAPI,
  updateShopOrderStatusAPI,
  getDeliveryAssignmentsAPI,
  acceptDeliveryAssignmentAPI,
  getActiveDeliveryAssignmentAPI,
  getOrderByIdAPI,
  sendDeliveryOtpAPI,
  verifyDeliveryOtpAPI,
};
