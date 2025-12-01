import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  modals: {
    [key: string]: boolean;
  };
  dialogs: {
    [key: string]: boolean;
  };
  sidebars: {
    owner: boolean;
    admin: boolean;
    main: boolean;
  };
  theme: "light" | "dark";
}

const initialState: UIState = {
  modals: {},
  dialogs: {},
  sidebars: {
    owner: false,
    admin: false,
    main: false,
  },
  theme: "light",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false;
    },
    toggleModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = !state.modals[action.payload];
    },
    openDialog: (state, action: PayloadAction<string>) => {
      state.dialogs[action.payload] = true;
    },
    closeDialog: (state, action: PayloadAction<string>) => {
      state.dialogs[action.payload] = false;
    },
    toggleDialog: (state, action: PayloadAction<string>) => {
      state.dialogs[action.payload] = !state.dialogs[action.payload];
    },
    toggleSidebar: (
      state,
      action: PayloadAction<"owner" | "admin" | "main">
    ) => {
      state.sidebars[action.payload] = !state.sidebars[action.payload];
    },
    setSidebarOpen: (
      state,
      action: PayloadAction<{ key: "owner" | "admin" | "main"; open: boolean }>
    ) => {
      state.sidebars[action.payload.key] = action.payload.open;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const {
  openModal,
  closeModal,
  toggleModal,
  openDialog,
  closeDialog,
  toggleDialog,
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
