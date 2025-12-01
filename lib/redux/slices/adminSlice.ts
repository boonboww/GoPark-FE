import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface AdminStats {
  totalUsers: number;
  userChangePercent: number;
  totalParkingLots: number;
  newParkingLotsThisMonth: number;
  todayBookings: number;
  bookingChangePercent: number;
  thisMonthRevenue: number;
  revenueChangePercent: number;
  pendingApprovals: number;
  activeBookings: number;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  user: string;
  time: string;
  status: "success" | "warning" | "error";
}

interface SystemStatus {
  apiService: { status: string; message: string };
  database: { status: string; message: string };
  paymentGateway: { status: string; message: string };
  notification: { status: string; message: string };
}

interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
  status: string;
}

interface AdminState {
  stats: AdminStats | null;
  activities: Activity[];
  systemStatus: SystemStatus | null;
  users: User[];
  parkingLots: any[];
  bookings: any[];
  accounts: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  activities: [],
  systemStatus: null,
  users: [],
  parkingLots: [],
  bookings: [],
  accounts: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API calls
      return {
        stats: null,
        activities: [],
        systemStatus: null,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<AdminStats | null>) => {
      state.stats = action.payload;
    },
    setActivities: (state, action: PayloadAction<Activity[]>) => {
      state.activities = action.payload;
    },
    setSystemStatus: (state, action: PayloadAction<SystemStatus | null>) => {
      state.systemStatus = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setParkingLots: (state, action: PayloadAction<any[]>) => {
      state.parkingLots = action.payload;
    },
    setBookings: (state, action: PayloadAction<any[]>) => {
      state.bookings = action.payload;
    },
    setAccounts: (state, action: PayloadAction<any[]>) => {
      state.accounts = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.activities = action.payload.activities;
        state.systemStatus = action.payload.systemStatus;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setStats,
  setActivities,
  setSystemStatus,
  setUsers,
  setParkingLots,
  setBookings,
  setAccounts,
  setLoading,
  setError,
} = adminSlice.actions;

export default adminSlice.reducer;
