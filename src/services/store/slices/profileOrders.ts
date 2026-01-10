import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../../utils/burger-api';
import { TOrder } from '../../../utils/types';

export type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  isError: boolean;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  isError: false
};

export const getProfileOrders = createAsyncThunk(
  'profileOrders/getProfileOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getProfileOrders.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  }
});

export default profileOrdersSlice.reducer;
