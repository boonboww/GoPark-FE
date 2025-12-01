import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  type?: string;
  bookingData?: any;
  action?: string;
}

interface ChatState {
  isChatOpen: boolean;
  messages: Message[];
  isTyping: boolean;
  isDarkMode: boolean;
}

const initialState: ChatState = {
  isChatOpen: false,
  messages: [],
  isTyping: false,
  isDarkMode: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    openChat: (state) => {
      state.isChatOpen = true;
    },
    closeChat: (state) => {
      state.isChatOpen = false;
    },
    toggleChat: (state) => {
      state.isChatOpen = !state.isChatOpen;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const {
  openChat,
  closeChat,
  toggleChat,
  addMessage,
  clearMessages,
  setTyping,
  toggleDarkMode,
  setDarkMode,
} = chatSlice.actions;

export default chatSlice.reducer;
