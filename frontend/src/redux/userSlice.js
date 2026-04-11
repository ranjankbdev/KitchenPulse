import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    currentLat: null,
    currentLon: null,
    shopsInMyCity: null,
    itemsInMyCity: null,
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setCurrentLat: (state, action) => {
      state.currentLat = action.payload;
    },
    setCurrentLon: (state, action) => {
      state.currentLon = action.payload;
    },
    setShopsInMyCity: (state, action) => {
      state.shopsInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
  },
});

export const {
  setUserData,
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
  setCurrentLat,
  setCurrentLon,
  setShopsInMyCity,
  setItemsInMyCity,
} = userSlice.actions;
export default userSlice.reducer;
