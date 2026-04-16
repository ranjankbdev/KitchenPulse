import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import {
  acceptDeliveryAssignment,
  createOrder,
  getActiveDeliveryAssignment,
  getDeliveryAssignments,
  getEarnings,
  getOrderById,
  getOrders,
  sendDeliveryOtp,
  updateShopOrderStatus,
  verifyDeliveryOtp,
  verifyPayment,
} from '../controllers/orderController.js';
import {
  assignmentIdSchema,
  createOrderSchema,
  orderIdSchema,
  sendDeliveryOtpSchema,
  updateShopOrderStatusSchema,
  verifyDeliveryOtpSchema,
  verifyPaymentSchema,
} from '../schemas/orderSchema.js';

const orderRouter = express.Router();

// create new order
orderRouter.post('/', verifyToken, validateSchema(createOrderSchema), wrapAsync(createOrder));

// get all orders
orderRouter.get('/', verifyToken, wrapAsync(getOrders));

// get active delivery assignment for delivery user
orderRouter.get('/active', verifyToken, wrapAsync(getActiveDeliveryAssignment));

// get all delivery assignments
orderRouter.get('/assignments', verifyToken, wrapAsync(getDeliveryAssignments));

// get earnings for delivery partner
orderRouter.get('/earnings', verifyToken, wrapAsync(getEarnings))

// verify razorpay payment
orderRouter.post(
  '/verify-payment',
  verifyToken,
  validateSchema(verifyPaymentSchema),
  wrapAsync(verifyPayment)
);

// update shop order status
orderRouter.patch(
  '/:orderId/shop/:shopId/status',
  verifyToken,
  validateSchema(updateShopOrderStatusSchema),
  wrapAsync(updateShopOrderStatus)
);

// accept delivery assignment
orderRouter.patch(
  '/assignments/:assignmentId/accept',
  verifyToken,
  validateSchema(assignmentIdSchema),
  wrapAsync(acceptDeliveryAssignment)
);

// send otp for delivery
orderRouter.post(
  '/:orderId/shop-orders/:shopOrderId/delivery-otp',
  verifyToken,
  validateSchema(sendDeliveryOtpSchema),
  wrapAsync(sendDeliveryOtp)
);

// verify otp at delivery time
orderRouter.post(
  '/:orderId/shop-orders/:shopOrderId/verify-delivery-otp',
  verifyToken,
  validateSchema(verifyDeliveryOtpSchema),
  wrapAsync(verifyDeliveryOtp)
);

// get single order details
orderRouter.get('/:orderId', verifyToken, validateSchema(orderIdSchema), wrapAsync(getOrderById));

export { orderRouter };
