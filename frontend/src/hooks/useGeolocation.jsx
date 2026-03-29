import { getLocationFromCoordinates } from '../services/locationService.js';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentAddress, setCurrentCity, setCurrentState } from '../redux/userSlice.js';
import { setAddress, setLocation } from '../redux/locationSlice.js';

function useGeolocation() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          dispatch(setLocation({ latitude, longitude }));

          const location = await getLocationFromCoordinates(latitude, longitude);
          if (!location) return;

          dispatch(setCurrentCity(location.city));
          dispatch(setCurrentState(location.state));
          dispatch(setCurrentAddress(location.address));
          dispatch(setAddress(location.address));
        } catch (error) {
          console.log('GeoLocation error:', error);
        }
      },
      (error) => {
        console.log('Geolocation permission error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [dispatch]);
}

export default useGeolocation;
