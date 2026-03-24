import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    location: {
      lat: null,
      lon: null,
    },
    address: null,
  },

  reducers: {
    setLocation: (state, action) => {
      const { latitude, longitude } = action.payload;
      state.location.lat = latitude;
      state.location.lon = longitude;
    },
    
    setAddress: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const { setAddress, setLocation } = locationSlice.actions;

export default locationSlice.reducer;
