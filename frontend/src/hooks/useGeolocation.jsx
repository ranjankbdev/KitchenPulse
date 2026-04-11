import { useEffect, useRef } from 'react';
import { getLocationFromCoordinates } from '../services/locationService.js';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentLat,
  setCurrentLon,
  setCurrentState,
} from '../redux/userSlice.js';
import { updateUserLocationAPI } from '../services/userService.js';

const DISTANCE_THRESHOLD_METERS = 500; // minimum movement to trigger update

// calculate distance between two coordinates (meters)
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function useGeolocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const lastSavedPosition = useRef(null);
  const lastSavedTime = useRef(null);
  const watchId = useRef(null);
  const THROTTLE_MS = useRef(null);

  // set throttle only for delivery partner
  useEffect(() => {
    THROTTLE_MS.current = userData?.role === 'deliveryPartner' ? 30000 : null;
  }, [userData]);

  // save location to backend + redux
  const saveLocation = async (latitude, longitude) => {
    try {
      await updateUserLocationAPI({ latitude, longitude });

      // reverse geocode
      const location = await getLocationFromCoordinates(latitude, longitude);
      if (!location) return;

      dispatch(setCurrentLat(latitude));
      dispatch(setCurrentLon(longitude));
      dispatch(setCurrentCity(location.city));
      dispatch(setCurrentState(location.state));
      dispatch(setCurrentAddress(location.address));

      lastSavedPosition.current = { latitude, longitude };
      lastSavedTime.current = Date.now();
    } catch (error) {
      console.log('Location save error:', error);
    }
  };

  // called every time position changes
  const handlePosition = async (position) => {
    const { latitude, longitude } = position.coords;

    // First position — always save
    if (!lastSavedPosition.current) {
      await saveLocation(latitude, longitude);
      return;
    }

    const { latitude: lastLat, longitude: lastLon } = lastSavedPosition.current;
    // calculate movement distance
    const distance = getDistanceInMeters(lastLat, lastLon, latitude, longitude);

    if (distance < DISTANCE_THRESHOLD_METERS) return;

    // Throttle check for deliveryPartner
    if (THROTTLE_MS.current && lastSavedTime.current) {
      const elapsed = Date.now() - lastSavedTime.current;
      if (elapsed < THROTTLE_MS.current) return;
    }

    await saveLocation(latitude, longitude);
  };

  useEffect(() => {
    if (!userData) return;
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      return;
    }

    // start watching position
    watchId.current = navigator.geolocation.watchPosition(
      handlePosition,
      (error) => console.log('Geolocation error:', error),
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
    );

    // cleanup on unmount
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [userData]);
}

export default useGeolocation;
