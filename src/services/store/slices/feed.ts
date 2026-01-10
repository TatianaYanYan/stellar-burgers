import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../../utils/burger-api';
import { TOrder } from '../../../utils/types';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  orderData: TOrder | null;
  isLoading: boolean;
  isError: boolean;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  orderData: null,
  isLoading: false,
  isError: false
};

export const getFeeds = createAsyncThunk('feed/getFeeds', async () => {
  const data = await getFeedsApi();
  return data;
});

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  }
});

export const { clearOrderData } = feedSlice.actions;
export default feedSlice.reducer;
