import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { formatTokenAmount } from "utils";
import { formatQueryResultToNumberEthers } from "utils";
import { chainDecimals } from "utils";

import { formatNumDynDecimal, formatQueryResultToNumber } from "utils";
import { execContractQuery, getAzeroBalanceOfAddress } from "utils/contracts";
import { psp22_contract } from "utils/contracts";

const localCurrentAccount = window?.localStorage?.getItem(
  "localCurrentAccount"
);

const initialState = {
  api: null,
  allAccounts: [],
  currentAccount: JSON.parse(localCurrentAccount) || null,
  adapter: null,
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
    updateAdapter: (state, action) => {
      state.adapter = action.payload;
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
  updateAdapter,
} = walletSlice.actions;

export default walletSlice.reducer;

export const fetchUserBalance = createAsyncThunk(
  "wallet/fetchUserBalance",
  async ({ currentAccount, api }, thunkAPI) => {
    // TODO: check can fix warning about storing api on redux?
    const inwBalanceQuery = await execContractQuery(
      currentAccount?.address,
      //thunkAPI.getState().wallet.api,
      api,
      psp22_contract.CONTRACT_ABI,
      psp22_contract.CONTRACT_ADDRESS,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );
    const inw2Balance = await execContractQuery(
      currentAccount?.address,
      //thunkAPI.getState().wallet.api,
      api,
      psp22_contract.CONTRACT_ABI,
      psp22_contract.CONTRACT_ADDRESS,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );

    const inw2 = formatQueryResultToNumber(inw2Balance);

    const azeroBalance = await getAzeroBalanceOfAddress({
      api,
      address: currentAccount?.address,
    });

    const azero = formatNumDynDecimal(azeroBalance);
    return {
      inw: formatQueryResultToNumberEthers(
        inwBalanceQuery,
        chainDecimals[process.env.REACT_APP_CHAIN]
      ),
      inw2,
      azero,
    };
  }
);

// ,api,psp22_standard_contract.CONTRACT_ABI,azt_contract.CONTRACT_ADDRESS, 0,"psp22::balanceOf"
