import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetUserPassword,
  googleAuth,
} from '../controllers/authControllers.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import {
  registerSchema,
  loginSchema,
  sendPasswordResetOtpSchema,
  verifyPasswordResetOtpSchema,
  resetUserPasswordSchema,
  googleAuthSchema,
} from '../schemas/authSchema.js';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // only 10 requests per 15 minutes
  message: 'Too many requests, please try again later',
});

const authRouter = express.Router();

authRouter.post('/register', authLimiter, validateSchema(registerSchema), wrapAsync(registerUser));
authRouter.post('/login', authLimiter, validateSchema(loginSchema), wrapAsync(loginUser));
authRouter.post('/logout', wrapAsync(logoutUser));
authRouter.post(
  '/password-reset/otp',
  authLimiter,
  validateSchema(sendPasswordResetOtpSchema),
  wrapAsync(sendPasswordResetOtp)
);
authRouter.post(
  '/password-reset/verify',
  authLimiter,
  validateSchema(verifyPasswordResetOtpSchema),
  wrapAsync(verifyPasswordResetOtp)
);
authRouter.post(
  '/password-reset',
  authLimiter,
  validateSchema(resetUserPasswordSchema),
  wrapAsync(resetUserPassword)
);
authRouter.post('/google-auth', validateSchema(googleAuthSchema), wrapAsync(googleAuth));

export { authRouter };
