import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";

import { execContractQuery } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";
import azt_contract from "utils/contracts/azt_contract";
import { formatQueryResultToNumber } from "utils";
import { getAzeroBalanceOfAddress } from "utils/contracts";
import { formatNumDynDecimal } from "utils";

const localCurrentAccount = window?.localStorage?.getItem(
  "localCurrentAccount"
);

const initialState = {
  api: null,
  allAccounts: [],
  currentAccount: JSON.parse(localCurrentAccount) || null,
  currentExt: []
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload;
    },

    setCurrentApi: (state, action) => {
      state.api = action.payload;
    },

    disconnectCurrentAccount: (state) => {
      state.currentAccount = null;
    },

    updateAccountsList: (state, action) => {
      state.allAccounts = action.payload;

      // if (!action.payload.includes(current(state).currentAccount)) {
      //   state.currentAccount = null;
      // }
    },
    updateExtensions: (state, action) => {
      state.currentExt = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserBalance.fulfilled, (state, action) => {
      state.currentAccount = {
        ...state.currentAccount,
        balance: action.payload,
      };
    });
  },
});

export const {
  setCurrentApi,
  setCurrentAccount,
  updateAccountsList,
  disconnectCurrentAccount,
  updateExtensions,
} = walletSlice.actions;

export default walletSlice.reducer;

export const fetchUserBalance = createAsyncThunk(
  "wallet/fetchUserBalance",
  async ({ currentAccount, api }, thunkAPI) => {
    // TODO: check can fix warning about storing api on redux?
    const inwBalance = await execContractQuery(
      currentAccount?.address,
      //thunkAPI.getState().wallet.api,
      api,
      psp22_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );

    const inw = formatQueryResultToNumber(inwBalance);

    const azeroBalance = await getAzeroBalanceOfAddress({
      api,
      address: currentAccount?.address,
    });

    const azero = formatNumDynDecimal(azeroBalance);
    return { inw, azero };
  }
);

// ,api,psp22_contract.CONTRACT_ABI,azt_contract.CONTRACT_ADDRESS, 0,"psp22::balanceOf"
