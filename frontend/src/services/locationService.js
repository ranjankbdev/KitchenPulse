import axios from 'axios';
const apiKey = import.meta.env.VITE_GEOAPIKEY;

const getLocationFromCoordinates = async (lat, lon) => {
  const { data } = await axios.get(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`
  );

  if (!data.results || data.results.length === 0) {
    return null;
  }

  const location = data.results[0];
  const block = location.county || location.city || location.town || '';
  const district = location.state_district || '';
  const state = location.state || '';
  const country = location.country || '';

  return {
    city: block,
    state,
    address: `${block}, ${district}, ${state}, ${country}`,
  };
};

const getCoordinatesFromLocation = async (address) => {
  const { data } = await axios.get(
    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`
  );

  if (!data.features || data.features.length === 0) {
    return null;
  }

  const { lat, lon } = data.features[0].properties;
  return { lat, lon };
};

export { getLocationFromCoordinates, getCoordinatesFromLocation };
