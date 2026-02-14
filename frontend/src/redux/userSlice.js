import { createSlice } from "@reduxjs/toolkit";

/* ================= CART PERSISTENCE ================= */

const initialCart = JSON.parse(
  localStorage.getItem("cartItems") || "[]"
);

const saveCart = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    profileComplete: false,
    authChecked: false,

    // location
    city: localStorage.getItem("city") || null,
    state: localStorage.getItem("state") || null,
    lat: null,
    lng: null,

    // 🛒 persisted cart
    cartItems: initialCart,
  },

  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload.user;
      state.profileComplete = action.payload.profileComplete;
      state.authChecked = true;
    },

    clearUser: (state) => {
      state.userData = null;
      state.profileComplete = false;
      state.authChecked = true;

      state.cartItems = [];
      localStorage.removeItem("cartItems"); // ✅ important
    },

    setLocation: (state, action) => {
      const { city, state: region, lat, lng } = action.payload;
      state.city = city;
      state.state = region;
      state.lat = lat;
      state.lng = lng;

      if (city) localStorage.setItem("city", city);
      if (region) localStorage.setItem("state", region);
    },

    /* ================= CART ACTIONS ================= */

    addToCart: (state, action) => {
      const item = action.payload;

      const existingItem = state.cartItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          shop: item.shop,
          foodType: item.foodType,
          quantity: 1,
        });
      }

      saveCart(state.cartItems); // ✅ persist
    },

    increaseQty: (state, action) => {
      const item = state.cartItems.find(
        (i) => i.id === action.payload
      );
      if (item) {
        item.quantity += 1;
        saveCart(state.cartItems); // ✅
      }
    },

    decreaseQty: (state, action) => {
      const item = state.cartItems.find(
        (i) => i.id === action.payload
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCart(state.cartItems); // ✅
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );

      saveCart(state.cartItems); // ✅
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems"); // ✅
    },
  },
});

export const {
  setUser,
  clearUser,
  setLocation,
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} = userSlice.actions;

export default userSlice.reducer;
