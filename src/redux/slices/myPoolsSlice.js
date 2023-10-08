import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { APICall } from "api/client";
import { toast } from "react-hot-toast";

const initialState = {
  loading: false,
  myStakingPoolsList: null,
  myNFTPoolsList: null,
  myTokenPoolsList: null,
};

export const myPoolsSlice = createSlice({
  name: "myPools",
  initialState,
  reducers: {
    logOutMyPools: (state) => {
      state.loading = false;
      state.myStakingPoolsList = null;
      state.myNFTPoolsList = null;
      state.myTokenPoolsList = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyStakingPools.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMyStakingPools.fulfilled, (state, action) => {
      state.myStakingPoolsList = action.payload;
      state.loading = false;
    });

    builder.addCase(fetchMyNFTPools.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMyNFTPools.fulfilled, (state, action) => {
      state.myNFTPoolsList = action.payload;
      state.loading = false;
    });

    builder.addCase(fetchMyTokenPools.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMyTokenPools.fulfilled, (state, action) => {
      state.myTokenPoolsList = action.payload;
      state.loading = false;
    });
  },
});

export const { logOutMyPools } = myPoolsSlice.actions;

export default myPoolsSlice.reducer;

export const fetchMyStakingPools = createAsyncThunk(
  "myPools/fetchMyStakingPools",
  async ({ currentAccount }, thunkAPI) => {
    let data = [];

    const { ret, status, message } = await APICall.getStakingPoolsListByOwner({
      owner: currentAccount?.address,
    });
    
    if (status === "OK") {
      data = ret;
    } else {
      toast.error(message);
    }

    return data;
  }
);

export const fetchMyNFTPools = createAsyncThunk(
  "myPools/fetchMyNFTPools",
  async ({ currentAccount }, thunkAPI) => {
    let data = [];

    const { ret, status, message } = await APICall.getNFTPoolsListByOwner({
      owner: currentAccount?.address,
    });

    if (status === "OK") {
      const nftLPListAddNftInfo = await Promise.all(
        ret?.map(async (nftLP) => {
          // get collection info
          const { ret } = await APICall.getCollectionByAddressFromArtZero({
            collection_address: nftLP?.NFTtokenContract,
          });

          if (ret[0]) {
            nftLP = { ...nftLP, nftInfo: ret[0] };
          }

          return nftLP;
        })
      );
      data = nftLPListAddNftInfo;
    } else {
      toast.error(message);
    }

    return data;
  }
);

export const fetchMyTokenPools = createAsyncThunk(
  "myPools/fetchMyTokenPools",
  async ({ currentAccount }, thunkAPI) => {
    let data = [];

    const { ret, status, message } = await APICall.getTokenLPListByOwner({
      owner: currentAccount?.address,
    });

    if (status === "OK") {
      data = ret;
    } else {
      toast.error(message);
    }

    return data;
  }
);
