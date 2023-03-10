import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { APICall } from "api/client";
import { toast } from "react-hot-toast";
import { formatChainStringToNumber } from "utils";
import { execContractQuery } from "utils/contracts";
import lp_pool_contract from "utils/contracts/lp_pool_contract";
import nft_pool_contract from "utils/contracts/nft_pool_contract";
import pool_contract from "utils/contracts/pool_contract";

const initialState = {
  loading: false,
  allTokensList: null,
  allStakingPoolsList: null,
  allNFTPoolsList: null,
  allTokenPoolsList: null,
};

export const allPoolsSlice = createSlice({
  name: "allPools",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllTokensList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllTokensList.fulfilled, (state, action) => {
      state.allTokensList = action.payload;
      state.loading = false;
    });

    builder.addCase(fetchAllStakingPools.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllStakingPools.fulfilled, (state, action) => {
      state.allStakingPoolsList = action.payload;
      state.loading = false;
    });

    builder.addCase(fetchAllNFTPools.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllNFTPools.fulfilled, (state, action) => {
      state.allNFTPoolsList = action.payload;
      state.loading = false;
    });

    builder.addCase(fetchAllTokenPools.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllTokenPools.fulfilled, (state, action) => {
      state.allTokenPoolsList = action.payload;
      state.loading = false;
    });
  },
});

// export const {} = allPoolsSlice.actions;

export default allPoolsSlice.reducer;

export const fetchAllTokensList = createAsyncThunk(
  "allPools/fetchAllTokensList",
  async (params, thunkAPI) => {
    let data = [];

    const { ret, status, message } = await APICall.getTokensList({ ...params });

    if (status === "OK") {
      data = ret;
    } else {
      toast.error(message);
    }

    return data;
  }
);

export const fetchAllStakingPools = createAsyncThunk(
  "allPools/fetchAllStakingPools",
  async (params, thunkAPI) => {
    let data = [];

    const { ret, status, message } = await APICall.getStakingPoolsList({
      ...params,
    });

    if (status === "OK") {
      const poolsListAddMyStake = await Promise.all(
        ret?.map(async (pool) => {
          let queryResult = await execContractQuery(
            params?.currentAccount?.address,
            "api",
            pool_contract.CONTRACT_ABI,
            pool?.poolContract,
            0,
            "genericPoolContractTrait::getStakeInfo",
            params?.currentAccount?.address
          );
          let stakeInfo = queryResult?.toHuman().Ok;

          if (stakeInfo) {
            stakeInfo = {
              ...stakeInfo,
              lastRewardUpdate: formatChainStringToNumber(
                stakeInfo.lastRewardUpdate
              ),
              stakedValue: formatChainStringToNumber(stakeInfo.stakedValue),
              unclaimedReward: formatChainStringToNumber(
                stakeInfo.unclaimedReward
              ),
            };
          }

          return { ...pool, stakeInfo };
        })
      );

      data = poolsListAddMyStake;
    } else {
      toast.error(message);
    }

    return data;
  }
);

export const fetchAllNFTPools = createAsyncThunk(
  "allPools/fetchAllNFTPools",
  async (params, thunkAPI) => {
    let data = [];

    const { ret, status, message } = await APICall.getNFTLPList({ ...params });

    if (status === "OK") {
      const nftLPListAddNftInfo = await Promise.all(
        ret?.map(async (nftLP) => {
          // get collection info
          const { ret, status } =
            await APICall.getCollectionByAddressFromArtZero({
              collection_address: nftLP?.NFTtokenContract,
            });

          if (status === "OK") {
            nftLP = { ...nftLP, nftInfo: ret[0] };
          }

          // get stake info NFT LP Pool
          let queryResult = await execContractQuery(
            params?.currentAccount?.address,
            "api",
            nft_pool_contract.CONTRACT_ABI,
            nftLP?.poolContract,
            0,
            "genericPoolContractTrait::getStakeInfo",
            params?.currentAccount?.address
          );

          let stakeInfo = queryResult?.toHuman().Ok;

          if (stakeInfo) {
            stakeInfo = {
              ...stakeInfo,
              lastRewardUpdate: formatChainStringToNumber(
                stakeInfo.lastRewardUpdate
              ),
              stakedValue: formatChainStringToNumber(stakeInfo.stakedValue),
              unclaimedReward: formatChainStringToNumber(
                stakeInfo.unclaimedReward
              ),
            };
          }

          return { ...nftLP, stakeInfo };
        })
      );
      data = nftLPListAddNftInfo;
    } else {
      toast.error(message);
    }

    return data;
  }
);

export const fetchAllTokenPools = createAsyncThunk(
  "allPools/fetchAllTokenPools",
  async (params, thunkAPI) => {
    let data = [];

    const { ret, status, message } = await APICall.getTokenLPList({
      ...params,
    });

    if (status === "OK") {
      const tokenLPListAddNftInfo = await Promise.all(
        ret?.map(async (tokenLP) => {
          // get stake info
          let queryResult = await execContractQuery(
            params?.currentAccount?.address,
            "api",
            lp_pool_contract.CONTRACT_ABI,
            tokenLP?.poolContract,
            0,
            "genericPoolContractTrait::getStakeInfo",
            params?.currentAccount?.address
          );

          let stakeInfo = queryResult?.toHuman().Ok;

          if (stakeInfo) {
            stakeInfo = {
              ...stakeInfo,
              lastRewardUpdate: formatChainStringToNumber(
                stakeInfo.lastRewardUpdate
              ),
              stakedValue: formatChainStringToNumber(stakeInfo.stakedValue),
              unclaimedReward: formatChainStringToNumber(
                stakeInfo.unclaimedReward
              ),
            };
          }

          return { ...tokenLP, stakeInfo };
        })
      );
      data = tokenLPListAddNftInfo;
    } else {
      toast.error(message);
    }

    return data;
  }
);
