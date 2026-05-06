import axios from 'axios';
import { getCloudinarySignature } from '../config/config.js';

// upload picture to Cloudinary
const uploadImage = async (file) => {
  // Fetch config from backend
  const { cloudName, cloudApiKey, timestamp, signature } = await getCloudinarySignature();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', cloudApiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData
  );
  return res.data.secure_url;
};

export { uploadImage };
