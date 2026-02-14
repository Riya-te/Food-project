import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    shop: null,          // owner shop
    items: [],           // food items
    orders: [],          // incoming orders
    loading: false,      // general loading
    error: null,
  },

  reducers: {
    /* ================= SHOP ================= */
    setShop: (state, action) => {
      state.shop = action.payload;
      state.error = null;
    },

    clearShop: (state) => {
      state.shop = null;
    },

    /* ================= ITEMS ================= */
    setItems: (state, action) => {
      state.items = action.payload;
    },

    addItem: (state, action) => {
      state.items.unshift(action.payload);
    },

    updateItem: (state, action) => {
      const index = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
    },

    /* ================= ORDERS ================= */
    setOrders: (state, action) => {
      state.orders = action.payload;
    },

    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },

    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(
        (o) => o._id === orderId
      );
      if (order) {
        order.status = status;
      }
    },

    /* ================= STATE ================= */
    setOwnerLoading: (state, action) => {
      state.loading = action.payload;
    },

    setOwnerError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearOwnerState: (state) => {
      state.shop = null;
      state.items = [];
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setShop,
  clearShop,
  setItems,
  addItem,
  updateItem,
  removeItem,
  setOrders,
  addOrder,
  updateOrderStatus,
  setOwnerLoading,
  setOwnerError,
  clearOwnerState,
} = ownerSlice.actions;

export default ownerSlice.reducer;
