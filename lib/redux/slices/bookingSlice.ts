import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Booking {
  id: string;
  parkingLotId: string;
  parkingLotName: string;
  address: string;
  startTime: string;
  endTime: string;
  duration: string;
  price: number;
  status: string;
  licensePlate?: string;
  zone?: string;
  slot?: string;
  paymentMethod?: string;
  qrCode?: string;
}

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  activeTab: "upcoming" | "completed" | "cancelled";
  loading: boolean;
  error: string | null;
  cancellingId: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  activeTab: "upcoming",
  loading: false,
  error: null,
  cancellingId: null,
};

// Async thunks
export const fetchUserBookings = createAsyncThunk(
  "booking/fetchUserBookings",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/bookings/user');
      // return await response.json();
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'POST' });
      // return await response.json();
      return bookingId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.unshift(action.payload);
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    removeBooking: (state, action: PayloadAction<string>) => {
      state.bookings = state.bookings.filter((b) => b.id !== action.payload);
    },
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload;
    },
    setActiveTab: (
      state,
      action: PayloadAction<"upcoming" | "completed" | "cancelled">
    ) => {
      state.activeTab = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch bookings
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Cancel booking
    builder
      .addCase(cancelBooking.pending, (state, action) => {
        state.cancellingId = action.meta.arg;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.cancellingId = null;
        const booking = state.bookings.find((b) => b.id === action.payload);
        if (booking) {
          booking.status = "cancelled";
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.cancellingId = null;
        state.error = action.payload as string;
      });
  },
});

export const {
  setBookings,
  addBooking,
  updateBooking,
  removeBooking,
  setCurrentBooking,
  setActiveTab,
  setLoading,
  setError,
} = bookingSlice.actions;

export default bookingSlice.reducer;
