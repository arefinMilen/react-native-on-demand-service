import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingState {
  currentBooking: any | null;
  assignedProvider: any | null;
  providerLocation: { latitude: number; longitude: number } | null;
  status: 'IDLE' | 'SEARCHING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED';
}

const initialState: BookingState = {
  currentBooking: null,
  assignedProvider: null,
  providerLocation: null,
  status: 'IDLE',
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentBooking: (state, action: PayloadAction<any>) => {
      state.currentBooking = action.payload;
      state.status = 'SEARCHING';
    },
    setAssignedProvider: (
      state,
      action: PayloadAction<{ booking: any; provider: any }>
    ) => {
      state.currentBooking = action.payload.booking;
      state.assignedProvider = action.payload.provider;
      state.status = 'ACCEPTED';
    },
    updateProviderLiveLocation: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>
    ) => {
      state.providerLocation = action.payload;
    },
    resetBooking: (state) => {
      state.currentBooking = null;
      state.assignedProvider = null;
      state.providerLocation = null;
      state.status = 'IDLE';
    },
  },
});

export const {
  setCurrentBooking,
  setAssignedProvider,
  updateProviderLiveLocation,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
