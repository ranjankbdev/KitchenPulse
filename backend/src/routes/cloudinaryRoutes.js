import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { wrapAsync } from '../utils/wrapAsync.js';
import { generateUploadSignature } from '../controllers/cloudinaryController.js';

const cloudinaryRouter = express.Router();

cloudinaryRouter.post('/signature', verifyToken, wrapAsync(generateUploadSignature));

export { cloudinaryRouter };
