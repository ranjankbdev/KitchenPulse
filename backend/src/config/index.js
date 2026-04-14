import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const requiredEnv = [
  'MONGODB_URI',
  'JWT_SECRET_KEY',
  'EMAIL',
  'EMAIL_PASSWORD',
  'RAZORPAY_API_KEY_ID',
  'RAZORPAY_KEY_SECRET',
];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

const Config = {
  mongoUri: process.env.MONGODB_URI,
  secretKey: process.env.JWT_SECRET_KEY,
  port: process.env.PORT || 8080,
  email: process.env.EMAIL,
  emailPassword: process.env.EMAIL_PASSWORD,
  razorpayKeyId: process.env.RAZORPAY_API_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
};

export default Config;
