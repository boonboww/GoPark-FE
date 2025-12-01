import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface ParkingLot {
  _id: string;
  name: string;
  address: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  coordinates?: [number, number];
  description?: string;
  zones?: Array<{ zone: string; count: number }>;
  isActive?: boolean;
  pricePerHour?: number;
  avtImage?: string;
  image?: string[];
  allowedPaymentMethods?: string[];
}

interface ParkingFilters {
  name: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  paymentMethod: string;
  sortBy: string;
  nearMe: boolean;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface ParkingState {
  lots: ParkingLot[];
  currentLot: ParkingLot | null;
  filters: ParkingFilters;
  viewMode: "grid" | "list" | "map";
  sortBy: string;
  userLocation: UserLocation | null;
  loading: boolean;
  error: string | null;
}

const initialState: ParkingState = {
  lots: [],
  currentLot: null,
  filters: {
    name: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    paymentMethod: "",
    sortBy: "default",
    nearMe: false,
  },
  viewMode: "grid",
  sortBy: "default",
  userLocation: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchParkingLots = createAsyncThunk(
  "parking/fetchLots",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/parking-lots');
      // return await response.json();
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const parkingSlice = createSlice({
  name: "parking",
  initialState,
  reducers: {
    setLots: (state, action: PayloadAction<ParkingLot[]>) => {
      state.lots = action.payload;
    },
    setCurrentLot: (state, action: PayloadAction<ParkingLot | null>) => {
      state.currentLot = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<ParkingFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list" | "map">) => {
      state.viewMode = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
      state.filters.sortBy = action.payload;
    },
    setUserLocation: (state, action: PayloadAction<UserLocation | null>) => {
      state.userLocation = action.payload;
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
      .addCase(fetchParkingLots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParkingLots.fulfilled, (state, action) => {
        state.loading = false;
        state.lots = action.payload;
      })
      .addCase(fetchParkingLots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLots,
  setCurrentLot,
  updateFilters,
  clearFilters,
  setViewMode,
  setSortBy,
  setUserLocation,
  setLoading,
  setError,
} = parkingSlice.actions;

export default parkingSlice.reducer;
