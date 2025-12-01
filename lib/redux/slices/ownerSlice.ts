import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Customer {
  id: string;
  userName: string;
  email: string;
  phoneNumber?: string;
}

interface Vehicle {
  id: string;
  licensePlate: string;
  type: string;
  owner?: string;
  status?: string;
}

interface Ticket {
  id: string;
  licensePlate: string;
  customer: string;
  type: string;
  price: number;
  floor: string;
  expiry: string;
}

interface ParkingLot {
  _id: string;
  name: string;
  address: string;
  zones?: Array<{ zone: string; count: number }>;
}

interface OwnerStats {
  totalLots: number;
  totalSlots: number;
  occupiedSlots: number;
  revenue: number;
  todayBookings: number;
  activeCustomers: number;
}

interface OwnerState {
  parkingLots: ParkingLot[];
  currentLot: ParkingLot | null;
  vehicles: Vehicle[];
  customers: Customer[];
  tickets: Ticket[];
  reports: any[];
  stats: OwnerStats;
  selectedFloor: number;
  loading: boolean;
  error: string | null;
}

const initialState: OwnerState = {
  parkingLots: [],
  currentLot: null,
  vehicles: [],
  customers: [],
  tickets: [],
  reports: [],
  stats: {
    totalLots: 0,
    totalSlots: 0,
    occupiedSlots: 0,
    revenue: 0,
    todayBookings: 0,
    activeCustomers: 0,
  },
  selectedFloor: 1,
  loading: false,
  error: null,
};

// Async thunks
export const fetchOwnerDashboard = createAsyncThunk(
  "owner/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API calls
      return {
        parkingLots: [],
        customers: [],
        vehicles: [],
        tickets: [],
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    setParkingLots: (state, action: PayloadAction<ParkingLot[]>) => {
      state.parkingLots = action.payload;
      state.stats.totalLots = action.payload.length;
    },
    setCurrentLot: (state, action: PayloadAction<ParkingLot | null>) => {
      state.currentLot = action.payload;
    },
    addParkingLot: (state, action: PayloadAction<ParkingLot>) => {
      state.parkingLots.push(action.payload);
      state.stats.totalLots++;
    },
    updateParkingLot: (state, action: PayloadAction<ParkingLot>) => {
      const index = state.parkingLots.findIndex(
        (lot) => lot._id === action.payload._id
      );
      if (index !== -1) {
        state.parkingLots[index] = action.payload;
      }
    },
    removeParkingLot: (state, action: PayloadAction<string>) => {
      state.parkingLots = state.parkingLots.filter(
        (lot) => lot._id !== action.payload
      );
      state.stats.totalLots = Math.max(0, state.stats.totalLots - 1);
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
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload;
      state.stats.activeCustomers = action.payload.length;
    },
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
    },
    setReports: (state, action: PayloadAction<any[]>) => {
      state.reports = action.payload;
    },
    setStats: (state, action: PayloadAction<Partial<OwnerStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setSelectedFloor: (state, action: PayloadAction<number>) => {
      state.selectedFloor = action.payload;
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
      .addCase(fetchOwnerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.parkingLots = action.payload.parkingLots;
        state.customers = action.payload.customers;
        state.vehicles = action.payload.vehicles;
        state.tickets = action.payload.tickets;
      })
      .addCase(fetchOwnerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setParkingLots,
  setCurrentLot,
  addParkingLot,
  updateParkingLot,
  removeParkingLot,
  setVehicles,
  addVehicle,
  removeVehicle,
  setCustomers,
  setTickets,
  setReports,
  setStats,
  setSelectedFloor,
  setLoading,
  setError,
} = ownerSlice.actions;

export default ownerSlice.reducer;
