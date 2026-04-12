import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import {
  acceptDeliveryAssignment,
  createOrder,
  getActiveDeliveryAssignment,
  getDeliveryAssignments,
  getOrderById,
  getOrders,
  sendDeliveryOtp,
  updateShopOrderStatus,
  verifyDeliveryOtp,
} from '../controllers/orderController.js';
import {
  assignmentIdSchema,
  createOrderSchema,
  orderIdSchema,
  sendDeliveryOtpSchema,
  updateShopOrderStatusSchema,
  verifyDeliveryOtpSchema,
} from '../schemas/orderSchema.js';

const orderRouter = express.Router();

orderRouter.post('/', verifyToken, validateSchema(createOrderSchema), wrapAsync(createOrder));
orderRouter.get('/', verifyToken, wrapAsync(getOrders));
orderRouter.get('/active', verifyToken, wrapAsync(getActiveDeliveryAssignment));
orderRouter.get('/assignments', verifyToken, wrapAsync(getDeliveryAssignments));

orderRouter.patch(
  '/:orderId/shop/:shopId/status',
  verifyToken,
  validateSchema(updateShopOrderStatusSchema),
  wrapAsync(updateShopOrderStatus)
);

orderRouter.patch(
  '/assignments/:assignmentId/accept',
  verifyToken,
  validateSchema(assignmentIdSchema),
  wrapAsync(acceptDeliveryAssignment)
);

orderRouter.post(
  '/:orderId/shop-orders/:shopOrderId/delivery-otp',
  verifyToken,
  validateSchema(sendDeliveryOtpSchema),
  wrapAsync(sendDeliveryOtp)
);

orderRouter.post(
  '/:orderId/shop-orders/:shopOrderId/verify-delivery-otp',
  verifyToken,
  validateSchema(verifyDeliveryOtpSchema),
  wrapAsync(verifyDeliveryOtp)
);

orderRouter.get('/:orderId', verifyToken, validateSchema(orderIdSchema), wrapAsync(getOrderById));

export { orderRouter };
