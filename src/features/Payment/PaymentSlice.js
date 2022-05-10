import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import paymentApi from 'api/paymentApi';

export const createVNPayment = createAsyncThunk(
  'payment/VNPayment',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await paymentApi.createVNPayment(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  payment: null,
};
const paymentSlices = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: {
    // createVNPayment
    [createVNPayment.fulfilled]: (state, action) => {
      state.payment = action.payload;
    },
    [createVNPayment.rejected]: (state, action) => {
      state.payment = null;
    },
  },
});
//actions
export const paymentActions = paymentSlices.actions;

//selectors
export const usePaymentSelector = (state) => state.payment;

//reducer
const paymentReducer = paymentSlices.reducer;
export default paymentReducer;
