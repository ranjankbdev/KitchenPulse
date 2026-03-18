import { StatusCodes } from 'http-status-codes';
import { ExpressError } from '../utils/ExpressError.js';
import crypto from 'crypto';
import CloudinaryConfig from '../config/cloudinary.js';

const { cloudName, apiKey, apiSecret } = CloudinaryConfig;

const generateUploadSignature = async (req, res) => {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new ExpressError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Cloudinary configuration is not properly set up'
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = crypto
    .createHash('sha1')
    .update(`timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  res.status(StatusCodes.OK).json({ cloudName, apiKey, timestamp, signature });
};

export { generateUploadSignature };
