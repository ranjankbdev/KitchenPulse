import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import {
  createItemSchema,
  updateItemSchema,
  itemIdSchema,
  getItemsByCitySchema,
  searchItemsSchema,
} from '../schemas/itemSchema.js';
import {
  createItem,
  updateItem,
  getItemById,
  deleteItemById,
  getItemsByCity,
  searchItems,
} from '../controllers/itemController.js';

const itemRouter = express.Router();

// get items by city
itemRouter.get(
  '/city/:city',
  verifyToken,
  validateSchema(getItemsByCitySchema),
  wrapAsync(getItemsByCity)
);

// search items
itemRouter.get(
  '/search/:city',
  verifyToken,
  validateSchema(searchItemsSchema),
  wrapAsync(searchItems)
);

// create item
itemRouter.post('/', verifyToken, validateSchema(createItemSchema), wrapAsync(createItem));

// update item
itemRouter.patch('/:itemId', verifyToken, validateSchema(updateItemSchema), wrapAsync(updateItem));

// get item
itemRouter.get('/:itemId', verifyToken, validateSchema(itemIdSchema), wrapAsync(getItemById));

// delete item
itemRouter.delete('/:itemId', verifyToken, validateSchema(itemIdSchema), wrapAsync(deleteItemById));

export { itemRouter };
