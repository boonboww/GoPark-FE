import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getRememberedLogin,
  saveRememberedLogin,
  clearRememberedLogin,
  hasRememberedLogin,
  type RememberedLogin,
} from "@/lib/auth-storage";

interface RememberLoginState {
  rememberedData: RememberedLogin | null;
  isRememberEnabled: boolean;
  hasRemembered: boolean;
}

const initialState: RememberLoginState = {
  rememberedData: null,
  isRememberEnabled: false,
  hasRemembered: false,
};

const rememberLoginSlice = createSlice({
  name: "rememberLogin",
  initialState,
  reducers: {
    loadRemembered: (state) => {
      const data = getRememberedLogin();
      if (data) {
        state.rememberedData = data;
        state.isRememberEnabled = true;
        state.hasRemembered = true;
      } else {
        state.hasRemembered = hasRememberedLogin();
      }
    },
    saveLogin: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      if (state.isRememberEnabled) {
        saveRememberedLogin(action.payload.email, action.payload.password);
        state.rememberedData = action.payload;
        state.hasRemembered = true;
      }
    },
    clearLogin: (state) => {
      clearRememberedLogin();
      state.rememberedData = null;
      state.isRememberEnabled = false;
      state.hasRemembered = false;
    },
    toggleRemember: (state, action: PayloadAction<boolean>) => {
      state.isRememberEnabled = action.payload;
      if (!action.payload && state.rememberedData) {
        clearRememberedLogin();
        state.rememberedData = null;
        state.hasRemembered = false;
      }
    },
  },
});

export const { loadRemembered, saveLogin, clearLogin, toggleRemember } =
  rememberLoginSlice.actions;

export default rememberLoginSlice.reducer;
