import express from 'express';
import { authRouter } from './authRoutes.js';
import { userRouter } from './userRoutes.js';
import { shopRouter } from './shopRoutes.js';
import { itemRouter } from './itemRoutes.js';
import { cloudinaryRouter } from './cloudinaryRoutes.js';

const mainRouter = express.Router();

// auth routes
mainRouter.use('/auth', authRouter);

// user routes
mainRouter.use('/user', userRouter);

// shop routes
mainRouter.use('/shop', shopRouter);

// item routes
mainRouter.use('/item', itemRouter);

// cloudnary routes
mainRouter.use('/cloudinary', cloudinaryRouter);

export { mainRouter };
