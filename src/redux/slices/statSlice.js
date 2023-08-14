import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { APICall } from "api/client";
import { toast } from "react-hot-toast";

const initialState = {
  TVL: {
    tvlInAzero: 0,
    tvlInUSD: 0
  }
}; 

export const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTotalValueLocked.fulfilled, (state, action) => {
        state.TVL = action.payload;
    });
}
});

export const {
    setTVL
} = statsSlice.actions;

export default statsSlice.reducer;

export const fetchTotalValueLocked = createAsyncThunk(
    "stats/getTotalValueLocked",
    async () => {
      let data;
  
      const { ret, status, message } = await APICall.getTotalValueLocked();
  
      if (status === "OK") {
        data = ret;
      } else {
        toast.error(message);
      }
  
      return data;
    }
  );
  