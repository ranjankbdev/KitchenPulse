import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import {
  acceptDeliveryAssignment,
  createOrder,
  getActiveDeliveryAssignment,
  getDeliveryAssignments,
  getOrders,
  updateShopOrderStatus,
} from '../controllers/orderController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import {
  assignmentIdSchema,
  createOrderSchema,
  updateShopOrderStatusSchema,
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
export { orderRouter };
