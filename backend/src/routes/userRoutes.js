import express from 'express';
import { getUser, updateUserLocation } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { wrapAsync } from '../utils/wrapAsync.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { updateCurrentLocationSchema } from '../schemas/userSchema.js';
const userRouter = express.Router();

userRouter.get('/me', verifyToken, wrapAsync(getUser));
userRouter.patch(
  '/location',
  verifyToken,
  validateSchema(updateCurrentLocationSchema),
  wrapAsync(updateUserLocation)
);

export { userRouter };
