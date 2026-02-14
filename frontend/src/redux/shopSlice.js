import { createSlice } from "@reduxjs/toolkit";

const shopSlice = createSlice({
  name: "shop",
  initialState: {
    nearbyShops: [],
  },
  reducers: {
    setNearbyShops: (state, action) => {
      state.nearbyShops = action.payload;
    },
    clearNearbyShops: (state) => {
      state.nearbyShops = [];
    },
  },
});

export const { setNearbyShops, clearNearbyShops } = shopSlice.actions;
export default shopSlice.reducer;
