import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface BookingData {
  parkingLotId: string;
  parkingLotName: string;
  startTime: string;
  endTime: string;
  duration: string;
  price: number;
  licensePlate?: string;
  zone?: string;
  slot?: string;
}

interface PaymentState {
  step: 1 | 2 | 3;
  bookingData: BookingData | null;
  invoiceNumber: string | null;
  paymentMethod: string;
  loading: boolean;
  error: string | null;
  paymentStatus: "idle" | "processing" | "success" | "failed";
}

const initialState: PaymentState = {
  step: 1,
  bookingData: null,
  invoiceNumber: null,
  paymentMethod: "credit_card",
  loading: false,
  error: null,
  paymentStatus: "idle",
};

// Async thunks
export const processPayment = createAsyncThunk(
  "payment/process",
  async (paymentData: any, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/payments/process', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(paymentData),
      // });
      // return await response.json();

      // Mock response
      return {
        success: true,
        invoiceNumber: "INV-" + Date.now(),
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (invoiceNumber: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      return {
        verified: true,
        invoiceNumber,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<1 | 2 | 3>) => {
      state.step = action.payload;
    },
    nextStep: (state) => {
      if (state.step < 3) {
        state.step = (state.step + 1) as 1 | 2 | 3;
      }
    },
    previousStep: (state) => {
      if (state.step > 1) {
        state.step = (state.step - 1) as 1 | 2 | 3;
      }
    },
    setBookingData: (state, action: PayloadAction<BookingData | null>) => {
      state.bookingData = action.payload;
    },
    setInvoiceNumber: (state, action: PayloadAction<string | null>) => {
      state.invoiceNumber = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
    },
    resetPayment: (state) => {
      state.step = 1;
      state.bookingData = null;
      state.invoiceNumber = null;
      state.paymentMethod = "credit_card";
      state.error = null;
      state.paymentStatus = "idle";
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Process payment
    builder
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentStatus = "processing";
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = "success";
        state.invoiceNumber = action.payload.invoiceNumber;
        state.step = 3;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.paymentStatus = "failed";
        state.error = action.payload as string;
      });

    // Verify payment
    builder
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceNumber = action.payload.invoiceNumber;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setStep,
  nextStep,
  previousStep,
  setBookingData,
  setInvoiceNumber,
  setPaymentMethod,
  resetPayment,
  setLoading,
  setError,
} = paymentSlice.actions;

export default paymentSlice.reducer;
