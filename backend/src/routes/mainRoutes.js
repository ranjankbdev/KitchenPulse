import express from 'express';
import { authRouter } from './authRoutes.js';
import { userRouter } from './userRoutes.js';
import { cloudinaryRouter } from './cloudinaryRoutes.js';

const mainRouter = express.Router();

// auth routes
mainRouter.use('/auth', authRouter);

// user routes
mainRouter.use('/user', userRouter);

// cloudnary routes
mainRouter.use('/cloudinary', cloudinaryRouter);

export { mainRouter };
