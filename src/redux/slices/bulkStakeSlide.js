import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  action: null,
  listNFTStake: [],
  unstakeFee: 0
};

export const bulkStakeSlice = createSlice({
  name: "bulkStake",
  initialState,
  reducers: {
    updateSelectedMultiStake: (state, action) => {
      const nftData = action.payload;
      if (state.action != nftData.action) {
        state.action = nftData.action;
        state.listNFTStake = [nftData.data];
      } else {
        const nftExistedIndex = state.listNFTStake
          .map((e) => e.tokenID)
          .indexOf(nftData.data.tokenID);
        if (nftExistedIndex === -1) {
          state.listNFTStake = [...state.listNFTStake, nftData.data];
        } else {
          state.listNFTStake.splice(nftExistedIndex, 1);
        }
      }
      //   state.listNFTStake = [...state.listNFTStake, action.payload];
    },
    closeBulkDialog: (state, action) => {
      state.action = null;
      state.listNFTStake = [];
    },
    updateUnstakeFee: (state, action) => {
      state.unstakeFee = action.payload
    },
  },
});

export const { updateSelectedMultiStake, closeBulkDialog, updateUnstakeFee } =
  bulkStakeSlice.actions;

export default bulkStakeSlice.reducer;
