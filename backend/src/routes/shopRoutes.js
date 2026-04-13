import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import {
  createShop,
  updateShop,
  getMyShop,
  getShopsByCity,
  getShopById,
} from '../controllers/shopController.js';
import {
  createShopSchema,
  updateShopSchema,
  getShopsByCitySchema,
  shopIdSchema,
} from '../schemas/shopSchema.js';
import { validateSchema } from '../middlewares/validateSchema.js';

const shopRouter = express.Router();

// create new shop
shopRouter.post('/', verifyToken, validateSchema(createShopSchema), wrapAsync(createShop));

// update shop details
shopRouter.patch('/', verifyToken, validateSchema(updateShopSchema), wrapAsync(updateShop));

// get logged-in user's shop
shopRouter.get('/me', verifyToken, wrapAsync(getMyShop));

// get shops by city
shopRouter.get(
  '/city/:city',
  verifyToken,
  validateSchema(getShopsByCitySchema),
  wrapAsync(getShopsByCity)
);

// get shop by shop id with items
shopRouter.get('/:shopId', verifyToken, validateSchema(shopIdSchema), wrapAsync(getShopById));

export { shopRouter };
