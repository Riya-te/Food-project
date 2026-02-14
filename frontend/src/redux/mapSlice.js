import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  city: null,
  state: null,
  lat: null,
  lng: null,
  address: null, // ✅ full formatted address
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      const {
        city,
        state: region,
        lat,
        lng,
        address,
      } = action.payload;

      state.city = city || null;
      state.state = region || null;
      state.lat = lat || null;
      state.lng = lng || null;
      state.address = address || null;
    },

    updateAddress: (state, action) => {
      state.address = action.payload;
    },

    clearLocation: (state) => {
      state.city = null;
      state.state = null;
      state.lat = null;
      state.lng = null;
      state.address = null;
    },
  },
});

export const {
  setLocation,
  updateAddress,
  clearLocation,
} = mapSlice.actions;

export default mapSlice.reducer;
