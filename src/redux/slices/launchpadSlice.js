import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { APICall } from "api/client";
import { toast } from "react-hot-toast";

const initialState = {
  loading: false,
  launchpads: null,
  total: 0,
};

export const launchpadsSlice = createSlice({
  name: "launchpad",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLaunchpads.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLaunchpads.fulfilled, (state, action) => {
      state.launchpads = action.payload?.dataArray?.map((e) => ({
        ...e,
        projectInfo: JSON.parse(e?.projectInfo),
      }));
      state.total = action.payload?.total;
      state.loading = false;
    });
    builder.addCase(fetchLaunchpads.rejected, (state, action) => {
      state.loading = false;
      toast.error("Failed to fetch launchpads");
    });
  },
});

export const fetchLaunchpads = createAsyncThunk(
  "launchpad/fetchLaunchpads",
  async (params, thunkAPI) => {
    const { ret, status, message } = await APICall.getLaunchpad(params);

    if (status === "OK") {
      return ret;
    } else {
      throw new Error(message);
    }
  }
);

export default launchpadsSlice.reducer;
