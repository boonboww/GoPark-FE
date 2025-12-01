import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  settings: NotificationSettings;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  settings: {
    email: true,
    push: true,
    sms: false,
  },
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<AppNotification, "id" | "read" | "timestamp">>
    ) => {
      const notification: AppNotification = {
        ...action.payload,
        id: Date.now().toString(),
        read: false,
        timestamp: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
      state.unreadCount++;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => (n.read = true));
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearAll: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    updateSettings: (
      state,
      action: PayloadAction<Partial<NotificationSettings>>
    ) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setNotifications: (state, action: PayloadAction<AppNotification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAll,
  updateSettings,
  setNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
