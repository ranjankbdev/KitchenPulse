const BASE_URL = import.meta.env.VITE_BASE_URL;

const API_URL = `${BASE_URL}/api/v1`;

// Fetch Cloudinary config from backend
const getCloudinarySignature = async () => {
  const response = await fetch(`${API_URL}/cloudinary/signature`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Failed to fetch Cloudinary configuration');
  }

  // Validate config structure
  if (!data?.cloudName || !data?.apiKey || !data?.signature || !data?.timestamp) {
    throw new Error('Invalid Cloudinary configuration received');
  }

  return data;
};

export { BASE_URL, API_URL, getCloudinarySignature };
