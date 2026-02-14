import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./userSlice";
import ownerReducer from "./ownerSlice";
import shopReducer from "./shopSlice";
import mapReducer from "./mapSlice"; // ✅ rename to reducer

/* ================= USER PERSIST CONFIG ================= */

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["userData", "profileComplete"], 
};

/* ================= MAP PERSIST CONFIG ================= */

const mapPersistConfig = {
  key: "map",
  storage,
  whitelist: ["city", "state", "lat", "lng"],
};

const persistedUserReducer = persistReducer(
  userPersistConfig,
  userReducer
);

const persistedMapReducer = persistReducer(
  mapPersistConfig,
  mapReducer
);

/* ================= STORE ================= */

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    owner: ownerReducer,
    shop: shopReducer,
    map: persistedMapReducer, // ✅ added here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

/* ================= PERSISTOR ================= */

export const persistor = persistStore(store);
