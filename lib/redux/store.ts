import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slices/chatSlice";
import authReducer from "./slices/authSlice";
import rememberLoginReducer from "./slices/rememberLoginSlice";
import userReducer from "./slices/userSlice";
import parkingReducer from "./slices/parkingSlice";
import bookingReducer from "./slices/bookingSlice";
import searchReducer from "./slices/searchSlice";
import uiReducer from "./slices/uiSlice";
import adminReducer from "./slices/adminSlice";
import ownerReducer from "./slices/ownerSlice";
import paymentReducer from "./slices/paymentSlice";
import notificationReducer from "./slices/notificationSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      chat: chatReducer,
      auth: authReducer,
      rememberLogin: rememberLoginReducer,
      user: userReducer,
      parking: parkingReducer,
      booking: bookingReducer,
      search: searchReducer,
      ui: uiReducer,
      admin: adminReducer,
      owner: ownerReducer,
      payment: paymentReducer,
      notification: notificationReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
