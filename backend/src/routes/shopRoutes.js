import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import {
  createShop,
  updateShop,
  getMyShop,
  getShopsByCity,
} from '../controllers/shopController.js';
import { createShopSchema, updateShopSchema, getShopsByCitySchema } from '../schemas/shopSchema.js';
import { validateSchema } from '../middlewares/validateSchema.js';

const shopRouter = express.Router();

shopRouter.post('/', verifyToken, validateSchema(createShopSchema), wrapAsync(createShop));
shopRouter.patch('/', verifyToken, validateSchema(updateShopSchema), wrapAsync(updateShop));
shopRouter.get('/me', verifyToken, wrapAsync(getMyShop));
shopRouter.get(
  '/city/:city',
  verifyToken,
  validateSchema(getShopsByCitySchema),
  wrapAsync(getShopsByCity)
);

export { shopRouter };
