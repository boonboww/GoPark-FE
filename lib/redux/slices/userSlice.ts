import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Vehicle {
  id: string;
  licensePlate: string;
  type: string;
  owner?: string;
  status?: string;
}

interface UserProfile {
  id: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
}

interface UserPreferences {
  notifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  shareLocation: boolean;
  twoFA: boolean;
}

interface UserState {
  profile: UserProfile | null;
  vehicles: Vehicle[];
  preferences: UserPreferences;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  vehicles: [],
  preferences: {
    notifications: true,
    emailNotifications: true,
    smsNotifications: false,
    shareLocation: true,
    twoFA: false,
  },
  loading: false,
  error: null,
};

// Async thunks would go here for API calls
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/users/me');
      // return await response.json();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.vehicles = action.payload;
    },
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.vehicles.push(action.payload);
    },
    removeVehicle: (state, action: PayloadAction<string>) => {
      state.vehicles = state.vehicles.filter((v) => v.id !== action.payload);
    },
    updateVehicle: (state, action: PayloadAction<Vehicle>) => {
      const index = state.vehicles.findIndex((v) => v.id === action.payload.id);
      if (index !== -1) {
        state.vehicles[index] = action.payload;
      }
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<UserPreferences>>
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProfile,
  updateProfile,
  setVehicles,
  addVehicle,
  removeVehicle,
  updateVehicle,
  updatePreferences,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
