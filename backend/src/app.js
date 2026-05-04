import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { StatusCodes } from 'http-status-codes';
import { ExpressError } from './utils/ExpressError.js';
import { mainRouter } from './routes/mainRoutes.js';
import Config from './config/index.js';

const app = express();

// trust first proxy
app.set('trust proxy', 1);

// security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// enable CORS so frontend can communicate with backend
app.use(
  cors({
    origin: Config.frontendUrl,
    credentials: true,
  })
);

// middleware to parse JSON request bodies
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// routes
app.use('/api/v1', mainRouter);

// route not found handler
app.use((req, res, next) => {
  next(new ExpressError(StatusCodes.NOT_FOUND, 'Page Not Found'));
});

// global error handler
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Something went wrong!';

  // In production, hide sensitive internal error details
  if (Config.nodeEnv === 'production' && statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    message = 'Internal server error. Please try again later.';
  }
  res.status(statusCode).json({ success: false, message });
});

export default app;
