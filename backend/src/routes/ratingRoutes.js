import express from 'express';
import { validateSchema } from '../middlewares/validateSchema.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { wrapAsync } from '../utils/wrapAsync.js';
import { rateItem } from '../controllers/ratingController.js';
import { rateItemSchema } from '../schemas/ratingSchema.js';

const ratingRouter = express.Router();

// rating to item after order delivered
ratingRouter.post('/', verifyToken, validateSchema(rateItemSchema), wrapAsync(rateItem));

export default ratingRouter;
