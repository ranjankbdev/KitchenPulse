import axiosInstance from '../config/axiosInstance.js';

// create new order
const createOrderAPI = async (orderData) => {
  const { data } = await axiosInstance.post('/order', orderData, { withCredentials: true });
  return data;
};
// get all user orders
const getOrdersAPI = async () => {
  const { data } = await axiosInstance.get('/order', { withCredentials: true });
  return data;
};
// update shop order status
const updateShopOrderStatusAPI = async (orderId, shopId, status) => {
  const { data } = await axiosInstance.patch(
    `/order/${orderId}/shop/${shopId}/status`,
    { status },
    { withCredentials: true }
  );
  return data;
};
// get all assigned orders
const getDeliveryAssignmentsAPI = async () => {
  const { data } = await axiosInstance.get('/order/assignments');
  return data;
};
// accept assignment
const acceptDeliveryAssignmentAPI = async (assignmentId) => {
  const { data } = await axiosInstance.patch(`/order/assignments/${assignmentId}/accept`);
  return data;
};
// get active assignment
const getActiveDeliveryAssignmentAPI = async () => {
  const { data } = await axiosInstance.get(`/order/active`);
  return data;
};
// get single order details
const getOrderByIdAPI = async (orderId) => {
  const { data } = await axiosInstance.get(`/order/${orderId}`);
  return data;
};
// send otp
const sendDeliveryOtpAPI = async (orderId, shopOrderId) => {
  const { data } = await axiosInstance.post(
    `/order/${orderId}/shop-orders/${shopOrderId}/delivery-otp`
  );
  return data;
};
// verify otp
const verifyDeliveryOtpAPI = async (orderId, shopOrderId, otp) => {
  const { data } = await axiosInstance.post(
    `/order/${orderId}/shop-orders/${shopOrderId}/verify-delivery-otp`,
    { otp }
  );
  return data;
};
// verify payment
const verifyPaymentAPI = async (paymentData) => {
  const { data } = await axiosInstance.post(`/order/verify-payment`, paymentData);
  return data;
};
// get delivery partner earnings
const getEarningsAPI = async () => {
  const { data } = await axiosInstance.get('/order/earnings');
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
  verifyPaymentAPI,
  getEarningsAPI,
};
