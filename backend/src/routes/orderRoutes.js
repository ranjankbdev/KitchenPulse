import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import { createOrder, getOrders, updateShopOrderStatus } from '../controllers/orderController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { createOrderSchema, updateShopOrderStatusSchema } from '../schemas/orderSchema.js';

const orderRouter = express.Router();

orderRouter.post('/', verifyToken, validateSchema(createOrderSchema), wrapAsync(createOrder));
orderRouter.get('/', verifyToken, wrapAsync(getOrders));
orderRouter.patch(
  '/:orderId/shop/:shopId/status',
  verifyToken,
  validateSchema(updateShopOrderStatusSchema),
  wrapAsync(updateShopOrderStatus)
);

export { orderRouter };
